# DATA FLOW DIAGRAMS

## Smart EV Charging Station Finder & Management Platform

**Date:** March 13, 2026  
**Version:** 1.0

---

## Table of Contents

1. [DFD Level 0 (Context Diagram)](#dfd-level-0-context-diagram)
2. [DFD Level 1 (Main Processes)](#dfd-level-1-main-processes)
3. [DFD Level 2 (Detailed Processes)](#dfd-level-2-detailed-processes)
4. [External Entities](#external-entities)
5. [Data Stores](#data-stores)
6. [Process Descriptions](#process-descriptions)

---

## DFD Level 0 (Context Diagram)

The context diagram represents the entire system as a single bubble, showing interactions with external entities.

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│              Google Maps API                                  │
│         (Location Services)                                   │
│                   │                                           │
│         ┌─────────▼──────────┐                               │
│         │                    │                               │
│  Search Query               │                                │
│  Directions    ◄────────────┤  Routes/Locations             │
│  Geocoding                  │                                │
│         ▲                    │                                │
│         │                    │                                │
│    ┌────┴──────────────────┴──────────────────┐              │
│    │                                          │              │
│    │   Smart EV Charging                     │              │
│    │   Station Platform                      │              │
│    │   (Complete System)                     │              │
│    │                                          │              │
│    └────┬──────────────────┬──────────────────┘              │
│         │                  │                                 │
│         │                  │                                 │
│  ┌──────▼─────────┐  ┌─────▼──────────┐                    │
│  │                │  │                │                    │
│  │ EV Users       │  │ Station Owners │    Dashboard Data  │
│  │ - Search       │  │ - Manage       │◄──────────┬────────│
│  │ - Book         │  │ - Monitor      │           │        │
│  │ - Rate         │  │ - Update       │    System Analytics│
│  │                │  │                │                    │
│  └────────────────┘  └────────────────┘                    │
│         ▲                  ▲                                 │
│         │                  │                                 │
│   Station Info        Availability                          │
│   Recommendations     Statistics                            │
│         │                  │                                 │
│    ┌────┴──────────────────┴──────────────────┐              │
│    │                                          │              │
│    │          Admin Dashboard               │              │
│    │  - Manage Users                        │              │
│    │  - Monitor System                      │              │
│    │  - View Analytics                      │              │
│    │                                          │              │
│    └──────────────────────────────────────────┘              │
│                                                                │
│              ┌─────────────────┐                             │
│              │                 │                             │
│              │ Firebase Auth   │   User Auth Tokens         │
│              │                 │                             │
│              └─────────────────┘                             │
│                      ▲                                       │
│                      │                                       │
│                 Authentication                              │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**External Entities:**
1. **EV Users** - End users searching for charging stations
2. **Station Owners** - Business entities managing stations
3. **Administrators** - Platform managers and support staff
4. **Google Maps API** - External location and routing service
5. **Firebase Auth** - User authentication service
6. **Analytics System** - Reporting and insight generation

---

## DFD Level 1 (Main Processes)

Decomposition of the main system into primary processes.

```
                        EV Users / Station Owners / Admins
                                    │
                    ┌───────────────┼────────────────┐
                    │               │                │
                    ▼               ▼                ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │              │ │              │ │              │
            │ P1: User     │ │ P2: Station  │ │ P3: Analytics│
            │ Management   │ │ Management   │ │ & Reporting  │
            │              │ │              │ │              │
            │ - Register   │ │ - Add Station│ │ - Dashboard  │
            │ - Login      │ │ - Update     │ │ - Reports    │
            │ - Profile    │ │ - Delete     │ │ - Trends     │
            │              │ │              │ │              │
            └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                   │                │               │
                   ▼                ▼               ▼
        ┌─────────────────────────────────────────────────┐
        │          D1: User Database                      │
        │  - user_id, email, password, role, profile     │
        └─────────────────────────────────────────────────┘
                   │                │
                   └────────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │              │ │              │ │              │
    │ P4: Station  │ │ P5: Charging │ │ P6: ML/      │
    │ Discovery    │ │ Session Mgmt  │ │ Prediction   │
    │              │ │              │ │              │
    │ - Search     │ │ - Start      │ │ - Train Model│
    │ - Filter     │ │ - End        │ │ - Predict    │
    │ - Map View   │ │ - History    │ │ - Recommend  │
    │              │ │              │ │              │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │               │
           ▼                ▼               ▼
    ┌──────────────────────────────────────────────────┐
    │    D2: Station/Session Database                 │
    │  - charging_stations, sessions, availability   │
    │  - ratings, amenities, pricing_history         │
    └──────────────────────────────────────────────────┘
           ▲                │               │
           │                │               │
           └────────────────┼───────────────┘
                           │
                ┌──────────▼──────────┐
                │                     │
                │ D3: ML Artifacts   │
                │ - Models           │
                │ - Predictions      │
                │ - Features         │
                │                     │
                └─────────────────────┘
```

**Main Processes:**
1. **P1: User Management** - Authentication and user profile management
2. **P2: Station Management** - CRUD operations for charging stations
3. **P3: Analytics & Reporting** - System-wide analytics and insights
4. **P4: Station Discovery** - Search and recommendation functionality
5. **P5: Charging Session Management** - Session lifecycle management
6. **P6: ML & Prediction** - ML model training and predictions

**Data Stores:**
1. **D1: User Database** - User accounts and authentication
2. **D2: Station/Session Database** - All operational data
3. **D3: ML Artifacts** - Models and predictions

---

## DFD Level 2 (Detailed Processes)

### Detailed: P4 (Station Discovery) Process

```
                        EV User
                          │
            ┌─────────────────────────────┐
            │ Enter Search Criteria:      │
            │ - Location (Lat/Lon)        │
            │ - Radius                    │
            │ - Charging Type             │
            │ - Available Slots           │
            │ - Price Range               │
            └──────────┬──────────────────┘
                       │
                       ▼
          ┌─────────────────────────┐
          │ P4.1: Parse Request     │
          │ - Validate inputs       │
          │ - Extract parameters   │
          └──────┬──────────────────┘
                 │
    ┌────────────┴─────────────┐
    │                          │
    ▼                          ▼
┌──────────────┐        ┌──────────────┐
│ P4.2:        │        │ Google Maps  │
│ Check Redis  │        │ API Call     │
│ Cache        │        │ - Reverse    │
│              │        │   geocoding  │
└──────┬───────┘        │ - Get coords │
       │                │              │
       │Hot Results     └──────┬───────┘
       │(TTL<5min)             │Validated Coords
       │                       │
       └───────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ P4.3: Execute DB Query           │
    │ - Spatial: nearby stations       │
    │ - Filter: type, availability     │
    │ - Join: amenities, ratings       │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ P4.4: Calculate Scores           │
    │ - Distance score                 │
    │ - Availability score             │
    │ - Rating score                   │
    │ - Price score                    │
    │ - User preference boost          │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ P4.5: Sort & Rank Results        │
    │ - Top 20 by composite score      │
    │ - Add details (images, reviews)  │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ P4.6: Cache Results              │
    │ - Store in Redis (5min TTL)      │
    │ - Store in frontend (30min)      │
    └──────┬───────────────────────────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │ Return Ranked Stations           │
    │ - JSON response                  │
    │ - Include: distance, ratings,    │
    │   availability, pricing          │
    └──────┬───────────────────────────┘
           │
           ▼
        EV User
    (Display on Map)
```

### Detailed: P5 (Charging Session Management)

```
User Arrives at Station
        │
        ▼
┌──────────────────────┐
│ P5.1: Start Session  │
│ POST /sessions       │
│ {user_id, station_id}
└─────────┬────────────┘
          │
    ┌─────▼─────┐
    │Validate:  │
    │- User     │
    │- Station  │
    │- Available
    │  slots    │
    └─────┬─────┘
          │
    ┌─────▼──────────────────────┐
    │ P5.2: Create Session       │
    │ - Insert record (DB)       │
    │ - Start time = NOW()       │
    │ - Status = ACTIVE          │
    └─────┬──────────────────────┘
          │
    ┌─────▼──────────────────────┐
    │ P5.3: Update Availability  │
    │ - Decrement available slots│
    │ - Update in DB & Redis     │
    │ - Emit WebSocket event     │
    └─────┬──────────────────────┘
          │
    ┌─────▼──────────────────────┐
    │ P5.4: Log Activity         │
    │ - Create log entry         │
    │ - Cache session in Redis   │
    │ - Send notification        │
    └─────┬──────────────────────┘
          │
          ▼
    Session Active
          │
(Polling every 5 seconds)
          │
    ┌─────▼──────────────────┐
    │ P5.5: Monitor Session  │
    │ - Check battery %      │
    │ - Check elapsed time   │
    │ - Calculate running $  │
    └─────┬──────────────────┘
          │
User Ends Session (App trigger)
          │
    ┌─────▼──────────────────┐
    │ P5.6: End Session      │
    │ PUT /sessions/{id}/end │
    │ {battery_level_end}    │
    └─────┬──────────────────┘
          │
    ┌─────▼──────────────────────────┐
    │ P5.7: Calculate Final Cost     │
    │ - Energy used = Batt% delta    │
    │ - Duration = End - Start       │
    │ - Cost = Kwh × Price           │
    └─────┬──────────────────────────┘
          │
    ┌─────▼──────────────────────────┐
    │ P5.8: Update Records           │
    │ - DB: session_id completed     │
    │ - DB: update cost              │
    │ - Free up availability slot    │
    │ - Remove from Redis cache      │
    └─────┬──────────────────────────┘
          │
    ┌─────▼──────────────────────────┐
    │ P5.9: Trigger Analytics        │
    │ - Update station stats         │
    │ - Update user stats            │
    │ - ML feature update            │
    │ - Recommendation re-ranking    │
    └─────┬──────────────────────────┘
          │
    ┌─────▼──────────────────────────┐
    │ P5.10: Send Confirmation       │
    │ - Email receipt                │
    │ - Push notification            │
    │ - Show bill in app             │
    └─────┬──────────────────────────┘
          │
          ▼
    Session Complete
```

### Detailed: P6 (ML Prediction Pipeline)

```
Scheduled Daily Job (Midnight UTC)
        │
        ▼
┌─────────────────────────────────┐
│ P6.1: Data Extraction           │
│ - Query MySQL (24 months data) │
│ - Load into Pandas DataFrame    │
│ - Shape: (500K rows x 20 cols) │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.2: Data Preprocessing        │
│ - Handle missing values        │
│ - Remove duplicates            │
│ - Normalize features           │
│ - Encode categoricals          │
│ - Outlier detection & removal  │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.3: Feature Engineering       │
│ - Time features: hour, day,    │
│   month, is_holiday            │
│ - Spatial: distance, lat/lon   │
│ - Station: age, type, rating   │
│ - Historical: rolling avgs     │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.4: Load Trained Model        │
│ - Load Random Forest (pickle)  │
│ - Model v1.3 (latest)          │
│ - n_estimators=200             │
│ - max_depth=15                 │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.5: Generate Predictions      │
│ - For each station (100):      │
│   - Predict slots 1-24hrs away │
│   - Predict confidence         │
│   - Predict waiting time       │
│ - Vectorized operations        │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.6: Evaluate Performance      │
│ - Compare with actual values   │
│ - Calculate RMSE, MAE, R²      │
│ - Log metrics                  │
│ - Alert if >= 0.82% drift      │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.7: Store Predictions         │
│ - Insert into MySQL table      │
│ - prediction_timestamp = NOW()  │
│ - Store confidence intervals    │
└─────────┬───────────────────────┘
          │
          ▼
┌─────────────────────────────────┐
│ P6.8: Update Redis Cache        │
│ - Set predictions with TTL     │
│ - Key: "pred:station_{id}"    │
│ - TTL: 24 hours               │
└─────────┬───────────────────────┘
          │
          ▼
Predictions Live
    (Serve via API)
```

---

## External Entities

| Entity | Type | Interactions |
|--------|------|--------------|
| **EV Users** | Actor | Search stations, book sessions, rate reviews, view recommendations |
| **Station Owners** | Actor | Register station, update availability, view analytics, manage pricing |
| **Administrators** | Actor | Manage users, manage stations, view platform analytics |
| **Google Maps API** | External System | Geocoding, reverse geocoding, directions, place details |
| **Firebase Auth** | External System | User authentication, session management, profile storage |
| **Email Service** | External System | Send receipts, notifications, password resets |
| **SMS Gateway** | External System | OTP delivery, important notifications |

---

## Data Stores

### D1: User Database

**Purpose:** Store user accounts, authentication, and profile information

| Table | Rows | Purpose |
|-------|------|---------|
| users | 50K+ | User accounts & authentication |
| user_preferences | 50K+ | User settings & preferences |
| user_sessions | 10K+ | Active sessions (Redis-backed) |
| audit_logs | 1M+ | User activity tracking |

**Data Retention:** 2 years; archive and purge after 5 years

### D2: Station & Session Database

**Purpose:** Store charging infrastructure and operational data

| Table | Rows | Purpose |
|-------|------|---------|
| charging_stations | 500+ | Station master data |
| charging_sessions | 1M+ | Charging transaction history |
| availability_logs | 100M+ | Real-time availability snapshots |
| ratings_reviews | 200K+ | User ratings and feedback |
| station_amenities | 2K | Station amenities mapping |
| pricing_history | 5K | Historical pricing records |

**Data Retention:** 2 years live; archive to cold storage after 2 years

### D3: ML Artifacts Store

**Purpose:** Store ML models, training data, and predictions

| Data | Storage | Format | Retention |
|------|---------|--------|-----------|
| Trained Models | Cloud Storage | Pickle (pkl) | Latest 5 versions |
| Predictions | MySQL | Table | 1 month live, 1 year archive |
| Training Data | Cloud Storage | Parquet | 6 months |
| Features | Materialized View | SQL View | Real-time computed |
| Model Metrics | Cloud SQL | Table | 1 year |

---

## Process Descriptions

### Process: P1 - User Management

**Purpose:** Handle user registration, authentication, and profile management

**Inputs:**
- User registration data (email, password, name, phone)
- Login credentials (email, password)
- Profile update data

**Processing Steps:**
1. Validate email format and uniqueness
2. Hash password using bcrypt (salt rounds: 10)
3. Send email verification link
4. On verification, activate account
5. Generate JWT token upon login
6. Store session in Redis cache (24h TTL)

**Outputs:**
- User account created
- JWT authentication token
- User profile object

**Data Stores Used:** D1 (users, user_preferences)

---

### Process: P2 - Station Management

**Purpose:** Allow station owners to register, update, and manage stations

**Inputs:**
- Station registration (name, address, lat, lon, slots, amenities)
- Station updates (availability, pricing, details)
- Station deletion request

**Processing Steps:**
1. Validate station location (reverse geocoding)
2. Create station record with verification status
3. Admin review and approval
4. Upon approval, make searchable
5. Log all updates to audit trail
6. Broadcast changes via WebSocket

**Outputs:**
- Station record created/updated
- Real-time availability updates
- Analytics refreshed

**Data Stores Used:** D2 (charging_stations, availability_logs)

---

### Process: P4 - Station Discovery

**Purpose:** Help users find nearby charging stations efficiently

**Inputs:**
- Search location (lat, lon or address)
- Search radius (1-50 km)
- Filters (charging type, price, availability)
- User preferences

**Processing Steps:**
1. Check Redis cache for recent searches (p4.2)
2. If cache miss, execute spatial SQL query (p4.3)
3. Retrieve station details and ratings (p4.3)
4. Calculate composite ranking scores (p4.4)
5. Sort by score, return top results (p4.5)
6. Cache results in Redis (5min TTL) (p4.6)

**Outputs:**
- Ranked list of 20 stations
- Distance, ratings, availability, pricing
- ETA and navigation ready

**Data Stores Used:** D2 (stations, sessions, ratings)

---

### Process: P5 - Charging Session Management

**Purpose:** Manage complete lifecycle of charging sessions

**Inputs:**
- Session start (user_id, station_id, battery_level_start)
- Session monitoring (elapsed time, battery percentage)
- Session end (battery_level_end)

**Processing Steps:**
1. Create session record on start (p5.2)
2. Decrement available slots (p5.3)
3. Emit WebSocket event to all clients (p5.3)
4. Monitor session actively (p5.5)
5. Calculate cost upon end (p5.7)
6. Update records and free slots (p5.8)
7. Trigger analytics jobs (p5.9)

**Outputs:**
- Session recorded with cost
- Availability updated
- Analytics refreshed
- User receipt generated

**Data Stores Used:** D2 (charging_sessions, availability_logs, stations)

---

### Process: P6 - ML Prediction Pipeline

**Purpose:** Generate accurate predictions for charging availability

**Inputs:**
- 24 months of historical charging data
- Weather data, events, holidays
- Real-time availability updates

**Processing Steps:**
1. Extract historical data from MySQL (p6.1)
2. Preprocess: clean, normalize, encode (p6.2)
3. Engineer features: temporal, spatial, historical (p6.3)
4. Load trained Random Forest model (p6.4)
5. Generate predictions for 1,4,8,24-hour horizons (p6.5)
6. Evaluate against holdout test set (p6.6)
7. Store predictions in DB (p6.7)
8. Cache in Redis for fast API response (p6.8)

**Outputs:**
- Predictions for each station
- Confidence intervals
- Estimated waiting times
- Model performance metrics

**Data Stores Used:** D2 (ML predictions), D3 (trained models)

---

## Data Dictionary

### Key Data Elements

**charging_station**
- station_id: INT - Unique identifier
- name: VARCHAR(255) - Station name
- latitude: DECIMAL(10,8) - Geographic latitude
- longitude: DECIMAL(11,8) - Geographic longitude
- total_slots: INT - Total charging points
- available_slots: INT - Currently available points
- price_per_kwh: DECIMAL(8,4) - Pricing per kWh

**charging_session**
- session_id: INT - Unique session identifier
- user_id: INT - User reference
- station_id: INT - Station reference
- start_time: DATETIME - Session start
- end_time: DATETIME - Session end
- energy_consumed_kwh: DECIMAL(10,2) - Energy delivered
- cost_paid: DECIMAL(10,2) - Total session cost

**ml_prediction**
- prediction_id: INT - Prediction identifier
- station_id: INT - Target station
- prediction_timestamp: DATETIME - When predicted
- predicted_available_slots: INT - Predicted availability
- confidence_score: DECIMAL(5,4) - Model confidence (0-1)
- prediction_horizon_hours: INT - Hours ahead

---

*End of Data Flow Diagrams Document*
