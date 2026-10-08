/**
 * Distance, Geolocation, and Navigation Utilities
 * Precision calculation using Haversine Great-Circle formula
 * LukAround / POLAMA India Travel & Tourism Platform
 */

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} distance in kilometers (rounded to 1 decimal place)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  
  return Math.round(d * 10) / 10;
}

/**
 * Estimates driving travel time based on Indian urban/rural road factors
 * @param {number} distanceKm 
 * @returns {string} e.g. "Approx. 4 min walk" or "Approx. 12 min drive"
 */
export function estimateTravelTime(distanceKm) {
  if (distanceKm <= 0.6) {
    const walkMins = Math.max(2, Math.round(distanceKm * 15));
    return `Approx. ${walkMins} min walk`;
  }
  
  // Real road route factor is ~1.35x of straight line, average travel speed ~28 km/h
  const roadDistance = distanceKm * 1.35;
  const driveMinutes = Math.max(3, Math.round((roadDistance / 28) * 60));
  
  if (driveMinutes >= 60) {
    const hours = Math.floor(driveMinutes / 60);
    const mins = driveMinutes % 60;
    return mins > 0 ? `Approx. ${hours}h ${mins}m drive` : `Approx. ${hours}h drive`;
  }
  
  return `Approx. ${driveMinutes} min drive`;
}

/**
 * Returns formatted distance label relative to a destination landmark
 * @param {number} distanceKm 
 * @param {string} destinationName 
 * @returns {string} e.g. "1.2 km from Taj Mahal"
 */
export function formatDistanceText(distanceKm, destinationName) {
  if (!destinationName) return `${distanceKm} km away`;
  return `${distanceKm} km from ${destinationName}`;
}

/**
 * Generates an official, verifiable Google Maps search URL
 * @param {object} hotel 
 * @returns {string} URL
 */
export function getGoogleMapsSearchUrl(hotel) {
  if (!hotel) return 'https://www.google.com/maps';
  const query = `${hotel.name}, ${hotel.address || (hotel.city + ', ' + hotel.state)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * Generates an official Google Maps directions URL
 * @param {object} hotel 
 * @param {object|null} originCoords { latitude, longitude } optional
 * @returns {string} URL
 */
export function getGoogleMapsDirectionsUrl(hotel, originCoords = null) {
  if (!hotel) return 'https://www.google.com/maps';
  
  const dest = `${hotel.latitude},${hotel.longitude}`;
  if (originCoords && originCoords.latitude && originCoords.longitude) {
    const origin = `${originCoords.latitude},${originCoords.longitude}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
  }
  
  // Default to user's current GPS location to destination
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
}

/**
 * Computes transparent Safety & Trust score for ranking
 * 1. Verified existence (high weight)
 * 2. Front Desk 24-hr
 * 3. CCTV & keycard security
 * 4. High guest rating & review count
 */
export function computeSafetyScore(hotel) {
  let score = 0;
  if (hotel.verified) score += 40;
  if (hotel.safetyIndicators && hotel.safetyIndicators.length > 0) {
    score += Math.min(30, hotel.safetyIndicators.length * 5);
  }
  if (hotel.guestRating) {
    score += hotel.guestRating * 4; // up to 20
  }
  if (hotel.reviewCount && hotel.reviewCount > 500) {
    score += 10;
  }
  return score;
}

/**
 * Advanced multi-criteria hotel sorting
 * @param {Array} hotelList 
 * @param {string} sortBy 
 * @returns {Array} sorted hotel list
 */
export function sortHotels(hotelList, sortBy = 'recommended') {
  const list = [...hotelList];
  
  switch (sortBy) {
    case 'closest':
      return list.sort((a, b) => (a.distanceInKm ?? 999) - (b.distanceInKm ?? 999));
      
    case 'rating':
      return list.sort((a, b) => (b.guestRating || 0) - (a.guestRating || 0));
      
    case 'reviews':
      return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      
    case '5-star':
      return list.sort((a, b) => (b.starCategory || 0) - (a.starCategory || 0));
      
    case '3-star':
      return list.sort((a, b) => {
        const aDiff = Math.abs((a.starCategory || 0) - 3);
        const bDiff = Math.abs((b.starCategory || 0) - 3);
        return aDiff - bDiff;
      });
      
    case 'budget': {
      const priceRank = { '₹': 1, '₹₹': 2, '₹₹₹': 3, '₹₹₹₹': 4 };
      return list.sort((a, b) => (priceRank[a.priceLevel] || 3) - (priceRank[b.priceLevel] || 3));
    }
      
    case 'family':
      return list.sort((a, b) => (b.familyFriendly ? 1 : 0) - (a.familyFriendly ? 1 : 0));
      
    case 'best-overall':
      return list.sort((a, b) => {
        const aScore = (a.guestRating || 4) * 20 + Math.min(a.reviewCount || 0, 5000) / 100 - (a.distanceInKm || 10);
        const bScore = (b.guestRating || 4) * 20 + Math.min(b.reviewCount || 0, 5000) / 100 - (b.distanceInKm || 10);
        return bScore - aScore;
      });
      
    case 'recommended':
    default:
      // Recommended prioritizes safety/trust, verified status, proximity, and guest sentiment
      return list.sort((a, b) => {
        const aSafety = computeSafetyScore(a);
        const bSafety = computeSafetyScore(b);
        const aDist = a.distanceInKm != null ? a.distanceInKm : 10;
        const bDist = b.distanceInKm != null ? b.distanceInKm : 10;
        
        // Safety weighted highest, followed by proximity and rating
        const aComposite = aSafety * 1.5 + (a.guestRating || 4) * 10 - aDist * 2;
        const bComposite = bSafety * 1.5 + (b.guestRating || 4) * 10 - bDist * 2;
        return bComposite - aComposite;
      });
  }
}
