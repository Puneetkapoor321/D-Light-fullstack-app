from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    brand = Column(String, index=True)
    color = Column(String)
    category = Column(String)
    price_per_day = Column(Float)
    image_url = Column(String, nullable=True)
    transmission = Column(String, default="Manual") # Manual / Automatic
    fuel_type = Column(String, default="Petrol") # Petrol / Diesel / Electric
    seats = Column(Integer, default=5)
    mileage = Column(String, nullable=True)
    description = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    # is_active column exists in DB but not used in current logic, 
    # we use 'status' for visibility control
    status = Column(String, default="inactive") # active / inactive
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="car")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    phone = Column(String)
    email = Column(String, nullable=True)
    car_id = Column(Integer, ForeignKey("cars.id"), nullable=True)
    car_name = Column(String)
    price_per_day = Column(Float)
    pickup_date = Column(DateTime)
    return_date = Column(DateTime)
    location = Column(String)
    total_days = Column(Integer)
    total_price = Column(Float)
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    car = relationship("Car", back_populates="bookings")

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String)
    whatsapp = Column(String)
    address = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)  # Note: Store hashed password in production
    created_at = Column(DateTime, default=datetime.utcnow)
