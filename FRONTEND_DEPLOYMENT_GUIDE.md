# 🚀 FRONTEND DEPLOYMENT - QUICKSTART

## For Your College Project - Get Live Link in 5 minutes!

Your frontend is built and ready. Just follow these 2-3 commands to go LIVE!

---

## OPTION 1: Firebase Hosting (Fastest - 2 minutes)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Initialize Firebase
```bash
cd "e:\Projects\Working\EV Charging Station"
firebase login  # Login with your Google account
firebase init hosting
```

When prompted:
- Project: `gcs-ev-charging-station`
- Public directory: `frontend/.next`
- Single page app: `Yes`
- GitHub deploy: `No`

### Step 3: Deploy
```bash
firebase deploy --only hosting
```

**✅ Your live link will appear!** Shows something like: `https://gcs-ev-charging-station.web.app`

---

## OPTION 2: Cloud Run (3-5 minutes - Better for Apps)

### One-Command Deployment:
```powershell
# Run the deployment script we created
.\DEPLOY_FRONTEND.ps1
```

Done! Your service URL will be displayed.

---

## OPTION 3: Manual Cloud Run (If issues occur)

```bash
# Authenticate
gcloud config set project gcs-ev-charging-station
gcloud auth activate-service-account --key-file=credentials/keys/gcp-service-key.json

# Build Docker image
docker build -f Dockerfile.prod -t gcr.io/gcs-ev-charging-station/ev-frontend:latest .

# Push to Google Container Registry
docker push gcr.io/gcs-ev-charging-station/ev-frontend:latest

# Deploy to Cloud Run
gcloud run deploy ev-charging-frontend `
    --image=gcr.io/gcs-ev-charging-station/ev-frontend:latest `
    --platform=managed `
    --region=us-central1 `
    --allow-unauthenticated `
    --memory=512Mi

# Get the URL
gcloud run services describe ev-charging-frontend --region=us-central1 --format='value(status.url)'
```

---

## 💰 Important: This Uses Your $500 Hackathon Credit!

✅ **Cost Effective for College Project:**
- Firebase Hosting: $0-5/month free tier
- Cloud Run: First 2 million requests free/month
- Your $500 credit ≈ 2+ years of usage

---

## After Deployment: Update Your Code

Add the live link to your GitHub README:

```markdown
# EV Charging Station Platform

**Live Demo:** [https://your-live-link-here.web.app](https://your-live-link-here.web.app)

**GitHub:** [https://github.com/Pushkarjay/EV-Charging-Station](https://github.com/Pushkarjay/EV-Charging-Station)
```

---

## Troubleshooting

### "Docker not found"
- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Ensure it's running before deployment

### "gcloud not found"
- Install Cloud SDK: https://cloud.google.com/sdk/docs/install
- Run: `gcloud init`

### "Permission denied"
- Run: `gcloud auth activate-service-account --key-file=credentials/keys/gcp-service-key.json`
- Then try again

### "Image already exists"
- Add timestamp to avoid conflicts:
```bash
docker tag ev-frontend:latest gcr.io/gcs-ev-charging-station/ev-frontend:$(date +%s)
```

---

## What's Deployed

✅ Full Next.js React Frontend  
✅ All 8 Pages (Home, Stations, Booking, Dashboard, etc.)  
✅ All 19 Components  
✅ Responsive Design (Mobile + Desktop)  
✅ Google Maps Integration  
✅ Tailwind CSS Styling  

---

## Next: Deploy Backend API

Once frontend is live, deploy backend:
```bash
.\deployment-automation.ps1 -Phase 3
```

Then update `NEXT_PUBLIC_API_URL` in frontend .env to point to your backend Cloud Run URL.

---

**Questions? Check docs/ folder for complete documentation!**

Generated: March 17, 2026  
Project: EV Charging Station Platform - Final Year CSE B.Tech
