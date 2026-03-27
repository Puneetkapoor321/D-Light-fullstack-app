from database import engine, get_db, SessionLocal
import schemas
import models
from fastapi import FastAPI, Depends, HTTPException, status, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()


# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="D - Light Car Rentals API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static uploads folder
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ENV
SECRET_KEY = os.getenv("SECRET_KEY", "dlight_secret_key_for_jwt")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
BASE_URL = os.getenv("BASE_URL", "")

# -------------------- HEALTH --------------------


@app.get("/api/health")
def health_check():
    return {"status": "ok"}

# -------------------- AUTH --------------------


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_token(req: Request):
    token = req.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        if not token:
            raise HTTPException(status_code=401, detail="Token missing")
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# -------------------- STARTUP SEED --------------------


@app.on_event("startup")
def seed_data():
    db = SessionLocal()

    try:
        # Settings
        if db.query(models.Settings).count() == 0:
            db.add(models.Settings(
                phone="+91 8307607971",
                whatsapp="+91 8307607971",
                address="Rohtak, Haryana"
            ))
            db.commit()

        # Cars
        if db.query(models.Car).count() == 0:
            cars_data = [
                {"name": "Swift Top - Black", "color": "Black", "category": "Hatchback", "price_per_day": 1200,
                 "image_url": "https://www.caradvice.in/wp-content/uploads/2025/09/564348Swift-Background.webp"},
                {"name": "Breza Top - White", "color": "White", "category": "SUV", "price_per_day": 1800,
                 "image_url": "https://media.spinny.com/sp-file-system/public/2025-01-03/cf67cf32846d41e185e0787fe5fe5ce4/file.JPG"},
            ]

            for c in cars_data:
                c["status"] = "active"
                db.add(models.Car(**c))

            db.commit()

        # Admin
        if db.query(models.User).count() == 0:
            db.add(models.User(username="admin", password="dlight2024"))
            db.commit()

    finally:
        db.close()

# -------------------- PUBLIC --------------------


@app.get("/api/cars", response_model=List[schemas.CarResponse])
def get_public_cars(db: Session = Depends(get_db)):
    return db.query(models.Car).filter(models.Car.status == "active").all()


@app.get("/api/cars/{car_id}", response_model=schemas.CarResponse)
def get_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    return car


@app.post("/api/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    new_booking = models.Booking(**booking.model_dump())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"id": new_booking.id, "message": "Booking created"}


@app.get("/api/settings", response_model=schemas.SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    return db.query(models.Settings).first()

# -------------------- AUTH ROUTES --------------------


@app.post("/api/register", response_model=schemas.UserResponse)
def register(req: schemas.RegisterRequest, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    user = models.User(username=req.username, password=req.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/api/login")
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == req.username).first()
    if user and user.password == req.password:
        token = create_access_token({"sub": user.username})
        return {"access_token": token, "token_type": "bearer"}

    raise HTTPException(status_code=401, detail="Invalid credentials")

# -------------------- ADMIN --------------------


@app.get("/api/admin/cars", response_model=List[schemas.CarResponse], dependencies=[Depends(verify_token)])
def get_all_cars(db: Session = Depends(get_db)):
    return db.query(models.Car).all()


@app.post("/api/admin/cars/upload", dependencies=[Depends(verify_token)])
async def upload_car_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files allowed")

    filename = f"car_{int(datetime.utcnow().timestamp())}.{file.filename.split('.')[-1]}"
    file_path = f"uploads/{filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {
        "image_url": f"{BASE_URL}/uploads/{filename}" if BASE_URL else f"/uploads/{filename}"
    }


@app.post("/api/admin/cars", response_model=schemas.CarResponse, dependencies=[Depends(verify_token)])
def create_car(car: schemas.CarCreate, db: Session = Depends(get_db)):
    new_car = models.Car(**car.model_dump())
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car


@app.patch("/api/admin/cars/{car_id}/status", response_model=schemas.CarResponse, dependencies=[Depends(verify_token)])
def update_status(car_id: int, status_update: schemas.CarUpdateStatus, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    car.status = status_update.status
    db.commit()
    db.refresh(car)
    return car


@app.delete("/api/admin/cars/{car_id}", dependencies=[Depends(verify_token)])
def delete_car(car_id: int, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")

    db.delete(car)
    db.commit()
    return {"detail": "Car deleted"}
