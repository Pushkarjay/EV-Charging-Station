
"""
Minimal backend API for EV Charging Station
Only provides health check endpoints
Database and advanced features disabled for Cloud Run
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(
    title="EV Charging Station API - Minimal",
    version="1.0.0",
    description="Simple health check API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to EV Charging Station API",
        "version": "1.0.0",
        "status": "minimal mode - features disabled",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "EV Charging Station API",
        "mode": "minimal"
    }

@app.get("/docs", tags=["Documentation"])
async def docs_redirect():
    """Documentation endpoint"""
    return {
        "docs": "/docs",
        "openapi": "/docs",
        "message": "Full API documentation available at /docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        log_level="info"
    )
