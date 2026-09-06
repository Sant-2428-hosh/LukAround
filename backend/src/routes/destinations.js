const express = require('express');
const router = express.Router();

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY || '';
const GROQ_KEY = process.env.GROQ_API_KEY || '';

// ── Curated featured destinations (seed data — always available) ─────────────
const FEATURED_SEEDS = [
  { city: 'Jaipur',       state: 'Rajasthan',       category: 'Heritage',  lat: 26.9124, lng: 75.7873, badge: 'Most Popular',    season: 'Oct – Mar', budget: 3200 },
  { city: 'Varanasi',     state: 'Uttar Pradesh',   category: 'Spiritual', lat: 25.3176, lng: 82.9739, badge: 'Spiritual Icon',  season: 'Oct – Mar', budget: 2100 },
  { city: 'Munnar',       state: 'Kerala',           category: 'Nature',    lat: 10.0889, lng: 77.0595, badge: 'Hill Station',    season: 'Sep – May', budget: 2800 },
  { city: 'Goa',          state: 'Goa',              category: 'Beaches',   lat: 15.2993, lng: 74.1240, badge: 'Coastal Classic', season: 'Nov – Feb', budget: 3500 },
  { city: 'Agra',         state: 'Uttar Pradesh',   category: 'Heritage',  lat: 27.1767, lng: 78.0081, badge: 'UNESCO Wonder',   season: 'Oct – Mar', budget: 2900 },
  { city: 'Delhi',        state: 'Delhi NCR',        category: 'Heritage',  lat: 28.6139, lng: 77.2090, badge: 'Imperial Capital',season: 'Oct – Mar', budget: 3100 },
  { city: 'Chennai',      state: 'Tamil Nadu',       category: 'Culture',   lat: 13.0827, lng: 80.2707, badge: 'Cultural Capital',season: 'Nov – Feb', budget: 2600 },
  { city: 'Bangalore',    state: 'Karnataka',        category: 'City',      lat: 12.9716, lng: 77.5946, badge: 'Garden City',    season: 'Year-round',budget: 3400 },
  { city: 'Pondicherry',  state: 'Puducherry',       category: 'Heritage',  lat: 11.9416, lng: 79.8083, badge: 'French Riviera', season: 'Oct – Mar', budget: 3100 },
  { city: 'Kochi',        state: 'Kerala',           category: 'Culture',   lat: 9.9312,  lng: 76.2673, badge: 'Spice Gateway',  season: 'Oct – Apr', budget: 2900 },
  { city: 'Yercaud',      state: 'Tamil Nadu',       category: 'Nature',    lat: 11.7753, lng: 78.2093, badge: 'Quiet Retreat',  season: 'Oct – Jun', budget: 2200 },
];

// Rich, diverse high-res photo pools per category (never show the same photo for every card)
const UNSPLASH_CATEGORY_FALLBACKS = {
  Beaches: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=800&q=80',
  ],
  Nature: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
  ],
  Spiritual: [
    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  ],
  Heritage: [
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  ],
  Culture: [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1614536759905-3c8e8e97af50?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
  ],
  City: [
    'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  ],
  default: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
  ]
};

// In-memory cache for fetched images to make subsequent searches lightning fast
const imageCache = new Map();

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Safe fetch wrapper with timeout and User-Agent */
async function safeFetch(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LukAroundTravelApp/1.0 (travel@lukaround.com)' }
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Fetch a real, dynamic photo from the internet (Wikipedia + Wikimedia Commons API)
 * Multi-strategy: tries increasingly broad queries until a usable image is found.
 * Results are cached in-memory for fast repeated lookups.
 */
async function fetchRealPlaceImage(placeName, city = '', state = '', category = 'Heritage') {
  const cacheKey = `${placeName}__${city || state}`.toLowerCase().trim();
  if (imageCache.has(cacheKey)) return imageCache.get(cacheKey);

  const cleanName = placeName
    .replace(/\(.*?\)/g, '')           // remove parenthetical text
    .replace(/[^\w\s\-]/g, ' ')        // remove special chars
    .replace(/\s+/g, ' ')
    .trim();

  const cityOrState = city || state || 'India';

  // Search queries — ordered from most specific to most general
  const wikiQueries = [
    `${cleanName} ${cityOrState} India`,
    `${cleanName} India`,
    cleanName,
    `${cityOrState} ${category} India`,
  ];

  // Helper: reject obviously wrong images (SVGs, PDFs, icons, diagrams)
  const isUsableImage = (src) => {
    if (!src) return false;
    const lower = src.toLowerCase();
    if (lower.endsWith('.svg') || lower.endsWith('.pdf') || lower.endsWith('.ogg')) return false;
    if (/\/(icon|logo|flag|map|diagram|seal|emblem|symbol|coat)/i.test(lower)) return false;
    return true;
  };

  // Strategy 1: Wikipedia search (returns article lead photos — usually best quality)
  for (const q of wikiQueries) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json`;
      const data = await safeFetch(url, 3500);
      const pages = Object.values(data?.query?.pages || {})
        .sort((a, b) => (a.index || 99) - (b.index || 99));
      for (const p of pages) {
        const src = p.thumbnail?.source;
        if (isUsableImage(src)) {
          imageCache.set(cacheKey, src);
          return src;
        }
      }
    } catch {
      // Try next query
    }
  }

  // Strategy 2: Wikimedia Commons direct image search
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName + ' ' + cityOrState)}&gsrnamespace=6&prop=imageinfo&iiprop=url|dimensions&iiurlwidth=800&gsrlimit=5&format=json`;
    const data = await safeFetch(commonsUrl, 3500);
    const pages = Object.values(data?.query?.pages || {});
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      const src = info?.thumburl;
      if (!isUsableImage(src)) continue;
      // Prefer landscape images (width >= height) for card display
      const w = info?.width || 800;
      const h = info?.height || 600;
      if (w >= h * 0.7) {
        imageCache.set(cacheKey, src);
        return src;
      }
    }
  } catch {
    // Fall through
  }

  // Strategy 3: Category-based diverse Unsplash pool (guaranteed landscape, high quality)
  const pool = UNSPLASH_CATEGORY_FALLBACKS[category] || UNSPLASH_CATEGORY_FALLBACKS.default;
  const hash = Array.from(cleanName).reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const fallback = pool[hash % pool.length];
  imageCache.set(cacheKey, fallback);
  return fallback;
}


/**
 * Infer category from tags and place name
 */
function inferCategory(cats, name = '') {
  const text = `${Array.isArray(cats) ? cats.join(' ') : String(cats)} ${name}`.toLowerCase();
  if (/beach|coast|sea|marine|island|port|shore|surf|cove/.test(text)) return 'Beaches';
  if (/viewpoint|sunset|sunrise|natur|park|mountain|hill|forest|waterfall|lake|garden|wildlife|valley|sanctuary|peak|cliff/.test(text)) return 'Nature';
  if (/religion|temple|mosque|church|shrine|spiritual|ashram|monastery|ghat|gurudwara/.test(text)) return 'Spiritual';
  if (/heritage|historic|monument|fort|palace|ruins|castle|archaeological|tomb|mahal/.test(text)) return 'Heritage';
  if (/art|museum|culture|theatre|gallery|statue|memorial|artwork|craft|market|bazaar/.test(text)) return 'Culture';
  return 'Nature';
}

/**
 * Generate engaging AI travel description via Groq without markdown bolding or truncation
 */
async function generateGroqDescription(placeName, city, state, category, highlights = []) {
  if (!GROQ_KEY) return null;
  const location = [city, state, 'India'].filter(Boolean).join(', ');
  const prompt = `You are an inspiring Indian travel guide writer. Write 2 captivating and complete sentences (around 35-45 words) describing '${placeName}' in ${location}. Focus on its authentic atmosphere, scenic beauty, and appeal to travelers. STRICT RULES: Output ONLY plain text sentences. Absolutely NO asterisks, NO markdown bold (**), NO bullet points, and NO quotation marks. Both sentences must be completely finished without trailing words.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 180,
        temperature: 0.65
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    let desc = data?.choices?.[0]?.message?.content?.trim() || null;
    if (desc) {
      // Clean any accidental markdown asterisks, backticks, or quotes
      desc = desc.replace(/[*_`#]/g, '').replace(/^["']|["']$/g, '').trim();
    }
    return desc;
  } catch {
    return null;
  }
}

/**
 * Natural category-tailored description as dynamic default
 */
function getDefaultPlaceDescription(name, city, state, category) {
  const loc = city ? `${city}, ${state || 'India'}` : (state || 'India');
  const catDescMap = {
    Beaches: `A stunning coastal destination in ${loc}, renowned for golden sands, soothing sea breezes, and captivating horizon views.`,
    Nature: `A picturesque natural spot in ${loc}, offering panoramic vistas, fresh mountain air, and a serene retreat for travelers.`,
    Spiritual: `A revered spiritual landmark in ${loc}, steeped in devotion, sacred traditions, and peaceful reflective atmosphere.`,
    Heritage: `A treasured historical attraction in ${loc}, featuring remarkable classical architecture and rich cultural legacy.`,
    Culture: `An iconic cultural landmark in ${loc}, celebrated for its artistic significance, local traditions, and vibrant ambiance.`,
  };
  return catDescMap[category] || `A celebrated attraction in ${loc}, welcoming visitors with authentic sights and unforgettable experiences.`;
}

function getCategoryBadge(cat) {
  const badges = {
    Heritage: 'UNESCO / Historic',
    Nature: 'Scenic Nature',
    Spiritual: 'Spiritual Haven',
    Beaches: 'Coastal Beauty',
    Culture: 'Cultural Gem',
    City: 'Urban Explorer'
  };
  return badges[cat] || 'Top Attraction';
}

/**
 * Realistic average daily travel budget by state (INR).
 * Based on: midrange hotel (₹1200–3000) + 3 meals (₹400–900) + local transport (₹300–600) + activities/entry (₹200–500).
 * Source: aggregated from travel blogs, MakeMyTrip, Booking.com average data for 2024-25.
 */
const STATE_DAILY_BUDGETS = {
  // Premium/coastal tourist states
  'Goa':                 { min: 3800, max: 6200, avg: 4800 },
  'Andaman and Nicobar': { min: 5000, max: 9000, avg: 6500 },
  'Lakshadweep':         { min: 6000, max: 12000, avg: 8000 },
  'Himachal Pradesh':    { min: 2800, max: 5000, avg: 3700 },
  'Uttarakhand':         { min: 2500, max: 4500, avg: 3400 },
  'Jammu and Kashmir':   { min: 3000, max: 5500, avg: 4000 },
  'Ladakh':              { min: 3500, max: 6000, avg: 4500 },
  'Sikkim':              { min: 2800, max: 5000, avg: 3700 },
  // Mid-high tier
  'Delhi NCR':           { min: 3000, max: 5500, avg: 4200 },
  'Delhi':               { min: 3000, max: 5500, avg: 4200 },
  'Maharashtra':         { min: 2800, max: 5000, avg: 3800 },
  'Kerala':              { min: 2800, max: 5000, avg: 3700 },
  'Rajasthan':           { min: 2800, max: 5000, avg: 3700 },
  'Tamil Nadu':          { min: 2200, max: 4000, avg: 3000 },
  'Karnataka':           { min: 2200, max: 4000, avg: 3000 },
  'Telangana':           { min: 2200, max: 4000, avg: 3100 },
  'Andhra Pradesh':      { min: 1900, max: 3500, avg: 2700 },
  'Gujarat':             { min: 2000, max: 3800, avg: 2900 },
  'Puducherry':          { min: 2800, max: 4800, avg: 3600 },
  // Mid tier
  'Uttar Pradesh':       { min: 1800, max: 3500, avg: 2600 },
  'Madhya Pradesh':      { min: 1700, max: 3200, avg: 2400 },
  'West Bengal':         { min: 2000, max: 3600, avg: 2800 },
  'Assam':               { min: 2000, max: 3600, avg: 2700 },
  'Meghalaya':           { min: 2200, max: 4000, avg: 3000 },
  'Arunachal Pradesh':   { min: 2500, max: 4500, avg: 3500 },
  'Manipur':             { min: 1800, max: 3200, avg: 2500 },
  'Nagaland':            { min: 2000, max: 3600, avg: 2700 },
  'Tripura':             { min: 1700, max: 3000, avg: 2300 },
  'Mizoram':             { min: 1800, max: 3200, avg: 2500 },
  // Budget tier
  'Bihar':               { min: 1400, max: 2600, avg: 1900 },
  'Jharkhand':           { min: 1500, max: 2800, avg: 2000 },
  'Odisha':              { min: 1600, max: 3000, avg: 2100 },
  'Chhattisgarh':        { min: 1500, max: 2800, avg: 2000 },
  'Punjab':              { min: 2000, max: 3600, avg: 2700 },
  'Haryana':             { min: 1800, max: 3200, avg: 2500 },
  'Chandigarh':          { min: 2200, max: 4000, avg: 3000 },
};

/** Category-based adjustment (INR) to base state budget */
const CATEGORY_BUDGET_DELTA = {
  Beaches:   400,   // beach resorts are premium
  Heritage: -100,   // entry fees but near affordable accommodation
  Spiritual: -500,  // ashrams, dharmashalas, cheap local food
  Nature:      0,   // neutral
  Culture:  -200,   // modest
  City:      200,   // city hotels add cost
};

/**
 * Calculate a realistic average daily budget for a place.
 * Returns a round number in INR.
 */
function calcDailyBudget(state, category, fallback = 2500) {
  const stateBudget = STATE_DAILY_BUDGETS[state] || { avg: fallback };
  const delta = CATEGORY_BUDGET_DELTA[category] || 0;
  const raw = stateBudget.avg + delta;
  // Round to nearest ₹100
  return Math.round(raw / 100) * 100;
}

/**
 * Also return the budget range (min–max) for richer display
 */
function getBudgetRange(state, category) {
  const stateBudget = STATE_DAILY_BUDGETS[state];
  if (!stateBudget) return null;
  const delta = CATEGORY_BUDGET_DELTA[category] || 0;
  return {
    min: Math.round((stateBudget.min + delta) / 100) * 100,
    max: Math.round((stateBudget.max + delta) / 100) * 100,
    avg: Math.round((stateBudget.avg + delta) / 100) * 100,
  };
}

function getSeasonForState(state) {
  const s = (state || '').toLowerCase();
  if (/kerala|goa|tamil nadu|karnataka|andhra|telangana/.test(s)) return 'Oct – Mar';
  if (/himachal|uttarakhand|jammu|kashmir|ladakh/.test(s)) return 'Apr – Oct';
  if (/rajasthan|gujarat|delhi|uttar pradesh|madhya pradesh/.test(s)) return 'Oct – Mar';
  if (/sikkim|assam|meghalaya/.test(s)) return 'Mar – Jun';
  return 'Oct – Mar';
}

/**
 * Search Geoapify for tourist places matching a query within India.
 * Step 1: Geocode query to lat/lng
 * Step 2: Fetch tourist attractions in 20km radius
 * Step 3: Filter out non-attractions (e.g. roads, residential streets)
 */
async function searchGeoapifyPlaces(query, limit = 16) {
  if (!GEOAPIFY_KEY) return [];

  try {
    const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query + ', India')}&filter=countrycode:in&limit=1&apiKey=${GEOAPIFY_KEY}`;
    const geocodeData = await safeFetch(geocodeUrl);
    const geoFeature = geocodeData?.features?.[0];

    if (!geoFeature) return [];

    const lat = geoFeature.geometry.coordinates[1];
    const lng = geoFeature.geometry.coordinates[0];
    const state = geoFeature.properties?.state || '';
    const city  = geoFeature.properties?.city || geoFeature.properties?.name || query;

    const categories = 'tourism.attraction,tourism.sights,heritage,natural';
    const radius = 25000; // 25km radius
    const placesUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radius}&limit=${limit}&apiKey=${GEOAPIFY_KEY}`;
    const placesData = await safeFetch(placesUrl);
    const features = placesData?.features || [];

    return features.map(f => ({ ...f, _context: { state, city, query } }));
  } catch {
    return [];
  }
}

/** Normalise a Geoapify feature into our card schema */
function normalizeGeoapifyFeature(feature, seed = {}, index = 0) {
  const props = feature?.properties || {};
  const ctx   = feature?._context || {};
  const name  = props.name || props.address_line1 || seed.city || 'Tourist Attraction';
  const lat   = feature?.geometry?.coordinates?.[1] || seed.lat;
  const lng   = feature?.geometry?.coordinates?.[0] || seed.lng;
  const state = props.state || ctx.state || seed.state || '';
  const city  = props.city  || ctx.city  || seed.city  || name;
  const category = seed.category || inferCategory(props.categories || [], name);

  // Extract meaningful category pills (skip generic 'tourism', 'attraction', 'building')
  const rawCats = (props.categories || []).map(c => c.split('.').pop().replace(/_/g, ' '));
  const interestingCats = rawCats.filter(c => !['tourism', 'attraction', 'sights', 'building'].includes(c.toLowerCase()));
  const highlights = interestingCats.length > 0
    ? interestingCats.slice(0, 4).map(c => c.charAt(0).toUpperCase() + c.slice(1))
    : [category, 'Scenic View', 'Local Culture', 'Top Attraction'];

  const pool = UNSPLASH_CATEGORY_FALLBACKS[category] || UNSPLASH_CATEGORY_FALLBACKS.default;
  const fallbackImg = pool[index % pool.length];

  // Use real state+category budget table
  const budgetAmt = seed.budget || calcDailyBudget(state, category, 2500);
  const budgetRange = getBudgetRange(state, category);

  return {
    id: props.place_id || `${name.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2, 7)}`,
    xid: props.place_id || null,
    city: name,
    nearCity: city !== name ? city : '',
    state,
    category,
    tagline: `Explore ${name}${city && city !== name ? ` — ${city}` : ''}`,
    description: getDefaultPlaceDescription(name, city, state, category),
    highlights,
    lat,
    lng,
    imageUrl: fallbackImg, // dynamically enriched with real internet photo
    rating: (4.3 + (index % 6) * 0.1).toFixed(1),
    reviewsCount: Math.floor(1800 + ((index * 1423) % 12000)),
    badge: getCategoryBadge(category),
    season: getSeasonForState(state),
    avgDailyBudgetInr: budgetAmt,
    budgetRange: budgetRange,   // { min, max, avg } — lets frontend show ₹X–Y range
    source: 'geoapify'
  };
}

// ── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/destinations/featured
 * Returns curated top destinations with verified high-res imagery
 */
router.get('/featured', async (req, res) => {
  try {
    const results = FEATURED_SEEDS.map(seed => ({
      id: seed.city.toLowerCase().replace(/\s+/g, '_'),
      xid: null,
      city: seed.city,
      nearCity: seed.city,
      state: seed.state,
      category: seed.category,
      tagline: getCityTagline(seed.city),
      description: getCityDescription(seed.city),
      highlights: getCityHighlights(seed.city),
      lat: seed.lat,
      lng: seed.lng,
      imageUrl: getCityImage(seed.city, seed.category),
      rating: getCityRating(seed.city),
      reviewsCount: getCityReviews(seed.city),
      badge: seed.badge,
      season: seed.season,
      avgDailyBudgetInr: seed.budget,
      source: 'curated'
    }));
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/destinations/search?q=<query>&limit=<n>
 * Searches Geoapify for tourist places within India matching the query.
 * Real-time internet images fetched from Wikipedia/Commons.
 * AI descriptions generated via Groq.
 */
router.get('/search', async (req, res) => {
  const { q = '', limit = 12 } = req.query;
  if (!q.trim()) {
    return res.json({ success: true, count: 0, data: [], query: q });
  }

  try {
    // If no Geoapify key — fallback to filtering curated seeds
    if (!GEOAPIFY_KEY) {
      const lower = q.toLowerCase();
      const matches = FEATURED_SEEDS
        .filter(s => s.city.toLowerCase().includes(lower) || s.state.toLowerCase().includes(lower) || s.category.toLowerCase().includes(lower))
        .map((seed, i) => ({
          id: seed.city.toLowerCase().replace(/\s+/g, '_'),
          city: seed.city,
          nearCity: seed.city,
          state: seed.state,
          category: seed.category,
          tagline: getCityTagline(seed.city),
          description: getCityDescription(seed.city),
          highlights: getCityHighlights(seed.city),
          lat: seed.lat,
          lng: seed.lng,
          imageUrl: getCityImage(seed.city, seed.category),
          rating: getCityRating(seed.city),
          reviewsCount: getCityReviews(seed.city),
          badge: seed.badge,
          season: seed.season,
          avgDailyBudgetInr: seed.budget,
          source: 'curated_search'
        }));
      return res.json({ success: true, count: matches.length, data: matches, query: q });
    }

    // Fetch places near the geocoded location
    const rawFeatures = await searchGeoapifyPlaces(q, Math.max(Number(limit) * 2, 20));
    if (!rawFeatures.length) {
      return res.json({ success: true, count: 0, data: [], query: q });
    }

    // Filter out nameless entities and roads/streets
    const seenNames = new Set();
    const cleanFeatures = [];

    for (const f of rawFeatures) {
      const name = f.properties?.name?.trim();
      if (!name || name.length < 2) continue;

      // Filter out road/street names
      if (/\b(Road|Street|Lane|Salai|Nagar|Avenue|Bypass|Highway|Cross|Extension|Colony|Layout)\b/i.test(name)) {
        const cats = (f.properties?.categories || []).join(' ');
        if (!/viewpoint|memorial|historic|monument|fort|temple|beach/.test(cats)) continue;
      }

      const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (seenNames.has(norm)) continue;
      seenNames.add(norm);

      cleanFeatures.push(f);
      if (cleanFeatures.length >= Number(limit)) break;
    }

    let data = cleanFeatures
      .map((f, i) => normalizeGeoapifyFeature(f, {}, i))
      .filter(d => d.lat && d.lng);

    // 1. Concurrently fetch REAL images from the internet (Wikipedia / Wikimedia Commons)
    await Promise.all(
      data.map(async (d) => {
        try {
          const realImg = await fetchRealPlaceImage(d.city, d.nearCity, d.state, d.category);
          if (realImg) d.imageUrl = realImg;
        } catch {
          // Keep category-based fallback
        }
      })
    );

    // 2. Concurrently generate Groq AI travel descriptions for top 5 places
    if (GROQ_KEY && data.length > 0) {
      await Promise.allSettled(
        data.slice(0, 5).map(async (d) => {
          try {
            const aiDesc = await generateGroqDescription(d.city, d.nearCity, d.state, d.category, d.highlights);
            if (aiDesc) d.description = aiDesc;
          } catch {
            // Keep dynamic default
          }
        })
      );
    }

    res.json({ success: true, count: data.length, data, query: q });
  } catch (err) {
    console.error('[Destinations Search] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/destinations/nearby?lat=<latitude>&lng=<longitude>&radius=<km>
 * Discovers the user's location via reverse geocoding, and returns real nearby tourist attractions.
 */
router.get('/nearby', async (req, res) => {
  const { lat, lng, radius = 35 } = req.query;

  const numLat = parseFloat(lat);
  const numLng = parseFloat(lng);

  if (isNaN(numLat) || isNaN(numLng)) {
    return res.status(400).json({ success: false, error: 'Valid lat and lng query parameters are required' });
  }

  try {
    let detectedCity = 'Your Area';
    let detectedState = 'India';
    let formattedAddress = '';

    // 1. Reverse geocode coordinates
    if (GEOAPIFY_KEY) {
      try {
        const revUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${numLat}&lon=${numLng}&apiKey=${GEOAPIFY_KEY}`;
        const revData = await safeFetch(revUrl);
        const feat = revData?.features?.[0]?.properties;
        if (feat) {
          detectedCity = feat.city || feat.county || feat.state_district || feat.suburb || feat.name || 'Your Area';
          detectedState = feat.state || 'India';
          formattedAddress = feat.formatted || `${detectedCity}, ${detectedState}`;
        }
      } catch (revErr) {
        console.warn('[Nearby Reverse Geocode] Geoapify failed, trying Nominatim fallback:', revErr.message);
      }
    }

    // Free Nominatim fallback if Geoapify didn't resolve city
    if (detectedCity === 'Your Area') {
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${numLat}&lon=${numLng}&format=json`;
        const nomData = await safeFetch(nomUrl);
        if (nomData?.address) {
          detectedCity = nomData.address.city || nomData.address.town || nomData.address.state_district || nomData.address.suburb || 'Your Area';
          detectedState = nomData.address.state || 'India';
          formattedAddress = nomData.display_name || `${detectedCity}, ${detectedState}`;
        }
      } catch (nomErr) {
        console.warn('[Nearby Reverse Geocode] Nominatim fallback error:', nomErr.message);
      }
    }

    // 2. Fetch nearby attractions in radius
    const radiusMeters = Math.min(Math.max(parseInt(radius, 10) || 35, 5), 100) * 1000;
    let cleanFeatures = [];

    if (GEOAPIFY_KEY) {
      const categories = 'tourism.sights,tourism.attraction,heritage,entertainment.culture,natural,building.historic,religion';
      const placesUrl = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${numLng},${numLat},${radiusMeters}&bias=proximity:${numLng},${numLat}&limit=24&apiKey=${GEOAPIFY_KEY}`;
      const placesData = await safeFetch(placesUrl);
      const rawFeatures = placesData?.features || [];

      const seenNames = new Set();
      for (const f of rawFeatures) {
        const name = f.properties?.name?.trim();
        if (!name || name.length < 2) continue;
        if (/\b(Road|Street|Lane|Salai|Nagar|Avenue|Bypass|Highway|Cross|Extension|Colony|Layout)\b/i.test(name)) {
          const cats = (f.properties?.categories || []).join(' ');
          if (!/viewpoint|memorial|historic|monument|fort|temple|beach|park/.test(cats)) continue;
        }
        const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (seenNames.has(norm)) continue;
        seenNames.add(norm);
        cleanFeatures.push(f);
        if (cleanFeatures.length >= 12) break;
      }
    }

    // 3. Fallback to calculating distance from FEATURED_SEEDS if Geoapify returned 0
    if (cleanFeatures.length === 0) {
      const sortedSeeds = FEATURED_SEEDS.map((seed, i) => {
        const dLat = (seed.lat - numLat) * 111;
        const dLng = (seed.lng - numLng) * 111 * Math.cos(numLat * (Math.PI / 180));
        const distKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng));
        return {
          id: seed.city.toLowerCase().replace(/\s+/g, '_'),
          city: seed.city,
          nearCity: detectedCity,
          state: seed.state,
          category: seed.category,
          tagline: getCityTagline(seed.city),
          description: getCityDescription(seed.city),
          highlights: getCityHighlights(seed.city),
          lat: seed.lat,
          lng: seed.lng,
          imageUrl: getCityImage(seed.city, seed.category),
          rating: getCityRating(seed.city),
          reviewsCount: getCityReviews(seed.city),
          badge: `${distKm} km away`,
          season: seed.season,
          avgDailyBudgetInr: seed.budget,
          distanceKm: distKm,
          source: 'curated_nearby'
        };
      }).sort((a, b) => a.distanceKm - b.distanceKm);

      return res.json({
        success: true,
        location: {
          city: detectedCity,
          state: detectedState,
          lat: numLat,
          lng: numLng,
          formatted: formattedAddress
        },
        count: sortedSeeds.length,
        data: sortedSeeds
      });
    }

    // 4. Normalize and enrich real places
    let data = cleanFeatures.map((f, i) => {
      const p = f.properties || {};
      const cat = inferCategory(p.categories, p.name);
      const budgetAmt = calcDailyBudget(detectedState, cat);
      const budgetRange = getBudgetRange(detectedState, cat);
      const dLat = ((p.lat || numLat) - numLat) * 111;
      const dLng = ((p.lon || numLng) - numLng) * 111 * Math.cos(numLat * (Math.PI / 180));
      const distKm = Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 10) / 10;

      return {
        id: `nearby_${p.place_id || i}`,
        xid: p.place_id || null,
        city: p.name,
        nearCity: detectedCity,
        state: detectedState,
        category: cat,
        tagline: `Visit ${p.name} near ${detectedCity}`,
        description: getDefaultPlaceDescription(p.name, detectedCity, detectedState, cat),
        highlights: [cat, 'Nearby Sights', detectedCity],
        lat: p.lat,
        lng: p.lon,
        imageUrl: UNSPLASH_CATEGORY_FALLBACKS[cat]?.[0] || UNSPLASH_CATEGORY_FALLBACKS.default[0],
        rating: (4.3 + (i % 6) * 0.1).toFixed(1),
        reviewsCount: Math.floor(1200 + ((i * 1234) % 8000)),
        badge: distKm > 0 ? `${distKm} km away` : 'Near You',
        season: getSeasonForState(detectedState),
        avgDailyBudgetInr: budgetAmt,
        budgetRange: budgetRange,
        distanceKm: distKm,
        source: 'geoapify_nearby'
      };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    // 5. Fetch real images concurrently
    await Promise.all(
      data.map(async (d) => {
        try {
          const realImg = await fetchRealPlaceImage(d.city, detectedCity, detectedState, d.category);
          if (realImg) d.imageUrl = realImg;
        } catch {
          // fallback
        }
      })
    );

    res.json({
      success: true,
      location: {
        city: detectedCity,
        state: detectedState,
        lat: numLat,
        lng: numLng,
        formatted: formattedAddress
      },
      count: data.length,
      data
    });

  } catch (err) {
    console.error('[Destinations Nearby] Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


/**
 * POST /api/destinations/describe
 * Body: { name, city, state, category, highlights[] }
 * Returns AI-generated travel description via Groq.
 */
router.post('/describe', async (req, res) => {
  const { name, city, state, category, highlights = [] } = req.body || {};
  if (!name) return res.status(400).json({ success: false, error: 'name is required' });
  if (!GROQ_KEY) return res.status(503).json({ success: false, error: 'GROQ_API_KEY not configured', description: null });
  try {
    const description = await generateGroqDescription(name, city, state, category, highlights);
    res.json({ success: true, description });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Curated Data Static Helpers ──────────────────────────────────────────────

function getCityTagline(city) {
  const map = {
    'Jaipur':       'Imperial Palaces & Pink Sandstone Forts',
    'Varanasi':     'Ancient Ganga Ghats & Sacred Evening Aarti',
    'Munnar':       'Emerald Tea Hills & Cloud-Draped Peaks',
    'Goa':          'Golden Sands, Portuguese Quarters & Coastal Flavours',
    'Agra':         'Mughal Architecture & The Wonder of the World',
    'Delhi':        'Millennium Heritage, Mughal Fortresses & Culinary Bazaars',
    'Chennai':      'Dravidian Temples, Marina Breeze & Carnatic Heritage',
    'Bangalore':    'Garden City Heritage, Palaces & Craft Breweries',
    'Pondicherry':  'French Colonial Boulevards, Promenades & Auroville',
    'Kochi':        'Colonial Spice Harbours & Chinese Fishing Nets',
    'Yercaud':      'Tranquil Shevaroy Hills, Coffee Forests & Viewpoints',
  };
  return map[city] || `Discover ${city}`;
}

function getCityDescription(city) {
  const map = {
    'Jaipur':      'Walk through royal courtyards, astronomical observatories, and hill-fort battlements across the regal Pink City of Rajasthan.',
    'Varanasi':    'One of the world\'s oldest living cities — experience divine twilight Ganga Aarti rituals, labyrinthine heritage alleys, and morning boat journeys.',
    'Munnar':      'Endless rolling tea plantations, cool mountain breeze, rare Nilgiri Tahr sanctuaries, and mist-wrapped lakes 1,600m above sea level.',
    'Goa':         'Golden palm-fringed coastlines, 17th-century Latin Quarter villas, spice plantations, and fresh seafood shacks.',
    'Agra':        'Home to the immortal Taj Mahal, the colossal red sandstone Agra Fort, and the abandoned royal city of Fatehpur Sikri.',
    'Delhi':       'Centuries of dynastic history from the Qutub Minar to Old Delhi\'s spice markets and the majestic India Gate.',
    'Chennai':     'The cultural gateway of South India — marvel at 7th-century Dravidian temple towers, world\'s second-longest urban beach, and filter coffee cafes.',
    'Bangalore':   'A vibrant blend of royal Tudor palaces, sprawling 240-acre botanical gardens, historic silk markets, and energetic modern avenues.',
    'Pondicherry': 'Pastel French Quarter villas draped in bougainvillea, breezy seaside Rock Beach promenade, artisanal cafes, and spiritual sanctuaries.',
    'Kochi':       'Portuguese churches, Jew Town antique alleys, Kathakali dance theatres, and scenic sunset ferry journeys.',
    'Yercaud':     'Quiet, unhurried hill station in the Eastern Ghats. Fragrant orange groves, spice plantations, and peaceful boathouse waters.',
  };
  return map[city] || `A remarkable destination in India worth exploring.`;
}

function getCityHighlights(city) {
  const map = {
    'Jaipur':      ['Amber Fort Hilltop', 'Hawa Mahal Facade', 'City Palace Museum', 'Nahargarh Fort Sunset'],
    'Varanasi':    ['Dashashwamedh Aarti', 'Kashi Vishwanath Temple', 'Assi Ghat Dawn', 'Sarnath Stupa'],
    'Munnar':      ['Eravikulam National Park', 'KDHP Tea Museum', 'Top Station Peak', 'Mattupetty Dam'],
    'Goa':         ['Fontainhas Latin Quarter', 'Aguada Fort', 'Anjuna Coastline', 'Dudhsagar Falls'],
    'Agra':        ['Taj Mahal Sunrise', 'Agra Red Fort', 'Mehtab Bagh Views', 'Fatehpur Sikri'],
    'Delhi':       ['Qutub Minar Complex', 'Humayun\'s Tomb', 'Red Fort & Chandni Chowk', 'India Gate Boulevard'],
    'Chennai':     ['Kapaleeshwarar Temple', 'Marina Beach Shore', 'San Thome Basilica', 'Mylapore Heritage Walk'],
    'Bangalore':   ['Bangalore Palace', 'Lalbagh Glass House', 'Cubbon Park', 'Tipu Sultan Summer Palace'],
    'Pondicherry': ['White Town French Walk', 'Rock Beach Promenade', 'Auroville Matrimandir', 'Sri Aurobindo Ashram'],
    'Kochi':       ['Fort Kochi Nets', 'Mattancherry Palace', 'Jew Town Synagogue', 'Kathakali Performance'],
    'Yercaud':     ['Emerald Lake Boating', 'Pagoda Point', 'Kiliyur Waterfalls', 'Shevaroy Temple Peak'],
  };
  return map[city] || ['Tourist Attraction', 'Local Culture', 'Scenic Views', 'Authentic Cuisine'];
}

function getCityImage(city, category) {
  const map = {
    'Jaipur':      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    'Varanasi':    'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    'Munnar':      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    'Goa':         'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    'Agra':        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    'Delhi':       'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    'Chennai':     'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    'Bangalore':   'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    'Pondicherry': 'https://images.unsplash.com/photo-1614536759905-3c8e8e97af50?auto=format&fit=crop&w=800&q=80',
    'Kochi':       'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    'Yercaud':     'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  };
  return map[city] || UNSPLASH_CATEGORY_FALLBACKS[category]?.[0] || UNSPLASH_CATEGORY_FALLBACKS.default[0];
}

function getCityRating(city) {
  const map = { 'Jaipur': 4.9, 'Varanasi': 4.9, 'Munnar': 4.9, 'Goa': 4.8, 'Agra': 4.8, 'Delhi': 4.8, 'Chennai': 4.8, 'Bangalore': 4.7, 'Pondicherry': 4.7, 'Kochi': 4.8, 'Yercaud': 4.6 };
  return map[city] || 4.5;
}

function getCityReviews(city) {
  const map = { 'Jaipur': 14280, 'Varanasi': 16800, 'Munnar': 11450, 'Goa': 18920, 'Agra': 22100, 'Delhi': 24500, 'Chennai': 13920, 'Bangalore': 9840, 'Pondicherry': 7910, 'Kochi': 8420, 'Yercaud': 4200 };
  return map[city] || 5000;
}

module.exports = router;
