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
 * @returns {Promise<Object>} - { type, text, data, suggestions, city, days }
 */
export async function sendChatMessage(message, history = [], city = 'Jaipur', days = 3) {
  try {
    const response = await fetch(`${API_BASE}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, city, days })
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
  const lower = message.toLowerCase();
  if (/hotel|stay|accommodation/.test(lower)) {
    return `Looking for stays in ${city}! Head to the Hotels page for curated options with real pricing.`;
  }
  if (/safe|safety|crime/.test(lower)) {
    return `${city} is generally safe for tourists. Keep emergency number 112 handy. Check Safety page for details.`;
  }
  if (/budget|cost|price|rupee/.test(lower)) {
    return `${city} travel budgets range from ₹1,800–₹5,000/day depending on your style. The Budget page has full breakdowns.`;
  }
  if (/plan|trip|itinerary/.test(lower)) {
    return `I'll plan your perfect ${city} trip! Use the Itinerary page for a full day-by-day plan with maps.`;
  }
  return `I'm your India travel expert! Ask me to plan a trip, find hotels, check safety, or explore attractions in ${city}.`;
}

/** Default suggestion chips */
export function getDefaultSuggestions(city) {
  if (city) {
    return [
      `🗓️ Plan 3 days in ${city}`,
      `🏨 Hotels in ${city}`,
      `🛡️ Is ${city} safe?`,
      `💰 Budget for ${city}`,
      `📍 Top places in ${city}`
    ];
  }
  return [
    '🏰 Heritage trip ideas',
    '🌴 Best beach destinations',
    '🛕 Spiritual journeys',
    '🍃 Nature & hill stations',
    '🌆 City exploration picks'
  ];
}

/** Word-by-word typing animation helper */
export function createTypingAnimator(text, onUpdate, onDone, speed = 28) {
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

/** Session storage key for chat history */
export const CHAT_STORAGE_KEY = 'luk_chat_history';

/** Load chat history from session storage */
export function loadChatHistory() {
  try {
    const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/** Save chat history to session storage */
export function saveChatHistory(messages) {
  try {
    // Only save last 20 messages to keep storage lean
    sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  } catch { /* ignore */ }
}
