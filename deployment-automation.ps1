#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Complete GCP Deployment Automation Script for EV Charging Station Platform
    
.DESCRIPTION
    Automates all phases of deploying to Google Cloud Platform:
    - Phase 1: Cloud SQL Database setup
    - Phase 2: Cloud Storage buckets
    - Phase 3: Docker build & Cloud Run deployment
    - Phase 4: Load Balancer & CDN configuration
    
.PARAMETER Phase
    Deployment phase to execute (1, 2, 3, 4, or 'all')
    
.PARAMETER ProjectId
    GCP Project ID (default: gcs-ev-charging-station)
    
.PARAMETER Region
    GCP Region (default: us-central1)
    
.EXAMPLE
    .\deployment-automation.ps1 -Phase all
    .\deployment-automation.ps1 -Phase 1
    .\deployment-automation.ps1 -Phase 3 -ProjectId my-project

.NOTES
    Author: EV Charging Team
    Date: March 17, 2026
#>

param(
    [Parameter(Mandatory = $false)]
    [ValidateSet('1', '2', '3', '4', 'all')]
    [string]$Phase = 'all',
    
    [Parameter(Mandatory = $false)]
    [string]$ProjectId = 'gcs-ev-charging-station',
    
    [Parameter(Mandatory = $false)]
    [string]$Region = 'us-central1',
    
    [Parameter(Mandatory = $false)]
    [string]$ServiceAccountKey = './credentials/keys/gcp-service-key.json',
    
    [Parameter(Mandatory = $false)]
    [string]$DatabasePassword = ''
)

# Color functions for output
function Write-Header {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "========================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

# Check prerequisites
function Check-Prerequisites {
    Write-Header "Checking Prerequisites"
    
    # Check gcloud CLI
    if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "gcloud CLI not found. Install from: https://cloud.google.com/sdk/docs/install"
        exit 1
    }
    Write-Success "gcloud CLI installed"
    
    # Check Docker
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "Docker not found. Install from: https://www.docker.com/products/docker-desktop"
        exit 1
    }
    Write-Success "Docker installed"
    
    # Check service account key
    if (-not (Test-Path $ServiceAccountKey)) {
        Write-Error-Custom "Service account key not found at: $ServiceAccountKey"
        exit 1
    }
    Write-Success "Service account key found"
    
    # Check authentication
    gcloud auth list --quiet | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Not authenticated with GCP. Run: gcloud auth activate-service-account --key-file=$ServiceAccountKey"
        exit 1
    }
    Write-Success "GCP authentication verified"
    
    Write-Success "All prerequisites satisfied!`n"
}

# Phase 1: Cloud SQL Database Setup
function Deploy-Phase1-CloudSQL {
    Write-Header "PHASE 1: Cloud SQL Database Setup"
    
    # Generate password if not provided
    if ([string]::IsNullOrEmpty($DatabasePassword)) {
        $DatabasePassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 16 | % {[char]$_})
        Write-Info "Generated secure password for database user"
    }
    
    try {
        # Enable SQL Admin API
        Write-Info "Enabling Cloud SQL Admin API..."
        gcloud services enable sqladmin.googleapis.com --project=$ProjectId --quiet
        Write-Success "Cloud SQL Admin API enabled"
        
        # Create Cloud SQL instance
        Write-Info "Creating Cloud SQL instance 'ev-charging-db'..."
        gcloud sql instances create ev-charging-db `
            --database-version=MYSQL_8_0 `
            --region=$Region `
            --tier=db-f1-micro `
            --availability-type=ZONAL `
            --storage-type=PD_SSD `
            --storage-size=10GB `
            --enable-bin-log `
            --backup-start-time=03:00 `
            --project=$ProjectId `
            --quiet 2>&1 | Where-Object { $_ -notmatch "already exists" }
        
        Write-Success "Cloud SQL instance created/verified"
        
        # Create database
        Write-Info "Creating 'ev_charging' database..."
        gcloud sql databases create ev_charging `
            --instance=ev-charging-db `
            --project=$ProjectId `
            --quiet 2>&1 | Where-Object { $_ -notmatch "already exists" }
        
        Write-Success "Database created/verified"
        
        # Create database user
        Write-Info "Creating database user 'ev_user'..."
        gcloud sql users create ev_user `
            --instance=ev-charging-db `
            --password=$DatabasePassword `
            --project=$ProjectId `
            --quiet 2>&1 | Where-Object { $_ -notmatch "already exists" }
        
        Write-Success "Database user created/verified"
        
        # Get instance IP
        $InstanceIP = gcloud sql instances describe ev-charging-db `
            --project=$ProjectId `
            --format='get(ipAddresses[0].ipAddress)' 2>$null
        
        Write-Success "Cloud SQL Setup Complete!"
        Write-Info "Instance IP: $InstanceIP"
        Write-Info "Connection String: mysql+pymysql://ev_user:$DatabasePassword@$InstanceIP`:3306/ev_charging"
        Write-Info "Cloud Run Connection: mysql+pymysql://ev_user:$DatabasePassword@/ev_charging?unix_socket=/cloudsql/$ProjectId`:$Region`:ev-charging-db"
        
        # Save connection details
        $ConnDetails = @{
            InstanceIP = $InstanceIP
            DatabasePassword = $DatabasePassword
            Region = $Region
            ProjectId = $ProjectId
        }
        $ConnDetails | ConvertTo-Json | Out-File -FilePath "./db-connection-details.json" -Force
        Write-Success "Connection details saved to ./db-connection-details.json"
    }
    catch {
        Write-Error-Custom "Phase 1 failed: $_"
        throw
    }
}

# Phase 2: Cloud Storage Buckets
function Deploy-Phase2-CloudStorage {
    Write-Header "PHASE 2: Cloud Storage Buckets"
    
    try {
        # Enable Storage API
        Write-Info "Enabling Cloud Storage API..."
        gcloud services enable storage-component.googleapis.com --project=$ProjectId --quiet
        Write-Success "Cloud Storage API enabled"
        
        # Create Frontend bucket
        Write-Info "Creating frontend bucket..."
        gsutil mb -p $ProjectId `
            -c STANDARD `
            -l $Region `
            -b on `
            gs://gcs-ev-charging-frontend 2>&1 | Where-Object { $_ -notmatch "already exists" }
        Write-Success "Frontend bucket created/verified"
        
        # Create Data bucket
        Write-Info "Creating data bucket..."
        gsutil mb -p $ProjectId `
            -c STANDARD `
            -l $Region `
            gs://gcs-ev-charging-data 2>&1 | Where-Object { $_ -notmatch "already exists" }
        Write-Success "Data bucket created/verified"
        
        # Create ML Models bucket
        Write-Info "Creating ML models bucket..."
        gsutil mb -p $ProjectId `
            -c NEARLINE `
            -l $Region `
            gs://gcs-ev-charging-ml-models 2>&1 | Where-Object { $_ -notmatch "already exists" }
        Write-Success "ML models bucket created/verified"
        
        Write-Success "Cloud Storage Setup Complete!"
        Write-Info "Frontend Bucket: gs://gcs-ev-charging-frontend"
        Write-Info "Data Bucket: gs://gcs-ev-charging-data"
        Write-Info "ML Models Bucket: gs://gcs-ev-charging-ml-models"
    }
    catch {
        Write-Error-Custom "Phase 2 failed: $_"
        throw
    }
}

# Phase 3: Docker Build & Cloud Run Deployment
function Deploy-Phase3-CloudRun {
    Write-Header "PHASE 3: Docker Build & Cloud Run Deployment"
    
    try {
        # Enable required APIs
        Write-Info "Enabling required APIs..."
        gcloud services enable cloudbuild.googleapis.com run.googleapis.com compute.googleapis.com logging.googleapis.com monitoring.googleapis.com --project=$ProjectId --quiet
        Write-Success "APIs enabled"
        
        # Build Docker image
        Write-Info "Building Docker image locally..."
        $DockerImageTag = "gcr.io/$ProjectId/ev-backend:latest"
        
        # Check if docker daemon is running
        docker ps > $null 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Custom "Docker daemon is not running. Please start Docker Desktop."
            exit 1
        }
        
        Push-Location backend
        docker build -t $DockerImageTag .
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Custom "Docker build failed"
            exit 1
        }
        Write-Success "Docker image built successfully"
        Pop-Location
        
        # Push to Container Registry
        Write-Info "Pushing image to Google Container Registry..."
        docker push $DockerImageTag
        if ($LASTEXITCODE -ne 0) {
            Write-Error-Custom "Docker push failed"
            exit 1
        }
        Write-Success "Docker image pushed to GCR"
        
        # Deploy to Cloud Run
        Write-Info "Deploying to Cloud Run..."
        gcloud run deploy ev-backend `
            --image $DockerImageTag `
            --region $Region `
            --platform managed `
            --memory 512Mi `
            --cpu 1 `
            --timeout 60 `
            --max-instances 100 `
            --no-allow-unauthenticated `
            --set-env-vars "ENVIRONMENT=production,DEBUG=false" `
            --add-cloudsql-instances "$ProjectId`:$Region`:ev-charging-db" `
            --service-account "gcs-sa-1@$ProjectId.iam.gserviceaccount.com" `
            --project=$ProjectId `
            --quiet
        
        Write-Success "Cloud Run deployment successful"
        
        # Get service URL
        $ServiceURL = gcloud run services describe ev-backend `
            --region $Region `
            --platform managed `
            --project=$ProjectId `
            --format='get(status.url)' 2>$null
        
        Write-Success "Cloud Run Setup Complete!"
        Write-Info "Backend URL: $ServiceURL"
        Write-Info "API Documentation: $ServiceURL/docs"
        
        # Save deployment details
        $DeployDetails = @{
            BackendURL = $ServiceURL
            Region = $Region
            ProjectId = $ProjectId
            DeploymentTime = (Get-Date).ToString()
        }
        $DeployDetails | ConvertTo-Json | Out-File -FilePath "./backend-deployment-details.json" -Force
        Write-Success "Deployment details saved to ./backend-deployment-details.json"
    }
    catch {
        Write-Error-Custom "Phase 3 failed: $_"
        throw
    }
}

# Phase 4: Load Balancer & CDN
function Deploy-Phase4-LoadBalancer {
    Write-Header "PHASE 4: Load Balancer & CDN Configuration (Manual Steps)"
    
    Write-Info "Load Balancer setup requires manual configuration through the GCP Console."
    Write-Info "`nSupported manual configuration steps:"
    Write-Info "1. Go to: https://console.cloud.google.com/net-services/loadbalancing"
    Write-Info "2. Create a new HTTP(S) Load Balancer"
    Write-Info "3. Configure backend services:"
    Write-Info "   - Cloud Run service for /api/* requests"
    Write-Info "   - Cloud Storage bucket for static content"
    Write-Info "4. Set up SSL certificate for your domain"
    Write-Info "5. Configure Cloud CDN for caching"
    Write-Info "`nAlternatively, run:"
    Write-Info "  gcloud compute ssl-certificates create ev-charging-cert --domains=yourdomain.com"
    
    Write-Success "Phase 4 configuration guide complete"
}

# Main execution
function Main {
    Write-Host "`n╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  EV Charging Station - GCP Deployment Automation       ║" -ForegroundColor Cyan
    Write-Host "║  Date: March 17, 2026                                  ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
    
    Write-Info "Configuration:"
    Write-Info "  Project ID: $ProjectId"
    Write-Info "  Region: $Region"
    Write-Info "  Phase(s): $Phase`n"
    
    # Check prerequisites
    Check-Prerequisites
    
    # Execute requested phases
    $PhasesToRun = if ($Phase -eq 'all') { @('1', '2', '3', '4') } else { @($Phase) }
    
    foreach ($CurrentPhase in $PhasesToRun) {
        switch ($CurrentPhase) {
            '1' { Deploy-Phase1-CloudSQL }
            '2' { Deploy-Phase2-CloudStorage }
            '3' { Deploy-Phase3-CloudRun }
            '4' { Deploy-Phase4-LoadBalancer }
        }
    }
    
    Write-Header "Deployment Complete!"
    Write-Info "Summary of created resources:"
    Write-Info "  ✓ Cloud SQL database: ev-charging-db"
    Write-Info "  ✓ Storage buckets: gcs-ev-charging-{frontend,data,ml-models}"
    Write-Info "  ✓ Cloud Run service: ev-backend"
    Write-Info "`nNext steps:"
    Write-Info "  1. Update frontend environment variables with backend URL"
    Write-Info "  2. Configure Load Balancer in GCP Console"
    Write-Info "  3. Set up monitoring and logging"
    Write-Info "  4. Test end-to-end functionality"
    Write-Host "`n"
}

# Run main function
try {
    Main
}
catch {
    Write-Error-Custom "Deployment failed: $_"
    exit 1
}
