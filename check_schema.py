import sqlite3
import os

db_path = 'data/ev_charging.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # List all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print(f'Tables in database: {[t[0] for t in tables]}')
    
    # Check stations table columns
    cursor.execute("PRAGMA table_info(stations)")
    columns = cursor.fetchall()
    print(f'\nColumns in stations table: {len(columns)}')
    for col in columns:
        print(f'  {col[1]} ({col[2]})')
    conn.close()
else:
    print(f'DB file does not exist: {db_path}')
