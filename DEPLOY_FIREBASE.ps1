#!/usr/bin/env pwsh
# Firebase Hosting Deployment - SIMPLEST METHOD
# No service account permissions needed!

Write-Host "`n🚀 EV Charging Station - Firebase Hosting Deployment`n" -ForegroundColor Cyan
Write-Host "This is the EASIEST way to get a live link!`n" -ForegroundColor Green

# Step 1: Check if Firebase CLI is installed
Write-Host "Step 1: Checking Firebase CLI..." -ForegroundColor Cyan
$firebaseCheck = firebase --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "📦 Installing Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
}
Write-Host "✓ Firebase CLI ready`n" -ForegroundColor Green

# Step 2: Build Next.js
Write-Host "Step 2: Building Next.js app..." -ForegroundColor Cyan
cd frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend built`n" -ForegroundColor Green
cd ..

# Step 3: Login to Firebase
Write-Host "Step 3: Logging into Firebase..." -ForegroundColor Cyan
Write-Host "Your browser will open for authentication (use your Google account)`n" -ForegroundColor Yellow
firebase login --no-localhost

# Step 4: Deploy to Firebase Hosting
Write-Host "`nStep 4: Deploying to Firebase Hosting..." -ForegroundColor Cyan
firebase deploy --project=gcs-ev-charging-station

Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host "`nYour apps are now live:`n" -ForegroundColor Green
firebase hosting:channel --project=gcs-ev-charging-station
Write-Host "`n✨ Share the hosting URL with everyone!`n" -ForegroundColor Yellow
