from sqlalchemy.orm import Session
from app.models import User, Station, Booking, Review
from app.services.auth import hash_password
from app.services.database import SessionLocal, engine, Base
from datetime import datetime, timedelta

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_database():
    """Seed database with demo data"""
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Review).delete()
        db.query(Booking).delete()
        db.query(Station).delete()
        db.query(User).delete()
        db.commit()
        
        # Create demo users
        users = [
            User(
                email="john@example.com",
                name="John Doe",
                phone="+1234567890",
                password_hash=hash_password("password123"),
                is_active=True
            ),
            User(
                email="jane@example.com",
                name="Jane Smith",
                phone="+1987654321",
                password_hash=hash_password("password123"),
                is_active=True
            ),
        ]
        db.add_all(users)
        db.commit()
        
        # Create demo stations
        stations = [
            Station(
                name="Downtown Charging Hub",
                address="123 Main St, New York, NY 10001",
                city="New York",
                latitude=40.7128,
                longitude=-74.0060,
                total_chargers=8,
                available_chargers=5,
                price_per_kwh=0.35,
                opening_time="06:00",
                closing_time="22:00",
                amenities="WiFi, Cafe, Restrooms",
                is_active=True
            ),
            Station(
                name="Airport Express Station",
                address="456 Airport Blvd, Los Angeles, CA 90001",
                city="Los Angeles",
                latitude=34.0522,
                longitude=-118.2437,
                total_chargers=12,
                available_chargers=8,
                price_per_kwh=0.40,
                opening_time="24/7",
                closing_time="23:59",
                amenities="Restaurant, Shops, Lounge",
                is_active=True
            ),
            Station(
                name="Harbor View Charging",
                address="789 Harbor St, San Francisco, CA 94111",
                city="San Francisco",
                latitude=37.7749,
                longitude=-122.4194,
                total_chargers=6,
                available_chargers=3,
                price_per_kwh=0.45,
                opening_time="07:00",
                closing_time="21:00",
                amenities="WiFi, Shop",
                is_active=True
            ),
            Station(
                name="Tech Park Station",
                address="321 Tech Circle, Austin, TX 78701",
                city="Austin",
                latitude=30.2672,
                longitude=-97.7431,
                total_chargers=10,
                available_chargers=7,
                price_per_kwh=0.32,
                opening_time="05:00",
                closing_time="23:00",
                amenities="WiFi, Gym, Cafe",
                is_active=True
            ),
        ]
        db.add_all(stations)
        db.commit()
        
        # Create demo bookings
        now = datetime.utcnow()
        bookings = [
            Booking(
                user_id=users[0].id,
                station_id=stations[0].id,
                start_time=now + timedelta(days=1),
                end_time=now + timedelta(days=1, hours=2),
                duration_minutes=120,
                charger_type="DC_FAST",
                estimated_kwh=14.0,
                total_price=4.90,
                status="confirmed"
            ),
            Booking(
                user_id=users[1].id,
                station_id=stations[1].id,
                start_time=now + timedelta(days=2),
                end_time=now + timedelta(days=2, hours=1),
                duration_minutes=60,
                charger_type="AC_LEVEL_2",
                estimated_kwh=7.0,
                total_price=2.80,
                status="confirmed"
            ),
        ]
        db.add_all(bookings)
        db.commit()
        
        # Create demo reviews
        reviews = [
            Review(
                user_id=users[0].id,
                station_id=stations[0].id,
                rating=5,
                comment="Amazing charging station! Fast service and great amenities."
            ),
            Review(
                user_id=users[1].id,
                station_id=stations[1].id,
                rating=4,
                comment="Good experience. Chargers were well maintained."
            ),
        ]
        db.add_all(reviews)
        db.commit()
        
        print("✓ Database seeded successfully!")
        print(f"✓ Created {len(users)} users")
        print(f"✓ Created {len(stations)} charging stations")
        print(f"✓ Created {len(bookings)} demo bookings")
        print(f"✓ Created {len(reviews)} reviews")
        
    except Exception as e:
        print(f"✗ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
