/**
 * restaurantService.js
 * Frontend service for real restaurant discovery, Google Places API integration,
 * must-try regional food, and Dishly AI food recommendations.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch nearby verified restaurants for a destination / attraction
 */
export async function fetchNearbyRestaurants({
  lat = null,
  lng = null,
  attraction = '',
  city = 'Jaipur',
  state = '',
  radius = 5,
  category = 'All',
  dietary = 'All',
  limit = 10
}) {
  try {
    const params = new URLSearchParams();
    if (lat != null) params.set('lat', lat);
    if (lng != null) params.set('lng', lng);
    if (attraction) params.set('attraction', attraction);
    if (city) params.set('city', city);
    if (state) params.set('state', state);
    params.set('radius', radius);
    if (category && category !== 'All') params.set('category', category);
    if (dietary && dietary !== 'All') params.set('dietary', dietary);
    params.set('limit', limit);

    const response = await fetch(`${API_BASE}/restaurants/nearby?${params.toString()}`);
    if (!response.ok) throw new Error('Restaurant API error');
    return await response.json();
  } catch (err) {
    console.warn('[restaurantService] fetchNearbyRestaurants fallback:', err.message);
    return {
      success: true,
      count: 0,
      data: [],
      isLiveApi: false,
      apiNotice: 'Connecting to restaurant network...',
      mapsSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Popular restaurants near ${attraction || city}`)}`
    };
  }
}

/**
 * Fetch authentic regional must-try food for a state/city/attraction
 */
export async function fetchMustTryFood({ state = '', city = '', attraction = '' }) {
  try {
    const params = new URLSearchParams();
    if (state) params.set('state', state);
    if (city) params.set('city', city);
    if (attraction) params.set('attraction', attraction);

    const response = await fetch(`${API_BASE}/food/must-try?${params.toString()}`);
    if (!response.ok) throw new Error('Food API error');
    return await response.json();
  } catch (err) {
    console.warn('[restaurantService] fetchMustTryFood fallback:', err.message);
    return {
      success: true,
      count: 0,
      data: []
    };
  }
}

/**
 * Send recommendation query to Dishly AI endpoint
 */
export async function fetchDishlyRecommendation({
  message = '',
  city = 'Jaipur',
  state = '',
  attraction = '',
  coordinates = null,
  radius = 5,
  dietary = 'No preference'
}) {
  try {
    const response = await fetch(`${API_BASE}/dishly/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        city,
        state,
        attraction,
        coordinates,
        radius,
        dietary
      })
    });
    if (!response.ok) throw new Error('Dishly recommendation error');
    return await response.json();
  } catch (err) {
    console.warn('[restaurantService] fetchDishlyRecommendation fallback:', err.message);
    return null;
  }
}

export default {
  fetchNearbyRestaurants,
  fetchMustTryFood,
  fetchDishlyRecommendation
};
