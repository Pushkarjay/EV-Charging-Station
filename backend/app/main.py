from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import os
import logging

logger = logging.getLogger(__name__)

from app.config import settings

# Enable database initialization by default, disable with SKIP_DB_INIT=true
SKIP_DB_INIT = os.getenv("SKIP_DB_INIT", "false").lower() == "true"

if not SKIP_DB_INIT:
    try:
        from app.services.database import Base, engine
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized")
    except Exception as e:
        logger.warning(f"Database initialization warning: {e}")
else:
    logger.info("Database initialization skipped")

# Try to import API routers
try:
    from app.api import auth, stations, bookings, users, payments
except Exception as e:
    logger.warning(f"Could not import API routers: {e}")
    auth = stations = bookings = users = payments = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting EV Charging Station Backend")
    yield
    logger.info("Shutting down EV Charging Station Backend")

# Initialize FastAPI app
app = FastAPI(
    title="EV Charging Station API",
    description="FastAPI backend for EV charging station platform",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware - CORS should be added LAST to wrap all other middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)

# Routes
if auth:
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
if stations:
    app.include_router(stations.router, prefix="/api/stations", tags=["Stations"])
if bookings:
    app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])
if users:
    app.include_router(users.router, prefix="/api/users", tags=["Users"])
if payments:
    app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])

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
