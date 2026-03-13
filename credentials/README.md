# Credentials & Configuration Management

## Overview
Secure storage for environment variables, API keys, and sensitive configuration used across the project.

## ⚠️ SECURITY IMPORTANT

- **Never commit credentials to git**
- **Never expose private keys or tokens**
- **Always use `.gitignore` for sensitive files**
- **Use environment variables in production**
- **Rotate credentials regularly**

## Folder Structure

```
credentials/
├── .env.example        # Template for environment variables (COMMIT THIS)
├── .env.local          # Local environment variables (DO NOT COMMIT)
├── .env.development    # Development server env vars (DO NOT COMMIT)
├── .env.production     # Production env vars (DO NOT COMMIT)
├── keys/               # API keys and certificates (DO NOT COMMIT)
│   ├── gcp-service-key.json
│   ├── jwt-secret.key
│   └── ssl-certificates/
└── README.md           # This file
```

## Environment Variables

### .env.example (Template - ALWAYS COMMIT)

```
# Database
DATABASE_URL=mysql://username:password@localhost:3306/ev_charging
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# API Server
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=false
ENVIRONMENT=development

# Authentication
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Google Cloud Platform
GOOGLE_PROJECT_ID=ev-charging-project
GOOGLE_CREDENTIALS_PATH=./credentials/keys/gcp-service-key.json
GCP_REGION=us-central1

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-key-here

# Machine Learning
ML_MODEL_PATH=./data-science/models/demand_forecast.pkl
ML_SERVICE_URL=http://localhost:8001
PREDICTION_BATCH_SIZE=100

# Email (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Payment Processing (if applicable)
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# 3rd Party APIs
WEATHER_API_KEY=your-weather-api-key
TRAFFIC_API_KEY=your-traffic-api-key
```

## Setup Instructions

### Local Development

1. **Copy template**:
   ```bash
   cp credentials/.env.example credentials/.env.local
   ```

2. **Edit with your values**:
   ```bash
   # Edit credentials/.env.local with your actual values
   ```

3. **Load in application**:
   ```python
   # Python: use python-dotenv
   from dotenv import load_dotenv
   import os
   
   load_dotenv('credentials/.env.local')
   api_url = os.getenv('DATABASE_URL')
   ```

   ```javascript
   // JavaScript: use dotenv
   require('dotenv').config({ path: './credentials/.env.local' });
   const dbUrl = process.env.DATABASE_URL;
   ```

### Production Deployment

Use **Google Secrets Manager** or similar:

```bash
# Store secret in GCP
echo -n "mysql://prod-user:prod-pass@cloudsql/db" | \
  gcloud secrets create DATABASE_URL --data-file=-

# Retrieve in application
import google.cloud.secretmanager as secretmanager

client = secretmanager.SecretManagerServiceClient()
project_id = os.getenv('GOOGLE_PROJECT_ID')
secret_id = 'DATABASE_URL'
version_id = 'latest'

name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
response = client.access_secret_version(request={"name": name})
database_url = response.payload.data.decode("UTF-8")
```

### Docker & Cloud Run

Never hardcode secrets in Dockerfile. Instead:

```dockerfile
# DO NOT DO THIS:
ENV DATABASE_URL=mysql://...  # ❌ NO!

# DO THIS:
# Pass as build argument or reference from Secrets Manager
```

When deploying to Cloud Run:
```bash
gcloud run deploy service \
  --set-env-vars DATABASE_URL=mysql://... \
  --set-secrets DATABASE_PASSWORD=projects/PROJECT_ID/secrets/DB_PASSWORD/versions/latest
```

## API Keys & Service Accounts

### Google Cloud Platform

1. Create service account:
   ```bash
   gcloud iam service-accounts create ev-charging-app
   gcloud iam service-accounts keys create \
     credentials/keys/gcp-service-key.json \
     --iam-account=ev-charging-app@PROJECT_ID.iam.gserviceaccount.com
   ```

2. Grant necessary roles:
   ```bash
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member=serviceAccount:ev-charging-app@PROJECT_ID.iam.gserviceaccount.com \
     --role=roles/cloudsql.client
   ```

3. Reference in code:
   ```python
   from google.oauth2 import service_account
   
   credentials = service_account.Credentials.from_service_account_file(
       'credentials/keys/gcp-service-key.json'
   )
   ```

### JWT Secret Key

Generate a secure random key:

```bash
# Linux/Mac:
openssl rand -hex 32

# Python:
import secrets
print(secrets.token_hex(32))
```

Store in `credentials/keys/jwt-secret.key` (DO NOT COMMIT)

## Git Configuration

Ensure sensitive files are ignored:

```bash
# .gitignore entries (already configured):
credentials/.env.local
credentials/.env.development
credentials/.env.production
credentials/keys/
!credentials/.env.example
!credentials/README.md
```

Verify nothing sensitive is tracked:
```bash
git status  # Should show no credential files
```

## SSL Certificates

For HTTPS in production:

```bash
# Store certificates in credentials/keys/ssl-certificates/
mkdir -p credentials/keys/ssl-certificates

# Copy your certificates:
cp /path/to/cert.pem credentials/keys/ssl-certificates/
cp /path/to/key.pem credentials/keys/ssl-certificates/

# Reference in application:
SSL_CERT_PATH=credentials/keys/ssl-certificates/cert.pem
SSL_KEY_PATH=credentials/keys/ssl-certificates/key.pem
```

## Credential Rotation

**Schedule regular rotation:**
- API Keys: Every 90 days
- Database passwords: Every 60 days
- JWT secrets: When deploying major updates
- Certificates: Before expiration (auto-renewal recommended)

## Troubleshooting

### Error: "Credentials not found"
```
Solution: Ensure .env.local exists and has correct values
```

### Error: "Invalid DATABASE_URL"
```
Solution: Check credentials/.env.local has correct connection string
Example: mysql://username:password@host:3306/database
```

### Error: "GCP authentication failed"
```
Solution: Verify gcp-service-key.json path and service account permissions
```

## Related Documentation

- See [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) for security architecture
- See [cloud/README.md](../cloud/README.md) for GCP setup
- See [backend/README.md](../backend/README.md) for backend configuration
