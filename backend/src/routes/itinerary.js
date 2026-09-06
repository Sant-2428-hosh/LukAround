const express = require('express');
const router = express.Router();
const { checkDbConnection } = require('../config/db');
const { generateRealTimeItinerary } = require('../services/aiItineraryService');
const { generateDayWiseItinerary, MOCK_ATTRACTIONS_BY_CITY } = require('../services/itineraryEngine');

/**
 * POST /api/itinerary
 * Request body: { city: string, days: number, preferences?: string }
 * Generates a real-time, multi-stop day-by-day itinerary using Groq AI + Geoapify.
 */
router.post('/', async (req, res) => {
  try {
    const { city, days, preferences } = req.body;

    if (!city || typeof city !== 'string' || !city.trim()) {
      return res.status(400).json({ success: false, error: 'Destination city name is required' });
    }

    const numDays = parseInt(days, 10);
    if (isNaN(numDays) || numDays < 1 || numDays > 10) {
      return res.status(400).json({ success: false, error: 'Trip duration must be between 1 and 10 days' });
    }

    const cleanCity = city.trim();

    // Generate real-time AI itinerary with real places extracted from Geoapify
    const aiResult = await generateRealTimeItinerary(cleanCity, numDays, preferences);

    // Prepare default transport guidance and safety helplines
    const transportList = [
      { mode: 'Auto Rickshaw', avg_cost_per_km_inr: 15, tips: 'Ideal for short distances under 5 km. Negotiate or insist on meter.' },
      { mode: 'Cab / Taxi App (Uber/Ola)', avg_cost_per_km_inr: 22, tips: 'Best for comfort and longer inter-attraction transfers.' },
      { mode: 'Walking / E-Rickshaw', avg_cost_per_km_inr: 0, tips: 'Great inside old town bazaar lanes and temple precincts.' }
    ];

    const policeInfo = {
      station_name: `${aiResult.city?.name || cleanCity} Tourist Police Helpline`,
      contact_number: '+91 112',
      emergency_helpline: '112',
      tourist_helpline: '1363',
      women_helpline: '1091'
    };

    return res.status(200).json({
      success: true,
      city: aiResult.city,
      requestedDays: aiResult.requestedDays,
      summary: aiResult.summary,
      bestTimeToVisit: aiResult.bestTimeToVisit,
      recommendedTransit: aiResult.recommendedTransit,
      totalAttractions: aiResult.totalAttractions,
      totalEntryFees: aiResult.totalEntryFees,
      itinerary: aiResult.itinerary,
      transportOptions: transportList,
      safetyContact: policeInfo,
      meta: aiResult.meta
    });

  } catch (error) {
    console.error('[Itinerary Route] Error generating itinerary:', error);

    // Ultra-resilient emergency fallback if everything fails
    try {
      const fallbackDays = Math.min(Math.max(parseInt(req.body?.days) || 3, 1), 7);
      const fallbackCity = req.body?.city || 'Jaipur';
      const fallbackStructured = generateDayWiseItinerary(fallbackCity, fallbackDays);
      return res.status(200).json({
        success: true,
        city: { name: fallbackCity, state: 'India', lat: 26.9124, lng: 75.7873 },
        requestedDays: fallbackDays,
        summary: `Curated ${fallbackDays}-day travel plan for ${fallbackCity}`,
        itinerary: fallbackStructured,
        totalAttractions: fallbackStructured.reduce((acc, d) => acc + (d.stops?.length || 0), 0),
        totalEntryFees: 600,
        recommendedTransit: 'Auto Rickshaw & Private Cab',
        meta: { engine: 'Emergency Local Engine', error: error.message }
      });
    } catch (fallbackErr) {
      res.status(500).json({ success: false, error: 'Failed to generate itinerary', details: error.message });
    }
  }
});

module.exports = router;

