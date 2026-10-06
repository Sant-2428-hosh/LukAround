const express = require('express');
const router = express.Router();

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const API_BASE = `http://localhost:${process.env.PORT || 5000}/api`;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Safe internal API fetch */
async function internalFetch(url) {
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/** Known Indian cities for quick matching */
const INDIAN_CITIES = [
  'Jaipur', 'Varanasi', 'Munnar', 'Goa', 'Agra', 'Delhi', 'Chennai',
  'Bangalore', 'Pondicherry', 'Kochi', 'Yercaud', 'Mumbai', 'Kolkata',
  'Hyderabad', 'Pune', 'Rishikesh', 'Hampi', 'Mysore', 'Ooty', 'Darjeeling',
  'Shimla', 'Manali', 'Coorg', 'Alleppey', 'Trivandrum', 'Udaipur',
  'Jodhpur', 'Jaisalmer', 'Pushkar', 'Amritsar', 'Chandigarh', 'Leh',
  'Srinagar', 'Gangtok', 'Shillong', 'Guwahati', 'Bhubaneswar', 'Puri',
  'Tirupati', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Kovalam', 'Varkala'
];

/** Parse city name from user message */
function extractCity(message) {
  const lower = message.toLowerCase();
  for (const city of INDIAN_CITIES) {
    if (lower.includes(city.toLowerCase())) return city;
  }
  // Pattern: "in <City>" or "to <City>" or "visit <City>"
  const patterns = [
    /(?:in|to|visit|explore|trip to|travel to|going to|planning for)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/,
    /([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\s+(?:trip|tour|itinerary|plan)/,
  ];
  for (const pat of patterns) {
    const m = message.match(pat);
    if (m) return m[1];
  }
  return null;
}

/** Parse number of days from message */
function extractDays(message) {
  const patterns = [
    /(\d+)\s*(?:day|days|night|nights)/i,
    /(?:for|about|around)\s+(\d+)/i,
  ];
  for (const p of patterns) {
    const m = message.match(p);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n >= 1 && n <= 14) return n;
    }
  }
  return 3; // default
}

/** Intent detection */
function detectIntent(message, history = []) {
  const lower = message.toLowerCase();
  const recent = history.slice(-4).map(h => (h.content || '').toLowerCase()).join(' ');

  if (/\b(itinerary|plan|schedule|day|trip|visit|explore|go to|travel|tour|journey)\b/.test(lower)) return 'itinerary';
  if (/\b(hotel|stay|accommodation|room|resort|hostel|lodge|book|booking|where to stay)\b/.test(lower)) return 'hotels';
  if (/\b(safe|safety|crime|emergency|police|medical|helpline|sos|danger|secure)\b/.test(lower)) return 'safety';
  if (/\b(places|attraction|sights|things to do|what to see|landmarks|famous|popular|near)\b/.test(lower)) return 'explore';
  if (/\b(budget|cost|price|expense|money|rupee|₹|cheap|affordable|expensive)\b/.test(lower)) return 'budget';
  if (/\b(weather|season|when to visit|best time|monsoon|summer|winter)\b/.test(lower)) return 'season';

  // Context from history
  if (/\b(hotel|stay|accommodation)\b/.test(recent) && /\b(show|more|also|what about|and)\b/.test(lower)) return 'hotels';
  if (/\b(itinerary|plan|trip)\b/.test(recent) && /\b(show|more|also|and|next|what)\b/.test(lower)) return 'itinerary';

  return 'general';
}

/** Use Groq to generate a conversational response for general queries */
async function groqGeneralResponse(message, city, history = []) {
  if (!GROQ_KEY) return null;

  const historyContext = history.slice(-6).map(h =>
    `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`
  ).join('\n');

  const prompt = `You are LukAround AI, a friendly and knowledgeable Indian travel guide assistant. You help travelers plan amazing trips across India.

${historyContext ? `Recent conversation:\n${historyContext}\n\n` : ''}Current city context: ${city || 'India in general'}

User: ${message}

Respond in 2-3 sentences maximum. Be warm, helpful, and specific to India travel. No markdown symbols. If the user asks to plan a trip, suggest they type the city name and number of days.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

/** Context-aware suggestion chips */
function getSuggestions(intent, city, days) {
  if (city) {
    return [
      `Hotels in ${city}`,
      `Safety info for ${city}`,
      `Things to do in ${city}`,
      `Budget for ${city} in ${days} days`,
      `Best season to visit ${city}`
    ];
  }
  return [
    '🏰 Plan a heritage trip',
    '🌴 Best beach destinations',
    '🛕 Spiritual journey ideas',
    '🍃 Nature & hill stations',
    '🌆 City exploration picks'
  ];
}

// ── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/chat/message
 * Main AI conversation endpoint — parses intent and orchestrates existing APIs
 */
router.post('/message', async (req, res) => {
  try {
    const { message = '', history = [], city: contextCity, days: contextDays } = req.body;

    if (!message.trim()) {
      return res.json({
        success: true,
        type: 'text',
        text: 'Hi! Ask me anything about traveling in India. Try: "Plan 3 days in Jaipur" or "Hotels in Goa"',
        suggestions: getSuggestions('general', null, 3)
      });
    }

    // Extract parameters from message or use context
    const city = extractCity(message) || contextCity || 'Jaipur';
    const days = extractDays(message) || contextDays || 3;
    const intent = detectIntent(message, history);

    let responseData = { type: 'text', text: '', data: null, city, days };

    // ── Intent: Itinerary ──
    if (intent === 'itinerary') {
      const result = await internalFetch(`${API_BASE}/itinerary?city=${encodeURIComponent(city)}&days=${days}`);
      if (result && (result.success || result.itinerary)) {
        responseData = {
          type: 'itinerary',
          text: `Here's your ${days}-day ${city} itinerary! Each day is packed with the best experiences.`,
          data: result.itinerary || result.data || result,
          city,
          days
        };
      } else {
        // Try POST
        try {
          const postRes = await fetch(`${API_BASE}/itinerary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city, days })
          });
          const postData = await postRes.json();
          if (postData && (postData.success || postData.itinerary)) {
            responseData = {
              type: 'itinerary',
              text: `Here's your ${days}-day ${city} itinerary!`,
              data: postData.itinerary || postData.data || postData,
              city,
              days
            };
          }
        } catch { /* fall through */ }
      }
      if (responseData.type === 'text') {
        responseData.text = `I'm preparing your ${days}-day ${city} trip plan. Use the Itinerary page for the full experience!`;
      }
    }

    // ── Intent: Hotels ──
    else if (intent === 'hotels') {
      const result = await internalFetch(`${API_BASE}/hotels?city=${encodeURIComponent(city)}&tier=all`);
      if (result && (result.success || result.data || result.hotels)) {
        const hotels = Array.isArray(result.data) ? result.data
          : (result.data?.hotels || result.hotels || []);
        responseData = {
          type: 'hotels',
          text: `Found ${hotels.length} great places to stay in ${city}!`,
          data: hotels.slice(0, 4),
          city,
          days
        };
      } else {
        responseData.text = `Let me find the best stays in ${city} for you. Check the Hotels page for full listings!`;
      }
    }

    // ── Intent: Safety ──
    else if (intent === 'safety') {
      const result = await internalFetch(`${API_BASE}/safety?city=${encodeURIComponent(city)}`);
      if (result && (result.success || result.data)) {
        responseData = {
          type: 'safety',
          text: `Here's the safety overview for ${city}. Stay informed and travel confidently!`,
          data: result.data || result,
          city,
          days
        };
      } else {
        responseData.text = `${city} is generally safe for tourists. Always keep emergency number 112 handy, and use the Safety page for city-specific helplines!`;
      }
    }

    // ── Intent: Explore ──
    else if (intent === 'explore') {
      const result = await internalFetch(`${API_BASE}/destinations/search?q=${encodeURIComponent(city)}&limit=4`);
      if (result && result.data && result.data.length > 0) {
        responseData = {
          type: 'explore',
          text: `Discover the top attractions in ${city}!`,
          data: result.data.slice(0, 4),
          city,
          days
        };
      } else {
        responseData.text = `${city} has so much to offer! Check the Destinations page to explore all attractions.`;
      }
    }

    // ── Intent: Budget ──
    else if (intent === 'budget') {
      const budgetMap = {
        'Goa': { min: 2400, max: 5500, avg: 3500 },
        'Jaipur': { min: 2200, max: 4800, avg: 3200 },
        'Varanasi': { min: 1400, max: 3200, avg: 2100 },
        'Munnar': { min: 1900, max: 4200, avg: 2800 },
        'Agra': { min: 1800, max: 4000, avg: 2900 },
        'Delhi': { min: 2100, max: 4600, avg: 3100 },
        'Chennai': { min: 1700, max: 3800, avg: 2600 },
      };
      const budget = budgetMap[city] || { min: 1800, max: 4500, avg: 2700 };
      const total = { min: budget.min * days, max: budget.max * days, avg: budget.avg * days };
      responseData = {
        type: 'budget',
        text: `Here's the budget estimate for ${days} days in ${city}:`,
        data: { city, days, perDay: budget, total },
        city,
        days
      };
    }

    // ── Intent: Season ──
    else if (intent === 'season') {
      const seasonMap = {
        'Goa': { best: 'Nov – Feb', avoid: 'Jun – Sep (monsoon)', temp: '20–32°C' },
        'Jaipur': { best: 'Oct – Mar', avoid: 'May – Jul (extreme heat)', temp: '10–30°C' },
        'Munnar': { best: 'Sep – May', avoid: 'Nov – Jan (heavy fog)', temp: '5–25°C' },
        'Varanasi': { best: 'Oct – Mar', avoid: 'Apr – Jun (hot)', temp: '10–28°C' },
        'Delhi': { best: 'Oct – Mar', avoid: 'May – Jul (very hot)', temp: '8–30°C' },
      };
      const season = seasonMap[city] || { best: 'Oct – Mar', avoid: 'Jun – Aug (monsoon)', temp: '15–35°C' };
      responseData = {
        type: 'season',
        text: `Best time to visit ${city}: ${season.best}`,
        data: { city, ...season },
        city,
        days
      };
    }

    // ── General: Groq or fallback ──
    else {
      const groqText = await groqGeneralResponse(message, city, history);
      responseData.text = groqText || `Great question about ${city}! I can help you plan trips, find hotels, check safety, explore attractions, and estimate budgets. What would you like to know?`;
    }

    // Always include suggestion chips
    responseData.suggestions = getSuggestions(intent, city, days);

    return res.json({ success: true, ...responseData });

  } catch (err) {
    console.error('[Chat Message] Error:', err.message);
    return res.json({
      success: true,
      type: 'text',
      text: 'I had trouble processing that. Try asking: "Plan 3 days in Goa" or "Hotels in Jaipur".',
      suggestions: getSuggestions('general', null, 3)
    });
  }
});

/**
 * GET /api/chat/suggestions?city=X
 * Returns contextual suggestion chips for a city
 */
router.get('/suggestions', (req, res) => {
  const { city } = req.query;
  const suggestions = getSuggestions('general', city, 3);
  res.json({ success: true, suggestions, city });
});

/**
 * GET /api/chat/initial-trip?city=X&days=N
 * Quick itinerary summary for chat widget greeting
 */
router.get('/initial-trip', async (req, res) => {
  const { city = 'Jaipur', days = 3 } = req.query;
  try {
    const postRes = await fetch(`${API_BASE}/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, days: parseInt(days, 10) })
    });
    const data = await postRes.json();
    return res.json({ success: true, city, days: parseInt(days, 10), data: data.itinerary || data });
  } catch (err) {
    return res.json({ success: false, error: err.message });
  }
});

/**
 * GET /api/chat/places?city=X
 * Top 4 places for a city (explore cards in chat)
 */
router.get('/places', async (req, res) => {
  const { city = 'Jaipur' } = req.query;
  try {
    const result = await internalFetch(`${API_BASE}/destinations/search?q=${encodeURIComponent(city)}&limit=4`);
    return res.json({ success: true, city, data: result?.data?.slice(0, 4) || [] });
  } catch (err) {
    return res.json({ success: false, data: [] });
  }
});

module.exports = router;
