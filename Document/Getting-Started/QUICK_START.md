# ⚡ Quick Start - Complete Your Deployment

Follow these steps to finalize your deployment once the database is ready.

---

## 📋 Checklist

**Phase 1: Wait for Database** ⏳  
- [ ] Cloud SQL instance `ev-charging-db` becomes RUNNABLE
- [ ] Estimated wait: 3-5 minutes

**Phase 2: Configure Database** (2 min)
- [ ] Set root password
- [ ] Create application database
- [ ] Create application user

**Phase 3: Connect Backend** (2 min)
- [ ] Update environment variables
- [ ] Redeploy backend service

**Phase 4: Verify** (2 min)
- [ ] Test health endpoint
- [ ] Test API docs
- [ ] View logs

---

## 🚀 Ready to Deploy? Follow These Steps

### Step 1: Check Database Status

```powershell
gcloud sql instances describe ev-charging-db --format="value(state)"
```

**Expected Output**: `RUNNABLE`

If output is `PENDING_CREATE`, wait 2-3 minutes and try again.

---

### Step 2: Run the Database Setup Script

Once database shows `RUNNABLE`:

```powershell
# From project root
.\SETUP_DATABASE.ps1
```

This script will automatically:
1. ✅ Set root password
2. ✅ Create database `charging_platform`
3. ✅ Create user `app_user`
4. ✅ Update backend environment variables
5. ✅ Redeploy backend service

---

### Step 3: Verify Everything is Working

**Check backend health:**
```bash
curl https://ev-charging-backend-329478150613.us-central1.run.app/health
```

**Expected Response:**
```json
{"status": "healthy", "service": "EV Charging Station API", "mode": "full"}
```

**View API documentation:**
```
https://ev-charging-backend-329478150613.us-central1.run.app/docs
```

---

## 🎯 What Happens After Setup

### ✅ Your APIs Will Be Active
- POST `/auth/login` - User login
- POST `/auth/register` - New user registration
- GET `/stations` - List all stations
- POST `/bookings/create` - Create booking
- GET `/bookings/history` - View bookings
- And 20+ more endpoints

### ✅ Database Will Be Connected
- All data will persist
- User accounts stored
- Booking data saved
- Station information synced

### ✅ Full Demo-Ready
- Everything working end-to-end
- Ready for college presentation
- Ready for submission

---

## 🔧 Manual Setup (If Script Doesn't Work)

### 1. Check Database is Ready
```bash
gcloud sql instances describe ev-charging-db --format="value(state)"
```
Should show: `RUNNABLE`

---

### 2. Set Root Password
```bash
gcloud sql users set-password root \
  --instance=ev-charging-db \
  --password="EV_Root_Secure_2026"
```

---

### 3. Create Application Database
```bash
gcloud sql databases create charging_platform --instance=ev-charging-db
```

---

### 4. Create Application User
```bash
gcloud sql users create app_user \
  --instance=ev-charging-db \
  --password="EV_Charging_App_2026"
```

---

### 5. Get Connection IP
```bash
gcloud sql instances describe ev-charging-db \
  --format="value(ipAddresses[0].ipAddress)"
```
Save this IP address.

---

### 6. Redeploy Backend with Database
```bash
gcloud run deploy ev-charging-backend \
  --source=./backend \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --memory=512Mi \
  --set-env-vars="DATABASE_URL=mysql+pymysql://app_user:EV_Charging_App_2026@[IP_FROM_STEP_5]:3306/charging_platform,SKIP_DB_INIT=false"
```

Replace `[IP_FROM_STEP_5]` with the IP address from Step 5.

---

## ✨ Your Live Application

Once complete, you'll have:

### 🌐 **Frontend**
```
https://ev-charging-frontend-329478150613.us-central1.run.app
- All 8 pages working
- Maps integration active
- Database-backed data
```

### 🔌 **Backend API**
```
https://ev-charging-backend-329478150613.us-central1.run.app
- 25+ endpoints active
- Database connected
- Documentation at /docs
```

### 💾 **Database**
```
MySQL 8.0 on Cloud SQL
- 9 normalized tables
- Full ACID compliance
- Automated backups
- High availability
```

---

## 📊 Monitoring Commands

### Watch Backend Logs (Real-time)
```bash
gcloud run services logs read ev-charging-backend \
  --region=us-central1 --limit=50 --follow
```

### Check Database Status
```bash
gcloud sql instances describe ev-charging-db
```

### View All Running Services
```bash
gcloud run services list --format="table(name,status.url,status.conditions.state)"
```

### Test an Endpoint (when DB ready)
```bash
# Get all stations (example - if seeded)
curl -X GET https://ev-charging-backend-329478150613.us-central1.run.app/api/stations
```

---

## 🎯 For College Presentation

**Opening Statement:**
> "We've deployed a complete full-stack EV charging station platform to Google Cloud Platform. Both the frontend and backend are running in production right now. Let me show you the live application..."

**Demo Sequence:**
1. Open frontend URL in browser
2. Navigate through all 8 pages
3. Show responsive design on mobile
4. Open backend API docs
5. Show health endpoint
6. Explain architecture diagram
7. Show deployment commands
8. Demonstrate git history

---

## ❓ Troubleshooting

**Database still says PENDING_CREATE?**
- Wait 5-10 more minutes
- It's initializing in the background
- Run `gcloud sql instances describe ev-charging-db` again

**Backend not connecting to database?**
- Check IP address is correct
- Verify credentials in DATABASE_URL
- Check Cloud SQL firewall rules
- View backend logs: `gcloud run services logs read ev-charging-backend`

**Frontend not loading?**
- Check URL is correct
- Clear browser cache
- Try in incognito mode
- Check service: `gcloud run services describe ev-charging-frontend`

**API docs not showing?**
- Backend must be fully deployed
- Check `/docs` endpoint responds
- Verify FastAPI is running: `curl https://backend-url/health`

---

## 🎊 Next Milestone

After these steps:
- ✅ Frontend: Production ✓
- ✅ Backend: Production ✓
- ✅ Database: Production ✓
- ✅ Application: Ready for demo ✓
- ✅ Documentation: Complete ✓

**Status**: READY FOR COLLEGE SUBMISSION ✅

---

**Last Updated**: March 18, 2026  
**Database Setup Time**: Expected 10-15 minutes from now  
**Total Project Completion**: ~1 hour
