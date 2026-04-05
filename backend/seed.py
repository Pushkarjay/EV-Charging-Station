from sqlalchemy.orm import Session
from app.models import User, Station, Booking, Review
from app.services.auth import hash_password
from app.services.database import SessionLocal, engine, Base
from datetime import datetime, timedelta
import random

# Create all tables
Base.metadata.create_all(bind=engine)

def seed_database():
    """Seed database with demo data for Bhubaneswar"""
    db = SessionLocal()
    
    try:
        # Clear existing data
        print("[Clearing] Existing data...")
        db.query(Review).delete()
        db.query(Booking).delete()
        db.query(Station).delete()
        db.query(User).delete()
        db.commit()
        
        # Create mock user for demonstration
        print("[USER] Creating mock user...")
        mock_user = User(
            email="mock@gmail.com",
            name="Mock Demo User",
            phone="+91-9876543210",
            password_hash=hash_password("mockdata1234"),
            is_active=True,
            is_admin=False
        )
        db.add(mock_user)
        
        # Create demo users
        print("[USERS] Creating demo users...")
        demo_users = [
            User(
                email="john@example.com",
                name="John Doe",
                phone="+91-9111111111",
                password_hash=hash_password("password123"),
                is_active=True
            ),
            User(
                email="jane@example.com",
                name="Jane Smith",
                phone="+91-9222222222",
                password_hash=hash_password("password123"),
                is_active=True
            ),
        ]
        db.add_all(demo_users)
        db.commit()
        
        # Bhubaneswar EV Charging Stations
        # Actual locations in Bhubaneswar, Odisha, India
        print("[STATIONS] Creating EV charging stations in Bhubaneswar...")
        
        stations_data = [
            {
                "name": "New Delhi Express - Bhubaneswar Central",
                "address": "Station Square, Bhubaneswar, Odisha 751001",
                "city": "Bhubaneswar",
                "latitude": 20.2961,
                "longitude": 85.8245,
                "chargers": 15,
                "available": 8,
                "price": 0.32,
                "hours": "24/7",
                "amenities": "WiFi, Restaurant, Rest Area, Washroom",
                "phone": "+91-674-2531234",
                "website": "https://newdelhi-express.in/bhubaneswar"
            },
            {
                "name": "Green Energy Hub - Nayapalli",
                "address": "Nayapalli Area, Bhubaneswar, Odisha 751012",
                "city": "Bhubaneswar",
                "latitude": 20.2890,
                "longitude": 85.8210,
                "chargers": 12,
                "available": 5,
                "price": 0.30,
                "hours": "6:00 AM - 10:00 PM",
                "amenities": "WiFi, Cafe, Parking, Washroom",
                "phone": "+91-674-2415678",
                "website": "https://greenenergy.co.in/nayapalli"
            },
            {
                "name": "Eco-Charge Station - Jaydev Vihar",
                "address": "Jaydev Vihar, Bhubaneswar, Odisha 751013",
                "city": "Bhubaneswar",
                "latitude": 20.3089,
                "longitude": 85.8456,
                "chargers": 10,
                "available": 7,
                "price": 0.28,
                "hours": "7:00 AM - 9:00 PM",
                "amenities": "WiFi, Shop, Washroom",
                "phone": "+91-674-2567890",
                "website": "https://ecocharge.in"
            },
            {
                "name": "PowerFast Charging - Satya Nagar",
                "address": "Satya Nagar Circle, Bhubaneswar, Odisha 751007",
                "city": "Bhubaneswar",
                "latitude": 20.2750,
                "longitude": 85.8100,
                "chargers": 20,
                "available": 12,
                "price": 0.35,
                "hours": "24/7",
                "amenities": "Premium WiFi, Restaurant, Lounge, Premium Washroom",
                "phone": "+91-674-2789012",
                "website": "https://powerfast.co.in"
            },
            {
                "name": "Smart Grid Station - Acharya Vihar",
                "address": "Acharya Vihar, Bhubaneswar, Odisha 751014",
                "city": "Bhubaneswar",
                "latitude": 20.3200,
                "longitude": 85.8350,
                "chargers": 14,
                "available": 9,
                "price": 0.31,
                "hours": "5:30 AM - 11:00 PM",
                "amenities": "WiFi, Cafe, Shopping, Washroom",
                "phone": "+91-674-2345678",
                "website": "https://smartgrid.in/acharya"
            },
            {
                "name": "Rapid Charge Hub - Rail Nagar",
                "address": "Rail Nagar, Bhubaneswar, Odisha 751002",
                "city": "Bhubaneswar",
                "latitude": 20.2845,
                "longitude": 85.8678,
                "chargers": 18,
                "available": 11,
                "price": 0.33,
                "hours": "24/7",
                "amenities": "WiFi, Restaurant, Parking, Washroom",
                "phone": "+91-674-2901234",
                "website": "https://rapidcharge.co.in"
            },
            {
                "name": "Pure Volt Station - Saheed Nagar",
                "address": "Saheed Nagar, Bhubaneswar, Odisha 751007",
                "city": "Bhubaneswar",
                "latitude": 20.2650,
                "longitude": 85.8050,
                "chargers": 16,
                "available": 10,
                "price": 0.29,
                "hours": "5:00 AM - 11:30 PM",
                "amenities": "WiFi, Cafe, Shop, Washroom",
                "phone": "+91-674-2234567",
                "website": "https://purevolt.in"
            },
            {
                "name": "ElectroMart Charging - Kharavela Nagar",
                "address": "Kharavela Nagar, Bhubaneswar, Odisha 751001",
                "city": "Bhubaneswar",
                "latitude": 20.3020,
                "longitude": 85.8120,
                "chargers": 22,
                "available": 14,
                "price": 0.34,
                "hours": "24/7",
                "amenities": "Premium WiFi, Restaurant, Lounge, Shopping",
                "phone": "+91-674-2456789",
                "website": "https://electromart.co.in"
            },
            {
                "name": "Quick Charge Point - Chalantika",
                "address": "Chalantika Area, Bhubaneswar, Odisha 751011",
                "city": "Bhubaneswar",
                "latitude": 20.2920,
                "longitude": 85.8400,
                "chargers": 11,
                "available": 6,
                "price": 0.27,
                "hours": "6:00 AM - 10:00 PM",
                "amenities": "WiFi, Parking, Washroom",
                "phone": "+91-674-2567123",
                "website": "https://quickcharge.in"
            },
            {
                "name": "Future Energy Hub - CDA",
                "address": "CDA Plot, Bhubaneswar, Odisha 751002",
                "city": "Bhubaneswar",
                "latitude": 20.3120,
                "longitude": 85.8290,
                "chargers": 13,
                "available": 8,
                "price": 0.32,
                "hours": "24/7",
                "amenities": "WiFi, Premium Cafe, Washroom",
                "phone": "+91-674-2678901",
                "website": "https://futureenergy.co.in"
            },
        ]
        
        stations = []
        for station_data in stations_data:
            station = Station(
                name=station_data["name"],
                address=station_data["address"],
                city=station_data["city"],
                latitude=station_data["latitude"],
                longitude=station_data["longitude"],
                total_chargers=station_data["chargers"],
                available_chargers=station_data["available"],
                price_per_kwh=station_data["price"],
                operating_hours=station_data["hours"],
                charger_types=["CCS", "Type 2", "AC"],
                amenities=station_data["amenities"],
                # phone and website will be added via migration
                rating=round(4.0 + random.uniform(0, 0.9), 1),  # Rating between 4.0 and 4.9
                total_reviews=random.randint(10, 150),
                is_active=True
            )
            stations.append(station)
        
        db.add_all(stations)
        db.commit()
        
        print(f"""
        ✅ Database seeded successfully!
        
        📊 Summary:
        - Mock User: mock@gmail.com (Password: mockdata1234)
        - Demo Users: 2 users created
        - EV Stations: {len(stations)} charging stations in Bhubaneswar
        - Total Chargers: {sum(s.total_chargers for s in stations)}
        
        🗺️ Default Location: Bhubaneswar, India (20.2961°N, 85.8245°E)
        
        Next Steps:
        1. Start the backend server
        2. Go to login page
        3. Login with mock@gmail.com / mockdata1234
        4. View MAP to see all stations in Bhubaneswar
        """)
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Error seeding database: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
