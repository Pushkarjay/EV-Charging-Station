# DATABASE SCHEMA & DESIGN

## Smart EV Charging Station Finder & Management Platform

**Date:** March 13, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Entity Relationship Diagram](#entity-relationship-diagram)
2. [Database Tables](#database-tables)
3. [Indexes & Performance](#indexes--performance)
4. [Data Relationships](#data-relationships)
5. [Constraints & Validations](#constraints--validations)
6. [Data Retention Policy](#data-retention-policy)

---

## Entity Relationship Diagram

### Conceptual ERD (Text Representation)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│               USERS                    CHARGING_STATIONS                   │
│         ┌─────────────────┐                ┌──────────────────┐            │
│         │ PK: user_id     │◄──────1────┬───│PK: station_id    │            │
│         │ email           │     owns   │   │ name             │            │
│         │ phone_number    │            │   │ latitude         │            │
│         │ password_hash   │            │   │ longitude        │            │
│         │ first_name      │            │   │ total_slots      │            │
│         │ role            │            │   │ available_slots  │            │
│         │ created_at      │            │   │ price_per_kwh    │            │
│         │ is_verified     │            │   │ owner_id (FK)    │            │
│         └────────────┬────┘            │   │ is_active        │            │
│                      │                 │   └────────┬─────────┘            │
│                      │                 │            │                      │
│              ┌───────┴──────┐          │   ┌────────┴─────────┐           │
│              │              │          │   │                  │           │
│           1─◇ many        many─◇ 1     │   many              many         │
│              │              │          │   │                  │           │
│         CHARGING_SESSIONS   USER_PREF  │   AVAILABILITY_LOGS │           │
│         ┌─────────────────┐ ┌────────┐│   ┌──────────────────┐           │
│         │ PK: session_id  │ │ PK:    ││   │ PK: log_id       │           │
│         │ user_id (FK)    │ │  user_id││   │ station_id (FK)  │           │
│         │ station_id (FK) │ │ FK)    ││   │ timestamp        │           │
│         │ start_time      │ │ pref   ││   │ available_slots  │           │
│         │ end_time        │ │ distanc││   │ occupancy_rate   │           │
│         │ energy_consumed │ │ e_km   ││   └──────────────────┘           │
│         │ cost_paid       │ │ chg_sp ││                                   │
│         │ status          │ │ eed    ││   RATINGS_REVIEWS               │
│         └─────────────────┘ │        ││   ┌──────────────────┐           │
│                              │        ││   │ PK: review_id    │           │
│         STATION_AMENITIES    │price   ││   │ user_id (FK)     │           │
│         ┌─────────────────┐  │_sens  ││   │ station_id (FK)  │           │
│         │ PK: amenity_id  │  │itivity││   │ session_id (FK)  │           │
│         │ station_id (FK) │ ││ pref  ││   │ rating (1-5)     │           │
│         │ amenity_type    │  │ list  ││   │ review_text      │           │
│         │ available       │  └────────┤   │ created_at       │           │
│         └─────────────────┘           │   └──────────────────┘           │
│                                        │                                  │
│         PRICING_HISTORY                │   ML_MODEL_PREDICTIONS          │
│         ┌─────────────────┐            │   ┌──────────────────┐           │
│         │ PK: pricing_id  │            │   │ PK: prediction_id│           │
│         │ station_id (FK) │◄───────────┤   │ station_id (FK)  │           │
│         │ price_per_kwh   │ many       │   │ pred_timestamp   │           │
│         │ connection_fee  │─────┐      │   │ predicted_slots  │           │
│         │ effective_from  │     │      │   │ confidence       │           │
│         │ effective_to    │     │      │   │ model_version    │           │
│         └─────────────────┘     │      │   └──────────────────┘           │
│                               1 │      │                                  │
│                                 │      └──────────────────────────────────│
│                                 │                                        │
│                                 └────────────────────────────────────────│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

KEY:
    PK = Primary Key
    FK = Foreign Key
    ◇ = Optional relationship
    — = Mandatory relationship
```

### Simplified ERD (Core Entities)

```
     USERS              CHARGING_STATIONS        CHARGING_SESSIONS
     ─────              ──────────────────       ──────────────────
      │ 1                        │ 1                     │ *
      │ owns                     │ has                   │
      ◄────                      ◄─ ────                 │
      │ *                        │ *                     │
      │                          │                       │
      │                  AVAILABILITY_LOGS        RATINGS_REVIEWS
      │                  ──────────────────       ──────────────────
      │                           │                      │
      │      (User views)         │ (Session creates)   │
      └────────────────────────────┼──────────────────────┘
```

---

## Database Tables

### 1. USERS Table

**Purpose:** Store user account information and authentication data

```sql
CREATE TABLE users (
    -- Primary Key
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Authentication
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- bcrypt hash
    
    -- Profile Information
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    profile_picture_url VARCHAR(500),
    
    -- Account Management
    role ENUM('EV_USER', 'STATION_OWNER', 'ADMIN', 'DATA_SCIENTIST') 
         DEFAULT 'EV_USER',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,  -- Email verified
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Indexes
    UNIQUE INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Constraints:**
- email: Must be unique, valid email format
- password_hash: Never NULL, bcrypt format
- phone_number: International format (optional)

---

### 2. CHARGING_STATIONS Table

**Purpose:** Store charging station master data

```sql
CREATE TABLE charging_stations (
    -- Primary Key
    station_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Ownership
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Station Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(500) NOT NULL,
    zip_code VARCHAR(20),
    district VARCHAR(100),
    state VARCHAR(100),
    
    -- Location (Geospatial)
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    -- Infrastructure
    total_slots INT NOT NULL CHECK(total_slots > 0),
    available_slots INT DEFAULT 0 CHECK(available_slots >= 0),
    charging_types VARCHAR(255),  -- JSON: ["AC_L1", "DC_FAST", "TESLA"]
    
    -- Station Details
    amenities JSON,  -- {parking: true, wifi: true, restroom: true, cafe: false}
    average_rating DECIMAL(3, 2) DEFAULT 0 CHECK(average_rating BETWEEN 0 AND 5),
    
    -- Contact Information
    phone_number VARCHAR(20),
    website_url VARCHAR(500),
    operating_hours VARCHAR(255),  -- "MON-FRI: 6AM-10PM, SAT-SUN: 7AM-9PM"
    
    -- Status Management
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,  -- Admin approval required
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes (Performance Critical)
    SPATIAL INDEX idx_location (POINT(latitude, longitude)),
    INDEX idx_owner_id (owner_id),
    INDEX idx_active (is_active),
    INDEX idx_verified (is_verified),
    INDEX idx_district (district),
    INDEX idx_rating (average_rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Constraints:**
- owner_id: Must reference valid user with STATION_OWNER role
- total_slots: Must be > 0
- available_slots: Cannot exceed total_slots (check in app)
- latitude/longitude: Valid geographic coordinates
- average_rating: 0-5 scale

---

### 3. CHARGING_SESSIONS Table

**Purpose:** Store charging transaction history

```sql
CREATE TABLE charging_sessions (
    -- Primary Key
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Keys
    user_id INT NOT NULL,
    station_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- Session Timeline
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    duration_minutes INT,
    
    -- Charging Details
    battery_level_start DECIMAL(5, 2),  -- 0-100%
    battery_level_end DECIMAL(5, 2),    -- 0-100%
    energy_consumed_kwh DECIMAL(10, 2),
    charging_speed VARCHAR(50),  -- "SLOW", "STANDARD", "FAST"
    
    -- Payment Information
    cost_paid DECIMAL(10, 2),
    payment_method VARCHAR(50),  -- "CARD", "UPI", "WALLET"
    
    -- Status
    session_status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes (Query Performance)
    INDEX idx_user_id (user_id),
    INDEX idx_station_id (station_id),
    INDEX idx_start_time (start_time),
    INDEX idx_status (session_status),
    INDEX idx_created_at (created_at),
    COMPOSITE INDEX idx_user_time (user_id, start_time),
    COMPOSITE INDEX idx_station_time (station_id, start_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Constraints:**
- session_status: Only valid enum values
- battery_level: 0-100 range
- energy_consumed_kwh: Must be positive

---

### 4. AVAILABILITY_LOGS Table

**Purpose:** Store real-time and historical availability snapshots

```sql
CREATE TABLE availability_logs (
    -- Primary Key
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key
    station_id INT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Timestamp
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Availability Data
    available_slots INT NOT NULL CHECK(available_slots >= 0),
    total_slots INT NOT NULL,
    occupancy_rate DECIMAL(5, 2),  -- 0-100%
    
    -- Context Information
    weather_condition VARCHAR(50),  -- "SUNNY", "RAINY", "CLOUDY", "SNOWY"
    temperature_celsius DECIMAL(5, 2),
    is_peak_hour BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes (Time-series queries)
    COMPOSITE INDEX idx_station_time (station_id, timestamp),
    INDEX idx_timestamp (timestamp),
    INDEX idx_peak_hour (is_peak_hour),
    INDEX idx_occupancy (occupancy_rate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Partition by timestamp for large table optimization
ALTER TABLE availability_logs 
PARTITION BY RANGE (YEAR(timestamp)) (
    PARTITION p_2024 VALUES LESS THAN (2025),
    PARTITION p_2025 VALUES LESS THAN (2026),
    PARTITION p_2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

**Constraints:**
- timestamp: Must be recent (within 24 hours or so)
- occupancy_rate: 0-100%

---

### 5. RATINGS_REVIEWS Table

**Purpose:** Store user ratings and reviews for stations

```sql
CREATE TABLE ratings_reviews (
    -- Primary Key
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Keys
    user_id INT NOT NULL,
    station_id INT NOT NULL,
    session_id INT,  -- Optional: reference actual session
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (session_id) REFERENCES charging_sessions(session_id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    
    -- Review Content
    rating INT NOT NULL CHECK(rating BETWEEN 1 AND 5),
    review_text TEXT,
    
    -- Detailed Ratings
    cleanliness_rating INT CHECK(cleanliness_rating BETWEEN 1 AND 5),
    amenities_rating INT CHECK(amenities_rating BETWEEN 1 AND 5),
    service_rating INT CHECK(service_rating BETWEEN 1 AND 5),
    
    -- Verification & Engagement
    is_verified_session BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_station_rating (station_id, rating),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_helpful (helpful_count),
    COMPOSITE INDEX idx_station_verified (station_id, is_verified_session)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Constraints:**
- One review per user per session (enforced in app)
- Reviews cannot be older than 30 days (soft validation)

---

### 6. STATION_AMENITIES Table

**Purpose:** Mapping table for station amenities

```sql
CREATE TABLE station_amenities (
    -- Primary Key
    amenity_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key
    station_id INT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Amenity Information
    amenity_type VARCHAR(100) NOT NULL,  -- "PARKING", "WIFI", "RESTROOM"
    amenity_description TEXT,
    available BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_station_id (station_id),
    INDEX idx_amenity_type (amenity_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 7. PRICING_HISTORY Table

**Purpose:** Track pricing changes over time

```sql
CREATE TABLE pricing_history (
    -- Primary Key
    pricing_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key
    station_id INT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Pricing Information
    price_per_kwh DECIMAL(8, 4) NOT NULL,
    connection_fee DECIMAL(8, 2) DEFAULT 0,
    off_peak_discount DECIMAL(5, 2),  -- Percentage (0-100)
    
    -- Effective Period
    effective_from DATETIME NOT NULL,
    effective_to DATETIME,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    COMPOSITE INDEX idx_station_date (station_id, effective_from),
    INDEX idx_effective_period (effective_from, effective_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 8. USER_PREFERENCES Table

**Purpose:** Store user preferences and personalization data

```sql
CREATE TABLE user_preferences (
    -- Primary Key
    preference_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key (1:1 relationship)
    user_id INT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Preferences
    preferred_charging_speed VARCHAR(50),  -- "SLOW", "STANDARD", "FAST"
    preferred_distance_km INT DEFAULT 5 CHECK(preferred_distance_km BETWEEN 1 AND 50),
    preferred_time_of_day VARCHAR(50),
    price_sensitivity ENUM('LOW', 'MEDIUM', 'HIGH'),
    
    -- Favorites & Settings
    favorite_stations JSON,  -- {station_ids: [1, 5, 23]}
    notification_preferences JSON,  -- {email: true, sms: false, push: true}
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
               ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### 9. ML_MODEL_PREDICTIONS Table

**Purpose:** Store ML model predictions for availability

```sql
CREATE TABLE ml_model_predictions (
    -- Primary Key
    prediction_id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Foreign Key
    station_id INT NOT NULL,
    FOREIGN KEY (station_id) REFERENCES charging_stations(station_id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Prediction Data
    prediction_timestamp DATETIME NOT NULL,
    predicted_available_slots INT NOT NULL,
    confidence_score DECIMAL(5, 4) CHECK(confidence_score BETWEEN 0 AND 1),
    prediction_horizon_hours INT,  -- 1, 4, 8, 24
    
    -- Actual Value (for model evaluation)
    actual_available_slots INT,
    prediction_error INT,
    
    -- Model Metadata
    model_version VARCHAR(50),  -- e.g., "v1.3-rf-200trees"
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    COMPOSITE INDEX idx_station_pred_time (station_id, prediction_timestamp),
    INDEX idx_horizon (prediction_horizon_hours),
    INDEX idx_confidence (confidence_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## Indexes & Performance

### Index Strategy

| Table | Column(s) | Type | Cardinality | Query Benefit |
|-------|-----------|------|------------|---------------|
| users | email | UNIQUE | Very High | Login queries (exact match) |
| users | role | Regular | Low | Filter by user type |
| charging_stations | location (spatial) | SPATIAL | Very High | Geographic searches |
| charging_stations | owner_id | Regular | Medium | Owner's stations |
| charging_sessions | user_id | Regular | Medium | User's history |
| charging_sessions | station_id | Regular | Medium | Station's sessions |
| charging_sessions | start_time | Regular | Very High | Date range queries |
| charging_sessions | (user_id, start_time) | COMPOSITE | Very High | User's recent sessions |
| availability_logs | (station_id, timestamp) | COMPOSITE | Very High | Recent availability |
| ratings_reviews | (station_id, rating) | COMPOSITE | Medium | Top-rated stations |

### Query Optimization Examples

**Query 1: Find nearby stations (w/o index = Full table scan)**
```sql
-- OPTIMIZED WITH SPATIAL INDEX
SELECT station_id, name, distance_km, available_slots 
FROM charging_stations
WHERE ST_DISTANCE_SPHERE(POINT(latitude, longitude), 
                        POINT(28.6139, 77.2090)) < 5000
AND is_active = TRUE
ORDER BY distance_km;
-- Uses: idx_location (SPATIAL), idx_active
```

**Query 2: Find user's recent sessions**
```sql
-- OPTIMIZED WITH COMPOSITE INDEX
SELECT session_id, station_id, start_time, cost_paid 
FROM charging_sessions
WHERE user_id = 123
AND start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY start_time DESC;
-- Uses: idx_user_time (COMPOSITE)
```

---

## Data Relationships

### One-to-Many Relationships

1. **User → Charging Sessions** (1:*)
   - One user can have multiple sessions
   - Cardinality: 1 user × 20 sessions avg per year

2. **User → Ratings** (1:*)
   - One user can rate many stations
   - Cardinality: 1 user × 3 ratings avg per year

3. **Station → Charging Sessions** (1:*)
   - One station handles many sessions
   - Cardinality: 1 station × 1000 sessions per year

4. **Station → Availability Logs** (1:*)
   - One station has many availability snapshots
   - Cardinality: 1 station × 288 logs per day (5-min intervals)

### Many-to-Many Relationships

1. **Stations ↔ Amenities** (Many:Many)
   - Implemented via STATION_AMENITIES junction table
   - Cardinality: 1 station × 5 amenities avg

---

## Constraints & Validations

### Domain-Level Constraints

| Constraint | Rule | Type | Enforcement |
|-----------|------|------|-------------|
| Email Uniqueness | One email per user | UNIQUE | Database UNIQUE index |
| Role Validation | Only valid roles | CHECK ENUM | Database ENUM constraint |
| Active Slots | available <= total | CHECK | Application logic |
| Rating Range | 1-5 stars | CHECK | Database CHECK constraint |
| Confidence Score | 0-1 range | CHECK | Database CHECK constraint |
| Future Dates | No future reservations | CHECK | Application logic |
| Parent Deletion | Cascading deletes | FOREIGN KEY | Database CASCADE |

---

## Data Retention Policy

| Table | Retention Period | Archive Location | Purge |
|-------|-----------------|-----------------|-------|
| users | Permanent | N/A | No (except deleted accounts) |
| charging_stations | Permanent | N/A | No |
| charging_sessions | 2 years | GCS (Parquet) | After 2 years |
| availability_logs | 6 months (live) + 2 years (archive) | GCS | After 2 years |
| ratings_reviews | Permanent | N/A | No |
| pricing_history | 3 years | GCS | After 3 years |
| ml_model_predictions | 1 month (live) + 1 year (archive) | GCS | After 1 year |
| user_sessions (Redis) | 24 hours | N/A | Automatic TTL |

---

## View Definitions

### Important Materialized Views

**View: station_performance_summary**
```sql
CREATE VIEW station_performance_summary AS
SELECT 
    s.station_id,
    s.name,
    COUNT(cs.session_id) as total_sessions,
    AVG(cs.energy_consumed_kwh) as avg_energy_per_session,
    SUM(cs.cost_paid) as total_revenue,
    AVG(rr.rating) as avg_rating,
    COUNT(DISTINCT cs.user_id) as unique_users
FROM charging_stations s
LEFT JOIN charging_sessions cs ON s.station_id = cs.station_id
LEFT JOIN ratings_reviews rr ON s.station_id = rr.station_id
GROUP BY s.station_id, s.name;
```

**View: user_activity_summary**
```sql
CREATE VIEW user_activity_summary AS
SELECT 
    u.user_id,
    u.email,
    COUNT(cs.session_id) as total_sessions,
    SUM(cs.energy_consumed_kwh) as total_energy,
    SUM(cs.cost_paid) as total_spent,
    MAX(cs.start_time) as last_session_date
FROM users u
LEFT JOIN charging_sessions cs ON u.user_id = cs.user_id
GROUP BY u.user_id, u.email;
```

---

*End of Database Schema & Design Document*
