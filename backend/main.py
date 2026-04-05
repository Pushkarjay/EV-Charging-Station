from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.api import auth, stations, bookings, users, payments
from app.models import Base
from app.services.database import engine

# Create database tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting EV Charging Station Backend")
    yield
    # Shutdown
    print("🛑 Shutting down EV Charging Station Backend")

app = FastAPI(
    title="EV Charging Station API",
    description="RESTful API for EV charging station management",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts
)

# Include routers
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"]
)

app.include_router(
    stations.router,
    prefix="/api/stations",
    tags=["Stations"]
)

app.include_router(
    bookings.router,
    prefix="/api/bookings",
    tags=["Bookings"]
)

app.include_router(
    users.router,
    prefix="/api/users",
    tags=["Users"]
)

app.include_router(
    payments.router,
    prefix="/api/payments",
    tags=["Payments"]
)

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "EV Charging Station API",
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "EV Charging Station API"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
