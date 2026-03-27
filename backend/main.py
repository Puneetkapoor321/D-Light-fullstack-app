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
import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="D - Light Car Rentals API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

SECRET_KEY = os.environ.get("SECRET_KEY", "dlight_secret_key_for_jwt")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(req: Request):
    token = req.headers.get("Authorization", "").replace("Bearer ", "")
    try:
        if not token:
            raise HTTPException(status_code=401, detail="Token missing")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


@app.on_event("startup")
def seed_data():
    models.Base.metadata.create_all(bind=engine)
    db = next(get_db())
    if db.query(models.Settings).count() == 0:
        db.add(models.Settings(phone="+91 98765 43210", whatsapp="+91 98765 43210",
               address="Baba Mastnath University, Gate No. 4"))
        db.commit()

    if db.query(models.Car).count() == 0:
        cars_data = [
            {"name": "Swift Top - Black Colour", "color": "Black", "category": "Hatchback", "price_per_day": 1200,
                "image_url": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=800"},
            {"name": "Breza Top - White colour", "color": "White", "category": "SUV", "price_per_day": 1800,
                "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800"},
            {"name": "Nexon Top - Grey Colour", "color": "Grey", "category": "Coupe", "price_per_day": 1900,
                "image_url": "https://images.unsplash.com/photo-1503376712344-91e845f3c051?q=80&w=800"},
            {"name": "Scorpio N Z6 Select - White colour", "color": "White", "category": "Premium SUV",
                "price_per_day": 2800, "image_url": "https://images.unsplash.com/photo-1629897148566-dfaeefbc8690?q=80&w=800"},
            {"name": "Fronx. - Black Colour", "color": "Black", "category": "Electric", "price_per_day": 1600,
                "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800"},
            {"name": "Thar - Black Colour", "color": "Black", "category": "Vans", "price_per_day": 2200,
                "image_url": "https://images.unsplash.com/photo-1588612143491-b3b0dfb22108?q=80&w=800"}
        ]
        for c in cars_data:
            c["status"] = "active"  # Seed cars should be active
            db.add(models.Car(**c))
        db.commit()

    if db.query(models.User).count() == 0:
        # Default user: admin / dlight2024
        db.add(models.User(username="admin", password="dlight2024"))
        db.commit()

# --- Public Routes ---


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

# --- Admin Routes ---


# --- Auth Routes ---

@app.post("/api/register", response_model=schemas.UserResponse)
def register(req: schemas.RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.username == req.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = models.User(username=req.username, password=req.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/api/login")
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == req.username).first()
    if user and user.password == req.password:
        token = create_access_token({"sub": user.username})
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.delete("/api/admin/delete-account", dependencies=[Depends(verify_token)])
def delete_account(req: Request, db: Session = Depends(get_db)):
    payload = verify_token(req)
    username = payload.get("sub")
    user = db.query(models.User).filter(
        models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "Account deleted successfully"}


@app.get("/api/admin/cars", response_model=List[schemas.CarResponse], dependencies=[Depends(verify_token)])
def get_all_cars(db: Session = Depends(get_db)):
    return db.query(models.Car).all()


@app.post("/api/admin/cars/upload", dependencies=[Depends(verify_token)])
async def upload_car_image(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only images allowed.")

    # Create filename
    ext = file.filename.split(".")[-1]
    filename = f"car_{int(datetime.utcnow().timestamp())}.{ext}"
    file_path = f"uploads/{filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return {"image_url": f"/uploads/{filename}"}


@app.patch("/api/admin/cars/{car_id}/status", response_model=schemas.CarResponse, dependencies=[Depends(verify_token)])
@app.put("/api/admin/cars/{car_id}/status", response_model=schemas.CarResponse, dependencies=[Depends(verify_token)])
def update_car_status(car_id: int, status_update: schemas.CarUpdateStatus, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    car.status = status_update.status
    db.commit()
    db.refresh(car)
    return car


@app.post("/api/admin/cars", response_model=schemas.CarResponse, dependencies=[Depends(verify_token)])
def create_car(car: schemas.CarCreate, db: Session = Depends(get_db)):
    new_car = models.Car(**car.model_dump())
    db.add(new_car)
    db.commit()
    db.refresh(new_car)
    return new_car


@app.put("/api/admin/cars/{car_id}", response_model=schemas.CarResponse, dependencies=[Depends(verify_token)])
def update_car(car_id: int, car_update: schemas.CarCreate, db: Session = Depends(get_db)):
    car = db.query(models.Car).filter(models.Car.id == car_id).first()
    if not car:
        raise HTTPException(status_code=404, detail="Car not found")
    for key, value in car_update.model_dump().items():
        setattr(car, key, value)
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


@app.get("/api/admin/bookings", response_model=List[schemas.BookingResponse], dependencies=[Depends(verify_token)])
def get_all_bookings(db: Session = Depends(get_db)):
    return db.query(models.Booking).order_by(models.Booking.created_at.desc()).all()


def mock_send_whatsapp(phone: str, message: str):
    print(f"--- WHATSAPP NOTIFICATION SENT TO {phone} ---")
    print(f"MESSAGE: {message}")
    print("------------------------------------------")


@app.patch("/api/admin/bookings/{booking_id}/status", response_model=schemas.BookingResponse, dependencies=[Depends(verify_token)])
@app.put("/api/admin/bookings/{booking_id}/status", response_model=schemas.BookingResponse, dependencies=[Depends(verify_token)])
def update_booking_status(booking_id: int, status_update: schemas.BookingUpdateStatus, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    old_status = booking.status
    booking.status = status_update.status
    db.commit()
    db.refresh(booking)

    # WhatsApp Notification Simulation
    if booking.status != old_status:
        status_emoji = "✅ APPROVED" if booking.status == "approved" else "❌ REJECTED"
        msg = f"Your booking for {booking.car_name} is {status_emoji}. Thank you for choosing D-LIGHT!"
        mock_send_whatsapp(booking.phone, msg)

    return booking


@app.delete("/api/admin/bookings/{booking_id}", dependencies=[Depends(verify_token)])
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(
        models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    db.delete(booking)
    db.commit()
    return {"detail": "Booking deleted successfully"}


@app.get("/api/admin/stats", response_model=schemas.StatsResponse, dependencies=[Depends(verify_token)])
def get_stats(db: Session = Depends(get_db)):
    total_cars = db.query(models.Car).count()
    total_bookings = db.query(models.Booking).count()
    pending_bookings = db.query(models.Booking).filter(
        models.Booking.status == "pending").count()

    current_month = datetime.utcnow().month
    current_year = datetime.utcnow().year
    # Simple Python filtering for monthly count due to sqlite date functions complexity
    all_bookings = db.query(models.Booking.created_at).all()
    monthly_bookings = sum(
        1 for b in all_bookings if b[0] and b[0].month == current_month and b[0].year == current_year)

    return {
        "total_cars": total_cars,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "monthly_bookings": monthly_bookings
    }


@app.patch("/api/admin/settings", response_model=schemas.SettingsResponse, dependencies=[Depends(verify_token)])
def update_settings(settings_update: schemas.SettingsBase, db: Session = Depends(get_db)):
    settings = db.query(models.Settings).first()
    if not settings:
        settings = models.Settings(**settings_update.model_dump())
        db.add(settings)
    else:
        for key, value in settings_update.model_dump().items():
            setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings
