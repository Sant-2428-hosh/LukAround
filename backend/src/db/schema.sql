-- Luk Around - Database Schema Definition
-- Target Engine: PostgreSQL 12+

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

-- 5. POLICE STATIONS TABLE (Safety & Emergency Resources)
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

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_attractions_city_id ON attractions(city_id);
CREATE INDEX IF NOT EXISTS idx_transport_city_id ON transport_options(city_id);
CREATE INDEX IF NOT EXISTS idx_hotels_city_id ON hotels(city_id);
CREATE INDEX IF NOT EXISTS idx_hotels_price_range ON hotels(price_range);
CREATE INDEX IF NOT EXISTS idx_police_city_id ON police_stations(city_id);
