/**
 * transitBookingService.js
 * Official transportation ticket booking services, government portal registries,
 * and direct deep-linking for flights, Indian Railways (IRCTC), state government RTC buses,
 * and highway navigation across all Indian destinations.
 */

/**
 * Registry of official State Road Transport Corporations (RTCs) and Government Bus Booking Portals
 */
export const STATE_OFFICIAL_BUS_PORTALS = {
  'tamil-nadu': {
    code: 'TNSTC',
    name: 'TNSTC / SETC',
    fullName: 'Tamil Nadu State Transport Corporation',
    url: 'https://www.tnstc.in',
    badge: 'Govt of Tamil Nadu',
    helpline: '044-23455825',
    onlineBooking: true
  },
  'karnataka': {
    code: 'KSRTC',
    name: 'KSRTC',
    fullName: 'Karnataka State Road Transport Corporation',
    url: 'https://www.ksrtc.in',
    badge: 'Govt of Karnataka',
    helpline: '080-49596666',
    onlineBooking: true
  },
  'rajasthan': {
    code: 'RSRTC',
    name: 'RSRTC',
    fullName: 'Rajasthan State Road Transport Corporation',
    url: 'https://rsrtconline.rajasthan.gov.in',
    badge: 'Govt of Rajasthan',
    helpline: '0141-2373044',
    onlineBooking: true
  },
  'uttar-pradesh': {
    code: 'UPSRTC',
    name: 'UPSRTC',
    fullName: 'Uttar Pradesh State Road Transport Corporation',
    url: 'https://www.upsrtc.com',
    badge: 'Govt of Uttar Pradesh',
    helpline: '1800-180-2877',
    onlineBooking: true
  },
  'maharashtra': {
    code: 'MSRTC',
    name: 'MSRTC',
    fullName: 'Maharashtra State Road Transport Corporation',
    url: 'https://msrtc.maharashtra.gov.in',
    badge: 'Govt of Maharashtra',
    helpline: '022-23071524',
    onlineBooking: true
  },
  'kerala': {
    code: 'KSRTC-KER',
    name: 'Kerala RTC',
    fullName: 'Kerala State Road Transport Corporation',
    url: 'https://online.keralartc.com',
    badge: 'Govt of Kerala',
    helpline: '0471-2463799',
    onlineBooking: true
  },
  'andhra-pradesh': {
    code: 'APSRTC',
    name: 'APSRTC',
    fullName: 'Andhra Pradesh State Road Transport Corporation',
    url: 'https://www.apsrtconline.in',
    badge: 'Govt of Andhra Pradesh',
    helpline: '0866-2570005',
    onlineBooking: true
  },
  'telangana': {
    code: 'TSRTC',
    name: 'TSRTC',
    fullName: 'Telangana State Road Transport Corporation',
    url: 'https://www.tsrtconline.in',
    badge: 'Govt of Telangana',
    helpline: '040-69440000',
    onlineBooking: true
  },
  'gujarat': {
    code: 'GSRTC',
    name: 'GSRTC',
    fullName: 'Gujarat State Road Transport Corporation',
    url: 'https://www.gsrtc.in',
    badge: 'Govt of Gujarat',
    helpline: '1800-233-6655',
    onlineBooking: true
  },
  'west-bengal': {
    code: 'WBTC',
    name: 'WBTC / SBSTC',
    fullName: 'South Bengal State Transport Corporation',
    url: 'https://online.sbstc.co.in',
    badge: 'Govt of West Bengal',
    helpline: '1800-345-3215',
    onlineBooking: true
  },
  'madhya-pradesh': {
    code: 'MP-RTC',
    name: 'MP Tourism & AICTSL',
    fullName: 'Madhya Pradesh Intercity Bus Services',
    url: 'https://www.redbus.in/bus-tickets/madhya-pradesh',
    badge: 'MP Tourism Certified',
    helpline: '1800-233-7777',
    onlineBooking: true
  },
  'uttarakhand': {
    code: 'UTC',
    name: 'UTC',
    fullName: 'Uttarakhand Transport Corporation',
    url: 'https://utconline.uk.gov.in',
    badge: 'Govt of Uttarakhand',
    helpline: '1800-180-4145',
    onlineBooking: true
  },
  'goa': {
    code: 'KTCL',
    name: 'Kadamba Transport (KTCL)',
    fullName: 'Kadamba Transport Corporation Limited',
    url: 'https://ktclgoa.com',
    badge: 'Govt of Goa',
    helpline: '0832-2438015',
    onlineBooking: true
  },
  'himachal-pradesh': {
    code: 'HRTC',
    name: 'HRTC',
    fullName: 'Himachal Road Transport Corporation',
    url: 'https://www.hrtchp.com',
    badge: 'Govt of Himachal',
    helpline: '0177-2658032',
    onlineBooking: true
  },
  'punjab': {
    code: 'PUNBUS',
    name: 'PUNBUS / PRTC',
    fullName: 'Punjab Roadways & PRTC Online',
    url: 'https://www.punbusonline.com',
    badge: 'Govt of Punjab',
    helpline: '0172-2704430',
    onlineBooking: true
  },
  'bihar': {
    code: 'BSRTC',
    name: 'BSRTC',
    fullName: 'Bihar State Road Transport Corporation',
    url: 'https://transport.bihar.gov.in',
    badge: 'Govt of Bihar',
    helpline: '0612-2222223',
    onlineBooking: true
  },
  'odisha': {
    code: 'OSRTC',
    name: 'OSRTC',
    fullName: 'Odisha State Road Transport Corporation',
    url: 'https://www.osrtc.in',
    badge: 'Govt of Odisha',
    helpline: '1800-345-1122',
    onlineBooking: true
  },
  'delhi': {
    code: 'DTC',
    name: 'DTC & Delhi Metro',
    fullName: 'Delhi Transport Corporation & DMRC',
    url: 'https://www.delhimetrorail.com',
    badge: 'Govt of NCT Delhi',
    helpline: '011-23417910',
    onlineBooking: true
  }
};

/**
 * Verified dictionary of Indian airports mapped to exact 3-letter IATA codes & official names
 */
export const KNOWN_AIRPORT_CODES = {
  'chhatrapati shivaji maharaj international (lucknow - lko)': { code: 'LKO', name: 'Chaudhary Charan Singh International (Lucknow)' },
  'lal bahadur shastri international (varanasi - vns)': { code: 'VNS', name: 'Lal Bahadur Shastri International (Varanasi)' },
  'maharishi valmiki international (ayodhya - ayj)': { code: 'AYJ', name: 'Maharishi Valmiki International (Ayodhya)' },
  'agra airport (agr)': { code: 'AGR', name: 'Agra Airport' },
  'chennai international (maa)': { code: 'MAA', name: 'Chennai International' },
  'coimbatore international (cjb)': { code: 'CJB', name: 'Coimbatore International' },
  'madurai international (ixm)': { code: 'IXM', name: 'Madurai International' },
  'tiruchirappalli international (trz)': { code: 'TRZ', name: 'Tiruchirappalli International' },
  'kempegowda international bengaluru (blr)': { code: 'BLR', name: 'Kempegowda International Bengaluru' },
  'mangaluru international (ixe)': { code: 'IXE', name: 'Mangaluru International' },
  'mysuru airport (myq)': { code: 'MYQ', name: 'Mysuru Airport' },
  'hubballi airport (hbx)': { code: 'HBX', name: 'Hubballi Airport' },
  'visakhapatnam international (vtz)': { code: 'VTZ', name: 'Visakhapatnam International' },
  'vijayawada international (vga)': { code: 'VGA', name: 'Vijayawada International' },
  'tirupati airport (tir)': { code: 'TIR', name: 'Tirupati Airport' },
  'rajahmundry airport (rja)': { code: 'RJA', name: 'Rajahmundry Airport' },
  'jaipur international (jai)': { code: 'JAI', name: 'Jaipur International' },
  'udaipur maharana pratap (udr)': { code: 'UDR', name: 'Maharana Pratap Airport Udaipur' },
  'jodhpur airport (jdh)': { code: 'JDH', name: 'Jodhpur Airport' },
  'jaisalmer airport (jsa)': { code: 'JSA', name: 'Jaisalmer Airport' },
  'chhatrapati shivaji maharaj international mumbai (bom)': { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Mumbai' },
  'pune international (pnq)': { code: 'PNQ', name: 'Pune International' },
  'dr. babasaheb ambedkar nagpur (nag)': { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Nagpur' },
  'shirdi airport (sag)': { code: 'SAG', name: 'Shirdi Airport' },
  'netaji subhash chandra bose international kolkata (ccu)': { code: 'CCU', name: 'Netaji Subhash Chandra Bose International Kolkata' },
  'bagdogra airport siliguri (ixb)': { code: 'IXB', name: 'Bagdogra Airport Siliguri' },
  'kazi nazrul islam durgapur (rdp)': { code: 'RDP', name: 'Kazi Nazrul Islam Airport Durgapur' },
  'sardar vallabhbhai patel international ahmedabad (amd)': { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Ahmedabad' },
  'surat airport (stv)': { code: 'STV', name: 'Surat Airport' },
  'vadodara airport (bdq)': { code: 'BDQ', name: 'Vadodara Airport' },
  'rajkot international (hsr)': { code: 'HSR', name: 'Rajkot International' },
  'devi ahilyabai holkar indore (idr)': { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport Indore' },
  'raja bhoj bhopal (bho)': { code: 'BHO', name: 'Raja Bhoj Airport Bhopal' },
  'gwalior airport (gwl)': { code: 'GWL', name: 'Rajmata Vijaya Raje Scindia Airport Gwalior' },
  'khajuraho airport (hjr)': { code: 'HJR', name: 'Khajuraho Airport' },
  'jabalpur airport (jlr)': { code: 'JLR', name: 'Jabalpur Airport' },
  'rajiv gandhi international hyderabad (hyd - world ranked)': { code: 'HYD', name: 'Rajiv Gandhi International Hyderabad' },
  'cochin international (cok - world\'s 1st solar-powered airport)': { code: 'COK', name: 'Cochin International' },
  'trivandrum international (trv)': { code: 'TRV', name: 'Thiruvananthapuram International' },
  'calicut international (ccj)': { code: 'CCJ', name: 'Calicut International' },
  'kannur international (cnn)': { code: 'CNN', name: 'Kannur International' },
  'jay prakash narayan international patna (pat)': { code: 'PAT', name: 'Jay Prakash Narayan International Patna' },
  'gaya international (gay - major pilgrimage gateway)': { code: 'GAY', name: 'Gaya International' },
  'darbhanga airport (dbr)': { code: 'DBR', name: 'Darbhanga Airport' },
  'biju patnaik international bhubaneswar (bbi)': { code: 'BBI', name: 'Biju Patnaik International Bhubaneswar' },
  'jharsuguda veer surendra sai (jrg)': { code: 'JRG', name: 'Veer Surendra Sai Airport Jharsuguda' },
  'sri guru ram dass jee international amritsar (atq)': { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International Amritsar' },
  'shaheed bhagat singh international chandigarh (ixc)': { code: 'IXC', name: 'Shaheed Bhagat Singh International Chandigarh' },
  'jolly grant airport dehradun (ded)': { code: 'DED', name: 'Jolly Grant Airport Dehradun' },
  'pantnagar airport (pgh)': { code: 'PGH', name: 'Pantnagar Airport' },
  'manohar international airport mopa (gox)': { code: 'GOX', name: 'Manohar International Airport Mopa Goa' },
  'dabolim international airport (goi)': { code: 'GOI', name: 'Dabolim International Airport Goa' }
};

/**
 * Verified dictionary of Indian Railways stations mapped to exact IRCTC Station Codes
 */
export const KNOWN_STATION_CODES = {
  'prayagraj junction': 'PRYJ',
  'varanasi junction': 'BSB',
  'lucknow charbagh': 'LKO',
  'agra cantt': 'AGC',
  'kanpur central': 'CNB',
  'mathura junction': 'MTJ',
  'chennai central': 'MAS',
  'madurai junction': 'MDU',
  'coimbatore junction': 'CBE',
  'tiruchirappalli junction': 'TPJ',
  'ksr bengaluru': 'SBC',
  'yesvantpur junction': 'YPR',
  'mysuru junction': 'MYS',
  'hubballi junction': 'UBL',
  'visakhapatnam junction': 'VSKP',
  'vijayawada junction': 'BZA',
  'tirupati railway station': 'TPTY',
  'jaipur junction': 'JP',
  'jodhpur junction': 'JU',
  'udaipur city': 'UDZ',
  'ajmer junction': 'AII',
  'chhatrapati shivaji maharaj terminus': 'CSMT',
  'mumbai central': 'MMCT',
  'pune junction': 'PUNE',
  'howrah junction': 'HWH',
  'sealdah': 'SDAH',
  'new jalpaiguri': 'NJP',
  'ahmedabad junction': 'ADI',
  'surat railway station': 'ST',
  'vadodara junction': 'BRC',
  'bhopal junction': 'BPL',
  'rani kamlapati': 'RKMP',
  'indore junction': 'INDB',
  'gwalior junction': 'GWL',
  'secunderabad junction': 'SC',
  'hyderabad deccan': 'HYB',
  'kacheguda': 'KCG',
  'kazipet junction': 'KZJ',
  'ernakulam junction': 'ERS',
  'thiruvananthapuram central': 'TVC',
  'kozhikode': 'CLT',
  'shoranur junction': 'SRR',
  'patna junction': 'PNBE',
  'gaya junction': 'GAYA',
  'pandit deen dayal upadhyaya junction': 'DDU',
  'muzaffarpur junction': 'MFP',
  'bhubaneswar railway station': 'BBS',
  'puri railway station': 'PURI',
  'cuttack junction': 'CTC',
  'amritsar junction': 'ASR',
  'ludhiana junction': 'LDH',
  'jalandhar city': 'JUC',
  'bathinda junction': 'BTI',
  'haridwar railway station': 'HW',
  'dehradun railway station': 'DDN',
  'kathgodam': 'KGM',
  'madgaon junction': 'MAO',
  'vasco da gama': 'VSG',
  'thivim railway station': 'THVM',
  'karmali railway station': 'KRMI'
};

/**
 * Official Indian Travel Portals & Direct Booking Services
 */
export const OFFICIAL_TRAVEL_PORTALS = {
  trains: [
    {
      name: 'IRCTC Next-Gen e-Ticketing',
      portal: 'Official IRCTC Portal',
      url: 'https://www.irctc.co.in/nget/train-search',
      authority: 'Ministry of Railways, Govt of India',
      badge: 'Official Govt Portal',
      icon: 'train'
    },
    {
      name: 'National Train Enquiry System (NTES)',
      portal: 'Live Train Running Status',
      url: 'https://enquiry.indianrail.gov.in',
      authority: 'Indian Railways / CRIS',
      badge: 'Live Govt Tracking',
      icon: 'radar'
    },
    {
      name: 'ConfirmTkt / RailYatri',
      portal: 'Seat Availability & PNR Status',
      url: 'https://www.confirmtkt.com',
      authority: 'IRCTC Authorized Partner',
      badge: 'Instant Prediction',
      icon: 'check'
    }
  ],
  flights: [
    {
      name: 'Google Flights',
      portal: 'Live Fare Comparison & Schedules',
      url: 'https://www.google.com/travel/flights',
      authority: 'Global Airline Aggregator',
      badge: 'Live Lowest Fare',
      icon: 'search'
    },
    {
      name: 'MakeMyTrip Flights',
      portal: 'Instant Booking & Web Check-in',
      url: 'https://www.makemytrip.com/flights/',
      authority: 'IATA Accredited Agency',
      badge: 'Direct e-Tickets',
      icon: 'ticket'
    },
    {
      name: 'Airports Authority of India (AAI)',
      portal: 'Official Terminal Guidelines',
      url: 'https://www.aai.aero',
      authority: 'Ministry of Civil Aviation, Govt of India',
      badge: 'Govt Aviation Authority',
      icon: 'plane'
    }
  ],
  buses: [
    {
      name: 'Official State RTC Services',
      portal: 'Government State Bus Tickets',
      url: 'https://www.redbus.in/rtc',
      authority: 'State Transport Undertakings',
      badge: 'Official RTC Booking',
      icon: 'bus'
    },
    {
      name: 'IRCTC Tourism Bus Service',
      portal: 'Inter-City AC & Deluxe Coaches',
      url: 'https://www.bus.irctc.co.in',
      authority: 'IRCTC / Govt of India',
      badge: 'Official IRCTC Bus',
      icon: 'shield'
    }
  ],
  monuments: [
    {
      name: 'Archaeological Survey of India (ASI)',
      portal: 'Official Monument Entry e-Tickets',
      url: 'https://asi.payumoney.com',
      authority: 'Ministry of Culture, Govt of India',
      badge: 'Official Monument Portal',
      icon: 'landmark'
    }
  ]
};

/**
 * Helper to get the official bus portal for a state
 */
export function getStateBusPortal(stateSlug = '') {
  const normalizedSlug = (stateSlug || '').toLowerCase().replace(/\s+/g, '-');
  return STATE_OFFICIAL_BUS_PORTALS[normalizedSlug] || null;
}

/**
 * Parses airport string (e.g. "Chennai International (MAA)") into rich booking data
 */
export function parseAirportInfo(airportStr, stateName = '') {
  if (!airportStr) return null;

  const rawLower = airportStr.toLowerCase().trim();
  let code = '';
  let cleanName = airportStr;

  // 1. Check known airport dictionary first
  if (KNOWN_AIRPORT_CODES[rawLower]) {
    code = KNOWN_AIRPORT_CODES[rawLower].code;
    cleanName = KNOWN_AIRPORT_CODES[rawLower].name;
  } else {
    // 2. Regex fallback for (XXX) or (City - XXX) or (XXX - description)
    const m = airportStr.match(/\((?:[^-)]*-\s*)?([A-Z]{3})(?:\s*-[^)]*)?\)/) || airportStr.match(/\(([A-Z]{3})\)/);
    if (m) {
      code = m[1];
      cleanName = airportStr.replace(/\([^)]*\)/g, '').trim();
    } else {
      cleanName = airportStr.replace(/\([^)]*\)/g, '').trim();
    }
  }

  // Deep-links
  const flightSearchQuery = code || `${cleanName} ${stateName}`;
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(flightSearchQuery)}`;
  const mmtUrl = `https://www.makemytrip.com/flights/`;
  const liveStatusUrl = code
    ? `https://www.flightradar24.com/data/airports/${code.toLowerCase()}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${cleanName} airport flight arrivals departures schedule`)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cleanName} Airport ${stateName}`)}`;

  return {
    raw: airportStr,
    name: cleanName,
    code,
    googleFlightsUrl,
    mmtUrl,
    liveStatusUrl,
    mapsUrl,
    hasIataCode: !!code
  };
}

/**
 * Parses railway station string (e.g. "Chennai Central (MAS)" or "Madurai Junction") into rich booking data
 */
export function parseRailwayInfo(stationStr, stateName = '') {
  if (!stationStr) return null;

  const rawLower = stationStr.toLowerCase().trim();
  let code = '';
  let cleanName = stationStr.replace(/\([^)]*\)/g, '').trim();

  // 1. Check explicit parentheses
  const codeMatch = stationStr.match(/\(([A-Z]{2,4})\)/);
  if (codeMatch) {
    code = codeMatch[1];
  } else {
    // 2. Check known station codes dictionary
    for (const [key, knownCode] of Object.entries(KNOWN_STATION_CODES)) {
      if (rawLower.includes(key) || key.includes(rawLower)) {
        code = knownCode;
        break;
      }
    }
  }

  // Official IRCTC booking portal
  const irctcUrl = 'https://www.irctc.co.in/nget/train-search';
  const liveTrainUrl = `https://www.railyatri.in/live-train-status?station=${encodeURIComponent(code || cleanName)}`;
  const confirmTktUrl = `https://www.confirmtkt.com/trains/${encodeURIComponent((code || cleanName).toLowerCase().replace(/\s+/g, '-'))}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cleanName} Railway Station ${stateName}`)}`;

  return {
    raw: stationStr,
    name: cleanName,
    code,
    irctcUrl,
    liveTrainUrl,
    confirmTktUrl,
    mapsUrl,
    hasStationCode: !!code
  };
}

/**
 * Parses highway / road string (e.g. "Grand Southern Trunk Road (NH 45)") into rich booking & route data
 */
export function parseRoadInfo(roadStr, stateSlug = '', stateName = '') {
  if (!roadStr) return null;

  const normalizedSlug = (stateSlug || '').toLowerCase().replace(/\s+/g, '-');
  const officialRtc = STATE_OFFICIAL_BUS_PORTALS[normalizedSlug] || {
    code: 'RTC',
    name: 'State RTC & RedBus',
    fullName: `${stateName} State Transport`,
    url: `https://www.redbus.in/bus-tickets/${encodeURIComponent(normalizedSlug || 'india')}`,
    badge: 'Govt & Authorized Operators',
    helpline: '1800-102-8900'
  };

  const cleanName = roadStr.trim();
  const mapsRouteUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cleanName} route ${stateName}`)}`;
  const redBusUrl = `https://www.redbus.in/bus-tickets/${encodeURIComponent(normalizedSlug || 'india')}`;
  const irctcBusUrl = 'https://www.bus.irctc.co.in';

  return {
    raw: roadStr,
    name: cleanName,
    officialRtc,
    rtcUrl: officialRtc.url,
    redBusUrl,
    irctcBusUrl,
    mapsRouteUrl
  };
}

/**
 * Returns complete transit & booking desk for a specific city or destination
 */
export function getCityTransitDesk(cityName, stateSlug = '', stateName = '') {
  const normalizedSlug = (stateSlug || '').toLowerCase().replace(/\s+/g, '-');
  const officialRtc = STATE_OFFICIAL_BUS_PORTALS[normalizedSlug] || null;

  return {
    city: cityName,
    state: stateName,
    irctcTrainSearchUrl: `https://www.irctc.co.in/nget/train-search`,
    liveTrainsUrl: `https://www.railyatri.in/live-train-status?station=${encodeURIComponent(cityName)}`,
    googleFlightsUrl: `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(`${cityName} ${stateName}`)}`,
    officialRtc,
    redBusUrl: `https://www.redbus.in/bus-tickets/${encodeURIComponent(cityName.toLowerCase().replace(/\s+/g, '-'))}`,
    asiTicketUrl: 'https://asi.payumoney.com'
  };
}
