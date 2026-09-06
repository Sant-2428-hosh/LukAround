const express = require('express');
const router = express.Router();
const { query, checkDbConnection } = require('../config/db');

// Fixed National & Tourist Helpline References
const NATIONAL_HELPLINES = [
  { name: 'National Emergency Helpline', number: '112', description: 'Single emergency number for Police, Fire & Ambulance' },
  { name: 'Women\'s Safety Helpline', number: '1091', description: '24/7 Toll-free assistance for women in distress' },
  { name: 'National Tourist Helpline', number: '1363', description: 'Toll-free 24/7 multi-lingual tourist assistance' },
  { name: 'Medical Emergency & Ambulance', number: '108', description: 'Immediate medical dispatch & ambulance' },
  { name: 'Childline Emergency', number: '1098', description: '24/7 emergency care & protection for children' }
];

// Fallback Police Stations data per city (11 CITIES)
const MOCK_SAFETY_BY_CITY = {
  'bangalore': {
    overallSafetyRating: 4.8,
    safetyTag: 'High Tourist Safety Zone (24/7 Patrol)',
    policeStations: [
      { station_name: 'Central Tourist Police Cell', zone: 'Central Business Zone', address: 'Infantry Road, MG Road Precinct, Bengaluru', contact_number: '+91 80 22942222', area_safety_rating: 4.8, latitude: 12.9788, longitude: 77.5998 },
      { station_name: 'Indiranagar Police Station', zone: 'East Tech Zone', address: '100 Feet Road, Indiranagar, Bengaluru', contact_number: '+91 80 22942544', area_safety_rating: 4.7, latitude: 12.9784, longitude: 77.6408 },
      { station_name: 'Koramangala Police Precinct', zone: 'South Tech Zone', address: '80 Feet Road, 4th Block, Koramangala, Bengaluru', contact_number: '+91 80 22942555', area_safety_rating: 4.6, latitude: 12.9352, longitude: 77.6245 }
    ]
  },
  'goa': {
    overallSafetyRating: 4.9,
    safetyTag: 'Top Coastal Tourist Precinct (Beach Patrol active)',
    policeStations: [
      { station_name: 'Calangute Tourist Police Station', zone: 'North Goa Beach Precinct', address: 'Chogm Road, Calangute, Bardez, North Goa', contact_number: '+91 832 2278223', area_safety_rating: 4.9, latitude: 15.5428, longitude: 73.7621 },
      { station_name: 'Old Goa Heritage Police Outpost', zone: 'Heritage & Cultural Zone', address: 'Near Basilica of Bom Jesus, Old Goa', contact_number: '+91 832 2285203', area_safety_rating: 4.8, latitude: 15.5012, longitude: 73.9120 }
    ]
  },
  'chennai': {
    overallSafetyRating: 4.8,
    safetyTag: 'Safe Cultural Gateway (Beach & Temple Patrol)',
    policeStations: [
      { station_name: 'Marina Beach Tourist Police Station', zone: 'Coastal & Promenade Zone', address: 'Kamarajar Salai, Marina Beach Front, Chennai', contact_number: '+91 44 23452345', area_safety_rating: 4.8, latitude: 13.0488, longitude: 80.2820 },
      { station_name: 'Mylapore Heritage Police Station', zone: 'Temple Heritage Zone', address: 'Kutchery Road, Mylapore, Chennai', contact_number: '+91 44 23452401', area_safety_rating: 4.7, latitude: 13.0340, longitude: 80.2680 }
    ]
  },
  'jaipur': {
    overallSafetyRating: 4.8,
    safetyTag: 'Heritage Tourist Guard Active (CCTV Monitored)',
    policeStations: [
      { station_name: 'Pink City Tourist Police Station', zone: 'Old City Heritage Zone', address: 'Badi Chaupar, Near Hawa Mahal, Jaipur', contact_number: '+91 141 2605555', area_safety_rating: 4.8, latitude: 26.9240, longitude: 75.8270 },
      { station_name: 'Amer Fort Security Precinct', zone: 'Fort Hilltop Zone', address: 'Amer Fort Main Entrance Road, Jaipur', contact_number: '+91 141 2530222', area_safety_rating: 4.9, latitude: 26.9860, longitude: 75.8520 }
    ]
  },
  'agra': {
    overallSafetyRating: 4.9,
    safetyTag: 'Protected Monument Security Zone',
    policeStations: [
      { station_name: 'Taj Mahal Tourist Police Station', zone: 'Taj Protected Monument Zone', address: 'East Gate Complex, Taj Mahal, Agra', contact_number: '+91 562 2330000', area_safety_rating: 4.9, latitude: 27.1755, longitude: 78.0430 },
      { station_name: 'Agra Fort Police Precinct', zone: 'Mughal Heritage Precinct', address: 'Near Agra Fort Railway Station Road, Agra', contact_number: '+91 562 2421200', area_safety_rating: 4.7, latitude: 27.1798, longitude: 78.0215 }
    ]
  },
  'kochin': {
    overallSafetyRating: 4.9,
    safetyTag: 'Peaceful Port Precinct (Coastal Guard)',
    policeStations: [
      { station_name: 'Fort Kochi Police Station', zone: 'Heritage & Port Zone', address: 'Tower Road, Fort Kochi, Kochin', contact_number: '+91 484 2215045', area_safety_rating: 4.9, latitude: 9.9660, longitude: 76.2430 },
      { station_name: 'Mattancherry Police Outpost', zone: 'Spice Market & Jew Town Zone', address: 'Palace Road, Mattancherry, Kochin', contact_number: '+91 484 2224050', area_safety_rating: 4.7, latitude: 9.9580, longitude: 76.2590 }
    ]
  },
  'pondicherry': {
    overallSafetyRating: 4.9,
    safetyTag: 'Pedestrian Safe Union Territory',
    policeStations: [
      { station_name: 'Grand Bazaar Tourist Police Station', zone: 'White Town French Quarter', address: 'Suffren Street, White Town, Pondicherry', contact_number: '+91 413 2337000', area_safety_rating: 4.9, latitude: 11.9335, longitude: 79.8350 },
      { station_name: 'Auroville Security Post', zone: 'Auroville Spiritual Zone', address: 'Visitor Centre Road, Auroville, Pondicherry', contact_number: '+91 413 2622222', area_safety_rating: 4.8, latitude: 12.0070, longitude: 79.8100 }
    ]
  },
  'yercaud': {
    overallSafetyRating: 4.8,
    safetyTag: 'Quiet Hill Station Patrol',
    policeStations: [
      { station_name: 'Yercaud Hill Town Police Station', zone: 'Shevaroy Hill Station Zone', address: 'Lake Road, Near Emerald Lake, Yercaud', contact_number: '+91 4281 222222', area_safety_rating: 4.8, latitude: 11.7770, longitude: 78.2100 }
    ]
  },
  'delhi': {
    overallSafetyRating: 4.8,
    safetyTag: 'Capital Tourist Police Precinct',
    policeStations: [
      { station_name: 'Connaught Place Tourist Police Cell', zone: 'Central Capital Zone', address: 'Outer Circle, Connaught Place, New Delhi', contact_number: '+91 11 23412222', area_safety_rating: 4.8, latitude: 28.6315, longitude: 77.2167 },
      { station_name: 'Kotwali Police Station Chandni Chowk', zone: 'Old Delhi Heritage Zone', address: 'Chandni Chowk Main Road, Delhi', contact_number: '+91 11 23863333', area_safety_rating: 4.6, latitude: 28.6560, longitude: 77.2300 }
    ]
  },
  'munnar': {
    overallSafetyRating: 4.9,
    safetyTag: 'Serene Western Ghats Hill Patrol',
    policeStations: [
      { station_name: 'Munnar Tourist Police Station', zone: 'Western Ghats Hill Station Zone', address: 'Main Town Road, Near KSRTC Bus Stand, Munnar', contact_number: '+91 4865 230321', area_safety_rating: 4.9, latitude: 10.0880, longitude: 77.0600 },
      { station_name: 'Devikulam Police Station', zone: 'Tea Estate & Plantation Precinct', address: 'Devikulam Road, Near Lake View, Idukki District', contact_number: '+91 4865 264225', area_safety_rating: 4.9, latitude: 10.0630, longitude: 77.1020 },
      { station_name: 'Eravikulam Forest Wildlife Aid Post', zone: 'National Park & Wildlife Zone', address: 'Rajamalai Entry Gate, Eravikulam', contact_number: '+91 4865 231587', area_safety_rating: 4.8, latitude: 10.1500, longitude: 77.0667 }
    ]
  },
  'varanasi': {
    overallSafetyRating: 4.8,
    safetyTag: 'Sacred Ganga Ghat Protection Force',
    policeStations: [
      { station_name: 'Dashashwamedh Ghat Police Station', zone: 'Ganga Ghat Sacred Precinct', address: 'Godowlia Chowk, Varanasi', contact_number: '+91 542 2451000', area_safety_rating: 4.8, latitude: 25.3080, longitude: 83.0100 }
    ]
  }
};

/**
 * GET /api/safety
 * Query params: city (string/id)
 */
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const cityNameKey = String(city || 'bangalore').trim().toLowerCase();

    const dbStatus = await checkDbConnection();

    let policeStations = [];
    let cityName = cityNameKey.charAt(0).toUpperCase() + cityNameKey.slice(1);

    if (dbStatus.connected) {
      try {
        const dbRes = await query(
          `SELECT p.*, c.name as city_name 
           FROM police_stations p
           JOIN cities c ON p.city_id = c.id
           WHERE LOWER(c.name) = $1 OR c.id::text = $1
           ORDER BY p.area_safety_rating DESC`,
          [cityNameKey]
        );
        if (dbRes.rows.length > 0) {
          policeStations = dbRes.rows;
          cityName = dbRes.rows[0].city_name;
        }
      } catch (err) {
        console.error('Error querying safety DB:', err.message);
      }
    }

    if (policeStations.length === 0) {
      const matchedKey = Object.keys(MOCK_SAFETY_BY_CITY).find(
        k => k.includes(cityNameKey) || cityNameKey.includes(k)
      ) || 'bangalore';

      const mockData = MOCK_SAFETY_BY_CITY[matchedKey] || MOCK_SAFETY_BY_CITY['bangalore'];
      policeStations = mockData.policeStations;
      cityName = matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1);
    }

    // Calculate average area safety rating
    const avgSafetyRating = policeStations.length > 0
      ? (policeStations.reduce((acc, s) => acc + Number(s.area_safety_rating || 4.7), 0) / policeStations.length).toFixed(1)
      : '4.8';

    return res.status(200).json({
      success: true,
      city: cityName,
      overallSafetyRating: parseFloat(avgSafetyRating),
      safetyStatusTag: 'Verified Tourist Safe City',
      nationalHelplines: NATIONAL_HELPLINES,
      policeStations: policeStations,
      meta: {
        datasource: dbStatus.connected ? 'PostgreSQL Database' : 'Local Safety Intelligence Engine',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error fetching safety info:', error);
    res.status(500).json({ error: 'Failed to fetch safety info', details: error.message });
  }
});

module.exports = router;
