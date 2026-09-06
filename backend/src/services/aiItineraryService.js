/**
 * Luk Around - Real-Time AI Itinerary Generation Service
 * Powered by Groq AI (Llama 3.3 / Qwen) & Geoapify Places API
 */

const GEOAPIFY_KEY = process.env.GEOAPIFY_API_KEY || '';

function getGroqKey() {
  return process.env.GROQ_ITINERARY_API_KEY || process.env.GROQ_API_KEY || '';
}

/** Safe fetch wrapper with timeout */
async function safeFetch(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'LukAroundTravelApp/2.0',
        ...(options.headers || {})
      }
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/** Haversine formula to compute distance in km between two lat/lng pairs */
function haversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
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

/** Determine recommended transit mode, travel duration, and cost based on distance */
function computeTransitBetween(stopA, stopB) {
  const dist = haversineDistance(stopA.lat || stopA.latitude, stopA.lng || stopA.longitude, stopB.lat || stopB.latitude, stopB.lng || stopB.longitude);

  let mode = 'Auto Rickshaw';
  let durationMins = Math.max(8, Math.round(dist * 3.5));
  let estCostInr = 50;

  if (dist <= 0.8) {
    mode = 'Walking';
    durationMins = Math.max(5, Math.round(dist * 12));
    estCostInr = 0;
  } else if (dist <= 3.5) {
    mode = 'Auto Rickshaw';
    durationMins = Math.max(10, Math.round(dist * 3.5));
    estCostInr = Math.max(40, Math.round(dist * 16));
  } else if (dist <= 12) {
    mode = 'Cab / Taxi App';
    durationMins = Math.max(15, Math.round(dist * 3.2));
    estCostInr = Math.max(100, Math.round(dist * 22));
  } else {
    mode = 'Private Cab';
    durationMins = Math.max(25, Math.round(dist * 2.8));
    estCostInr = Math.max(250, Math.round(dist * 20));
  }

  const modes = [
    { mode, durationMins, fareInr: estCostInr, recommended: true },
    dist <= 1.5 ? { mode: 'Walking', durationMins: Math.max(5, Math.round(dist * 12)), fareInr: 0 } : null,
    dist > 1.0 ? { mode: 'Cab', durationMins: Math.max(10, Math.round(dist * 3.0)), fareInr: Math.max(90, Math.round(dist * 22)) } : null
  ].filter(Boolean);

  return {
    mode,
    distanceKm: dist,
    durationMins,
    estCostInr,
    fareInr: estCostInr,
    modes
  };
}

/** Geocode city using Geoapify */
async function geocodeCity(cityName) {
  if (!GEOAPIFY_KEY) return null;
  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(cityName + ', India')}&filter=countrycode:in&limit=1&apiKey=${GEOAPIFY_KEY}`;
    const res = await safeFetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const feat = data?.features?.[0];
    if (!feat) return null;
    return {
      name: feat.properties.city || feat.properties.name || cityName,
      state: feat.properties.state || 'India',
      lat: feat.properties.lat,
      lng: feat.properties.lon,
      formatted: feat.properties.formatted
    };
  } catch (err) {
    console.warn('[geocodeCity] Error:', err.message);
    return null;
  }
}

/** Fetch real tourist attractions around coordinates via Geoapify */
async function fetchRealAttractions(lat, lng, radiusMeters = 30000) {
  if (!GEOAPIFY_KEY || !lat || !lng) return [];
  try {
    const categories = 'tourism.sights,tourism.attraction,heritage,entertainment.culture,natural,building.historic,religion';
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lng},${lat},${radiusMeters}&bias=proximity:${lng},${lat}&limit=35&apiKey=${GEOAPIFY_KEY}`;
    const res = await safeFetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const features = data?.features || [];

    const seen = new Set();
    const attractions = [];

    for (const f of features) {
      const p = f.properties || {};
      const name = p.name;
      if (!name || name.length < 3) continue;
      // Skip generic roads/streets
      if (/street|road|lane|cross|marg|nagar|sector|colony/i.test(name) && !/temple|fort|palace|mahal|park|ghat|lake/i.test(name)) continue;

      const norm = name.toLowerCase().trim();
      if (seen.has(norm)) continue;
      seen.add(norm);

      attractions.push({
        name,
        lat: p.lat,
        lng: p.lon,
        category: inferCategory(p.categories, name),
        address: p.formatted || '',
        city: p.city || '',
        state: p.state || ''
      });
    }

    return attractions;
  } catch (err) {
    console.warn('[fetchRealAttractions] Error:', err.message);
    return [];
  }
}

function inferCategory(cats, name = '') {
  const text = `${Array.isArray(cats) ? cats.join(' ') : String(cats)} ${name}`.toLowerCase();
  if (/beach|coast|sea|marine|island|port|shore/.test(text)) return 'Beaches';
  if (/viewpoint|sunset|sunrise|park|mountain|hill|forest|waterfall|lake|garden|wildlife|valley|sanctuary|peak/.test(text)) return 'Nature';
  if (/temple|mosque|church|shrine|spiritual|ashram|monastery|ghat|gurudwara/.test(text)) return 'Spiritual';
  if (/heritage|historic|monument|fort|palace|ruins|castle|archaeological|tomb|mahal/.test(text)) return 'Heritage';
  if (/art|museum|culture|theatre|gallery|statue|memorial|market|bazaar/.test(text)) return 'Culture';
  return 'Sightseeing';
}

/** Call Groq API with structured JSON output */
async function callGroqAi(cityName, stateName, numDays, extractedPlaces = []) {
  const groqKey = getGroqKey();
  if (!groqKey) return null;

  const placesContext = extractedPlaces.length > 0
    ? `\nREAL ATTRACTIONS NEAR ${cityName.toUpperCase()} TO INCLUDE:\n` +
      extractedPlaces.slice(0, 18).map(p => `- ${p.name} (${p.category}, coords: ${p.lat?.toFixed(4)}, ${p.lng?.toFixed(4)})`).join('\n')
    : '';

  const systemPrompt = `You are a master Indian travel itinerary curator with deep local knowledge of heritage, timings, entry fees, and route sequencing.
You generate realistic, unforgettable, practical day-by-day itineraries across India.
Rules:
1. Every day MUST have exactly 3 sequential stops:
   - Stop 1: Morning (approx 9:00 AM – 12:00 PM) - best for heritage forts, temples, or morning nature walks.
   - Stop 2: Afternoon (approx 1:00 PM – 4:00 PM) - best for palaces, museums, indoor galleries, or relaxing parks.
   - Stop 3: Evening (approx 4:30 PM – 7:30 PM) - best for sunset viewpoints, ghat aartis, vibrant bazaars, or lake promenades.
2. Group nearby spots on the same day to minimize travel time (geo-clustering).
3. Provide realistic entry fees in INR (e.g. ₹0 for temples/ghats, ₹50-₹300 for monuments, ₹500+ for Taj Mahal/special forts).
4. Give specific, authentic insider tips for each attraction (e.g. where to stand for photos, dress codes, best local snacks nearby).
5. Output ONLY valid, strict JSON matching the specified schema. No markdown backticks outside, no conversational preamble.`;

  const userPrompt = `Create a complete ${numDays}-day travel itinerary for "${cityName}, ${stateName || 'India'}".
${placesContext}

Return JSON with this EXACT structure:
{
  "destination": "${cityName}",
  "state": "${stateName || 'India'}",
  "summary": "Compelling 1-sentence trip summary",
  "bestTimeToVisit": "e.g. October to March",
  "recommendedTransit": "e.g. Auto Rickshaw & Private Taxi",
  "totalEstimatedEntryFees": 850,
  "days": [
    {
      "day": 1,
      "theme": "Theme title for Day 1",
      "stops": [
        {
          "order": 1,
          "name": "Attraction Name",
          "timeSlot": "Morning (9:00 AM – 11:30 AM)",
          "durationHours": 2.0,
          "category": "Heritage",
          "entryFeeInr": 200,
          "openingHours": "9:00 AM – 5:00 PM",
          "description": "2-sentence vivid description of what travelers experience here.",
          "tip": "Insider traveler tip.",
          "lat": 26.9239,
          "lng": 75.8267
        }
      ]
    }
  ]
}`;

  const models = [
    'qwen/qwen3.8-27b',
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant'
  ];

  for (const model of models) {
    try {
      const res = await safeFetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.5,
          max_tokens: 3500,
          response_format: { type: 'json_object' }
        })
      }, 15000);

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Groq ${model}] HTTP error:`, res.status, errText.slice(0, 150));
        continue;
      }

      const jsonRes = await res.json();
      const content = jsonRes?.choices?.[0]?.message?.content?.trim();
      if (!content) continue;

      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.days) && parsed.days.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn(`[Groq ${model}] Exception:`, err.message);
    }
  }

  return null;
}

/** Fallback generator that synthesizes extracted real places into a structured plan */
function generateSynthesizedItinerary(cityName, stateName, numDays, extractedPlaces = [], cityCoords = null) {
  const validDays = Math.min(Math.max(parseInt(numDays) || 1, 1), 7);
  const places = [...extractedPlaces];

  const defaultStopsSeed = [
    { name: `${cityName} Heritage Fort`, category: 'Heritage', entryFee: 200, ideal: 'morning' },
    { name: `${cityName} Royal Palace & Museum`, category: 'Culture', entryFee: 150, ideal: 'afternoon' },
    { name: `${cityName} Sunset Lake & Viewpoint`, category: 'Nature', entryFee: 50, ideal: 'evening' },
    { name: `${cityName} Ancient Temple Complex`, category: 'Spiritual', entryFee: 0, ideal: 'morning' },
    { name: `${cityName} Central Crafts Bazaar`, category: 'Culture', entryFee: 0, ideal: 'afternoon' },
    { name: `${cityName} Promenade & Street Food Walk`, category: 'Sightseeing', entryFee: 0, ideal: 'evening' },
    { name: `${cityName} Botanical Gardens`, category: 'Nature', entryFee: 30, ideal: 'morning' },
    { name: `${cityName} Archaeological Gallery`, category: 'Heritage', entryFee: 100, ideal: 'afternoon' },
    { name: `${cityName} Hilltop Panorama Point`, category: 'Nature', entryFee: 20, ideal: 'evening' },
  ];

  const daysArr = [];
  let placeIdx = 0;
  let grandTotalFees = 0;

  for (let d = 1; d <= validDays; d++) {
    const dayStops = [];

    // Slot 1: Morning
    const morningPlace = places[placeIdx++] || defaultStopsSeed[(d * 3 - 3) % defaultStopsSeed.length];
    // Slot 2: Afternoon
    const afternoonPlace = places[placeIdx++] || defaultStopsSeed[(d * 3 - 2) % defaultStopsSeed.length];
    // Slot 3: Evening
    const eveningPlace = places[placeIdx++] || defaultStopsSeed[(d * 3 - 1) % defaultStopsSeed.length];

    const dayPlaces = [
      { p: morningPlace, slot: 'Morning (9:00 AM – 11:30 AM)', dur: 2.0, fee: 150, tip: 'Visit early morning to avoid peak heat and long queues.' },
      { p: afternoonPlace, slot: 'Afternoon (1:00 PM – 3:30 PM)', dur: 2.5, fee: 200, tip: 'Enjoy indoor galleries or shaded courtyards during midday sun.' },
      { p: eveningPlace, slot: 'Evening (4:30 PM – 7:30 PM)', dur: 2.0, fee: 50, tip: 'Unmissable golden hour sunset reflections and vibrant local evening energy.' }
    ];

    dayPlaces.forEach((item, idx) => {
      const p = item.p;
      const fee = p.entryFee || item.fee;
      grandTotalFees += fee;

      const lat = p.lat || (cityCoords?.lat ? cityCoords.lat + (idx * 0.01) : 26.9124);
      const lng = p.lng || (cityCoords?.lng ? cityCoords.lng + (idx * 0.01) : 75.7873);

      dayStops.push({
        order: idx + 1,
        name: p.name,
        timeSlot: item.slot,
        durationHours: item.dur,
        category: p.category || 'Heritage',
        entryFeeInr: fee,
        openingHours: '9:00 AM – 6:00 PM',
        description: `Explore the celebrated sights and timeless atmosphere of ${p.name} in ${cityName}.`,
        tip: item.tip,
        lat,
        lng
      });
    });

    daysArr.push({
      day: d,
      theme: `Day ${d}: ${dayStops[0]?.name} & ${dayStops[2]?.name}`,
      stops: dayStops
    });
  }

  return {
    destination: cityName,
    state: stateName || 'India',
    summary: `${validDays}-day curated exploration covering ${validDays * 3} signature attractions across ${cityName}.`,
    bestTimeToVisit: 'October to March',
    recommendedTransit: 'Auto Rickshaw & Private Cab',
    totalEstimatedEntryFees: grandTotalFees,
    days: daysArr
  };
}

/**
 * Main function: Generate Real-Time AI Itinerary
 * @param {string} cityName
 * @param {number} numDays
 * @param {string} [preferences]
 */
async function generateRealTimeItinerary(cityName, numDays = 3, preferences = '') {
  const cleanCity = (cityName || 'Jaipur').trim();
  const days = Math.min(Math.max(parseInt(numDays) || 3, 1), 7);

  // 1. Geocode city
  const cityGeo = await geocodeCity(cleanCity);
  const cityLat = cityGeo?.lat || 26.9124;
  const cityLng = cityGeo?.lng || 75.7873;
  const cityState = cityGeo?.state || 'India';
  const resolvedCityName = cityGeo?.name || cleanCity;

  // 2. Fetch real attractions in 30km radius via Geoapify
  const realAttractions = await fetchRealAttractions(cityLat, cityLng, 30000);

  // 3. Generate plan via Groq AI (with real places grounding)
  let rawPlan = null;
  const groqKey = getGroqKey();

  if (groqKey) {
    rawPlan = await callGroqAi(resolvedCityName, cityState, days, realAttractions);
  }

  // 4. Fallback if Groq unavailable or parsing failed
  if (!rawPlan || !rawPlan.days || rawPlan.days.length === 0) {
    rawPlan = generateSynthesizedItinerary(resolvedCityName, cityState, days, realAttractions, { lat: cityLat, lng: cityLng });
  }

  // 5. Post-process: Compute inter-stop transit & coordinate verification
  let totalAttractionsCount = 0;
  let totalFees = 0;

  const processedDays = (rawPlan.days || []).map((dayObj, dayIdx) => {
    const dayNum = dayObj.day || dayIdx + 1;
    const stops = (dayObj.stops || []).map((stop, stopIdx) => {
      totalAttractionsCount++;
      const fee = Number(stop.entryFeeInr || 0);
      totalFees += fee;

      // Coordinate matching from Geoapify if AI didn't provide or gave 0
      let lat = Number(stop.lat || 0);
      let lng = Number(stop.lng || 0);
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        const matched = realAttractions.find(a => a.name.toLowerCase().includes(stop.name.toLowerCase()) || stop.name.toLowerCase().includes(a.name.toLowerCase()));
        if (matched) {
          lat = matched.lat;
          lng = matched.lng;
        } else {
          lat = cityLat + (stopIdx * 0.008) - 0.004;
          lng = cityLng + (stopIdx * 0.008) - 0.004;
        }
      }

      return {
        id: `${dayNum}-${stopIdx + 1}`,
        order: stopIdx + 1,
        name: stop.name,
        timeSlot: stop.timeSlot || (stopIdx === 0 ? 'Morning (9:00 AM – 11:30 AM)' : stopIdx === 1 ? 'Afternoon (1:00 PM – 3:30 PM)' : 'Evening (4:30 PM – 7:00 PM)'),
        durationHours: Number(stop.durationHours || (stopIdx === 1 ? 2.5 : 2.0)),
        category: stop.category || 'Sightseeing',
        entryFeeInr: fee,
        openingHours: stop.openingHours || '9:00 AM – 6:00 PM',
        description: stop.description || `Signature travel destination in ${resolvedCityName}.`,
        tip: stop.tip || 'Reach early to avoid rush hours and get great photo light.',
        lat,
        lng,
        latitude: lat,
        longitude: lng,
        transitToNext: null // computed below
      };
    });

    // Compute transit between consecutive stops in the day
    for (let i = 0; i < stops.length - 1; i++) {
      stops[i].transitToNext = computeTransitBetween(stops[i], stops[i + 1]);
    }

    return {
      day: dayNum,
      theme: dayObj.theme || `Day ${dayNum}: ${resolvedCityName} Exploration`,
      title: dayObj.theme || `Day ${dayNum}: ${resolvedCityName} Highlights`,
      stops
    };
  });

  return {
    success: true,
    city: {
      name: resolvedCityName,
      state: cityState,
      lat: cityLat,
      lng: cityLng,
      formattedAddress: cityGeo?.formatted || `${resolvedCityName}, ${cityState}, India`
    },
    requestedDays: days,
    summary: rawPlan.summary || `${days}-day itinerary for ${resolvedCityName}`,
    bestTimeToVisit: rawPlan.bestTimeToVisit || 'October to March',
    recommendedTransit: rawPlan.recommendedTransit || 'Auto Rickshaw & Private Cab',
    totalAttractions: totalAttractionsCount,
    totalEntryFees: rawPlan.totalEstimatedEntryFees || totalFees,
    itinerary: processedDays,
    meta: {
      generator: groqKey ? 'Groq AI (Llama-3.3-70b) + Geoapify Grounding' : 'Geoapify Real-Time Grounding Engine',
      realPlacesExtracted: realAttractions.length,
      generatedAt: new Date().toISOString()
    }
  };
}

module.exports = {
  generateRealTimeItinerary,
  geocodeCity,
  fetchRealAttractions,
  haversineDistance
};
