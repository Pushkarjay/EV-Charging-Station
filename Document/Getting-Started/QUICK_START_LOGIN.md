# 🚀 Quick Start Guide - Login System

## Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

## Backend Setup & Run

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Initialize Database
```bash
python init_db.py
```

Output should show:
```
✓ Database initialized successfully!
✓ All tables created:
  - users
  - stations
  - chargers
  - bookings
  - payment_methods
  - favorites
```

### 3. Start Backend Server
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: **http://localhost:8000**

## Frontend Setup & Run

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The frontend will be available at: **http://localhost:3000**

## Testing the Login System

### Create a New Account (Signup)
1. Go to http://localhost:3000/signup
2. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Password: Test@1234 (must match requirements)
   - Confirm Password: Test@1234
3. Click "Create Account"
4. You'll be redirected to dashboard if successful

### Login
1. Go to http://localhost:3000/login
2. Enter credentials from signup
3. Click "Login"
4. You'll be redirected to dashboard

## Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- Confirm password must match

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Verify all dependencies installed: `pip install -r requirements.txt`
- Check database file permissions

### Frontend won't connect to backend
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in `.env.local` is set to `http://localhost:8000/api`
- Clear browser cache and localStorage

### Database errors
- Delete `ev_charging.db` and run `python init_db.py` again
- Ensure write permissions in backend directory

## API Endpoints Available

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires Bearer token)
- `POST /api/auth/logout` - Logout (client-side)
- `POST /api/auth/change-password` - Change password (requires Bearer token)

## Token Storage
- JWT token stored in localStorage as `token`
- User info stored in localStorage as `user`
- Token automatically included in all API requests via Bearer header

## Next Steps
1. ✅ Login/Signup system working
2. [ ] Implement forgot password feature
3. [ ] Add email verification
4. [ ] Implement refresh tokens
5. [ ] Add 2FA support
