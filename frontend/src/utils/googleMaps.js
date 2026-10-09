/**
 * Google Maps Integration & Navigation Utilities
 * Centralized service for URL generation, place resolution, and routing
 * Complies with official Google Maps URL schemes (api=1)
 */

import { calculateDistance, estimateTravelTime } from './distance';

/**
 * Priority transport hubs in India for "Where are you starting from?" origin selection
 */
export const MAJOR_AIRPORTS = [
  { id: 'del-airport', name: 'Indira Gandhi International Airport (DEL)', city: 'Delhi', state: 'Delhi NCR', latitude: 28.5562, longitude: 77.1000 },
  { id: 'bom-airport', name: 'Chhatrapati Shivaji Maharaj International Airport (BOM)', city: 'Mumbai', state: 'Maharashtra', latitude: 19.0896, longitude: 72.8656 },
  { id: 'blr-airport', name: 'Kempegowda International Airport (BLR)', city: 'Bengaluru', state: 'Karnataka', latitude: 13.1986, longitude: 77.7066 },
  { id: 'maa-airport', name: 'Chennai International Airport (MAA)', city: 'Chennai', state: 'Tamil Nadu', latitude: 12.9941, longitude: 80.1709 },
  { id: 'ccu-airport', name: 'Netaji Subhash Chandra Bose International Airport (CCU)', city: 'Kolkata', state: 'West Bengal', latitude: 22.6547, longitude: 88.4467 },
  { id: 'hyd-airport', name: 'Rajiv Gandhi International Airport (HYD)', city: 'Hyderabad', state: 'Telangana', latitude: 17.2403, longitude: 78.4294 },
  { id: 'cok-airport', name: 'Cochin International Airport (COK)', city: 'Kochi', state: 'Kerala', latitude: 10.1518, longitude: 76.4019 },
  { id: 'amd-airport', name: 'Sardar Vallabhbhai Patel International Airport (AMD)', city: 'Ahmedabad', state: 'Gujarat', latitude: 23.0734, longitude: 72.6347 },
  { id: 'jai-airport', name: 'Jaipur International Airport (JAI)', city: 'Jaipur', state: 'Rajasthan', latitude: 26.8289, longitude: 75.8056 },
  { id: 'vns-airport', name: 'Lal Bahadur Shastri Airport (VNS)', city: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.4524, longitude: 82.8593 },
  { id: 'lko-airport', name: 'Chaudhary Charan Singh International Airport (LKO)', city: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.7606, longitude: 80.8893 },
  { id: 'ixc-airport', name: 'Shaheed Bhagat Singh International Airport (IXC)', city: 'Chandigarh / Mohali', state: 'Punjab', latitude: 30.6735, longitude: 76.7885 },
  { id: 'bbi-airport', name: 'Biju Patnaik International Airport (BBI)', city: 'Bhubaneswar', state: 'Odisha', latitude: 20.2444, longitude: 85.8178 },
  { id: 'pat-airport', name: 'Jay Prakash Narayan Airport (PAT)', city: 'Patna', state: 'Bihar', latitude: 25.5913, longitude: 85.0880 },
  { id: 'dhn-airport', name: 'Jolly Grant Airport (DED)', city: 'Dehradun', state: 'Uttarakhand', latitude: 30.1897, longitude: 74.1800 }
];

export const MAJOR_RAILWAY_STATIONS = [
  { id: 'ndls-railway', name: 'New Delhi Railway Station (NDLS)', city: 'New Delhi', state: 'Delhi NCR', latitude: 28.6430, longitude: 77.2195 },
  { id: 'csmt-railway', name: 'Chhatrapati Shivaji Maharaj Terminus (CSMT)', city: 'Mumbai', state: 'Maharashtra', latitude: 18.9401, longitude: 72.8354 },
  { id: 'mas-railway', name: 'Chennai Central Railway Station (MAS)', city: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2755 },
  { id: 'hwh-railway', name: 'Howrah Junction Railway Station (HWH)', city: 'Kolkata', state: 'West Bengal', latitude: 22.5839, longitude: 88.3426 },
  { id: 'sbc-railway', name: 'KSR Bengaluru City Junction (SBC)', city: 'Bengaluru', state: 'Karnataka', latitude: 12.9784, longitude: 77.5694 },
  { id: 'jp-railway', name: 'Jaipur Junction (JP)', city: 'Jaipur', state: 'Rajasthan', latitude: 26.9200, longitude: 75.7878 },
  { id: 'bsb-railway', name: 'Varanasi Junction (BSB)', city: 'Varanasi', state: 'Uttar Pradesh', latitude: 25.3276, longitude: 82.9863 },
  { id: 'agc-railway', name: 'Agra Cantt Railway Station (AGC)', city: 'Agra', state: 'Uttar Pradesh', latitude: 27.1583, longitude: 78.0089 },
  { id: 'lko-railway', name: 'Lucknow Charbagh Railway Station (LKO)', city: 'Lucknow', state: 'Uttar Pradesh', latitude: 26.8318, longitude: 80.9238 },
  { id: 'mdu-railway', name: 'Madurai Junction (MDU)', city: 'Madurai', state: 'Tamil Nadu', latitude: 9.9178, longitude: 78.1105 },
  { id: 'ers-railway', name: 'Ernakulam Junction (ERS)', city: 'Kochi', state: 'Kerala', latitude: 9.9678, longitude: 76.2894 },
  { id: 'sec-railway', name: 'Secunderabad Junction (SC)', city: 'Hyderabad', state: 'Telangana', latitude: 17.4344, longitude: 78.5013 },
  { id: 'asr-railway', name: 'Amritsar Junction (ASR)', city: 'Amritsar', state: 'Punjab', latitude: 31.6340, longitude: 74.8723 },
  { id: 'bbs-railway', name: 'Bhubaneswar Railway Station (BBS)', city: 'Bhubaneswar', state: 'Odisha', latitude: 20.2648, longitude: 85.8406 },
  { id: 'pnbe-railway', name: 'Patna Junction (PNBE)', city: 'Patna', state: 'Bihar', latitude: 25.6025, longitude: 85.1376 },
  { id: 'hw-railway', name: 'Haridwar Junction (HW)', city: 'Haridwar', state: 'Uttarakhand', latitude: 29.9457, longitude: 78.1517 }
];

/**
 * State center geographic coordinates for accurate state-level map centering
 */
export const STATE_CENTERS = {
  'uttar-pradesh': { latitude: 26.8467, longitude: 80.9462, zoom: 6.8 },
  'tamil-nadu': { latitude: 11.1271, longitude: 78.6569, zoom: 7.2 },
  'karnataka': { latitude: 15.3173, longitude: 75.7139, zoom: 7.0 },
  'andhra-pradesh': { latitude: 15.9129, longitude: 79.7400, zoom: 7.0 },
  'rajasthan': { latitude: 27.0238, longitude: 74.2179, zoom: 6.8 },
  'maharashtra': { latitude: 19.7515, longitude: 75.7139, zoom: 6.9 },
  'west-bengal': { latitude: 22.9868, longitude: 87.8550, zoom: 7.1 },
  'gujarat': { latitude: 22.2587, longitude: 71.1924, zoom: 7.0 },
  'madhya-pradesh': { latitude: 22.9734, longitude: 78.6569, zoom: 6.8 },
  'telangana': { latitude: 18.1124, longitude: 79.0193, zoom: 7.4 },
  'kerala': { latitude: 10.8505, longitude: 76.2711, zoom: 7.4 },
  'bihar': { latitude: 25.0961, longitude: 85.3131, zoom: 7.3 },
  'odisha': { latitude: 20.9517, longitude: 85.0985, zoom: 7.2 },
  'punjab': { latitude: 31.1471, longitude: 75.3412, zoom: 7.6 },
  'uttarakhand': { latitude: 30.0668, longitude: 79.0193, zoom: 7.4 }
};

export const INDIA_CENTER = { latitude: 21.7679, longitude: 78.8718, zoom: 4.8 };

/**
 * Resolves any place object (State, City, Attraction, Hotel, or Station)
 * Priority resolution order:
 * 1. Verified Google Place ID
 * 2. Verified latitude & longitude
 * 3. Verified full address
 * 4. Place name, city, state, and "India" as search fallback
 */
export function resolvePlaceLocation(place) {
  if (!place) return null;
  if (place._isResolved) return place;

  const id = place.id || place.slug || '';
  const name = place.name || place.title || '';
  const city = place.city || '';
  const state = place.state || '';
  const country = place.country || 'India';
  const address = place.address || null;
  const googlePlaceId = place.googlePlaceId || place.placeId || null;

  // Extract coordinates from either top-level or coordinates object
  let latitude = null;
  let longitude = null;

  if (typeof place.latitude === 'number' && typeof place.longitude === 'number') {
    latitude = place.latitude;
    longitude = place.longitude;
  } else if (place.coordinates && typeof place.coordinates.latitude === 'number' && typeof place.coordinates.longitude === 'number') {
    latitude = place.coordinates.latitude;
    longitude = place.coordinates.longitude;
  }

  const hasCoords = latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude);

  // Construct location query string
  const locationQueryParts = [name];
  if (address && address !== name) locationQueryParts.push(address);
  else {
    if (city && city !== name) locationQueryParts.push(city);
    if (state && state !== name) locationQueryParts.push(state);
    locationQueryParts.push(country);
  }
  const searchQuery = locationQueryParts.filter(Boolean).join(', ');
  const locationVerified = hasCoords || !!googlePlaceId;

  // Construct Google Maps search URL directly without recursion
  const searchParams = new URLSearchParams();
  searchParams.set('api', '1');
  if (googlePlaceId) {
    searchParams.set('query', name || searchQuery);
    searchParams.set('query_place_id', googlePlaceId);
  } else if (hasCoords) {
    searchParams.set('query', `${name} ${latitude},${longitude}`);
  } else if (address) {
    searchParams.set('query', `${name}, ${address}`);
  } else {
    searchParams.set('query', searchQuery);
  }
  const mapsSearchUrl = `https://www.google.com/maps/search/?${searchParams.toString()}`;

  // Construct direct directions URL without recursion
  const dirParams = new URLSearchParams();
  dirParams.set('api', '1');
  if (hasCoords) {
    dirParams.set('destination', `${latitude},${longitude}`);
  } else if (address) {
    dirParams.set('destination', `${name}, ${address}`);
  } else {
    dirParams.set('destination', searchQuery);
  }
  if (googlePlaceId) {
    dirParams.set('destination_place_id', googlePlaceId);
  }
  dirParams.set('travelmode', 'driving');
  const directionsUrl = `https://www.google.com/maps/dir/?${dirParams.toString()}`;

  return {
    _isResolved: true,
    id,
    name,
    city,
    state,
    country,
    address,
    latitude,
    longitude,
    hasCoordinates: hasCoords,
    googlePlaceId,
    searchQuery,
    locationVerified,
    locationSource: hasCoords ? 'geographical_coordinates' : 'place_query',
    mapsSearchUrl,
    directionsUrl
  };
}

/**
 * Builds official Google Maps Search URL
 * Format: https://www.google.com/maps/search/?api=1&query=ENCODED_LOCATION
 * Includes query_place_id where available
 */
export function buildGoogleMapsSearchUrl(place) {
  if (!place) return 'https://www.google.com/maps/search/?api=1&query=India';
  if (typeof place === 'string') {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
  }
  if (place._isResolved && place.mapsSearchUrl) {
    return place.mapsSearchUrl;
  }
  const resolved = resolvePlaceLocation(place);
  return resolved ? resolved.mapsSearchUrl : 'https://www.google.com/maps/search/?api=1&query=India';
}

/**
 * Builds official Google Maps Directions URL
 * Format: https://www.google.com/maps/dir/?api=1&destination=ENCODED_DESTINATION
 * Flexible signature:
 * - buildGoogleMapsDirectionsUrl(destination)
 * - buildGoogleMapsDirectionsUrl(destination, origin)
 * - buildGoogleMapsDirectionsUrl(destination, origin, travelMode)
 */
export function buildGoogleMapsDirectionsUrl(destOrOrigin, originOrDest = null, travelMode = 'driving') {
  let destination = destOrOrigin;
  let origin = originOrDest;
  let mode = travelMode;

  // Handle travelMode passed as second argument: buildGoogleMapsDirectionsUrl(dest, 'transit')
  if (typeof originOrDest === 'string' && ['driving', 'walking', 'transit', 'bicycling'].includes(originOrDest.toLowerCase())) {
    mode = originOrDest;
    origin = null;
  }

  if (!destination) return 'https://www.google.com/maps/dir/?api=1';

  const destResolved = resolvePlaceLocation(destination);
  const params = new URLSearchParams();
  params.set('api', '1');

  // Destination formatting
  if (destResolved) {
    if (destResolved.hasCoordinates) {
      params.set('destination', `${destResolved.latitude},${destResolved.longitude}`);
    } else if (destResolved.address) {
      params.set('destination', `${destResolved.name}, ${destResolved.address}`);
    } else {
      params.set('destination', destResolved.searchQuery);
    }

    if (destResolved.googlePlaceId) {
      params.set('destination_place_id', destResolved.googlePlaceId);
    }
  } else if (typeof destination === 'string') {
    params.set('destination', destination);
  }

  // Origin formatting (optional)
  if (origin) {
    if (typeof origin === 'string' && origin.trim()) {
      params.set('origin', origin.trim());
    } else {
      const origResolved = resolvePlaceLocation(origin);
      if (origResolved) {
        if (origResolved.hasCoordinates) {
          params.set('origin', `${origResolved.latitude},${origResolved.longitude}`);
        } else if (origResolved.address) {
          params.set('origin', `${origResolved.name}, ${origResolved.address}`);
        } else {
          params.set('origin', origResolved.searchQuery);
        }

        if (origResolved.googlePlaceId) {
          params.set('origin_place_id', origResolved.googlePlaceId);
        }
      }
    }
  }

  // Travel Mode
  const validModes = ['driving', 'walking', 'transit', 'bicycling'];
  const normalizedMode = (mode || 'driving').toLowerCase();
  params.set('travelmode', validModes.includes(normalizedMode) ? normalizedMode : 'driving');

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/**
 * Retrieves verified hotels nearby a destination object or coordinates
 */
export function getNearbyHotels(destination, allHotels = [], radiusKm = 30) {
  if (!destination || !Array.isArray(allHotels)) return [];

  const resolved = resolvePlaceLocation(destination);
  if (!resolved || !resolved.hasCoordinates) {
    // If no coordinates, filter by city or state
    return allHotels.filter(h =>
      (destination.city && h.city && h.city.toLowerCase() === destination.city.toLowerCase()) ||
      (destination.state && h.state && h.state.toLowerCase() === destination.state.toLowerCase())
    ).slice(0, 8);
  }

  const enriched = allHotels
    .map(hotel => {
      const hotelLat = hotel.latitude;
      const hotelLng = hotel.longitude;
      if (hotelLat == null || hotelLng == null) return null;

      const dist = calculateDistance(resolved.latitude, resolved.longitude, hotelLat, hotelLng);
      return {
        ...hotel,
        distanceInKm: dist,
        distanceFromDestination: `${dist} km from ${resolved.name}`,
        estimatedTravelTime: estimateTravelTime(dist)
      };
    })
    .filter(Boolean);

  let filtered = enriched.filter(h => h.distanceInKm <= radiusKm);
  if (filtered.length === 0) {
    // Return closest verified hotels if destination is secluded
    filtered = [...enriched].sort((a, b) => a.distanceInKm - b.distanceInKm).slice(0, 6);
  } else {
    filtered.sort((a, b) => a.distanceInKm - b.distanceInKm);
  }

  return filtered;
}

/**
 * Returns canonical destination map URL
 */
export function getDestinationMapUrl(destination) {
  return buildGoogleMapsSearchUrl(destination);
}

export const getGoogleMapsSearchUrl = buildGoogleMapsSearchUrl;
export const getGoogleMapsDirectionsUrl = buildGoogleMapsDirectionsUrl;

