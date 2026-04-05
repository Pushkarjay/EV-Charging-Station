# Backend API Setup & Configuration

**Version**: 1.0  
**Updated**: April 4, 2026  
**Environment**: Development

## Quick Start Backend

### Start Backend Server
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output**:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Access at: http://localhost:8000

### API Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password

### Stations
- `GET /api/stations/` - Get all active stations
- `GET /api/stations/search` - Search stations by name/city
- `GET /api/stations/nearby` - Get nearby stations

### Bookings
- `GET /api/bookings/` - List user bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Payments
- `GET /api/payments/` - List payments
- `POST /api/payments/` - Create payment
- `GET /api/payments/{id}` - Get payment details

## Database

**Location**: `backend/ev_charging.db` (SQLite)

### Initialize Database
```bash
cd backend
python init_db.py
```

### Seed Demo Data
```bash
cd backend
python seed.py
```

**Demo User**:
- Email: mock@gmail.com
- Password: mockdata1234

**Demo Stations**: 10 Bhubaneswar EV charging stations

## Environment Configuration

### Development Settings (`.env` or `app/config.py`)
```
DEBUG=True
HOST=0.0.0.0
PORT=8000
DATABASE_URL=sqlite:///./ev_charging.db
ALLOWED_ORIGINS=["http://localhost:3000", "http://localhost:3001"]
```

### Default Location (Bhubaneswar, India)
```
DEFAULT_MAP_CENTER_LAT=20.2961
DEFAULT_MAP_CENTER_LNG=85.8245
MAP_SEARCH_RADIUS_KM=15
```

## Common Issues & Solutions

### 1. "Invalid host header" Error
**Issue**: TrustedHostMiddleware rejecting requests  
**Solution**: Already fixed in latest version - middleware order corrected

### 2. "Input should be a valid list" (Amenities)
**Issue**: Database returns string instead of list  
**Solution**: Already fixed - Pydantic validators handle conversion

### 3. CORS Errors from Frontend
**Issue**: Browser blocking cross-origin requests  
**Solution**: Already fixed - CORS middleware properly configured

### 4. Database Locked Error
```bash
# In Python
import os
if os.path.exists('ev_charging.db'):
    os.remove('ev_charging.db')
python init_db.py
python seed.py
```

## Development Workflow

### 1. Start Backend with Auto-Reload
```bash
python -m uvicorn app.main:app --reload
```

### 2. Test Endpoint (PowerShell)
```powershell
(Invoke-WebRequest -Uri "http://localhost:8000/api/stations/" -Method GET).Content | ConvertFrom-Json
```

### 3. Access Swagger Documentation
Open: http://localhost:8000/docs

### 4. Monitor Logs
Backend logs will show in the terminal with:
- Request details
- Database queries
- Errors and warnings

## File Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization & routes
│   ├── config.py            # Configuration & settings
│   ├── api/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── stations.py      # Station endpoints
│   │   ├── bookings.py      # Booking endpoints
│   │   ├── users.py         # User endpoints
│   │   └── payments.py      # Payment endpoints
│   ├── models/
│   │   └── __init__.py      # Database models
│   ├── schemas/
│   │   └── __init__.py      # Pydantic schemas
│   └── services/
│       └── database.py      # Database connection
├── init_db.py               # Database initialization script
├── seed.py                  # Demo data seeding
└── requirements.txt         # Python dependencies
```

## Next Steps

- [ ] Complete end-to-end testing through browser
- [ ] Set up proper production CORS configuration
- [ ] Add authentication middleware tests
- [ ] Configure email notifications (optional)
- [ ] Set up error logging and monitoring
