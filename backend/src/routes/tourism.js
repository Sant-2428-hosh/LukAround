const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load Tourism Master Database
let tourismData = null;
try {
  const dataPath = path.join(__dirname, '..', 'data', 'indiaTourismData.json');
  tourismData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (err) {
  console.error('Failed to load indiaTourismData.json:', err);
  tourismData = { states: [], cities: [], attractions: [], categories: [], travelStyles: [], itineraries: [] };
}

// ── GET /api/tourism/overview ──
router.get('/overview', (req, res) => {
  res.json({
    success: true,
    metadata: tourismData.metadata || {},
    counts: {
      states: tourismData.states.length,
      cities: tourismData.cities.length,
      attractions: tourismData.attractions.length,
      categories: tourismData.categories.length,
      itineraries: tourismData.itineraries.length
    }
  });
});

// ── GET /api/tourism/states ──
// Supports ?sortBy=priorityRank | name | domesticVisits
router.get('/states', (req, res) => {
  const { sortBy = 'priorityRank', category } = req.query;
  let result = [...tourismData.states];

  if (category) {
    result = result.filter(s => (s.categories || []).includes(category.toLowerCase()));
  }

  if (sortBy === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'domesticVisits') {
    result.sort((a, b) => (b.domesticTouristVisits2024 || 0) - (a.domesticTouristVisits2024 || 0));
  } else {
    // Default: priorityRank
    result.sort((a, b) => (a.priorityRank || 999) - (b.priorityRank || 999));
  }

  res.json({
    success: true,
    total: result.length,
    states: result
  });
});

// ── GET /api/tourism/states/:slug ──
router.get('/states/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const state = tourismData.states.find(s => s.slug === slug || s.id === slug);

  if (!state) {
    return res.status(404).json({ success: false, error: `State not found: ${slug}` });
  }

  // Attach state's cities and top attractions
  const stateCities = tourismData.cities.filter(c => c.stateSlug === state.slug || c.state === state.name);
  const stateAttractions = tourismData.attractions.filter(a => a.stateSlug === state.slug || a.state === state.name);
  const stateItineraries = tourismData.itineraries.filter(i => i.state === state.name);

  res.json({
    success: true,
    state,
    cities: stateCities,
    attractions: stateAttractions,
    itineraries: stateItineraries
  });
});

// ── GET /api/tourism/cities ──
// Supports ?stateSlug=... & ?travelStyle=... & ?limit=...
router.get('/cities', (req, res) => {
  const { stateSlug, travelStyle, limit } = req.query;
  let result = [...tourismData.cities];

  if (stateSlug) {
    result = result.filter(c => c.stateSlug === stateSlug.toLowerCase());
  }
  if (travelStyle) {
    result = result.filter(c => (c.travelStyles || []).includes(travelStyle.toLowerCase()));
  }
  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }

  res.json({
    success: true,
    total: result.length,
    cities: result
  });
});

// ── GET /api/tourism/cities/:slug ──
router.get('/cities/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const city = tourismData.cities.find(c => c.id === slug || (c.aliases || []).some(a => a.toLowerCase() === slug));

  if (!city) {
    return res.status(404).json({ success: false, error: `City not found: ${slug}` });
  }

  const cityAttractions = tourismData.attractions.filter(a => a.citySlug === city.id || a.city.toLowerCase() === city.name.toLowerCase());
  const parentState = tourismData.states.find(s => s.slug === city.stateSlug || s.name === city.state);

  res.json({
    success: true,
    city,
    state: parentState,
    attractions: cityAttractions
  });
});

// ── GET /api/tourism/attractions ──
// Supports ?stateSlug=... & ?citySlug=... & ?category=... & ?type=... & ?featured=true
router.get('/attractions', (req, res) => {
  const { stateSlug, citySlug, category, type, featured, budget, limit, page = 1 } = req.query;
  let result = [...tourismData.attractions];

  if (stateSlug) {
    result = result.filter(a => a.stateSlug === stateSlug.toLowerCase());
  }
  if (citySlug) {
    result = result.filter(a => a.citySlug === citySlug.toLowerCase());
  }
  if (category) {
    result = result.filter(a => (a.category || []).includes(category.toLowerCase()));
  }
  if (type) {
    result = result.filter(a => a.type === type.toLowerCase());
  }
  if (featured === 'true') {
    result = result.filter(a => a.featured === true);
  }
  if (budget) {
    result = result.filter(a => a.budgetLevel === budget.toLowerCase());
  }

  const total = result.length;
  const pageSize = limit ? parseInt(limit, 10) : total;
  const offset = (parseInt(page, 10) - 1) * pageSize;
  const paginated = result.slice(offset, offset + pageSize);

  res.json({
    success: true,
    total,
    page: parseInt(page, 10),
    pageSize,
    attractions: paginated
  });
});

// ── GET /api/tourism/attractions/:slug ──
router.get('/attractions/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const attraction = tourismData.attractions.find(a => a.id === slug);

  if (!attraction) {
    return res.status(404).json({ success: false, error: `Attraction not found: ${slug}` });
  }

  const parentCity = tourismData.cities.find(c => c.id === attraction.citySlug);
  const parentState = tourismData.states.find(s => s.slug === attraction.stateSlug);
  const nearbyAttractions = tourismData.attractions
    .filter(a => a.id !== attraction.id && (a.citySlug === attraction.citySlug || a.stateSlug === attraction.stateSlug))
    .slice(0, 4);

  res.json({
    success: true,
    attraction,
    city: parentCity,
    state: parentState,
    nearbyAttractions
  });
});

// ── GET /api/tourism/categories ──
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    categories: tourismData.categories
  });
});

// ── GET /api/tourism/categories/:slug ──
router.get('/categories/:slug', (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const category = tourismData.categories.find(c => c.slug === slug || c.id === slug);

  if (!category) {
    return res.status(404).json({ success: false, error: `Category not found: ${slug}` });
  }

  const categoryAttractions = tourismData.attractions.filter(a =>
    (a.category || []).includes(slug) || a.type === slug || (a.tags || []).includes(slug)
  );

  res.json({
    success: true,
    category,
    attractions: categoryAttractions
  });
});

// ── GET /api/tourism/travel-styles ──
router.get('/travel-styles', (req, res) => {
  res.json({
    success: true,
    travelStyles: tourismData.travelStyles
  });
});

// ── GET /api/tourism/itineraries ──
router.get('/itineraries', (req, res) => {
  const { state, travelStyle } = req.query;
  let result = [...tourismData.itineraries];

  if (state) {
    result = result.filter(i => i.state.toLowerCase() === state.toLowerCase());
  }
  if (travelStyle) {
    result = result.filter(i => i.travelStyle === travelStyle.toLowerCase());
  }

  res.json({
    success: true,
    itineraries: result
  });
});

// ── POST /api/tourism/itinerary/generate ──
// Dynamic smart itinerary generator based on prompt requirements
router.post('/itinerary/generate', (req, res) => {
  try {
    const {
      destination,
      durationDays = 3,
      travelStyle = 'heritage',
      budget = 'moderate',
      interests = []
    } = req.body;

    const daysCount = Math.min(Math.max(parseInt(durationDays, 10) || 3, 1), 7);
    const destTerm = (destination || 'Rajasthan').trim().toLowerCase();

    // Find matching state or city
    const matchedState = tourismData.states.find(s =>
      s.name.toLowerCase().includes(destTerm) || s.slug.includes(destTerm)
    );
    const matchedCity = tourismData.cities.find(c =>
      c.name.toLowerCase().includes(destTerm) || c.id.includes(destTerm)
    );

    const relevantAttractions = tourismData.attractions.filter(a => {
      if (matchedCity) return a.citySlug === matchedCity.id;
      if (matchedState) return a.stateSlug === matchedState.slug;
      return a.name.toLowerCase().includes(destTerm) || a.state.toLowerCase().includes(destTerm);
    });

    const pool = relevantAttractions.length > 0 ? relevantAttractions : tourismData.attractions.slice(0, 15);

    // Build day-by-day plan
    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      const morningAttr = pool[(i * 3 - 3) % pool.length];
      const afternoonAttr = pool[(i * 3 - 2) % pool.length];
      const eveningAttr = pool[(i * 3 - 1) % pool.length];

      days.push({
        dayNumber: i,
        title: `Day ${i}: Highlights of ${morningAttr.city || destination}`,
        morning: `Start your day at ${morningAttr.name}. ${morningAttr.shortDescription || 'Experience morning darshan and peaceful garden walkways.'}`,
        afternoon: `Head towards ${afternoonAttr.name}. Savor regional specialties for lunch and explore the heritage halls and courtyards.`,
        evening: `Conclude with sunset views at ${eveningAttr.name}. Relax at seaside or cliffside cafes as the evening lights illuminate the monument.`
      });
    }

    const generated = {
      id: `itinerary-${Date.now()}`,
      destination: destination || (matchedState ? matchedState.name : 'India'),
      durationDays: daysCount,
      travelStyle,
      budget,
      interests,
      heroImage: pool[0]?.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      summary: `A curated ${daysCount}-day ${travelStyle} itinerary discovering the finest attractions and culinary heritage of ${destination}.`,
      days
    };

    res.json({
      success: true,
      itinerary: generated
    });
  } catch (err) {
    console.error('Itinerary generation error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate itinerary' });
  }
});

// ── GET /api/tourism/search ──
// Fuzzy global search across States, Cities, Attractions, Categories, and Activities
router.get('/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      query,
      results: { states: [], cities: [], attractions: [], categories: [] }
    });
  }

  // 1. States matching
  const matchedStates = tourismData.states.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.description.toLowerCase().includes(query) ||
    (s.majorCities || []).some(c => c.toLowerCase().includes(query)) ||
    (s.categories || []).some(cat => cat.toLowerCase().includes(query))
  );

  // 2. Cities matching
  const matchedCities = tourismData.cities.filter(c =>
    c.name.toLowerCase().includes(query) ||
    (c.aliases || []).some(a => a.toLowerCase().includes(query)) ||
    c.description.toLowerCase().includes(query) ||
    (c.thingsToDo || []).some(t => t.toLowerCase().includes(query)) ||
    (c.travelStyles || []).some(ts => ts.toLowerCase().includes(query))
  );

  // 3. Attractions matching
  const matchedAttractions = tourismData.attractions.filter(a =>
    a.name.toLowerCase().includes(query) ||
    a.shortDescription.toLowerCase().includes(query) ||
    a.city.toLowerCase().includes(query) ||
    a.state.toLowerCase().includes(query) ||
    (a.category || []).some(cat => cat.toLowerCase().includes(query)) ||
    (a.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
    (a.highlights || []).some(h => h.toLowerCase().includes(query)) ||
    (a.activities || []).some(act => act.toLowerCase().includes(query))
  );

  // 4. Categories matching
  const matchedCategories = tourismData.categories.filter(cat =>
    cat.name.toLowerCase().includes(query) ||
    cat.description.toLowerCase().includes(query) ||
    cat.id.toLowerCase().includes(query)
  );

  res.json({
    success: true,
    query,
    totalResults: matchedStates.length + matchedCities.length + matchedAttractions.length + matchedCategories.length,
    results: {
      states: matchedStates,
      cities: matchedCities,
      attractions: matchedAttractions,
      categories: matchedCategories
    }
  });
});

module.exports = router;
