# 🚀 EV Charging Station Platform - Getting Started Guide

## 📋 What We Built

A complete full-stack application for managing EV charging stations with:

- ✅ **Frontend**: React 18 + Next.js 14.2.35 + TypeScript + Tailwind CSS
  - 8 Pages (Home, Stations, Booking, Pricing, Dashboard, Auth)
  - 19 Reusable Components
  - 3 Custom Hooks
  - EV-themed Blue/Green/White Design

- ✅ **Backend**: FastAPI + SQLAlchemy + JWT Auth
  - 25+ API Endpoints
  - 9 Database Models
  - Complete Authentication System
  - Stripe Payment Ready

- ✅ **Infrastructure**: Docker & Docker Compose
  - Containerized deployment
  - One-command setup

- ✅ **Database**: SQLite (Development) / PostgreSQL (Production)
  - Pre-seeded with demo data
  - 8 tables with relationships
  - Real-time availability tracking

---

## 🎯 Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
# Navigate to project root
cd "E:\Projects\Working\EV Charging Station"

# Start all services
docker-compose up --build

# Wait for services to be ready (1-2 minutes)
# Then visit:
# - Frontend: http://localhost:3000
# - Backend Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Create Python environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python seed.py

# Start server
uvicorn app.main:app --reload --port 8000
```

Backend will be running on: `http://localhost:8000`

#### Frontend Setup (in new terminal)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running on: `http://localhost:3000`

---

## 🔐 Demo Credentials

Use these accounts to test the platform:

| Email | Password | Role |
|-------|----------|------|
| john@example.com | password123 | User |
| jane@example.com | password123 | User |

Or create a new account through signup.

---

## 📱 What You Can Do

### As a Regular User

1. **Browse Stations**
   - View all available charging stations
   - Search by location or name
   - See real-time availability

2. **Make Bookings**
   - Select date, time, and charger type
   - See instant price calculation
   - Confirm booking

3. **Manage Account**
   - Update profile information
   - View booking history
   - Save favorite stations
   - View pricing breakdown

4. **Payment**
   - Process bookings with payment
   - Save payment methods
   - Download invoices

### Backend Features

- **User Authentication**
  - Signup/Login with JWT tokens
  - Secure password hashing
  - Profile management

- **Station Management**
  - Search nearby stations
  - Filter by amenities
  - Real-time availability status

- **Booking System**
  - Create/update/cancel bookings
  - Automatic pricing calculation
  - Status tracking

- **Payment Processing**
  - Stripe integration ready
  - Invoice generation
  - Payment history

---

## 📚 API Documentation

### Interactive Documentation

After starting the backend, visit:

```
http://localhost:8000/docs
```

This shows:
- All available endpoints
- Request/response examples
- Try-it-out functionality

### Key Endpoints

```
Authentication:
  POST   /auth/signup
  POST   /auth/login
  GET    /auth/me
  POST   /auth/change-password

Stations:
  GET    /stations                 # List all
  GET    /stations/search          # Search
  GET    /stations/nearby          # Find nearby
  GET    /stations/{id}            # Details
  GET    /stations/{id}/availability  # Real-time

Bookings:
  POST   /bookings                 # Create
  GET    /bookings                 # List user's
  GET    /bookings/{id}            # Details
  PUT    /bookings/{id}            # Update
  DELETE /bookings/{id}            # Cancel

Users:
  GET    /users/profile            # Profile
  PUT    /users/profile            # Update
  GET    /users/favorites          # Favorites
  POST   /users/favorites          # Add favorite

Payments:
  POST   /payments/process         # Process payment
  GET    /payments/invoices        # Invoices
```

---

## 🛠️ Project Structure

```
EV Charging Station/
├── frontend/                    # React/Next.js frontend
│   ├── pages/                   # Route pages
│   ├── components/              # React components
│   ├── services/                # API services
│   ├── hooks/                   # Custom hooks
│   ├── styles/                  # CSS (Tailwind)
│   └── package.json             # Dependencies
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/                 # Route handlers
│   │   ├── models/              # ORM models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   └── main.py              # FastAPI app
│   ├── seed.py                  # Demo data
│   ├── requirements.txt         # Dependencies
│   └── Dockerfile               # Container setup
│
├── docker-compose.yml           # Multi-container
├── PROJECT_DOCUMENTATION.md     # Full docs
└── Documnets/                   # Architecture docs
```

---

## 💻 Development Commands

### Frontend

```bash
cd frontend

# Development with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

### Backend

```bash
cd backend

# Development server (auto-reload)
uvicorn app.main:app --reload

# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Run tests
pytest

# Run with coverage
pytest --cov=app

# Seed database
python seed.py

# Interactive shell
python -m ipython
```

### Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Descriptive message"

# Push to GitHub
git push origin main

# View log
git log --oneline
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in backend directory:

```bash
# Database
DATABASE_URL=sqlite:///./charging_station.db

# Authentication
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Google Maps
GOOGLE_MAPS_API_KEY=your-api-key
```

### Database Configuration

In `backend/app/config.py`, you can switch databases:

```python
# SQLite (default)
DATABASE_URL = "sqlite:///./charging_station.db"

# PostgreSQL
DATABASE_URL = "postgresql://user:password@localhost/ev_charging"

# MySQL
DATABASE_URL = "mysql+pymysql://user:password@localhost/ev_charging"
```

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Specific test file
pytest tests/test_auth.py

# Verbose output
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

---

## 📊 Database

### Seed Data

The `seed.py` script creates:
- 2 demo users
- 4 charging stations
- Sample bookings with pricing
- Station reviews

Run with:
```bash
cd backend
python seed.py
```

### Database Schema

```
users (User accounts)
├── id, email, name, password_hash, phone...
├── Relationships: bookings, payment_methods, favorites

stations (Charging stations)
├── id, name, address, city, latitude, longitude...
├── available_chargers (real-time), price_per_kwh
├── Relationships: bookings, favorites, reviews

bookings (Reservations)
├── id, user_id, station_id, start_time, end_time...
├── duration_minutes, estimated_kwh, total_price, status
├── Relationships: user, station, payment

payments (Transactions)
├── id, booking_id, user_id, amount, status...
├── stripe_payment_id, transaction_id

payment_methods (Saved cards)
├── id, user_id, card_last_four, is_default...

favorites (Bookmarked stations)
├── id, user_id, station_id

reviews (Station ratings)
├── id, user_id, station_id, rating, comment...
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Backend Deployment (Railway/Render/Heroku)

```bash
# Create .env in production with:
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-prod-secret
DEBUG=False

# Deploy
git push heroku main  # If using Heroku
```

### Docker Deployment

```bash
# Build image
docker build -t ev-charging:latest .

# Run container
docker run -p 8000:8000 --env-file .env ev-charging:latest

# Or with docker-compose
docker-compose -f docker-compose.yml up -d
```

---

## 🐛 Troubleshooting

### Frontend Issues

**Issue**: Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

**Issue**: Module not found
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Issue**: Database locked (SQLite)
```bash
# Delete existing database
rm charging_station.db

# Reseed
python seed.py
```

**Issue**: Port 8000 in use
```bash
# Use different port
uvicorn app.main:app --port 8001
```

**Issue**: Import errors
```bash
# Verify virtual environment
which python  # or where python (Windows)

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## 📖 Documentation

| Document | Location | Contents |
|----------|----------|----------|
| **Full Documentation** | `PROJECT_DOCUMENTATION.md` | Complete feature list, API docs, architecture |
| **System Architecture** | `Documnets/SYSTEM_ARCHITECTURE_DETAILED.md` | Architecture diagrams, data flows, security |
| **Frontend README** | `frontend/README.md` | Frontend setup and commands |
| **Backend README** | `backend/README.md` | Backend setup and API endpoints |
| **API Docs** | `http://localhost:8000/docs` | Interactive Swagger documentation |

---

## 🎓 Learning Path

1. **Start Here**: Run `docker-compose up` and explore the UI
2. **User Perspective**: Sign up, browse stations, make a booking
3. **Backend Testing**: Visit `/docs` and test API endpoints
4. **Code Exploration**: 
   - Frontend: Check `pages/stations.tsx` for example
   - Backend: Check `app/api/stations.py` for routing
5. **Customization**: Follow examples to add features
6. **Deployment**: Deploy to production

---

## 🤝 Contributing

To add a feature:

1. Create feature branch
```bash
git checkout -b feature/your-feature-name
```

2. Make changes
3. Test locally
4. Commit with clear message
```bash
git commit -m "Add feature description"
```

5. Push and create pull request
```bash
git push origin feature/your-feature-name
```

---

## 📞 Support

### Resources
- **GitHub**: https://github.com/Pushkarjay/EV-Charging-Station
- **Backend Docs**: http://localhost:8000/docs
- **Frontend Dev**: http://localhost:3000

### Common Questions

**Q: How do I change the database?**
A: Edit `DATABASE_URL` in `backend/app/config.py`

**Q: How do I add a new API endpoint?**
A: Create a route in `backend/app/api/` and include in `main.py`

**Q: How do I customize the theme?**
A: Edit colors in `frontend/tailwind.config.js`

---

## ✅ Completion Checklist

- [x] Frontend built (8 pages, 19 components)
- [x] Backend API created (25+ endpoints)
- [x] Database models (9 models, relationships)
- [x] Authentication system (JWT + bcrypt)
- [x] Payment integration (Stripe ready)
- [x] Docker setup
- [x] Demo data seeding
- [x] Documentation
- [x] Git repository
- [x] GitHub push

---

## 📈 Project Stats

- **Total Files**: 80+
- **Frontend Code**: ~3,500 lines (React/TypeScript)
- **Backend Code**: ~1,500 lines (Python/FastAPI)
- **API Endpoints**: 25+
- **Database Tables**: 8
- **React Components**: 19
- **Custom Hooks**: 3
- **Deployment Ready**: ✅ Yes

---

## 🎉 You're All Set!

Your EV Charging Station platform is ready to use:

1. **Start the application** (Option 1 or 2 from Quick Start)
2. **Visit http://localhost:3000**
3. **Test with demo credentials** (see above)
4. **Explore the features**
5. **Check backend docs** at http://localhost:8000/docs

**Happy coding! 🚀**

---

*Last Updated: December 2024*  
*Version: 1.0.0*  
*Status: Production Ready*
