# 📋 CREDENTIALS & ENVIRONMENT VARIABLES DEMAND

**Created**: March 19, 2026  
**Project**: EV Charging Station Platform  
**Purpose**: Complete backend, frontend, and database setup

---

## 🔐 SECTION 1: GOOGLE CLOUD PLATFORM (GCP)

### 1.1 Service Account JSON Key
**File Location**: `credentials/keys/gcp-service-key.json`

**What you need to provide:**
```
- GCP Service Account JSON file (should already exist)
```

**Verification**:
- [ ] File exists at `credentials/keys/gcp-service-key.json`
- [ ] Contains valid JSON with private_key field
- [ ] Service account has roles: Editor, Cloud Build Editor, Cloud Run Admin

---

## 🗺️ SECTION 2: GOOGLE MAPS API

### 2.1 Google Maps API Key
**Used for**: Maps display, geolocation, distance calculations

**What you need to provide:**
```
GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

**Steps to get it**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Navigate to **APIs & Services** → **Library**
4. Search and enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
   - Distance Matrix API
5. Go to **Credentials** → **Create Credentials** → **API Key**
6. Restrict key to:
   - Application restrictions: HTTP referrers
   - API restrictions: Only Maps APIs above
7. Copy the key

**Expected format**: 
```
AIzaSyCxxxx...xxxxx (alphanumeric, ~39 characters)
```

---

## 📧 SECTION 3: EMAIL SERVICE (GMAIL SMTP)

### 3.1 Gmail Account Credentials
**Used for**: Sending emails (booking confirmations, password resets, notifications)

**What you need to provide**:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=EV Charging Station
```

**Steps to get Gmail App Password**:

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** on the left
3. Enable **2-Step Verification** (if not already enabled)
4. Return to Security page
5. Find **App passwords** option (appears after 2FA is enabled)
6. Select:
   - App: **Mail**
   - Device: **Windows Computer**
7. Generate password (16 characters with spaces)
8. Copy the password (without spaces)

**Expected format**:
```
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx → stored as xxxxxxxxxxxxxxxx
```

---

## 💳 SECTION 4: STRIPE PAYMENT PROCESSING

### 4.1 Stripe API Keys
**Used for**: Processing payments, subscriptions, refunds

**What you need to provide**:
```
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

**Steps to get Stripe Keys**:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up (free account, no credit card) or login
3. **IMPORTANT**: Keep dashboard in **Test Mode** (toggle at top right)
4. Navigate to **Developers** → **API Keys**
5. You'll see two key pairs:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)
6. For Webhook Secret:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `https://your-backend-url/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy **Signing secret**

**Expected format**:
```
STRIPE_PUBLIC_KEY=pk_test_51ItJqLxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_51ItJqLxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_1ItJqLxxxxxxxxxxxxxxxxxxxx
```

---

## 🗄️ SECTION 5: DATABASE CREDENTIALS

### 5.1 Firebase Firestore (Production Database)
**Used for**: Storing all application data (users, stations, bookings, etc.)

**What you need to provide**:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

**Steps to get Firebase Credentials**:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create New Project:
   - Project Name: `ev-charging-station` (or your preferred name)
   - Analytics: Disable (optional)
   - Accept terms
3. Once project created, go to **Project Settings** (gear icon)
4. Click **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will download automatically
7. Open the JSON file and extract:
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY (copy entire key with newlines)
   - `client_email` → FIREBASE_CLIENT_EMAIL
8. For Database URL, go to **Realtime Database** section
   - Enable Firestore if not already enabled
   - Copy database URL

**Expected format**:
```
FIREBASE_PROJECT_ID=ev-charging-station-12345
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIB...\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@ev-charging-station-12345.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://ev-charging-station-12345.firebaseio.com
```

### 5.2 PostgreSQL Credentials (Alternative/Local Database)
**Used for**: If deploying with PostgreSQL instead of Firebase

**What you need to provide**:
```
DB_ENGINE=postgresql
DB_NAME=ev_charging_db
DB_USER=postgres
DB_PASSWORD=secure-password-here
DB_HOST=localhost
DB_PORT=5432
SQLALCHEMY_DATABASE_URI=postgresql://postgres:password@localhost:5432/ev_charging_db
```

**Setup Steps**:
1. Install PostgreSQL (if not installed)
2. Create database:
   ```sql
   CREATE DATABASE ev_charging_db;
   CREATE USER postgres WITH PASSWORD 'your-password';
   GRANT ALL ON DATABASE ev_charging_db TO postgres;
   ```

---

## 🔑 SECTION 6: JWT & AUTHENTICATION

### 6.1 JWT Secret Key
**Used for**: Signing JWT tokens for authentication

**What you need to provide**:
```
JWT_SECRET_KEY=your-super-secret-random-string-minimum-32-characters
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
REFRESH_TOKEN_SECRET=another-secret-key-minimum-32-characters
```

**Steps to generate**:
1. Open Python terminal
2. Run:
   ```python
   import secrets
   print(secrets.token_urlsafe(32))  # For JWT_SECRET_KEY
   print(secrets.token_urlsafe(32))  # For REFRESH_TOKEN_SECRET
   ```
3. Copy both generated strings

**Expected length**: Minimum 32 characters

---

## 🎯 SECTION 7: APPLICATION CONFIGURATION

### 7.1 Basic App Settings
**What you need to provide**:
```
# App Mode
ENVIRONMENT=development  # or production
DEBUG=True  # Set to False in production

# API Configuration
API_BASE_URL=http://localhost:8000  # or your production URL
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# Session/Cookie Settings
SESSION_SECRET=your-session-secret
COOKIE_SECURE=False  # Set to True in production
```

---

## 🔔 SECTION 8: OPTIONAL - NOTIFICATION SERVICES

### 8.1 Firebase Cloud Messaging (FCM)
**Used for**: Push notifications

**What you need to provide**:
```
FCM_PROJECT_ID=your-project-id
FCM_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FCM_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com
```

**Note**: Use same Firebase service account from Section 5.1

### 8.2 SMS Service (Twilio - Optional)
**Used for**: SMS notifications

**What you need to provide**:
```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 📁 SECTION 9: FILE UPLOAD CONFIGURATION

### 9.1 Google Cloud Storage
**Used for**: Storing images, documents

**What you need to provide**:
```
GCS_BUCKET_NAME=ev-charging-bucket-name
GCS_PROJECT_ID=your-gcp-project-id
```

**Steps**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Storage** → **Buckets**
3. Create bucket:
   - Name: `ev-charging-YOUR-UNIQUE-NAME`
   - Location: Choose closest region
   - Access Control: Private
4. Copy bucket name

---

## 🏢 SECTION 10: DEPLOYMENT VARIABLES

### 10.1 GCP Deployment
**What you need to provide**:
```
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1  # or preferred region
GCP_APP_ENGINE_REGION=us-central
CLOUD_RUN_SERVICE_NAME=ev-charging-backend
```

---

## 📋 COMPLETE CHECKLIST

### Backend .env Template
Create file: `backend/.env`
```
# ===== ENVIRONMENT =====
ENVIRONMENT=development
DEBUG=True

# ===== API URLs =====
API_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000

# ===== DATABASE =====
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_DATABASE_URL=

# ===== JWT AUTHENTICATION =====
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
REFRESH_TOKEN_SECRET=

# ===== EMAIL SERVICE =====
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM_NAME=EV Charging Station

# ===== STRIPE PAYMENT =====
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# ===== GOOGLE SERVICES =====
GOOGLE_MAPS_API_KEY=
GCS_BUCKET_NAME=
GCS_PROJECT_ID=

# ===== OPTIONAL SERVICES =====
# FCM_PROJECT_ID=
# FCM_PRIVATE_KEY=
# FCM_CLIENT_EMAIL=
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
```

### Frontend .env Template
Create file: `frontend/.env.local` or `frontend/.env`
```
# ===== API CONFIGURATION =====
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# ===== STRIPE =====
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=

# ===== ENVIRONMENT =====
NEXT_PUBLIC_ENVIRONMENT=development

# ===== FIREBASE (if using client-side) =====
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## ✅ DATA I NEED FROM YOU

**Please provide in your next message the following in this exact format:**

```
## GOOGLE CLOUD & FIREBASE
GCP_SERVICE_ACCOUNT_JSON: [paste entire JSON or confirm file exists]
GOOGLE_MAPS_API_KEY: [your key]
FIREBASE_PROJECT_ID: [ID]
FIREBASE_PRIVATE_KEY: [key]
FIREBASE_CLIENT_EMAIL: [email]
FIREBASE_DATABASE_URL: [URL]

## EMAIL SERVICE
EMAIL_USERNAME: [gmail address]
EMAIL_PASSWORD: [16-character app password]

## STRIPE
STRIPE_PUBLIC_KEY: [pk_test_...]
STRIPE_SECRET_KEY: [sk_test_...]
STRIPE_WEBHOOK_SECRET: [whsec_...]

## JWT SECRETS
JWT_SECRET_KEY: [32+ char random string]
REFRESH_TOKEN_SECRET: [32+ char random string]

## DATABASE (PostgreSQL - if using)
DB_PASSWORD: [your password]
DB_HOST: [localhost or server IP]
DB_PORT: [5432]

## DEPLOYMENT
GCP_REGION: [preferred region]
GCS_BUCKET_NAME: [bucket name]

## OTHER
ENVIRONMENT: [development/production]
DEBUG: [True/False]
```

---

## 🚀 NEXT STEPS

1. **Gather all credentials** using the steps provided above
2. **Provide all values** in your next message
3. I will:
   - Create `.env` files automatically
   - Configure all services
   - Complete backend setup
   - Complete frontend setup
   - Initialize database
   - Run tests
   - Confirm everything works

---

**Timeline**: Once you provide credentials, full setup should take **30-45 minutes**

