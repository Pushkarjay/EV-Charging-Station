# EV Charging Station - Data Setup & Location Features Guide

## ✅ Setup Complete - Mock User & Data

### Mock User Credentials
- **Email**: mock@gmail.com
- **Password**: mockdata1234
- **Status**: Demo user for testing all features

### Database Content
- **EV Stations**: 10 charging stations in Bhubaneswar, India
- **Demo Users**: 2 additional demo users
- **Total Chargers**: 151 charging ports across all stations
- **Default Location**: Bhubaneswar (20.2961°N, 85.8245°E)

---

## 🗺️ Location Features Analysis

### 1. **Current Location Features**

#### A. Geolocation (Live Location Capture)
**File**: `frontend/hooks/useGeolocation.ts`
- ✅ **Status**: IMPLEMENTED
- **Features**:
  - Uses `navigator.geolocation.watchPosition()` for continuous tracking
  - High accuracy enabled (`enableHighAccuracy: true`)
  - 5-second timeout for location requests
  - Returns: `{ location, loading, error }`
  - Handles permission requests automatically

**Usage**:
```javascript
const { location, loading, error } = useGeolocation();
// location = { latitude, longitude, accuracy }
```

**Browser Permissions**:
- On first use, browser prompts for location permission
- User must grant permission for geolocation to work
- Works on HTTPS and localhost (for development)

#### B. Default Location (Maps)
- **Location**: Bhubaneswar, India
- **Coordinates**: 20.2961°N, 85.8245°E
- **Files Updated**:
  - `backend/app/config.py` → DEFAULT_MAP_CENTER_LAT/LNG
  - `frontend/components/StationMap.tsx` → Initial mapCenter state

#### C. Search Features
**Files**:
- `frontend/components/StationList.tsx` - Filter interface with buttons
- `frontend/services/index.ts` - API service methods

**Available Filters**:
1. **All Stations** - Shows all active stations
2. **Available Only** - Filters stations with available chargers
3. **Nearby** - Stations within 2 km radius (requires geolocation)
4. **Highly Rated** - 4.7+ stars only

**Search Endpoints**:
```
GET /api/stations - Get all stations
GET /api/stations/search?query=name&lat=20.29&lng=85.82&radius=10 - Search by name/city
GET /api/stations/nearby?lat=20.29&lng=85.82&radius=10 - Get nearby stations
```

#### D. Map Component
**File**: `frontend/components/StationMap.tsx`
- ✅ **Real API Integration**: Fetches from backend
- ✅ **Fallback to Mock Data**: If no database data
- ✅ **Marker System**: Shows available chargers count
- ✅ **Station Selection**: Click marker to view details
- ✅ **Distance Calculation**: Using Haversine formula (backend)

---

## 🎯 Location Option Where-About

### Map Component Integration Points
1. **Station Map View**: `frontend/pages/stations.tsx`
   - Shows map with all station markers
   - Default center: Bhubaneswar

2. **Geolocation Usage**: Could be implemented in:
   - Search/filter "Nearby" stations
   - Auto-center map to user location
   - Distance calculation from user to stations

3. **Search Bar**: Filter buttons in `StationList.tsx`
   - Query-based search for station names
   - Filter buttons for availability/proximity

### Why Stations Might Not Be Visible

**Possible Issues & Solutions**:

1. **Database Empty** ✅ FIXED
   - Solution: Run `python seed.py`
   - Result: 10 stations now available in Bhubaneswar

2. **API Response Format Issue** ⚠️ CHECK
   - Frontend expects: `{ id, name, latitude, longitude, available_chargers }`
   - Backend returns: All fields in StationResponse schema
   - Both formats match ✅

3. **Map Center Not Updated** ✅ FIXED
   - Updated StationMap.tsx to use Bhubaneswar (20.2961, 85.8245)
   - Map will now center on first fetched station

4. **Google Maps API Key** ⚠️ CHECK
   - Frontend requires Google Maps library
   - Check: `frontend/.env.local` for GOOGLE_MAPS_API_KEY
   - Current: Using mock markers if API unavailable

---

## 🚀 Testing Checklist

- [ ] Start backend: `python -m uvicorn app.main:app --reload`
- [ ] Start frontend: `npm run dev`
- [ ] Login with: mock@gmail.com / mockdata1234
- [ ] Navigate to `/stations` page
- [ ] Verify 10 markers appear on Bhubaneswar map
- [ ] Click markers to see station details
- [ ] Test filters (All, Available, Nearby, Rated)
- [ ] Request geolocation permission in browser
- [ ] Verify "Nearby" filter shows stations < 2km away

---

## 📊 Real Data for Demonstration

### Bhubaneswar EV Charging Stations (10 total)

| Station Name | Location | Chargers | Available | Rating | Price/kWh |
|---|---|---|---|---|---|
| New Delhi Express | Central | 15 | 8 | 4.8 | ₹0.32 |
| Green Energy Hub | Nayapalli | 12 | 5 | 4.1 | ₹0.30 |
| Eco-Charge Station | Jaydev Vihar | 10 | 7 | 4.5 | ₹0.28 |
| PowerFast Charging | Satya Nagar | 20 | 12 | 4.9 | ₹0.35 |
| Smart Grid Station | Acharya Vihar | 14 | 9 | 4.3 | ₹0.31 |
| Rapid Charge Hub | Rail Nagar | 18 | 11 | 4.2 | ₹0.33 |
| Pure Volt Station | Saheed Nagar | 16 | 10 | 4.4 | ₹0.29 |
| ElectroMart | Kharavela Nagar | 22 | 14 | 4.8 | ₹0.34 |
| Quick Charge Point | Chalantika | 11 | 6 | 4.5 | ₹0.27 |
| Future Energy Hub | CDA | 13 | 8 | 4.3 | ₹0.32 |

---

## 🔐 User-Specific Data

### Real User Data
- Only registered users see their own bookings/history
- Each user has separate session with JWT token
- New real users: Start with clean slate (no demo data)

### Mock User Data
- All 10 Bhubaneswar stations visible to mock user
- Real user bookings/data isolated from mock
- For demonstration purposes only

---

## 📍 Geolocation Permission Prompt

When user clicks "Nearby" filter or uses location-based features:
1. Browser shows permission dialog
2. User grants location permission
3. Frontend captures GPS coordinates
4. API searches for nearby stations (< 2 km radius)
5. Results shown on map and list

---

## Next Steps

1. Test the complete flow with mock@gmail.com
2. Verify stations appear on map
3. Test geolocation permission request
4. Test search/filter functionality
5. Create new real user and verify isolation of data
