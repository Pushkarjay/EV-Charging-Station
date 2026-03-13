# PROJECT TIMELINE & MILESTONES

## Smart EV Charging Station Finder & Management Platform

**Date:** March 13, 2026  
**Duration:** 14 weeks  
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Phases](#project-phases)
3. [Detailed Timeline](#detailed-timeline)
4. [Gantt Chart](#gantt-chart)
5. [Resource Allocation](#resource-allocation)
6. [Milestones & Deliverables](#milestones--deliverables)
7. [Risk & Contingency](#risk--contingency)

---

## Executive Summary

**Project Duration:** 14 Weeks (Jan 10 - Mar 28, 2026)

**Team Composition:** 4 Members
- Pushkarjay Ajay (22052328) - Project Lead & Backend
- Bhavya Singh (2205120) - Frontend Developer
- Anushka Verma (2205712) - Data Science & ML
- Kavya Dixit (2205132) - QA & Documentation

**Project Objective:** Develop a full-stack web platform integrating data science for smart EV charging station management and recommendations.

**Scope:** 
- Complete SRS & System Architecture documentation
- Responsive React frontend with 3 portals (EV Users, Station Owners, Admin)
- FastAPI backend with 6 microservices
- MySQL database with optimized schema
- ML models for availability prediction and recommendations
- Production-ready deployment on Google Cloud Platform

---

## Project Phases

### Phase 1: Planning & Analysis (Weeks 1-2)

**Objectives:**
- Finalize project requirements and scope
- Create comprehensive system documentation
- Set up development environment and tools
- Establish coding standards and version control

**Activities:**
- Team kickoff and role assignment
- Requirement refinement and SRS review
- System architecture design finalization
- Development environment setup (Git, Docker, Python, Node.js)

**Deliverables:**
- Final SRS document (11 sections)
- System Architecture diagram
- Database schema design
- Technology stack confirmation
- Development environment setup guide

### Phase 2: System Design (Weeks 3-4)

**Objectives:**
- Design detailed system and database schemas
- Create API specifications
- Design UI/UX wireframes
- Plan ML pipeline architecture

**Activities:**
- Database schema design and optimization
- API endpoint definition and request/response documentation
- Wireframe creation for 3 user portals
- ML feature and model pipeline design

**Deliverables:**
- Complete Database Schema (9 tables with indexes)
- Comprehensive API documentation (50+ endpoints)
- 20+ UI wireframes
- ML pipeline architecture document
- ER diagrams and DFD diagrams

### Phase 3: Frontend Development (Weeks 5-8)

**Objectives:**
- Build responsive React components
- Implement 3 user portals
- Integrate Google Maps API
- Setup Redux state management

**Parallel with Backend Development**

**Tasks by Team Member:**
- **Bhavya Singh (Frontend Lead):**
  - User Portal (station search, recommendations, map view)
  - Station Owner Portal (management, analytics)
  - Responsive design and Tailwind CSS implementation
  - Google Maps integration

**Deliverables by Week:**
- **Week 5:** Authentication UI, station search UI, map component
- **Week 6:** Recommendation cards, session management UI, filters
- **Week 7:** Admin dashboard skeleton, analytics components, responsiveness
- **Week 8:** Integration with backend APIs, error handling, loading states

**Key Deliverables:**
- Authentication pages (Register, Login, Password Reset)
- Station Discovery pages (Map view, List view, Filters)
- Session Management pages (Ongoing sessions, History)
- Admin Dashboard (Overview, User Management, Analytics)
- Recommendation Engine UI (Top 5 stations, Personalization)

### Phase 4: Backend Development (Weeks 5-8)

**Objectives:**
- Develop 6 microservices using FastAPI
- Implement authentication system
- Set up database connections and ORM
- Create comprehensive APIs

**Parallel with Frontend Development**

**Tasks by Team Member:**
- **Pushkarjay Ajay (Backend Lead):**
  - API Gateway and request routing
  - Authentication Service (JWT, OAuth)
  - Station Finder Service (Geospatial queries)
  - Session Management Service
  - Database schema implementation
  - GCP deployment setup

**Deliverables by Week:**
- **Week 5:** Project structure, database setup, authentication APIs
- **Week 6:** Station APIs (CRUD, search, geospatial queries)
- **Week 7:** Session APIs, analytics APIs, recommendation engine setup
- **Week 8:** Integration with ML service, WebSocket setup, error handling

**Key Deliverables:**
- Authentication endpoints (Register, Login, Refresh Token)
- Station Management endpoints (List, Search, Details, Create, Update)
- Session Management endpoints (Start, End, History)
- Recommendation endpoints (Get recommendations, Personalize)
- Analytics endpoints (Dashboard data, Trends)
- 99%+ uptime with proper error handling

### Phase 5: ML Model Development (Weeks 5-7)

**Objectives:**
- Develop availability prediction model
- Create recommendation engine
- Train and evaluate models
- Setup batch prediction pipeline

**Tasks by Team Member:**
- **Anushka Verma (Data Science Lead):**
  - Data extraction and preprocessing
  - Feature engineering (temporal, spatial, derived features)
  - Model training and hyperparameter tuning
  - Model evaluation and performance tracking
  - Setup prediction API and batch jobs

**Deliverables by Week:**
- **Week 5:** EDA, data extraction, preprocessing pipeline
- **Week 6:** Feature engineering, model training, initial evaluation
- **Week 7:** Model optimization, final evaluation, API integration

**Key Deliverables:**
- Random Forest model for availability prediction (R² > 0.85, RMSE < 2)
- Recommendation engine (hybrid collaborative + content-based)
- Feature engineering pipeline
- Model evaluation report
- Batch prediction job setup
- Performance monitoring dashboard

### Phase 6: Integration & Testing (Weeks 9-10)

**Objectives:**
- Integrate all components (Frontend + Backend + ML)
- End-to-end testing
- Performance testing
- Security audit

**Activities:**
- API integration testing
- Frontend-Backend data flow verification
- ML model serving integration
- Load testing (1000+ concurrent users)
- Security vulnerability testing

**Tasks by Team Member:**
- **Kavya Dixit (QA Lead):**
  - Test plan creation
  - Unit testing for Python backends
  - Integration testing for APIs
  - End-to-end user flow testing
  - Performance and load testing
  - Security audit collaboration

**Deliverables:**
- Test Plan document (50+ test cases)
- Unit test coverage (> 80%)
- Integration test results
- Performance test report (latency, throughput)
- Security audit findings and fixes
- Bug tracking and resolution

### Phase 7: Deployment & Documentation (Weeks 11-12)

**Objectives:**
- Deploy to Google Cloud Platform
- Setup monitoring and logging
- Create user and technical documentation
- Prepare for production

**Tasks:**
- **Pushkarjay Ajay:**
  - GCP Cloud Run deployment
  - Database migration
  - CI/CD pipeline setup (GitHub Actions)
  - Monitoring and alerting setup

- **Kavya Dixit:**
  - User documentation (User guides, FAQs)
  - Technical documentation (API docs, deployment guide)
  - Training material for team
  - Release notes

**Deliverables:**
- Production deployment on GCP
- Cloud Monitoring dashboard
- Centralized logging (Cloud Logging)
- User documentation (20+ pages)
- Technical documentation (30+ pages)
- Deployment guide and runbooks
- Release notes and changelog

### Phase 8: Final Testing & Refinement (Weeks 13-14)

**Objectives:**
- Final system testing
- Performance optimization
- Bug fixes and refinements
- Preparation for demo/presentation

**Activities:**
- User acceptance testing
- Performance optimization
- Final bug fixes
- Documentation finalization

**Deliverables:**
- Final project report (50+ pages)
- Presentation slides and demo
- Source code repository
- Deployment artifacts
- All documentation packages

---

## Detailed Timeline

### Week 1 (Jan 10 - Jan 16)

**Phase:** Planning & Analysis

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Jan 10 | Project kickoff, team meeting | All | Planned |
| Jan 11 | Finalize SRS document | Pushkarjay | Planned |
| Jan 12 | Architecture design review | Pushkarjay | Planned |
| Jan 13 | Development environment setup | Pushkarjay | Planned |
| Jan 14 | Database schema design | Pushkarjay | Planned |
| Jan 15 | Git repo setup, initial commit | Pushkarjay | Planned |
| Jan 16 | Weekly sync & planning | All | Planned |

### Week 2 (Jan 17 - Jan 23)

**Phase:** Planning & Analysis → System Design

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Jan 17 | API design finalization | Pushkarjay | Planned |
| Jan 18 | Wireframe creation start | Bhavya | Planned |
| Jan 19 | ML pipeline design | Anushka | Planned |
| Jan 20 | Wireframe completion review | Bhavya | Planned |
| Jan 21 | Data schema optimization | Pushkarjay | Planned |
| Jan 22 | Documentation review | Kavya | Planned |
| Jan 23 | Design review meeting | All | Planned |

### Week 3 (Jan 24 - Jan 30)

**Phase:** System Design

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Jan 24 | Database schema implementation | Pushkarjay | Planned |
| Jan 25 | API framework setup (FastAPI) | Pushkarjay | Planned |
| Jan 26 | React project setup | Bhavya | Planned |
| Jan 27 | Data extraction pipeline setup | Anushka | Planned |
| Jan 28 | Component library setup | Bhavya | Planned |
| Jan 29 | Testing framework setup | Kavya | Planned |
| Jan 30 | Integration review | All | Planned |

### Weeks 4-8: Parallel Development

**Split by Specialty:**

**Backend Track (Pushkarjay):**
- Weeks 5-6: Authentication service, Station APIs
- Weeks 7-8: Session and Analytics APIs
- Milestone: 90% API endpoints complete

**Frontend Track (Bhavya):**
- Weeks 5-6: Auth pages, Station discovery UI
- Weeks 7-8: Admin dashboard, Recommendations UI
- Milestone: 80% UI components complete

**ML Track (Anushka):**
- Weeks 5-6: Data preprocessing, Feature engineering
- Weeks 7: Model training and evaluation
- Milestone: Models R² > 0.85

**QA Track (Kavya):**
- Weeks 5-7: Unit tests, test plan creation
- Weeks 8: Integration test setup

### Week 9 (Feb 21 - Feb 27)

**Phase:** Integration & Testing - Week 1

| Activity | Owner | Deliverable |
|----------|-------|------------|
| API-Frontend integration testing | Bhavya, Pushkarjay | Integration test report |
| ML service integration | Anushka, Pushkarjay | ML APIs working |
| End-to-end user flow testing | Kavya | E2E test results |
| Performance load test | Pushkarjay, Kavya | Load test report |
| Bug tracking & fixes | All | Bug tracker updated |

### Week 10 (Feb 28 - Mar 6)

**Phase:** Integration & Testing - Week 2

| Activity | Owner | Deliverable |
|----------|-------|------------|
| Security audit & penetration testing | Pushkarjay, Kavya | Security report |
| Performance optimization | Pushkarjay, Bhavya | Optimized endpoints |
| Bug fixes from Week 9 | All | Zero critical bugs |
| Documentation refinement | Kavya | Updated docs |
| Final integration testing | All | All tests passing |

### Week 11 (Mar 7 - Mar 13)

**Phase:** Deployment

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mar 7 | CI/CD pipeline setup (GitHub Actions) | Pushkarjay | Planned |
| Mar 8 | GCP Cloud Run deployment | Pushkarjay | Planned |
| Mar 9 | Database migration to Cloud SQL | Pushkarjay | Planned |
| Mar 10 | Monitoring & logging setup | Pushkarjay | Planned |
| Mar 11 | User guide creation | Kavya | Planned |
| Mar 12 | API documentation finalization | Kavya | Planned |
| Mar 13 | Deployment verification | All | Planned |

### Week 12 (Mar 14 - Mar 20)

**Phase:** Final Testing & Documentation

| Day | Task | Owner | Status |
|-----|------|-------|--------|
| Mar 14 | User acceptance testing (UAT) | Kavya | Planned |
| Mar 15 | Performance testing in production | Pushkarjay | Planned |
| Mar 16 | Final bug fixes | All | Planned |
| Mar 17 | Release notes & changelog | Kavya | Planned |
| Mar 18 | Technical documentation review | All | Planned |
| Mar 19 | Team demo dry run | All | Planned |
| Mar 20 | Final adjustments | All | Planned |

### Week 13-14 (Mar 21 - Mar 28)

**Phase:** Final Presentation & Submission

| Activity | Owner | Deliverable |
|----------|-------|------------|
| Project report compilation | Kavya | Final Report (50+ pages) |
| Presentation preparation | All | Presentation slides |
| Source code repository finalization | Pushkarjay | GitHub repo with all code |
| Demo application setup | All | Live demo ready |
| Deployment documentation | Pushkarjay | Deployment guide |
| Final review & adjustments | All | Final submission ready |

---

## Gantt Chart

```
Timeline: January 10 - March 28, 2026 (14 weeks)

Week 1:  [Planning & Analysis======]
Week 2:  [System Design===========]
Week 3:  [Design finalization======]
Week 4:  [Backend Setup=====][Frontend Setup====][ML Setup===]
Week 5:  [Backend Dev=========][Frontend Dev=====][ML Dev===]
Week 6:  [Backend Dev=========][Frontend Dev=====][ML Dev===]
Week 7:  [Backend Dev=========][Frontend Dev=====][ML Dev===]
Week 8:  [Backend Dev=========][Frontend Dev=====][Integration====]
Week 9:  [Integration Testing=========]
Week 10: [Integration & Bug Fixes====]
Week 11: [Deployment===========]
Week 12: [Final Testing & Docs==]
Week 13: [Final Adjustments===]
Week 14: [Report & Submission=]

Critical Path:
Backend Development (Weeks 5-8) → Integration Testing (Weeks 9-10) → Deployment (Week 11)

Slack Time: 3-4 days built into Week 12-13 for contingencies
```

---

## Resource Allocation

### Team Members Overview

| Member | Role | Primary Responsibility | Weeks Allocated |
|--------|------|----------------------|-----------------|
| **Pushkarjay Ajay** (22052328) | Backend Lead & Project Lead | API Design, Database, GCP Deployment | 14/14 |
| **Bhavya Singh** (2205120) | Frontend Developer | UI/UX, React Components | 12/14 |
| **Anushka Verma** (2205712) | Data Scientist | ML Models, Feature Engineering | 10/14 |
| **Kavya Dixit** (2205132) | QA & Documentation | Testing, Documentation | 14/14 |

### Weekly Effort Distribution

| Phase | Backend | Frontend | ML | QA/Docs | Total |
|-------|---------|----------|----|---------,-----------|
| Weeks 1-2 | 30% | 20% | 20% | 30% | 100% |
| Weeks 3-4 | 35% | 30% | 25% | 10% | 100% |
| Weeks 5-8 | 40% | 35% | 15% | 10% | 100% |
| Weeks 9-10 | 25% | 25% | 15% | 35% | 100% |
| Weeks 11-12 | 40% | 10% | 5% | 45% | 100% |
| Weeks 13-14 | 15% | 5% | 5% | 75% | 100% |

### Hardware & Software Requirements

**Development Environment:**
- 4x Laptops (4GB RAM min., 8GB recommended)
- IDE: VS Code with extensions
- Database: MySQL 8.0 (local and Cloud)
- Python 3.9+ with virtual environment
- Node.js 16+
- Git for version control

**Cloud Resources (GCP):**
- Cloud Run (serverless container hosting)
- Cloud SQL (managed MySQL)
- Cloud Storage (data lake)
- Cloud Monitoring (APM)

---

## Milestones & Deliverables

### Major Milestones

**M1: SRS & Design Approval (Week 2)**
- Deliverable: Comprehensive SRS document
- Gate: Technical review and approval
- Owner: Pushkarjay

**M2: Dev Environment Ready (Week 3)**
- Deliverable: Fully configured development environment, Git repo
- Gate: Team can start feature development
- Owner: Pushkarjay

**M3: API Endpoints 80% Complete (Week 7)**
- Deliverable: 40+ API endpoints implemented
- Gate: Frontend can integrate with APIs
- Owner: Pushkarjay

**M4: Frontend 80% Complete (Week 8)**
- Deliverable: 3 user portals with 80% features
- Gate: Ready for integration testing
- Owner: Bhavya

**M5: ML Model > 0.85 R² (Week 7)**
- Deliverable: Trained models with target performance
- Gate: Models acceptable for production
- Owner: Anushka

**M6: Integration Testing Complete (Week 10)**
- Deliverable: All integration tests passing, <1% error rate
- Gate: Ready for deployment
- Owner: Kavya

**M7: Production Deployment (Week 11)**
- Deliverable: Live system on GCP with monitoring
- Gate: System accessible to end-users
- Owner: Pushkarjay

**M8: Final Submission Ready (Week 14)**
- Deliverable: All documentation, presentation, source code
- Gate: Ready for evaluation
- Owner: Kavya

### Key Deliverables Schedule

| Deliverable | Type | Week | Owner |
|------------|------|------|-------|
| SRS Document | Documentation | 2 | Pushkarjay |
| System Architecture | Documentation | 2 | Pushkarjay |
| Database Schema | Design | 3 | Pushkarjay |
| API Documentation | Documentation | 4 | Pushkarjay |
| UI Wireframes | Design | 4 | Bhavya |
| Authentication APIs | Code | 5 | Pushkarjay |
| Auth Pages | Code | 5 | Bhavya |
| Data Preprocessing Pipeline | Code | 6 | Anushka |
| Station Search UI | Code | 6 | Bhavya |
| Station Management APIs | Code | 6 | Pushkarjay |
| ML Models (v1.0) | Code/Model | 7 | Anushka |
| Admin Dashboard UI | Code | 8 | Bhavya |
| Integration Tests | Tests | 9 | Kavya |
| Performance Report | Document | 10 | Kavya |
| GCP Deployment | Infrastructure | 11 | Pushkarjay |
| User Guide | Documentation | 11 | Kavya |
| Technical Documentation | Documentation | 12 | Kavya |
| Final Project Report | Documentation | 13 | Kavya |

---

## Risk & Contingency

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-----------|--------|-----------|
| API complexity higher than expected | Medium | High | Early design review, incremental delivery |
| Database performance issues at scale | Low | High | Performance testing, indexing optimization |
| ML model doesn't meet R² > 0.85 target | Medium | Medium | Feature engineering iterations, try alternative models |
| Team member unavailability | Low | High | Knowledge sharing sessions, documentation |
| GCP quota/cost overruns | Low | Medium | Cost monitoring, resource limits setup |
| Integration issues between components | Medium | High | Weekly integration syncs, early integration testing |

### Contingency Plans

**Risk: API Development Falls Behind Schedule**
- **Trigger:** 20% behind by Week 7
- **Action:** Prioritize critical APIs, defer nice-to-have endpoints
- **Buffer:** 1 week built into schedule (Week 13)

**Risk: ML Model Performance Below Target**
- **Trigger:** R² < 0.82 after Week 7
- **Action:** Try alternative algorithms (XGBoost), feature engineering review
- **Buffer:** 2 additional weeks for model R&D (hypothetically available)

**Risk: Frontend-Backend Integration Delays**
- **Trigger:** >10% test failures in Week 9
- **Action:** Daily sync meetings, immediate bug fixing protocol
- **Buffer:** 1 week extension possible (Week 13)

**Risk: GCP Deployment Issues**
- **Trigger:** Deployment failures in Week 11
- **Action:** Fallback to Cloud Shell manual deployment, Docker testing
- **Buffer:** Alternative: Deploy to Heroku/Render (1-2 days)

---

## Success Criteria

### Must-Have Criteria (MVP)
- [ ] Complete SRS with all 11 sections
- [ ] Functional EV User portal (search, map, book)
- [ ] Functional Admin dashboard
- [ ] 50+ API endpoints implemented
- [ ] ML model with R² > 0.82
- [ ] Deployed on GCP with monitoring
- [ ] Unit test coverage > 70%
- [ ] API response time < 2 seconds (p95)
- [ ] 99%+ uptime during testing period

### Nice-to-Have Criteria
- [ ] Unit test coverage > 90%
- [ ] Mobile-responsive UI (worked on but not primary focus)
- [ ] Advanced analytics dashboard with Plotly visualizations
- [ ] Payment integration (placeholder for future)
- [ ] Multi-language support (English + Hindi)

### Evaluation Metrics
- **Code Quality:** Pylint score > 8/10, Test coverage > 80%
- **Performance:** API latency < 1s (average), < 3s (p95)
- **Scalability:** Handle 1000+ concurrent users
- **Reliability:** 99%+ uptime, automatic recovery
- **Documentation:** 50+ page project report, complete API docs

---

*End of Project Timeline & Milestones Document*
