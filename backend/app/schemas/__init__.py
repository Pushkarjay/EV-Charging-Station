from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Auth schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Station schemas
class StationBase(BaseModel):
    name: str
    address: str
    city: str
    latitude: float
    longitude: float
    total_chargers: int = 1
    charger_types: List[str]
    price_per_kwh: float = 0.30
    operating_hours: str = "24/7"
    amenities: List[str] = []

class StationCreate(StationBase):
    pass

class StationUpdate(BaseModel):
    name: Optional[str] = None
    available_chargers: Optional[int] = None
    rating: Optional[float] = None
    is_active: Optional[bool] = None

class StationResponse(StationBase):
    id: int
    available_chargers: int
    rating: float
    total_reviews: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Booking schemas
class BookingBase(BaseModel):
    station_id: int
    start_time: datetime
    end_time: datetime
    charger_type: str

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class BookingResponse(BookingBase):
    id: int
    user_id: int
    duration_minutes: int
    estimated_kwh: float
    total_price: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Payment schemas
class PaymentMethodBase(BaseModel):
    card_holder_name: str
    card_last_four: str
    card_type: str
    expiry_date: str

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: float
    currency: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Favorite schemas
class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    station_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Review schemas
class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    station_id: int

class ReviewResponse(ReviewBase):
    id: int
    user_id: int
    station_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
