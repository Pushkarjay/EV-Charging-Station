from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List
import os

class Settings(BaseSettings):
    model_config = {"case_sensitive": False}
    # App
    APP_NAME: str = "EV Charging Station API"
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./ev_charging.db"
    )
    
    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "your-secret-key-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
    JWT_ALGORITHM: str = "HS256"
    
    # CORS
    allowed_origins: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:8000",
            "http://localhost",
            "http://127.0.0.1:3000",
            "https://ev-charging-frontend-329478150613.us-central1.run.app",
            "https://ev-charging-frontend-s4upxdiilq-uc.a.run.app",
        ],
        alias="ALLOWED_ORIGINS"
    )
    
    # Trusted Hosts
    allowed_hosts: List[str] = Field(
        default=[
            "localhost",
            "127.0.0.1",
            "localhost:3000",
            "localhost:8000",
            "run.app",
        ],
        alias="ALLOWED_HOSTS"
    )
    
    # Email (Optional)
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    # Payment Gateway (Optional)
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_PUBLIC_KEY: str = os.getenv("STRIPE_PUBLIC_KEY", "")
    
    # Google Maps (Optional)
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    
    # Google Cloud Platform (GCP)
    GOOGLE_PROJECT_ID: str = os.getenv("GOOGLE_PROJECT_ID", "")
    GOOGLE_CREDENTIALS_PATH: str = os.getenv("GOOGLE_CREDENTIALS_PATH", "./credentials/keys/gcp-service-key.json")
    GCP_SERVICE_ACCOUNT: str = os.getenv("GCP_SERVICE_ACCOUNT", "")
    GCP_REGION: str = os.getenv("GCP_REGION", "us-central1")
    GCP_BUCKET_NAME: str = os.getenv("GCP_BUCKET_NAME", "")
    
    # Map Configuration
    DEFAULT_MAP_CENTER_LAT: float = float(os.getenv("DEFAULT_MAP_CENTER_LAT", "28.5355"))
    DEFAULT_MAP_CENTER_LNG: float = float(os.getenv("DEFAULT_MAP_CENTER_LNG", "77.3910"))
    DEFAULT_MAP_ZOOM: int = int(os.getenv("DEFAULT_MAP_ZOOM", "12"))
    MAP_SEARCH_RADIUS_KM: float = float(os.getenv("MAP_SEARCH_RADIUS_KM", "50"))
    
    # Redis (Optional)
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CACHE_ENABLED: bool = os.getenv("CACHE_ENABLED", "true").lower() == "true"

settings = Settings()
