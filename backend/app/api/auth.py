from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.schemas import (
    UserCreate, UserResponse, TokenResponse, LoginRequest
)
from app.models import User
from app.services.database import get_db
from app.services.auth import (
    hash_password, verify_password, create_access_token, decode_token
)
from datetime import timedelta
from typing import Optional

router = APIRouter()

def get_current_user_from_token(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Extract user from JWT token in Authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = payload.get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.post("/signup", response_model=TokenResponse)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": new_user.email, "user_id": new_user.id},
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(new_user)
    }

@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Login user"""
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id},
        expires_delta=timedelta(days=7)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user: User = Depends(get_current_user_from_token)):
    """Get current user profile"""
    return UserResponse.from_orm(current_user)

@router.post("/change-password")
async def change_password(
    data: dict,
    current_user: User = Depends(get_current_user_from_token),
    db: Session = Depends(get_db)
):
    """Change user password"""
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")
    
    if not old_password or not new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password and new password are required"
        )
    
    if not verify_password(old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid current password"
        )
    
    current_user.password_hash = hash_password(new_password)
    db.commit()
    
    return {"message": "Password changed successfully"}

@router.post("/logout")
async def logout():
    """Logout user (client-side token removal)"""
    return {
        "message": "Logged out successfully",
        "status": "success"
    }
    