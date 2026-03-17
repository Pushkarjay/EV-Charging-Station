#!/bin/bash
#
# EV Charging Station - GCP Deployment Automation Script
# Supports phases: 1 (Cloud SQL), 2 (Storage), 3 (Cloud Run), 4 (Load Balancer)
# 
# Usage:
#   ./deployment-automation.sh [all|1|2|3|4] [project-id] [region] [db-password]
#
# Example:
#   ./deployment-automation.sh all gcs-ev-charging-station us-central1
#

set -e

# Configuration
PHASE="${1:-all}"
PROJECT_ID="${2:-gcs-ev-charging-station}"
REGION="${3:-us-central1}"
SERVICE_ACCOUNT_KEY="${4:-./credentials/keys/gcp-service-key.json}"
DB_PASSWORD="${5:-}"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Output functions
print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check gcloud CLI
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    print_success "gcloud CLI installed"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Install from: https://www.docker.com"
        exit 1
    fi
    print_success "Docker installed"
    
    # Check service account key
    if [ ! -f "$SERVICE_ACCOUNT_KEY" ]; then
        print_error "Service account key not found at: $SERVICE_ACCOUNT_KEY"
        exit 1
    fi
    print_success "Service account key found"
    
    # Check authentication
    if ! gcloud auth list --quiet 2>/dev/null | grep -q "ACTIVE"; then
        print_error "Not authenticated with GCP"
        exit 1
    fi
    print_success "GCP authentication verified"
    
    print_success "All prerequisites satisfied!\n"
}

# Phase 1: Cloud SQL
deploy_phase1_cloudsql() {
    print_header "PHASE 1: Cloud SQL Database Setup"
    
    # Generate password if not provided
    if [ -z "$DB_PASSWORD" ]; then
        DB_PASSWORD=$(openssl rand -base64 16)
        print_info "Generated secure password for database user"
    fi
    
    # Enable SQL Admin API
    print_info "Enabling Cloud SQL Admin API..."
    gcloud services enable sqladmin.googleapis.com --project=$PROJECT_ID --quiet
    print_success "Cloud SQL Admin API enabled"
    
    # Create Cloud SQL instance
    print_info "Creating Cloud SQL instance 'ev-charging-db'..."
    gcloud sql instances create ev-charging-db \
        --database-version=MYSQL_8_0 \
        --region=$REGION \
        --tier=db-f1-micro \
        --availability-type=ZONAL \
        --storage-type=PD_SSD \
        --storage-size=10GB \
        --enable-bin-log \
        --backup-start-time=03:00 \
        --project=$PROJECT_ID \
        --quiet 2>&1 || true
    print_success "Cloud SQL instance created/verified"
    
    # Create database
    print_info "Creating 'ev_charging' database..."
    gcloud sql databases create ev_charging \
        --instance=ev-charging-db \
        --project=$PROJECT_ID \
        --quiet 2>&1 || true
    print_success "Database created/verified"
    
    # Create database user
    print_info "Creating database user 'ev_user'..."
    gcloud sql users create ev_user \
        --instance=ev-charging-db \
        --password=$DB_PASSWORD \
        --project=$PROJECT_ID \
        --quiet 2>&1 || true
    print_success "Database user created/verified"
    
    # Get instance IP
    INSTANCE_IP=$(gcloud sql instances describe ev-charging-db \
        --project=$PROJECT_ID \
        --format='get(ipAddresses[0].ipAddress)' 2>/dev/null)
    
    print_success "Cloud SQL Setup Complete!"
    print_info "Instance IP: $INSTANCE_IP"
    print_info "Connection String: mysql+pymysql://ev_user:$DB_PASSWORD@$INSTANCE_IP:3306/ev_charging"
    
    # Save connection details
    cat > ./db-connection-details.json <<EOF
{
    "InstanceIP": "$INSTANCE_IP",
    "DatabasePassword": "$DB_PASSWORD",
    "Region": "$REGION",
    "ProjectId": "$PROJECT_ID"
}
EOF
    print_success "Connection details saved to ./db-connection-details.json"
}

# Phase 2: Cloud Storage
deploy_phase2_cloudstorage() {
    print_header "PHASE 2: Cloud Storage Buckets"
    
    # Enable Storage API
    print_info "Enabling Cloud Storage API..."
    gcloud services enable storage-component.googleapis.com --project=$PROJECT_ID --quiet
    print_success "Cloud Storage API enabled"
    
    # Create Frontend bucket
    print_info "Creating frontend bucket..."
    gsutil mb -p $PROJECT_ID \
        -c STANDARD \
        -l $REGION \
        -b on \
        gs://gcs-ev-charging-frontend 2>&1 || true
    print_success "Frontend bucket created/verified"
    
    # Create Data bucket
    print_info "Creating data bucket..."
    gsutil mb -p $PROJECT_ID \
        -c STANDARD \
        -l $REGION \
        gs://gcs-ev-charging-data 2>&1 || true
    print_success "Data bucket created/verified"
    
    # Create ML Models bucket
    print_info "Creating ML models bucket..."
    gsutil mb -p $PROJECT_ID \
        -c NEARLINE \
        -l $REGION \
        gs://gcs-ev-charging-ml-models 2>&1 || true
    print_success "ML models bucket created/verified"
    
    print_success "Cloud Storage Setup Complete!"
    print_info "Frontend Bucket: gs://gcs-ev-charging-frontend"
    print_info "Data Bucket: gs://gcs-ev-charging-data"
    print_info "ML Models Bucket: gs://gcs-ev-charging-ml-models"
}

# Phase 3: Cloud Run
deploy_phase3_cloudrun() {
    print_header "PHASE 3: Docker Build & Cloud Run Deployment"
    
    # Enable required APIs
    print_info "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com run.googleapis.com compute.googleapis.com logging.googleapis.com monitoring.googleapis.com --project=$PROJECT_ID --quiet
    print_success "APIs enabled"
    
    # Build Docker image
    print_info "Building Docker image locally..."
    DOCKER_IMAGE_TAG="gcr.io/$PROJECT_ID/ev-backend:latest"
    
    # Check if docker daemon is running
    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker daemon is not running"
        exit 1
    fi
    
    cd backend
    docker build -t $DOCKER_IMAGE_TAG .
    if [ $? -ne 0 ]; then
        print_error "Docker build failed"
        exit 1
    fi
    print_success "Docker image built successfully"
    cd ..
    
    # Push to Container Registry
    print_info "Pushing image to Google Container Registry..."
    docker push $DOCKER_IMAGE_TAG
    if [ $? -ne 0 ]; then
        print_error "Docker push failed"
        exit 1
    fi
    print_success "Docker image pushed to GCR"
    
    # Deploy to Cloud Run
    print_info "Deploying to Cloud Run..."
    gcloud run deploy ev-backend \
        --image $DOCKER_IMAGE_TAG \
        --region $REGION \
        --platform managed \
        --memory 512Mi \
        --cpu 1 \
        --timeout 60 \
        --max-instances 100 \
        --no-allow-unauthenticated \
        --set-env-vars "ENVIRONMENT=production,DEBUG=false" \
        --add-cloudsql-instances "$PROJECT_ID:$REGION:ev-charging-db" \
        --service-account "gcs-sa-1@$PROJECT_ID.iam.gserviceaccount.com" \
        --project=$PROJECT_ID \
        --quiet
    print_success "Cloud Run deployment successful"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe ev-backend \
        --region $REGION \
        --platform managed \
        --project=$PROJECT_ID \
        --format='get(status.url)' 2>/dev/null)
    
    print_success "Cloud Run Setup Complete!"
    print_info "Backend URL: $SERVICE_URL"
    print_info "API Documentation: $SERVICE_URL/docs"
    
    # Save deployment details
    cat > ./backend-deployment-details.json <<EOF
{
    "BackendURL": "$SERVICE_URL",
    "Region": "$REGION",
    "ProjectId": "$PROJECT_ID",
    "DeploymentTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
    print_success "Deployment details saved to ./backend-deployment-details.json"
}

# Phase 4: Load Balancer
deploy_phase4_loadbalancer() {
    print_header "PHASE 4: Load Balancer & CDN Configuration (Manual Steps)"
    
    print_info "Load Balancer setup requires manual configuration through the GCP Console."
    print_info ""
    print_info "Supported manual configuration steps:"
    print_info "1. Go to: https://console.cloud.google.com/net-services/loadbalancing"
    print_info "2. Create a new HTTP(S) Load Balancer"
    print_info "3. Configure backend services:"
    print_info "   - Cloud Run service for /api/* requests"
    print_info "   - Cloud Storage bucket for static content"
    print_info "4. Set up SSL certificate for your domain"
    print_info "5. Configure Cloud CDN for caching"
    print_info ""
    print_info "Alternatively, run:"
    print_info "  gcloud compute ssl-certificates create ev-charging-cert --domains=yourdomain.com"
    
    print_success "Phase 4 configuration guide complete"
}

# Main execution
main() {
    echo -e "\n╔═══════════════════════════════════════════════════════════╗"
    echo -e "║  EV Charging Station - GCP Deployment Automation       ║"
    echo -e "║  Date: March 17, 2026                                  ║"
    echo -e "╚═══════════════════════════════════════════════════════════╝\n"
    
    print_info "Configuration:"
    print_info "  Project ID: $PROJECT_ID"
    print_info "  Region: $REGION"
    print_info "  Phase(s): $PHASE"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Execute requested phases
    case $PHASE in
        all)
            deploy_phase1_cloudsql
            deploy_phase2_cloudstorage
            deploy_phase3_cloudrun
            deploy_phase4_loadbalancer
            ;;
        1)
            deploy_phase1_cloudsql
            ;;
        2)
            deploy_phase2_cloudstorage
            ;;
        3)
            deploy_phase3_cloudrun
            ;;
        4)
            deploy_phase4_loadbalancer
            ;;
        *)
            print_error "Invalid phase: $PHASE. Use: all | 1 | 2 | 3 | 4"
            exit 1
            ;;
    esac
    
    # Summary
    print_header "Deployment Complete!"
    print_info "Summary of created resources:"
    print_info "  ✓ Cloud SQL database: ev-charging-db"
    print_info "  ✓ Storage buckets: gcs-ev-charging-{frontend,data,ml-models}"
    print_info "  ✓ Cloud Run service: ev-backend"
    print_info ""
    print_info "Next steps:"
    print_info "  1. Update frontend environment variables with backend URL"
    print_info "  2. Configure Load Balancer in GCP Console"
    print_info "  3. Set up monitoring and logging"
    print_info "  4. Test end-to-end functionality"
    echo ""
}

# Run main
main
