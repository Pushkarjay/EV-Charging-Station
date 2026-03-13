# Backend - FastAPI & MySQL

## Overview
This folder contains the FastAPI backend server for the EV Charging Station platform with MySQL database and microservices architecture.

## Folder Structure

```
backend/
├── app/
│   ├── api/            # API endpoint routes (routers)
│   ├── models/         # SQLAlchemy ORM models for database
│   ├── schemas/        # Pydantic request/response schemas
│   ├── services/       # Business logic and core functionality
│   ├── auth/           # Authentication and authorization logic
│   └── __init__.py
├── tests/              # Unit and integration tests
├── config/             # Configuration files (database, logging, etc.)
├── requirements.txt    # Python dependencies
├── main.py             # FastAPI application entry point
└── README.md           # This file
```

## Key Responsibilities

- **API Routes**: RESTful endpoints for stations, chargers, reservations, analytics
- **Database Models**: SQLAlchemy ORM for MySQL tables and relationships
- **Schemas**: Pydantic models for request validation and response serialization
- **Business Logic**: Core services for charging, billing, analytics, ML predictions
- **Authentication**: JWT tokens, user roles, permission management
- **Tests**: Unit tests, integration tests, API endpoint tests

## Tech Stack

- **Framework**: FastAPI 0.100+
- **Database**: MySQL 8.0 with SQLAlchemy ORM
- **Authentication**: JWT (python-jose)
- **Serialization**: Pydantic v2
- **Validation**: Pydantic with custom validators
- **Background Tasks**: Celery + Redis (optional)
- **Testing**: Pytest, Pytest-asyncio
- **Documentation**: Auto-generated OpenAPI/Swagger

## Getting Started

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   ```bash
   cp credentials/.env.example .env
   # Edit .env with your database and API credentials
   ```

3. Run database migrations:
   ```bash
   alembic upgrade head
   ```

4. Start development server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Access API docs at http://localhost:8000/docs

## Project Structure Explanation

### app/api/
Contains route modules organized by feature:
- `stations.py` - Station CRUD and search endpoints
- `chargers.py` - Charger status and management
- `reservations.py` - Booking and reservation endpoints
- `users.py` - User profile and authentication
- `analytics.py` - Usage statistics and reporting
- `predictions.py` - ML model predictions (demand forecasting)

### app/models/
SQLAlchemy SQLModel definitions:
- `User`, `Station`, `Charger`, `Connector`
- `Reservation`, `Session`, `Transaction`
- `Analytics`, `PredictionResult`

### app/services/
Business logic separation:
- `user_service.py` - User management and authentication
- `station_service.py` - Station and charger operations
- `reservation_service.py` - Booking and schedule management
- `analytics_service.py` - Data aggregation and reporting
- `prediction_service.py` - ML model integration

### app/auth/
- `jwt_handler.py` - Token generation and validation
- `dependencies.py` - FastAPI dependency injection
- `permissions.py` - Role-based access control

## Development Guidelines

- Use async/await patterns for I/O operations
- Implement proper error handling with HTTPException
- Validate all inputs with Pydantic schemas
- Use dependency injection for services and database connections
- Write comprehensive docstrings for API endpoints
- Add proper logging for debugging
- Use database transactions for consistency

## Testing

```bash
pytest                          # Run all tests
pytest -v                       # Verbose output
pytest --cov=app               # With coverage report
pytest tests/api/test_stations.py  # Specific test file
```

## Database

Schema and relationships in [Documnets/DATABASE_SCHEMA.md](../Documnets/DATABASE_SCHEMA.md)

## API Documentation

Auto-generated at `/docs` endpoint using OpenAPI/Swagger.

## Related Documentation

- See [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) for system overview
- See [Documnets/SRS.md](../Documnets/SRS.md) for API requirements
- See [Documnets/DATABASE_SCHEMA.md](../Documnets/DATABASE_SCHEMA.md) for database design
- See [docs/api/](../docs/api/) for detailed API documentation
