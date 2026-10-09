# 🗺️ LukAround — Smart Tourist Itinerary Generator & Travel Advisory for Indian Cities

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.19.2-black.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-336791.svg)](https://www.postgresql.org/)
[![AI Powered](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3%20%7C%20Geoapify-orange.svg)](https://groq.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20SSO-FFCA28.svg)](https://firebase.google.com/)

> **LukAround** is an enterprise-grade, AI-orchestrated smart tourist itinerary generator and travel advisory platform engineered specifically for Indian cities. It combines real-time Generative AI (Groq LLaMA 3.3 / Qwen) with geospatial clustering (Haversine Distance algorithms) to eliminate zig-zag transit, sequence tourist attractions by circadian time-of-day suitability, estimate multi-modal inter-stop transit fares (Auto Rickshaw, Cab, Bus, Walking), curate tier-based hotel stays, provide persistent 24/7 tourist safety/police emergency tools, and deliver full role-based administration (RBAC) with real-time platform monitoring.

---

## 📑 Table of Contents

1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [Full System Architecture](#-full-system-architecture)
   - [Architectural Overview Diagram](#architectural-overview-diagram)
   - [Data Flow & Itinerary Engine Pipeline](#data-flow--itinerary-engine-pipeline)
   - [Authentication & RBAC Security Model](#authentication--rbac-security-model)
3. [Technology Stack Matrix](#-technology-stack-matrix)
4. [Core Features & User Workflows](#-core-features--user-workflows)
   - [1. Intelligent Itinerary Generator (Haversine & Time-of-Day)](#1-intelligent-itinerary-generator)
   - [2. Multi-Modal Transit Strip Guidance](#2-multi-modal-transit-strip-guidance)
   - [3. Curated Hotel Accommodations](#3-curated-hotel-accommodations)
   - [4. Tourist Safety Hub & Floating Emergency SOS](#4-tourist-safety-hub--floating-emergency-sos)
   - [5. Live Trip Budget Calculator](#5-live-trip-budget-calculator)
   - [6. Dynamic Hero Slider & Scene Personalization](#6-dynamic-hero-slider--scene-personalization)
   - [7. Comprehensive SuperAdmin & Platform Radar](#7-comprehensive-superadmin--platform-radar)
   - [8. Multi-Lingual & Offline Export Capabilities](#8-multi-lingual--offline-export-capabilities)
5. [Directory & Codebase Layout](#-directory--codebase-layout)
6. [Complete REST API Specification](#-complete-rest-api-specification)
7. [Database Schema & Dual-Mode Fallback Engine](#-database-schema--dual-mode-fallback-engine)
8. [Getting Started & Local Setup](#-getting-started--local-setup)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Configuration](#environment-configuration)
   - [Starting Development Servers](#starting-development-servers)
9. [Preconfigured Test & Demo Accounts](#-preconfigured-test--demo-accounts)
10. [License](#-license)

---

## 🎯 Executive Summary & Problem Statement

Traveling across Indian cities presents unique challenges:
- **Chaotic Urban Transit & Traffic Jams**: Tourists frequently bounce across opposing sides of dense metropolitan areas because itineraries lack geographic awareness.
- **Suboptimal Time-of-Day Scheduling**: Visiting outdoor monuments during the 1:00 PM sun or missing sunrise vantage points and evening spiritual ceremonies due to static scheduling.
- **Unclear Transit Pricing**: Navigating local auto rickshaws, cabs, buses, and metro lines without fare transparency leads to overcharging.
- **Scattered Emergency & Safety Information**: Finding jurisdictional police precinct contacts, verified tourist police desks, or emergency helplines during distress.

### How LukAround Solves This
**LukAround** acts as an autonomous digital travel concierge:
1. **Haversine Distance Clustering**: Clusters attractions into geographically compact sectors per day, minimizing travel hours and carbon footprint.
2. **Circadian Time Sequencing**: Morning outdoor heritage -> Midday indoor air-conditioned museums/galleries -> Late-afternoon cultural walks -> Sunset scenic viewpoints -> Evening culinary bazaars and cultural shows.
3. **Transparent Inter-Stop Transit Strips**: Calculates real-time distance (km), transit time (mins), and fair INR costs for **Auto Rickshaws**, **App Cabs (Ola/Uber)**, **City Bus/Metro**, and **Walking**.
4. **Dual-Core Reliability**: Integrates **Groq Cloud AI (LLaMA 3.3 70B)** and **Geoapify Places API** for live web intelligence, while maintaining an offline-ready rule-based intelligence engine that operates with zero downtime if external APIs or databases are unavailable.

---

## 🏛️ Full System Architecture

### Architectural Overview Diagram

```mermaid
graph TD
    subgraph Client ["Frontend Client (React 18 + Vite)"]
        UI[Responsive SPA Interface]
        Hero[HeroSlider with Ken Burns & Unsplash]
        CityPick[CitySelector 1-10 Days]
        ItinView[Itinerary Timeline & Map]
        TransitStrip[Multi-Modal Transit Strip]
        HotelPanel[Hotels Filterable by Tier]
        SafetyPanel[Safety Hub & Police Station Directory]
        SosModal[Floating One-Touch Emergency SOS]
        AdminUI[Admin Dashboard & Radar]
        AuthClient[Firebase Google SSO & Local JWT Auth]
    end

    subgraph API ["Backend API Gateway (Express 4.19 + Node.js)"]
        Router[Express Router & Middleware]
        Cors[CORS & Cookie Parser]
        Logger[Visitor Tracker & Request Logger]
        AuthMiddleware[JWT / Firebase Bearer Token Verifier]
        RBAC[Role Guard: User / Admin / SuperAdmin]
    end

    subgraph CoreServices ["Application Core Services"]
        AI_Service[aiItineraryService: Groq LLaMA 3.3]
        Engine[itineraryEngine: Haversine Clustering & Time Sequencing]
        UserStore[userStore: RBAC State, Flags & Audit Logs]
    end

    subgraph ExternalAPIs ["External Cloud Services"]
        Groq[Groq Cloud LLM API]
        Geoapify[Geoapify Places & Geocoding API]
        Firebase[Firebase Authentication]
        Unsplash[Unsplash Dynamic Imagery CDN]
    end

    subgraph DataPersistence ["Persistence & Storage Layer"]
        PG[(PostgreSQL 12+ Relational DB)]
        LocalStore[(Dual-Mode Fallback JSON UserStore)]
    end

    UI --> Router
    AuthClient --> Firebase
    AuthClient --> Router
    Router --> Cors --> Logger --> AuthMiddleware --> RBAC
    RBAC --> AI_Service
    RBAC --> Engine
    RBAC --> UserStore
    AI_Service --> Groq
    AI_Service --> Geoapify
    AI_Service --> Engine
    Engine --> PG
    Engine -.->|Fallback if DB Offline| LocalStore
    UserStore --> LocalStore
```

### Data Flow & Itinerary Engine Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Tourist as Tourist / User
    participant FE as LukAround Frontend (React)
    participant BE as Express API (/api/itinerary)
    participant AI as AI Itinerary Service (Groq / Geoapify)
    participant Calc as Haversine Distance Engine
    participant DB as PostgreSQL / Local Seed Store

    Tourist->>FE: Selects City (e.g., Jaipur) & Duration (3 Days)
    FE->>BE: POST /api/itinerary { city: "Jaipur", days: 3 }
    BE->>AI: Request AI Itinerary Generation
    alt Groq AI & Geoapify Online
        AI->>AI: Query POIs, Coordinates & Descriptions
        AI->>Calc: Group POIs by Proximity & Sequence by Time-of-Day
    else External Services Unavailable / Fallback
        BE->>DB: Fetch Curated Attractions Catalog for City
        DB-->>Calc: Raw Attraction POIs with Lat/Lng & Categories
        Calc->>Calc: Cluster via Haversine Distance (Daily Radii)
        Calc->>Calc: Sort by Slot: Morning -> Midday -> Afternoon -> Sunset -> Evening
    end
    Calc->>Calc: Compute Inter-Stop Transit (Auto, Cab, Bus, Walk)
    Calc->>Calc: Calculate Daily & Total Trip Budget (INR)
    Calc-->>BE: Synthesized Itinerary Object with Days, Stops, Transit, & Advisory
    BE-->>FE: HTTP 200 JSON Response
    FE->>Tourist: Render Interactive Itinerary, Map Markers & Transit Cards
```

### Authentication & RBAC Security Model

```mermaid
graph LR
    subgraph AuthMethods ["Authentication Methods"]
        G[Google SSO via Firebase]
        L[Local Email / Password via bcrypt]
        D[Demo Quick Login: User / Admin]
    end

    subgraph Verification ["Auth Verification"]
        Token[Bearer JWT or Firebase Token]
        Verify[verifyToken Middleware]
    end

    subgraph Roles ["Role-Based Access Control"]
        R_User[Role: User<br>Browse, Plan, Save Itineraries, SOS]
        R_Admin[Role: Admin<br>Manage Settings, Flags, Banners]
        R_Super[Role: SuperAdmin<br>Full Control, Promote/Demote, Audit Logs]
    end

    G --> Token
    L --> Token
    D --> Token
    Token --> Verify
    Verify -->|Role: user| R_User
    Verify -->|Role: admin| R_Admin
    Verify -->|Role: superadmin| R_Super
```

---

## 💻 Technology Stack Matrix

| Layer | Technology | Version | Purpose & Key Features |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | React | `^18.3.1` | Declarative component UI library with modern hooks (`useContext`, `useMemo`, `useCallback`) |
| **Frontend Tooling** | Vite | `^5.2.0` | Ultra-fast development server and optimized ESM production bundler |
| **Frontend Routing** | React Router DOM | `^7.18.2` | Client-side routing, protected routes, layout wrappers, and dynamic navigation |
| **Styling & Design** | Vanilla CSS Tokens | Native | Editorial Crimson (`#C0293C`), Deep Saffron (`#E65100`), Ocean Teal (`#004E64`), glassmorphism, responsive CSS grid |
| **Animations** | Framer Motion | `^13.1.0` | Ken Burns slider transitions, smooth route transitions, and responsive modal animations |
| **Iconography** | Lucide React | `^0.378.0` | Clean, accessible vector icons for transit modes, amenities, emergency badges, and UI controls |
| **Typography** | Google Fonts | Web | *Playfair Display* (Editorial headings), *Outfit* & *Plus Jakarta Sans* (Body/UI), *DM Mono* (Data/Badges) |
| **Auth Client** | Firebase SDK | `^12.18.0` | Client-side Google Identity Provider SSO integration |
| **Export & Archives** | JSZip | `^3.10.1` | Client-side zip bundling and offline HTML/PDF itinerary export package creation |
| **Backend Runtime** | Node.js | `>=18.x` | High-performance asynchronous JavaScript server runtime |
| **Web Framework** | Express.js | `^4.19.2` | RESTful routing, custom middleware pipeline, and JSON payload handling |
| **Database Driver** | `pg` (node-postgres) | `^8.11.5` | Connection pooling and query interface for PostgreSQL 12+ |
| **AI Inference** | Groq Cloud AI | Cloud API | LLaMA 3.3 70B Versatile / Qwen 2.5 models for intelligent itinerary orchestration |
| **Geospatial & Places** | Geoapify API | Cloud API | Places search, categories, coordinate lookup, and address geocoding |
| **Security & Auth** | `jsonwebtoken` & `bcryptjs` | `^9.0.3` / `^3.0.3` | JWT issuance/verification and secure salted password hashing |
| **Session & Cookies** | `cookie-parser` | `^1.4.7` | Secure HTTP-only cookie management for authentication tokens |
| **Cross-Origin** | `cors` | `^2.8.5` | Configured CORS origin handling supporting localx and staging environments |
| **Dev Daemon** | `nodemon` | `^3.1.0` | Hot-reloading development server watcher for backend code changes |

---

## ⚡ Core Features & User Workflows

### 1. Intelligent Itinerary Generator
- **11 Seeded Major Cities**: Bangalore, Goa, Chennai, Jaipur, Agra, Kochi, Pondicherry, Yercaud, Delhi, Munnar, and Varanasi.
- **Duration Flexibility**: Custom trips from **1 to 10 days**.
- **Haversine Distance Clustering**: Algorithmic grouping prevents cross-town travel during peak traffic.
- **Circadian Time Sequencing**:
  - `Morning (08:00 - 11:30)`: Open-air palaces, botanical gardens, and sunrise temples.
  - `Midday (12:00 - 15:00)`: Air-conditioned indoor museums, galleries, and shaded heritage monuments.
  - `Late Afternoon (15:30 - 17:30)`: Artisanal handicraft centres, cultural workshops, and local bazaars.
  - `Sunset (17:30 - 19:30)`: River ghats, cliffside viewpoints, and seaside promenades.
  - `Evening (20:00+)`: Street food trails and authentic regional dining recommendations.

### 2. Multi-Modal Transit Strip Guidance
Between every consecutive itinerary stop, LukAround renders a transit guidance strip providing:
- **Auto Rickshaw (🛺)**: Distance (km), travel duration, and calibrated metered fare in ₹.
- **Cab / Taxi App (🚖)**: Estimated Ola/Uber ride-hailing fares in ₹.
- **Walking (🚶)**: Walking duration for stops within pedestrian distance (< 1.2 km).
- **City Bus / Metro (🚌)**: Economical public transit estimates and nearby line tips.

### 3. Curated Hotel Accommodations
- Search and filter hotels by 3 distinct budget tiers:
  - **Budget** (< ₹2,500/night): Clean, central, traveler-rated backpacker & budget stays.
  - **Mid-Range** (₹2,500 – ₹7,000/night): Boutique hotels with complimentary breakfast and modern amenities.
  - **Luxury** (₹7,000+/night): 5-star heritage palaces and premium beachfront resorts.
- Includes distance from city center, star rating, verified phone contact, and direct booking actions.

### 4. Tourist Safety Hub & Floating Emergency SOS
- **Persistent Emergency Numbers**:
  - 🚨 **National Emergency**: `112`
  - 👩 **Women's Safety Helpline**: `1091`
  - 🧳 **National Tourist Helpline**: `1363` (24/7 Multi-Lingual)
  - 🚑 **Medical Ambulance**: `108`
- **Police Station Precinct Directory**: Lists jurisdiction station names, addresses, direct telephone lines, and community safety ratings for every city.
- **Floating SOS Modal**: A persistent, pulsing emergency button on the bottom right of all screens that opens a one-tap dialing modal with immediate emergency actions.

### 5. Live Trip Budget Calculator
- Computes real-time expenditure for the entire itinerary:
  - Total attraction entry fees (in ₹).
  - Total inter-stop transit costs across all days.
  - Estimated accommodation costs based on duration and selected hotel tier.
  - Granular per-day and per-person cost breakdown.

### 6. Dynamic Hero Slider & Scene Personalization
- **Ken Burns Motion Hero**: Dynamic auto-playing photo slider featuring high-resolution photography of Jaipur, Munnar, Varanasi, and Goa with animated text reveals.
- **8 Dynamic Background Wallpaper Sceneries**: Auto-Sync, Taj Mahal, Amber Fort, Munnar Hills, Varanasi Ghats, Goa Coast, Delhi Heritage, and Bangalore Gardens.
- **7 Curated Color Themes**: Editorial Crimson, Sunset Terracotta, Emerald Oasis, Jaipur Lotus, Maharaja Gold, Himalayan Mystic, and Varanasi Twilight.

### 7. Comprehensive SuperAdmin & Platform Radar
- **Live Platform Radar**: Tracks active visitor sessions, request paths, and API latency.
- **System Broadcast Banner**: Broadcast urgent announcements, weather warnings, or maintenance notices across all connected clients in real time.
- **Feature Flag Matrix**: Toggle `aiItineraryV2`, `userRegistrations`, `instantBooking`, `emergencySosDispatch`, and `maintenanceMode` dynamically without server restarts.
- **User Management**: Promote users to Admin/SuperAdmin, suspend/ban accounts, reset credentials, and view full audit logs.
- **Maintenance Backup**: Export and restore system settings, users, and audit logs as JSON.

### 8. Multi-Lingual & Offline Export Capabilities
- **English 🇬🇧 & Hindi 🇮🇳 Switcher**: Instant translation of navigation, itineraries, transit labels, and advisories.
- **One-Click Offline Export**: Generates printable HTML travel passes and zipped bundles for traveling in areas with limited mobile data connectivity.

---

## 📂 Directory & Codebase Layout

```
LukAround/
├── README.md                                 # Comprehensive project documentation
├── FIGMA_DESIGN_SPEC_AND_API_OVERVIEW.md    # Figma UI handoff & REST contract blueprint
├── .gitignore                                # Git ignore configuration
│
├── backend/                                  # Node.js + Express REST API Backend
│   ├── package.json                          # Backend dependencies and scripts
│   ├── package-lock.json                     # Locked dependency tree
│   ├── .env.example                          # Template environment variables
│   ├── .env                                  # Active environment config (git-ignored)
│   └── src/
│       ├── index.js                          # Express application entry point & middleware
│       ├── config/
│       │   └── db.js                         # PostgreSQL connection pool & health checks
│       ├── data/
│       │   ├── platformSettings.json         # Runtime feature flags, broadcast & audit logs
│       │   └── users.json                    # File-based user store for offline/mock mode
│       ├── db/
│       │   ├── schema.sql                    # PostgreSQL DDL tables definition
│       │   └── seed.sql                      # Seed data for 11 Indian cities & POIs
│       ├── routes/
│       │   ├── admin.js                      # RBAC admin operations, flags & user management
│       │   ├── auth.js                       # JWT register/login & Google SSO verification
│       │   ├── cities.js                     # City catalog and metadata endpoints
│       │   ├── destinations.js               # Enriched destination search & Groq descriptions
│       │   ├── health.js                     # System uptime and database connectivity probe
│       │   ├── hotels.js                     # Hotel catalog with budget tier filters
│       │   ├── itinerary.js                  # Core itinerary generation route
│       │   ├── safety.js                     # Police stations and helpline directory
│       │   ├── translate.js                  # Multi-language translation proxy
│       │   └── transport.js                  # Inter-stop transit cost & duration engine
│       └── services/
│           ├── aiItineraryService.js         # Groq AI & Geoapify integration engine
│           ├── itineraryEngine.js            # Deterministic Haversine clustering engine
│           └── userStore.js                  # In-memory/JSON user and settings manager
│
├── frontend/                                 # React 18 + Vite Frontend Application
│   ├── package.json                          # Frontend dependencies and scripts
│   ├── package-lock.json                     # Locked dependency tree
│   ├── vite.config.js                        # Vite build and dev server configuration
│   ├── index.html                            # HTML5 entry with Google Fonts preconnects
│   ├── .env.example                          # Template frontend environment variables
│   ├── .env                                  # Active frontend environment variables
│   └── src/
│       ├── main.jsx                          # React DOM initialization
│       ├── App.jsx                           # Route definitions & AppProvider wrapper
│       ├── index.css                         # Comprehensive Vanilla CSS Design System
│       ├── api/
│       │   ├── client.js                     # Axios/Fetch API client wrapper
│       │   └── i18n.js                       # English & Hindi translation dictionaries
│       ├── context/
│       │   └── AppContext.jsx                # Global state: Auth, Theme, Scenery, City, Lang
│       ├── firebase/
│       │   └── config.js                     # Firebase SDK initialization & auth helpers
│       ├── components/
│       │   ├── AdminQuickBar.jsx             # Top bar indicator for logged-in admins
│       │   ├── AuthForm.jsx                  # Login & Register modal with demo shortcuts
│       │   ├── AuthLayout.jsx                # Split-screen auth layout with travel showcase
│       │   ├── BackgroundScene.jsx           # Dynamic wallpaper overlay manager
│       │   ├── BroadcastBanner.jsx           # Global emergency/announcement banner
│       │   ├── BudgetSummary.jsx             # Itemized trip budget summary component
│       │   ├── CitySelector.jsx              # City dropdown, duration picker & CTA
│       │   ├── Footer.jsx                    # Editorial footer with links & helplines
│       │   ├── Header.jsx                    # Sticky navigation with theme/wallpaper toggles
│       │   ├── HealthBadge.jsx               # Real-time backend connectivity status badge
│       │   ├── HeroSlider.jsx                # Framer Motion Ken Burns image carousel
│       │   ├── HotelPanel.jsx                # Hotel cards with budget tier filters
│       │   ├── ImageLightbox.jsx             # Fullscreen attraction photo viewer
│       │   ├── ItineraryView.jsx             # Day-by-day timeline with transit cards
│       │   ├── Layout.jsx                    # Main app shell wrapper
│       │   ├── LeafletMap.jsx                # Interactive Leaflet map with custom pins
│       │   ├── LocationMap.jsx               # Interactive visual stop map
│       │   ├── Navbar.jsx                    # Primary navigation bar with user profile
│       │   ├── ProtectedRoute.jsx            # Role-gated route protector
│       │   ├── SafetyPanel.jsx               # Police station directory & helpline cards
│       │   └── SosModal.jsx                  # One-touch emergency SOS dialog
│       └── pages/
│           ├── AdminPanel.jsx                # SuperAdmin management control center
│           ├── Budget.jsx                    # Comprehensive budget analysis page
│           ├── Destinations.jsx              # Searchable destination exploration grid
│           ├── Home.jsx                      # Main landing page
│           ├── HomePage.jsx                  # Compact portal view
│           ├── Hotels.jsx                    # Dedicated hotel explorer
│           ├── Itinerary.jsx                 # Interactive itinerary generation page
│           ├── Login.jsx                     # Authentication page
│           ├── Register.jsx                  # Registration page
│           └── Safety.jsx                    # Dedicated safety & emergency hub page
│
└── components/
    └── HeroSlider.tsx                        # TypeScript standalone slider component
```

---

## 📡 Complete REST API Specification

All backend endpoints are served under `/api`.

| Method | Endpoint | Access | Description | Request Payload / Params |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | System uptime, environment, and PostgreSQL connection status | None |
| `GET` | `/api/public/settings` | Public | Retrieves active broadcast banner and public feature flags | None |
| `GET` | `/api/cities` | Public | Returns catalog of 11 seeded Indian cities with metadata | None |
| `POST` | `/api/itinerary` | Public | Generates customized multi-day itinerary with transit strips | `{ "city": "Jaipur", "days": 3, "pace": "moderate" }` |
| `GET` | `/api/transport` | Public | Calculates multi-modal transit options between two points | `?from=StopA&to=StopB&city=Jaipur` |
| `GET` | `/api/hotels` | Public | Retrieves hotels filtered by city and budget tier | `?city=Jaipur&tier=Mid-range` |
| `GET` | `/api/safety` | Public | Fetches police precincts, helplines, and safety rating | `?city=Jaipur` |
| `GET` | `/api/destinations` | Public | Retrieves curated destination cards with dynamic photos | None |
| `GET` | `/api/destinations/search` | Public | Search destinations by name, region, or attraction | `?q=Palace` |
| `POST` | `/api/translate` | Public | Translates text between English and Hindi | `{ "text": "Welcome", "target": "hi" }` |
| `POST` | `/api/auth/register` | Public | Registers a new local user account | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and issues JWT token | `{ "email": "...", "password": "..." }` |
| `POST` | `/api/auth/google` | Public | Verifies Firebase Google ID token and logs user in | `{ "token": "firebase_id_token", "user": { ... } }` |
| `GET` | `/api/auth/me` | Protected | Returns current authenticated user profile & permissions | Bearer Token |
| `POST` | `/api/auth/logout` | Protected | Clears authentication session / cookie | None |
| `GET` | `/api/admin/users` | Admin | Returns paginated list of registered users and roles | Bearer Token (Admin) |
| `POST` | `/api/admin/users/:id/role`| SuperAdmin | Promotes or demotes user role (`user`, `admin`, `superadmin`)| `{ "role": "admin" }` |
| `DELETE`| `/api/admin/users/:id` | SuperAdmin | Deletes or suspends a user account | Bearer Token (SuperAdmin) |
| `GET` | `/api/admin/settings` | Admin | Retrieves all platform settings and feature flags | Bearer Token (Admin) |
| `PUT` | `/api/admin/settings` | Admin | Updates feature flags, broadcast banner, or settings | `{ "featureFlags": { ... }, "broadcast": { ... } }` |
| `GET` | `/api/admin/audit-logs` | Admin | Retrieves system security and action audit logs | Bearer Token (Admin) |
| `GET` | `/api/admin/traffic` | Admin | Real-time traffic radar and recent visitor analytics | Bearer Token (Admin) |
| `GET` | `/api/locations/search` | Public | Global multi-entity search across states, cities, attractions, hotels | `?q=Meenakshi&type=attraction` |
| `GET` | `/api/states/:stateId/locations` | Public | Complete list of cities, attractions, hotels with coordinates for state | Path: `/api/states/tamil-nadu/locations` |
| `GET` | `/api/cities/:cityId/locations` | Public | All attractions and hotels with verified coordinates for city | Path: `/api/cities/madurai/locations` |
| `GET` | `/api/destinations/:id` | Public | Verified attraction location record, Place ID, coordinates | Path: `/api/destinations/taj-mahal` |
| `GET` | `/api/destinations/:id/hotels`| Public | Verified hotels within radius sorted by Haversine distance | `?radius=30&limit=15` |
| `GET` | `/api/locations/:id/map-link` | Public | Generates verified Google Maps search, directions, and embed links | Path: `/api/locations/golden-temple/map-link` |

---

## 💾 Database Schema & Dual-Mode Fallback Engine

LukAround is designed with a **self-healing dual-mode architecture**:
- **Primary Database Mode**: Connects to a PostgreSQL 12+ instance via connection pooling in `backend/src/config/db.js`.
- **Dual-Mode Fallback**: If PostgreSQL is offline or unconfigured, the application automatically falls back to an in-memory/JSON intelligence store (`backend/src/services/itineraryEngine.js` and `userStore.js`). **Zero features crash—100% of itinerary, transit, hotel, safety, and demo auth capabilities remain fully functional.**

### PostgreSQL DDL Schema (`backend/src/db/schema.sql`)

```sql
-- 1. Cities Table
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    description TEXT,
    image_url TEXT,
    best_time_to_visit VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Attractions Table
CREATE TABLE attractions (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Sightseeing',
    description TEXT,
    entry_fee_inr NUMERIC(10, 2) DEFAULT 0.00,
    opening_hours VARCHAR(100),
    rating NUMERIC(3, 2),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    avg_visit_duration_mins INT DEFAULT 90,
    ideal_time_of_day VARCHAR(20) DEFAULT 'morning',
    crowd_level_by_hour TEXT,
    notes TEXT
);

-- 3. Hotels Table
CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    price_range VARCHAR(50) DEFAULT 'Mid-range',
    avg_nightly_rate_inr NUMERIC(10, 2),
    distance_from_center_km NUMERIC(5, 2) DEFAULT 2.5,
    address TEXT,
    contact_phone VARCHAR(30),
    amenities TEXT[]
);

-- 4. Police Stations Table
CREATE TABLE police_stations (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    station_name VARCHAR(150) NOT NULL,
    zone VARCHAR(100) DEFAULT 'Central Zone',
    address TEXT NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    emergency_helpline VARCHAR(20) DEFAULT '112',
    area_safety_rating NUMERIC(3, 2) DEFAULT 4.7,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7)
);
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js**: `v18.x` or higher installed ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.x` or higher
- *(Optional)* **PostgreSQL**: `v12+` if running with a local PostgreSQL server

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Sant-2428-hosh/LukAround.git
cd LukAround
```

---

### Step 2: Install Dependencies

#### Install Backend Dependencies
```bash
cd backend
npm install
```

#### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

### Step 3: Environment Configuration

#### Backend Configuration (`backend/.env`)
Create or edit `backend/.env` (a pre-configured `.env.example` is provided):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Connection Settings (Optional - fallback engine handles offline mode)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lukaround
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=lukaround
PGPORT=5432

# External AI & Places APIs
GEOAPIFY_API_KEY=your_geoapify_key_here
GROQ_API_KEY=your_groq_api_key_here
GROQ_ITINERARY_API_KEY=your_groq_itinerary_key_here
```

#### Frontend Configuration (`frontend/.env`)
Create or edit `frontend/.env` (a pre-configured `.env.example` is provided):

```env
# API Server Endpoint URL
VITE_API_BASE_URL=http://localhost:5000/api

# Google Maps API (Browser Restricted)
VITE_GOOGLE_MAPS_API_KEY=your_browser_restricted_google_maps_api_key_here

# Firebase Configuration for Google SSO
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=lukaround-d0d47.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lukaround-d0d47
VITE_FIREBASE_STORAGE_BUCKET=lukaround-d0d47.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

### 🗺️ Google Maps Platform Setup & API Configuration

LukAround integrates Google Maps across all 15 states, 212 cities, 198 tourist attractions, and 96 verified hotels.

#### 1. Google Cloud Console Configuration
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one (e.g. `LukAround-Tourism`).
3. Ensure **Billing** is enabled on the project (Google Maps Platform provides a monthly $200 recurring credit).

#### 2. Enable Required Google Cloud APIs
In **APIs & Services > Library**, enable the following four services:
- **Maps JavaScript API**: Powers interactive embedded maps, custom pins, and info windows.
- **Places API (New)**: For live place autocomplete, place details, and nearby property resolution.
- **Geocoding API**: Resolves addresses to coordinates and reverse-geocodes user coordinates.
- **Directions API**: Real-time multi-modal route calculation and turn-by-turn guidance.

#### 3. API Key Restrictions & Security Best Practices
- **Browser-Restricted Client Key (`VITE_GOOGLE_MAPS_API_KEY`)**:
  - In **Credentials**, create an API key for the frontend.
  - Set **Application restrictions** to **Websites (HTTP referrers)**.
  - Add authorized referrers:
    - `http://localhost:5173/*`
    - `http://127.0.0.1:5173/*`
    - `https://yourdomain.com/*`
  - Under **API restrictions**, restrict the key to `Maps JavaScript API` and `Places API`.
- **Server-Restricted Key (`GOOGLE_MAPS_SERVER_API_KEY`)**:
  - Create a separate API key for backend Node.js services.
  - Set **Application restrictions** to **IP addresses** (your production server IP addresses).
  - Restrict the key to `Geocoding API`, `Directions API`, and `Places API`.
  - **Never expose the server-side API key in frontend code or Git repositories.**

#### 4. Dual-Engine Fallback Architecture
LukAround features an automatic **Dual-Engine Map System**:
- **With Valid Google Maps Key**: The embedded maps initialize using `@googlemaps/js-api-loader` with native Google Maps JavaScript vector rendering, styled markers, and info windows.
- **Without Key or Exceeded Quota**: The application seamlessly activates a vector Leaflet/CartoDB fallback map engine with Google-styled markers and custom info bubbles.
- **100% Operational Navigation**: Regardless of embedded map API status, every state, city, attraction, and hotel provides fully operational `https://www.google.com/maps/...` search and directions links with the mandatory `api=1` parameter, multi-origin routing (Current GPS Location, Custom Address, City, Railway Station, Airport, Attraction), and travel modes (`driving`, `walking`, `transit`, `bicycling`).

---

### Step 4: Seed the Database (Optional)

If running with PostgreSQL:
```bash
# Connect to your local PostgreSQL instance
psql -U postgres -d lukaround -f backend/src/db/schema.sql
psql -U postgres -d lukaround -f backend/src/db/seed.sql
```
> *Note: If PostgreSQL is not installed or running, the app automatically switches to the fallback intelligence engine with pre-seeded data for all 11 cities.*

---

### Step 5: Start Development Servers

#### Terminal 1 — Start Backend Server:
```bash
cd backend
npm run dev
```
*Backend API active at:* **`http://localhost:5000`**  
*Health Check probe:* **`http://localhost:5000/api/health`**

#### Terminal 2 — Start Frontend Application:
```bash
cd frontend
npm run dev
```
*Frontend UI active at:* **`http://localhost:5173`**

---

## 🔑 Preconfigured Test & Demo Accounts

The platform includes built-in one-click demo credentials for immediate testing:

| Account Type | Email | Password | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **Demo User** | `demo@lukaround.com` | `password123` | Regular traveler account: create itineraries, view transit, explore hotels, access SOS |
| **Demo Admin** | `admin@lukaround.com` | `password123` | Administrator: full access to Admin Control Center, feature flags, broadcast banner, and radar |
| **First Register**| *Any email* | *Your password* | First registered user is automatically promoted to **Platform Super Administrator** |

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details. Built with ❤️ for smart, safe, and memorable journeys across India.
