# SYSTEM ARCHITECTURE

## Smart EV Charging Station Finder & Management Platform

**Date:** March 13, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Description](#component-description)
4. [Technology Stack](#technology-stack)
5. [Data Flow](#data-flow)
6. [Deployment Architecture](#deployment-architecture)
7. [Scalability & Performance](#scalability--performance)
8. [Security Architecture](#security-architecture)
9. [Disaster Recovery](#disaster-recovery)

---

## Architecture Overview

The Smart EV Charging Station platform is built using a **cloud-native, microservice-based architecture** designed for scalability, reliability, and maintainability. The architecture separates concerns into distinct layers:

- **Presentation Layer:** Client applications (web, mobile)
- **API Layer:** RESTful microservices handling business logic
- **Data Layer:** Persistent storage and caching
- **Integration Layer:** External services and notifications
- **Analytics Layer:** ML models and data science pipelines

**Key Architectural Principles:**
- **Microservices:** Each service handles a specific business domain
- **Scalability:** Horizontal scaling through containerization and orchestration
- **Resilience:** Fault tolerance with automatic recovery
- **Security:** Defense-in-depth with multiple security layers
- **Observability:** Comprehensive monitoring, logging, and tracing

---

## Architecture Diagram

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│  ┌──────────────────┬──────────────────┬──────────────────────┐    │
│  │ EV User Portal   │ Station Owner    │ Admin Dashboard      │    │
│  │  (React/Next)    │ Management Portal│ (React/Analytics)    │    │
│  │  Web App         │ Web App          │ Web App              │    │
│  └──────────────────┴──────────────────┴──────────────────────┘    │
│         │                    │                     │                │
└─────────┼────────────────────┼─────────────────────┼────────────────┘
          │                    │                     │
┌─────────▼────────────────────▼─────────────────────▼────────────────┐
│            API GATEWAY (Google Cloud Load Balancer)                 │
│  - SSL/TLS Termination                                             │
│  - Request Routing & Load Balancing                                │
│  - Rate Limiting & DDoS Protection                                 │
│  - CORS Policy Enforcement                                         │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────────────┐
│         MICROSERVICE LAYER (FastAPI on Cloud Run)                    │
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │  Authentication Svc  │  │  Station Finder Svc  │              │
│  │  - JWT Generation    │  │  - Search & Filter   │              │
│  │  - Token Validation  │  │  - Geospatial Query  │              │
│  │  - User Management   │  │  - Real-time Update  │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │  Session Svc         │  │  Recommendation Svc  │              │
│  │  - Start/End Session │  │  - Ranking Algorithm │              │
│  │  - Session History   │  │  - Personalization   │              │
│  │  - Cost Calculation  │  │  - Collaborative     │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                      │
│  ┌──────────────────────┐  ┌──────────────────────┐              │
│  │  Analytics Svc       │  │  Prediction Svc (ML) │              │
│  │  - Utilization Stats │  │  - Availability Pred │              │
│  │  - Trend Analysis    │  │  - Demand Forecast   │              │
│  │  - Report Generation │  │  - Model Serving     │              │
│  └──────────────────────┘  └──────────────────────┘              │
│                                                                      │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────────┐ ┌───────▼──────────┐ ┌──────▼────────────────┐
│   DATA LAYER     │ │  CACHE LAYER     │ │  ML/ANALYTICS LAYER  │
│                  │ │                  │ │                      │
│  MySQL Primary   │ │  Redis Cache     │ │  Python ML Engine    │
│  (Cloud SQL)     │ │  - Sessions      │ │  - Scikit-Learn      │
│                  │ │  - Hot Data      │ │  - XGBoost           │
│  Replication:    │ │  - Predictions   │ │  - Pandas Processing │
│  - Read Replica  │ │  (TTL: 5min)     │ │  - Model Versioning  │
│  - Backups       │ │                  │ │                      │
│                  │ │  Cloud Storage   │ │  Feature Store       │
│                  │ │  - Backups       │ │  (Materialized Views)│
│                  │ │  - Logs          │ │                      │
└────────┬─────────┘ └────────┬─────────┘ └──────┬─────────────────┘
         │                    │                  │
         └────────────────────┼──────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────────┐
│         EXTERNAL INTEGRATIONS                                      │
│  ┌──────────────────┬──────────────────┬──────────────────┐       │
│  │ Google Maps API  │ Firebase Auth    │ Google Cloud     │       │
│  │ - Geocoding      │ - User Auth      │ - Monitoring     │       │
│  │ - Directions     │ - Settings       │ - Logging        │       │
│  │ - Places         │ - Security       │ - Tracing        │       │
│  └──────────────────┴──────────────────┴──────────────────┘       │
└────────────────────────────────────────────────────────────────────┘
```

### Request Flow Diagram

```
User Browser Request
        │
        ▼
┌─────────────────────────────────────┐
│  Content Delivery Network (CDN)     │ ◄─── Static Assets (JS, CSS, Images)
│  Google Cloud CDN                   │
└────────────────┬────────────────────┘
                 │
                 ▼ (API Requests)
┌─────────────────────────────────────┐
│  Cloud Load Balancer                │ ◄─── SSL/TLS, Rate Limiting
│  - Route to multiple backends       │
│  - Health checks every 30s          │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┬────────────┬────────────┐
        ▼                 ▼            ▼            ▼
   ┌────────┐      ┌────────┐   ┌────────┐   ┌────────┐
   │ Cloud  │      │ Cloud  │   │ Cloud  │   │ Cloud  │
   │ Run    │      │ Run    │   │ Run    │   │ Run    │
   │Replica│      │Replica │   │Replica │   │Replica │
   │  (1)  │      │  (2)   │   │  (3)   │   │  (4)   │
   └────┬───┘      └────┬───┘   └────┬───┘   └────┬───┘
        │               │            │            │
        └───────────────┼────────────┼────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │     Cloud SQL (MySQL)             │
        │  ┌─────────────────────────────┐  │
        │  │  Primary Instance           │  │
        │  │  (Read/Write)               │  │
        │  └────────┬────────────────────┘  │
        │           │                       │
        │      ┌────▼────┐   ┌────────┐    │
        │      │Read Only│   │ Backup │    │
        │      │ Replica │   │ Snapshots   │
        │      └─────────┘   └────────┘    │
        └───────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │  Redis Cache (Cloud Memorystore)  │
        │  - Session Tokens                 │
        │  - Leaderboards                   │
        │  - Real-time Availability         │
        └───────────────────────────────────┘
```

---

## Component Description

### 1. Presentation Layer (Client)

**Web Application:**
- **Framework:** React 18 with Next.js 13
- **State Management:** Redux Toolkit / Zustand
- **Styling:** Tailwind CSS
- **APIs:** Axios for HTTP requests, Socket.io for WebSocket
- **Build Tool:** Webpack (via Next.js)
- **Package Manager:** npm/yarn

**Key Components:**
- Authentication module (login, register, profile)
- Station search and discovery interface
- Map visualization using Google Maps
- Real-time availability display
- Recommendation engine UI
- Admin analytics dashboard
- Station owner management portal

### 2. API Gateway & Load Balancing

**Google Cloud Load Balancer:**
- **Protocol:** HTTPS (SSL/TLS 1.3)
- **Capacity:** 1000+ concurrent connections
- **Health Checks:** TCP checks every 30 seconds
- **Backends:** Cloud Run services (auto-scaling 2-100 instances)

**Features:**
- Round-robin request distribution
- Session affinity (cookie-based)
- Rate limiting: 1000 req/min per user IP
- Request/response logging
- DDoS protection (Cloud Armor)

### 3. Microservice Layer (FastAPI)

**Authentication Service:**
- User registration and email verification
- JWT token generation with RS256 signing
- Token refresh and expiration management
- OAuth 2.0 integration (optional)
- Role-based permission cache

```python
# Tech Stack:
- Framework: FastAPI 0.95+
- Authentication: python-jose + passlib
- Database: SQLAlchemy ORM
- Async: asyncio + aiohttp
- Testing: pytest + httpx
```

**Station Finder Service:**
- Geospatial queries (MySQL spatial indexes)
- Full-text search with indexing
- Availability real-time updates (WebSocket)
- Advanced filtering and sorting
- Google Maps API integration

```python
# Key Technologies:
- Geopy for distance calculations
- Elasticsearch (optional, for full-text search)
- WebSocket for real-time updates
- Caching layer (Redis)
```

**Session Management Service:**
- Charging session lifecycle (start → active → end)
- Cost calculation and billing
- Session history and analytics
- Time-based operations (scheduling, reminders)

**Recommendation Engine Service:**
- Collaborative filtering algorithm
- Content-based recommendations
- Hybrid approach combining both
- User preference learning
- Real-time ranking

**Analytics Service:**
- Aggregation queries on large datasets
- Time-series analysis
- Report generation (PDF/CSV export)
- Scheduled jobs for daily/weekly reports
- Caching of computed metrics

**ML Prediction Service:**
- Model inference using Scikit-Learn pickled models
- Batch prediction pipeline (scheduled)
- Real-time prediction API (< 200ms)
- Model versioning and A/B testing
- Feature engineering and preprocessing

### 4. Data Layer

**MySQL (Primary Database - Cloud SQL):**
- **Version:** MySQL 8.0+
- **Instance Type:** db-custom-4-26GB (4 vCPU, 26GB RAM)
- **Storage:** 500GB SSD (auto-scalable)
- **Backup:** Automated daily backups, 30-day retention
- **Replication:** Binary log replication to read replicas

**Tables:** (See DATABASE_SCHEMA.md for detailed schema)
- users
- charging_stations
- charging_sessions
- availability_logs
- ratings_reviews
- station_amenities
- pricing_history
- user_preferences
- ml_model_predictions

**Redis (Cache - Cloud Memorystore):**
- **Version:** Redis 7.0+
- **Memory:** 5GB (auto-expandable)
- **Persistence:** RDB snapshots every 1 hour
- **Data Structures:**
  - Session tokens (String, TTL: 24h)
  - User preferences (Hash)
  - Real-time availability (Sorted Set)
  - Leaderboards (Sorted Set)

**Google Cloud Storage:**
- **Backup Archive:** Daily database backups (Parquet format)
- **Data Lake:** Raw operational data for analytics
- **Models:** Serialized ML models and artifacts
- **Logs:** Long-term log storage

### 5. ML & Analytics Layer

**Model Serving:**
- FastAPI endpoint for availability predictions
- Response time: < 200ms (p99)
- Batch prediction jobs (daily update)
- Model versioning with git-based tracking

**Feature Engineering Pipeline:**
- Automated feature calculation using Pandas
- Time-series features derived from timestamps
- Spatial features from location data
- Statistical features (rolling averages, percentiles)

**Model Training Infrastructure:**
- Training on Cloud AI Platform or local GPU
- Hyperparameter tuning with GridSearch
- Model evaluation on validation set
- Performance tracking and comparison

**Analytics Processing:**
- Spark jobs for large-scale aggregations (future)
- Pandas for exploratory analysis
- Matplotlib/Plotly for visualization
- BigQuery integration (optional)

---

## Technology Stack

| Layer | Component | Technology | Purpose |
|-------|-----------|-----------|---------|
| **Frontend** | UI Framework | React 18 | Component-based UI |
| | Styling | Tailwind CSS | Utility-first CSS |
| | State Management | Redux Toolkit | Centralized state |
| | HTTP Client | Axios | API communication |
| | Maps | Google Maps API | Location services |
| **Backend** | Framework | FastAPI | API server |
| | Language | Python 3.9+ | Backend logic |
| | ORM | SQLAlchemy | Database abstraction |
| | Authentication | python-jose | JWT tokens |
| | Async | asyncio | High concurrency |
| | Validation | Pydantic | Schema validation |
| **Database** | Relational | MySQL 8.0 | Transactional data |
| | Cache | Redis 7.0 | Session & real-time |
| | Storage | Google Cloud Storage | Backups & data lake |
| **Data Science** | ML Lib | Scikit-Learn | Predictive models |
| | Data Processing | Pandas | Data manipulation |
| | Numerical | NumPy | Array operations |
| | Gradient Boost | XGBoost | Advanced models |
| | Visualization | Matplotlib/Plotly | Charts & graphs |
| **DevOps** | Container | Docker | Containerization |
| | Orchestration | Kubernetes/Cloud Run | Deployment |
| | CI/CD | GitHub Actions | Automation |
| | IaC | Terraform | Infrastructure code |
| | Monitoring | Cloud Monitoring | System metrics |
| | Logging | Cloud Logging | Centralized logs |
| **Cloud** | Provider | Google Cloud Platform | Cloud infrastructure |
| | Compute | Cloud Run | Serverless API |
| | Database | Cloud SQL | Managed MySQL |
| | Cache | Cloud Memorystore | Managed Redis |
| | Networking | Cloud Load Balancer | Traffic distribution |
| | CDN | Cloud CDN | Content delivery |
| | Auth | Firebase Auth | User authentication |

---

## Data Flow

### 1. User Search & Station Discovery Flow

```
User enters search criteria (location, radius, preferences)
                    ▼
              Frontend (React)
                    ▼
          API Request: GET /api/v1/stations
          Query Params: lat, lon, radius, filters
                    ▼
           API Gateway (Load Balancer)
              (SSL/TLS, Rate Limit Check)
                    ▼
         Station Finder Microservice
                    ▼
    ┌──────────────┬──────────────┐
    ▼              ▼              ▼
 Check Redis   Execute SQL    Google Maps
 Cache for      Geospatial     API for accuracy
 hot results    Query          check
    │              │              │
    └──────────────┴──────────────┘
               ▼
    Add Results to Cache (5min TTL)
    Calculate distances & ratings
    Apply user preferences ranking
               ▼
    JSON Response with Top 20 stations
               ▼
         Cache in Redux Store
               ▼
    Render on Map with Markers
    Display List with Details
```

### 2. Charging Session Flow

```
User Initiates Session (At charging station)
                    ▼
              Frontend App
    Request: POST /api/v1/sessions
    Body: {user_id, station_id, battery_level}
                    ▼
    Session Microservice receives request
                    ▼
    ┌─────────────────────────────────┐
    │ 1. Validate user & station      │
    │ 2. Update station availability  │
    │ 3. Create session record (DB)   │
    │ 4. Cache session in Redis       │
    │ 5. Emit WebSocket event         │
    └─────────────────────────────────┘
                    ▼
    Real-time broadcast to admin users
    (Session started event)
                    ▼
    ┌─────────────────────────────────┐
    │ Session Active (Polling/WS)     │
    │ - Monitor battery level         │
    │ - Track elapsed time            │
    │ - Calculate running cost        │
    └─────────────────────────────────┘
                    ▼
    User ends session (App triggers end)
    Request: PUT /api/v1/sessions/{id}/end
    Body: {battery_level_end}
                    ▼
    ┌─────────────────────────────────┐
    │ 1. Calculate final energy used  │
    │ 2. Calculate total cost         │
    │ 3. Update session in DB         │
    │ 4. Update station availability  │
    │ 5. Trigger analytics job        │
    │ 6. Send completion notification │
    └─────────────────────────────────┘
```

### 3. ML Prediction Pipeline

```
Daily Scheduled Job (Midnight)
                    ▼
    Extract historical data from MySQL
    (24 months of session records)
                    ▼
    Load into Pandas DataFrame
                    ▼
    ┌──────────────────────────────┐
    │ Feature Engineering:         │
    │ - Time features              │
    │ - Spatial features           │
    │ - Historical patterns        │
    │ - Weather data lookup        │
    └──────────────────────────────┘
                    ▼
    Load trained ML model (pickle)
                    ▼
    Generate predictions for next 24 hours
    (1hr, 4hr, 8hr, 24hr horizons)
                    ▼
    ┌──────────────────────────────┐
    │ 1. Store predictions in DB   │
    │ 2. Update Redis cache        │
    │ 3. Calculate confidence      │
    │ 4. Log prediction metrics    │
    └──────────────────────────────┘
                    ▼
    Serve via: GET /api/v1/predictions
    (Real-time API with < 200ms latency)
```

### 4. Real-time Availability Update Flow

```
Station Owner Updates Availability
(Mobile or Web Interface)
                    ▼
          POST /api/v1/stations/{id}
          Body: {available_slots: 3}
                    ▼
    Station Microservice validates
                    ▼
    ┌──────────────────────────────┐
    │ 1. Update MySQL DB           │
    │ 2. Update Redis cache        │
    │ 3. Create log entry          │
    │ 4. Emit WebSocket event      │
    │ 5. Notify subscribed users   │
    └──────────────────────────────┘
                    ▼
    WebSocket broadcast to all connected users
    (Real-time map update for nearby stations)
                    ▼
    Frontend receives update
    React state updates
    Map markers update color/count
```

---

## Deployment Architecture

### GCP Infrastructure

**Compute:**
```
┌──────────────────────────────────┐
│     Cloud Load Balancer          │ (asia-south1-a, asia-south1-b)
│  (Distributes traffic to backends)│
└──────────────────┬────────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌─────────┐
│Cloud Run│  │Cloud Run│  │Cloud Run│
│Instance1│  │Instance2│  │Instance3│
│(2vCPU)  │  │(2vCPU)  │  │(2vCPU)  │
└─────────┘  └─────────┘  └─────────┘
     │             │             │
     └─────────────┼─────────────┘
                   ▼
        ┌────────────────────────┐
        │   Cloud SQL (MySQL)    │
        │  Primary (asia-south1) │
        │                        │
        │  Read Replica          │
        │  (asia-south2)         │
        └────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                      ▼
   ┌────────┐          ┌─────────────┐
   │ Redis  │          │Cloud Storage│
   │Cache   │          │  (Backups)  │
   └────────┘          └─────────────┘
```

**Networking:**
```
Internet
    ▼
Cloud Armor (DDoS Protection)
    ▼
Cloud Load Balancer (Public IP)
    ▼
Cloud Run Services (Private VPC)
    ▼
Cloud SQL (Private VPC)
Cloud Memorystore (Private VPC)
```

**Regions & Availability:**
- **Primary:** asia-south1 (Delhi) - 2 zones (a, b)
- **Backup:** asia-southeast1 (Singapore)
- **Disaster Recovery:** Automated daily backups to us-central1

### CI/CD Pipeline

```
Developer pushes to GitHub
      ▼
GitHub Actions triggered
      ▼
┌─────────────────────────┐
│ Checkout & Setup        │
│ - Clone repo            │
│ - Install dependencies  │
└─────────────────────────┘
      ▼
┌─────────────────────────┐
│ Build Stage             │
│ - Run unit tests        │
│ - Code coverage analysis│
│ - Lint check            │
│ - Build Docker image    │
└─────────────────────────┘
      ▼
┌─────────────────────────┐
│ Push to GCP Artifact    │
│ Registry                │
│ - Tag with git commit   │
│ - Store Docker image    │
└─────────────────────────┘
      ▼
┌─────────────────────────┐
│ Deploy to Cloud Run     │
│ - Blue-green deployment │
│ - Smoke tests           │
│ - Health checks         │
└─────────────────────────┘
      ▼
Production Live
```

---

## Scalability & Performance

### Horizontal Scaling

**Cloud Run Auto-Scaling:**
- **Min Instances:** 2
- **Max Instances:** 100
- **CPU Utilization:** 70% threshold for scaling
- **Memory Utilization:** 80% threshold for scaling
- **Concurrent Requests per Instance:** 80

**Load Distribution:**
```
Total Load (1000 req/s)
         ▼
    Load Balancer
         ▼
    ┌───┴───┬───┬───┬───┬───┐
    ▼   ▼   ▼   ▼   ▼   ▼   ▼
   10 req/s each → 100 instances
```

### Database Scaling

**MySQL Master-Slave Replication:**
- **Write Operations:** Primary instance only
- **Read Operations:** Distributed among read replicas (5+ replicas)
- **Replication Lag:** < 100ms target
- **Connection Pooling:** PgBouncer for connection management

**Query Optimization:**
- Indexed queries (95% hit coverage)
- Materialized views for complex aggregations
- Partitioning on time-based keys
- Archive old data to Cloud Storage

### Caching Strategy

**Redis Cache Hierarchy:**
```
Level 1: Browser Cache (Static assets)
         └─ TTL: 24 hours
                   ▼
Level 2: CDN Cache (Images, JS, CSS)
         └─ TTL: 1 hour
                   ▼
Level 3: Redis Session Cache
         └─ TTL: 30 minutes (auth tokens)
                   ▼
Level 4: Redis Hot Data Cache
         └─ TTL: 5 minutes (station availability)
                   ▼
Level 5: Database Query Cache
         └─ TTL: 10 minutes (aggregations)
```

---

## Security Architecture

### Authentication & Authorization

```
┌────────────┐
│ User Login │
└─────┬──────┘
      ▼
┌──────────────────────────────┐
│ Firebase Auth / JWT Generator│
│ - Email/password verification│
│ - Generate RS256 JWT token   │
└──────────────┬───────────────┘
               ▼
         ┌─────────────┐
         │ JWT Token   │header.payload.signature
         │ {exp, role} │
         └─────┬───────┘
               ▼
    ┌──────────────────────┐
    │ Send to Client       │
    │ Stored in HttpOnly   │
    │ Secure Cookie        │
    └──────────────────────┘
               ▼
    Each API Request includes token
               ▼
    ┌──────────────────────────┐
    │ Verify JWT Signature     │
    │ Check expiration         │
    │ Validate role permissions│
    └─────────┬────────────────┘
              ▼
    ┌──────────────────┐
    │ Grant/Deny Access│
    └──────────────────┘
```

### Data Encryption

- **In Transit:** TLS 1.3 for all external communication
- **At Rest:** AES-256 encryption for sensitive fields (passwords, PII)
- **Key Management:** Google Cloud KMS
- **Backup Encryption:** Data encrypted before storage

### API Security

- **Rate Limiting:** 1000 req/min per IP
- **Input Validation:** Pydantic schema validation
- **SQL Injection Prevention:** Parameterized queries only
- **CORS Policy:** Whitelist domains
- **API Keys:** For external integrations
- **Webhook Signing:** HMAC-SHA256

---

## Disaster Recovery

### Backup Strategy

```
Real-time Continuous Replication
      ▼
┌──────────────────┐
│ Primary DB       │
│ asia-south1      │
└────────┬─────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────────┐
│Replica1│ │Daily Backup│
│(Slave) │ │  to GCS    │
└────────┘ └────────────┘
              │
         ┌────┴────────────────┐
         ▼                     ▼
    ┌─────────────┐      ┌──────────────┐
    │asia-south2 │      │us-central1   │
    │(30-day)    │      │(1-year)      │
    └─────────────┘      └──────────────┘
```

**RTO & RPO Targets:**
- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 1 hour
- **Testing:** Monthly disaster recovery drills

### Failover Procedure

```
Primary failure detected
      ▼
Health check fails (3 consecutive failures)
      ▼
Automatic failover triggered
      ▼
┌─────────────────────┐
│ 1. Stop primary DB  │
│ 2. Promote replica  │
│ 3. Update DNS       │
│ 4. Restart services │
│ 5. Alert ops team   │
└─────────────────────┘
      ▼
Full recovery in < 4 hours
```

---

## Monitoring & Alerting

**Key Metrics:**
- API response time (p50, p95, p99)
- Error rate and HTTP status distributions
- Database query latency and connection pool
- Redis hit rate and eviction rates
- CPU and memory utilization
- Disk I/O and network bandwidth

**Alerting Thresholds:**
```
| Metric | Warning | Critical |
|--------|---------|----------|
| API Latency (p95) | > 3s | > 5s |
| Error Rate | > 1% | > 5% |
| DB Replication Lag | > 500ms | > 2s |
| Cache Hit Rate | < 80% | < 70% |
| CPU Utilization | > 75% | > 90% |
| Memory Usage | > 80% | > 95% |
| Disk Usage | > 75% | > 90% |
```

---

*End of System Architecture Document*
