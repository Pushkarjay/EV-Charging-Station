#!/usr/bin/env python
import requests

try:
    response = requests.get('http://localhost:8000/api/stations/', headers={'Origin': 'http://localhost:3000'}, timeout=5)
    print(f"✓ Backend Status: {response.status_code}")
    print(f"✓ CORS Header: {response.headers.get('Access-Control-Allow-Origin', 'NOT SET')}")
    data = response.json()
    if isinstance(data, list):
        print(f"✓ Stations Count: {len(data)}")
        if data:
            print(f"✓ First Station: {data[0].get('name', 'Unknown')}")
    else:
        print(f"Response: {data}")
except Exception as e:
    print(f"✗ Error: {e}")
