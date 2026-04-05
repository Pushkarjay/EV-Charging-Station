#!/usr/bin/env python
"""Reset database schema"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.database import engine, Base
from app.models import *
import sqlite3

# Remove database file
db_path = 'data/ev_charging.db'
if os.path.exists(db_path):
    os.remove(db_path)
    print(f'[OK] Removed {db_path}')

# Create data directory if needed
os.makedirs('data', exist_ok=True)

# Recreate all tables
print('[OK] Dropping all tables...')
Base.metadata.drop_all(bind=engine)

print('[OK] Creating all tables with new schema...')
Base.metadata.create_all(bind=engine)

# Verify schema
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(stations)")
columns = cursor.fetchall()
print(f'[OK] Stations table has {len(columns)} columns:')
for col in columns:
    print(f'     - {col[1]} ({col[2]})')
conn.close()

print('[SUCCESS] Database reset and schema created successfully!')
