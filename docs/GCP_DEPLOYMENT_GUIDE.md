# 🚀 GCP Deployment Guide - Production Setup

**Date**: March 17, 2026  
**Status**: 📋 Configuration Ready  
**Project**: gcs-ev-charging-station

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Database Setup](#database-setup)
7. [Deployment Links & Status](#deployment-links--status)
8. [Monitoring & Logging](#monitoring--logging)
9. [Scaling & Performance](#scaling--performance)

---

## Overview

Your EV Charging Station platform will be deployed across Google Cloud Platform with the following architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloud CDN & Load Balancer                │
│              (Frontend + Static Assets Distribution)        │
└────────┬────────────────────────────────────────────────────┘
         │
    ┌────┴─────┬──────────────────────┐
    │           │                      │
    ▼           ▼                      ▼
┌─────────┐ ┌──────────┐      ┌──────────────┐
│ Cloud   │ │ Cloud    │      │  Google      │
│ Storage │ │ Run      │      │  Maps API    │
│ (Bucket)│ │ (Backend)│      │  (External)  │
│Frontend │ │ FastAPI  │      └──────────────┘
└─────────┘ └────┬─────┘
                 │
            ┌────▼──────┐
            │  Cloud     │
            │  SQL       │
            │ (MySQL)    │
            └────┬───────┘
                 │
            Database Backups
```

---

## Prerequisites

### 1. GCP Account & Project Setup ✅

**Project Details**:
- **Project ID**: `gcs-ev-charging-station`
- **Project Number**: 329478150613
- **Region**: us-central1 (recommended for North America)
  - Asia-South: asia-south1 (for India/Asia)
  - Europe: europe-west1 (for Europe)

**Already Configured**:
- ✅ Service Account: `gcs-sa-1@gcs-ev-charging-station.iam.gserviceaccount.com`
- ✅ Service Account Key: `credentials/keys/gcp-service-key.json`
- ✅ Roles Assigned: Cloud Run Admin, Cloud SQL Client, Storage Admin

### 2. Local Tools Required

```bash
# Install Google Cloud CLI
# macOS
brew install google-cloud-sdk

# Windows - PowerShell
choco install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash

# Verify installation
gcloud --version
```

### 3. Authentication

```bash
# Authenticate with your service account key
gcloud auth activate-service-account --key-file=credentials/keys/gcp-service-key.json

# Set default project
gcloud config set project gcs-ev-charging-station

# Verify authentication
gcloud auth list
```

---

## Infrastructure Setup

### Phase 1: Cloud SQL Database (MySQL)

#### A. Create Cloud SQL Instance

```bash
# Using gcloud CLI
gcloud sql instances create ev-charging-db \
  --database-version=MYSQL_8_0 \
  --region=us-central1 \
  --tier=db-f1-micro \  # Start with micro for testing
  --availability-type=ZONAL \
  --storage-type=PD_SSD \
  --storage-size=10GB \
  --enable-bin-log \
  --backup-start-time=03:00

# Wait for instance to be created (3-5 minutes)
gcloud sql instances describe ev-charging-db
```

**Instance Details**:
- **Instance Name**: ev-charging-db
- **Machine Type**: db-f1-micro (1 vCPU, 614MB RAM) → Upgrade to db-n1-standard-1 for production
- **Storage**: 10GB SSD → Upgrade to 100GB+ for production data
- **Backup**: Automated daily backups at 3:00 AM UTC
- **Region**: us-central1 (us-central1-a)

#### B. Create Database & User

```bash
# Create database
gcloud sql databases create ev_charging \
  --instance=ev-charging-db \
  --charset=utf8mb4

# Create user
gcloud sql users create ev_user \
  --instance=ev-charging-db \
  --password=YOUR_SECURE_PASSWORD

# Get connection details
gcloud sql instances describe ev-charging-db \
  --format='get(ipAddresses[0].ipAddress)'
```

**Connection String** (for backend .env):
```
DATABASE_URL=mysql+pymysql://ev_user:YOUR_PASSWORD@INSTANCE_IP:3306/ev_charging

# For Cloud Run (better):
DATABASE_URL=mysql+pymysql://ev_user:YOUR_PASSWORD@/ev_charging?unix_socket=/cloudsql/gcs-ev-charging-station:us-central1:ev-charging-db
```

#### C. Configure Network Access

```bash
# For local development: Allow your IP
gcloud sql instances patch ev-charging-db \
  --authorized-networks=YOUR_IP_ADDRESS

# For Cloud Run: Use Cloud SQL Auth Proxy (automatically configured)
```

**Production**: Use Cloud SQL Connector from Cloud Run - NO need to expose to internet

### Phase 2: Cloud Storage (Frontend & Files)

#### A. Create Storage Bucket

```bash
# Create bucket for frontend
gsutil mb -p gcs-ev-charging-station \
  -c STANDARD \
  -l us-central1 \
  -b on \
  gs://gcs-ev-charging-frontend

# Create bucket for backend files (uploads, data)
gsutil mb -p gcs-ev-charging-station \
  -c STANDARD \
  -l us-central1 \
  gs://gcs-ev-charging-data

# Create bucket for ML models
gsutil mb -p gcs-ev-charging-station \
  -c NEARLINE \
  -l us-central1 \
  gs://gcs-ev-charging-ml-models
```

**Buckets**:
- **Frontend Bucket**: `gs://gcs-ev-charging-frontend`
  - Store: Next.js built files (out/ directory)
  - Attach Cloud CDN + Load Balancer
  
- **Data Bucket**: `gs://gcs-ev-charging-data`
  - Store: User uploads, datasets
  - Versioning: Enabled
  
- **ML Bucket**: `gs://gcs-ev-charging-ml-models`
  - Store: Trained models, predictions
  - Lifecycle: Auto-delete old versions

#### B. Configure Bucket Permissions

```bash
# Allow frontend bucket to be public (read-only)
gsutil iam ch serviceAccount:gcs-sa-1@gcs-ev-charging-station.iam.gserviceaccount.com:objectViewer gs://gcs-ev-charging-frontend

# Allow backend to write to data bucket
gsutil iam ch serviceAccount:gcs-sa-1@gcs-ev-charging-station.iam.gserviceaccount.com:objectEditor gs://gcs-ev-charging-data
```

#### C. Upload Frontend Files

```bash
# Build frontend
cd frontend
npm run build

# Upload to GCS (happens automatically with deployment pipeline)
gsutil -m cp -r out/* gs://gcs-ev-charging-frontend/

# Set cache control
gsutil -h "Cache-Control:public, max-age=31536000" \
  cp -r out/_next gs://gcs-ev-charging-frontend/
```

### Phase 3: Cloud Run (Backend Deployment)

#### A. Enable Required APIs

```bash
# Enable necessary APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  compute.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com
```

#### B. Build Docker Image

```bash
# Build and push to Container Registry
gcloud builds submit \
  --tag gcr.io/gcs-ev-charging-station/ev-backend:latest \
  --substitutions=BRANCH_NAME=main

# Or manually:
docker build -t gcr.io/gcs-ev-charging-station/ev-backend:latest backend/
docker push gcr.io/gcs-ev-charging-station/ev-backend:latest
```

#### C. Deploy to Cloud Run

```bash
gcloud run deploy ev-backend \
  --image gcr.io/gcs-ev-charging-station/ev-backend:latest \
  --region us-central1 \
  --platform managed \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60 \
  --max-instances 100 \
  --no-allow-unauthenticated \
  --set-env-vars "ENVIRONMENT=production,DEBUG=false" \
  --add-cloudsql-instances gcs-ev-charging-station:us-central1:ev-charging-db \
  --service-account gcs-sa-1@gcs-ev-charging-station.iam.gserviceaccount.com

# Get service URL
gcloud run services describe ev-backend \
  --region us-central1 \
  --platform managed
```

**Deployed Backend URL**: 
```
https://ev-backend-[HASH]-uc.a.run.app
```

### Phase 4: Cloud Load Balancer & CDN

#### A. Create Load Balancer

Directed through Cloud Load Balancing console at: **https://console.cloud.google.com/net-services/loadbalancing**

**Configuration**:
- **Frontend Protocol**: HTTPS (SSL Certificate)
- **Backend**:
  - Cloud Storage for static files
  - Cloud Run for API requests
- **URL Map**:
  - `/api/*` → Cloud Run backend
  - `/*` → Cloud Storage (frontend)

#### B. SSL Certificate

```bash
# Create managed SSL certificate
gcloud compute ssl-certificates create ev-charging-cert \
  --domains=yourdomain.com
```

---

## Backend Deployment

### Docker Configuration

**File**: `backend/Dockerfile` (Already created ✓)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
RUN apt-get update && apt-get install -y gcc
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Configuration

**File**: `backend/.env` (Already configured with GCP credentials ✓)

For production, create a **separate production `.env.production`**:

```env
# Production database (Cloud SQL)
DATABASE_URL=mysql+pymysql://ev_user:PASSWORD@/ev_charging?unix_socket=/cloudsql/gcs-ev-charging-station:us-central1:ev-charging-db

# Google Cloud
GOOGLE_PROJECT_ID=gcs-ev-charging-station
GOOGLE_CREDENTIALS_PATH=/etc/gcp/service-account-key.json
GCP_BUCKET_NAME=gcs-ev-charging-data
GCP_ML_BUCKET_NAME=gcs-ev-charging-ml-models

# API
DEBUG=false
ENVIRONMENT=production
CORS_ORIGINS=["https://yourdomain.com"]

# Security
SECRET_KEY=your-production-secret-key-min-64-chars

# Logging
LOG_LEVEL=INFO
```

### Deployment Steps

```bash
# Navigate to backend
cd backend

# Build locally for testing
docker build -t ev-backend:latest .

# Tag for GCP Container Registry
docker tag ev-backend:latest gcr.io/gcs-ev-charging-station/ev-backend:latest

# Push to GCP
docker push gcr.io/gcs-ev-charging-station/ev-backend:latest

# Deploy to Cloud Run
gcloud run deploy ev-backend \
  --image gcr.io/gcs-ev-charging-station/ev-backend:latest \
  --region us-central1 \
  --cpu 1 \
  --memory 512Mi \
  --max-instances 50
```

---

## Frontend Deployment

### Next.js Build & Deployment

**File**: `frontend/Dockerfile` (Already created ✓)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package*.json ./
RUN npm ci --production
EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Deploy

```bash
# Navigate to frontend
cd frontend

# Build for production
npm run build

# Upload static files to Cloud Storage
gsutil -m cp -r .next/static/* gs://gcs-ev-charging-frontend/_next/static/

# Update environment
# Create .env.production:
NEXT_PUBLIC_API_URL=https://ev-backend-[HASH]-uc.a.run.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBJngkZpWIPcixEt6UfOTG-wUE4bwSg48I
```

### Frontend Hosting Options

**Option 1: Cloud Run**
```bash
gcloud run deploy ev-frontend \
  --source . \
  --region us-central1 \
  --platform managed
```

**Option 2: Cloud Storage + CDN** (Recommended for SPA)
```bash
# Upload built files
gsutil -m cp -r out/* gs://gcs-ev-charging-frontend/

# Attach Cloud CDN
gcloud compute backend-buckets create frontend-bucket \
  --gcs-uri-prefix gs://gcs-ev-charging-frontend \
  --enable-cdn
```

**Option 3: Vercel** (Easiest, for Next.js)
1. Push frontend to GitHub
2. Connect to Vercel: https://vercel.com/new
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Auto-deploys on git push

---

## Database Setup

### Initialize Database Schema

```bash
# SSH into Cloud Run backend or local machine connected to Cloud SQL

# Export DATABASE_URL
export DATABASE_URL="mysql+pymysql://ev_user:PASSWORD@/ev_charging?unix_socket=..."

# Run migrations (using Alembic - recommended for production)
# For now, use SQLAlchemy:
python -c "
from app.models import Base
from app.services.database import engine
Base.metadata.create_all(bind=engine)
"

# Or run the seed script
python backend/seed.py
```

### Backup & Restore

```bash
# Create backup
gcloud sql backups create \
  --instance=ev-charging-db

# List backups
gcloud sql backups list --instance=ev-charging-db

# Restore from backup
gcloud sql backups restore BACKUP_ID \
  --backup-instance=ev-charging-db \
  --backup-configuration=Default
```

---

## Deployment Links & Status

### ✅ Current Deployment Status

| Component | URL/Status | Deployed |
|-----------|-----------|----------|
| **GCP Project** | [gcs-ev-charging-station](https://console.cloud.google.com/welcome?project=gcs-ev-charging-station) | ✅ |
| **Service Account** | gcs-sa-1@gcs-ev-charging-station.iam.gserviceaccount.com | ✅ |
| **Maps API** | AIzaSyBJngkZpWIPcixEt6UfOTG-wUE4bwSg48I | ✅ |
| **Backend (Cloud Run)** | Deploy when ready | ⏳ |
| **Frontend (Vercel/Cloud Run)** | Deploy when ready | ⏳ |
| **Database (Cloud SQL)** | Create instance | ⏳ |

### GCP Console Links

**Required Consoles** (bookmark these):

1. **[Cloud SQL Instances](https://console.cloud.google.com/sql/instances?project=gcs-ev-charging-station)** - Manage database
2. **[Cloud Run Services](https://console.cloud.google.com/run?project=gcs-ev-charging-station)** - Monitor backend
3. **[Cloud Storage Buckets](https://console.cloud.google.com/storage/browser?project=gcs-ev-charging-station)** - Manage files
4. **[Cloud Build](https://console.cloud.google.com/cloud-build?project=gcs-ev-charging-station)** - View deployment logs
5. **[IAM & Permissions](https://console.cloud.google.com/iam-admin?project=gcs-ev-charging-station)** - Manage access
6. **[Cloud Logging](https://console.cloud.google.com/logs?project=gcs-ev-charging-station)** - View application logs
7. **[Monitoring Dashboard](https://console.cloud.google.com/monitoring?project=gcs-ev-charging-station)** - Check system health

---

## Monitoring & Logging

### Cloud Logging

```bash
# View application logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ev-backend" \
  --limit 50 \
  --format json \
  --project=gcs-ev-charging-station

# Set up log alerts
gcloud alpha logging sinks create error-alerts \
  logging.googleapis.com \
  --log-filter='severity>=ERROR'
```

### Cloud Monitoring

**Metrics to Monitor**:
- CPU Usage
- Memory Usage
- Request Count
- Request Latency
- Error Rate
- Database Connections

Setup via: **Console > Monitoring > Dashboards**

### Error Tracking

```bash
# View errors
gcloud logging read "severity >= ERROR AND resource.type=cloud_run_revision" \
  --project=gcs-ev-charging-station
```

---

## Scaling & Performance

### Auto-Scaling Configuration

```bash
# Configure Cloud Run autoscaling
gcloud run services update ev-backend \
  --max-instances 100 \
  --min-instances 1 \
  --region us-central1
```

### Database Scaling

```bash
# Upgrade database machine type (during off-peak hours)
gcloud sql instances patch ev-charging-db \
  --tier=db-n1-standard-1 \
  --apply-immediately

# Increase storage
gcloud sql instances patch ev-charging-db \
  --storage-size=100GB
```

### CDN Configuration

```bash
# Enable Cloud CDN for Cloud Storage
gcloud compute backend-buckets update frontend-bucket \
  --enable-cdn \
  --cache-mode=CACHE_ALL_STATIC
```

---

## Cost Estimation & Optimization

### Monthly Estimated Costs

```
Cloud SQL (db-f1-micro):          ~$4/month
Cloud Storage (100GB):             ~$2/month
Cloud Run (10M requests):          ~$0.40/month
Cloud CDN (100GB):                 ~$0.12/month
Cloud Logging:                     ~$0.50/month
                                   ───────────
Total for MVP:                     ~$7/month

Production Scaling:
- db-n1-standard-4:               ~$100/month
- Cloud Run scaling:              ~$50-200/month
- Data Transfer:                  ~$20-50/month
                                   ────────────
Total Production:                ~$200-400/month
```

### Cost Optimization Tips

1. **Use Cloud Tasks** instead of Cloud Pub/Sub for async jobs
2. **Enable CDN caching** for static assets
3. **Set database backups** to daily (not hourly)
4. **Use Committed Use Discounts** for production (30% savings)
5. **Right-size instances** (don't over-provision)

---

## Troubleshooting

### Common Issues

**Issue**: Backend can't connect to Cloud SQL
```bash
# Solution: Ensure Cloud SQL Admin API is enabled
gcloud services enable sqladmin.googleapis.com

# Verify service account has cloudsql.client role
gcloud projects get-iam-policy gcs-ev-charging-station
```

**Issue**: Frontend shows 403 errors
```bash
# Solution: Check bucket permissions
gsutil iam ch allUsers:objectViewer gs://gcs-ev-charging-frontend

# Or check CORS configuration
```

**Issue**: High latency or timeouts
```bash
# Solution: Increase Cloud Run memory/CPU
gcloud run services update ev-backend \
  --memory 1Gi \
  --cpu 2 \
  --region us-central1
```

---

## Next Steps

1. **[Phase 1]** Set up Cloud SQL instance (5 mins)
2. **[Phase 2]** Create Cloud Storage buckets (2 mins)
3. **[Phase 3]** Deploy backend to Cloud Run (10 mins)
4. **[Phase 4]** Deploy frontend to Vercel (5 mins)
5. **[Phase 5]** Set up monitoring & alerts (10 mins)
6. **[Phase 6]** Configure custom domain (15 mins)
7. **[Phase 7]** Set up CI/CD pipeline (30 mins)

---

## Resources

- [GCP Free Tier](https://cloud.google.com/free) - $300 free credits
- [Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts)
- [Cloud SQL Best Practices](https://cloud.google.com/sql/docs/mysql/best-practices)
- [Next.js on GCP Deployment Guide](https://cloud.google.com/nodejs/docs/samples)

---

**Created**: March 17, 2026
**Status**: ✅ Ready to Deploy
**Next**: Execute Phase 1 setup
