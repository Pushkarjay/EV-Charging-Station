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

## How to Obtain Credentials

### Database Credentials
**For Local Development:**
```bash
# Create MySQL database and user
mysql -u root -p
CREATE DATABASE ev_charging;
CREATE USER 'ev_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON ev_charging.* TO 'ev_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

**For Production (Google Cloud SQL):**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to SQL → Instances
3. Click "Create Instance" → Choose MySQL 8.0
4. Create root user password during setup
5. Add new database user for application
6. Connection string format: `mysql://user:password@INSTANCE_CONNECTION_NAME/database`

### Google Cloud Platform (GCP)
1. **Create GCP Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Click "Select a Project" → "New Project"
   - Enter project name: `ev-charging-dev` or `ev-charging-prod`
   - Wait for project creation (2-3 minutes)

2. **Create Service Account:**
   ```bash
   gcloud init  # Initialize gcloud CLI
   gcloud auth login  # Login to GCP
   gcloud config set project ev-charging-dev
   
   # Create service account
   gcloud iam service-accounts create ev-charging-app \
     --display-name "EV Charging Application"
   
   # Create and download JSON key
   gcloud iam service-accounts keys create credentials/keys/gcp-service-key.json \
     --iam-account=ev-charging-app@PROJECT_ID.iam.gserviceaccount.com
   ```

3. **Grant Required Roles:**
   ```bash
   gcloud projects add-iam-policy-binding ev-charging-dev \
     --member=serviceAccount:ev-charging-app@ev-charging-dev.iam.gserviceaccount.com \
     --role=roles/cloudsql.client
   
   gcloud projects add-iam-policy-binding ev-charging-dev \
     --member=serviceAccount:ev-charging-app@ev-charging-dev.iam.gserviceaccount.com \
     --role=roles/storage.admin
   
   gcloud projects add-iam-policy-binding ev-charging-dev \
     --member=serviceAccount:ev-charging-app@ev-charging-dev.iam.gserviceaccount.com \
     --role=roles/bigquery.dataEditor
   ```

4. **Get Project ID:**
   ```bash
   gcloud config get-value project
   # Copy the output to GOOGLE_PROJECT_ID
   ```

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable APIs & Services → Click "Enable APIs and Services"
3. Search for "Maps" and enable these APIs:
   - **Google Maps JavaScript API**
   - **Google Maps Platform - Distance Matrix API**
   - **Places API**
   - **Geolocation API**
4. Go to Credentials → Click "Create Credentials" → "API Key"
5. Copy the API key to both:
   - `REACT_APP_GOOGLE_MAPS_API_KEY=` (frontend)
   - `GOOGLE_MAPS_API_KEY=` (backend)

### JWT Secret Key
Generate a secure random key:
```bash
# Linux/Mac:
openssl rand -hex 32

# Python:
python -c "import secrets; print(secrets.token_hex(32))"

# PowerShell (Windows):
[guid]::NewGuid().ToString().Replace('-','').Substring(0, 32)
```
Copy output to `SECRET_KEY=`

### SMTP Email Configuration
**Using Gmail:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" (if not enabled)
3. Generate App Password:
   - Go to Security → App passwords
   - Select "Mail" and "Windows Computer" (or your platform)
   - Google generates a 16-character password
4. Use credentials:
   ```
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=generated-16-char-password
   ```

**Using SendGrid:**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Go to Settings → API Keys → Create API Key
3. Use credentials:
   ```
   SMTP_SERVER=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USERNAME=apikey
   SMTP_PASSWORD=SG.your-api-key-here
   ```

### Redis Configuration
**Local Development:**
- Install Redis: [Download](https://redis.io/download) or `brew install redis` (Mac)
- Start Redis: `redis-server`
- Connection string: `redis://localhost:6379/0`

**Production (Google Cloud Memorystore):**
1. Go to Memorystore → Redis → Create Instance
2. Choose instance size and region
3. Get connection details from instance settings
4. Connection string: `redis://INSTANCE_IP:6379/0`

### Stripe API Keys
1. Sign up at [Stripe](https://stripe.com)
2. Go to Developers → API Keys
3. You'll see two keys:
   - **Publishable Key** (public) → `STRIPE_PUBLISHABLE_KEY=pk_test_xxx`
   - **Secret Key** (private) → `STRIPE_API_KEY=sk_test_xxx`
4. For webhooks:
   - Go to Developers → Webhooks
   - Create webhook endpoint for `http://your-domain/api/webhooks/stripe`
   - Copy webhook secret → `STRIPE_WEBHOOK_SECRET=whsec_xxx`

### Third-Party API Keys

**OpenWeatherMap (Weather API):**
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Go to API keys section
3. Copy your API key → `WEATHER_API_KEY=`
4. API URL: `https://api.openweathermap.org`

**Google Traffic/Maps Traffic:**
- Included with Google Maps API (see above)
- `TRAFFIC_API_KEY=` can reference same key as maps

**Other Services:**
- Find the service's API documentation
- Sign up for API access
- Generate API key in service's dashboard
- Copy to corresponding environment variable

### Redis (Caching & Sessions)
**Local Setup:**
```bash
# Install Redis
brew install redis  # Mac
sudo apt-get install redis-server  # Linux
choco install redis  # Windows (via Chocolatey)

# Start Redis
redis-server

# Verify connection
redis-cli ping  # Should return PONG
```

**Production Setup (Google Memorystore):**
```bash
# Create Memorystore instance
gcloud redis instances create ev-charging-cache \
  --region=us-central1 \
  --size=1 \
  --tier=basic

# Get connection details
gcloud redis instances describe ev-charging-cache \
  --region=us-central1 \
  --format='value(host,port)'
```

### Sentry Error Tracking
1. Sign up at [Sentry](https://sentry.io)
2. Create a project for your application
3. Copy the DSN (Data Source Name)
4. Format: `https://key@organization.ingest.sentry.io/project-id`
5. Add to `.env`: `SENTRY_DSN=`

### Datadog Monitoring (Optional)
1. Sign up at [Datadog](https://www.datadoghq.com)
2. Go to Organization Settings → API Keys
3. Create new API key
4. Add to `.env`: `DATADOG_API_KEY=`

### AWS Credentials (If using AWS instead of GCP)
1. Go to [AWS Console](https://console.aws.amazon.com)
2. Navigate to IAM → Users → Add User
3. Attach policies (S3, RDS, EC2 access needed)
4. Go to Security Credentials → Create Access Key
5. Save credentials:
   ```
   AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
   AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
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

---

## 📋 Quick Credential Setup Checklist

Use this checklist to track which credentials you've obtained:

### Essential Credentials (Required for local/production)
- [ ] **DATABASE_URL** - MySQL connection string
  - Local: `mysql://ev_user:password@localhost:3306/ev_charging`
  - Production: Cloud SQL connection name
  
- [ ] **GOOGLE_PROJECT_ID** - Your GCP project ID
  - Get from: GCP Console → Project Settings
  
- [ ] **GOOGLE_CREDENTIALS_PATH** - Path to GCP service account key
  - Get from: GCP Console → IAM → Service Accounts → Keys
  - File: `credentials/keys/gcp-service-key.json`

- [ ] **SECRET_KEY** - JWT signing key
  - Generate using: `openssl rand -hex 32`
  
- [ ] **REACT_APP_API_URL** - Backend API URL
  - Local: `http://localhost:8000/api`
  - Production: `https://your-domain.com/api`

### Mapping & Location Services
- [ ] **REACT_APP_GOOGLE_MAPS_API_KEY** - Google Maps JavaScript API
  - Get from: [Google Cloud Console](https://console.cloud.google.com) → APIs → Maps JavaScript API
  
- [ ] **GOOGLE_MAPS_API_KEY** - Backend Maps service (can be same as above)

### Email Services
- [ ] **SMTP_SERVER** - Email provider (e.g., smtp.gmail.com)
- [ ] **SMTP_PORT** - Email port (587 for TLS, 465 for SSL)
- [ ] **SMTP_USERNAME** - Email address or username
- [ ] **SMTP_PASSWORD** - Email password or app password
- [ ] **SMTP_FROM_EMAIL** - Sender email address

### Caching & Sessions
- [ ] **REDIS_URL** - Redis connection string
  - Local: `redis://localhost:6379/0`
  - Production: Google Memorystore

### Payment Processing (Optional)
- [ ] **STRIPE_API_KEY** - Stripe secret key (sk_test_xxx)
  - Get from: [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys
  
- [ ] **STRIPE_PUBLISHABLE_KEY** - Stripe publishable key (pk_test_xxx)
  
- [ ] **STRIPE_WEBHOOK_SECRET** - Stripe webhook secret (whsec_xxx)
  - Get from: Stripe Dashboard → Developers → Webhooks

### Third-Party APIs (Optional)
- [ ] **WEATHER_API_KEY** - OpenWeatherMap API key
  - Get from: [OpenWeatherMap](https://openweathermap.org/api)
  
- [ ] **SENTRY_DSN** - Sentry error tracking
  - Get from: [Sentry.io](https://sentry.io) → Project Settings
  
- [ ] **DATADOG_API_KEY** - Datadog monitoring (optional)
  - Get from: [Datadog](https://www.datadoghq.com) → Organization Settings → API Keys

### ML/Data Science
- [ ] **ML_MODEL_PATH** - Path to trained ML model
  - Path: `./data-science/models/demand_forecast_latest.pkl`
  
- [ ] **ML_SERVICE_URL** - ML service endpoint
  - Local: `http://localhost:8001`

### Development/Debugging
- [ ] **DEBUG** - Enable debug mode (true/false)
  - Local: true
  - Production: false
  
- [ ] **ENVIRONMENT** - Environment name
  - Options: development, staging, production

---

## ⚠️ Security Tips While Setting Up

1. **Keep .env Files Private**
   - Never commit .env files to git
   - Use .gitignore to prevent accidental commits
   - Always use .env.example as template

2. **Rotate Keys Regularly**
   - API Keys: Every 90 days
   - Database passwords: Every 60 days
   - JWT secrets: When major updates

3. **Use Strong Passwords**
   - Database: Minimum 16 characters, mixed case + numbers + symbols
   - API Keys: Use provider's generated keys (more secure)

4. **Minimal Permissions**
   - Create service accounts with minimal required permissions
   - Use different credentials for dev/staging/production
   - Don't reuse production keys in development

5. **Secrets Management**
   - Local: Use .env.local
   - Production: Use Google Secrets Manager or AWS Secrets Manager
   - Never hardcode credentials in code

6. **Secure Communication**
   - Always use HTTPS in production
   - Enable SSL/TLS for database connections
   - Use connection pooling (avoid connection overhead)

---

## Troubleshooting Credential Issues

### "Database connection refused"
```bash
# Check if database is running
mysql -u root -p
# Check DATABASE_URL format: mysql://user:pass@host:3306/db
```

### "GCP authentication failed"
```bash
# Verify service account key exists
ls credentials/keys/gcp-service-key.json
# Check service account has required roles
gcloud projects get-iam-policy ev-charging-dev \
  --flatten="bindings[].members" \
  --format="table(bindings.role)" \
  --filter="bindings.members:ev-charging-app*"
```

### "Email service not working"
```bash
# Test SMTP connection
python -c "
import smtplib
server = smtplib.SMTP('smtp.gmail.com', 587)
server.starttls()
server.login('your-email@gmail.com', 'app-password')
server.quit()
print('SMTP OK')
"
```

### "Invalid API key"
- Verify API is enabled in Google Cloud Console
- Check key hasn't expired (rare but possible)
- Ensure API key has correct restrictions (if set)
- Regenerate API key if all else fails

### "Redis connection timeout"
```bash
# Check if Redis is running
redis-cli ping  # Should return PONG
# Verify connection string: redis://host:port/db
```

---

## Related Documentation

- See [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) for security architecture
- See [cloud/README.md](../cloud/README.md) for GCP setup
- See [backend/README.md](../backend/README.md) for backend configuration
