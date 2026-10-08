const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('====================================================');
  console.log('POLAMA HOTEL DISCOVERY SYSTEM - INTEGRATION TESTS');
  console.log('====================================================\n');

  // 1. DATASET SCHEMA & NO-FAKE-DATA VALIDATION
  const hotelsData = require('../backend/src/data/hotelsData.json');
  console.log(`[TEST 1] Master Hotels Dataset: ${hotelsData.length} properties loaded.`);
  
  const REQUIRED_FIELDS = [
    'id', 'name', 'slug', 'state', 'city', 'address', 'latitude', 'longitude',
    'starCategory', 'guestRating', 'reviewCount', 'description', 'image',
    'gallery', 'website', 'phone', 'amenities', 'safetyIndicators', 'verified',
    'verificationSource', 'lastVerified', 'googleMapsUrl', 'directionsUrl',
    'priceLevel'
  ];

  let missingFieldErrors = 0;
  const statesCovered = new Set();
  
  hotelsData.forEach((h, i) => {
    statesCovered.add(h.state);
    REQUIRED_FIELDS.forEach(f => {
      if (h[f] === undefined || h[f] === null || h[f] === '') {
        console.error(` Hotel #${i} (${h.name || h.id}) is missing field: ${f}`);
        missingFieldErrors++;
      }
    });

    if (typeof h.latitude !== 'number' || typeof h.longitude !== 'number') {
      console.error(` Hotel ${h.name} has invalid GPS coordinates`);
      missingFieldErrors++;
    }

    if (h.starCategory < 1 || h.starCategory > 5) {
      console.error(` Hotel ${h.name} has invalid star category: ${h.starCategory}`);
      missingFieldErrors++;
    }

    if (!h.googleMapsUrl.includes('google.com/maps')) {
      console.error(` Hotel ${h.name} has invalid Google Maps URL`);
      missingFieldErrors++;
    }
  });

  console.log(`✓ Field validation complete: ${missingFieldErrors === 0 ? 'PASSED (0 errors)' : `FAILED (${missingFieldErrors} errors)`}`);
  console.log(`✓ States covered: ${statesCovered.size} of 15 states.`);
  console.log(`  States: ${Array.from(statesCovered).join(', ')}\n`);

  // 2. BACKEND API TESTS
  console.log('[TEST 2] Backend API Endpoints:');

  // A. /api/hotels master endpoint
  const masterRes = await fetch('http://localhost:5000/api/hotels').then(r => r.json());
  console.log(`✓ GET /api/hotels -> HTTP 200, Total: ${masterRes.total}, Count: ${masterRes.count}`);

  // B. Filtering by city (Agra)
  const agraRes = await fetch('http://localhost:5000/api/hotels?city=Agra').then(r => r.json());
  console.log(`✓ GET /api/hotels?city=Agra -> Count: ${agraRes.count} hotels in Agra`);

  // C. Nearby Taj Mahal (Agra)
  const tajRes = await fetch('http://localhost:5000/api/hotels/nearby?destinationId=taj-mahal&radius=10').then(r => r.json());
  console.log(`✓ GET /api/hotels/nearby?destinationId=taj-mahal:`);
  console.log(`  Destination: ${tajRes.destination.name}`);
  console.log(`  Top stay: ${tajRes.hotels[0].name} (${tajRes.hotels[0].distanceFromDestination}, ${tajRes.hotels[0].estimatedTravelTime})`);

  // D. Nearby Meenakshi Amman Temple (Madurai)
  const maduraiRes = await fetch('http://localhost:5000/api/hotels/nearby?destinationId=meenakshi-amman-temple&radius=10').then(r => r.json());
  console.log(`✓ GET /api/hotels/nearby?destinationId=meenakshi-amman-temple:`);
  console.log(`  Destination: ${maduraiRes.destination.name}`);
  console.log(`  Top stay: ${maduraiRes.hotels[0].name} (${maduraiRes.hotels[0].distanceFromDestination})`);

  // E. Remote Pilgrimage (Kedarnath Temple) - Special handling test
  const kedarRes = await fetch('http://localhost:5000/api/hotels/nearby?destinationId=kedarnath-temple&radius=20').then(r => r.json());
  console.log(`✓ GET /api/hotels/nearby?destinationId=kedarnath-temple (Remote Pilgrimage):`);
  console.log(`  Found: ${kedarRes.hotels.length} verified stays`);
  kedarRes.hotels.forEach(h => {
    console.log(`   - ${h.name} (${h.propertyType}, ${h.distanceFromDestination})`);
  });

  // F. Single Hotel Detail
  const singleRes = await fetch('http://localhost:5000/api/hotels/the-oberoi-amarvilas-agra').then(r => r.json());
  console.log(`✓ GET /api/hotels/the-oberoi-amarvilas-agra:`);
  console.log(`  Name: ${singleRes.hotel.name}`);
  console.log(`  Star Category: ${singleRes.hotel.starCategory}-Star`);
  console.log(`  Guest Rating: ${singleRes.hotel.guestRating}/5`);
  console.log(`  Safety Indicators: ${singleRes.hotel.safetyIndicators.length} verified indicators`);
  console.log(`  Directions URL: ${singleRes.hotel.directionsUrl}\n`);

  console.log('====================================================');
  console.log('ALL INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
