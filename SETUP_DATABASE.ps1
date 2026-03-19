#!/usr/bin/env pwsh
# Database Setup Script for EV Charging Station
# Run this once the Cloud SQL instance is RUNNABLE

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "EV Charging Station - Database Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$dbInstance = "ev-charging-db"
$dbName = "charging_platform"
$appUser = "app_user"
$appPassword = "EV_Charging_App_2026"
$projectId = "gcs-ev-charging-station"

# Step 1: Check database status
Write-Host "Step 1: Checking database status..." -ForegroundColor Yellow
$status = gcloud sql instances describe $dbInstance --format="value(state)"
Write-Host "Database Status: $status" -ForegroundColor Green

if ($status -ne "RUNNABLE") {
    Write-Host "⚠️  Database not ready yet. Please wait and try again." -ForegroundColor Yellow
    exit 1
}

# Step 2: Set root password
Write-Host ""
Write-Host "Step 2: Setting root password..." -ForegroundColor Yellow
gcloud sql users set-password root --instance=$dbInstance --password="EV_Root_Secure_2026"
Write-Host "✅ Root password set" -ForegroundColor Green

# Step 3: Create database
Write-Host ""
Write-Host "Step 3: Creating application database..." -ForegroundColor Yellow
gcloud sql databases create $dbName --instance=$dbInstance
Write-Host "✅ Database created: $dbName" -ForegroundColor Green

# Step 4: Create app user
Write-Host ""
Write-Host "Step 4: Creating application user..." -ForegroundColor Yellow
gcloud sql users create $appUser --instance=$dbInstance --password=$appPassword
Write-Host "✅ App user created: $appUser" -ForegroundColor Green

# Step 5: Get connection details
Write-Host ""
Write-Host "Step 5: Getting connection details..." -ForegroundColor Yellow
$dbDetails = gcloud sql instances describe $dbInstance --format="json" | ConvertFrom-Json
$publicIp = $dbDetails.ipAddresses[0].ipAddress
$connectionName = $dbDetails.connectionName

Write-Host "Public IP: $publicIp" -ForegroundColor Green
Write-Host "Connection Name: $connectionName" -ForegroundColor Green

# Step 6: Update backend environment variables
Write-Host ""
Write-Host "Step 6: Updating backend environment variables..." -ForegroundColor Yellow

$databaseUrl = "mysql+pymysql://${appUser}:${appPassword}@${publicIp}:3306/${dbName}?charset=utf8mb4"

Write-Host "DATABASE_URL: $databaseUrl" -ForegroundColor Cyan

# Step 7: Re-deploy backend
Write-Host ""
Write-Host "Step 7: Re-deploying backend with full database support..." -ForegroundColor Yellow

$env:SKIP_DB_INIT = "false"

gcloud run deploy ev-charging-backend `
    --source=./backend `
    --platform=managed `
    --region=us-central1 `
    --allow-unauthenticated `
    --memory=512Mi `
    --set-env-vars="DATABASE_URL=${databaseUrl},SKIP_DB_INIT=false,PYTHONUNBUFFERED=1"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ Database Setup Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend has been updated with database connection." -ForegroundColor Green
Write-Host "The API is now running with full database support!" -ForegroundColor Green
Write-Host ""
Write-Host "Check status:" -ForegroundColor Yellow
Write-Host "gcloud run services describe ev-charging-backend --region=us-central1" -ForegroundColor Cyan
