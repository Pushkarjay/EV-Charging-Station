# Frontend - React/Next.js

## Overview
This is a modern, responsive frontend for the EV Charging Station platform built with React 18 and Next.js 14. The design features a professional blue, green, and white color scheme optimized for an EV-focused user experience.

## 🎨 Design Theme

### Color Palette
- **Primary Blue**: `#0ea5e9` - Main brand color, CTA buttons
- **Secondary Green**: `#22c55e` - Success states, availability indicators
- **Accent White**: `#ffffff` - Clean backgrounds
- **Dark**: `#0f172a` - Text and footer backgrounds

### Typography
- **Headings**: Poppins (bold, modern)
- **Body**: Inter (clean, readable)

## 📁 Project Structure

```
frontend/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Footer with links
│   ├── Hero.tsx        # Landing hero section
│   ├── Features.tsx    # Features showcase
│   ├── StationGrid.tsx # Station listings
│   ├── StationCard.tsx # Individual station card
│   ├── StationMap.tsx  # Interactive map
│   ├── StationList.tsx # Station list view
│   ├── Testimonials.tsx # User testimonials
│   ├── CTA.tsx         # Call-to-action sections
│   ├── PricingCard.tsx # Pricing plan card
│   ├── PricingComparison.tsx # Feature comparison table
│   ├── BookingForm.tsx # Multi-step booking form
│   ├── BookingDetails.tsx # Booking summary
│   ├── DashboardStats.tsx # Statistics cards
│   ├── RecentBookings.tsx # Booking history
│   ├── UsageChart.tsx  # Weekly usage chart
│   └── AccountSettings.tsx # User settings
├── pages/              # Next.js pages
│   ├── _app.tsx       # App wrapper
│   ├── _document.tsx  # HTML document
│   ├── index.tsx      # Home page
│   ├── stations.tsx   # Stations page
│   ├── pricing.tsx    # Pricing page
│   ├── booking.tsx    # Booking page
│   ├── dashboard.tsx  # User dashboard
│   ├── login.tsx      # Login page
│   ├── signup.tsx     # Sign up page
│   └── 404.tsx        # Not found page
├── hooks/              # Custom React hooks
│   ├── useAuth.ts     # Authentication hook
│   ├── useFetch.ts    # Data fetching hook
│   └── useGeolocation.ts # Location tracking
├── services/           # API service layer
│   ├── apiClient.ts   # Axios client with interceptors
│   └── index.ts       # Combined services (auth, stations, bookings, etc.)
├── styles/             # CSS and styling
│   ├── globals.css    # Global styles
│   └── theme.css      # Theme utilities
├── utils/              # Utility functions
│   ├── formatters.ts  # Date, currency, number formatting
│   ├── validators.ts  # Input validation
│   ├── storage.ts     # Local/session storage
│   ├── helpers.ts     # Array, object, string helpers
│   └── index.ts       # Barrel export
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── tailwind.config.js  # Tailwind CSS config
├── next.config.js      # Next.js config
├── postcss.config.js   # PostCSS config
└── .env.example        # Environment variables template
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your API URL and keys
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

The development server will automatically reload when you make changes.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start

# Export as static HTML (if needed)
npm run export
```

## 🎯 Key Features

### Pages

1. **Home Page** (`/`)
   - Hero section with CTA
   - Features showcase
   - Popular stations
   - User testimonials
   - Newsletter signup

2. **Stations Page** (`/stations`)
   - Interactive map view
   - Station list with filters
   - Real-time availability
   - Distance sorting
   - Quick booking

3. **Pricing Page** (`/pricing`)
   - Three pricing tiers
   - Feature comparison matrix
   - Monthly/yearly billing toggle
   - Free trial CTA

4. **Booking Page** (`/booking`)
   - Multi-step booking form
   - Station selection
   - Date/time picker
   - Personal information
   - Booking confirmation

5. **Dashboard Page** (`/dashboard`)
   - Statistics cards
   - Recent bookings
   - Weekly usage chart
   - Account settings

6. **Authentication Pages** (`/login`, `/signup`)
   - Email/password forms
   - Form validation
   - Account creation
   - Password recovery options

### Components

All components are fully reusable and follow these patterns:
- Props-based configuration
- TypeScript interfaces for type safety
- Responsive design (mobile-first)
- Tailwind CSS for styling
- React hooks for state management

### Services & Hooks

**Authentication Service**
- Login/signup
- Profile management
- Password changes

**Station Service**
- Get all stations
- Search functionality
- Nearby stations
- Availability checking

**Booking Service**
- Create bookings
- Manage reservations
- Booking history
- Cancellations

**Payment Service**
- Payment methods
- Invoice generation

**Custom Hooks**
- `useAuth` - Authentication state
- `useFetch` - Data fetching with loading/error states
- `useGeolocation` - GPS location tracking

## 🛠️ Available Utilities

### Formatters
- `formatDate()` - Format dates
- `formatCurrency()` - Format money
- `formatDistance()` - Format distances in km/m
- `calculateDistance()` - Haversine distance

### Validators
- `isValidEmail()` - Email validation
- `isValidPassword()` - Password strength
- `isValidPhone()` - Phone format
- `isEmpty()` - Null/empty checks

### Storage
- `getLocalStorage()`/`setLocalStorage()`
- `getSessionStorage()`/`setSessionStorage()`
- `getCookie()`/`setCookie()`

### Helpers
- `chunk()`, `unique()`, `flatten()`, `groupBy()`
- `pick()`, `omit()`, `merge()` for objects
- `capitalize()`, `camelCase()`, `kebabCase()`, `truncate()`

## 📱 Responsive Design

The frontend is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components adapt gracefully to screen sizes.

## 🔒 Security Features

- HTTPS API calls
- CORS configuration
- Input sanitization
- Token-based authentication
- Secure local storage handling
- XSS protection via React escaping

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to change colors:
```js
colors: {
  ev: {
    blue: '#0ea5e9',
    green: '#22c55e',
    white: '#ffffff',
    dark: '#0f172a',
  }
}
```

### Fonts
Update fonts in `_app.tsx`:
```tsx
link href="https://fonts.googleapis.com/css2?family=YourFont"
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t ev-charging-frontend .
docker run -p 3000:3000 ev-charging-frontend
```

### Environment Variables
Set these on your hosting platform:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`

## 📊 Performance

- Next.js automatic code splitting
- Image optimization with `next/image`
- Lazy loading components
- CSS-in-JS for minimal bundle size
- API call caching strategies

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📝 Notes

- Mock data is used in components for demo purposes
- Replace with actual API calls in production
- Google Maps/Mapbox integration ready but placeholder currently shown
- All forms are validated client-side; server-side validation required

## 🔗 API Integration

Services connect to the backend API at `NEXT_PUBLIC_API_URL`. Ensure your backend provides:
- `/api/auth/*` - Authentication endpoints
- `/api/stations/*` - Station data endpoints
- `/api/bookings/*` - Booking management
- `/api/users/*` - User profile data

## 📞 Support

For issues or questions about this frontend:
1. Check existing components for patterns
2. Review Tailwind CSS documentation
3. Consult Next.js documentation
4. Review TypeScript types in components

---

**Built with ❤️ for EV Charging with React, Next.js, TypeScript, and Tailwind CSS**

4. Open http://localhost:3000

## Development Guidelines

- Use functional components with hooks
- Follow component naming conventions (PascalCase)
- Keep components small and focused (single responsibility)
- Use TypeScript for type safety
- Write responsive CSS-in-JS with Tailwind
- Implement proper error handling in services
- Add loading and error states to all async operations

## Build & Deployment

```bash
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
npm run type-check # Run TypeScript check
```

## Related Documentation

- See [Documnets/SYSTEM_ARCHITECTURE.md](../Documnets/SYSTEM_ARCHITECTURE.md) for system overview
- See [Documnets/SRS.md](../Documnets/SRS.md) for feature requirements
- See [docs/api/](../docs/api/) for backend API documentation
