# Frontend - React/Next.js

## Overview
This folder contains all frontend code for the EV Charging Station platform, built with React 18 and Next.js 13.

## Folder Structure

```
frontend/
├── components/          # Reusable UI components (buttons, cards, forms, maps, etc.)
├── pages/              # Next.js page components and routing
├── styles/             # Tailwind CSS configuration and custom styles
├── hooks/              # Custom React hooks (useAuth, useFetch, useLocation, etc.)
├── utils/              # Frontend utilities (formatters, validators, helpers)
├── services/           # API client services for backend communication
└── README.md           # This file
```

## Key Responsibilities

- **Components**: Reusable UI components following design system patterns
- **Pages**: Server-side rendered pages with Next.js best practices
- **Styles**: Responsive design using Tailwind CSS
- **Hooks**: Custom React hooks for login state, API calls, geolocation
- **Services**: API client layer abstracting backend communication
- **Utils**: Helper functions for data transformation, validation, formatting

## Tech Stack

- **Framework**: Next.js 13 (React 18)
- **Styling**: Tailwind CSS 3
- **State Management**: React Context API / Redux (if needed)
- **Maps**: Google Maps API / Mapbox
- **API Client**: Axios / Fetch API
- **Testing**: Jest, React Testing Library
- **Build Tool**: Next.js built-in bundler (Webpack)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with environment variables (see `credentials/.env.example`)

3. Start development server:
   ```bash
   npm run dev
   ```

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
