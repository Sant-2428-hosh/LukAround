import { EMERGENCY_FACILITIES } from '../data/emergencyFacilitiesData.js';

/**
 * Calculates straight-line distance in kilometres using the Haversine formula.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's mean radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Realistic road travel time estimate based on Indian urban and highway conditions.
 */
export function estimateRoadTransitTime(distanceKm) {
  if (distanceKm == null) return null;
  if (distanceKm <= 0.8) return '3–5 mins (Walking / Quick Auto)';
  if (distanceKm <= 2) return `~${Math.round(distanceKm * 3.5 + 2)} mins by road`;
  if (distanceKm <= 5) return `~${Math.round(distanceKm * 2.8 + 4)} mins by road`;
  return `~${Math.round(distanceKm * 2.2 + 8)} mins by road`;
}

/**
 * Official Central Emergency Services in India
 */
export const OFFICIAL_EMERGENCY_SERVICES = [
  {
    code: '112',
    name: 'National Emergency Response Support System (ERSS)',
    shortDesc: 'Single unified emergency number for Police, Fire, Ambulance & Disaster Response',
    category: 'national_emergency',
    badge: 'Pan-India 24/7',
    officialUrl: 'https://112.gov.in/',
    sourceName: 'Ministry of Home Affairs, Government of India',
    operatingHours: '24/7 Toll-Free Emergency Dispatch',
    telLink: 'tel:112',
    isPrimary: true
  },
  {
    code: '1363',
    altCode: '1800-11-1363',
    name: 'Ministry of Tourism 24/7 Multi-Lingual Tourist Helpline',
    shortDesc: 'Official tourist information and assistance for travelers in distress. Available in 12 languages.',
    category: 'tourist_helpline',
    badge: 'Toll-Free 24/7 Multi-Lingual',
    officialUrl: 'https://www.incredibleindia.gov.in/',
    sourceName: 'Ministry of Tourism, Government of India',
    operatingHours: '24/7 Multi-Lingual (English, Hindi, German, French, Spanish, Japanese, etc.)',
    telLink: 'tel:1363',
    isPrimary: true,
    guidance: 'Provides tourist guidance, fraud reporting, and language interpretation. For urgent life safety dispatch, dial 112.'
  },
  {
    code: '108',
    name: 'Emergency Medical Services (Ambulance)',
    shortDesc: 'Immediate medical dispatch, accident trauma response, and critical care ambulance transport.',
    category: 'ambulance',
    badge: 'National Health Mission',
    officialUrl: 'https://nhm.gov.in/',
    sourceName: 'National Health Mission / State Health Departments',
    operatingHours: '24/7 Toll-Free Medical Dispatch',
    telLink: 'tel:108',
    isPrimary: false
  },
  {
    code: '1091',
    altCode: '181',
    name: 'Women in Distress Helpline',
    shortDesc: 'Dedicated 24/7 emergency response, safety rescue, and counseling for women travelers.',
    category: 'women_safety',
    badge: '24/7 Women Rescue',
    officialUrl: 'https://wcd.nic.in/',
    sourceName: 'Ministry of Women and Child Development',
    operatingHours: '24/7 Toll-Free Police Response',
    telLink: 'tel:1091',
    isPrimary: false
  },
  {
    code: '101',
    name: 'Fire & Rescue Services',
    shortDesc: 'Emergency fire fighting, structural rescue, and disaster mitigation.',
    category: 'fire',
    badge: 'Fire Department',
    officialUrl: 'https://ndmindia.mha.gov.in/',
    sourceName: 'State Fire and Emergency Services',
    operatingHours: '24/7 Toll-Free Dispatch',
    telLink: 'tel:101',
    isPrimary: false
  },
  {
    code: '1098',
    name: 'Childline Emergency',
    shortDesc: '24-hour nationwide emergency service for children in need of aid and protection.',
    category: 'childline',
    badge: 'Child Protection',
    officialUrl: 'https://childlineindia.org/',
    sourceName: 'Ministry of Women & Child Development',
    operatingHours: '24/7 Toll-Free Support',
    telLink: 'tel:1098',
    isPrimary: false
  },
  {
    code: '139',
    name: 'Rail Madad / Railway Security',
    shortDesc: 'Single unified helpline for passenger security, medical aid, and assistance during train journeys.',
    category: 'railway',
    badge: 'Indian Railways',
    officialUrl: 'https://railmadad.indianrailways.gov.in/',
    sourceName: 'Railway Protection Force (RPF) / Indian Railways',
    operatingHours: '24/7 Security Assistance',
    telLink: 'tel:139',
    isPrimary: false
  }
];

/**
 * Returns destination-specific travel advisories and official security guidance.
 */
export function getDestinationSafetyAdvisories(city, state, attractionType = null) {
  const generalTips = [
    {
      title: 'Unified National Emergency Access (112)',
      detail: 'Dial 112 from any Indian or international roaming mobile connection for unified police, medical, and fire dispatch. It works with or without SIM credit.',
      verifiedSource: 'ERSS India (112.gov.in)'
    },
    {
      title: 'Authorized Transport & Transparent Fares',
      detail: 'At major airports, railway stations, and heritage monuments, utilize government prepaid taxi/auto booths or verified ride-hailing apps (Ola, Uber) to prevent overcharging.',
      verifiedSource: 'Ministry of Tourism Advisory'
    },
    {
      title: '24/7 Multi-Lingual Tourist Support (1363)',
      detail: 'Ministry of Tourism operates 1363 toll-free in 12 languages. Save this number for legitimate tourist guidance, ticket verification, and transit disputes.',
      verifiedSource: 'Incredible India Portal'
    },
    {
      title: 'Digital Credential Storage & Offline Copies',
      detail: 'Keep password-protected offline scans of your Passport, Visa, and government ID. Never hand over original passport documents as collateral to local vehicle rental vendors.',
      verifiedSource: 'Bureau of Immigration India'
    }
  ];

  const cityLower = (city || '').toLowerCase();
  const stateLower = (state || '').toLowerCase();

  // Hill station / Western Ghats / Himalayan terrain
  if (
    cityLower.includes('munnar') ||
    cityLower.includes('ooty') ||
    cityLower.includes('kodaikanal') ||
    cityLower.includes('darjeeling') ||
    cityLower.includes('nainital') ||
    cityLower.includes('mussoorie') ||
    cityLower.includes('rishikesh') ||
    cityLower.includes('coorg') ||
    cityLower.includes('wayanad') ||
    stateLower.includes('uttarakhand')
  ) {
    generalTips.unshift({
      title: 'Mountain & Hill Terrain Safety',
      detail: 'Mountain roads experience seasonal fog and sudden rains. Avoid driving ghat sections post-sunset. Check mountain highway status during monsoon months before venturing out.',
      verifiedSource: 'State Disaster Management Authority (SDMA)'
    });
  }

  // Coastal / Beach precinct
  if (
    cityLower.includes('goa') ||
    cityLower.includes('puri') ||
    cityLower.includes('mahabalipuram') ||
    cityLower.includes('chennai') ||
    cityLower.includes('alappuzha') ||
    cityLower.includes('kochi') ||
    cityLower.includes('visakhapatnam') ||
    cityLower.includes('dwarka')
  ) {
    generalTips.unshift({
      title: 'Coastal Water & Rip Current Safety',
      detail: 'Adhere strictly to red-flag warning markers on beaches. High-tide rip currents can be hazardous along open sea beaches. Swim only in demarcated areas monitored by certified lifeguards.',
      verifiedSource: 'Coastal Police & National Lifesaving Society'
    });
  }

  // Major High-Footfall Temple & Heritage Shrine
  if (
    cityLower.includes('varanasi') ||
    cityLower.includes('ayodhya') ||
    cityLower.includes('mathura') ||
    cityLower.includes('madurai') ||
    cityLower.includes('thanjavur') ||
    cityLower.includes('tirupati') ||
    cityLower.includes('amritsar') ||
    cityLower.includes('puri') ||
    cityLower.includes('bodh gaya')
  ) {
    generalTips.unshift({
      title: 'Pilgrim Corridor & Footwear Protocol',
      detail: 'Leave footwear only at official free temple cloakrooms (Devasthanam/Trust counters). Avoid unbadged touts promising queue-skipping VIP darshan; utilize only official trust counters or temple websites.',
      verifiedSource: 'State Religious Endowment & Temple Administration'
    });
  }

  return generalTips;
}

/**
 * Searches and ranks nearby verified emergency facilities for a target destination.
 * Strictly enforces geographical distance and returns honest location-relevant results.
 */
export function getNearbyEmergencyFacilities({
  targetLat,
  targetLng,
  cityName,
  stateName,
  radiusKm = 10,
  facilityTypeFilter = 'all'
}) {
  let facilities = [...EMERGENCY_FACILITIES];

  // If coordinates are missing, attempt matching solely within requested city / state
  if (targetLat == null || targetLng == null) {
    if (cityName) {
      const cLower = cityName.toLowerCase();
      facilities = facilities.filter(
        (f) => f.city && f.city.toLowerCase().includes(cLower)
      );
    } else if (stateName) {
      const sLower = stateName.toLowerCase();
      facilities = facilities.filter(
        (f) => f.state && f.state.toLowerCase().includes(sLower)
      );
    } else {
      facilities = [];
    }

    if (facilities.length === 0) {
      return {
        allFacilities: [],
        policeStations: [],
        hospitals: [],
        outOfRadiusNotice: false,
        totalCount: 0,
        nearestPolice: null,
        nearestHospital: null,
        unresolvedLocation: true
      };
    }
  }

  // Compute distances & Google Maps URLs
  const mapped = facilities
    .map((f) => {
      let distanceKm = null;
      let roadTime = null;

      if (targetLat != null && targetLng != null && f.latitude != null && f.longitude != null) {
        distanceKm = calculateHaversineDistance(
          targetLat,
          targetLng,
          f.latitude,
          f.longitude
        );
        roadTime = estimateRoadTransitTime(distanceKm);
      }

      const mapsQuery = encodeURIComponent(`${f.name}, ${f.address}`);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

      let directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        `${f.latitude},${f.longitude}`
      )}`;
      if (targetLat != null && targetLng != null) {
        directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${targetLat},${targetLng}&destination=${f.latitude},${f.longitude}`;
      }

      return {
        ...f,
        distanceKm,
        roadTime,
        mapsUrl,
        directionsUrl
      };
    })
    .filter((f) => {
      // If coordinates are available, strictly filter within radiusKm
      if (targetLat != null && targetLng != null) {
        return f.distanceKm != null && f.distanceKm <= radiusKm;
      }
      return true;
    });

  // Sort strictly by proximity to target coordinates
  if (targetLat != null && targetLng != null) {
    mapped.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
  }

  // Filter by category type
  let finalResults = mapped;
  if (facilityTypeFilter === 'police') {
    finalResults = mapped.filter(
      (f) => f.facilityType === 'police_station' || f.facilityType === 'tourist_police'
    );
  } else if (facilityTypeFilter === 'hospitals') {
    finalResults = mapped.filter(
      (f) => f.facilityType === 'hospital' || f.facilityType === 'trauma_center' || f.facilityType === 'urgent_care'
    );
  }

  const policeStations = finalResults.filter(
    (f) => f.facilityType === 'police_station' || f.facilityType === 'tourist_police'
  );

  const hospitals = finalResults.filter(
    (f) => f.facilityType === 'hospital' || f.facilityType === 'trauma_center' || f.facilityType === 'urgent_care'
  );

  const outOfRadiusNotice = mapped.length === 0;

  return {
    allFacilities: finalResults,
    policeStations,
    hospitals,
    outOfRadiusNotice,
    totalCount: finalResults.length,
    nearestPolice: policeStations[0] || null,
    nearestHospital: hospitals[0] || null
  };
}
