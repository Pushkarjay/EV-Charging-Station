#!/usr/bin/env pwsh
# Quick Firebase + Cloud Run Deployment for EV Charging Station Frontend
# NO DOCKER REQUIRED - Uses Google Cloud Build

Write-Host "`n🚀 EV Charging Station - Quick Deployment (No Docker Needed)`n" -ForegroundColor Cyan

# Configuration
$PROJECT_ID = "gcs-ev-charging-station"
$REGION = "us-central1"
$SERVICE_NAME = "ev-charging-frontend"

Write-Host "📍 Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "📍 Region: $REGION`n" -ForegroundColor Yellow

# Step 1: Authenticate
Write-Host "Step 1: Authenticating with GCP..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID
gcloud auth activate-service-account --key-file=credentials/keys/gcp-service-key.json
Write-Host "✓ Authenticated`n" -ForegroundColor Green

# Step 2: Enable APIs
Write-Host "Step 2: Enabling required GCP APIs..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --quiet
Write-Host "✓ APIs enabled`n" -ForegroundColor Green

# Step 3: Deploy directly from source using Cloud Run
Write-Host "Step 3: Deploying to Cloud Run (GCP will build the image)..." -ForegroundColor Cyan
Write-Host "This will take 2-3 minutes...`n" -ForegroundColor Yellow

# Deploy directly from frontend source - GCP handles the build
gcloud run deploy $SERVICE_NAME `
    --source=./frontend `
    --platform=managed `
    --region=$REGION `
    --allow-unauthenticated `
    --memory=512Mi `
    --cpu=1 `
    --timeout=300 `
    --set-env-vars="NEXT_PUBLIC_ENVIRONMENT=production,NEXT_PUBLIC_DEBUG=false" `
    --quiet

Write-Host "✓ Deployed to Cloud Run!`n" -ForegroundColor Green

# Step 4: Get Service URL
Write-Host "Step 4: Getting service URL..." -ForegroundColor Cyan
$SERVICE_URL = gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'

Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`n🌐 Your Frontend is Live at:`n" -ForegroundColor Green
Write-Host "   $SERVICE_URL`n" -ForegroundColor Yellow
Write-Host "📱 Share this link with everyone!" -ForegroundColor Green
Write-Host "💾 Using your $500 GCP Hackathon Credit`n" -ForegroundColor Cyan

# Additional info
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Visit the URL above to see your EV Charging Station app" -ForegroundColor White
Write-Host "  2. Share the link in your GitHub README" -ForegroundColor White
Write-Host "  3. Deploy backend: Update NEXT_PUBLIC_API_URL to your backend URL" -ForegroundColor White
Write-Host "  4. Add to GitHub: git add . && git commit -m 'add deployment' && git push`n" -ForegroundColor White

