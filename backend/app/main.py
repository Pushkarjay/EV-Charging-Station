from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.services.database import Base, engine
from app.api import auth, stations, bookings, users, payments

# Create tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("✓ Application startup")
    yield
    print("✓ Application shutdown")

# Initialize FastAPI app
app = FastAPI(
    title="EV Charging Station API",
    description="FastAPI backend for EV charging station platform",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(stations.router, prefix="/stations", tags=["Stations"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(payments.router, prefix="/payments", tags=["Payments"])

# Health check
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "EV Charging Station API"
    }

@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to EV Charging Station API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
