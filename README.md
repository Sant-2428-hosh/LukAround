# 🗺️ Bharat Yatri (भारत यात्री) — Smart Tourist Itinerary Generator for Indian Cities

> **Luk Around** is a full-stack, AI-powered smart tourist itinerary generator engineered specifically for Indian cities. It crafts day-by-day travel plans, sequences attractions based on geographic proximity & time of day, provides inter-stop multi-modal transit options (Auto, Cab, Walking, Bus), lists hotel accommodations filterable by budget tier, displays persistent safety & police station helpline resources, calculates total trip budget in ₹, and exports itineraries for offline travel.

---

## 🌟 Key Features

1. **City Selection & Duration Control**:
   - 11 Seeded Indian Cities: **Bangalore, Goa, Chennai, Jaipur, Agra, Kochin, Pondicherry, Yercaud, Delhi, Munnar, Varanasi**.
   - Flexible trip duration from 1 to 10 days.

2. **Geographic Proximity & Time-of-Day Clustering Engine**:
   - **Haversine Distance Clustering**: Group sights geographically to prevent zigzagging across congested city traffic.
   - **Smart Sequencing**: Places outdoor & sunrise spots in the morning, indoor museums during midday heat, and scenic viewpoints/beaches at sunset.
   - **Advisory Travel Tips**: Notes on entry fees, opening hours, crowd patterns, and dress codes.

3. **Inter-Stop Transit Guidance**:
   - Multi-modal transport strips rendered between consecutive stops (🛺 Auto Rickshaw, 🚖 Cab / Taxi App, 🚶 Walking, 🚌 City Bus / Metro).
   - Distance in km, estimated travel time in minutes, and fare in ₹.

4. **Trip Budget Calculator**:
   - Live expenditure breakdown summing attraction entry fees, inter-stop transit fares, and estimated hotel stay for the entire trip duration.

5. **Hotel Accommodations Module**:
   - Curated hotels filterable by budget tier (**Budget**, **Mid-Range**, **Luxury**).
   - Distance from city center, star ratings, nightly rates in ₹, phone contacts, and amenity tags.

6. **Persistent Tourist Safety & Police Panel**:
   - Dedicated 24/7 emergency quick-dial helplines:
     - 🚨 **National Emergency**: `112`
     - 👩 **Women's Safety**: `1091`
     - 🧳 **National Tourist Helpline**: `1363` (24/7 Multi-Lingual)
     - 🚑 **Medical Ambulance**: `108`
   - Local police precinct cards with addresses, phone numbers, and area safety ratings.

7. **Floating Emergency SOS Modal**:
   - Fixed bottom-right 🚨 **EMERGENCY SOS** button opening a one-tap emergency call modal across all screens.

8. **Multi-Language UI Support**:
   - Seamless language toggle between **English 🇬🇧** and **Hindi 🇮🇳**.

9. **Offline PDF Export / Print Mode**:
   - One-click print/PDF generator for saving itineraries offline.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS (Deep Saffron `#E65100`, Ocean Teal `#004E64`, Glassmorphism design system).
- **Backend**: Node.js, Express.js, CORS, dotenv, Haversine Distance Engine.
- **Database**: PostgreSQL 12+ (with dual-mode fallback: seamless local intelligence engine when DB is offline).

---

## 🚀 Quick Start — Local Setup Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- *(Optional)* **PostgreSQL**: v12+ if running with local database

---

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/bharat-yatri.git
cd "New folder (2)"

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

---

### Step 2: Environment Configuration

Backend configuration file (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bharatyatri
DB_USER=postgres
DB_PASSWORD=postgres
```

Frontend configuration file (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### Step 3: Run Application

#### Start Backend API (Port 5000):
```bash
cd backend
npm start
```
*Backend URL: http://localhost:5000*

#### Start Frontend Dev Server (Port 5173):
```bash
cd frontend
npm run dev
```
*Frontend URL: http://localhost:5173*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health check & DB connectivity status |
| `GET` | `/api/cities` | Fetch catalog of 11 Indian cities |
| `POST` | `/api/itinerary` | Generate day-wise itinerary for `{ city, days }` |
| `GET` | `/api/transport?from=X&to=Y` | Fetch inter-stop multi-modal transit options |
| `GET` | `/api/hotels?city=X&tier=Y` | Fetch hotel listings by city & budget tier |
| `GET` | `/api/safety?city=X` | Fetch police precincts, safety index & emergency helplines |

---

## 💾 Database Schema (PostgreSQL DDL)

```sql
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'India',
    description TEXT,
    image_url TEXT,
    best_time_to_visit VARCHAR(100)
);

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

## 🏆 Hackathon Demo Walkthrough Checklist

- [x] **Phase 0 — Project Scaffolding**: Node/Express REST API + React Vite frontend + Postgres DDL schema.
- [x] **Phase 1 — City Selector**: Searchable city dropdown + 1-10 days counter.
- [x] **Phase 2 — Itinerary Generation Engine**: Haversine distance clustering & daily time budget limits.
- [x] **Phase 3 — Best Time to Visit**: Ideal time sequencing (sunrise outdoor spots, midday indoor museums, sunset viewpoints).
- [x] **Phase 4 — Transport Info**: Inter-stop transit strips (Auto, Cab, Bus, Walk) with distance, time & fare in ₹.
- [x] **Phase 5 — Hotel Listings**: Accommodation recommendations filterable by Budget, Mid-range, and Luxury tiers.
- [x] **Phase 6 — Police Station & Safety Panel**: Persistent safety panel with emergency numbers (112, 1091, 1363) & police precincts.
- [x] **Phase 7 — Stretch Features**: Trip budget calculator, PDF download export, floating Emergency SOS button & English/Hindi multi-language switcher.
- [x] **Phase 8 — Polish & Demo Readiness**: Expanded dataset to 11 Indian cities, loading state polish & full README documentation.

---

## 📜 License
MIT License. Built for hackathon demonstration.
