# Cloud Infrastructure & Deployment

## Overview
This folder contains infrastructure-as-code, Docker configuration, CI/CD pipelines, and deployment configuration for the EV Charging Station platform on Google Cloud Platform.

## Folder Structure

```
cloud/
├── gcp/
│   ├── terraform/      # Infrastructure as Code (Terraform)
│   ├── deployment/     # Cloud Run, Kubernetes configs
│   └── monitoring/     # GCP monitoring and logging setup
├── docker/             # Docker images and docker-compose
├── ci-cd/              # GitHub Actions workflows
└── README.md           # This file
```

## Key Components

### 1. GCP Infrastructure (gcp/terraform/)

Terraform configuration for:
- **Cloud SQL**: Managed MySQL database with auto-backups
- **Cloud Run**: Serverless FastAPI backend deployment
- **Cloud Storage**: File storage for datasets, models, configurations
- **Pub/Sub**: Message queue for async tasks
- **BigQuery**: Data warehouse for analytics
- **Monitoring**: Cloud Monitoring and Cloud Logging
- **IAM**: Service accounts and roles

Files:
- `main.tf` - Provider and general configuration
- `database.tf` - Cloud SQL MySQL setup
- `compute.tf` - Cloud Run services
- `storage.tf` - GCS buckets
- `monitoring.tf` - Observability setup
- `variables.tf` - Variable definitions
- `outputs.tf` - Output values
- `terraform.tfvars` - Environment-specific values

### 2. Cloud Run Deployment (gcp/deployment/)

Deployment configurations:
- `backend-service.yaml` - FastAPI backend service
- `scheduler-service.yaml` - Background jobs and ML predictions
- `autoscaling.yaml` - Auto-scaling policies
- `env-vars.yaml` - Environment variables per environment

### 3. Docker (docker/)

- `Dockerfile` - Backend service container image
- `Dockerfile.ml` - ML service container (for predictions)
- `docker-compose.yml` - Local development stack
- `.dockerignore` - Exclude files from build

### 4. CI/CD Pipelines (ci-cd/)

GitHub Actions workflows:
- `test.yml` - Run tests on push
- `build.yml` - Build Docker images
- `deploy-dev.yml` - Deploy to development environment
- `deploy-prod.yml` - Deploy to production (requires approval)

### 5. Monitoring (gcp/monitoring/)

- `logging-config.tf` - Cloud Logging configuration
- `alerts.tf` - Alert policies for service degradation
- `dashboards.tf` - GCP monitoring dashboards
- `health-checks.tf` - Service health check configuration

## Tech Stack

- **IaC Framework**: Terraform 1.5+
- **Container Runtime**: Docker 20+
- **Container Orchestration**: Google Cloud Run (serverless)
- **CI/CD**: GitHub Actions
- **Cloud Provider**: Google Cloud Platform (GCP)
- **Database**: Cloud SQL (MySQL 8.0)
- **Storage**: Cloud Storage (GCS)
- **Message Queue**: Cloud Pub/Sub
- **Monitoring**: Cloud Monitoring, Cloud Logging
- **Analytics**: BigQuery

## Deployment Workflow

### Local Development
```bash
# Start local stack with docker-compose
docker-compose up -d

# Access services:
# - Backend: http://localhost:8000
# - MySQL: localhost:3306
# - Docs: http://localhost:8000/docs
```

### Staging/Production Deployment

1. **Build & Push Docker Image**:
   ```bash
   docker build -t gcr.io/PROJECT_ID/ev-charging-backend:TAG .
   docker push gcr.io/PROJECT_ID/ev-charging-backend:TAG
   ```

2. **Deploy Infrastructure**:
   ```bash
   cd gcp/terraform
   terraform init
   terraform plan
   terraform apply
   ```

3. **Deploy Application**:
   ```bash
   gcloud run deploy ev-charging-backend \
     --image gcr.io/PROJECT_ID/ev-charging-backend:TAG \
     --region us-central1 \
     --platform managed
   ```

4. **Run Migrations**:
   ```bash
   gcloud run jobs create run-migrations \
     --image gcr.io/PROJECT_ID/ev-charging-backend:TAG \
     --task-count 1
   ```

## Environment Configuration

### Development (.env.dev)
```
ENVIRONMENT=development
DATABASE_URL=mysql://user:pass@localhost:3306/ev_dev
GOOGLE_PROJECT_ID=ev-charging-dev
GCP_REGION=us-central1
```

### Production (.env.prod)
```
ENVIRONMENT=production
DATABASE_URL=cloudsql://PROJECT:REGION:INSTANCE
GOOGLE_PROJECT_ID=ev-charging-prod
GCP_REGION=us-central1
```

See [credentials/.env.example](../credentials/.env.example) for all variables.

## Monitoring & Alerts

Configured alerts for:
- **Service Availability**: Cloud Run service down (SLA: 99.95%)
- **Error Rate**: >5% error rate in logs
- **Latency**: P99 latency > 2 seconds
- **Database**: CPU/Memory utilization > 80%
- **Queue**: Pub/Sub backlog > 1000 messages

Access dashboards in GCP Console → Monitoring → Dashboards.

## Backup & Disaster Recovery

- **Database**: Automated daily backups (30-day retention)
- **Code**: Git repository with main branch protection
- **Terraform State**: Stored in GCS with versioning
- **Configuration**: Version controlled in git

RTO: 1 hour | RPO: 1 hour

## Cost Optimization

- Cloud Run scales to zero (pay per invocation)
- MySQL: Automated backup deletion policies
- Cloud Storage: Lifecycle rules for old data
- Monitoring: Log retention policies

Estimated monthly cost: $200-500 (dev/test environment)

## Security

- **Network**: VPC with private Cloud SQL
- **Authentication**: Service accounts with minimal IAM roles
- **Secrets**: Google Secrets Manager (not .env files in repo)
- **SSL/TLS**: Automatic with Cloud Run
- **DDoS Protection**: Google Cloud Armor

## Related Documentation

- See [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) for system overview
- See [docs/](../docs/) for deployment guides
- Terraform docs: https://registry.terraform.io/providers/hashicorp/google/latest/docs
- Cloud Run docs: https://cloud.google.com/run/docs
