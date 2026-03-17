# System Architecture

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         End Users                                   │
│              (Web Browser / Mobile Browser)                         │
└────────────────────────────────────────────────────────────────────┘
                                 ↓
┌────────────────────────────────────────────────────────────────────┐
│                    CDN / Web Server                                 │
│                   (Vercel / Netlify)                               │
└────────────────────────────────────────────────────────────────────┘
                                 ↓
┌────────────────────────────────────────────────────────────────────┐
│                    Frontend Application                             │
│                   (React 18 + Next.js)                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Pages: Stations | Booking | Dashboard | Pricing | Auth      │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ Components: StationGrid | BookingForm | ReviewCard         │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ State: useAuth | useFetch | useGeolocation                 │  │
│  ├──────────────────────────────────────────────────────────────┤  │
│  │ Services: authService | stationService | bookingService    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                   ↓ HTTP/REST API Calls ↓
               (CORS enabled, JWT Auth)
                                 ↓
┌────────────────────────────────────────────────────────────────────┐
│                    Backend Application                              │
│                     (FastAPI 0.104+)                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ API Routes:                                                  │  │
│  │ /auth     - User authentication                             │  │
│  │ /stations - Station management & search                     │  │
│  │ /bookings - Reservation management                          │  │
│  │ /users    - Profile & preferences                           │  │
│  │ /payments - Payment processing                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Middleware:                                                   │  │
│  │ • CORS middleware (cross-origin requests)                   │  │
│  │ • TrustedHost middleware (security)                         │  │
│  │ • Error handling middleware                                 │  │
│  │ • Request logging                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Services Layer:                                              │  │
│  │ • auth.py - JWT & password utilities                        │  │
│  │ • database.py - SQLAlchemy ORM setup                        │  │
│  │ • Geolocation calculations                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                   ↓ SQL Queries ↓
            (Parameterized for security)
                                 ↓
┌────────────────────────────────────────────────────────────────────┐
│                      Database Layer                                 │
│               (SQLAlchemy ORM → SQL)                               │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Database Engine Options:                                     │  │
│  │ • SQLite (development / demo)                               │  │
│  │ • PostgreSQL (production recommended)                       │  │
│  │ • MySQL (production alternative)                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Tables:                                                      │  │
│  │ • users          - User accounts                            │  │
│  │ • stations       - Charging stations                        │  │
│  │ • bookings       - Reservations                             │  │
│  │ • payments       - Transactions                             │  │
│  │ • payment_methods - Saved cards                             │  │
│  │ • chargers       - Individual charger units                 │  │
│  │ • favorites      - User bookmarks                           │  │
│  │ • reviews        - Station ratings                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                                 ↓
┌────────────────────────────────────────────────────────────────────┐
│                  External Services                                  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ • Stripe API - Payment processing                           │  │
│  │ • Google Maps API - Location services                       │  │
│  │ • SMTP Server - Email notifications                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### User Registration Flow

```
User Input
    ↓
Frontend Form Validation (React Hook Form)
    ↓
POST /auth/signup {email, name, password}
    ↓
Backend Validation (Pydantic)
    ↓
Check Email Uniqueness (Database Query)
    ↓
Hash Password (bcrypt)
    ↓
Create User Record (INSERT)
    ↓
Generate JWT Token
    ↓
Return {token, user_data}
    ↓
Frontend Stores Token (localStorage)
    ↓
Redirect to Dashboard
```

### Booking Creation Flow

```
User Selects Station
    ↓
User Chooses Date/Time/Charger
    ↓
Frontend Validates Form
    ↓
Calculate Duration & Estimate Cost
    ↓
POST /bookings {user_id, station_id, start_time, end_time, charger_type}
    ↓
Backend Validates Inputs
    ↓
Check Station Availability
    ↓
Calculate kWh: (duration_minutes / 60) × 7
    ↓
Calculate Price: kWh × price_per_kwh
    ↓
Create Booking Record (INSERT)
    ↓
Decrement available_chargers (UPDATE)
    ↓
Return Booking Data
    ↓
Frontend Shows Booking Confirmation
    ↓
Redirect to Payment Page
```

### Payment Processing Flow

```
User Initiates Payment
    ↓
Frontend Sends Booking ID + Payment Method
    ↓
POST /payments/process
    ↓
Backend Validates Booking
    ↓
Calls Stripe API (charge card)
    ↓
Stripe Returns payment_id
    ↓
Create Payment Record (INSERT)
    ↓
Update Booking Status: "confirmed"
    ↓
Return {payment_id, status, confirmation}
    ↓
Frontend Stores Receipt
    ↓
Send Email Confirmation
    ↓
Display Success Message
```

## Component Interaction

### Frontend Component Hierarchy

```
App
├── BaseLayout
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── UserMenu
│   ├── Main Content
│   │   └── Page Component (varies by route)
│   └── Footer
│       ├── Links
│       ├── Social
│       └── Copyright

Pages:
├── HomePage
│   ├── Hero
│   ├── Features
│   ├── CTA
│   └── Testimonials
├── StationsPage
│   ├── SearchBar
│   ├── FilterPanel
│   ├── StationGrid
│   │   └── StationCard[] (repeating)
│   └── StationMap
├── BookingPage
│   ├── StationPicker
│   ├── BookingForm (multi-step)
│   └── PricingBreakdown
├── DashboardPage
│   ├── DashboardStats
│   ├── RecentBookings
│   ├── UsageChart
│   └── AccountSettings
├── LoginPage
│   └── LoginForm
└── SignupPage
    └── SignupForm
```

### Backend Route Handler Hierarchy

```
FastAPI App
├── Middleware
│   ├── CORS
│   ├── TrustedHost
│   └── Error Handler
├── Dependencies
│   ├── get_db() → Session
│   ├── get_current_user() → User
│   └── get_admin_user() → User
└── Routers

/auth Router
├── POST /signup → register user
├── POST /login → authenticate
├── GET /me → current user
├── POST /change-password
└── POST /logout

/stations Router
├── GET / → list all
├── GET /search → search query
├── GET /nearby → geolocation search
├── GET /{id} → details
├── GET /{id}/availability → real-time
├── POST / → create (admin)
└── PUT /{id} → update (admin)

/bookings Router
├── POST / → create
├── GET / → list user's
├── GET /{id} → details
├── PUT /{id} → update
├── DELETE /{id} → cancel
└── GET /history/all → full history

/users Router
├── GET /profile → user data
├── PUT /profile → update
├── GET /preferences → settings
├── PUT /preferences → update settings
├── GET /favorites → saved stations
├── POST /favorites → add favorite
└── DELETE /favorites/{id} → remove

/payments Router
├── GET / → payment methods
├── POST / → add method
├── POST /process → charge card
├── GET /invoices → transaction history
└── GET /{id} → transaction details
```

## Database Relationships

```
User (1) ──────→ (M) Booking
  │                   ↓
  │              (1) Payment
  │                   
  ├──────→ (M) PaymentMethod
  │
  └──────→ (M) Favorite ──→ (1) Station
                                ↓
                           (M) Review
                                ↓
                           (M) Booking
                                ↓
                           (1) Payment

Station ──→ (M) Charger
```

## Security Architecture

### Authentication Flow

```
1. User → POST /auth/login {email, password}
2. Backend:
   a. Query user by email
   b. Verify password: verify_password(input, stored_hash) → boolean
3. If valid:
   a. Create JWT: create_access_token({sub: email, user_id: id})
   b. Return token + user data
4. Frontend:
   a. Store token in localStorage
   b. Add to Authorization header: "Bearer {token}"
5. On protected routes:
   a. Decode JWT: decode_token(token) → payload
   b. Extract user_id
   c. Query user from database
   d. Attach to request context
   e. Proceed if valid, else return 401
```

### Password Security

```
Registration:
  Plain Text Password → bcrypt.hash() → Stored Hash
  Cost factor: 12 (configurable)

Login:
  Input Password + Stored Hash → bcrypt.verify() → True/False
  Bcrypt automatically handles salt
```

### CORS Security

```
Frontend localhost:3000
    ↓ (HTTP Request)
Backend localhost:8000

Backend checks:
  - Origin header matches CORS_ORIGINS list
  - If yes: Set Access-Control-Allow-* headers
  - If no: Request rejected by browser
```

## Scalability Considerations

### Current Setup (Development)
- Single server (Uvicorn)
- SQLite database (local file)
- In-memory session storage
- No caching layer

### Production Recommendations

**Backend**:
- Use Gunicorn + Uvicorn workers (load balancing)
- PostgreSQL database (horizontal scaling)
- Redis for caching & sessions
- CDN for static assets
- Load balancer (Nginx/HAProxy)

**Frontend**:
- Deploy to CDN (Vercel/Netlify)
- Edge caching
- Lazy load routes & components
- Image optimization

**Infrastructure**:
- Containerize with Docker
- Kubernetes for orchestration
- Database replication & backups
- Monitoring & alerting

## Performance Optimization Strategies

### Database
- Index frequently queried columns (email, station_id)
- Eager load relationships to avoid N+1 queries
- Use pagination on list endpoints
- Cache repeated queries (Redis)

### Frontend
- Code splitting by route (Next.js automatic)
- Image optimization (next/image)
- CSS-in-JS with Tailwind (tree-shaking)
- Lazy load heavy components

### Network
- Gzip compression
- HTTP/2 server push
- API response caching
- GraphQL as alternative to REST

---

**Architecture Version**: 1.0  
**Last Updated**: December 2024
