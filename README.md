# Smart EV Charging Station Finder & Management Platform

A full-stack web application integrating data science and machine learning to help EV users locate charging stations efficiently, while enabling station owners and administrators to manage charging infrastructure effectively.

## 📋 Project Documentation

This project includes comprehensive documentation across multiple technical domains:

### Core Requirements & Architecture
- **[SRS.md](Documnets/SRS.md)** - Software Requirements Specification (11 comprehensive sections)
  - Introduction and project scope
  - Overall system description and user classes
  - Complete system features with functional requirements
  - Data science module specifications
  - Database design requirements
  - API design and specifications
  - Non-functional requirements (performance, security, scalability)
  - System architecture
  - Future enhancements and project timeline

### System Design & Architecture
- **[SYSTEM_ARCHITECTURE.md](Documnets/SYSTEM_ARCHITECTURE.md)** - Complete system architecture documentation
  - High-level architecture overview with diagrams
  - Component descriptions (Frontend, Backend, Database, ML)
  - Technology stack details
  - Data flow diagrams
  - Deployment architecture on Google Cloud Platform
  - Scalability and performance strategies
  - Security architecture and best practices
  - Disaster recovery and failover strategies

### Data & Processes
- **[DATA_FLOW_DIAGRAMS.md](Documnets/DATA_FLOW_DIAGRAMS.md)** - Complete DFD documentation
  - DFD Level 0: Context diagram
  - DFD Level 1: Main processes
  - DFD Level 2: Detailed process flows
  - External entities and data stores
  - Detailed process descriptions

- **[DATABASE_SCHEMA.md](Documnets/DATABASE_SCHEMA.md)** - Database design and specifications
  - Entity Relationship Diagram (ERD) with detailed explanations
  - Complete table schema definitions (9 tables)
  - Column specifications and constraints
  - Indexing strategies for performance optimization
  - Data relationships and cardinality
  - Data retention and archival policies
  - Example queries and view definitions

### Machine Learning & Data Science
- **[ML_PIPELINE.md](Documnets/ML_PIPELINE.md)** - ML pipeline and data science workflow
  - End-to-end ML pipeline overview
  - Data ingestion from multiple sources
  - Data preprocessing and cleaning strategies
  - Feature engineering (temporal, spatial, derived)
  - Model development and selection
  - Model training with hyperparameter tuning
  - Model evaluation metrics and performance
  - Model deployment and serving architecture
  - Monitoring and maintenance strategies
  - Python implementation code examples

### Project Management
- **[PROJECT_TIMELINE.md](Documnets/PROJECT_TIMELINE.md)** - Project timeline and milestones
  - 14-week project schedule (Jan 10 - Mar 28, 2026)
  - Detailed phase breakdown
  - Weekly task distribution
  - Resource allocation by team member
  - Major milestones and gates
  - Risk assessment and contingency plans
  - Success criteria and evaluation metrics

## 👥 Team Members

| Name | Roll No. | Contact | Role |
|------|----------|---------|------|
| Pushkarjay Ajay | 22052328 | 8210164935 | Backend Lead & Project Lead |
| Bhavya Singh | 2205120 | 7464062560 | Frontend Developer |
| Anushka Verma | 2205712 | 72588961346 | Data Science & ML |
| Kavya Dixit | 2205132 | +91 82877 40746 | QA & Documentation |

**Supervisor:** Dr. Nachiketa Tarasia, Associate Professor, KIIT University

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│          Client Layer (React/Next.js)       │
│  - EV User Portal                           │
│  - Station Owner Management                 │
│  - Admin Dashboard                          │
└────────────────────┬────────────────────────┘
                     │
        ┌────────────▼────────────┐
        │   API Gateway (GCP)     │
        │   Load Balancer         │
        └────────────┬────────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
    ▼                ▼                ▼
┌─────────────┐ ┌─────────────┐ ┌────────────┐
│  Backend    │ │  ML Engine  │ │  Analytics │
│  Services   │ │  (Python)   │ │  Service   │
│  (FastAPI)  │ │             │ │            │
└─────┬───────┘ └─────┬───────┘ └────┬───────┘
      │               │              │
      └───────────────┼──────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
    ┌──────────┐            ┌──────────────┐
    │ Database │            │ Cache/Redis  │
    │(MySQL)   │            │              │
    └──────────┘            └──────────────┘
```

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Next.js, Tailwind CSS | Web UI |
| **Backend** | FastAPI, Python 3.9+ | REST APIs |
| **Database** | MySQL 8.0, Redis | Data Storage |
| **Data Science** | Scikit-Learn, Pandas, XGBoost | ML Models |
| **Cloud** | Google Cloud Platform | Hosting & Infrastructure |
| **DevOps** | Docker, GitHub Actions, Kubernetes | Deployment |

## 📊 Key Features

### For EV Users
- 🔍 Search nearby charging stations
- 📍 View real-time availability
- ⭐ Get intelligent recommendations
- 🗺️ Map-based navigation
- 📝 Rate and review stations

### For Station Owners
- 🏢 Manage charging stations
- 📈 Monitor usage statistics
- 💰 Revenue tracking and analytics
- ⚙️ Maintenance scheduling
- 🎯 Dynamic pricing management

### For Administrators
- 👥 User and station management
- 📊 Platform-wide analytics
- 🔒 System monitoring and health
- 📋 Reporting and insights
- ⚠️ Issue escalation management

### Data Science Integration
- 🤖 ML-based availability prediction
- 🎯 Personalized recommendations
- 📈 Demand forecasting
- 📊 Usage pattern analytics
- 🔮 Predictive maintenance insights

## 📋 Documentation Structure

Each documentation file is independently comprehensive yet integrated:

- **SRS.md** → Defines what the system should do
- **SYSTEM_ARCHITECTURE.md** → Defines how components work together
- **DATABASE_SCHEMA.md** → Defines data structure and relationships
- **DATA_FLOW_DIAGRAMS.md** → Shows process flows and data movement
- **ML_PIPELINE.md** → Details ML model development and deployment
- **PROJECT_TIMELINE.md** → Project schedule and resource allocation

## 🎯 Project Goals

1. ✅ Develop comprehensive system requirements documentation
2. ✅ Design scalable, cloud-native architecture
3. ✅ Build responsive, user-friendly interfaces
4. ✅ Implement ML-based prediction and recommendation systems
5. ✅ Achieve 99%+ system uptime and < 2s API response time
6. ✅ Deploy on Google Cloud Platform with proper monitoring

## 📅 Project Timeline

- **Weeks 1-2:** Planning & Analysis
- **Weeks 3-4:** System Design
- **Weeks 5-8:** Parallel Development (Frontend, Backend, ML)
- **Weeks 9-10:** Integration & Testing
- **Weeks 11-12:** Deployment & Documentation
- **Weeks 13-14:** Final Adjustments & Submission

See [PROJECT_TIMELINE.md](Documnets/PROJECT_TIMELINE.md) for detailed schedule.

## 🔐 Security & Compliance

- HTTPS/TLS 1.2+ encryption for all communications
- JWT-based authentication with RS256 signing
- Role-based access control (RBAC)
- SQL injection prevention through parameterized queries
- GDPR compliance with data export/deletion
- Regular security updates and patching

## 📈 Performance Targets

- API Response Time: < 2 seconds (p95)
- System Uptime: 99.5% SLA
- Concurrent Users: 1000+
- Database Query Latency: < 500ms average
- ML Model Accuracy: R² > 0.85

## 🚀 Deployment

The system is designed for deployment on **Google Cloud Platform** with:
- Cloud Run for serverless container hosting
- Cloud SQL for managed MySQL database
- Cloud Storage for data lake and backups
- Cloud Monitoring for observability
- Automated CI/CD pipeline with GitHub Actions

## 📚 Additional Resources

- API Documentation: See SRS.md Section 6
- Database Schema Details: See DATABASE_SCHEMA.md
- ML Model Details: See ML_PIPELINE.md
- Architecture Diagrams: See SYSTEM_ARCHITECTURE.md

## 📖 Quick Start

1. **Review Documentation:**
   - Start with [SRS.md](Documnets/SRS.md) for complete specifications
   - Then [SYSTEM_ARCHITECTURE.md](Documnets/SYSTEM_ARCHITECTURE.md) for design

2. **Set Up Development:**
   - Clone the repository
   - Install dependencies: `pip install -r requirements.txt && npm install`
   - Configure environment variables
   - Initialize database schema (see DATABASE_SCHEMA.md)

3. **Run Locally:**
   - Backend: `python -m uvicorn main:app --reload`
   - Frontend: `npm run dev`
   - ML Service: `python ml_service.py`

4. **Deploy to GCP:**
   - See SYSTEM_ARCHITECTURE.md Section: Deployment Architecture
   - Use Cloud Run and Cloud SQL as described

## 📞 Contact & Support

For questions or clarifications:
- **Project Lead:** Pushkarjay Ajay (8210164935)
- **Supervisor:** Dr. Nachiketa Tarasia (ntarasiafcs@kiit.ac.in)

---

**Document Version:** 1.0  
**Last Updated:** March 13, 2026  
**Status:** Ready for Development & Deployment

