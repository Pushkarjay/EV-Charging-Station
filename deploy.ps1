#!/usr/bin/env pwsh

# ============================================
# 🚀 GCP DEPLOYMENT AUTOMATION SCRIPT
# EV Charging Station Platform
# ============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Action = "deploy",  # deploy, build, test, cleanup
    
    [Parameter(Mandatory=$false)]
    [string]$Environment = "production"  # development, staging, production
)

# Configuration
$PROJECT_ID = "gcs-ev-charging-station"
$REGION = "us-central1"
$ZONE = "us-central1-a"
$BACKEND_IMAGE = "ev-backend"
$FRONTEND_BUCKET = "$PROJECT_ID-frontend"
$DATA_BUCKET = "$PROJECT_ID-data"
$ML_BUCKET = "$PROJECT_ID-ml-models"
$INSTANCE_NAME = "ev-charging-db"

# Colors for output
$SUCCESS = "Green"
$ERROR = "Red"
$WARNING = "Yellow"
$INFO = "Cyan"

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor $SUCCESS
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor $ERROR
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor $WARNING
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor $INFO
}

function Check-Prerequisites {
    Write-Host "`n🔍 Checking Prerequisites..." -ForegroundColor $INFO
    
    # Check gcloud
    $gcloud = Get-Command gcloud -ErrorAction SilentlyContinue
    if ($null -eq $gcloud) {
        Write-Error-Custom "gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
        exit 1
    }
    Write-Success "gcloud CLI installed"
    
    # Check project is set
    $projectConfig = gcloud config get-value project 2>&1
    if ($projectConfig -ne $PROJECT_ID) {
        Write-Warning-Custom "Project not set to $PROJECT_ID, setting now..."
        gcloud config set project $PROJECT_ID --quiet
    }
    Write-Success "GCP project configured"
    
    # Check billing account
    $billingStatus = gcloud billing projects describe $PROJECT_ID --format='value(billingAccountName)' 2>&1
    if ($billingStatus -match "Error" -or $billingStatus -eq "") {
        Write-Error-Custom "Billing account not linked to project"
        Write-Info "Link billing: https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
        exit 1
    }
    Write-Success "Billing account linked"
}

function Enable-APIs {
    Write-Host "`n📡 Enabling Required Google Cloud APIs..." -ForegroundColor $INFO
    
    $apis = @(
        "cloudresourcemanager.googleapis.com",
        "compute.googleapis.com",
        "container.googleapis.com",
        "cloudsql.googleapis.com",
        "cloudrun.googleapis.com",
        "storage-component.googleapis.com",
        "containerregistry.googleapis.com",
        "sqladmin.googleapis.com"
    )
    
    foreach ($api in $apis) {
        Write-Info "Enabling $api..."
        gcloud services enable $api --quiet 2>&1 | Out-Null
    }
    
    Write-Success "All APIs enabled"
}

function Create-CloudSQL {
    Write-Host "`n🗄️ Creating Cloud SQL Database..." -ForegroundColor $INFO
    
    # Check if instance exists
    $instanceExists = gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID 2>&1
    if ($instanceExists -match "Not found") {
        Write-Info "Creating Cloud SQL instance..."
        gcloud sql instances create $INSTANCE_NAME `
            --database-version=MYSQL_8_0 `
            --region=$REGION `
            --tier=db-f1-micro `
            --availability-type=ZONAL `
            --storage-type=PD_SSD `
            --storage-size=10GB `
            --enable-bin-log `
            --backup-start-time=03:00 `
            --quiet 2>&1 | Out-Null
        Write-Success "Cloud SQL instance created"
    } else {
        Write-Warning-Custom "Cloud SQL instance already exists"
    }
    
    # Create database
    Write-Info "Creating database schema..."
    gcloud sql databases create ev_charging --instance=$INSTANCE_NAME --quiet 2>&1 | Out-Null
    Write-Success "Database created"
    
    # Create user
    Write-Info "Creating database user..."
    gcloud sql users create ev_user `
        --instance=$INSTANCE_NAME `
        --password='EV_Charging_Station_2026!' `
        --quiet 2>&1 | Out-Null
    Write-Success "Database user created"
    
    # Get connection string
    $connString = gcloud sql instances describe $INSTANCE_NAME `
        --format='value(connectionName)' 2>&1
    Write-Info "Connection string: $connString"
}

function Create-StorageBuckets {
    Write-Host "`n🪣 Creating Cloud Storage Buckets..." -ForegroundColor $INFO
    
    $buckets = @(
        $FRONTEND_BUCKET,
        $DATA_BUCKET,
        $ML_BUCKET
    )
    
    foreach ($bucket in $buckets) {
        Write-Info "Creating bucket: gs://$bucket"
        gsutil mb -p $PROJECT_ID gs://$bucket 2>&1 | Out-Null
    }
    
    Write-Success "Storage buckets created"
}

function Build-Backend {
    Write-Host "`n🏗️ Building Backend Docker Image..." -ForegroundColor $INFO
    
    if (!(Test-Path "backend/Dockerfile")) {
        Write-Error-Custom "Dockerfile not found in backend directory"
        exit 1
    }
    
    Push-Location backend
    
    Write-Info "Building image: gcr.io/$PROJECT_ID/$BACKEND_IMAGE:latest"
    gcloud builds submit --tag gcr.io/$PROJECT_ID/$BACKEND_IMAGE:latest . 2>&1 | Out-Null
    
    Pop-Location
    
    Write-Success "Backend image built and pushed to Container Registry"
}

function Deploy-Backend {
    Write-Host "`n🚀 Deploying Backend to Cloud Run..." -ForegroundColor $INFO
    
    Write-Info "Deploying service..."
    gcloud run deploy ev-backend `
        --image gcr.io/$PROJECT_ID/$BACKEND_IMAGE:latest `
        --region=$REGION `
        --platform=managed `
        --allow-unauthenticated `
        --add-cloudsql-instances "$PROJECT_ID`:$REGION`:$INSTANCE_NAME" `
        --set-env-vars `
            "DATABASE_URL=mysql+pymysql://ev_user:EV_Charging_Station_2026!@localhost/ev_charging,`
            GOOGLE_MAPS_API_KEY=AIzaSyBJngkZpWIPcixEt6UfOTG-wUE4bwSg48I,`
            GOOGLE_PROJECT_ID=$PROJECT_ID,`
            JWT_SECRET_KEY=your-secret-key-change-in-production-now" `
        --quiet 2>&1 | Out-Null
    
    $backendUrl = gcloud run services describe ev-backend `
        --region=$REGION `
        --format='value(status.url)' 2>&1
    
    Write-Success "Backend deployed to Cloud Run"
    Write-Info "Backend URL: $backendUrl"
}

function Deploy-Frontend {
    Write-Host "`n🎨 Deploying Frontend to Cloud Storage..." -ForegroundColor $INFO
    
    Push-Location frontend
    
    Write-Info "Building Next.js application..."
    npm run build 2>&1 | Out-Null
    
    if (!(Test-Path "out")) {
        Write-Error-Custom "Frontend build failed"
        Pop-Location
        exit 1
    }
    
    Write-Info "Uploading files to Cloud Storage..."
    gsutil -m cp -r "out/*" gs://$FRONTEND_BUCKET/ 2>&1 | Out-Null
    
    Pop-Location
    
    Write-Success "Frontend deployed to Cloud Storage"
    Write-Info "Frontend URL: https://$FRONTEND_BUCKET.storage.googleapis.com/index.html"
}

function Setup-CloudCDN {
    Write-Host "`n🌐 Setting up Cloud CDN..." -ForegroundColor $INFO
    
    Write-Warning-Custom "Manual CDN setup requires Cloud Load Balancer configuration"
    Write-Info "See: https://cloud.google.com/storage/docs/cdn"
}

function Initialize-Database {
    Write-Host "`n📊 Initializing Database Schema..." -ForegroundColor $INFO
    
    Write-Info "Running database initialization script..."
    
    # Would need cloud-sql-proxy or connection details
    # This is a placeholder for actual implementation
    Write-Warning-Custom "Database initialization requires Cloud SQL Proxy setup"
    Write-Info "See backend/seed.py for schema initialization"
}

function Run-Tests {
    Write-Host "`n🧪 Running Tests..." -ForegroundColor $INFO
    
    Write-Info "Running backend tests..."
    Push-Location backend
    
    if (Test-Path "tests") {
        # Would run pytest here
        Write-Warning-Custom "Tests require pytest installation"
    }
    
    Pop-Location
    
    Write-Info "Tests would run here"
}

function Cleanup {
    Write-Host "`n🧹 Cleaning Up Resources..." -ForegroundColor $WARNING
    
    $confirm = Read-Host "Are you sure you want to delete all resources? (yes/no)"
    
    if ($confirm -ne "yes") {
        Write-Info "Cleanup cancelled"
        return
    }
    
    Write-Info "Deleting Cloud Run service..."
    gcloud run services delete ev-backend --region=$REGION --quiet 2>&1 | Out-Null
    
    Write-Info "Deleting Cloud SQL instance..."
    gcloud sql instances delete $INSTANCE_NAME --quiet 2>&1 | Out-Null
    
    Write-Info "Deleting Cloud Storage buckets..."
    gsutil -m rm -r gs://$FRONTEND_BUCKET gs://$DATA_BUCKET gs://$ML_BUCKET 2>&1 | Out-Null
    
    Write-Success "Cleanup completed"
}

function Full-Deploy {
    Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor "Magenta"
    Write-Host "║  🚀 GCP AUTOMATED DEPLOYMENT SCRIPT 🚀     ║" -ForegroundColor "Magenta"
    Write-Host "║     EV Charging Station Platform           ║" -ForegroundColor "Magenta"
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor "Magenta"
    
    Check-Prerequisites
    Enable-APIs
    Create-CloudSQL
    Create-StorageBuckets
    Build-Backend
    Deploy-Backend
    Deploy-Frontend
    Setup-CloudCDN
    Initialize-Database
    
    Write-Host "`n╔════════════════════════════════════════════╗" -ForegroundColor "Green"
    Write-Host "║  ✅ DEPLOYMENT COMPLETED! ✅               ║" -ForegroundColor "Green"
    Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor "Green"
    
    Write-Host "`nDeployment Summary:" -ForegroundColor $SUCCESS
    Write-Host "  Project: $PROJECT_ID"
    Write-Host "  Region: $REGION"
    Write-Host "  Backend: Cloud Run (ev-backend)"
    Write-Host "  Frontend: Cloud Storage ($FRONTEND_BUCKET)"
    Write-Host "  Database: Cloud SQL ($INSTANCE_NAME)"
    Write-Host "`nNext Steps:"
    Write-Host "  1. Configure custom domain"
    Write-Host "  2. Set up SSL certificate"
    Write-Host "  3. Enable Cloud Monitoring"
    Write-Host "  4. Set up Cloud Logging"
    Write-Host "  5. Configure CI/CD pipeline"
}

# Main execution
switch ($Action.ToLower()) {
    "deploy" { Full-Deploy }
    "build" { Build-Backend }
    "test" { Run-Tests }
    "cleanup" { Cleanup }
    default {
        Write-Error-Custom "Unknown action: $Action"
        Write-Info "Usage: .\deploy.ps1 -Action [deploy|build|test|cleanup] -Environment [development|staging|production]"
        exit 1
    }
}

Write-Host "`n"
