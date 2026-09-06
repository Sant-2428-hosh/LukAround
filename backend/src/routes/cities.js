const express = require('express');
const router = express.Router();
const { query, checkDbConnection } = require('../config/db');

// Full list of 8 seeded cities with details
const MOCK_CITIES = [
  {
    id: 1,
    name: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    description: 'India\'s Silicon Valley, famous for lush botanical gardens, vibrant brewpub culture, historic palaces, and pleasant year-round climate.',
    image_url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to February'
  },
  {
    id: 2,
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    description: 'India\'s coastal paradise renowned for sun-kissed golden beaches, Portuguese heritage architecture, vibrant night markets, and spice plantations.',
    image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'November to February'
  },
  {
    id: 3,
    name: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    description: 'Cultural gateway to South India, celebrated for Marina Beach, ancient Dravidian temples, Carnatic music, and filter coffee.',
    image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'November to February'
  },
  {
    id: 4,
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    description: 'The Pink City of Rajasthan, famous for royal hilltop forts, opulent palaces, colorful bazaars, and traditional handicraft heritage.',
    image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    id: 5,
    name: 'Agra',
    state: 'Uttar Pradesh',
    country: 'India',
    description: 'Home to the iconic Taj Mahal, Agra Fort, and rich Mughal history along the banks of the Yamuna River.',
    image_url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    id: 6,
    name: 'Kochin',
    state: 'Kerala',
    country: 'India',
    description: 'Vibrant port city of Kerala featuring iconic Chinese fishing nets, historic Fort Kochi, spice markets, and tranquil backwaters.',
    image_url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    id: 7,
    name: 'Pondicherry',
    state: 'Puducherry',
    country: 'India',
    description: 'Charming coastal union territory featuring French colonial quarters, yellow mustard villas, quiet beaches, and the spiritual Auroville.',
    image_url: 'https://images.unsplash.com/photo-1589786817006-8b4d8d17208d?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to March'
  },
  {
    id: 8,
    name: 'Yercaud',
    state: 'Tamil Nadu',
    country: 'India',
    description: 'Serene hill station nestled in the Shevaroy Hills of Eastern Ghats, known for Emerald Lake, coffee estates, and spice gardens.',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    best_time_to_visit: 'October to June'
  }
];

/**
 * GET /api/cities
 * Fetch list of cities from DB or fallback mock
 */
router.get('/', async (req, res) => {
  const dbStatus = await checkDbConnection();
  if (dbStatus.connected) {
    try {
      const dbResult = await query('SELECT * FROM cities ORDER BY name ASC');
      return res.status(200).json({
        source: 'database',
        count: dbResult.rows.length,
        data: dbResult.rows
      });
    } catch (err) {
      console.error('Error querying cities from database:', err.message);
    }
  }

  // Fallback mock data
  return res.status(200).json({
    source: 'mock',
    count: MOCK_CITIES.length,
    data: MOCK_CITIES,
    note: 'Database connection inactive. Serving seeded cities list.'
  });
});

module.exports = router;
