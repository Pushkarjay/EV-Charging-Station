"""
Manual database migration to add phone and website columns
Run this script to update your database
"""
import sqlite3
import os

db_path = 'data/ev_charging.db'

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("[1] Checking if phone column exists...")
    try:
        cursor.execute("SELECT phone FROM stations LIMIT 1")
        print("     ✓ Phone column already exists")
    except sqlite3.OperationalError:
        print("     ✗ Adding phone column...")
        cursor.execute("ALTER TABLE stations ADD COLUMN phone VARCHAR")
        print("     ✓ Phone column added")
    
    print("[2] Checking if website column exists...")
    try:
        cursor.execute("SELECT website FROM stations LIMIT 1")
        print("     ✓ Website column already exists")
    except sqlite3.OperationalError:
        print("     ✗ Adding website column...")
        cursor.execute("ALTER TABLE stations ADD COLUMN website VARCHAR")
        print("     ✓ Website column added")
    
    conn.commit()
    
    print("[3] Updating station data with phone and website...")
    stations_data = [
        (1, "+91-674-2531234", "https://newdelhi-express.in/bhubaneswar"),
        (2, "+91-674-2415678", "https://greenenergy.co.in/nayapalli"),
        (3, "+91-674-2567890", "https://ecocharge.in"),
        (4, "+91-674-2789012", "https://powerfast.co.in"),
        (5, "+91-674-2345678", "https://smartgrid.in/acharya"),
        (6, "+91-674-2901234", "https://rapidcharge.co.in"),
        (7, "+91-674-2234567", "https://purevolt.in"),
        (8, "+91-674-2456789", "https://electromart.co.in"),
        (9, "+91-674-2567123", "https://quickcharge.in"),
        (10, "+91-674-2678901", "https://futureenergy.co.in"),
    ]
    
    for station_id, phone, website in stations_data:
        cursor.execute(
            "UPDATE stations SET phone = ?, website = ? WHERE id = ?",
            (phone, website, station_id)
        )
    
    conn.commit()
    print("     ✓ Data updated successfully")
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM stations WHERE phone IS NOT NULL")
    count = cursor.fetchone()[0]
    print(f"[4] Verification: {count}/10 stations have phone numbers")
    
    conn.close()
    print("\n[SUCCESS] Migration complete!")
else:
    print(f"ERROR: Database file not found at {db_path}")
