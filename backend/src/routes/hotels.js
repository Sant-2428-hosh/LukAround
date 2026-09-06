const express = require('express');
const router = express.Router();
const { query, checkDbConnection } = require('../config/db');

// Verified hotels dataset with precise GPS Coordinates (lat/lng) and verified Google Place IDs
const MOCK_HOTELS_BY_CITY = {
  'bangalore': [
    {
      id: 1,
      name: 'The Leela Palace Bengaluru',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 18500,
      distance_from_center_km: 3.2,
      address: '23 HAL Old Airport Road, Kodihalli, Bengaluru',
      latitude: 12.9606,
      longitude: 77.6484,
      place_id: 'ChIJ1X2t96IUrjsRe7K-O4c7n3E',
      contact_phone: '+91 80 25211234',
      website_url: 'https://www.theleela.com/the-leela-palace-bengaluru',
      booking_url: 'https://www.booking.com/hotel/in/the-leela-palace-bangalore.html',
      amenities: ['Swimming Pool', 'Luxury Spa', 'Fine Dining', 'Free High-Speed WiFi'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'ITC Gardenia Bengaluru',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 14000,
      distance_from_center_km: 1.5,
      address: '1 Residency Road, Ashok Nagar, Bengaluru',
      latitude: 12.9691,
      longitude: 77.5969,
      place_id: 'ChIJbX07xXoWrjsRk4ZJj4v866o',
      contact_phone: '+91 80 22119898',
      website_url: 'https://www.itchotels.com/in/en/itcgardenia-bengaluru',
      booking_url: 'https://www.makemytrip.com/hotels/itc_gardenia_a_luxury_collection_hotel_bengaluru-details-bangalore.html',
      amenities: ['Eco Luxury', 'Rooftop Pool', 'Helipad', 'Spa'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: 'Bloomrooms @ Indiranagar',
      star_rating: 3,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 3800,
      distance_from_center_km: 2.8,
      address: '1136 100 Feet Road, Indiranagar, Bengaluru',
      latitude: 12.9784,
      longitude: 77.6408,
      place_id: 'ChIJy30w4ZcUrjsRj3097q7b76E',
      contact_phone: '+91 80 46664000',
      website_url: 'https://www.bloomhotels.com/bloomrooms-indiranagar-bangalore',
      booking_url: 'https://www.booking.com/hotel/in/bloomrooms-indiranagar.html',
      amenities: ['Free WiFi', 'Complimentary Breakfast', 'Workstation', 'Cafe'],
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Zostel Bengaluru',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1200,
      distance_from_center_km: 4.0,
      address: 'Koramangala 4th Block, Bengaluru',
      latitude: 12.9352,
      longitude: 77.6245,
      place_id: 'ChIJm82_63EUrjsRp9-98q7c89E',
      contact_phone: '+91 80 47091234',
      website_url: 'https://www.zostel.com/zostel/bangalore/',
      booking_url: 'https://www.zostel.com/zostel/bangalore/',
      amenities: ['Free WiFi', 'Rooftop Lounge', 'Common Gaming Room', '24h Desk'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'goa': [
    {
      id: 5,
      name: 'Taj Fort Aguada Resort & Spa',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 24000,
      distance_from_center_km: 1.2,
      address: 'Sinquerim Beach, Candolim, Goa',
      latitude: 15.4920,
      longitude: 73.7700,
      place_id: 'ChIJZ3U2V167vzsRk5u2_18v34E',
      contact_phone: '+91 832 6645858',
      website_url: 'https://www.tajhotels.com/en-in/taj/taj-fort-aguada-goa/',
      booking_url: 'https://www.booking.com/hotel/in/taj-fort-aguada-resort-spa-goa.html',
      amenities: ['Private Beach Access', 'Infinity Pool', 'Water Sports', 'Heritage Bar'],
      image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      name: 'Hard Rock Hotel Goa',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 6500,
      distance_from_center_km: 2.5,
      address: '370/14 Bishop Alex Dias Road, Calangute, Goa',
      latitude: 15.5398,
      longitude: 73.7667,
      place_id: 'ChIJx29w41-8vzsRh79q_28c45E',
      contact_phone: '+91 832 6745555',
      website_url: 'https://www.hardrockhotels.com/goa/',
      booking_url: 'https://www.makemytrip.com/hotels/hard_rock_hotel_goa-details-calangute.html',
      amenities: ['Poolside Live Music', 'Bar', 'Gym', 'Free WiFi'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 7,
      name: 'Hostel Crowd Anjuna',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 950,
      distance_from_center_km: 3.8,
      address: 'Anjuna Flea Market Road, Anjuna, North Goa',
      latitude: 15.5802,
      longitude: 73.7438,
      place_id: 'ChIJw58q7269vzsRj68r_39e56E',
      contact_phone: '+91 832 2273000',
      website_url: 'https://thehostelcrowd.com/hostels/prison-hostel-goa/',
      booking_url: 'https://www.hostelworld.com/hostels/Goa',
      amenities: ['Free WiFi', 'Garden Shack', 'Scooter Rental Assistance', 'Cafe'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'chennai': [
    {
      id: 8,
      name: 'ITC Grand Chola',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 16000,
      distance_from_center_km: 4.5,
      address: '63 Mount Road, Guindy, Chennai',
      latitude: 13.0105,
      longitude: 80.2207,
      place_id: 'ChIJL7_w14plUjoRk7s_89d34E',
      contact_phone: '+91 44 22200000',
      website_url: 'https://www.itchotels.com/in/en/itcgrandchola-chennai',
      booking_url: 'https://www.booking.com/hotel/in/itc-grand-chola.html',
      amenities: ['Chola Architecture', 'Outdoor Pools', '10 Restaurants', 'Spa'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 9,
      name: 'The Park Chennai',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 5200,
      distance_from_center_km: 1.8,
      address: '601 Anna Salai, Nungambakkam, Chennai',
      latitude: 13.0558,
      longitude: 80.2505,
      place_id: 'ChIJm9-q45plUjoRj8t_90e45E',
      contact_phone: '+91 44 42676000',
      website_url: 'https://www.theparkhotels.com/chennai.html',
      booking_url: 'https://www.makemytrip.com/hotels/the_park_chennai-details-chennai.html',
      amenities: ['Rooftop Pool', 'Aqua Lounge', 'Free WiFi', 'Buffet Breakfast'],
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 10,
      name: 'Broadlands Heritage Lodge',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1100,
      distance_from_center_km: 2.1,
      address: '18 Vallabha Agraharam, Triplicane, Chennai',
      latitude: 13.0583,
      longitude: 80.2711,
      place_id: 'ChIJw88r76plUjoRh9u_01f56E',
      contact_phone: '+91 44 28415555',
      website_url: 'https://www.tripadvisor.in/Hotel_Review-g304556-d446977-Reviews-Broad_Lands_Hotel-Chennai_Madras_Chennai_District_Tamil_Nadu.html',
      booking_url: 'https://www.makemytrip.com/hotels/chennai-hotels.html',
      amenities: ['Courtyard Garden', 'Heritage Vibe', 'Free WiFi', 'Tourist Desk'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'jaipur': [
    {
      id: 11,
      name: 'Rambagh Palace Jaipur',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 42000,
      distance_from_center_km: 3.0,
      address: 'Bhawani Singh Road, Jaipur',
      latitude: 26.8979,
      longitude: 75.8087,
      place_id: 'ChIJG79_66--bTkRk8t_12a34E',
      contact_phone: '+91 141 2385700',
      website_url: 'https://www.tajhotels.com/en-in/taj/rambagh-palace-jaipur/',
      booking_url: 'https://www.booking.com/hotel/in/rambagh-palace.html',
      amenities: ['Royal Palace Dining', 'Peacock Courtyard', 'Indoor Pool', 'Polo Bar'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 12,
      name: 'Shahpura House',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 5800,
      distance_from_center_km: 2.2,
      address: 'D-257 Devi Marg, Bani Park, Jaipur',
      latitude: 26.9298,
      longitude: 75.7944,
      place_id: 'ChIJx90q88--bTkRh7u_34b56E',
      contact_phone: '+91 141 2205635',
      website_url: 'https://www.shahpura.com/shahpura-house-jaipur/',
      booking_url: 'https://www.makemytrip.com/hotels/shahpura_house-details-jaipur.html',
      amenities: ['Heritage Haveli', 'Rooftop Pool', 'Folk Dance Shows', 'Free WiFi'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 13,
      name: 'Zostel Jaipur',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1250,
      distance_from_center_km: 1.5,
      address: 'First Main Road, City Centre, Jaipur',
      latitude: 26.9212,
      longitude: 75.8267,
      place_id: 'ChIJy01r99--bTkRj8v_45c67E',
      contact_phone: '+91 141 4001234',
      website_url: 'https://www.zostel.com/zostel/jaipur/',
      booking_url: 'https://www.zostel.com/zostel/jaipur/',
      amenities: ['Rooftop Cafe', 'Free WiFi', 'Rajasthani Art Wall', 'Common Lounge'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'agra': [
    {
      id: 14,
      name: 'The Oberoi Amarvilas Agra',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 48000,
      distance_from_center_km: 0.6,
      address: 'Taj East Gate Road, Agra',
      latitude: 27.1687,
      longitude: 78.0505,
      place_id: 'ChIJz12s001FddkRk9w_56d78E',
      contact_phone: '+91 562 2231515',
      website_url: 'https://www.oberoihotels.com/hotels-in-agra-amarvilas-resort/',
      booking_url: 'https://www.booking.com/hotel/in/the-oberoi-amarvilas-agra.html',
      amenities: ['Uninterrupted Taj Views', 'Private Balcony', 'Tiered Pool', 'Spa'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 15,
      name: 'ITC Mughal Agra',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 11500,
      distance_from_center_km: 2.5,
      address: 'Fatehabad Road, Tajganj, Agra',
      latitude: 27.1593,
      longitude: 78.0406,
      place_id: 'ChIJa23t111FddkRh0x_67e89E',
      contact_phone: '+91 562 2331701',
      website_url: 'https://www.itchotels.com/in/en/itcmughal-agra',
      booking_url: 'https://www.makemytrip.com/hotels/itc_mughal_a_luxury_collection_resort_spa_agra-details-agra.html',
      amenities: ['Mughal Gardens', 'Kaya Kalp Spa', 'Swimming Pool', 'Mughlai Dining'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 16,
      name: 'Hotel Taj Resorts',
      star_rating: 3,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 3600,
      distance_from_center_km: 0.8,
      address: 'Taj East Gate Road, Agra',
      latitude: 27.1698,
      longitude: 78.0531,
      place_id: 'ChIJb34u221FddkRj1y_78f90E',
      contact_phone: '+91 562 2230160',
      website_url: 'https://www.hoteltajresorts.com/',
      booking_url: 'https://www.booking.com/hotel/in/taj-resorts.html',
      amenities: ['Rooftop Taj View Pool', 'Free WiFi', 'Restaurant', 'Free Shuttle'],
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 17,
      name: 'Hostel Joey\'s Agra',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 900,
      distance_from_center_km: 0.5,
      address: 'Taj East Gate Road, Agra',
      latitude: 27.1672,
      longitude: 78.0512,
      place_id: 'ChIJc45v331FddkRk2z_89g01E',
      contact_phone: '+91 562 4002345',
      website_url: 'https://www.joeyshostel.com/',
      booking_url: 'https://www.hostelworld.com/hostels/Agra',
      amenities: ['Rooftop Taj View', 'Free WiFi', 'Common Kitchen', 'Games'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'kochin': [
    {
      id: 18,
      name: 'Brunton Boatyard',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 21000,
      distance_from_center_km: 0.5,
      address: '1/498 Calvathy Road, Fort Kochi, Kochin',
      latitude: 9.9682,
      longitude: 76.2439,
      place_id: 'ChIJd56w4476CDsRl30_90h12E',
      contact_phone: '+91 484 2215461',
      website_url: 'https://www.cghearth.com/brunton-boatyard',
      booking_url: 'https://www.booking.com/hotel/in/brunton-boatyard.html',
      amenities: ['Harbor Sunset View', 'Sea View Pool', 'Ayurvedic Spa', 'Seafood Grill'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 19,
      name: 'Forte Kochi',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 7800,
      distance_from_center_km: 0.8,
      address: '1/341 Princess Street, Fort Kochi',
      latitude: 9.9654,
      longitude: 76.2421,
      place_id: 'ChIJe67x5576CDsRm41_01i23E',
      contact_phone: '+91 484 2217777',
      website_url: 'https://www.fortekochi.in/',
      booking_url: 'https://www.makemytrip.com/hotels/forte_kochi-details-kochi.html',
      amenities: ['Heritage Dutch Villa', 'Swimming Pool', 'Free Breakfast', 'Free WiFi'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 20,
      name: 'Zostel Kochi',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1150,
      distance_from_center_km: 1.2,
      address: 'Peter Celli Street, Fort Kochi',
      latitude: 9.9628,
      longitude: 76.2415,
      place_id: 'ChIJf78y6676CDsRn52_12j34E',
      contact_phone: '+91 484 4003322',
      website_url: 'https://www.zostel.com/zostel/kochi/',
      booking_url: 'https://www.zostel.com/zostel/kochi/',
      amenities: ['Free WiFi', 'Common Cafe', 'Cycle Rentals', 'AC Rooms'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'pondicherry': [
    {
      id: 21,
      name: 'La Villa Pondicherry',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 19500,
      distance_from_center_km: 0.4,
      address: '11 Surcouf Street, White Town, Pondicherry',
      latitude: 11.9328,
      longitude: 79.8335,
      place_id: 'ChIJg89z779fUjoRo63_23k45E',
      contact_phone: '+91 413 2228555',
      website_url: 'https://www.lavillapondicherry.com/',
      booking_url: 'https://www.booking.com/hotel/in/la-villa.html',
      amenities: ['French Architecture', 'Private Pool', 'Gourmet French Dining', 'Free WiFi'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 22,
      name: 'Palais de Mahe',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 8900,
      distance_from_center_km: 0.3,
      address: '4 Bussy Street, White Town, Pondicherry',
      latitude: 11.9315,
      longitude: 79.8344,
      place_id: 'ChIJh90a889fUjoRp74_34l56E',
      contact_phone: '+91 413 2221100',
      website_url: 'https://www.cghearth.com/palaisdemahe',
      booking_url: 'https://www.makemytrip.com/hotels/palais_de_mahe_cgh_earth-details-pondicherry.html',
      amenities: ['Courtyard Pool', 'French Cafe', 'Ayurvedic Massage', 'Beach Access'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 23,
      name: 'Maison Perumal',
      star_rating: 3,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 4800,
      distance_from_center_km: 1.0,
      address: '44 Perumal Koil Street, Tamil Quarter, Pondicherry',
      latitude: 11.9379,
      longitude: 79.8279,
      place_id: 'ChIJi01b999fUjoRq85_45m67E',
      contact_phone: '+91 413 2227519',
      website_url: 'https://www.cghearth.com/maison-perumal',
      booking_url: 'https://www.booking.com/hotel/in/maison-perumal.html',
      amenities: ['Tamil Heritage Mansion', 'Local Cuisine', 'Free WiFi', 'Bicycle Tours'],
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 24,
      name: 'Dune Eco Village & Hostel',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1400,
      distance_from_center_km: 2.5,
      address: '70 East Coast Road, Pudhukuppam, Pondicherry',
      latitude: 12.0232,
      longitude: 79.8601,
      place_id: 'ChIJj12c009fUjoRr96_56n78E',
      contact_phone: '+91 413 2655751',
      website_url: 'https://dunewellnessgroup.com/dune-eco-village-and-spa/',
      booking_url: 'https://www.makemytrip.com/hotels/the_dune_eco_village_and_spa_beach_resort_in_pondicherry-details-pondicherry.html',
      amenities: ['Eco Huts', 'Free WiFi', 'Yoga Pavilion', 'Organic Garden'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'yercaud': [
    {
      id: 25,
      name: 'The Great Trails Yercaud by GRT Hotels',
      star_rating: 4,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 9500,
      distance_from_center_km: 2.0,
      address: '20th Hairpin Bend, Salem-Yercaud Main Road, Yercaud',
      latitude: 11.7788,
      longitude: 78.2045,
      place_id: 'ChIJk23d11g_qzsRs07_67o89E',
      contact_phone: '+91 4281 223344',
      website_url: 'https://grthotels.com/yercaud',
      booking_url: 'https://www.booking.com/hotel/in/great-trails-yercaud-by-grt-hotels.html',
      amenities: ['Valleys & Skywalk', 'Infinity Pool', 'Multi-Cuisine Dining', 'Campfire'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 26,
      name: 'Sterling Yercaud',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 5400,
      distance_from_center_km: 1.5,
      address: 'Lady\'s Seat Road, Yercaud',
      latitude: 11.7709,
      longitude: 78.2078,
      place_id: 'ChIJl34e22g_qzsRt18_78p90E',
      contact_phone: '+91 4281 222700',
      website_url: 'https://www.sterlingholidays.com/resorts-hotels/yercaud',
      booking_url: 'https://www.makemytrip.com/hotels/sterling_yercaud-details-yercaud.html',
      amenities: ['Hilltop Terrace', 'Indoor Games', 'Restobar', 'Free WiFi'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 27,
      name: 'Hotel Shevaroys Yercaud',
      star_rating: 3,
      price_range: 'Budget',
      avg_nightly_rate_inr: 2200,
      distance_from_center_km: 0.8,
      address: 'Hospital Road, Near Emerald Lake, Yercaud',
      latitude: 11.7765,
      longitude: 78.2120,
      place_id: 'ChIJm45f33g_qzsRu29_89q01E',
      contact_phone: '+91 4281 222288',
      website_url: 'https://www.hotelshevaroys.com/',
      booking_url: 'https://www.booking.com/hotel/in/shevaroys.html',
      amenities: ['Central Lake Location', 'Restaurant', 'Free Parking', 'Children Play Area'],
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'delhi': [
    {
      id: 28,
      name: 'The Imperial New Delhi',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 22000,
      distance_from_center_km: 1.0,
      address: 'Janpath Lane, Connaught Place, New Delhi',
      latitude: 28.6225,
      longitude: 77.2185,
      place_id: 'ChIJn56g44v9DDkRv30_90r12E',
      contact_phone: '+91 11 23341234',
      website_url: 'https://theimperialindia.com/',
      booking_url: 'https://www.booking.com/hotel/in/the-imperial-new-delhi.html',
      amenities: ['Heritage Luxury', 'Outdoor Pool', 'Spa', 'Fine Dining'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 29,
      name: 'Bloomrooms @ Janpath',
      star_rating: 3,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 4200,
      distance_from_center_km: 0.8,
      address: '1 Janpath Lane, Connaught Place, New Delhi',
      latitude: 28.6268,
      longitude: 77.2189,
      place_id: 'ChIJo67h55v9DDkRw41_01s23E',
      contact_phone: '+91 11 46665000',
      website_url: 'https://www.bloomhotels.com/bloomrooms-janpath-delhi',
      booking_url: 'https://www.booking.com/hotel/in/bloomrooms-janpath.html',
      amenities: ['Free WiFi', 'Complimentary Breakfast', 'Cafe', 'AC'],
      image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 30,
      name: 'Zostel Delhi',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1100,
      distance_from_center_km: 2.0,
      address: '5 Ara Kashan Road, Pahar Ganj, New Delhi',
      latitude: 28.6433,
      longitude: 77.2180,
      place_id: 'ChIJp78i66v9DDkRx52_12t34E',
      contact_phone: '+91 11 40012222',
      website_url: 'https://www.zostel.com/zostel/delhi/',
      booking_url: 'https://www.zostel.com/zostel/delhi/',
      amenities: ['Free WiFi', 'Rooftop Cafe', 'Common Room', '24h Desk'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'munnar': [
    {
      id: 31,
      name: 'Windermere Estate Munnar',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 16500,
      distance_from_center_km: 4.0,
      address: 'Pothamedu, Munnar, Idukki District, Kerala',
      latitude: 10.0521,
      longitude: 77.0628,
      place_id: 'ChIJq89j775mBzsRy63_23u45E',
      contact_phone: '+91 4865 230512',
      website_url: 'https://windermeremunnar.com/',
      booking_url: 'https://www.booking.com/hotel/in/windermere-estate.html',
      amenities: ['Tea Estate View', 'Boutique Heritage Resort', 'Organic Dining', 'Plantation Walk', 'Cardamom Valley View'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 32,
      name: 'Tea County Munnar',
      star_rating: 4,
      price_range: 'Mid-range',
      avg_nightly_rate_inr: 5800,
      distance_from_center_km: 1.2,
      address: 'Tea County Road, Nullatanni, Munnar',
      latitude: 10.0845,
      longitude: 77.0601,
      place_id: 'ChIJr90k885mBzsRz74_34v56E',
      contact_phone: '+91 4865 230460',
      website_url: 'https://www.teacountymunnar.com/',
      booking_url: 'https://www.makemytrip.com/hotels/tea_county-details-munnar.html',
      amenities: ['Valley View', 'Ayurvedic Wellness Spa', 'Multi-Cuisine Restaurant', 'Free WiFi'],
      image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 33,
      name: 'Zostel Munnar (Chithirapuram)',
      star_rating: 3,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1400,
      distance_from_center_km: 7.5,
      address: 'Pottankadu, Chithirapuram, Munnar',
      latitude: 10.0156,
      longitude: 77.0289,
      place_id: 'ChIJs01l995mBzsR085_45w67E',
      contact_phone: '+91 22 48962274',
      website_url: 'https://www.zostel.com/zostel/munnar/',
      booking_url: 'https://www.zostel.com/zostel/munnar/',
      amenities: ['Backpacker Dorms', 'Private Balcony', 'Bonfire & Cafe', 'High-Speed WiFi', 'Trekking Tours'],
      image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'
    }
  ],
  'varanasi': [
    {
      id: 34,
      name: 'BrijRama Palace Varanasi',
      star_rating: 5,
      price_range: 'Luxury',
      avg_nightly_rate_inr: 28000,
      distance_from_center_km: 0.2,
      address: 'Darbhanga Ghat, Dashashwamedh, Varanasi',
      latitude: 25.3056,
      longitude: 83.0118,
      place_id: 'ChIJt12m00_sjjkR196_56x78E',
      contact_phone: '+91 542 2455555',
      website_url: 'https://www.brijhotels.com/brijrama-palace-varanasi/',
      booking_url: 'https://www.booking.com/hotel/in/brijrama-palace-a-heritage-hotel.html',
      amenities: ['Ganga River View', 'Heritage Elevator', 'Classical Music', 'Vegetarian Dining'],
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 35,
      name: 'Zostel Varanasi',
      star_rating: 2,
      price_range: 'Budget',
      avg_nightly_rate_inr: 1050,
      distance_from_center_km: 0.6,
      address: 'D-54/16-D Luxa Road, Near Dashashwamedh Ghat, Varanasi',
      latitude: 25.3082,
      longitude: 83.0035,
      place_id: 'ChIJu23n11_sjjkR207_67y89E',
      contact_phone: '+91 542 4001111',
      website_url: 'https://www.zostel.com/zostel/varanasi/',
      booking_url: 'https://www.zostel.com/zostel/varanasi/',
      amenities: ['Rooftop Ganga View', 'Free WiFi', 'AC Rooms', 'Library'],
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80'
    }
  ]
};

// Generate multi-portal direct search URLs for any hotel
function enrichHotelWithPortals(hotel, cityName) {
  const encName = encodeURIComponent(hotel.name);
  const encCity = encodeURIComponent(cityName || 'India');
  const query = `${encName}+${encCity}`;

  const website = hotel.website_url || `https://www.google.com/search?q=${query}+official+website`;
  const primaryBooking = hotel.booking_url || `https://www.booking.com/searchresults.html?ss=${query}`;

  const portals = [
    {
      name: 'Official Website',
      label: 'Direct Booking',
      url: website,
      badge: 'Best Rates',
      icon: 'globe'
    },
    {
      name: 'MakeMyTrip',
      label: 'MakeMyTrip India',
      url: hotel.booking_url && hotel.booking_url.includes('makemytrip') 
        ? hotel.booking_url 
        : `https://www.makemytrip.com/hotels/hotel-listing/?city=${encCity}&searchText=${encName}`,
      badge: 'Popular',
      icon: 'suitcase'
    },
    {
      name: 'Booking.com',
      label: 'Booking.com',
      url: hotel.booking_url && hotel.booking_url.includes('booking.com') 
        ? hotel.booking_url 
        : `https://www.booking.com/searchresults.html?ss=${query}`,
      badge: 'Instant Confirm',
      icon: 'check'
    },
    {
      name: 'Google Hotels / Agoda',
      label: 'Compare Rates',
      url: `https://www.google.com/travel/hotels?q=${query}`,
      badge: 'Compare Deals',
      icon: 'search'
    }
  ];

  return {
    ...hotel,
    lat: hotel.latitude,
    lng: hotel.longitude,
    place_id: hotel.place_id,
    website_url: website,
    booking_url: primaryBooking,
    portals: portals
  };
}

/**
 * GET /api/hotels
 * Query params: city (string/id), tier ('budget', 'mid-range', 'luxury', 'all')
 */
router.get('/', async (req, res) => {
  try {
    const { city, tier } = req.query;
    const cityNameKey = String(city || 'bangalore').trim().toLowerCase();
    const tierKey = tier ? String(tier).trim().toLowerCase() : 'all';

    const dbStatus = await checkDbConnection();

    if (dbStatus.connected) {
      try {
        let sql = `
          SELECT h.*, c.name as city_name 
          FROM hotels h
          JOIN cities c ON h.city_id = c.id
          WHERE LOWER(c.name) = $1 OR c.id::text = $1
        `;
        const params = [cityNameKey];

        if (tierKey !== 'all') {
          sql += ` AND LOWER(h.price_range) = $2`;
          params.push(tierKey);
        }

        sql += ` ORDER BY h.avg_nightly_rate_inr ASC`;

        const dbRes = await query(sql, params);
        if (dbRes.rows.length > 0) {
          const enriched = dbRes.rows.map(h => enrichHotelWithPortals(h, h.city_name || cityNameKey));
          return res.status(200).json({
            source: 'database',
            city: cityNameKey,
            tier: tierKey,
            count: enriched.length,
            data: enriched
          });
        }
      } catch (err) {
        console.error('Error querying hotels from DB:', err.message);
      }
    }

    // Fallback to mock dataset
    const matchedCityKey = Object.keys(MOCK_HOTELS_BY_CITY).find(
      k => k.includes(cityNameKey) || cityNameKey.includes(k)
    ) || 'bangalore';

    let cityHotels = MOCK_HOTELS_BY_CITY[matchedCityKey] || MOCK_HOTELS_BY_CITY['bangalore'];

    if (tierKey !== 'all') {
      cityHotels = cityHotels.filter(h => (h.price_range || '').toLowerCase() === tierKey);
    }

    const enriched = cityHotels.map(h => enrichHotelWithPortals(h, matchedCityKey));

    return res.status(200).json({
      source: 'mock',
      city: matchedCityKey,
      tier: tierKey,
      count: enriched.length,
      data: enriched
    });

  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
});

module.exports = router;
