# 🗺️ Bharat Yatri (भारत यात्री) — Comprehensive System Blueprint & Figma Design Handoff Spec

> **Purpose**: This document provides an exhaustive, field-by-field UI/UX component specification, complete REST API contracts, JSON data schemas, environment configurations, and design system tokens. It is structured specifically for creating wireframes/mockups in **Figma** and seamlessly linking them to the Node.js/Express backend.

---

## 📑 Table of Contents
1. [Project Overview & Core Value Proposition](#1-project-overview)
2. [Figma Design System Tokens (UI Kit)](#2-figma-design-system-tokens)
3. [Screen & Modal Architecture (What to build in Figma)](#3-screen--modal-architecture)
4. [Component-by-Component Data Contracts & Figma Specs](#4-component-data-contracts--figma-specs)
5. [Complete REST API Specification & JSON Payloads](#5-complete-rest-api-specification)
6. [Backend Environment Variables & API Keys Reference](#6-backend-environment-variables--api-keys)
7. [Database DDL Schema (PostgreSQL 12+)](#7-database-ddl-schema)
8. [Developer Handoff Checklist](#8-developer-handoff-checklist)

---

## 1. Project Overview

**Bharat Yatri** is an intelligent tourist itinerary generator engineered for Indian cities. It solves the chaotic nature of urban travel in India by clustering attractions geographically using **Haversine Distance** (preventing zig-zag transit), sequencing sights according to **time-of-day suitability** (morning sunrise spots, indoor midday museums, sunset viewpoints), calculating multi-modal inter-stop transit costs (Auto, Cab, Bus, Walking), curating tier-based hotel stays with direct booking links, and providing persistent 24/7 tourist safety/police emergency tools.

- **Frontend Tech Stack**: React 18, Vite, Framer Motion, Lucide Icons, Vanilla CSS Design System.
- **Backend Tech Stack**: Node.js, Express.js, PostgreSQL (with local intelligence fallback engine).
- **Backend Local Host**: `http://localhost:5000` (API Base: `http://localhost:5000/api`)
- **Frontend Local Host**: `http://localhost:5173`

---

## 2. Figma Design System Tokens (UI Kit)

Use these exact HEX codes, font families, and radius tokens when setting up your Figma Local Styles / Variables:

### 🎨 Color Styles (Palette)
```yaml
# Primary Accent (Sunburst Saffron / Terracotta)
Primary-Default: "#FF5722"
Primary-Light:   "#FF8A65"
Primary-Dark:    "#D84315"
Primary-Glow:    "rgba(255, 87, 34, 0.35)"

# Secondary & Ocean Cyan
Secondary-Dark:  "#060914" (Cosmic Midnight / Background)
Secondary-Card:  "#0C1224" (Glass Surface Fill, 78% opacity)
Secondary-Teal:  "#00E5FF" (Electric Peacock Cyan)
Secondary-Light: "#18FFFF" (Glowing Turquoise)

# Semantic & Accents
Gold-Accent:     "#FFD54F" (Rajput 24K Royal Gold)
Gold-Marigold:   "#FFB300"
Emerald-Success: "#10B981" (Kashmir Valley Green)
Emerald-Light:   "#34D399"
Rose-Danger:     "#F43F5E" (Lotus Crimson / SOS Alert)
Rose-Light:      "#FDA4AF"

# Text Colors
Text-Main:       "#F8FAFC" (Primary White 100%)
Text-Muted:      "#94A3B8" (Secondary Gray 60%)
Text-Dark:       "#060914" (Inverse)

# Glass Borders
Border-Subtle:   "rgba(255, 255, 255, 0.12)"
Border-Glow:     "rgba(255, 87, 34, 0.45)"
Border-Cyan:     "rgba(0, 229, 255, 0.40)"
```

### 🔤 Typography Styles
- **Display / Headings (`H1`, `H2`, `H3`)**: `Playfair Display` (Serif, Bold 800 / SemiBold 700)
  - `H1 (Hero Title)`: 48px / Line Height: 1.15 / Letter Spacing: -0.5px
  - `H2 (Section Header)`: 32px / Line Height: 1.25 / Letter Spacing: -0.5px
  - `H3 (Card Title)`: 22px / Line Height: 1.3
- **Sub-Headings & Badges (`H4`, `H5`, `Badges`)**: `Outfit` (Sans-Serif, SemiBold 600 / Bold 700)
  - `H4 (Card Subheading)`: 18px
  - `Badge / Tag`: 12px / Uppercase / Letter Spacing: +0.5px
- **Body & Metrics**: `Plus Jakarta Sans` (Sans-Serif, Regular 400 / Medium 500 / SemiBold 600)
  - `Body Regular`: 14px / Line Height: 1.6
  - `Body Small / Caption`: 12px / Line Height: 1.4
  - `Price / Stat Metric`: 24px–32px / Bold 900

### 📐 Corner Radius & Effects
- **Small (`Radius-SM`)**: `10px` (Buttons, Input fields, Badges)
- **Medium (`Radius-MD`)**: `18px` (Cards, Panels, Dropdown Overlays)
- **Large (`Radius-LG`)**: `26px` (Hero Cards, Full Modals)
- **Full (`Radius-Full`)**: `9999px` (Pills, Avatar circles)
- **Backdrop Blur (`Glassmorphism`)**: `18px – 24px blur` with `rgba(10, 16, 32, 0.68)` fill.

---

## 3. Screen & Modal Architecture

Design the following screens and overlays in Figma:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. STICKY NAVBAR                                                       │
│    [Logo + Title]                 [11 Cities] [Scenery] [Palette] [EN] │
├────────────────────────────────────────────────────────────────────────┤
│ 2. HERO SECTION                                                        │
│    [Sparkle Badge]                                                     │
│    [H1: Smart City Tourist Itinerary Generator for Indian Cities]      │
│    [Hero Subtitle description]                                         │
├────────────────────────────────────────────────────────────────────────┤
│ 3. CITY & DURATION SELECTOR CARD (Interactive Inputs)                  │
│    [Dropdown: Select City]           [Counter: 1 - 10 Days (- / +)]    │
│    [CTA Button: Generate Smart Itinerary (with Compass Icon)]          │
├────────────────────────────────────────────────────────────────────────┤
│ 4. GENERATING LOADING OVERLAY                                          │
│    [Rotating Compass Mandala Animation]                                │
│    ["Crafting Personalized Itinerary for {City}..."]                   │
├────────────────────────────────────────────────────────────────────────┤
│ 5. GENERATED ITINERARY VIEW (Main Output Screen)                       │
│    ├── A. Itinerary Header + Duration Badge + [Download / Print PDF]   │
│    ├── B. Trip Budget Calculator Card (Fees + Transit + Hotel = Total) │
│    ├── C. Day Navigation Tabs [Day 1] [Day 2] [Day 3] ...              │
│    ├── D. Day Timeline Schedule:                                       │
│    │    ├── Stop Card #1 (Photo, Time, Name, Tags, Tips, Maps)         │
│    │    ├── Inter-Stop Transit Strip (Auto, Cab, Bus, Walk + Fare/Min) │
│    │    ├── Stop Card #2 ...                                           │
│    │    └── Transit Strip ...                                          │
│    ├── E. "Where to Stay" Hotel Accommodations Panel                   │
│    │    ├── Budget Tier Filter Tabs: [All] [Budget] [Mid-Range] [Luxury│
│    │    └── Hotel Grid (3-4 Cards with Rate, Phone, [Book], [Portals]) │
│    ├── F. Persistent Safety & Police Assistance Panel                  │
│    │    ├── Area Safety Index Badge (e.g. 4.9/5.0)                     │
│    │    ├── 24/7 National Emergency Numbers Grid (112, 1091, 1363, 108)│
│    │    └── Local Police Precinct Cards (Zone, Phone, Address)         │
│    └── G. Local City Transit Guide Summary Table                       │
├────────────────────────────────────────────────────────────────────────┤
│ 6. MODALS & POPUPS (Design as overlays)                                │
│    ├── A. Floating [🚨 EMERGENCY SOS] Fixed FAB (Bottom Right)         │
│    ├── B. Emergency SOS Call Modal (High Contrast 1-Tap Dialing)       │
│    ├── C. Booking Portals Modal (Official Site, MakeMyTrip, Booking)   │
│    ├── D. Fullscreen Image Lightbox Preview                            │
│    └── E. Palette & Scenery Switcher Dropdowns                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Data Contracts & Figma Specs

### Component 1: Sticky Navigation Bar (`Header`)
- **Left**: Compass Logo icon in `38x38px` Gradient box + Brand Title `"Bharat Yatri"` + Tagline `"SMART TOURIST ITINERARY GENERATOR"`.
- **Right Items**:
  - `Badge`: `"11 Seeded Cities"`
  - `Button 1 (Scenery)`: Opens Background wallpaper picker (Auto-Sync, Taj Mahal, Amber Fort, Munnar, Varanasi, Goa, Delhi, Bangalore).
  - `Button 2 (Palette)`: Opens 7 Color Theme picker (Sunset Terracotta, Emerald Oasis, Jaipur Lotus, Maharaja Gold, Himalayan Mystic, Varanasi Twilight, Goa Sunset).
  - `Button 3 (Language)`: Toggles UI between `🇬🇧 English` and `🇮🇳 हिंदी`.

### Component 2: Trip Input Card (`CitySelector`)
- **Inputs**:
  - `City Dropdown`: Supports 11 cities: **Bangalore, Goa, Chennai, Jaipur, Agra, Kochin, Pondicherry, Yercaud, Delhi, Munnar, Varanasi**.
  - `Days Counter`: Number input bounded between `1` and `10` with `-` and `+` buttons.
  - `CTA Button`: `"Generate Smart Itinerary"` (with loading spinner state `"Crafting Personalized Itinerary..."`).

### Component 3: Attraction Stop Card (`StopCard`)
- **Fields displayed**:
  - `Order Badge`: `#1`, `#2`, `#3` (Gradient circle)
  - `Image Thumbnail`: `130x100px` (with zoom preview trigger on click)
  - `Time Window`: e.g. `"9:00 AM - 10:30 AM"`
  - `Ideal Time Badge`: `"Ideal in Morning"`, `"Ideal Midday / Indoor"`, or `"Ideal at Sunset / Evening"`
  - `Category Badge`: `"Heritage"`, `"Nature"`, `"Architecture"`, `"Shopping"`, `"Religious"`
  - `Duration Badge`: e.g. `"90 Mins"`
  - `Name`: Attraction Title (e.g. `"Taj Mahal"`, `"Hawa Mahal"`)
  - `Description`: Brief sight synopsis
  - `Travel Tip Banner`: Advisory banner with amber border (e.g. `"Best for sunrise photography before crowds build up."`)
  - `Meta Row`: Star Rating (e.g. `★ 4.9`), Entry Fee (e.g. `₹50` or `Free Entry`), Hours (`6:00 AM - 6:30 PM`), Crowd pattern (`Low morning, Peak 3-6 PM`), and `"View Map"` link.

### Component 4: Inter-Stop Transit Strip (`TransitStrip`)
- Rendered between consecutive stop cards (`Stop #1` → `Stop #2`).
- **Fields displayed**:
  - `Route Title`: `"HOW TO GET TO NEXT STOP: Amber Fort (~2.5 km)"`
  - `Recommended Mode`: Highlighted badge (e.g. `Auto Rickshaw`, `Cab / Taxi App`, `Walking`, `City Bus / Metro`)
  - `Transit Chips`: Horizontal pill list showing Icon, Mode Name, Fare in `₹`, and Travel Time in minutes `(15m)`.

### Component 5: Budget Calculator (`BudgetSummary`)
- **Fields displayed**:
  - `Total Entry Fees`: Sum of all attraction fees (e.g. `₹750`)
  - `Total Transit Fares`: Sum of all inter-stop transit costs (e.g. `₹480`)
  - `Estimated Hotel Accommodation`: `Requested Days × ₹4,500/night` (e.g. `₹13,500`)
  - `Grand Total Estimated Budget`: Highlighted in bright green text (e.g. `₹14,730`).

### Component 6: Hotel Accommodation Card (`HotelPanel`)
- **Filter Tabs**: `[All Tiers]` `[Budget (₹900 - ₹2.5k)]` `[Mid-Range (₹3.5k - ₹8.9k)]` `[Luxury (₹11.5k+)]`
- **Card Fields**:
  - Hotel Photo (`140px` height) with `"Official Site"` overlay link
  - Budget Tier Badge (`Luxury` / `Mid-range` / `Budget`)
  - Star Rating (`★ ★ ★ ★ ★`)
  - Hotel Name (e.g. `"The Leela Palace"`, `"Zostel"`, `"Taj Fort Aguada"`)
  - Distance from City Center: (e.g. `3.2 km from city center`)
  - Phone Number: (e.g. `+91 80 25211234`)
  - Amenity Tags: `["Swimming Pool", "Spa", "Free WiFi", "Dining"]`
  - Nightly Rate: e.g. `₹18,500` / night
  - **Action Button 1 (`Book Stay`)**: Direct 1-click external link (`target="_blank"`).
  - **Action Button 2 (`Portals`)**: Opens modal showing MakeMyTrip, Booking.com, Google Hotels, and Direct Phone Call options.

### Component 7: Safety & Police Panel (`SafetyPanel`)
- **Fields displayed**:
  - `Area Safety Index`: e.g. `4.9 / 5.0 (Tourist Safe Precinct)`
  - `National Emergency Numbers (4 Grid Cards)`:
    - 🚨 **112**: National Emergency (Police, Fire, Ambulance)
    - 👩 **1091**: Women's Safety Helpline (24/7 Toll-free)
    - 🧳 **1363**: National Tourist Helpline (24/7 Multi-Lingual)
    - 🚑 **108**: Medical Emergency & Ambulance
  - `Local Police Stations`: 2-3 precinct cards per city with zone, precinct name, address, contact phone, and Google Maps pin.

### Component 8: Emergency SOS Floating Action Button (`SosModal`)
- **Floating Button**: Fixed at `Bottom: 24px, Right: 24px`, pulsating red gradient with `ShieldAlert` icon and `"EMERGENCY SOS"` text.
- **Overlay Modal**: High-contrast modal surfacing instant tap-to-call buttons for all national helplines and city police control rooms.

---

## 5. Complete REST API Specification

All endpoints are hosted at base URL: `http://localhost:5000/api`

### 1. Health & DB Status Endpoint
- **URL**: `GET /api/health`
- **Response JSON**:
```json
{
  "status": "online",
  "appName": "Bharat Yatri API",
  "version": "1.0.0",
  "timestamp": "2026-08-20T09:21:16.566Z",
  "uptimeSeconds": 722,
  "environment": "development",
  "database": {
    "connected": false,
    "mode": "Mock Fallback Mode (Database offline)"
  }
}
```

---

### 2. City Catalog Endpoint
- **URL**: `GET /api/cities`
- **Response JSON**:
```json
{
  "success": true,
  "count": 11,
  "data": [
    { "id": 1, "name": "Bangalore", "state": "Karnataka", "country": "India" },
    { "id": 2, "name": "Goa", "state": "Goa", "country": "India" },
    { "id": 3, "name": "Chennai", "state": "Tamil Nadu", "country": "India" },
    { "id": 4, "name": "Jaipur", "state": "Rajasthan", "country": "India" },
    { "id": 5, "name": "Agra", "state": "Uttar Pradesh", "country": "India" },
    { "id": 6, "name": "Kochin", "state": "Kerala", "country": "India" },
    { "id": 7, "name": "Pondicherry", "state": "Puducherry", "country": "India" },
    { "id": 8, "name": "Yercaud", "state": "Tamil Nadu", "country": "India" },
    { "id": 9, "name": "Delhi", "state": "Delhi NCR", "country": "India" },
    { "id": 10, "name": "Munnar", "state": "Kerala", "country": "India" },
    { "id": 11, "name": "Varanasi", "state": "Uttar Pradesh", "country": "India" }
  ]
}
```

---

### 3. Generate Day-Wise Itinerary Endpoint
- **URL**: `POST /api/itinerary`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "city": "Jaipur",
  "days": 2
}
```
- **Response JSON**:
```json
{
  "success": true,
  "city": {
    "name": "Jaipur",
    "state": "Rajasthan",
    "description": "Curated itinerary for Jaipur."
  },
  "requestedDays": 2,
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1: Architecture & Historical Sights",
      "stops": [
        {
          "name": "Hawa Mahal",
          "order": 1,
          "suggestedTime": "9:00 AM - 10:00 AM",
          "durationMins": 60,
          "category": "Architecture",
          "description": "Pink sandstone Palace of Winds with 953 honeycomb windows.",
          "entryFeeInr": 200,
          "rating": 4.6,
          "latitude": 26.9239,
          "longitude": 75.8267,
          "imageUrl": "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
          "openingHours": "9:00 AM - 5:00 PM",
          "idealTimeOfDay": "morning",
          "crowdLevelByHour": "Low 9:00-10:30 AM, High 1:00-4:00 PM",
          "notes": "Morning sunlight glows directly on the pink facade, perfect for photography.",
          "transitToNext": {
            "from": "Hawa Mahal",
            "to": "Nahargarh Fort",
            "distanceKm": 1.9,
            "recommendedMode": "Auto Rickshaw",
            "modes": [
              { "mode": "Auto Rickshaw", "recommended": true, "fareInr": 50, "timeMins": 10, "icon": "auto" },
              { "mode": "Cab / Taxi App", "recommended": false, "fareInr": 95, "timeMins": 8, "icon": "cab" }
            ]
          }
        },
        {
          "name": "Nahargarh Fort",
          "order": 2,
          "suggestedTime": "10:25 AM - 12:25 PM",
          "durationMins": 120,
          "category": "Historical",
          "description": "Fortress on the Aravalli hills offering panoramic views of Jaipur.",
          "entryFeeInr": 200,
          "rating": 4.7,
          "latitude": 26.9378,
          "longitude": 75.8155,
          "imageUrl": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
          "openingHours": "10:00 AM - 10:00 PM",
          "idealTimeOfDay": "evening",
          "crowdLevelByHour": "Moderate midday, Peak 5:00-7:30 PM (Sunset)",
          "notes": "Famous rooftop restaurant offers sunset views over the Pink City skyline.",
          "transitToNext": null
        }
      ]
    }
  ],
  "transportOptions": [
    { "mode": "Auto Rickshaw", "avg_cost_per_km_inr": 15, "tips": "Negotiate or demand meter." },
    { "mode": "Cab / Taxi App", "avg_cost_per_km_inr": 22, "tips": "Uber/Ola available." }
  ],
  "safetyContact": {
    "station_name": "Jaipur Central Tourist Helpline",
    "contact_number": "+91 112",
    "emergency_helpline": "112"
  },
  "meta": {
    "engine": "Geographic Proximity & Time-of-Day Sequencer",
    "generatedAt": "2026-08-20T09:21:28.816Z",
    "datasource": "Local Intelligence Engine"
  }
}
```

---

### 4. Inter-Stop Multi-Modal Transport Endpoint
- **URL**: `GET /api/transport?from=Hawa+Mahal&to=Nahargarh+Fort`
- **Response JSON**:
```json
{
  "from": "Hawa Mahal",
  "to": "Nahargarh Fort",
  "distanceKm": 1.9,
  "recommendedMode": "Auto Rickshaw",
  "modes": [
    {
      "mode": "Walking",
      "recommended": false,
      "fareInr": 0,
      "timeMins": 25,
      "tips": "Steep incline uphill, recommended only for trekkers."
    },
    {
      "mode": "Auto Rickshaw",
      "recommended": true,
      "fareInr": 50,
      "timeMins": 10,
      "tips": "Quick transit up the fort ghat road."
    },
    {
      "mode": "Cab / Taxi App",
      "recommended": false,
      "fareInr": 95,
      "timeMins": 8,
      "tips": "Comfortable AC ride."
    }
  ]
}
```

---

### 5. Hotel Accommodations & Booking Links Endpoint
- **URL**: `GET /api/hotels?city=Bangalore&tier=luxury`
- **Response JSON**:
```json
{
  "source": "mock",
  "city": "bangalore",
  "tier": "luxury",
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "The Leela Palace Bengaluru",
      "star_rating": 5,
      "price_range": "Luxury",
      "avg_nightly_rate_inr": 18500,
      "distance_from_center_km": 3.2,
      "address": "HAL 2nd Stage, Indiranagar, Bengaluru",
      "contact_phone": "+91 80 25211234",
      "website_url": "https://www.theleela.com/the-leela-palace-bengaluru",
      "booking_url": "https://www.booking.com/hotel/in/the-leela-palace-bangalore.html",
      "amenities": ["Swimming Pool", "Luxury Spa", "Fine Dining", "Free High-Speed WiFi"],
      "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "portals": [
        {
          "name": "Official Website",
          "label": "Direct Booking",
          "url": "https://www.theleela.com/the-leela-palace-bengaluru",
          "badge": "Best Rates"
        },
        {
          "name": "MakeMyTrip",
          "label": "MakeMyTrip India",
          "url": "https://www.makemytrip.com/hotels/hotel-listing/?city=bangalore&searchText=The%20Leela%20Palace%20Bengaluru",
          "badge": "Popular"
        },
        {
          "name": "Booking.com",
          "label": "Booking.com",
          "url": "https://www.booking.com/hotel/in/the-leela-palace-bangalore.html",
          "badge": "Instant Confirm"
        },
        {
          "name": "Google Hotels / Agoda",
          "label": "Compare Rates",
          "url": "https://www.google.com/travel/hotels?q=The%20Leela%20Palace%20Bengaluru+bangalore",
          "badge": "Compare Deals"
        }
      ]
    }
  ]
}
```

---

### 6. Tourist Safety & Police Helplines Endpoint
- **URL**: `GET /api/safety?city=Varanasi`
- **Response JSON**:
```json
{
  "city": "Varanasi",
  "overallSafetyRating": 4.8,
  "safetyStatusTag": "Tourist Safe Precinct",
  "nationalHelplines": [
    { "name": "National Emergency Service", "number": "112", "description": "All-in-one Police, Fire, and Ambulance response." },
    { "name": "Women's Safety Helpline", "number": "1091", "description": "24/7 toll-free emergency dispatch." },
    { "name": "National Tourist Helpline", "number": "1363", "description": "Ministry of Tourism multi-lingual tourist assistance." },
    { "name": "Medical Ambulance", "number": "108", "description": "Emergency medical response." }
  ],
  "policeStations": [
    {
      "station_name": "Dashashwamedh Police Station",
      "zone": "Ghats & Temple Zone",
      "address": "Near Dashashwamedh Ghat, Varanasi",
      "contact_number": "+91 542 2451234",
      "area_safety_rating": 4.8,
      "latitude": 25.3076,
      "longitude": 83.0104
    }
  ]
}
```

---

## 6. Backend Environment Variables & API Keys

The backend is pre-configured with the following environment variables in `backend/.env`:

```env
# Server Port Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database Credentials (Optional - Local mock fallback engine operates automatically)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bharatyatri
DB_USER=postgres
DB_PASSWORD=postgres

# Optional External API Keys (Can be configured for production deployment)
# Google Maps Platform API Key (For Geocoding & Real distance calculation)
GOOGLE_MAPS_API_KEY=AIzaSyDemoTouristKey_BharatYatri_Production

# OpenStreetMap / GraphHopper API Key (Alternative routing engine)
GRAPHHOPPER_API_KEY=

# Unsplash API Access Key (For dynamic attraction image fetching)
UNSPLASH_ACCESS_KEY=
```

Frontend Environment Configuration (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 7. Database DDL Schema (PostgreSQL 12+)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CITIES TABLE
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    description TEXT,
    image_url TEXT,
    best_time_to_visit VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ATTRACTIONS TABLE
CREATE TABLE IF NOT EXISTS attractions (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Sightseeing',
    description TEXT,
    entry_fee_inr NUMERIC(10, 2) DEFAULT 0.00,
    opening_hours VARCHAR(100),
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    image_url TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    avg_visit_duration_mins INT DEFAULT 90,
    ideal_time_of_day VARCHAR(20) DEFAULT 'morning',
    crowd_level_by_hour TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TRANSPORT OPTIONS TABLE
CREATE TABLE IF NOT EXISTS transport_options (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    mode VARCHAR(50) NOT NULL,
    description TEXT,
    avg_cost_per_km_inr NUMERIC(8, 2),
    availability VARCHAR(100),
    tips TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. HOTELS TABLE
CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    price_range VARCHAR(50) DEFAULT 'Mid-range',
    avg_nightly_rate_inr NUMERIC(10, 2),
    distance_from_center_km NUMERIC(5, 2) DEFAULT 2.5,
    address TEXT,
    contact_phone VARCHAR(30),
    website_url TEXT,
    booking_url TEXT,
    amenities TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. POLICE STATIONS TABLE
CREATE TABLE IF NOT EXISTS police_stations (
    id SERIAL PRIMARY KEY,
    city_id INT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    station_name VARCHAR(150) NOT NULL,
    zone VARCHAR(100) DEFAULT 'Central Zone',
    address TEXT NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    emergency_helpline VARCHAR(20) DEFAULT '112',
    area_safety_rating NUMERIC(3, 2) DEFAULT 4.7,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 8. Developer Handoff Checklist

When creating your frontend layout from Figma:
1. Connect City Dropdown to `GET /api/cities`.
2. On clicking `"Generate Itinerary"`, dispatch `POST /api/itinerary` with `{ "city": cityName, "days": count }`.
3. Loop over `res.itinerary` array to render **Day Tabs** and **Stop Cards**.
4. Between every Stop Card, render the `stop.transitToNext` strip.
5. In the Stay section, query `GET /api/hotels?city={city}&tier={selectedTier}` and map each hotel with its `website_url` and `portals` array.
6. In the Safety section, query `GET /api/safety?city={city}` and render the `nationalHelplines` grid and `policeStations` list.
7. Fixed bottom-right SOS button opens the Emergency Helplines dial overlay.
