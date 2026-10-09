/**
 * chatEngine.js — LukAround AI Chat Service
 * Sends messages to /api/chat/message and manages conversation context
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Send a message to the LukAround AI and get a structured response
 * @param {string} message
 * @param {Array} history - [{role, content}]
 * @param {string} city - Current context city
 * @param {number} days - Current context days
 * @param {string} state - Current context state
 * @param {string} attraction - Current context attraction
 * @param {Object} coordinates - Current coordinates { latitude, longitude }
 * @param {string} dietary - User dietary preference
 * @param {number} radius - Search radius in km
 * @returns {Promise<Object>} - { type, text, data, suggestions, city, days, mustTry }
 */
export async function sendChatMessage(
  message,
  history = [],
  city = 'Jaipur',
  days = 3,
  state = '',
  attraction = '',
  coordinates = null,
  dietary = 'All',
  radius = 5
) {
  try {
    const response = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        city,
        days,
        state,
        attraction,
        coordinates,
        dietary,
        radius
      })
    });
    if (!response.ok) throw new Error('Chat API error');
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('[chatEngine] API error, using fallback:', err.message);
    return {
      success: true,
      type: 'text',
      text: getLocalFallback(message, city),
      suggestions: getDefaultSuggestions(city)
    };
  }
}

export const DINING_LOCATIONS = [
  'Jaipur', 'Goa', 'Chennai', 'Pondicherry', 'Agra', 'Bangalore',
  'Delhi', 'Kochi', 'Munnar', 'Varanasi', 'Yercaud', 'Udaipur',
  'Kolkata', 'Amritsar', 'Madurai', 'Ooty', 'Manali', 'Rishikesh',
  'Alleppey', 'Mysore', 'Pune', 'Mumbai', 'Hyderabad', 'Coorg'
];

/**
 * Fetch restaurants directly for a given city
 */
export async function fetchRestaurants(city) {
  try {
    const res = await fetch(`${API_BASE}/chat/restaurants?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('Failed to fetch restaurants');
    return await res.json();
  } catch (err) {
    console.warn('[chatEngine] Direct fetch failed:', err.message);
    return {
      success: true,
      city,
      data: null,
      suggestions: getDefaultSuggestions(city)
    };
  }
}

/**
 * Fetch suggestion chips for a city
 */
export async function fetchSuggestions(city) {
  try {
    const res = await fetch(`${API_BASE}/chat/suggestions?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    return data.suggestions || getDefaultSuggestions(city);
  } catch {
    return getDefaultSuggestions(city);
  }
}

/** Local intent-based fallback (works offline) */
function getLocalFallback(message, city) {
  const c = city || 'your destination';
  return `I'm Dishly, your personal LukAround culinary & dining concierge! Here are top-rated restaurants, iconic local foods, and must-try dining spots in ${c}.`;
}

/** Default suggestion chips */
export function getDefaultSuggestions(city) {
  const c = city || 'Jaipur';
  return [
    `🍛 Top restaurants in ${c}`,
    `🍢 Famous street food in ${c}`,
    `🥗 Pure Veg spots in ${c}`,
    `🍷 Rooftop & Fine Dining in ${c}`,
    `☕ Best breakfast in ${c}`
  ];
}

/** Word-by-word typing animation helper */
export function createTypingAnimator(text, onUpdate, onDone, speed = 24) {
  const words = text.split(' ');
  let idx = 0;
  let current = '';

  const interval = setInterval(() => {
    if (idx >= words.length) {
      clearInterval(interval);
      onDone?.(current);
      return;
    }
    current += (idx === 0 ? '' : ' ') + words[idx];
    idx++;
    onUpdate(current);
  }, speed);

  return () => clearInterval(interval); // cleanup
}

/** Storage keys for Dishly sessions and active chat */
export const CHAT_STORAGE_KEY = 'luk_chat_history';
export const DISHLY_SESSIONS_STORAGE_KEY = 'dishly_chat_sessions_v2';
export const DISHLY_ACTIVE_SESSION_KEY = 'dishly_active_session_id';

/** Load chat history from storage */
export function loadChatHistory() {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY) || sessionStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/** Save chat history to storage */
export function saveChatHistory(messages) {
  try {
    const payload = JSON.stringify(messages.slice(-30));
    localStorage.setItem(CHAT_STORAGE_KEY, payload);
    sessionStorage.setItem(CHAT_STORAGE_KEY, payload);
  } catch { /* ignore */ }
}

/** Load all saved Dishly chat sessions from localStorage */
export function loadDishlySessions() {
  try {
    const raw = localStorage.getItem(DISHLY_SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Save all Dishly chat sessions to localStorage */
export function saveDishlySessions(sessions) {
  try {
    localStorage.setItem(DISHLY_SESSIONS_STORAGE_KEY, JSON.stringify(sessions.slice(0, 30)));
  } catch { /* ignore */ }
}

/** Get currently active session ID */
export function getActiveSessionId() {
  try {
    return localStorage.getItem(DISHLY_ACTIVE_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

/** Set currently active session ID */
export function setActiveSessionId(id) {
  try {
    if (id) localStorage.setItem(DISHLY_ACTIVE_SESSION_KEY, id);
    else localStorage.removeItem(DISHLY_ACTIVE_SESSION_KEY);
  } catch { /* ignore */ }
}
