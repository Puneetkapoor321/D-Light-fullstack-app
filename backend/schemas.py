from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class CarBase(BaseModel):
    name: Optional[str] = "Unnamed Car"
    brand: Optional[str] = "Generic"
    color: Optional[str] = "Standard"
    category: Optional[str] = "Sedan"
    price_per_day: Optional[float] = 0.0
    image_url: Optional[str] = None
    transmission: Optional[str] = "Manual"
    fuel_type: Optional[str] = "Petrol"
    seats: Optional[int] = 5
    mileage: Optional[str] = None
    description: Optional[str] = None
    is_available: bool = True
    status: str = "inactive"

class CarCreate(CarBase):
    pass

class CarResponse(CarBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class CarUpdateStatus(BaseModel):
    status: str

class BookingBase(BaseModel):
    customer_name: str
    phone: str
    email: Optional[str] = None
    car_id: Optional[int] = None
    car_name: str
    price_per_day: float
    pickup_date: datetime
    return_date: datetime
    location: str
    total_days: int
    total_price: float

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class BookingUpdateStatus(BaseModel):
    status: str

class SettingsBase(BaseModel):
    phone: str
    whatsapp: str
    address: str

class SettingsResponse(SettingsBase):
    id: int
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class StatsResponse(BaseModel):
    total_cars: int
    total_bookings: int
    pending_bookings: int
    monthly_bookings: int
class RegisterRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    created_at: datetime
    class Config:
        from_attributes = True
