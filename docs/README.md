# Project Documentation

## Overview
Complete documentation for the EV Charging Station platform, including API specifications, architecture, deployment guides, and team guidelines.

## Folder Structure

```
docs/
├── api/                # API endpoint documentation
├── architecture/       # System architecture and design decisions
└── README.md          # This file
```

## Documentation Index

### API Documentation (docs/api/)

Comprehensive API reference including:
- **Endpoint Specifications**: All REST API endpoints with request/response examples
- **Authentication**: JWT token usage and user roles
- **Error Codes**: Complete error reference with solutions
- **Rate Limiting**: API quotas and throttling policies
- **Examples**: cURL, Postman, Python, JavaScript examples

**Access**: Auto-generated at backend `/docs` endpoint (Swagger UI)

### Architecture Documentation (docs/architecture/)

System design and technical decisions:
- **Architecture Overview**: System components and interactions
- **Database Design**: Entity relationships and data model
- **Data Flow**: Request flows and ML pipeline integration
- **Security**: Authentication, authorization, encryption
- **Performance**: Caching, indexing, optimization strategies
- **Scalability**: Load balancing, horizontal scaling, auto-scaling

### Main Documentation Files

All primary documentation is in `Documnets/` folder:

| Document | Purpose | Audience |
|----------|---------|----------|
| [Documnets/SRS.md](../Documnets/SRS.md) | Complete requirements specification | Product, Development, QA |
| [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) | System design and components | Architects, Senior Developers |
| [Documnets/DATABASE_SCHEMA.md](../Documnets/DATABASE_SCHEMA.md) | Database design and relationships | Database Admins, Backend Devs |
| [Documnets/DATA_FLOW_DIAGRAMS.md](../Documnets/DATA_FLOW_DIAGRAMS.md) | Process flows and DFD levels | System Designers, Business Analysts |
| [Documnets/ML_PIPELINE.md](../Documnets/ML_PIPELINE.md) | ML model development workflow | Data Scientists, ML Engineers |
| [Documnets/PROJECT_TIMELINE.md](../Documnets/PROJECT_TIMELINE.md) | Project schedule and milestones | Project Managers, Team Lead |

## Development Guidelines

- **[frontend/README.md](../frontend/README.md)** - React/Next.js development guide
- **[backend/README.md](../backend/README.md)** - FastAPI development guide
- **[data-science/README.md](../data-science/README.md)** - ML development guide
- **[cloud/README.md](../cloud/README.md)** - Cloud infrastructure guide

## Feature Documentation

### User Management & Authentication
- User registration and login flows
- JWT token management
- Role-based access control (User, Station Admin, System Admin)
- Password reset and security

### Charging Station Features
- Browse available charging stations
- Real-time charger status and availability
- Reserve charger slots
- Start/stop charging sessions
- Usage history and billing

### Analytics & Reporting
- User charging patterns and statistics
- Station utilization metrics
- Revenue analytics
- Peak demand analysis

### Data Science Features
- Demand forecasting (predict when chargers will be in demand)
- Fault detection (predict equipment failures)
- User segmentation (cluster users by behavior)
- Recommendations (suggest best charging times)

## API Quick Reference

### Core Endpoints

**Authentication**
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/refresh           - Refresh JWT token
POST   /api/auth/logout            - User logout
```

**Stations**
```
GET    /api/stations               - List all stations
GET    /api/stations/{id}          - Get station details
GET    /api/stations/search        - Search by location/filters
POST   /api/stations               - Create new station (Admin)
PUT    /api/stations/{id}          - Update station (Admin)
DELETE /api/stations/{id}          - Delete station (Admin)
GET    /api/stations/{id}/chargers - Get available chargers
```

**Chargers**
```
GET    /api/chargers/{id}          - Get charger status
GET    /api/chargers/{id}/slots    - Get available time slots
POST   /api/chargers/{id}/reserve  - Reserve charger slot
GET    /api/chargers/{id}/history  - Get usage history
```

**Reservations**
```
GET    /api/reservations           - User's reservations
POST   /api/reservations           - Create reservation
GET    /api/reservations/{id}      - Get reservation details
PUT    /api/reservations/{id}      - Update reservation
DELETE /api/reservations/{id}      - Cancel reservation
POST   /api/reservations/{id}/start - Start charging session
POST   /api/reservations/{id}/stop  - Stop charging session
```

**Analytics & Predictions**
```
GET    /api/analytics/usage        - User usage statistics
GET    /api/analytics/stations     - Station performance metrics
GET    /api/predictions/demand     - Demand forecast by location/time
GET    /api/predictions/faults     - Equipment fault predictions
```

For complete API reference, see [Documnets/SRS.md](../Documnets/SRS.md) API Endpoints section.

## Deployment & Operations

### Deployment Guides
- **Local Development**: `docker-compose up` with credentials/.env.local
- **Staging**: Manual deployment to dev environment
- **Production**: Automated CI/CD pipeline via GitHub Actions

### Monitoring & Health
- Application logs: GCP Cloud Logging
- Performance metrics: GCP Cloud Monitoring
- Alert policies: Service degradation, error rates
- Health checks: `/health`, `/health/ready`, `/health/live`

### Database Management
- Migrations: Alembic with version control
- Backups: Automated GCP Cloud SQL backups
- Disaster Recovery: RTO 1hr, RPO 1hr (see cloud/README.md)

## Contributing

### Code Quality
- Follow PEP 8 (Python), ESLint (JavaScript)
- Write unit tests for all features
- Maintain >80% code coverage
- Document with docstrings/JSDoc comments

### Git Workflow
1. Create feature branch: `git checkout -b feature/description`
2. Commit with clear messages: `git commit -m "feat: add support for X"`
3. Push and create pull request: `git push origin feature/description`
4. Request review and merge when approved

### Documentation Requirements
- Update relevant docs for new features
- Add API endpoint docs when creating routes
- Include examples and use cases
- Keep README files current

## Getting Help

### Resources
- **Technical Issues**: Check error logs in Cloud Logging
- **API Questions**: See `/docs` endpoint (Swagger UI)
- **Database Queries**: Review schema in [Documnets/DATABASE_SCHEMA.md](../Documnets/DATABASE_SCHEMA.md)
- **ML Models**: See [data-science/README.md](../data-science/README.md)
- **Deployment**: See [cloud/README.md](../cloud/README.md)

### Team Communication
- **Critical Issues**: Immediate escalation to team lead
- **Feature Discussion**: Team meetings (see PROJECT_TIMELINE.md)
- **Code Review**: Pull request comments on GitHub
- **Documentation Updates**: Create issues for missing docs

## Related Links

- **GitHub Repository**: https://github.com/Pushkarjay/EV-Charging-Station
- **Project Timeline**: [Documnets/PROJECT_TIMELINE.md](../Documnets/PROJECT_TIMELINE.md)
- **Team Roles**: [ROLES_AND_RESPONSIBILITIES.md](../ROLES_AND_RESPONSIBILITIES.md)
