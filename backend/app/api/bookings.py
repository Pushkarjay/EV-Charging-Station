from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.schemas import (
    BookingCreate, BookingUpdate, BookingResponse
)
from app.models import Booking, Station, User
from app.services.database import get_db
from app.services.email import SMTPEmailService, EmailTemplates, EmailNotificationService
import asyncio

router = APIRouter()

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Create a new booking and send confirmation email"""
    # Verify station exists and has availability
    station = db.query(Station).filter(Station.id == booking.station_id).first()
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )
    
    if station.available_chargers <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No available chargers at this station"
        )
    
    # Get user for email
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Calculate duration and estimated cost
    duration_minutes = int((booking.end_time - booking.start_time).total_seconds() / 60)
    estimated_kwh = (duration_minutes / 60) * 7  # Assume 7kW average
    total_price = estimated_kwh * station.price_per_kwh
    
    # Create booking
    new_booking = Booking(
        user_id=user_id,
        station_id=booking.station_id,
        start_time=booking.start_time,
        end_time=booking.end_time,
        duration_minutes=duration_minutes,
        charger_type=booking.charger_type,
        estimated_kwh=estimated_kwh,
        total_price=total_price,
        status="confirmed"
    )
    
    # Update station availability
    station.available_chargers -= 1
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # Send confirmation email asynchronously
    try:
        email_service = SMTPEmailService()
        subject, html_body, text_body = EmailTemplates.booking_confirmation(
            user_name=user.full_name or user.email,
            station_name=station.name,
            booking_id=str(new_booking.id),
            start_time=new_booking.start_time.strftime("%Y-%m-%d %H:%M"),
            end_time=new_booking.end_time.strftime("%Y-%m-%d %H:%M"),
            total_price=new_booking.total_price,
            confirmation_link=f"https://evcharge.app/booking/{new_booking.id}"
        )
        
        # Send email in background (non-blocking)
        asyncio.create_task(email_service.send_email(
            to=user.email,
            subject=subject,
            html_body=html_body,
            text_body=text_body
        ))
    except Exception as e:
        # Log error but don't fail booking creation if email fails
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send booking confirmation email: {str(e)}")
    
    return BookingResponse.from_orm(new_booking)

@router.get("/", response_model=List[BookingResponse])
async def get_bookings(
    user_id: int = None,
    status_filter: str = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get user bookings"""
    query = db.query(Booking)
    
    if user_id:
        query = query.filter(Booking.user_id == user_id)
    
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    
    bookings = query.offset(skip).limit(limit).all()
    
    return [BookingResponse.from_orm(b) for b in bookings]

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """Get booking details"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    return BookingResponse.from_orm(booking)

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    db: Session = Depends(get_db)
):
    """Update booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    update_data = booking_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(booking, key, value)
    
    db.commit()
    db.refresh(booking)
    
    return BookingResponse.from_orm(booking)

@router.delete("/{booking_id}")
async def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """Cancel a booking and send cancellation email"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    if booking.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel completed booking"
        )
    
    # Get user and station
    user = db.query(User).filter(User.id == booking.user_id).first()
    station = db.query(Station).filter(Station.id == booking.station_id).first()
    
    # Update station availability
    if station:
        station.available_chargers += 1
    
    booking.status = "cancelled"
    db.commit()
    
    # Send cancellation email asynchronously
    try:
        if user and station:
            email_notifier = EmailNotificationService()
            asyncio.create_task(email_notifier.send_booking_cancellation(
                to=user.email,
                user_name=user.full_name or user.email,
                station_name=station.name,
                booking_id=str(booking.id),
                refund_amount=booking.total_price
            ))
    except Exception as e:
        # Log error but don't fail cancellation if email fails
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Failed to send booking cancellation email: {str(e)}")
    
    return {"message": "Booking cancelled successfully"}

@router.get("/history/all")
async def get_booking_history(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get user booking history"""
    bookings = db.query(Booking).filter(
        Booking.user_id == user_id
    ).order_by(Booking.created_at.desc()).all()
    
    return [BookingResponse.from_orm(b) for b in bookings]
