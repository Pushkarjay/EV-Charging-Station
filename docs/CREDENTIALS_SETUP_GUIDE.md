# 🔐 Credentials Setup Guide for EV Charging Station

Complete step-by-step guide to obtain all necessary API credentials.

---

## 1. 🛒 STRIPE PAYMENT CREDENTIALS

### Why: Payment processing for booking transactions

### Step-by-Step Guide:

#### A. Create Stripe Account

1. Visit: https://dashboard.stripe.com/register
2. Enter your email and password
3. Accept terms and complete registration
4. Verify your email address

#### B. Get API Keys

1. After login, go to **Dashboard**
2. Left sidebar → **Developers** → **API Keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
4. Click "Reveal test key" if hidden
5. Copy both keys

**⚠️ Important**: 
- Never share your secret key!  
- Test mode keys start with `test_`
- Production keys start with `live_` (don't use for testing)

#### C. Example Keys (NEVER use these - get your own!)
```
Publishable: pk_test_51234567890abcdefghijk
Secret: sk_test_abcdefghijk1234567890
```

---

## 2. 📧 GMAIL / SMTP EMAIL CREDENTIALS

### Why: Send booking confirmations and notifications

### Step-by-Step Guide (Gmail):

#### A. Create Gmail Account (if you don't have one)

1. Visit: https://accounts.google.com/signup
2. Follow the registration steps
3. Verify your phone number
4. Complete setup

#### B. Generate App Password

1. Go to: https://myaccount.google.com/
2. Left sidebar → **Security**
3. Look for **App passwords** (at bottom)
   - If you don't see it, enable 2-Step Verification first:
     - Go to **2-Step Verification**
     - Click "Get Started"
     - Follow SMS verification steps
     
4. Once in **App passwords**:
   - Select **App**: Mail
   - Select **Device**: Windows Computer (or your OS)
   - Click **Generate**
   
5. Gmail shows a **16-character password** (with spaces)
   - Copy this password (without spaces)

#### C. Gmail Credentials

```
Email: your-email@gmail.com
App Password: xxxx xxxx xxxx xxxx (copy without spaces)
```

**Alternative**: Use your Gmail password (less secure, but works if 2FA is off)

---

## 3. 🗺️ GOOGLE MAPS API KEY

### Why: Show charging stations on map, get location coordinates

### Step-by-Step Guide:

#### A. Create Google Cloud Project

1. Visit: https://console.cloud.google.com/
2. Click **Select a Project** (top left)
3. Click **NEW PROJECT**
4. Enter name: "EV Charging Station"
5. Click **CREATE**
6. Wait for project creation (1-2 minutes)

#### B. Enable APIs

1. Top search bar → search **Maps**
2. Select **Maps JavaScript API**
3. Click **ENABLE**
4. Go back and search **Geocoding API**
5. Click **ENABLE** (optional, for address lookup)

#### C. Create API Key

1. Left sidebar → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. A popup shows your API key (looks like `AIzaSyD...`)
4. Click **COPY**
5. Click **CLOSE**

#### D. Restrict API Key (Security)

1. In **Credentials**, find your key in the list
2. Click on it to open details
3. Under **API restrictions**:
   - Select **Restrict key**
   - Check these APIs:
     - ✓ Maps JavaScript API
     - ✓ Geocoding API (optional)
     - ✓ Places API (optional)
4. Under **Application restrictions**:
   - Select **HTTP referrers (web sites)**
   - Add: `http://localhost:3000/*`
   - Add: `http://localhost:8000/*`
5. Click **SAVE**

---

## 📋 Summary: Your Credentials Format

When you have all credentials, they should look like this:

```
STRIPE_SECRET_KEY=sk_test_abcdefg...
STRIPE_PUBLISHABLE_KEY=pk_test_abcdefg...

SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=xxxxxxxxxxxx

GOOGLE_MAPS_API_KEY=AIzaSyD...
```

---

## ⚠️ Security Tips

✅ **DO**:
- Store credentials in `.env` file (never in code)
- Use test keys for development
- Rotate keys regularly in production
- Never commit `.env` file to git

❌ **DON'T**:
- Share your secret keys
- Put credentials in code comments
- Use production keys for testing
- Commit `.env` file to GitHub

---

## 🔗 Quick Links

| Service | Link |
|---------|------|
| **Stripe** | https://dashboard.stripe.com |
| **Gmail** | https://myaccount.google.com/security |
| **Google Cloud** | https://console.cloud.google.com |

---

## 📝 Have Your Credentials Ready?

Once you have all three sets, share them and I'll:

1. ✅ Create `.env` file with all credentials
2. ✅ Implement Stripe payment processing
3. ✅ Setup email notification service
4. ✅ Integrate Google Maps for station location display
5. ✅ Test all integrations
6. ✅ Update backend to use real services

**Next Step**: Provide your credentials in this format:

```
Stripe Secret Key: [your key]
Stripe Publishable Key: [your key]
Gmail Email: [your email]
Gmail App Password: [your password]
Google Maps API Key: [your key]
```

---

**Ready? Let me know once you have the credentials!**
