const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load master data
let tourismData = { states: [], cities: [], attractions: [] };
let hotelsData = [];

try {
  const tourismPath = path.join(__dirname, '..', 'data', 'indiaTourismData.json');
  if (fs.existsSync(tourismPath)) {
    tourismData = JSON.parse(fs.readFileSync(tourismPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load indiaTourismData.json in locations route:', err.message);
}

try {
  const hotelsPath = path.join(__dirname, '..', 'data', 'hotelsData.json');
  if (fs.existsSync(hotelsPath)) {
    hotelsData = JSON.parse(fs.readFileSync(hotelsPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load hotelsData.json in locations route:', err.message);
}

// ── Google Maps Utility Functions ──
function buildGoogleMapsSearchUrl(place) {
  if (!place) return 'https://www.google.com/maps/search/?api=1&query=India';

  if (place.googlePlaceId) {
    const query = encodeURIComponent(place.name || 'Location');
    return `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${encodeURIComponent(place.googlePlaceId)}`;
  }

  const lat = place.latitude ?? place.coordinates?.latitude;
  const lng = place.longitude ?? place.coordinates?.longitude;
  if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  const address = place.address || [place.name, place.city, place.state, 'India'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildGoogleMapsDirectionsUrl(destination, origin = null, travelMode = 'driving') {
  let destParam = '';
  let placeIdParam = '';

  if (destination) {
    if (destination.googlePlaceId) {
      placeIdParam = `&destination_place_id=${encodeURIComponent(destination.googlePlaceId)}`;
    }

    const lat = destination.latitude ?? destination.coordinates?.latitude;
    const lng = destination.longitude ?? destination.coordinates?.longitude;

    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      destParam = `${lat},${lng}`;
    } else {
      const address = destination.address || [destination.name, destination.city, destination.state, 'India'].filter(Boolean).join(', ');
      destParam = encodeURIComponent(address);
    }
  } else {
    destParam = 'India';
  }

  let url = `https://www.google.com/maps/dir/?api=1&destination=${destParam}${placeIdParam}`;

  if (origin) {
    const oLat = origin.latitude ?? origin.coordinates?.latitude;
    const oLng = origin.longitude ?? origin.coordinates?.longitude;
    if (oLat != null && oLng != null) {
      url += `&origin=${oLat},${oLng}`;
    } else {
      const oAddress = origin.address || origin.name || 'Current+Location';
      url += `&origin=${encodeURIComponent(oAddress)}`;
    }
  }

  const validModes = ['driving', 'walking', 'bicycling', 'transit'];
  const mode = validModes.includes(travelMode) ? travelMode : 'driving';
  url += `&travelmode=${mode}`;

  return url;
}

function calculateHaversine(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function normalizeLocationRecord(item, type) {
  const lat = item.latitude ?? item.coordinates?.latitude ?? null;
  const lng = item.longitude ?? item.coordinates?.longitude ?? null;
  const placeId = item.googlePlaceId || null;

  return {
    id: item.id || item.slug,
    name: item.name,
    type,
    state: item.state || item.name,
    stateSlug: item.stateSlug || item.slug,
    city: item.city || (type === 'city' ? item.name : null),
    citySlug: item.citySlug || (type === 'city' ? item.id : null),
    latitude: lat,
    longitude: lng,
    coordinates: lat != null && lng != null ? { latitude: lat, longitude: lng } : null,
    address: item.address || `${item.name}, ${item.city || ''}, ${item.state || 'India'}`.trim(),
    googlePlaceId: placeId,
    mapsSearchUrl: buildGoogleMapsSearchUrl(item),
    directionsUrl: buildGoogleMapsDirectionsUrl(item),
    locationVerified: lat != null && lng != null,
    locationSource: item.locationSource || 'Official Tourism Directory / GPS Verified',
    rating: item.rating || item.guestRating || null,
    category: item.category || item.type || item.propertyType || null,
    image: item.image || item.imageUrl || (item.gallery && item.gallery[0]?.imageUrl) || null
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/locations/search
// ─────────────────────────────────────────────────────────────────────────────
router.get('/search', (req, res) => {
  try {
    const { q = '', state = '', city = '', type = '', category = '', limit = 30 } = req.query;
    const queryStr = q.trim().toLowerCase();

    let results = [];

    // Search States
    if (!type || type === 'state') {
      tourismData.states.forEach(s => {
        if (!queryStr || s.name.toLowerCase().includes(queryStr) || s.slug.includes(queryStr)) {
          results.push(normalizeLocationRecord(s, 'state'));
        }
      });
    }

    // Search Cities
    if (!type || type === 'city') {
      tourismData.cities.forEach(c => {
        const matchesQuery = !queryStr || c.name.toLowerCase().includes(queryStr) || c.id.includes(queryStr);
        const matchesState = !state || c.state.toLowerCase() === state.toLowerCase() || c.stateSlug === state.toLowerCase();
        if (matchesQuery && matchesState) {
          results.push(normalizeLocationRecord(c, 'city'));
        }
      });
    }

    // Search Attractions
    if (!type || type === 'attraction') {
      tourismData.attractions.forEach(a => {
        const matchesQuery = !queryStr || a.name.toLowerCase().includes(queryStr) || a.id.includes(queryStr);
        const matchesState = !state || a.state.toLowerCase() === state.toLowerCase() || a.stateSlug === state.toLowerCase();
        const matchesCity = !city || a.city.toLowerCase() === city.toLowerCase() || a.citySlug === city.toLowerCase();
        const matchesCat = !category || (Array.isArray(a.category) ? a.category.some(c => c.toLowerCase().includes(category.toLowerCase())) : false);

        if (matchesQuery && matchesState && matchesCity && matchesCat) {
          results.push(normalizeLocationRecord(a, 'attraction'));
        }
      });
    }

    // Search Hotels
    if (!type || type === 'hotel') {
      hotelsData.forEach(h => {
        const matchesQuery = !queryStr || h.name.toLowerCase().includes(queryStr) || h.address?.toLowerCase().includes(queryStr);
        const matchesState = !state || h.state?.toLowerCase() === state.toLowerCase() || h.stateSlug === state.toLowerCase();
        const matchesCity = !city || h.city?.toLowerCase() === city.toLowerCase() || h.citySlug === city.toLowerCase();

        if (matchesQuery && matchesState && matchesCity) {
          results.push(normalizeLocationRecord(h, 'hotel'));
        }
      });
    }

    const limited = results.slice(0, parseInt(limit, 10));

    res.json({
      success: true,
      total: results.length,
      count: limited.length,
      locations: limited
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET /api/locations/states/:stateId
// ─────────────────────────────────────────────────────────────────────────────
router.get('/states/:stateId', (req, res) => {
  try {
    const stateId = req.params.stateId.toLowerCase();
    const state = tourismData.states.find(s => s.slug === stateId || s.id === stateId || s.name.toLowerCase() === stateId);

    if (!state) {
      return res.status(404).json({ success: false, error: `State not found: ${stateId}` });
    }

    const stateCities = tourismData.cities
      .filter(c => c.stateSlug === state.slug || c.state.toLowerCase() === state.name.toLowerCase())
      .map(c => normalizeLocationRecord(c, 'city'));

    const stateAttractions = tourismData.attractions
      .filter(a => a.stateSlug === state.slug || a.state.toLowerCase() === state.name.toLowerCase())
      .map(a => normalizeLocationRecord(a, 'attraction'));

    const stateHotels = hotelsData
      .filter(h => h.stateSlug === state.slug || h.state?.toLowerCase() === state.name.toLowerCase())
      .map(h => normalizeLocationRecord(h, 'hotel'));

    res.json({
      success: true,
      state: normalizeLocationRecord(state, 'state'),
      totalCities: stateCities.length,
      totalAttractions: stateAttractions.length,
      totalHotels: stateHotels.length,
      cities: stateCities,
      attractions: stateAttractions,
      hotels: stateHotels
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET /api/locations/cities/:cityId
// ─────────────────────────────────────────────────────────────────────────────
router.get('/cities/:cityId', (req, res) => {
  try {
    const cityId = req.params.cityId.toLowerCase();
    const city = tourismData.cities.find(c => c.id === cityId || c.name.toLowerCase() === cityId);

    if (!city) {
      return res.status(404).json({ success: false, error: `City not found: ${cityId}` });
    }

    const cityAttractions = tourismData.attractions
      .filter(a => a.citySlug === city.id || a.city.toLowerCase() === city.name.toLowerCase())
      .map(a => normalizeLocationRecord(a, 'attraction'));

    const cityHotels = hotelsData
      .filter(h => h.citySlug === city.id || h.city?.toLowerCase() === city.name.toLowerCase())
      .map(h => normalizeLocationRecord(h, 'hotel'));

    res.json({
      success: true,
      city: normalizeLocationRecord(city, 'city'),
      totalAttractions: cityAttractions.length,
      totalHotels: cityHotels.length,
      attractions: cityAttractions,
      hotels: cityHotels
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. GET /api/locations/destinations/:destinationId
// ─────────────────────────────────────────────────────────────────────────────
router.get('/destinations/:destinationId', (req, res) => {
  try {
    const destId = req.params.destinationId.toLowerCase();
    const attraction = tourismData.attractions.find(a => a.id === destId || a.id.toLowerCase() === destId);

    if (!attraction) {
      return res.status(404).json({ success: false, error: `Destination not found: ${destId}` });
    }

    res.json({
      success: true,
      destination: normalizeLocationRecord(attraction, 'attraction'),
      raw: attraction
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. GET /api/locations/destinations/:destinationId/hotels
// ─────────────────────────────────────────────────────────────────────────────
router.get('/destinations/:destinationId/hotels', (req, res) => {
  try {
    const destId = req.params.destinationId.toLowerCase();
    const attraction = tourismData.attractions.find(a => a.id === destId || a.id.toLowerCase() === destId);

    if (!attraction) {
      return res.status(404).json({ success: false, error: `Destination not found: ${destId}` });
    }

    const destLat = attraction.coordinates?.latitude;
    const destLng = attraction.coordinates?.longitude;
    const { radius = 50, limit = 20 } = req.query;

    const nearby = hotelsData
      .map(hotel => {
        const distanceKm = calculateHaversine(destLat, destLng, hotel.latitude, hotel.longitude);
        return {
          ...normalizeLocationRecord(hotel, 'hotel'),
          distanceKm,
          directionsFromAttractionUrl: buildGoogleMapsDirectionsUrl(hotel, attraction)
        };
      })
      .filter(h => h.distanceKm != null && h.distanceKm <= parseFloat(radius))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, parseInt(limit, 10));

    res.json({
      success: true,
      destination: {
        id: attraction.id,
        name: attraction.name,
        city: attraction.city,
        state: attraction.state,
        coordinates: attraction.coordinates
      },
      count: nearby.length,
      hotels: nearby
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. GET /api/locations/:locationId/map-link
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:locationId/map-link', (req, res) => {
  try {
    const locId = req.params.locationId.toLowerCase();

    // Match attraction, city, hotel, or state
    const attraction = tourismData.attractions.find(a => a.id.toLowerCase() === locId);
    if (attraction) {
      return res.json({
        success: true,
        type: 'attraction',
        name: attraction.name,
        mapsSearchUrl: buildGoogleMapsSearchUrl(attraction),
        directionsUrl: buildGoogleMapsDirectionsUrl(attraction),
        location: normalizeLocationRecord(attraction, 'attraction')
      });
    }

    const city = tourismData.cities.find(c => c.id.toLowerCase() === locId || c.name.toLowerCase() === locId);
    if (city) {
      return res.json({
        success: true,
        type: 'city',
        name: city.name,
        mapsSearchUrl: buildGoogleMapsSearchUrl(city),
        directionsUrl: buildGoogleMapsDirectionsUrl(city),
        location: normalizeLocationRecord(city, 'city')
      });
    }

    const hotel = hotelsData.find(h => (h.id && h.id.toLowerCase() === locId) || (h.slug && h.slug.toLowerCase() === locId));
    if (hotel) {
      return res.json({
        success: true,
        type: 'hotel',
        name: hotel.name,
        mapsSearchUrl: buildGoogleMapsSearchUrl(hotel),
        directionsUrl: buildGoogleMapsDirectionsUrl(hotel),
        location: normalizeLocationRecord(hotel, 'hotel')
      });
    }

    const state = tourismData.states.find(s => s.slug.toLowerCase() === locId || s.name.toLowerCase() === locId);
    if (state) {
      return res.json({
        success: true,
        type: 'state',
        name: state.name,
        mapsSearchUrl: buildGoogleMapsSearchUrl(state),
        directionsUrl: buildGoogleMapsDirectionsUrl(state),
        location: normalizeLocationRecord(state, 'state')
      });
    }

    return res.status(404).json({ success: false, error: `Location not found: ${locId}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
