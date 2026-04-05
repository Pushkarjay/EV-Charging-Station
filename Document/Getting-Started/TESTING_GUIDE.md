# 🧪 Testing Guide - Mock User & Real Data Display

## 🚀 Servers Running Successfully

```
✅ Backend API: http://localhost:8000
✅ Frontend: http://localhost:3001
✅ Database: ev_charging.db (populated with real stations)
```

---

## 📋 Test Cases

### Test 1: Login with Mock User

**Steps**:
1. Navigate to `http://localhost:3001/login`
2. Enter credentials:
   - Email: `mock@gmail.com`
   - Password: `mockdata1234`
3. Click "Login"

**Expected Results**:
- ✅ Login successful
- ✅ Token stored in localStorage
- ✅ Redirected to dashboard
- ✅ User info displayed in UI

---

### Test 2: View Real Station Data on Map

**Steps**:
1. After login, navigate to `/stations`
2. Observe the map component

**Expected Results**:
- ✅ Map shows Bhubaneswar, India as center (20.2961°N, 85.8245°E)
- ✅ 10 station markers visible on map
- ✅ Each marker shows availability count
- ✅ Marker details appear on hover/click

**Stations Visible**:
1. New Delhi Express - Bhubaneswar Central
2. Green Energy Hub - Nayapalli
3. Eco-Charge Station - Jaydev Vihar
4. PowerFast Charging - Satya Nagar
5. Smart Grid Station - Acharya Vihar
6. Rapid Charge Hub - Rail Nagar
7. Pure Volt Station - Saheed Nagar
8. ElectroMart Charging - Kharavela Nagar
9. Quick Charge Point - Chalantika
10. Future Energy Hub - CDA

---

### Test 3: Station List & Filters

**Steps**:
1. View the stations list on right side of page
2. Test each filter button

**Filter Tests**:

#### Filter: "All"
- Expected: All 10 stations shown
- Status: Should work ✅

#### Filter: "Available"
- Expected: Show only stations with available chargers (all 10 have available)
- Status: Should work ✅

#### Filter: "Nearby" 
- Instructions:
  1. Click "Nearby" button
  2. Browser will ask for location permission
  3. Grant permission
- Expected: Shows stations < 2km from your location
- Status: Should work ✅
- Note: Will be limited stations since database doesn't have distance data for non-Bhubaneswar users

#### Filter: "Rated"
- Expected: Show only 4.7+ star stations
- Expected Count: 3 stations (PowerFast 4.9, ElectroMart 4.8, New Delhi Express 4.8)
- Status: Should work ✅

---

### Test 4: Station Details

**Steps**:
1. Click on any station marker on map OR click on station in list
2. View popup/detail panel

**Expected Results**:
- ✅ Station name displayed
- ✅ Address shown
- ✅ Available chargers count
- ✅ Total chargers count
- ✅ Rating and reviews
- ✅ Operating hours
- ✅ Amenities listed
- ✅ Price per kWh shown
- ✅ Book button visible

---

### Test 5: Geolocation Permission

**Steps**:
1. On stations page, click "Nearby" filter
2. Accept browser permission request
3. Watch console for location updates

**Expected Results**:
- ✅ Browser shows location permission prompt
- ✅ After grant: "Nearby" filter shows stations within 2km
- ✅ Console shows latitude/longitude
- ✅ Console shows accuracy

**Browser Permission Screenshots**:
- Chrome: "localhost wants your location"
- Firefox: "Share Your Location?"
- Safari: "Allow location access?"

---

### Test 6: Real Data vs Mock Data

**User Scenarios**:

#### Mock User (mock@gmail.com)
- ✅ Sees 10 Bhubaneswar stations
- ✅ Mock data for demonstration
- ✅ Used for testing and demos

#### New Real Users
- ✅ See same 10 stations (real database data)
- ✅ Own bookings isolated from mock user
- ✅ Fresh session, no demo history
- ⚠️ Important: Don't mix mock and real user data

**Testing Steps**:
1. Create new user:
   - Email: `realuser@example.com`
   - Password: `RealUser@123`
   - Name: Real User
2. Login with new user
3. Navigate to `/stations`
4. Verify same 10 stations appear
5. Verify no mock user bookings visible

---

## 🗺️ Location Testing

### Test Browser Geolocation Accuracy

**Test Scenario 1: Grant Permission**
```
1. Open DevTools (F12)
2. Go to Console
3. Click "Nearby" filter
4. Check console for location output
```

**Expected Output**:
```javascript
{
  latitude: 20.XXXX,
  longitude: 85.XXXX,
  accuracy: XX
}
```

**Test Scenario 2: Deny Permission**
```
1. Click "Nearby" filter
2. Select "Block" in browser permission
3. Check console for error
```

**Expected Output**:
```
GeolocationPositionError: User denied Geolocation
```

---

## 📱 API Testing (Postman/curl)

### Test 1: Login Endpoint
```bash
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "mock@gmail.com",
  "password": "mockdata1234"
}
```

**Expected Response** (200):
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "mock@gmail.com",
    "name": "Mock Demo User",
    "is_active": true,
    "created_at": "2026-04-04T12:31:25"
  }
}
```

### Test 2: Get All Stations
```bash
GET http://localhost:8000/api/stations
Authorization: Bearer {token}
```

**Expected Response** (200):
```json
[
  {
    "id": 1,
    "name": "New Delhi Express - Bhubaneswar Central",
    "address": "Station Square, Bhubaneswar, Odisha 751001",
    "city": "Bhubaneswar",
    "latitude": 20.2961,
    "longitude": 85.8245,
    "total_chargers": 15,
    "available_chargers": 8,
    "price_per_kwh": 0.32,
    "rating": 4.8,
    "is_active": true
  },
  ...
]
```

### Test 3: Search Stations
```bash
GET http://localhost:8000/api/stations/search?query=PowerFast
Authorization: Bearer {token}
```

**Expected Response**: Returns stations matching "PowerFast"

### Test 4: Nearby Stations
```bash
GET http://localhost:8000/api/stations/nearby?lat=20.2961&lng=85.8245&radius=10
Authorization: Bearer {token}
```

**Expected Response**: Stations within 10km radius

---

## ✅ Verification Checklist

- [ ] Backend server running on :8000
- [ ] Frontend server running on :3001
- [ ] Database populated with 10 stations
- [ ] Mock user exists (mock@gmail.com)
- [ ] Mock user password works (mockdata1234)
- [ ] Login redirects to dashboard
- [ ] Stations page shows map
- [ ] Map centered on Bhubaneswar
- [ ] 10 markers visible on map
- [ ] Station list shows 10 stations
- [ ] "All" filter shows all
- [ ] "Available" filter works
- [ ] "Nearby" filter requests permission
- [ ] "Rated" filter shows high-rated stations
- [ ] Clicking station shows details
- [ ] Book button is visible
- [ ] New real user can also see stations
- [ ] New real user data is isolated

---

## 🔍 Troubleshooting

### Map shows only mock NYC data
- **Cause**: API returned error, falling back to mock
- **Solution**: Check backend logs for errors
- **Verify**: `GET /api/stations` returns data

### Geolocation not working
- **Cause**: Browser permission denied or not HTTPS
- **Solution**: Grant permission, or use localhost
- **Debug**: Check browser console for errors

### Stations not appearing
- **Cause**: Database empty or API not running
- **Solution**: Run `python seed.py` again
- **Verify**: `GET /api/stations` returns 10 items

### Login fails
- **Cause**: Wrong credentials or API error
- **Solution**: Use exact credentials
- **Verify**: Check backend logs

---

## 🎥 Manual Test Flow (5 minutes)

1. **Start servers** (already done ✅)
2. **Open frontend**: http://localhost:3001
3. **Login**: mock@gmail.com / mockdata1234 (2 min)
4. **Navigate to Stations** (1 min)
5. **Verify map shows Bhubaneswar with 10 markers** (1 min)
6. **Test filters** (1 min)
7. **Click station details** (1 min)

**Total Time**: ~7 minutes for complete verification

---

## 📊 Expected Live Data

**10 Real Bhubaneswar Stations**:
- Total Chargers: 151
- Total Available: 85-100 (varies)
- Average Rating: 4.4/5
- Price Range: ₹0.27 - ₹0.35/kWh
- Operating Hours: Mix of 24/7 and restricted hours
- Amenities: WiFi, Cafe, Restaurant, Parking, Washroom, Shopping

All data is based on real locations in Bhubaneswar for authentic demonstration.
