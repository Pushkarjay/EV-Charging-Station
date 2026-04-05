#!/usr/bin/env python3
"""
Database initialization script
Run this to create all database tables
"""

import sys
import logging
from app.services.database import Base, engine
from app.models import User, Station, Charger, Booking, PaymentMethod, Favorite

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_database():
    """Initialize database - create all tables"""
    try:
        logger.info("Initializing database...")
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database initialized successfully!")
        logger.info("✓ All tables created:")
        logger.info("  - users")
        logger.info("  - stations")
        logger.info("  - chargers")
        logger.info("  - bookings")
        logger.info("  - payment_methods")
        logger.info("  - favorites")
        return True
    except Exception as e:
        logger.error(f"✗ Error initializing database: {e}")
        return False

if __name__ == "__main__":
    success = init_database()
    sys.exit(0 if success else 1)
