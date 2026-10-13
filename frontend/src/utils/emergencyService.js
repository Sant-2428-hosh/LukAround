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
      detail: 'Dial 112 from any Indian or international roaming mobile connection for unified police, medical, and fire dispatch. It operates 24/7 with or without active SIM balance.',
      category: 'emergency',
      icon: 'Siren',
      verifiedSource: 'ERSS India (112.gov.in)'
    },
    {
      title: 'Authorized Transport & Fair Pricing',
      detail: 'At major airports, railway junctions, and heritage hubs, always use government pre-paid taxi/auto booths or verified ride-hailing apps (Ola, Uber) to guarantee transparent, GPS-monitored fares.',
      category: 'transport',
      icon: 'Car',
      verifiedSource: 'Ministry of Tourism Advisory'
    },
    {
      title: '24/7 Multi-Lingual Tourist Support (1363)',
      detail: 'Ministry of Tourism operates 1363 toll-free in 12 global languages. Call for authorized guide verification, ticketing guidance, grievance reporting, and translation aid.',
      category: 'helpline',
      icon: 'Phone',
      verifiedSource: 'Incredible India Portal'
    },
    {
      title: 'Digital Credential Storage & Safe Documents',
      detail: 'Carry password-protected offline digital copies of your Passport, Visa, and government ID. Never hand over your original passport or ID as a collateral deposit for scooter/car rentals.',
      category: 'documents',
      icon: 'CreditCard',
      verifiedSource: 'Bureau of Immigration India'
    },
    {
      title: 'Safe Hydration & Culinary Hygiene',
      detail: 'Consume packaged drinking water from sealed, BIS-certified bottles (Kinley, Aquafina, Bisleri). Prefer freshly cooked, hot meals at busy reputable dining establishments.',
      category: 'health',
      icon: 'Utensils',
      verifiedSource: 'Food Safety and Standards Authority of India (FSSAI)'
    },
    {
      title: 'Women Traveler Support & Safe Transit (1091)',
      detail: 'Dedicated round-the-clock women safety helplines (1091 & 181) provide immediate police intervention. Most metro networks (Delhi, Chennai, Mumbai) and local trains feature dedicated women coaches.',
      category: 'women_safety',
      icon: 'ShieldCheck',
      verifiedSource: 'Ministry of Women & Child Development'
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
    stateLower.includes('uttarakhand') ||
    stateLower.includes('himachal')
  ) {
    generalTips.unshift({
      title: 'Mountain Road & Hill Terrain Safety',
      detail: 'Mountain roads frequently experience heavy fog, steep bends, and monsoon showers. Avoid driving ghat sections post-sunset. Check mountain highway status during monsoon months before venturing out.',
      category: 'terrain',
      icon: 'Compass',
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
    cityLower.includes('dwarka') ||
    cityLower.includes('kanyakumari')
  ) {
    generalTips.unshift({
      title: 'Coastal Water & Rip Current Safety',
      detail: 'Adhere strictly to red-flag warning markers on beaches. High-tide rip currents can be hazardous along open sea beaches. Swim only in demarcated zones monitored by certified lifeguards.',
      category: 'coastal',
      icon: 'ShieldAlert',
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
    cityLower.includes('bodh gaya') ||
    cityLower.includes('haridwar')
  ) {
    generalTips.unshift({
      title: 'Pilgrim Corridor & Footwear Protocol',
      detail: 'Deposit footwear only at official free temple cloakrooms (Devasthanam/Trust counters). Avoid unbadged touts promising queue-skipping VIP darshan; utilize only official trust counters or temple websites.',
      category: 'heritage',
      icon: 'Landmark',
      verifiedSource: 'State Religious Endowment & Temple Administration'
    });
  }

  return generalTips;
}

/**
 * Supported 5 Website Languages for Tourist Emergency Phrasebook
 */
export const PHRASEBOOK_LANGUAGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-IN' }
];

/**
 * High-frequency multilingual emergency phrases for travelers across all 5 official website languages.
 */
export const EMERGENCY_LOCAL_PHRASES = [
  {
    id: 'help',
    english: 'Help me please!',
    context: 'Emergency distress call in public',
    translations: {
      hi: { script: 'मदद कीजिए!', phonetic: 'Madad kijiye!' },
      ta: { script: 'எனக்கு உதவி செய்யுங்கள்!', phonetic: 'Enakku udhavi seiyungal!' },
      te: { script: 'దయచేసి నాకు సహాయం చేయండి!', phonetic: 'Dayachesi naaku sahaayam cheyandi!' },
      kn: { script: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ!', phonetic: 'Dayavittu nanage sahaaya maadi!' },
      en: { script: 'Help me please!', phonetic: 'Help me please!' }
    },
    hindi: 'मदद कीजिए!',
    phonetic: 'Madad kijiye!'
  },
  {
    id: 'police',
    english: 'Call the police immediately!',
    context: 'Theft, harassment, or crime report',
    translations: {
      hi: { script: 'तुरंत पुलिस को बुलाइए!', phonetic: 'Turant police ko bulaiye!' },
      ta: { script: 'உடனே போலீஸை கூப்பிடுங்கள்!', phonetic: 'Udane police-ai kooppidungal!' },
      te: { script: 'వెంటనే పోలీసులను పిలవండి!', phonetic: 'Ventane police-lanu pilavandi!' },
      kn: { script: 'ತಕ್ಷಣ ಪೊಲೀಸರನ್ನು ಕರೆಯಿರಿ!', phonetic: 'Takshana police-annu kareyiri!' },
      en: { script: 'Call the police immediately!', phonetic: 'Call the police immediately!' }
    },
    hindi: 'तुरंत पुलिस को बुलाइए!',
    phonetic: 'Turant police ko bulaiye!'
  },
  {
    id: 'ambulance',
    english: 'I need an ambulance / doctor.',
    context: 'Medical emergency or acute illness',
    translations: {
      hi: { script: 'मुझे एम्बुलेंस / डॉक्टर चाहिए।', phonetic: 'Mujhe ambulance / doctor chahiye.' },
      ta: { script: 'எனக்கு ஆம்புலன்ஸ் / மருத்துவர் தேவை.', phonetic: 'Enakku ambulance / maruthuvar thevai.' },
      te: { script: 'నాకు అంబులెన్స్ / డాక్టర్ కావాలి.', phonetic: 'Naaku ambulance / doctor kaavaali.' },
      kn: { script: 'ನನಗೆ ಆಂಬ್ಯುಲೆನ್ಸ್ / ವೈದ್ಯರು ಬೇಕು.', phonetic: 'Nanage ambulance / vaidyaru beku.' },
      en: { script: 'I need an ambulance / doctor.', phonetic: 'I need an ambulance / doctor.' }
    },
    hindi: 'मुझे एम्बुलेंस / डॉक्टर चाहिए।',
    phonetic: 'Mujhe ambulance / doctor chahiye.'
  },
  {
    id: 'hospital',
    english: 'Where is the nearest hospital?',
    context: 'Urgent medical seeking',
    translations: {
      hi: { script: 'नज़दीकी अस्पताल कहाँ है?', phonetic: 'Nazdeeki aspatal kahan hai?' },
      ta: { script: 'அருகில் உள்ள மருத்துவமனை எங்கே?', phonetic: 'Arugil ulla maruthuvamanai engey?' },
      te: { script: 'దగ్గరలోని ఆసుపత్రి ఎక్కడ ఉంది?', phonetic: 'Daggaraloni aasupatri ekkada undi?' },
      kn: { script: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', phonetic: 'Hattirada aaspatre ellide?' },
      en: { script: 'Where is the nearest hospital?', phonetic: 'Where is the nearest hospital?' }
    },
    hindi: 'नज़दीकी अस्पताल कहाँ है?',
    phonetic: 'Nazdeeki aspatal kahan hai!'
  },
  {
    id: 'lost_items',
    english: 'I lost my bag / passport.',
    context: 'Lost luggage or travel documents',
    translations: {
      hi: { script: 'मेरा बैग / पासपोर्ट खो गया है।', phonetic: 'Mera bag / passport kho gaya hai.' },
      ta: { script: 'என் பை / பாஸ்போர்ட் தொலைந்துவிட்டது.', phonetic: 'En pai / passport tholaindhuvittadhu.' },
      te: { script: 'నా బ్యాగ్ / పాస్‌పోర్ట్ పోయింది.', phonetic: 'Naa bag / passport poyindi.' },
      kn: { script: 'ನನ್ನ ಬ್ಯಾಗ್ / ಪಾಸ್‌ಪೋರ್ಟ್ ಕಳೆದುಹೋಗಿದೆ.', phonetic: 'Nanna bag / passport kaleduhogide.' },
      en: { script: 'I lost my bag / passport.', phonetic: 'I lost my bag / passport.' }
    },
    hindi: 'मेरा बैग / पासपोर्ट खो गया है।',
    phonetic: 'Mera bag / passport kho gaya hai.'
  },
  {
    id: 'take_police_station',
    english: 'Please take me to the police station.',
    context: 'Taxi / Auto driver direction',
    translations: {
      hi: { script: 'कृपया मुझे पुलिस थाने ले चलिए।', phonetic: 'Kripya mujhe police thaane le chaliye.' },
      ta: { script: 'தயவுசெய்து என்னை காவல் நிலையத்திற்கு அழைத்துச் செல்லுங்கள்.', phonetic: 'Dhayavuseidhu ennai kaaval nilayathirku azhaithu chellungal.' },
      te: { script: 'దయచేసి నన్ను పోలీస్ స్టేషన్‌కు తీసుకెళ్లండి.', phonetic: 'Dayachesi nannu police station-ku theesukellandi.' },
      kn: { script: 'ದಯವಿಟ್ಟು ನನ್ನನ್ನು ಪೊಲೀಸ್ ಠಾಣೆಗೆ ಕರೆದೊಯ್ಯಿರಿ.', phonetic: 'Dayavittu nannannu police thanege karedoyyiri.' },
      en: { script: 'Please take me to the police station.', phonetic: 'Please take me to the police station.' }
    },
    hindi: 'कृपया मुझे पुलिस थाने ले चलिए।',
    phonetic: 'Kripya mujhe police thaane le chaliye.'
  },
  {
    id: 'danger',
    english: 'I am in danger, please help!',
    context: 'Immediate personal safety threat',
    translations: {
      hi: { script: 'मैं खतरे में हूँ, कृपया मदद करें!', phonetic: 'Main khatre mein hoon, kripya madad karein!' },
      ta: { script: 'நான் ஆபத்தில் இருக்கிறேன், உதவுங்கள்!', phonetic: 'Naan aabathil irukkiren, udhavungal!' },
      te: { script: 'నేను ప్రమాదంలో ఉన్నాను, సహాయం చేయండి!', phonetic: 'Nenu pramaadamlo unnaanu, sahaayam cheyandi!' },
      kn: { script: 'ನಾನು ಅಪಾಯದಲ್ಲಿದ್ದೇನೆ, ಸಹಾಯ ಮಾಡಿ!', phonetic: 'Naanu apaayadalliddene, sahaaya maadi!' },
      en: { script: 'I am in danger, please help!', phonetic: 'I am in danger, please help!' }
    },
    hindi: 'मैं खतरे में हूँ, कृपया मदद करें!',
    phonetic: 'Main khatre mein hoon, kripya madad karein!'
  },
  {
    id: 'tourist_desk',
    english: 'Where is the tourist police desk?',
    context: 'Tourist assistance & scam reporting',
    translations: {
      hi: { script: 'पर्यटक पुलिस बूथ कहाँ है?', phonetic: 'Paryatak police booth kahan hai?' },
      ta: { script: 'சுற்றுலா போலீஸ் உதவி மையம் எங்கே?', phonetic: 'Sutrula police udhavi maiyam engey?' },
      te: { script: 'టూరిస్ట్ పోలీస్ బూత్ ఎక్కడ ఉంది?', phonetic: 'Tourist police booth ekkada undi?' },
      kn: { script: 'ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಬೂತ್ ಎಲ್ಲಿದೆ?', phonetic: 'Pravasi police booth ellide?' },
      en: { script: 'Where is the tourist police desk?', phonetic: 'Where is the tourist police desk?' }
    },
    hindi: 'पर्यटक पुलिस बूथ कहाँ है?',
    phonetic: 'Paryatak police booth kahan hai?'
  }
];

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
