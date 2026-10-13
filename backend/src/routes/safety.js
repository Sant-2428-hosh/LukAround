const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// ── 1. Load Verified Emergency Facilities Database ──
let emergencyFacilities = [];
try {
  const facPath = path.join(__dirname, '..', 'data', 'emergencyFacilitiesData.json');
  if (fs.existsSync(facPath)) {
    emergencyFacilities = JSON.parse(fs.readFileSync(facPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load emergencyFacilitiesData.json:', err.message);
}

// ── 2. Load Tourism Master Data for Dynamic Coordinate Resolution ──
let tourismCities = [];
let tourismAttractions = [];
let tourismStates = [];
try {
  const tPath = path.join(__dirname, '..', 'data', 'indiaTourismData.json');
  if (fs.existsSync(tPath)) {
    const tData = JSON.parse(fs.readFileSync(tPath, 'utf8'));
    tourismCities = tData.cities || [];
    tourismAttractions = tData.attractions || [];
    tourismStates = tData.states || [];
  }
} catch (err) {
  console.error('Failed to load tourism data for location resolution:', err.message);
}

// ── 3. Haversine Distance Formula ──
function haversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const numLat1 = parseFloat(lat1);
  const numLon1 = parseFloat(lon1);
  const numLat2 = parseFloat(lat2);
  const numLon2 = parseFloat(lon2);
  if (isNaN(numLat1) || isNaN(numLon1) || isNaN(numLat2) || isNaN(numLon2)) return null;

  const R = 6371; // km
  const dLat = (numLat2 - numLat1) * (Math.PI / 180);
  const dLon = (numLon2 - numLon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(numLat1 * (Math.PI / 180)) *
      Math.cos(numLat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function estimateRoadTransitTime(distanceKm) {
  if (distanceKm == null) return null;
  const minutes = Math.max(3, Math.round((distanceKm / 28) * 60));
  if (minutes < 60) return `${minutes} mins`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
}

// ── 4. Authoritative National Helplines (Constant Across India) ──
const OFFICIAL_NATIONAL_HELPLINES = [
  {
    name: 'National Emergency Response Support System',
    number: '112',
    description: 'Single unified emergency number for Police, Fire & Medical dispatch across all Indian States & UTs.',
    sourceUrl: 'https://112.gov.in/',
    hours: '24/7 Toll-Free'
  },
  {
    name: 'Ministry of Tourism Tourist Helpline',
    number: '1363',
    tollFreeNumber: '1800-11-1363',
    description: 'Dedicated multi-lingual tourist assistance & guidance in distress (12 languages including English, Hindi, Spanish, French, German).',
    sourceUrl: 'https://www.incredibleindia.gov.in/',
    hours: '24/7 Toll-Free Multi-Lingual'
  },
  {
    name: 'Women in Distress Helpline',
    number: '1091',
    description: '24/7 dedicated helpline for women safety, distress rescue, and counseling.',
    sourceUrl: 'https://wcd.nic.in/',
    hours: '24/7 Toll-Free'
  },
  {
    name: 'Emergency Medical & Ambulance Service',
    number: '108',
    description: 'Emergency ambulance dispatch and acute trauma care transport (National Health Mission).',
    sourceUrl: 'https://nhm.gov.in/',
    hours: '24/7 Toll-Free Dispatch'
  },
  {
    name: 'Fire & Rescue Services',
    number: '101',
    description: 'Emergency fire-fighting and search & rescue dispatch.',
    sourceUrl: 'https://ndmindia.mha.gov.in/',
    hours: '24/7 Toll-Free'
  },
  {
    name: 'Childline Emergency',
    number: '1098',
    description: '24/7 emergency care and rescue protection for children in distress.',
    sourceUrl: 'https://childlineindia.org/',
    hours: '24/7 Toll-Free'
  },
  {
    name: 'Rail Madad / Railway Security',
    number: '139',
    description: 'Security and medical aid during Indian Railways journeys.',
    sourceUrl: 'https://railmadad.indianrailways.gov.in/',
    hours: '24/7 Toll-Free'
  }
];

// ── 5. Exact Destination & Coordinate Resolution Service ──
function resolveCoordinates({ lat, lng, destination, city, state, attractionId }) {
  let targetLat = lat != null ? parseFloat(lat) : null;
  let targetLng = lng != null ? parseFloat(lng) : null;
  let resolvedName = destination || city || '';
  let resolvedCity = city || '';
  let resolvedState = state || '';

  if (targetLat != null && targetLng != null && !isNaN(targetLat) && !isNaN(targetLng)) {
    return { targetLat, targetLng, resolvedName, resolvedCity, resolvedState };
  }

  // 1. Try resolving attraction by ID, name, or alias
  if (attractionId || destination) {
    const qAttr = (attractionId || destination).toLowerCase().trim();
    const attrMatch = tourismAttractions.find((a) => {
      const aName = a.name.toLowerCase();
      const aId = a.id.toLowerCase();
      if (aId === qAttr || aName === qAttr) return true;
      if (aName.includes(qAttr) || qAttr.includes(aName)) return true;
      // Cultural & historic attraction aliases
      if (qAttr.includes('amber') || qAttr.includes('amer')) return aId.includes('amber') || aName.includes('amber') || aName.includes('amer');
      if (qAttr.includes('hawa mahal')) return aName.includes('hawa mahal');
      if (qAttr.includes('marina')) return aName.includes('marina');
      if (qAttr.includes('guindy')) return aName.includes('guindy');
      if (qAttr.includes('gateway of india')) return aName.includes('gateway of india');
      if (qAttr.includes('charminar')) return aName.includes('charminar');
      if (qAttr.includes('periya kovil') || qAttr.includes('brihadeeswarar') || qAttr.includes('brihadisvara') || qAttr.includes('big temple')) return aName.includes('periya kovil') || aName.includes('brihad');
      if (qAttr.includes('meenakshi')) return aName.includes('meenakshi');
      if (qAttr.includes('shore temple')) return aName.includes('shore temple');
      if (qAttr.includes('taj mahal')) return aName.includes('taj mahal');
      if (qAttr.includes('mysore palace')) return aName.includes('mysore palace');
      if (qAttr.includes('golden temple') || qAttr.includes('harmandir')) return aName.includes('golden temple') || aName.includes('harmandir');
      if (qAttr.includes('fort kochi') || qAttr.includes('chinese fishing')) return aName.includes('chinese fishing') || a.city.toLowerCase() === 'kochi';
      return false;
    });

    if (attrMatch?.coordinates?.latitude && attrMatch?.coordinates?.longitude) {
      return {
        targetLat: attrMatch.coordinates.latitude,
        targetLng: attrMatch.coordinates.longitude,
        resolvedName: attrMatch.name,
        resolvedCity: attrMatch.city,
        resolvedState: attrMatch.state
      };
    }
  }

  // 2. Try resolving city by name, ID, or alias
  if (city || destination) {
    const qCity = (city || destination).toLowerCase().trim();
    const cityMatch = tourismCities.find((c) => {
      const cName = c.name.toLowerCase();
      const cId = c.id.toLowerCase();
      if (cName === qCity || cId === qCity) return true;
      if (cName.includes(qCity) || qCity.includes(cName)) return true;
      if (qCity.includes('kochin') || qCity.includes('fort kochi')) return cName.includes('kochi');
      if (qCity.includes('mysore')) return cName.includes('mysuru');
      if (qCity.includes('rishikesh')) return cName.includes('rishikesh');
      return false;
    });

    if (cityMatch?.latitude && cityMatch?.longitude) {
      return {
        targetLat: cityMatch.latitude,
        targetLng: cityMatch.longitude,
        resolvedName: cityMatch.name,
        resolvedCity: cityMatch.name,
        resolvedState: cityMatch.state
      };
    }
  }

  // 3. Try resolving state
  if (state) {
    const qState = state.toLowerCase().trim();
    const stateMatch = tourismStates.find(
      (s) => s.name?.toLowerCase() === qState || s.id?.toLowerCase() === qState || s.slug?.toLowerCase() === qState
    );
    if (stateMatch) {
      // Find capital or first city in state
      const firstCity = tourismCities.find((c) => c.state?.toLowerCase() === stateMatch.name?.toLowerCase());
      if (firstCity?.latitude && firstCity?.longitude) {
        return {
          targetLat: firstCity.latitude,
          targetLng: firstCity.longitude,
          resolvedName: firstCity.name,
          resolvedCity: firstCity.name,
          resolvedState: stateMatch.name
        };
      }
    }
  }

  return { targetLat: null, targetLng: null, resolvedName, resolvedCity, resolvedState };
}

// ── 6. Parameterized Cache Layer ──
const facilitiesCache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour TTL

function getCacheKey(lat, lng, radius, type) {
  if (lat == null || lng == null) return null;
  return `emergency-facilities:${Number(lat).toFixed(4)}:${Number(lng).toFixed(4)}:${radius}:${type || 'all'}`;
}

// ── 7. Live Geospatial Facility Discovery Engine ──
const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY || 'f659b59cd8e14d1ba958a32f904fbead';

async function fetchLiveFacilities(lat, lng, radiusKm, type = null) {
  if (!lat || !lng || !GEOAPIFY_KEY) return [];
  const radiusMeters = Math.min(Math.round(radiusKm * 1000), 25000);
  const places = [];

  const queryCategories = [];
  if (!type || type === 'hospital') {
    queryCategories.push({ cat: 'healthcare.hospital', facType: 'hospital' });
  }
  if (!type || type === 'police') {
    queryCategories.push({ cat: 'service.police', facType: 'police_station' });
  }

  for (const { cat, facType } of queryCategories) {
    try {
      const url = `https://api.geoapify.com/v2/places?categories=${cat}&filter=circle:${lng},${lat},${radiusMeters}&bias=proximity:${lng},${lat}&limit=12&apiKey=${GEOAPIFY_KEY}`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(4500)
      });

      if (response.ok) {
        const data = await response.json();
        const features = data?.features || [];

        for (const feat of features) {
          const props = feat.properties;
          if (!props.lat || !props.lon) continue;

          // Strict geographic distance verification
          const dist = haversineDistance(lat, lng, props.lat, props.lon);
          if (dist == null || dist > radiusKm) continue; // STRICT RADIUS FILTERING

          let rawName = props.name || props.formatted?.split(',')[0] || '';
          if (!rawName || rawName.length < 3) {
            rawName = facType === 'police_station' ? 'Local Police Precinct' : 'Emergency Hospital';
          }
          if (facType === 'police_station') {
            const lower = rawName.toLowerCase();
            if (!lower.includes('police') && !lower.includes('thana') && !lower.includes('station') && !lower.includes('booth') && !lower.includes('chowki') && !lower.includes('outpost') && !lower.includes('ps')) {
              rawName = `${rawName} Police Station`;
            }
          }

          // Clean Tamil/regional non-ascii if available or retain readable name
          const address = props.formatted || `${rawName}, Local Precinct Area`;
          const mapsQuery = encodeURIComponent(`${rawName}, ${address}`);
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${lat},${lng}&destination=${props.lat},${props.lon}`;

          const lowerName = rawName.toLowerCase();
          const isSpecialty = facType === 'hospital' && (
            lowerName.includes('eye') ||
            lowerName.includes('dental') ||
            lowerName.includes('skin') ||
            lowerName.includes('clinic') ||
            lowerName.includes('physio') ||
            lowerName.includes('diagnostic') ||
            lowerName.includes('optical') ||
            lowerName.includes('ent ')
          );

          places.push({
            id: `live-${props.place_id || Math.random().toString(36).substr(2, 9)}`,
            name: rawName,
            facilityType: facType,
            categoryName: facType === 'police_station'
              ? 'Local Police Precinct'
              : isSpecialty
                ? 'Specialty Healthcare & Clinic'
                : 'Hospital & Trauma Care',
            address,
            latitude: props.lat,
            longitude: props.lon,
            publicPhone: props.contact?.phone || null,
            phoneType: 'facility_contact',
            phoneVerificationStatus: props.contact?.phone ? 'public_listing' : 'not_verified',
            phoneSourceUrl: null,
            officialWebsite: props.website || null,
            emergencyDepartmentAvailable: facType === 'hospital' ? !isSpecialty : null,
            operatingHours: isSpecialty ? 'Specialty Consultations' : '24 Hours (Emergency Services)',
            distanceKm: dist,
            roadTime: estimateRoadTransitTime(dist),
            mapsUrl,
            directionsUrl,
            sourceName: 'Live Geospatial Mapping (Geoapify / OpenStreetMap)',
            sourceUrl: 'https://www.openstreetmap.org/',
            verificationStatus: 'public_listing'
          });
        }
      }
    } catch (e) {
      console.warn(`[Live Facility Fetch Error] ${cat}:`, e.message);
    }
  }

  return places;
}

// ── 8. Unified Facility Resolver with Geographic Relevance Guarantee ──
async function resolveLocationFacilities({
  lat,
  lng,
  radius = 10,
  type = null,
  destination = '',
  city = '',
  state = '',
  attractionId = ''
}) {
  const { targetLat, targetLng, resolvedName, resolvedCity, resolvedState } = resolveCoordinates({
    lat,
    lng,
    destination,
    city,
    state,
    attractionId
  });

  const radiusNum = parseFloat(radius) || 10;

  if (targetLat == null || targetLng == null) {
    return {
      unresolvedLocation: true,
      destinationName: resolvedName || city || 'Unknown Location',
      message: `Unable to verify coordinates for "${resolvedName || city || 'requested location'}". Please select a verified destination.`,
      targetLat: null,
      targetLng: null,
      radius: radiusNum,
      facilities: [],
      policeStations: [],
      hospitals: []
    };
  }

  // Check in-memory cache
  const cacheKey = getCacheKey(targetLat, targetLng, radiusNum, type);
  if (cacheKey && facilitiesCache.has(cacheKey)) {
    const cached = facilitiesCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // 1. Filter verified static facilities STRICTLY within radius
  const verifiedWithinRadius = emergencyFacilities
    .map((f) => {
      const d = haversineDistance(targetLat, targetLng, f.latitude, f.longitude);
      const mapsQuery = encodeURIComponent(`${f.name}, ${f.address}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${targetLat},${targetLng}&destination=${f.latitude},${f.longitude}`;
      return {
        ...f,
        distanceKm: d,
        roadTime: estimateRoadTransitTime(d),
        mapsUrl,
        directionsUrl
      };
    })
    .filter((f) => f.distanceKm != null && f.distanceKm <= radiusNum);

  // 2. Query real-time live facilities strictly within radius
  const liveFacilities = await fetchLiveFacilities(targetLat, targetLng, radiusNum, type);

  // 3. Merge and deduplicate by proximity (< 300 meters) or normalized name
  const allCandidates = [...verifiedWithinRadius, ...liveFacilities];
  const unique = [];

  allCandidates.forEach((item) => {
    const isDup = unique.some((u) => {
      const distBetween = haversineDistance(u.latitude, u.longitude, item.latitude, item.longitude);
      if (distBetween != null && distBetween < 0.3) return true;
      if (u.name.toLowerCase() === item.name.toLowerCase() && distBetween != null && distBetween < 2.5) return true;
      return false;
    });

    const isPolice = item.facilityType === 'police_station' || item.facilityType === 'tourist_police';
    const isHospital = item.facilityType === 'hospital' || item.facilityType === 'trauma_center' || item.facilityType === 'urgent_care';

    const matchesType = !type || type === 'all' ||
      (type === 'police' && isPolice) ||
      (type === 'hospital' && isHospital) ||
      item.facilityType === type;

    if (!isDup && matchesType) {
      unique.push(item);
    }
  });

  // Sort strictly by proximity to the active origin
  unique.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));

  const policeStations = unique.filter(
    (f) => f.facilityType === 'police_station' || f.facilityType === 'tourist_police'
  );
  const hospitals = unique.filter(
    (f) => f.facilityType === 'hospital' || f.facilityType === 'trauma_center' || f.facilityType === 'urgent_care'
  );

  const outOfRadiusNotice = policeStations.length === 0 || hospitals.length === 0;

  const resultData = {
    unresolvedLocation: false,
    destinationName: resolvedName || resolvedCity,
    city: resolvedCity,
    state: resolvedState,
    targetLat,
    targetLng,
    radius: radiusNum,
    outOfRadiusNotice,
    facilities: unique,
    policeStations,
    hospitals,
    totalCount: unique.length,
    nationalHelplines: OFFICIAL_NATIONAL_HELPLINES
  };

  // Cache results
  if (cacheKey) {
    facilitiesCache.set(cacheKey, { timestamp: Date.now(), data: resultData });
  }

  return resultData;
}

// ── 9. ROUTES ──

// GET /api/safety (Backwards compatible for SafetyPanel and global checks)
router.get('/', async (req, res) => {
  try {
    const { city, state, lat, lng, radius, destination, attractionId } = req.query;
    const resolved = await resolveLocationFacilities({
      lat,
      lng,
      radius: radius || 10,
      destination,
      city,
      state,
      attractionId
    });

    res.json({
      success: true,
      destinationName: resolved.destinationName,
      city: resolved.city || city || '',
      state: resolved.state || state || '',
      coordinates: { latitude: resolved.targetLat, longitude: resolved.targetLng },
      radiusKm: resolved.radius,
      outOfRadiusNotice: resolved.outOfRadiusNotice,
      nationalHelplines: OFFICIAL_NATIONAL_HELPLINES,
      policeStations: resolved.policeStations.map((ps) => ({
        id: ps.id,
        name: ps.name,
        station_name: ps.name,
        category: ps.categoryName,
        address: ps.address,
        phone: ps.publicPhone,
        contact_number: ps.publicPhone,
        phoneVerificationStatus: ps.phoneVerificationStatus,
        phoneSourceUrl: ps.phoneSourceUrl,
        officialWebsite: ps.officialWebsite,
        latitude: ps.latitude,
        longitude: ps.longitude,
        distanceKm: ps.distanceKm,
        roadTime: ps.roadTime,
        mapsUrl: ps.mapsUrl,
        directionsUrl: ps.directionsUrl,
        sourceName: ps.sourceName,
        verificationStatus: ps.verificationStatus
      })),
      medicalPosts: resolved.hospitals.map((hp) => ({
        id: hp.id,
        name: hp.name,
        facilityType: hp.facilityType,
        category: hp.categoryName,
        address: hp.address,
        phone: hp.publicPhone,
        phoneVerificationStatus: hp.phoneVerificationStatus,
        phoneSourceUrl: hp.phoneSourceUrl,
        officialWebsite: hp.officialWebsite,
        emergencyDepartmentAvailable: hp.emergencyDepartmentAvailable,
        operatingHours: hp.operatingHours,
        latitude: hp.latitude,
        longitude: hp.longitude,
        distanceKm: hp.distanceKm,
        roadTime: hp.roadTime,
        mapsUrl: hp.mapsUrl,
        directionsUrl: hp.directionsUrl,
        sourceName: hp.sourceName,
        verificationStatus: hp.verificationStatus
      }))
    });
  } catch (err) {
    console.error('Safety endpoint error:', err);
    res.status(500).json({ error: 'Failed to retrieve safety data', details: err.message });
  }
});

// GET /api/emergency/facilities/nearby
router.get('/facilities/nearby', async (req, res) => {
  try {
    const { lat, lng, city, state, radius, type, destination, attractionId } = req.query;
    const result = await resolveLocationFacilities({
      lat,
      lng,
      city,
      state,
      radius,
      type,
      destination,
      attractionId
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to search nearby facilities', details: err.message });
  }
});

// GET /api/emergency/police/nearby
router.get('/police/nearby', async (req, res) => {
  try {
    const { lat, lng, city, state, radius, destination, attractionId } = req.query;
    const result = await resolveLocationFacilities({
      lat,
      lng,
      city,
      state,
      radius,
      type: 'police',
      destination,
      attractionId
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to search nearby police stations', details: err.message });
  }
});

// GET /api/emergency/hospitals/nearby
router.get('/hospitals/nearby', async (req, res) => {
  try {
    const { lat, lng, city, state, radius, destination, attractionId } = req.query;
    const result = await resolveLocationFacilities({
      lat,
      lng,
      city,
      state,
      radius,
      type: 'hospital',
      destination,
      attractionId
    });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to search nearby hospitals', details: err.message });
  }
});

// GET /api/emergency/contacts
router.get('/contacts', (req, res) => {
  res.json({
    success: true,
    nationalEmergencyServices: OFFICIAL_NATIONAL_HELPLINES
  });
});

// GET /api/emergency/facilities/:id
router.get('/facilities/:id', (req, res) => {
  const facility = emergencyFacilities.find((f) => f.id === req.params.id);
  if (!facility) {
    return res.status(404).json({ error: 'Facility not found' });
  }
  res.json({ success: true, facility });
});

module.exports = router;
