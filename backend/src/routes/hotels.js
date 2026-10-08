const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load master verified hotels dataset
const HOTELS_DATA_PATH = path.join(__dirname, '..', 'data', 'hotelsData.json');
let HOTELS = [];
try {
  if (fs.existsSync(HOTELS_DATA_PATH)) {
    HOTELS = JSON.parse(fs.readFileSync(HOTELS_DATA_PATH, 'utf8'));
  }
} catch (err) {
  console.error('Error loading hotelsData.json:', err.message);
}

// Load tourism attractions for coordinate matching
const TOURISM_DATA_PATH = path.join(__dirname, '..', 'data', 'indiaTourismData.json');
let ATTRACTIONS = [];
let CITIES = [];
try {
  if (fs.existsSync(TOURISM_DATA_PATH)) {
    const tourismData = JSON.parse(fs.readFileSync(TOURISM_DATA_PATH, 'utf8'));
    ATTRACTIONS = tourismData.attractions || [];
    CITIES = tourismData.cities || [];
  }
} catch (err) {
  console.error('Error loading indiaTourismData.json:', err.message);
}

/**
 * Calculates Haversine distance in km between two coordinate pairs
 */
function calculateHaversine(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Estimates driving travel time based on Indian road factor
 */
function estimateDrivingTime(distanceKm) {
  if (distanceKm == null) return 'N/A';
  if (distanceKm <= 0.6) {
    const walkMins = Math.max(2, Math.round(distanceKm * 15));
    return `Approx. ${walkMins} min walk`;
  }
  const roadDistance = distanceKm * 1.35;
  const driveMinutes = Math.max(3, Math.round((roadDistance / 28) * 60));
  if (driveMinutes >= 60) {
    const hours = Math.floor(driveMinutes / 60);
    const mins = driveMinutes % 60;
    return mins > 0 ? `Approx. ${hours}h ${mins}m drive` : `Approx. ${hours}h drive`;
  }
  return `Approx. ${driveMinutes} min drive`;
}

/**
 * Computes safety score for sorting
 */
function computeSafetyScore(hotel) {
  let score = 0;
  if (hotel.verified) score += 40;
  if (hotel.safetyIndicators && hotel.safetyIndicators.length > 0) {
    score += Math.min(30, hotel.safetyIndicators.length * 5);
  }
  if (hotel.guestRating) score += hotel.guestRating * 4;
  if (hotel.reviewCount && hotel.reviewCount > 500) score += 10;
  return score;
}

/**
 * Enriches hotel with distance and Google Maps navigation links
 */
function enrichHotel(hotel, originCoords = null, originName = null) {
  let distanceInKm = hotel.distanceInKm;
  let distanceFromDestination = hotel.distanceFromDestination;
  let estimatedTravelTime = hotel.estimatedTravelTime;

  if (originCoords && originCoords.latitude && originCoords.longitude) {
    const calculatedDist = calculateHaversine(
      originCoords.latitude,
      originCoords.longitude,
      hotel.latitude,
      hotel.longitude
    );
    if (calculatedDist != null) {
      distanceInKm = calculatedDist;
      distanceFromDestination = originName
        ? `${calculatedDist} km from ${originName}`
        : `${calculatedDist} km away`;
      estimatedTravelTime = estimateDrivingTime(calculatedDist);
    }
  }

  // Authentic Google Maps URLs
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ', ' + hotel.address)}`;
  
  const directionsUrl = originCoords && originCoords.latitude && originCoords.longitude
    ? `https://www.google.com/maps/dir/?api=1&origin=${originCoords.latitude},${originCoords.longitude}&destination=${hotel.latitude},${hotel.longitude}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&destination=${hotel.latitude},${hotel.longitude}&travelmode=driving`;

  return {
    ...hotel,
    distanceInKm,
    distanceFromDestination: distanceFromDestination || `${distanceInKm || 1.2} km away`,
    estimatedTravelTime: estimatedTravelTime || estimateDrivingTime(distanceInKm || 1.2),
    googleMapsUrl,
    directionsUrl
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/hotels/nearby
// Find verified hotels within a search radius of coordinates or destination ID
// ─────────────────────────────────────────────────────────────────────────────
router.get('/nearby', (req, res) => {
  try {
    let {
      latitude,
      longitude,
      destinationId,
      radius = 20,
      stars,
      limit = 30,
      sortBy = 'recommended'
    } = req.query;

    let originCoords = null;
    let destinationName = null;

    if (destinationId) {
      const dest = ATTRACTIONS.find(a =>
        a.id === destinationId || a.id.toLowerCase() === destinationId.toLowerCase()
      ) || CITIES.find(c =>
        c.id === destinationId || c.name.toLowerCase() === destinationId.toLowerCase()
      );

      if (dest) {
        originCoords = dest.coordinates || { latitude: dest.latitude, longitude: dest.longitude };
        destinationName = dest.name;
      }
    }

    if (!originCoords && latitude && longitude) {
      originCoords = {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
    }

    if (!originCoords) {
      return res.status(400).json({
        error: 'Missing coordinates or destinationId',
        message: 'Please provide either destinationId or latitude and longitude'
      });
    }

    const radiusKm = parseFloat(radius) || 20;
    const allowedStars = stars ? stars.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean) : null;

    // Filter by radius & stars
    let nearby = HOTELS.map(h => enrichHotel(h, originCoords, destinationName))
      .filter(h => {
        if (h.distanceInKm == null) return false;
        if (h.distanceInKm > radiusKm) return false;
        if (allowedStars && allowedStars.length > 0 && !allowedStars.includes(h.starCategory)) return false;
        return true;
      });

    // If no hotels found within strict radius, find closest verified within state/region
    let fallbackUsed = false;
    if (nearby.length === 0) {
      fallbackUsed = true;
      nearby = HOTELS.map(h => enrichHotel(h, originCoords, destinationName))
        .sort((a, b) => (a.distanceInKm || 999) - (b.distanceInKm || 999))
        .slice(0, 6);
    } else {
      // Sort based on sortBy
      if (sortBy === 'closest') {
        nearby.sort((a, b) => (a.distanceInKm || 999) - (b.distanceInKm || 999));
      } else if (sortBy === 'rating') {
        nearby.sort((a, b) => (b.guestRating || 0) - (a.guestRating || 0));
      } else {
        // Recommended ranking: Safety first, then rating and distance
        nearby.sort((a, b) => {
          const aSafety = computeSafetyScore(a);
          const bSafety = computeSafetyScore(b);
          const aScore = aSafety * 1.5 + (a.guestRating || 4) * 10 - (a.distanceInKm || 10) * 2;
          const bScore = bSafety * 1.5 + (b.guestRating || 4) * 10 - (b.distanceInKm || 10) * 2;
          return bScore - aScore;
        });
      }
    }

    const finalResults = nearby.slice(0, parseInt(limit, 10) || 30);

    return res.status(200).json({
      destination: {
        id: destinationId || null,
        name: destinationName || 'Selected Location',
        latitude: originCoords.latitude,
        longitude: originCoords.longitude
      },
      radiusKm,
      count: finalResults.length,
      fallbackUsed,
      disclaimer: "Safety information is based on publicly available property information and guest-review signals. No hotel can be guaranteed completely safe. Always verify current conditions and use your own judgment.",
      hotels: finalResults
    });

  } catch (error) {
    console.error('Error fetching nearby hotels:', error);
    res.status(500).json({ error: 'Failed to fetch nearby hotels', details: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET /api/hotels/nearby/:destinationId
// Direct lookup for destination nearby stays
// ─────────────────────────────────────────────────────────────────────────────
router.get('/nearby/:destinationId', (req, res) => {
  req.query.destinationId = req.params.destinationId;
  const nextRoute = router.handle.bind(router);
  req.url = '/nearby?' + new URLSearchParams(req.query).toString();
  return router(req, res);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET /api/destinations/:id/hotels
// Also accessible on this path
// ─────────────────────────────────────────────────────────────────────────────
router.get('/destinations/:id/hotels', (req, res) => {
  req.query.destinationId = req.params.id;
  req.url = '/nearby?' + new URLSearchParams(req.query).toString();
  return router(req, res);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. GET /api/hotels/state/:stateId
// ─────────────────────────────────────────────────────────────────────────────
router.get('/state/:stateId', (req, res) => {
  try {
    const stateParam = (req.params.stateId || '').toLowerCase().replace(/-/g, ' ');
    const matched = HOTELS.filter(h =>
      (h.state || '').toLowerCase().includes(stateParam) ||
      stateParam.includes((h.state || '').toLowerCase())
    );

    return res.status(200).json({
      state: req.params.stateId,
      count: matched.length,
      hotels: matched.map(h => enrichHotel(h))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels by state', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. GET /api/hotels/city/:cityId
// ─────────────────────────────────────────────────────────────────────────────
router.get('/city/:cityId', (req, res) => {
  try {
    const cityParam = (req.params.cityId || '').toLowerCase().replace(/-/g, ' ');
    const matched = HOTELS.filter(h =>
      (h.city || '').toLowerCase().includes(cityParam) ||
      (h.citySlug || '').toLowerCase() === req.params.cityId.toLowerCase()
    );

    return res.status(200).json({
      city: req.params.cityId,
      count: matched.length,
      hotels: matched.map(h => enrichHotel(h))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels by city', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. GET /api/hotels/search
// Keyword search across names, addresses, cities, amenities
// ─────────────────────────────────────────────────────────────────────────────
router.get('/search', (req, res) => {
  try {
    const query = (req.query.q || '').toLowerCase().trim();
    if (!query) {
      return res.status(200).json({ count: 0, hotels: [] });
    }

    const matched = HOTELS.filter(h =>
      (h.name || '').toLowerCase().includes(query) ||
      (h.city || '').toLowerCase().includes(query) ||
      (h.state || '').toLowerCase().includes(query) ||
      (h.address || '').toLowerCase().includes(query) ||
      (h.propertyType || '').toLowerCase().includes(query) ||
      (h.amenities || []).some(a => a.toLowerCase().includes(query)) ||
      (h.nearbyAttractions || []).some(na => na.toLowerCase().includes(query))
    );

    return res.status(200).json({
      query,
      count: matched.length,
      hotels: matched.map(h => enrichHotel(h))
    });
  } catch (err) {
    res.status(500).json({ error: 'Hotel search failed', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. GET /api/maps/directions & /api/hotels/:id/directions
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id/directions', (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = HOTELS.find(h =>
      h.id === hotelId || h.slug === hotelId || h.id.toLowerCase() === hotelId.toLowerCase()
    );

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const originLat = req.query.originLat;
    const originLng = req.query.originLng;
    const originCoords = originLat && originLng ? { latitude: parseFloat(originLat), longitude: parseFloat(originLng) } : null;

    const enriched = enrichHotel(hotel, originCoords);

    return res.status(200).json({
      hotel: {
        id: hotel.id,
        name: hotel.name,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        address: hotel.address
      },
      directionsUrl: enriched.directionsUrl,
      googleMapsUrl: enriched.googleMapsUrl,
      distanceInKm: enriched.distanceInKm,
      estimatedTravelTime: enriched.estimatedTravelTime
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve directions', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. GET /api/hotels/:idOrSlug
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:idOrSlug', (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    const hotel = HOTELS.find(h =>
      h.id === idOrSlug ||
      h.slug === idOrSlug ||
      h.id.toLowerCase() === idOrSlug.toLowerCase() ||
      h.slug.toLowerCase() === idOrSlug.toLowerCase()
    );

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found', id: idOrSlug });
    }

    return res.status(200).json({
      hotel: enrichHotel(hotel),
      safetyDisclaimer: "Safety information is based on publicly available property information and guest-review signals. No hotel can be guaranteed completely safe. Always verify current conditions and use your own judgment."
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotel details', details: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. GET /api/hotels
// Master listing with full filtering, sorting, and pagination
// ─────────────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    const {
      city,
      state,
      stars,
      star,
      tier,
      priceLevel,
      minRating,
      propertyType,
      type,
      search,
      sortBy = 'recommended',
      page = 1,
      limit = 50
    } = req.query;

    let filtered = [...HOTELS];

    // City filter
    if (city && city !== 'all') {
      const c = city.toLowerCase().trim();
      filtered = filtered.filter(h =>
        (h.city || '').toLowerCase().includes(c) ||
        (h.citySlug || '').toLowerCase() === c ||
        c.includes((h.city || '').toLowerCase())
      );
    }

    // State filter
    if (state && state !== 'all') {
      const s = state.toLowerCase().trim();
      filtered = filtered.filter(h =>
        (h.state || '').toLowerCase().includes(s) ||
        s.includes((h.state || '').toLowerCase())
      );
    }

    // Star category filter (supports '5', '5,4', etc.)
    const starInput = stars || star;
    if (starInput && starInput !== 'all') {
      const starList = starInput.split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean);
      if (starList.length > 0) {
        filtered = filtered.filter(h => starList.includes(h.starCategory));
      }
    }

    // Tier / price level filter
    const effectiveTier = tier || priceLevel;
    if (effectiveTier && effectiveTier !== 'all') {
      const t = effectiveTier.toLowerCase();
      if (t === 'luxury' || t === '₹₹₹₹') {
        filtered = filtered.filter(h => h.priceLevel === '₹₹₹₹' || h.starCategory === 5);
      } else if (t === 'mid-range' || t === 'premium' || t === '₹₹₹' || t === '₹₹') {
        filtered = filtered.filter(h => h.priceLevel === '₹₹₹' || h.priceLevel === '₹₹' || h.starCategory === 4 || h.starCategory === 3);
      } else if (t === 'budget' || t === '₹') {
        filtered = filtered.filter(h => h.priceLevel === '₹' || h.starCategory <= 2);
      }
    }

    // Minimum rating
    if (minRating) {
      const min = parseFloat(minRating);
      filtered = filtered.filter(h => (h.guestRating || 0) >= min);
    }

    // Property type
    const propType = propertyType || type;
    if (propType && propType !== 'all') {
      const pt = propType.toLowerCase();
      filtered = filtered.filter(h =>
        (h.propertyType || '').toLowerCase().includes(pt)
      );
    }

    // Free text search
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(h =>
        (h.name || '').toLowerCase().includes(s) ||
        (h.city || '').toLowerCase().includes(s) ||
        (h.state || '').toLowerCase().includes(s) ||
        (h.address || '').toLowerCase().includes(s) ||
        (h.amenities || []).some(a => a.toLowerCase().includes(s))
      );
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.guestRating || 0) - (a.guestRating || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case '5-star':
        filtered.sort((a, b) => (b.starCategory || 0) - (a.starCategory || 0));
        break;
      case '3-star':
        filtered.sort((a, b) => Math.abs((a.starCategory || 0) - 3) - Math.abs((b.starCategory || 0) - 3));
        break;
      case 'budget': {
        const priceOrder = { '₹': 1, '₹₹': 2, '₹₹₹': 3, '₹₹₹₹': 4 };
        filtered.sort((a, b) => (priceOrder[a.priceLevel] || 3) - (priceOrder[b.priceLevel] || 3));
        break;
      }
      case 'family':
        filtered.sort((a, b) => (b.familyFriendly ? 1 : 0) - (a.familyFriendly ? 1 : 0));
        break;
      case 'recommended':
      default:
        filtered.sort((a, b) => {
          const aSafety = computeSafetyScore(a);
          const bSafety = computeSafetyScore(b);
          return (bSafety * 1.5 + (b.guestRating || 4) * 10) - (aSafety * 1.5 + (a.guestRating || 4) * 10);
        });
        break;
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const totalCount = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    const enriched = paginated.map(h => enrichHotel(h));

    return res.status(200).json({
      source: 'verified-registry',
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      count: enriched.length,
      data: enriched,
      hotels: enriched, // for backward-compatibility
      disclaimer: "Safety information is based on publicly available property information and guest-review signals. No hotel can be guaranteed completely safe. Always verify current conditions and use your own judgment."
    });

  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Failed to fetch hotels', details: error.message });
  }
});

module.exports = router;
