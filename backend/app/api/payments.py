from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas import PaymentResponse
from app.models import Payment, Booking
from app.services.database import get_db

router = APIRouter()

@router.get("/")
async def get_payment_methods(user_id: int, db: Session = Depends(get_db)):
    """Get user's payment methods"""
    # This would be connected to Stripe API
    return {
        "user_id": user_id,
        "payment_methods": []
    }

@router.post("/")
async def add_payment_method(
    user_id: int,
    payment_details: dict,
    db: Session = Depends(get_db)
):
    """Add a new payment method"""
    # This would integrate with Stripe API
    return {
        "message": "Payment method added successfully",
        "payment_method_id": "pm_12345"
    }

@router.post("/process")
async def process_payment(
    booking_id: int,
    payment_method_id: str,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Process payment for a booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Create payment record
    payment = Payment(
        booking_id=booking_id,
        user_id=user_id,
        amount=booking.total_price,
        currency="USD",
        payment_method="credit_card",
        status="completed"
    )
    
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    return {
        "message": "Payment processed successfully",
        "payment_id": payment.id,
        "amount": payment.amount,
        "status": payment.status
    }

@router.get("/invoices")
async def get_invoices(user_id: int, db: Session = Depends(get_db)):
    """Get user invoices"""
    payments = db.query(Payment).filter(Payment.user_id == user_id).all()
    
    return [
        {
            "id": p.id,
            "booking_id": p.booking_id,
            "amount": p.amount,
            "status": p.status,
            "created_at": p.created_at
        }
        for p in payments
    ]

@router.get("/{payment_id}")
async def get_payment(payment_id: int, db: Session = Depends(get_db)):
    """Get payment details"""
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    return PaymentResponse.from_orm(payment)
