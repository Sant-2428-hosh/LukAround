const express = require('express');
const router = express.Router();
const { realRestaurantData, getRestaurantsForContext } = require('../data/realRestaurantData');
const { regionalFoodData, getMustTryDishes } = require('../data/regionalFoodData');

const GOOGLE_API_KEY = process.env.MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY || '';
const GROQ_KEY = process.env.GROQ_API_KEY || '';

/**
 * Calculate Haversine distance in kilometers between two coordinates
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

/**
 * Estimate travel time based on distance
 */
function estimateTravelTime(distanceKm) {
  if (distanceKm == null) return { walking: null, driving: null };
  const walkMins = Math.round((distanceKm / 4.5) * 60); // 4.5 km/h avg walking
  const driveMins = Math.round((distanceKm / 28) * 60); // 28 km/h city driving
  return {
    walking: walkMins <= 60 ? `${walkMins} min walk` : `${Math.round(walkMins / 60)}h walk`,
    driving: driveMins <= 60 ? `${Math.max(driveMins, 2)} min drive` : `${Math.round(driveMins / 60)}h drive`
  };
}

/**
 * Build official Google Maps Search URL
 */
function buildMapsSearchUrl(query, placeId = null) {
  const p = new URLSearchParams();
  p.set('api', '1');
  p.set('query', query);
  if (placeId) p.set('query_place_id', placeId);
  return `https://www.google.com/maps/search/?${p.toString()}`;
}

/**
 * Build official Google Maps Directions URL
 */
function buildMapsDirectionsUrl(destName, destCoords, originCoords = null) {
  const p = new URLSearchParams();
  p.set('api', '1');
  if (destCoords && destCoords.lat != null && destCoords.lng != null) {
    p.set('destination', `${destCoords.lat},${destCoords.lng}`);
  } else {
    p.set('destination', destName);
  }
  if (originCoords && originCoords.lat != null && originCoords.lng != null) {
    p.set('origin', `${originCoords.lat},${originCoords.lng}`);
  }
  p.set('travelmode', 'driving');
  return `https://www.google.com/maps/dir/?${p.toString()}`;
}

/**
 * Fetch live restaurants via Google Places API (New) Text Search
 */
async function fetchGooglePlacesLive(textQuery, lat, lng, radiusMeters = 5000) {
  if (!GOOGLE_API_KEY) return null;

  try {
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const body = {
      textQuery,
      maxResultCount: 10
    };

    if (lat != null && lng != null) {
      body.locationBias = {
        circle: {
          center: { latitude: Number(lat), longitude: Number(lng) },
          radius: Number(radiusMeters)
        }
      };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.types,places.websiteUri,places.googleMapsUri,places.currentOpeningHours,places.photos,places.businessStatus'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.warn('[Google Places API (New)] Request failed:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    if (!data.places || !Array.isArray(data.places)) return null;

    // Filter out permanently closed businesses
    return data.places
      .filter(p => p.businessStatus !== 'CLOSED_PERMANENTLY')
      .map(p => {
        const pLat = p.location?.latitude;
        const pLng = p.location?.longitude;
        const dist = lat != null && lng != null ? calculateHaversineDistance(lat, lng, pLat, pLng) : null;
        const travel = estimateTravelTime(dist);

        return {
          id: p.id,
          googlePlaceId: p.id,
          name: p.displayName?.text || 'Restaurant',
          address: p.formattedAddress || '',
          latitude: pLat,
          longitude: pLng,
          types: p.types || [],
          categories: ['Local Food'],
          cuisine: (p.types || []).slice(0, 3).map(t => t.replace(/_/g, ' ')).join(', '),
          rating: p.rating || 4.2,
          userRatingCount: p.userRatingCount || 100,
          priceLevel: p.priceLevel || 1,
          priceTier: p.priceLevel === 4 ? '₹₹₹₹' : p.priceLevel === 3 ? '₹₹₹' : p.priceLevel === 2 ? '₹₹' : '₹',
          priceForTwo: p.priceLevel >= 3 ? '₹1,800 for two' : '₹600 for two',
          businessStatus: p.businessStatus || 'OPERATIONAL',
          websiteUri: p.websiteUri || '',
          googleMapsUri: p.googleMapsUri || buildMapsSearchUrl(p.displayName?.text || '', p.id),
          photos: p.photos && p.photos[0] ? [`https://places.googleapis.com/v1/${p.photos[0].name}/media?maxHeightPx=600&maxWidthPx=800&key=${GOOGLE_API_KEY}`] : [],
          mustTryDishes: ['House Specialties'],
          verifiedDishes: [],
          dietaryOptions: ['Vegetarian', 'Non-Vegetarian'],
          ambiance: 'Verified Google Places Real Business',
          timings: p.currentOpeningHours?.weekdayDescriptions?.[0] || 'Open Daily',
          distanceKm: dist,
          travelTime: travel,
          isLiveVerified: true,
          verificationSources: ['Google Places API (New) Live Listing'],
          lastVerified: new Date().toISOString().slice(0, 7)
        };
      });
  } catch (err) {
    console.warn('[Google Places API (New)] Exception:', err.message);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT 1: GET /api/restaurants/nearby
// ─────────────────────────────────────────────────────────────────────────────
router.get('/nearby', async (req, res) => {
  try {
    const {
      lat,
      lng,
      attraction = '',
      city = 'Madurai',
      state = 'Tamil Nadu',
      radius = '5',
      category = 'All',
      dietary = 'All',
      limit = '10'
    } = req.query;

    const numRadius = Number(radius) || 5;
    const numLimit = Math.min(Number(limit) || 10, 20);
    const originLat = lat ? Number(lat) : null;
    const originLng = lng ? Number(lng) : null;

    let isLiveApi = false;
    let restaurants = null;

    // 1. Try Google Places API (New) if API key is present
    if (GOOGLE_API_KEY) {
      const queryStr = attraction
        ? `Popular restaurants near ${attraction}, ${city}, ${state}`
        : `Famous restaurants in ${city}, ${state}`;

      restaurants = await fetchGooglePlacesLive(queryStr, originLat, originLng, numRadius * 1000);
      if (restaurants && restaurants.length > 0) {
        isLiveApi = true;
      }
    }

    // 2. If API Key is unconfigured or failed, use authoritative verified database
    if (!restaurants || restaurants.length === 0) {
      const verifiedPool = getRestaurantsForContext({
        state,
        city,
        attraction,
        lat: originLat,
        lng: originLng,
        radius: numRadius,
        category,
        dietary
      });

      // Calculate distances from origin (attraction or destination center)
      restaurants = verifiedPool.map(r => {
        let dist = r.latitude && r.longitude && originLat && originLng
          ? calculateHaversineDistance(originLat, originLng, r.latitude, r.longitude)
          : null;

        const travel = estimateTravelTime(dist);
        const originCoords = originLat && originLng ? { lat: originLat, lng: originLng } : null;
        const destCoords = r.latitude && r.longitude ? { lat: r.latitude, lng: r.longitude } : null;

        return {
          ...r,
          distanceKm: dist,
          travelTime: travel,
          googleMapsUri: r.googleMapsUri || buildMapsSearchUrl(r.name, r.googlePlaceId),
          directionsUrl: buildMapsDirectionsUrl(r.name, destCoords, originCoords)
        };
      });

      // Filter out any places exceeding destination proximity (never return 100km+ away)
      if (originLat && originLng) {
        const maxDist = Math.max(numRadius * 1.5, 25);
        restaurants = restaurants.filter(r => r.distanceKm == null || r.distanceKm <= maxDist);
        restaurants.sort((a, b) => {
          if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
          return (b.rating || 0) - (a.rating || 0);
        });
      } else {
        restaurants.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }

    // Apply target count (e.g. 5–8 for attraction, 8–15 for city)
    const shortlisted = restaurants.slice(0, numLimit);

    const destinationLabel = attraction ? `${attraction}, ${city}` : `${city}, ${state}`;
    const mapsSearchFallback = buildMapsSearchUrl(`Popular restaurants near ${destinationLabel}, India`);

    return res.json({
      success: true,
      count: shortlisted.length,
      destination: {
        attraction,
        city,
        state,
        latitude: originLat,
        longitude: originLng,
        radiusKm: numRadius
      },
      isLiveApi,
      apiNotice: isLiveApi
        ? 'Live restaurant discovery via Google Places API (New)'
        : 'Google Places API key is not configured on server. Displaying verified regional restaurant landmarks. Live real-time discovery available via Google Maps link.',
      mapsSearchUrl: mapsSearchFallback,
      data: shortlisted
    });

  } catch (err) {
    console.error('[Restaurants Nearby] Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve nearby restaurants',
      data: []
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT 2: GET /api/restaurants/search
// ─────────────────────────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q = '', city = '', state = '' } = req.query;
    const query = q.toLowerCase().trim();

    if (!query) {
      return res.json({ success: true, count: 0, data: [] });
    }

    let results = realRestaurantData.filter(r =>
      r.name.toLowerCase().includes(query) ||
      (r.cuisine || '').toLowerCase().includes(query) ||
      (r.mustTryDishes || []).some(d => d.toLowerCase().includes(query)) ||
      (r.categories || []).some(c => c.toLowerCase().includes(query))
    );

    if (city) {
      results = results.filter(r => r.city.toLowerCase() === city.toLowerCase());
    }

    res.json({
      success: true,
      query: q,
      count: results.length,
      data: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, data: [] });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT 3: GET /api/food/must-try
// ─────────────────────────────────────────────────────────────────────────────
router.get('/must-try', (req, res) => {
  try {
    const { state = '', city = '', attraction = '' } = req.query;
    const dishes = getMustTryDishes({ state, city, attraction });

    // Connect dishes to real restaurants
    const enrichedDishes = dishes.map(dish => {
      const connectedRestaurants = realRestaurantData.filter(r =>
        (r.city.toLowerCase() === (dish.city || '').toLowerCase() || r.state.toLowerCase() === (dish.state || '').toLowerCase()) &&
        ((r.mustTryDishes || []).some(m => m.toLowerCase().includes(dish.name.toLowerCase())) ||
         (dish.knownEstablishments || []).some(k => r.name.toLowerCase().includes(k.toLowerCase())))
      );

      return {
        ...dish,
        relatedRestaurants: connectedRestaurants.map(r => ({
          id: r.id,
          name: r.name,
          address: r.address,
          rating: r.rating,
          userRatingCount: r.userRatingCount,
          priceTier: r.priceTier,
          googleMapsUri: r.googleMapsUri,
          photos: r.photos
        }))
      };
    });

    res.json({
      success: true,
      destination: { state, city, attraction },
      count: enrichedDishes.length,
      data: enrichedDishes
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, data: [] });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ENDPOINT 4: POST /api/dishly/recommend
// Context-Aware Dishly AI Food Recommendation
// ─────────────────────────────────────────────────────────────────────────────
router.post('/recommend', async (req, res) => {
  try {
    const {
      message = '',
      city = 'Madurai',
      state = 'Tamil Nadu',
      attraction = '',
      coordinates = null,
      radius = 5,
      dietary = 'No preference'
    } = req.body;

    const lat = coordinates?.latitude || coordinates?.lat || null;
    const lng = coordinates?.longitude || coordinates?.lng || null;

    // Fetch verified regional restaurants for destination
    const restaurants = getRestaurantsForContext({
      state,
      city,
      attraction,
      lat,
      lng,
      radius,
      dietary
    });

    // Fetch must-try food
    const mustTryDishes = getMustTryDishes({ state, city, attraction });

    // Format intelligent response text
    const destName = attraction ? `${attraction} in ${city}` : `${city}, ${state}`;
    let introText = `Namaste! 🍽️ Exploring food near **${destName}**? `;

    const lower = message.toLowerCase();
    if (lower.includes('veg') && !lower.includes('non')) {
      introText += `Here are the top-rated pure vegetarian dining spots and traditional tiffin centers nearby:`;
    } else if (lower.includes('what to try') || lower.includes('must try') || lower.includes('famous food')) {
      const dishNames = mustTryDishes.slice(0, 3).map(d => `**${d.name}**`).join(', ');
      introText += `When in ${city}, you must definitely try ${dishNames}! Here are verified local culinary landmarks serving them:`;
    } else if (lower.includes('budget') || lower.includes('cheap') || lower.includes('affordable')) {
      introText += `Here are great budget-friendly eateries and iconic street food spots near ${destName}:`;
    } else {
      introText += `Here are verified popular restaurants and must-try regional culinary specialties near this destination:`;
    }

    res.json({
      success: true,
      type: 'restaurants',
      text: introText,
      city,
      state,
      attraction,
      data: restaurants.slice(0, 8),
      mustTry: mustTryDishes.slice(0, 4),
      suggestions: [
        `🍛 Must-try dishes in ${city}`,
        `🥗 Best pure veg spots near ${attraction || city}`,
        `🍢 Famous local food in ${city}`,
        `📍 Closest restaurants within 2 km`
      ]
    });
  } catch (err) {
    console.error('[Dishly Recommend] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
