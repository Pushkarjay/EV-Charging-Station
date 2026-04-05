from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.schemas import (
    UserUpdate, UserResponse
)
from app.models import User, Favorite, Station
from app.services.database import get_db
from pydantic import BaseModel

class FavoriteRequest(BaseModel):
    station_id: int

router = APIRouter()

@router.get("/profile", response_model=UserResponse)
async def get_profile(user_id: int = 1, db: Session = Depends(get_db)):
    """Get user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.from_orm(user)

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    profile_update: UserUpdate,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    
    return UserResponse.from_orm(user)

@router.get("/preferences")
async def get_preferences(user_id: int = 1, db: Session = Depends(get_db)):
    """Get user preferences"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "user_id": user.id,
        "email_notifications": True,
        "sms_notifications": False,
        "language": "en",
        "timezone": "UTC"
    }

@router.put("/preferences")
async def update_preferences(
    preferences: dict,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Update user preferences"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "message": "Preferences updated successfully",
        "preferences": preferences
    }

@router.get("/favorites")
async def get_favorite_stations(user_id: int = 1, db: Session = Depends(get_db)):
    """Get user's favorite stations"""
    favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
    station_ids = [f.station_id for f in favorites]
    
    stations = db.query(Station).filter(Station.id.in_(station_ids)).all()
    
    return [{"id": s.id, "name": s.name, "address": s.address} for s in stations]

@router.post("/favorites")
async def add_favorite_station(
    favorite_request: FavoriteRequest,
    user_id: int = Query(1),
    db: Session = Depends(get_db)
):
    """Add station to favorites"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    station = db.query(Station).filter(Station.id == favorite_request.station_id).first()
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )
    
    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.station_id == favorite_request.station_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Station already in favorites"
        )
    
    favorite = Favorite(user_id=user_id, station_id=favorite_request.station_id)
    db.add(favorite)
    db.commit()
    
    return {"message": "Station added to favorites"}

@router.delete("/favorites/{station_id}")
async def remove_favorite_station(
    station_id: int,
    user_id: int = 1,
    db: Session = Depends(get_db)
):
    """Remove station from favorites"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.station_id == station_id
    ).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Station removed from favorites"}
