from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from app.schemas import (
    StationCreate, StationUpdate, StationResponse
)
from app.models import Station
from app.services.database import get_db
from math import radians, sin, cos, sqrt, atan2

router = APIRouter()

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in km"""
    R = 6371  # Earth's radius in km
    
    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)
    delta_lat = radians(lat2 - lat1)
    delta_lon = radians(lon2 - lon1)
    
    a = sin(delta_lat / 2) ** 2 + cos(lat1_rad) * cos(lat2_rad) * sin(delta_lon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    
    return R * c

@router.get("/", response_model=List[StationResponse])
async def get_stations(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get all charging stations"""
    stations = db.query(Station).filter(
        Station.is_active == True
    ).offset(skip).limit(limit).all()
    
    return [StationResponse.from_orm(s) for s in stations]

@router.get("/search", response_model=List[StationResponse])
async def search_stations(
    query: str,
    lat: float = Query(None),
    lng: float = Query(None),
    radius: float = Query(10),
    db: Session = Depends(get_db)
):
    """Search stations by name/city or location"""
    stations = db.query(Station).filter(
        Station.is_active == True
    ).all()
    
    # Filter by search query
    if query:
        stations = [
            s for s in stations
            if query.lower() in s.name.lower() or query.lower() in s.city.lower()
        ]
    
    # Filter by proximity if coordinates provided
    if lat is not None and lng is not None:
        filtered_stations = []
        for station in stations:
            distance = haversine_distance(lat, lng, station.latitude, station.longitude)
            if distance <= radius:
                filtered_stations.append((station, distance))
        
        # Sort by distance
        filtered_stations.sort(key=lambda x: x[1])
        stations = [s[0] for s in filtered_stations]
    
    return [StationResponse.from_orm(s) for s in stations[:20]]

@router.get("/nearby", response_model=List[StationResponse])
async def get_nearby_stations(
    lat: float,
    lng: float,
    radius: float = Query(10, description="Search radius in km"),
    db: Session = Depends(get_db)
):
    """Get nearby charging stations"""
    all_stations = db.query(Station).filter(
        Station.is_active == True
    ).all()
    
    nearby_stations = []
    for station in all_stations:
        distance = haversine_distance(lat, lng, station.latitude, station.longitude)
        if distance <= radius:
            nearby_stations.append((station, distance))
    
    # Sort by distance
    nearby_stations.sort(key=lambda x: x[1])
    
    return [StationResponse.from_orm(s[0]) for s in nearby_stations[:20]]

@router.get("/{station_id}", response_model=StationResponse)
async def get_station(station_id: int, db: Session = Depends(get_db)):
    """Get station details"""
    station = db.query(Station).filter(Station.id == station_id).first()
    
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )
    
    return StationResponse.from_orm(station)

@router.get("/{station_id}/availability")
async def get_station_availability(station_id: int, db: Session = Depends(get_db)):
    """Get real-time station availability"""
    station = db.query(Station).filter(Station.id == station_id).first()
    
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )
    
    return {
        "station_id": station.id,
        "total_chargers": station.total_chargers,
        "available_chargers": station.available_chargers,
        "availability_percentage": (station.available_chargers / station.total_chargers) * 100,
        "price_per_kwh": station.price_per_kwh,
        "last_updated": station.updated_at
    }

@router.post("/", response_model=StationResponse)
async def create_station(
    station: StationCreate,
    db: Session = Depends(get_db)
):
    """Create a new charging station (Admin only)"""
    new_station = Station(**station.dict())
    
    db.add(new_station)
    db.commit()
    db.refresh(new_station)
    
    return StationResponse.from_orm(new_station)

@router.put("/{station_id}", response_model=StationResponse)
async def update_station(
    station_id: int,
    station_update: StationUpdate,
    db: Session = Depends(get_db)
):
    """Update station information"""
    station = db.query(Station).filter(Station.id == station_id).first()
    
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )
    
    update_data = station_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(station, key, value)
    
    db.commit()
    db.refresh(station)
    
    return StationResponse.from_orm(station)
