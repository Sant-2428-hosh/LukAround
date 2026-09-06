-- Luk Around - Initial Seed Data for 11 Indian Cities (Phase 8 Expanded Dataset)

-- 1. SEED CITIES (11 CITIES)
INSERT INTO cities (id, name, state, country, description, image_url, best_time_to_visit)
VALUES 
(1, 'Bangalore', 'Karnataka', 'India', 'India''s Silicon Valley, famous for lush botanical gardens, vibrant brewpub culture, historic palaces, and pleasant year-round climate.', 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', 'October to February'),
(2, 'Goa', 'Goa', 'India', 'India''s coastal paradise renowned for sun-kissed golden beaches, Portuguese heritage architecture, vibrant night markets, and spice plantations.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', 'November to February'),
(3, 'Chennai', 'Tamil Nadu', 'India', 'Cultural gateway to South India, celebrated for Marina Beach, ancient Dravidian temples, Carnatic music, and filter coffee.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80', 'November to February'),
(4, 'Jaipur', 'Rajasthan', 'India', 'The Pink City of Rajasthan, famous for royal hilltop forts, opulent palaces, colorful bazaars, and traditional handicraft heritage.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', 'October to March'),
(5, 'Agra', 'Uttar Pradesh', 'India', 'Home to the iconic Taj Mahal, Agra Fort, and rich Mughal history along the banks of the Yamuna River.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', 'October to March'),
(6, 'Kochin', 'Kerala', 'India', 'Vibrant port city of Kerala featuring iconic Chinese fishing nets, historic Fort Kochi, spice markets, and tranquil backwaters.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', 'October to March'),
(7, 'Pondicherry', 'Puducherry', 'India', 'Charming coastal union territory featuring French colonial quarters, yellow mustard villas, quiet beaches, and the spiritual Auroville.', 'https://images.unsplash.com/photo-1589786817006-8b4d8d17208d?auto=format&fit=crop&w=800&q=80', 'October to March'),
(8, 'Yercaud', 'Tamil Nadu', 'India', 'Serene hill station nestled in the Shevaroy Hills of Eastern Ghats, known for Emerald Lake, coffee estates, and spice gardens.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', 'October to June'),
(9, 'Delhi', 'Delhi NCR', 'India', 'India''s historic capital blending ancient Mughal monuments, grand colonial boulevards, vibrant Chandni Chowk bazaars, and modern metro transit.', 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', 'October to March'),
(10, 'Munnar', 'Kerala', 'India', 'Breathtaking hill station in Kerala''s Western Ghats, famous for sprawling tea gardens, misty valleys, exotic flora, and Anamudi Peak.', 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', 'September to May'),
(11, 'Varanasi', 'Uttar Pradesh', 'India', 'One of the world''s oldest living cities, spiritual capital of India famed for sacred Ganga Ghats, evening Ganga Aarti, and ancient temples.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80', 'October to March')
ON CONFLICT (name) DO UPDATE SET 
  state = EXCLUDED.state,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  best_time_to_visit = EXCLUDED.best_time_to_visit;

SELECT setval('cities_id_seq', (SELECT MAX(id) FROM cities));

-- 2. SEED ATTRACTIONS FOR NEW CITIES (DELHI, MUNNAR, VARANASI)
INSERT INTO attractions (city_id, name, category, description, entry_fee_inr, opening_hours, rating, latitude, longitude, avg_visit_duration_mins, ideal_time_of_day, crowd_level_by_hour, notes)
VALUES
-- DELHI (City ID 9)
(9, 'Red Fort (Lal Qila)', 'Historical', 'Iconic 17th-century red sandstone Mughal fortress complex.', 50.00, '9:30 AM - 4:30 PM (Closed Mondays)', 4.5, 28.6562, 77.2410, 120, 'morning', 'High 11:00 AM-2:00 PM', 'Wear comfortable walking shoes. Sound & Light show available in evening.'),
(9, 'Qutub Minar', 'Historical', 'UNESCO World Heritage 73-meter brick minaret with intricate carvings.', 40.00, '7:00 AM - 5:00 PM', 4.6, 28.5244, 77.1855, 90, 'morning', 'Low 8:00-9:30 AM', 'Beautiful lush gardens surrounding monument. Great for photography.'),
(9, 'Humayun''s Tomb', 'Historical', 'Stunning garden tomb precursor to Taj Mahal built in 1570.', 50.00, '6:00 AM - 6:00 PM', 4.7, 28.5933, 77.2507, 100, 'afternoon', 'Moderate 2:00-4:00 PM', 'Shaded charbagh gardens offer cool walk even during afternoon hours.'),
(9, 'India Gate & Kartavya Path', 'Monuments', 'Grand 42m war memorial arch flanked by ceremonial lawns.', 0.00, 'Open 24 Hours', 4.6, 28.6129, 77.2295, 60, 'evening', 'High 6:00-8:30 PM', 'Spectacular night illumination and street food vendors near lawns.'),

-- MUNNAR (City ID 10)
(10, 'Tata Tea Museum (KDHP)', 'Cultural', 'Interactive tea estate museum showcasing tea processing history.', 125.00, '9:00 AM - 5:00 PM (Closed Mondays)', 4.6, 10.0889, 77.0597, 90, 'morning', 'Moderate 10:00 AM-1:00 PM', 'Includes fresh tea tasting session and factory tour.'),
(10, 'Eravikulam National Park (Rajamalai)', 'Nature', 'Sanctuary home to endangered Nilgiri Tahr and rolling shola grasslands.', 200.00, '7:30 AM - 4:00 PM', 4.7, 10.1500, 77.0667, 180, 'morning', 'High 9:30 AM-12:30 PM', 'Safari buses take visitors up the scenic mist-covered peak.'),
(10, 'Mattupetty Dam & Lake', 'Nature', 'Scenic mountain dam offering speed boating and elephant sightings.', 50.00, '9:30 AM - 5:00 PM', 4.4, 10.1052, 77.1235, 90, 'afternoon', 'Moderate 1:00-3:30 PM', 'Speedboat rides on calm mountain waters surrounded by pine forests.'),

-- VARANASI (City ID 11)
(11, 'Dashashwamedh Ghat & Ganga Aarti', 'Spiritual', 'Sacred main ghat famous for grand evening Ganga Aarti ceremony.', 0.00, 'Open 24 Hours (Aarti @ 6:30 PM)', 4.9, 25.3076, 83.0104, 120, 'evening', 'High 5:30-8:00 PM', 'Arrive by 5:30 PM or hire a rowboat for best Aarti ceremony views.'),
(11, 'Kashi Vishwanath Temple', 'Spiritual', 'One of the 12 sacred Jyotirlingas, features golden temple spire.', 0.00, '3:00 AM - 11:00 PM', 4.8, 25.3109, 83.0107, 90, 'morning', 'High 6:00-9:00 AM', 'Mobile phones and electronics must be deposited in secure locker counters.'),
(11, 'Sarnath Buddhist Complex', 'Historical', 'Sacred deer park site where Lord Buddha delivered his first sermon.', 25.00, '8:00 AM - 6:00 PM', 4.7, 25.3762, 83.0227, 120, 'afternoon', 'Low 1:00-3:00 PM', 'Peaceful monastery grounds with Ashoka Pillar and archaeological museum.');

-- 3. SEED HOTELS FOR NEW CITIES
INSERT INTO hotels (city_id, name, star_rating, price_range, avg_nightly_rate_inr, distance_from_center_km, address, contact_phone, amenities, image_url)
VALUES
(9, 'The Imperial New Delhi', 5, 'Luxury', 22000.00, 1.0, 'Janpath, Connaught Place, New Delhi', '+91 11 23341234', ARRAY['Heritage Luxury', 'Outdoor Pool', 'Spa', 'Fine Dining'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),
(9, 'Bloomrooms @ Janpath', 3, 'Mid-range', 4200.00, 0.8, 'Janpath Road, Connaught Place, New Delhi', '+91 11 46665000', ARRAY['Free WiFi', 'Complimentary Breakfast', 'Cafe', 'AC'], 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'),
(9, 'Zostel Delhi', 2, 'Budget', 1100.00, 2.0, 'Pahar Ganj, Near New Delhi Railway Station', '+91 11 40012222', ARRAY['Free WiFi', 'Rooftop Cafe', 'Common Room', '24h Desk'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'),

(10, 'Windermere Estate Munnar', 5, 'Luxury', 16500.00, 4.0, 'Pothamedu, Munnar, Kerala', '+91 4865 230512', ARRAY['Tea Estate View', 'Boutique Resort', 'Organic Dining', 'Plantation Walk'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),
(10, 'Tea County Munnar', 4, 'Mid-range', 5800.00, 1.2, 'Tea County Road, Munnar', '+91 4865 230460', ARRAY['Valley View', 'Ayurvedic Center', 'Restaurant', 'Free WiFi'], 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'),

(11, 'BrijRama Palace Varanasi', 5, 'Luxury', 28000.00, 0.2, 'Darbhanga Ghat, Dashashwamedh, Varanasi', '+91 542 2455555', ARRAY['Ganga River View', 'Heritage Elevator', 'Classical Music', 'Vegetarian Dining'], 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'),
(11, 'Zostel Varanasi', 2, 'Budget', 1050.00, 0.6, 'Luxa Road, Near Dashashwamedh Ghat, Varanasi', '+91 542 4001111', ARRAY['Rooftop Ganga View', 'Free WiFi', 'AC Rooms', 'Library'], 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80');

-- 4. SEED POLICE STATIONS FOR NEW CITIES
INSERT INTO police_stations (city_id, station_name, zone, address, contact_number, emergency_helpline, area_safety_rating, latitude, longitude)
VALUES
(9, 'Connaught Place Tourist Police Cell', 'Central Capital Zone', 'Outer Circle, Connaught Place, New Delhi', '+91 11 23412222', '112', 4.8, 28.6315, 77.2167),
(9, 'Kotwali Police Station Chandni Chowk', 'Old Delhi Heritage Zone', 'Chandni Chowk Main Road, Delhi', '+91 11 23863333', '112', 4.6, 28.6560, 77.2300),

(10, 'Munnar Tourist Police Station', 'Western Ghats Hill Station Zone', 'Main Town Road, Near Bus Stand, Munnar', '+91 4865 230321', '112', 4.9, 10.0880, 77.0600),

(11, 'Dashashwamedh Ghat Police Station', 'Ganga Ghat Sacred Precinct', 'Godowlia Chowk, Varanasi', '+91 542 2451000', '112', 4.8, 25.3080, 83.0100);
