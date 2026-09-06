const express = require('express');
const router = express.Router();
const { haversineDistance } = require('../services/itineraryEngine');

/**
 * Calculates multi-modal transit options between two points.
 */
function calculateTransitOptions(distanceKm, fromName = 'Origin', toName = 'Destination') {
  const dist = Number(distanceKm) || 2.0;

  const options = [];

  // 1. Walking option (ideal for distances <= 1.2 km)
  if (dist <= 1.2) {
    const walkTimeMins = Math.max(3, Math.round(dist * 12));
    options.push({
      mode: 'Walking',
      recommended: true,
      fareInr: 0,
      timeMins: walkTimeMins,
      icon: 'walk',
      tips: 'Short scenic walk between nearby attractions.'
    });
  }

  // 2. Auto Rickshaw option
  const autoTimeMins = Math.max(5, Math.round(dist * 3 + 3));
  const autoFareInr = Math.max(30, Math.round(30 + dist * 15));
  options.push({
    mode: 'Auto Rickshaw',
    recommended: dist > 1.2 && dist <= 5.0,
    fareInr: autoFareInr,
    timeMins: autoTimeMins,
    icon: 'auto',
    tips: 'Best for short city hops. Demand meter or negotiate rate.'
  });

  // 3. Cab / App Taxi option (Uber / Ola / Rapido)
  const cabTimeMins = Math.max(5, Math.round(dist * 2.5 + 2));
  const cabFareInr = Math.max(60, Math.round(50 + dist * 22));
  options.push({
    mode: 'Cab / Taxi App',
    recommended: dist > 5.0,
    fareInr: cabFareInr,
    timeMins: cabTimeMins,
    icon: 'cab',
    tips: 'Air-conditioned comfort with upfront digital pricing.'
  });

  // 4. City Bus / Metro option
  if (dist >= 2.0) {
    const busTimeMins = Math.max(10, Math.round(dist * 4 + 5));
    const busFareInr = Math.min(30, Math.max(10, Math.round(10 + dist * 3)));
    options.push({
      mode: 'City Bus / Metro',
      recommended: false,
      fareInr: busFareInr,
      timeMins: busTimeMins,
      icon: 'bus',
      tips: 'Budget friendly transit for longer city routes.'
    });
  }

  return {
    from: fromName,
    to: toName,
    distanceKm: Number(dist.toFixed(1)),
    recommendedMode: options.find(o => o.recommended)?.mode || 'Auto Rickshaw',
    modes: options
  };
}

/**
 * GET /api/transport
 * Query params: from, to, fromLat, fromLng, toLat, toLng, distanceKm
 */
router.get('/', (req, res) => {
  const { from, to, fromLat, fromLng, toLat, toLng, distanceKm } = req.query;

  let computedDist = parseFloat(distanceKm);

  if (isNaN(computedDist) && fromLat && fromLng && toLat && toLng) {
    computedDist = haversineDistance(
      parseFloat(fromLat),
      parseFloat(fromLng),
      parseFloat(toLat),
      parseFloat(toLng)
    );
  }

  if (isNaN(computedDist)) {
    computedDist = 2.5; // Default fallback distance in km
  }

  const result = calculateTransitOptions(computedDist, from || 'Origin', to || 'Destination');
  res.status(200).json(result);
});

module.exports = {
  router,
  calculateTransitOptions
};
