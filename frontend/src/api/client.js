const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch backend health status
 */
export async function getHealthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch health status:', error);
    return {
      status: 'offline',
      error: error.message,
      database: { connected: false, mode: 'Unavailable' }
    };
  }
}

/**
 * Register User POST /api/auth/register
 */
export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }
  return data;
}

/**
 * Login User POST /api/auth/login
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

/**
 * Google OAuth Login POST /api/auth/google
 */
export async function googleLoginUser({ email, name, avatar }) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ email, name, avatar })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Google login failed');
  }
  return data;
}

/**
 * Fetch current user profile GET /api/auth/me
 * NOTE: Throws on network errors (so verifySession keeps offline state).
 * Returns null only on explicit auth failures (401/403).
 */
export async function getCurrentUser(token) {
  const headers = { 'Accept': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Do NOT catch here — let network errors propagate to verifySession's catch block
  const response = await fetch(`${API_BASE_URL}/auth/me`, { headers });
  if (!response.ok) return null; // Explicit 401/403 → return null → logout
  return await response.json();
}

/**
 * Logout User POST /api/auth/logout
 */
export async function logoutUser() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  } catch (e) {
    // Ignore logout network errors
  }
}

/**
 * Update current user avatar POST /api/auth/update-avatar
 */
export async function updateUserAvatar(token, avatar) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/update-avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ avatar })
    });
    return await response.json();
  } catch (e) {
    return null;
  }
}

/**
 * Fetch list of cities
 */
export async function getCities() {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch cities (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch cities:', error);
    return { source: 'error', data: [], error: error.message };
  }
}

/**
 * Generate itinerary POST /api/itinerary
 */
export async function generateItinerary(city, days) {
  try {
    const response = await fetch(`${API_BASE_URL}/itinerary`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ city, days })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to generate itinerary:', error);
    throw error;
  }
}

/**
 * Fetch transport info GET /api/transport?from=X&to=Y
 */
export async function getTransportInfo(from, to, distanceKm) {
  try {
    const query = new URLSearchParams({ from, to, ...(distanceKm ? { distanceKm } : {}) });
    const response = await fetch(`${API_BASE_URL}/transport?${query.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Transport query failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch transport info:', error);
    return null;
  }
}

/**
 * Fetch hotel listings GET /api/hotels
 * Supports either legacy getHotels(city, tier) or options object getHotels({ city, state, stars, ... })
 */
export async function getHotels(arg1, arg2 = 'all') {
  try {
    let params = {};
    if (typeof arg1 === 'string') {
      params = { city: arg1, ...(arg2 && arg2 !== 'all' ? { tier: arg2 } : {}) };
    } else if (typeof arg1 === 'object' && arg1 !== null) {
      params = { ...arg1 };
    }

    const cleanParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        cleanParams.append(k, v);
      }
    });

    const response = await fetch(`${API_BASE_URL}/hotels?${cleanParams.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Hotels query failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch hotels:', error);
    return { data: [], hotels: [], source: 'error', error: error.message };
  }
}

/**
 * Fetch nearby verified hotels for attraction or coordinates GET /api/hotels/nearby
 */
export async function getNearbyHotels({ destinationId, latitude, longitude, radius = 20, stars, limit = 20, sortBy = 'recommended' } = {}) {
  try {
    const params = new URLSearchParams();
    if (destinationId) params.append('destinationId', destinationId);
    if (latitude != null) params.append('latitude', latitude);
    if (longitude != null) params.append('longitude', longitude);
    if (radius) params.append('radius', radius);
    if (stars) params.append('stars', stars);
    if (limit) params.append('limit', limit);
    if (sortBy) params.append('sortBy', sortBy);

    const response = await fetch(`${API_BASE_URL}/hotels/nearby?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Nearby hotels failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch nearby hotels:', error);
    return { hotels: [], count: 0, error: error.message };
  }
}

/**
 * Fetch single hotel details by slug or ID GET /api/hotels/:idOrSlug
 */
export async function getHotelBySlug(slugOrId) {
  try {
    const response = await fetch(`${API_BASE_URL}/hotels/${encodeURIComponent(slugOrId)}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Hotel lookup failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch hotel details:', error);
    return null;
  }
}

/**
 * Fetch navigation directions for hotel GET /api/hotels/:id/directions
 */
export async function getHotelDirections(hotelId, originCoords = null) {
  try {
    const params = new URLSearchParams();
    if (originCoords && originCoords.latitude && originCoords.longitude) {
      params.append('originLat', originCoords.latitude);
      params.append('originLng', originCoords.longitude);
    }
    const response = await fetch(`${API_BASE_URL}/hotels/${encodeURIComponent(hotelId)}/directions?${params.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Directions query failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch hotel directions:', error);
    return null;
  }
}


/**
 * Fetch nearby places based on coordinates GET /api/destinations/nearby?lat=...&lng=...&radius=...
 */
export async function getNearbyPlaces(lat, lng, radius = 35) {
  try {
    const query = new URLSearchParams({ lat, lng, radius });
    const response = await fetch(`${API_BASE_URL}/destinations/nearby?${query.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Nearby places query failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch nearby places:', error);
    return null;
  }
}

/**
 * Fetch safety info & police stations GET /api/safety?city=X
 */
export async function getSafetyInfo(city) {
  try {
    const query = new URLSearchParams({ city });
    const response = await fetch(`${API_BASE_URL}/safety?${query.toString()}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Safety info query failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch safety info:', error);
    return null;
  }
}

/**
 * Fetch Public Settings (Broadcast Banner & Feature Flags)
 */
export async function getPublicSettings() {
  try {
    const response = await fetch(`${API_BASE_URL}/public/settings`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) return { broadcast: { active: false }, featureFlags: {} };
    return await response.json();
  } catch (error) {
    return { broadcast: { active: false }, featureFlags: {} };
  }
}

/**
 * Fetch Admin Overview Stats GET /api/admin/stats
 */
export async function getAdminStats(token) {
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch admin stats');
  }
  return await response.json();
}

/**
 * Fetch All Users for Admin Panel GET /api/admin/users
 */
export async function fetchAdminUsers(token, params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`${API_BASE_URL}/admin/users?${query.toString()}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch users');
  }
  return await response.json();
}

/**
 * Super Admin Invites / Promotes Admin by Email POST /api/admin/invite-admin
 */
export async function inviteAdminByEmail(token, { email, name }) {
  const response = await fetch(`${API_BASE_URL}/admin/invite-admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ email, name })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add admin');
  }
  return data;
}

/**
 * Super Admin updates user role PATCH /api/admin/users/:id/role
 */
export async function updateUserRole(token, userId, role) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user role');
  }
  return data;
}

/**
 * Admin updates user status (active | suspended | banned) PATCH /api/admin/users/:id/status
 */
export async function updateUserStatus(token, userId, status) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user status');
  }
  return data;
}

/**
 * Super Admin deletes user DELETE /api/admin/users/:id
 */
export async function deleteUserAccount(token, userId) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete user');
  }
  return data;
}

/**
 * Get Real-time Live Visitors GET /api/admin/live-traffic
 */
export async function getLiveTraffic(token) {
  const response = await fetch(`${API_BASE_URL}/admin/live-traffic`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch live traffic');
  }
  return await response.json();
}

/**
 * Get Admin Settings & Audit Logs GET /api/admin/settings
 */
export async function getAdminSettings(token) {
  const response = await fetch(`${API_BASE_URL}/admin/settings`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch settings');
  }
  return await response.json();
}

/**
 * Publish / Remove Global Broadcast Banner POST /api/admin/broadcast
 */
export async function updateBroadcastBanner(token, { active, message, severity }) {
  const response = await fetch(`${API_BASE_URL}/admin/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ active, message, severity })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update broadcast banner');
  }
  return data;
}

/**
 * Super Admin Toggles Feature Flag POST /api/admin/features
 */
export async function toggleFeatureFlag(token, featureKey, enabled) {
  const response = await fetch(`${API_BASE_URL}/admin/features`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ featureKey, enabled })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'Failed to toggle feature');
  }
  return data;
}

/**
 * Maintenance API: Prune Stale Guest Sessions POST /api/admin/maintenance/prune-sessions
 */
export async function pruneVisitorSessions(token) {
  const response = await fetch(`${API_BASE_URL}/admin/maintenance/prune-sessions`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Failed to prune sessions');
  return data;
}

/**
 * Maintenance API: Re-sync User Database Integrity POST /api/admin/maintenance/resync-db
 */
export async function resyncUserDatabase(token) {
  const response = await fetch(`${API_BASE_URL}/admin/maintenance/resync-db`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Failed to re-sync database');
  return data;
}

/**
 * Maintenance API: Reset User Profile & Cache POST /api/admin/maintenance/reset-user/:id
 */
export async function resetUserProfile(token, userId) {
  const response = await fetch(`${API_BASE_URL}/admin/maintenance/reset-user/${userId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Failed to reset user profile');
  return data;
}

/**
 * Maintenance API: Bulk Status Moderation POST /api/admin/maintenance/bulk-status
 */
export async function bulkUpdateUserStatus(token, { userIds, status }) {
  const response = await fetch(`${API_BASE_URL}/admin/maintenance/bulk-status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userIds, status })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Failed to bulk update status');
  return data;
}

// ─────────────────────────────────────────────────────────────
// Destinations API — real-time tourist place data
// ─────────────────────────────────────────────────────────────

/**
 * GET /api/destinations/featured
 * Returns the curated list of top Indian destinations.
 */
export async function getFeaturedDestinations() {
  const response = await fetch(`${API_BASE_URL}/destinations/featured`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Failed to fetch featured destinations');
  return data;
}

/**
 * GET /api/destinations/search?q=<query>
 * Searches for tourist places within India.
 */
export async function searchDestinations(query, limit = 12) {
  if (!query?.trim()) return { success: true, data: [], count: 0 };
  const response = await fetch(`${API_BASE_URL}/destinations/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Search failed');
  return data;
}

/**
 * GET /api/destinations/place/:xid
 * Fetches detailed data for a specific place by OpenTripMap XID.
 */
export async function getPlaceDetails(xid) {
  const response = await fetch(`${API_BASE_URL}/destinations/place/${encodeURIComponent(xid)}`, {
    headers: { 'Accept': 'application/json' }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Failed to fetch place details');
  return data;
}

/**
 * POST /api/destinations/describe
 * Generates an AI description for a tourist place via Groq.
 */
export async function generatePlaceDescription({ name, state, highlights = [] }) {
  const response = await fetch(`${API_BASE_URL}/destinations/describe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ name, state, highlights })
  });
  const data = await response.json().catch(() => ({}));
  return data; // Non-critical; caller handles null description gracefully
}
