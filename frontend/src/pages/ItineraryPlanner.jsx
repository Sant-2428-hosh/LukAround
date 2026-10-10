import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import {
  itineraries,
  states,
  cities,
  attractions
} from '../data/indiaTourismData';
import { hotelsData } from '../data/hotelsData';
import {
  calculateDistance,
  estimateTravelTime
} from '../utils/distance';
import {
  STATE_CENTERS,
  buildGoogleMapsSearchUrl
} from '../utils/googleMaps';
import GoogleMapView from '../components/maps/GoogleMapView';
import DirectionsModal from '../components/tourism/DirectionsModal';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Compass,
  IndianRupee,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Share2,
  Printer,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Navigation,
  Car,
  Footprints,
  Bus,
  Utensils,
  Hotel,
  Shield,
  Star,
  Check,
  Bookmark,
  X,
  Search,
  Layers,
  Heart,
  SlidersHorizontal,
  Info,
  ExternalLink
} from 'lucide-react';

// Curated high-res hero images by region/destination
const DESTINATION_HEROES = {
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=85',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=85',
  'new delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=85',
  hyderabad: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=85',
  bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1400&q=85',
  rajasthan: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85',
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=85',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
  'uttar pradesh': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=85',
  'tamil nadu': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=85',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=85',
  madurai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=85',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85',
  karnataka: 'https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1400&q=85',
  hampi: 'https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=1400&q=85',
  uttarakhand: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85',
  rishikesh: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85',
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1400&q=85'
};

const FEATURED_ESCAPES = [
  {
    name: 'Mumbai',
    theme: 'Metropolis',
    tagline: 'Gateway & Coast',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Delhi',
    theme: 'Capital',
    tagline: 'India Gate & Forts',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Hyderabad',
    theme: 'Historic',
    tagline: 'Charminar & Nizams',
    style: 'heritage',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/800px-Charminar_Hyderabad_1.jpg'
  },
  {
    name: 'Bangalore',
    theme: 'Garden City',
    tagline: 'Tech & Palaces',
    style: 'nature',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Tamil Nadu',
    theme: 'Spiritual',
    tagline: 'Temple Trail',
    style: 'spiritual',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Rajasthan',
    theme: 'Heritage',
    tagline: 'Royal Forts',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Goa',
    theme: 'Coastal',
    tagline: 'Sun & Sands',
    style: 'nature',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Kerala',
    theme: 'Nature',
    tagline: 'Backwaters & Palms',
    style: 'nature',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Agra',
    theme: 'Wonder',
    tagline: 'Taj Wonder',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Varanasi',
    theme: 'Sacred',
    tagline: 'Ganga Ghats',
    style: 'spiritual',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Jaipur',
    theme: 'Pink City',
    tagline: 'Hawa Mahal & Forts',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Hampi',
    theme: 'Ruins',
    tagline: 'Stone Relics',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b7e7?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Uttarakhand',
    theme: 'Himalayas',
    tagline: 'Misty Peaks',
    style: 'nature',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Kolkata',
    theme: 'Culture',
    tagline: 'City of Joy',
    style: 'heritage',
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=400&q=80'
  }
];

const TRAVEL_STYLES = [
  { id: 'heritage', label: 'Heritage & Forts', icon: '🏰' },
  { id: 'spiritual', label: 'Spiritual & Sacred', icon: '🛕' },
  { id: 'nature', label: 'Nature & Hills', icon: '🌿' },
  { id: 'family', label: 'Family Friendly', icon: '👨‍👩‍👧' },
  { id: 'couples', label: 'Romantic & Couples', icon: '💖' },
  { id: 'adventure', label: 'Adventure & Safari', icon: '🧗' },
  { id: 'food', label: 'Food & Culinary', icon: '🍛' }
];

const ALL_INTERESTS = [
  'Monuments', 'Royal Palaces', 'Food Trails', 'Photography',
  'Temples', 'Bazaars & Crafts', 'Wildlife Safari', 'Scenic Sunsets'
];

/**
 * Geographic City-Clustering Itinerary Generator
 * Guarantees each day's morning, afternoon, and evening stops are in the SAME city
 * so inter-stop distances are realistic (~2 - 6 km) with zero cross-city transit errors!
 */
function generateCityClusteredItinerary(destName, daysNum, style, budgetTier, interestsList) {
  const cleanDest = (destName || 'Tamil Nadu').trim();
  const destLower = cleanDest.toLowerCase();

  const matchedState = states.find(s => s.name.toLowerCase().includes(destLower) || s.slug.includes(destLower));
  const matchedCity = cities.find(c => c.name.toLowerCase().includes(destLower));

  // Get matching attractions pool
  let pool = attractions.filter(a => {
    if (matchedCity) return a.citySlug === matchedCity.id || a.city.toLowerCase() === matchedCity.name.toLowerCase();
    if (matchedState) return a.stateSlug === matchedState.slug || (a.state && a.state.toLowerCase().includes(destLower));
    return (a.state && a.state.toLowerCase().includes(destLower)) || (a.city && a.city.toLowerCase().includes(destLower));
  });

  if (pool.length < 3) {
    pool = attractions.slice(0, 15);
  }

  // Group attractions by city
  const cityGroups = {};
  pool.forEach(a => {
    const cName = a.city || 'Central';
    if (!cityGroups[cName]) cityGroups[cName] = [];
    cityGroups[cName].push(a);
  });

  // Sort attractions in each city group: prioritize those matching style
  Object.keys(cityGroups).forEach(cName => {
    cityGroups[cName].sort((a, b) => {
      const aMatch = (a.category && a.category.includes(style)) || a.type === style ? 1 : 0;
      const bMatch = (b.category && b.category.includes(style)) || b.type === style ? 1 : 0;
      return bMatch - aMatch;
    });
  });

  // Sort cities: prioritize cities with more matching attractions
  const cityNames = Object.keys(cityGroups).sort((a, b) => {
    const aStyleCount = cityGroups[a].filter(x => (x.category && x.category.includes(style)) || x.type === style).length;
    const bStyleCount = cityGroups[b].filter(x => (x.category && x.category.includes(style)) || x.type === style).length;
    if (bStyleCount !== aStyleCount) return bStyleCount - aStyleCount;
    return cityGroups[b].length - cityGroups[a].length;
  });

  // Max 7 Days enforced
  const totalDays = Math.min(Math.max(parseInt(daysNum, 10) || 3, 1), 7);
  const days = [];

  // Food trails from state data
  const foodList = matchedState?.popularFoods || [
    { name: 'Traditional Regional Thali', description: 'Assorted seasonal specialties cooked with native spices and authentic ghee' },
    { name: 'Heritage Clay-Oven Delicacies', description: 'Freshly baked flatbreads and aromatic gravies simmered over slow coals' },
    { name: 'Royal Pyaaz & Mawa Kachori', description: 'Crisp flaky pastries filled with caramelized spiced onions and sweet rabri' },
    { name: 'Fragrant Saffron Dum Pulao', description: 'Basmati rice infused with whole spices, cardamom, and fresh farm herbs' }
  ];

  for (let d = 1; d <= totalDays; d++) {
    // Rotate city every 2 days
    const cityIdx = Math.floor((d - 1) / 2) % cityNames.length;
    const dayCity = cityNames[cityIdx] || cityNames[0];
    const cityAttractions = cityGroups[dayCity] || pool;

    // Pick 3 distinct attractions within this city
    const offset = ((d - 1) % 2) * 3;
    const mAttr = cityAttractions[offset % cityAttractions.length];
    const aAttr = cityAttractions[(offset + 1) % cityAttractions.length];
    const eAttr = cityAttractions[(offset + 2) % cityAttractions.length];

    // Coordinates
    const mLat = mAttr.coordinates?.latitude || mAttr.latitude || 26.9124;
    const mLng = mAttr.coordinates?.longitude || mAttr.longitude || 75.7873;
    const aLat = aAttr.coordinates?.latitude || aAttr.latitude || 26.9239;
    const aLng = aAttr.coordinates?.longitude || aAttr.longitude || 75.8267;
    const eLat = eAttr.coordinates?.latitude || eAttr.latitude || 26.9360;
    const eLng = eAttr.coordinates?.longitude || eAttr.longitude || 75.8450;

    // Realistic Local Distances (within same city)
    const rawDist1 = calculateDistance(mLat, mLng, aLat, aLng);
    const dist1 = (rawDist1 > 0 && rawDist1 < 25) ? Number(rawDist1.toFixed(1)) : 3.4;
    const time1 = estimateTravelTime(dist1);
    const auto1 = Math.max(40, Math.round(30 + dist1 * 14));
    const cab1 = Math.max(90, Math.round(55 + dist1 * 22));

    const rawDist2 = calculateDistance(aLat, aLng, eLat, eLng);
    const dist2 = (rawDist2 > 0 && rawDist2 < 25) ? Number(rawDist2.toFixed(1)) : 2.8;
    const time2 = estimateTravelTime(dist2);
    const auto2 = Math.max(40, Math.round(30 + dist2 * 14));
    const cab2 = Math.max(90, Math.round(55 + dist2 * 22));

    const dayFood = foodList[(d - 1) % foodList.length];

    days.push({
      dayNumber: d,
      title: `Day ${d}: Iconic Sights & Culture of ${dayCity}`,
      city: dayCity,
      morning: {
        name: mAttr.name,
        category: Array.isArray(mAttr.category) ? mAttr.category[0] : (mAttr.type || 'Heritage'),
        duration: mAttr.recommendedDuration || '2 - 3 Hours',
        entryFee: mAttr.budgetLevel === 'free' ? 0 : 250,
        image: mAttr.image,
        timeSlot: 'Morning (08:30 AM – 12:30 PM)',
        description: mAttr.shortDescription || mAttr.longDescription || 'Start early to beat the crowds and experience pleasant morning light and majestic palace courtyards.',
        circadianTip: 'Cool morning breeze is optimal for outdoor ramparts and architectural photo angles.',
        coordinates: { latitude: mLat, longitude: mLng },
        citySlug: mAttr.citySlug,
        id: mAttr.id
      },
      transit1: {
        distanceKm: dist1,
        travelTime: time1,
        autoRickshawFare: auto1,
        cabFare: cab1,
        walkingMins: Math.round(dist1 * 14)
      },
      afternoon: {
        name: aAttr.name,
        category: Array.isArray(aAttr.category) ? aAttr.category[0] : (aAttr.type || 'Culture'),
        duration: aAttr.recommendedDuration || '2 Hours',
        entryFee: aAttr.budgetLevel === 'free' ? 0 : 200,
        image: aAttr.image,
        timeSlot: 'Afternoon (01:00 PM – 04:30 PM)',
        description: aAttr.shortDescription || aAttr.longDescription || 'Explore sheltered museum wings, royal armories, and intricate artisan textile galleries.',
        circadianTip: 'Indoor halls, covered corridors, and shaded gardens minimize midday sun exposure.',
        coordinates: { latitude: aLat, longitude: aLng },
        citySlug: aAttr.citySlug,
        id: aAttr.id
      },
      lunchRecommendation: {
        dish: dayFood?.name || 'Regional Traditional Thali',
        notes: dayFood?.description || 'Authentic regional lunch infused with royal spices and local delicacies.'
      },
      transit2: {
        distanceKm: dist2,
        travelTime: time2,
        autoRickshawFare: auto2,
        cabFare: cab2,
        walkingMins: Math.round(dist2 * 14)
      },
      evening: {
        name: eAttr.name,
        category: Array.isArray(eAttr.category) ? eAttr.category[0] : (eAttr.type || 'Sightseeing'),
        duration: eAttr.recommendedDuration || '2 Hours',
        entryFee: eAttr.budgetLevel === 'free' ? 0 : 100,
        image: eAttr.image,
        timeSlot: 'Evening (05:00 PM – 08:30 PM)',
        description: eAttr.shortDescription || eAttr.longDescription || 'Catch panoramic sunset vistas over ancient battlements or ghats, followed by vibrant evening street markets.',
        circadianTip: 'Golden hour vantage point with illuminated night monument silhouettes.',
        coordinates: { latitude: eLat, longitude: eLng },
        citySlug: eAttr.citySlug,
        id: eAttr.id
      }
    });
  }

  const heroImg = DESTINATION_HEROES[destLower] ||
    matchedState?.heroImage ||
    pool[0]?.image ||
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85';

  return {
    id: `itinerary-${Date.now()}`,
    destination: cleanDest,
    state: matchedState?.name || cleanDest,
    durationDays: totalDays,
    travelStyle: style,
    budget: budgetTier,
    interests: interestsList,
    heroImage: heroImg,
    title: `${totalDays} Days in ${cleanDest}: ${style.charAt(0).toUpperCase() + style.slice(1)} Route`,
    summary: `A personalized ${totalDays}-day circuit crafted for ${budgetTier} travelers. Clustered geographically city-by-city to minimize travel hours with circadian morning, afternoon, and sunset stops.`,
    days
  };
}

export default function ItineraryPlanner() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial values from location state or search params
  const preSelectedItinerary = location.state?.selectedItinerary || null;
  const preSelectedState = location.state?.selectedState?.name || null;
  const initialDest = preSelectedState || location.state?.defaultDestination || searchParams.get('dest') || 'Tamil Nadu';
  const initialDays = preSelectedItinerary?.durationDays ? Math.min(preSelectedItinerary.durationDays, 7) : (parseInt(searchParams.get('days'), 10) || 4);
  const initialStyle = preSelectedItinerary?.travelStyle || 'spiritual';

  // Form State (Maximum 7 Days strictly)
  const [destination, setDestination] = useState(initialDest);
  const [durationDays, setDurationDays] = useState(initialDays);
  const [travelStyle, setTravelStyle] = useState(initialStyle);
  const [budget, setBudget] = useState(preSelectedItinerary?.budget || 'moderate');
  const [selectedInterests, setSelectedInterests] = useState(['Monuments', 'Food Trails', 'Photography']);
  const [isGenerating, setIsGenerating] = useState(false);

  // Autocomplete state
  const [destSuggestionsOpen, setDestSuggestionsOpen] = useState(false);
  const destInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Active Main Tab: 'timeline' | 'map' | 'hotels' | 'budget' | 'advisory'
  const [activePlanTab, setActivePlanTab] = useState('timeline');

  // Current Generated Itinerary
  const [currentItinerary, setCurrentItinerary] = useState(() => {
    return generateCityClusteredItinerary(initialDest, initialDays, initialStyle, 'moderate', ['Monuments', 'Food Trails', 'Photography']);
  });

  // UI Feedback States
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedTrip, setSavedTrip] = useState(false);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [directionsTarget, setDirectionsTarget] = useState(null);

  // Active Day Switcher (Defaults strictly to Day 1, so Day 2 is not dumped below Day 1)
  const [activeDayNumber, setActiveDayNumber] = useState(1);

  // Helper for immediate reactive regeneration
  const updatePlan = (nextDest, nextDays, nextStyle, nextBudget, nextInterests) => {
    const dName = nextDest !== undefined ? nextDest : destination;
    const dDays = nextDays !== undefined ? nextDays : durationDays;
    const dStyle = nextStyle !== undefined ? nextStyle : travelStyle;
    const dBgt = nextBudget !== undefined ? nextBudget : budget;
    const dInts = nextInterests !== undefined ? nextInterests : selectedInterests;

    const newPlan = generateCityClusteredItinerary(dName, dDays, dStyle, dBgt, dInts);
    setCurrentItinerary(newPlan);
    setActiveDayNumber(1);
  };

  // Autocomplete suggestions
  const destSuggestions = useMemo(() => {
    const q = destination.trim().toLowerCase();
    if (!q) return [];

    const matchedStates = states.filter(s => s.name.toLowerCase().includes(q)).slice(0, 4);
    const matchedCities = cities.filter(c => c.name.toLowerCase().includes(q) || (c.aliases || []).some(a => a.toLowerCase().includes(q))).slice(0, 5);

    return [
      ...matchedStates.map(s => ({ type: 'State', name: s.name, state: s.name, image: s.heroImage, capital: s.capital })),
      ...matchedCities.map(c => ({ type: 'City', name: c.name, state: c.state, image: c.heroImage || c.image, days: c.recommendedDays }))
    ];
  }, [destination]);

  // Synchronize initial navigation if preSelectedState changes
  useEffect(() => {
    if (preSelectedState && preSelectedState !== destination) {
      setDestination(preSelectedState);
      updatePlan(preSelectedState, durationDays, travelStyle, budget, selectedInterests);
    }
  }, [preSelectedState]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (destInputRef.current && !destInputRef.current.contains(e.target)) {
        setDestSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleInterest = (interest) => {
    const next = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(next);
    updatePlan(undefined, undefined, undefined, undefined, next);
  };

  // Handle Form Submit / Generate Button
  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      updatePlan(destination, durationDays, travelStyle, budget, selectedInterests);
      setIsGenerating(false);
      setSearchParams({ dest: destination, days: durationDays }, { replace: true });
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 250);
  };

  const handleSelectTrending = (destName, defaultStyle) => {
    setDestination(destName);
    if (defaultStyle) setTravelStyle(defaultStyle);
    setDestSuggestionsOpen(false);
    updatePlan(destName, undefined, defaultStyle || travelStyle, undefined, undefined);
  };

  // Map markers for ALL days in the generated route
  const routeMapMarkers = useMemo(() => {
    if (!currentItinerary?.days) return [];
    const markers = [];

    currentItinerary.days.forEach((day) => {
      ['morning', 'afternoon', 'evening'].forEach((period) => {
        const stop = day[period];
        if (stop && stop.coordinates?.latitude && stop.coordinates?.longitude) {
          markers.push({
            id: `d${day.dayNumber}-${period}-${stop.id || stop.name}`,
            title: stop.name,
            name: `${stop.name} (Day ${day.dayNumber})`,
            latitude: stop.coordinates.latitude,
            longitude: stop.coordinates.longitude,
            type: 'attraction',
            category: stop.category,
            city: day.city,
            image: stop.image,
            duration: stop.duration,
            address: `${stop.name}, ${day.city}`,
            description: stop.description
          });
        }
      });
    });

    return markers;
  }, [currentItinerary]);

  const routeMapCenter = useMemo(() => {
    if (routeMapMarkers.length > 0) {
      return { lat: routeMapMarkers[0].latitude, lng: routeMapMarkers[0].longitude };
    }
    const destSlug = (destination || 'tamil-nadu').toLowerCase().replace(/\s+/g, '-');
    if (STATE_CENTERS[destSlug]) {
      return { lat: STATE_CENTERS[destSlug].latitude, lng: STATE_CENTERS[destSlug].longitude };
    }
    return { lat: 13.0827, lng: 80.2707 };
  }, [routeMapMarkers, destination]);

  // Matching Hotels
  const matchedHotels = useMemo(() => {
    const q = (destination || 'Tamil Nadu').toLowerCase();
    return hotelsData.filter(h =>
      h.state.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [destination]);

  // Budget Estimation
  const estimatedBudget = useMemo(() => {
    const daysCount = currentItinerary?.durationDays || 4;
    let dailyStay = 1500;
    let dailyFood = 600;
    let dailyTransit = 280;
    let dailyEntry = 400;

    if (budget === 'budget') {
      dailyStay = 900;
      dailyFood = 400;
      dailyTransit = 160;
      dailyEntry = 300;
    } else if (budget === 'luxury') {
      dailyStay = 7500;
      dailyFood = 2500;
      dailyTransit = 900;
      dailyEntry = 800;
    }

    const stayTotal = dailyStay * Math.max(1, daysCount - 1);
    const foodTotal = dailyFood * daysCount;
    const transitTotal = dailyTransit * daysCount;
    const entryTotal = dailyEntry * daysCount;
    const grandTotal = stayTotal + foodTotal + transitTotal + entryTotal;

    return {
      stayTotal,
      foodTotal,
      transitTotal,
      entryTotal,
      grandTotal,
      perDay: Math.round(grandTotal / daysCount)
    };
  }, [currentItinerary, budget]);

  const handleOpenDirections = (stop) => {
    setDirectionsTarget(stop);
    setDirectionsModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSaveTrip = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('lukaround_saved_trips') || '[]');
      const updated = [currentItinerary, ...existing.filter(i => i.id !== currentItinerary.id)];
      localStorage.setItem('lukaround_saved_trips', JSON.stringify(updated.slice(0, 10)));
      setSavedTrip(true);
      setTimeout(() => setSavedTrip(false), 2500);
    } catch {
      setSavedTrip(true);
    }
  };

  const currentDayData = currentItinerary?.days?.find(d => d.dayNumber === activeDayNumber) || currentItinerary?.days?.[0];

  return (
    <div className="tourism-page">
      {/* ── Page Header ── */}
      <div className="no-print" style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '2.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '850px' }}>
          <span className="tourism-badge badge-earth" style={{ marginBottom: '0.65rem' }}>
            Smart Trip Planner
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            India Travel Itinerary Generator
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
            Custom day-by-day complete itinerary package. Select your destination, duration (up to 7 days), and style to generate verified, city-clustered routes.
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '1.75rem', paddingBottom: '3.5rem' }}>
        <div className="itinerary-planner-grid">

          {/* ── Left Column: Reactive Trip Preferences ── */}
          <div className="no-print">
            <div className="itinerary-preferences-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Compass size={17} color="var(--tourism-earth)" />
                  <span>Trip Preferences</span>
                </h3>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--tourism-forest)', backgroundColor: 'var(--tourism-forest-light)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                  Max 7 Days
                </span>
              </div>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                {/* 1. Destination Autocomplete */}
                <div ref={destInputRef} style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Destination (State or City)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setDestSuggestionsOpen(true);
                      }}
                      onFocus={() => setDestSuggestionsOpen(true)}
                      placeholder="e.g., Tamil Nadu, Rajasthan, Kerala..."
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '0.6rem 2rem 0.6rem 2rem',
                        borderRadius: '10px',
                        border: '1px solid var(--tourism-sand-border)',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        outline: 'none',
                        backgroundColor: '#FFFFFF'
                      }}
                      required
                    />
                    {destination && (
                      <button
                        type="button"
                        onClick={() => {
                          setDestination('');
                          setDestSuggestionsOpen(false);
                        }}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <X size={13} color="#94A3B8" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {destSuggestionsOpen && destSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--tourism-sand-border)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-floating)',
                      zIndex: 50,
                      marginTop: '4px',
                      overflow: 'hidden'
                    }}>
                      {destSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setDestination(item.name);
                            setDestSuggestionsOpen(false);
                            updatePlan(item.name, undefined, undefined, undefined, undefined);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.55rem 0.75rem',
                            cursor: 'pointer',
                            borderBottom: idx < destSuggestions.length - 1 ? '1px solid #F1F5F9' : 'none'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--tourism-sand)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                        >
                          <img src={item.image} alt={item.name} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0F172A' }}>{item.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.type} • {item.state}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Curated Escapes Showcase (Sleek Visual Reel replacing emoji pills) */}
                  <div style={{ marginTop: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Sparkles size={12} color="var(--tourism-earth)" />
                        <span>Curated Escapes</span>
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>
                        Select Hotspot
                      </span>
                    </div>

                    <div
                      className="featured-escapes-reel"
                      style={{
                        display: 'flex',
                        gap: '0.45rem',
                        overflowX: 'auto',
                        paddingBottom: '4px',
                        paddingTop: '2px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        scrollSnapType: 'x mandatory'
                      }}
                    >
                      {FEATURED_ESCAPES.map((dest) => {
                        const isSelected = destination.toLowerCase() === dest.name.toLowerCase();
                        return (
                          <button
                            key={dest.name}
                            type="button"
                            onClick={() => handleSelectTrending(dest.name, dest.style)}
                            className="featured-escape-card"
                            style={{
                              flex: '0 0 92px',
                              width: '92px',
                              height: '64px',
                              borderRadius: '10px',
                              position: 'relative',
                              overflow: 'hidden',
                              border: isSelected ? '2px solid var(--tourism-earth)' : '1px solid rgba(0,0,0,0.08)',
                              padding: 0,
                              cursor: 'pointer',
                              textAlign: 'left',
                              scrollSnapAlign: 'start',
                              boxShadow: isSelected ? '0 4px 14px rgba(200, 90, 50, 0.35)' : '0 2px 6px rgba(15, 23, 42, 0.08)',
                              transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                              transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                              boxSizing: 'border-box'
                            }}
                          >
                            <img
                              src={dest.image}
                              alt={dest.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                filter: isSelected ? 'brightness(0.95)' : 'brightness(0.85) contrast(1.05)',
                                transition: 'transform 0.4s ease'
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: isSelected
                                  ? 'linear-gradient(180deg, rgba(200,90,50,0.35) 0%, rgba(15,23,42,0.88) 100%)'
                                  : 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '0.35rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {isSelected ? (
                                  <span style={{
                                    backgroundColor: 'var(--tourism-earth)',
                                    color: '#FFFFFF',
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    fontWeight: 900,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                  }}>✓</span>
                                ) : (
                                  <span style={{
                                    backgroundColor: 'rgba(255,255,255,0.22)',
                                    backdropFilter: 'blur(4px)',
                                    color: '#FFFFFF',
                                    fontSize: '0.52rem',
                                    fontWeight: 800,
                                    padding: '0.08rem 0.3rem',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase'
                                  }}>{dest.theme}</span>
                                )}
                              </div>
                              <div>
                                <div style={{ color: '#FFFFFF', fontSize: '0.74rem', fontWeight: 900, lineHeight: 1.15, textShadow: '0 1px 3px rgba(0,0,0,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {dest.name}
                                </div>
                                <div style={{ color: '#FCD34D', fontSize: '0.58rem', fontWeight: 700, lineHeight: 1.1, textShadow: '0 1px 2px rgba(0,0,0,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {dest.tagline}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Duration Stepper & Pills (Strictly 1 to 7 Days) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Trip Duration (Max 7 Days)
                    </label>
                    <span style={{ fontSize: '0.84rem', fontWeight: 900, color: 'var(--tourism-earth)' }}>
                      {durationDays} Days / {Math.max(1, durationDays - 1)} Nights
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const newD = Math.max(1, durationDays - 1);
                        setDurationDays(newD);
                        updatePlan(undefined, newD, undefined, undefined, undefined);
                      }}
                      style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid var(--tourism-sand-border)', background: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      value={durationDays}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setDurationDays(val);
                        updatePlan(undefined, val, undefined, undefined, undefined);
                      }}
                      style={{ flex: 1, accentColor: 'var(--tourism-earth)', cursor: 'pointer' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newD = Math.min(7, durationDays + 1);
                        setDurationDays(newD);
                        updatePlan(undefined, newD, undefined, undefined, undefined);
                      }}
                      style={{ width: '30px', height: '30px', borderRadius: '6px', border: '1px solid var(--tourism-sand-border)', background: '#FFFFFF', fontWeight: 900, cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Day Pills 1 to 7 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.25rem', width: '100%', boxSizing: 'border-box' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setDurationDays(num);
                          updatePlan(undefined, num, undefined, undefined, undefined);
                        }}
                        style={{
                          padding: '0.35rem 0',
                          borderRadius: '6px',
                          border: '1.5px solid',
                          borderColor: durationDays === num ? 'var(--tourism-earth)' : 'var(--tourism-sand-border)',
                          backgroundColor: durationDays === num ? 'var(--tourism-earth)' : '#FFFFFF',
                          color: durationDays === num ? '#FFFFFF' : '#475569',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          minWidth: 0
                        }}
                      >
                        {num}D
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Travel Style */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Travel Style
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.35rem', width: '100%', boxSizing: 'border-box' }}>
                    {TRAVEL_STYLES.map((st) => {
                      const isActive = travelStyle === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setTravelStyle(st.id);
                            updatePlan(undefined, undefined, st.id, undefined, undefined);
                          }}
                          className={`itinerary-style-chip ${isActive ? 'active' : ''}`}
                          style={{ padding: '0.45rem 0.6rem', fontSize: '0.75rem', minWidth: 0, justifyContent: 'center' }}
                        >
                          <span style={{ flexShrink: 0 }}>{st.icon}</span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Budget Preference */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Budget Preference
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.35rem', width: '100%', boxSizing: 'border-box' }}>
                    {[
                      { id: 'budget', label: 'Budget', sub: '~₹1.5k/d' },
                      { id: 'moderate', label: 'Moderate', sub: '~₹3.5k/d' },
                      { id: 'luxury', label: 'Luxury', sub: '~₹8k+/d' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setBudget(b.id);
                          updatePlan(undefined, undefined, undefined, b.id, undefined);
                        }}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.12rem',
                          padding: '0.45rem 0.2rem',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: budget === b.id ? 'var(--tourism-earth)' : 'var(--tourism-sand-border)',
                          backgroundColor: budget === b.id ? 'var(--tourism-earth-light)' : '#FFFFFF',
                          color: budget === b.id ? 'var(--tourism-earth-dark)' : '#475569',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          minWidth: 0,
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      >
                        <span style={{ fontWeight: 800, fontSize: '0.76rem', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{b.label}</span>
                        <span style={{ fontSize: '0.64rem', color: budget === b.id ? 'var(--tourism-earth-dark)' : '#64748B', fontWeight: 600, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{b.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Key Interests */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#475569', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                    Key Interests
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {ALL_INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          style={{
                            padding: '0.28rem 0.55rem',
                            borderRadius: '9999px',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--tourism-forest)' : 'var(--tourism-sand-border)',
                            backgroundColor: isSelected ? 'var(--tourism-forest-light)' : '#FFFFFF',
                            color: isSelected ? 'var(--tourism-forest-dark)' : '#64748B',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? '✓ ' : ''}{interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  style={{
                    backgroundColor: 'var(--tourism-earth)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(200, 90, 50, 0.35)',
                    marginTop: '0.35rem'
                  }}
                >
                  <Sparkles size={16} />
                  <span>{isGenerating ? 'Updating Complete Package...' : 'Regenerate Complete Plan'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* ── Right Column: Complete Multi-Day Package with Contained Scroll ── */}
          <div className="itinerary-details-container">
            {currentItinerary && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--tourism-sand-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-medium)'
              }}>
                {/* 1. Hero Header (Clean Fixed Height, Zero Image Spill) */}
                <div className="itinerary-hero-box">
                  <img
                    src={currentItinerary.heroImage}
                    alt={currentItinerary.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=85';
                    }}
                  />

                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.92) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1.25rem 1.5rem'
                  }}>
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.22)', backdropFilter: 'blur(8px)', color: '#FFFFFF', padding: '0.18rem 0.55rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800 }}>
                          {currentItinerary.durationDays} Days / {Math.max(1, currentItinerary.durationDays - 1)} Nights Package
                        </span>
                        <span style={{ backgroundColor: 'rgba(200, 90, 50, 0.9)', color: '#FFFFFF', padding: '0.18rem 0.55rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'capitalize' }}>
                          {currentItinerary.travelStyle} Style
                        </span>
                        <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)', color: '#FFFFFF', padding: '0.18rem 0.55rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'capitalize' }}>
                          {currentItinerary.budget} Tier
                        </span>
                      </div>

                      <h2 style={{ fontSize: 'clamp(1.3rem, 2.3vw, 1.8rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
                        {currentItinerary.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* 2. Top Action Controls */}
                <div className="no-print" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.45rem',
                  padding: '0.65rem 1rem',
                  backgroundColor: 'var(--tourism-sand-light)',
                  borderBottom: '1px solid var(--tourism-sand-border)'
                }}>
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 800 }}>
                    ⚡ {currentItinerary.durationDays}-Day Circuit • {currentItinerary.days.length * 3} Verified Stops
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleSaveTrip}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.32rem 0.65rem', borderRadius: '6px', border: '1px solid var(--tourism-sand-border)', background: '#FFFFFF', color: savedTrip ? '#16A34A' : '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {savedTrip ? <Check size={12} color="#16A34A" /> : <Bookmark size={12} />}
                      <span>{savedTrip ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleShare}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.32rem 0.65rem', borderRadius: '6px', border: '1px solid var(--tourism-sand-border)', background: '#FFFFFF', color: '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {copiedLink ? <Check size={12} color="#16A34A" /> : <Share2 size={12} />}
                      <span>{copiedLink ? 'Copied' : 'Share'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.32rem 0.65rem', borderRadius: '6px', border: '1px solid var(--tourism-sand-border)', background: '#FFFFFF', color: '#334155', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Printer size={12} />
                      <span>Print</span>
                    </button>

                    <a
                      href={buildGoogleMapsSearchUrl({ name: `${destination} Tourist Attractions` })}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.32rem 0.65rem', borderRadius: '6px', backgroundColor: 'var(--tourism-earth)', color: '#FFFFFF', fontSize: '0.74rem', fontWeight: 800, textDecoration: 'none' }}
                    >
                      <Navigation size={12} />
                      <span>Route</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>

                {/* 3. Main Navigation Tabs (Concise & Sweet to fit all screens) */}
                <div className="no-print" style={{
                  display: 'flex',
                  gap: '0.3rem',
                  borderBottom: '2px solid var(--tourism-sand-border)',
                  padding: '0 0.85rem',
                  backgroundColor: '#FFFFFF',
                  overflowX: 'auto',
                  scrollbarWidth: 'none'
                }}>
                  {[
                    { id: 'timeline', label: 'Day Plan', icon: Calendar, badge: `${currentItinerary.durationDays}D` },
                    { id: 'map', label: 'Route Map', icon: MapPin, badge: `${routeMapMarkers.length}` },
                    { id: 'hotels', label: 'Stays', icon: Hotel, badge: `${matchedHotels.length}` },
                    { id: 'budget', label: 'Budget', icon: IndianRupee, badge: `₹${Math.round(estimatedBudget.grandTotal / 1000)}k` },
                    { id: 'advisory', label: 'Advisory', icon: Shield }
                  ].map((tab) => {
                    const isActive = activePlanTab === tab.id;
                    const IconComp = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActivePlanTab(tab.id)}
                        className={`map-tab-btn ${isActive ? 'active' : ''}`}
                        style={{ padding: '0.6rem 0.8rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        <IconComp size={14} />
                        <span>{tab.label}</span>
                        {tab.badge && <span className="map-tab-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>{tab.badge}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* 4. Tab Body Area with Contained Scrolling */}
                <div className="itinerary-right-scroll-wrapper" ref={scrollContainerRef} style={{ padding: '0.85rem' }}>

                  {/* ── TAB 1: DAY-BY-DAY ITINERARY WITH ACTIVE DAY SELECTOR ── */}
                  {activePlanTab === 'timeline' && (
                    <div>
                      {/* Sticky Active Day Selector Bar */}
                      <div className="itinerary-jump-bar no-print" style={{ marginBottom: '1rem', borderRadius: '10px', padding: '0.6rem 0.85rem' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748B', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          Select Day:
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', flex: 1, minWidth: 0, paddingBottom: '2px', scrollbarWidth: 'none' }}>
                          {currentItinerary.days.map((d) => {
                            const isActive = activeDayNumber === d.dayNumber;
                            return (
                              <button
                                key={d.dayNumber}
                                type="button"
                                className={`itinerary-jump-btn ${isActive ? 'active' : ''}`}
                                onClick={() => {
                                  setActiveDayNumber(d.dayNumber);
                                  if (scrollContainerRef.current) {
                                    scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }}
                                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                              >
                                Day {d.dayNumber} • {d.city}
                              </button>
                            );
                          })}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>
                          Day {activeDayNumber} of {currentItinerary.durationDays}
                        </span>
                      </div>

                      {/* Render ONLY the Active Day (Defaults to Day 1, Day 2 only after clicking Day 2) */}
                      {currentDayData && (
                        <div
                          key={currentDayData.dayNumber}
                          id={`itinerary-day-${currentDayData.dayNumber}`}
                          className="itinerary-package-day-block"
                          style={{ marginBottom: '1rem' }}
                        >
                          {/* Day Header Banner */}
                          <div className="itinerary-package-day-header" style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                                <span style={{ backgroundColor: 'var(--tourism-earth)', color: '#FFFFFF', padding: '0.15rem 0.55rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900 }}>
                                  Day {currentDayData.dayNumber}
                                </span>
                                <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                                  {currentDayData.title}
                                </h3>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                Base City: <strong style={{ color: 'var(--tourism-earth)' }}>{currentDayData.city}</strong> • Morning Heritage → Midday Culture & Lunch → Sunset Vantage Point
                              </div>
                            </div>
                            <span style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', color: '#475569', padding: '0.22rem 0.55rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0, whiteSpace: 'nowrap' }}>
                              ~{(currentDayData.transit1.distanceKm + currentDayData.transit2.distanceKm).toFixed(1)} km Local Transit
                            </span>
                          </div>

                          {/* Day Stops Body */}
                          <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

                            {/* 🌅 MORNING COMPACT STOP */}
                            <div className="itinerary-compact-card">
                              <div style={{ width: '85px', height: '75px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                <img
                                  src={currentDayData.morning.image || 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80'}
                                  alt={currentDayData.morning.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800 }}>
                                  08:30 AM
                                </div>
                              </div>

                              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Sun size={13} color="#D97706" />
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
                                      Morning Experience
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    {currentDayData.morning.duration} • Entry: ₹{currentDayData.morning.entryFee}
                                  </span>
                                </div>

                                <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                                  {currentDayData.morning.name}
                                </h4>

                                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                                  {currentDayData.morning.description}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    color: 'var(--tourism-forest)',
                                    backgroundColor: 'var(--tourism-forest-light)',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px',
                                    lineHeight: 1.35,
                                    flex: 1,
                                    minWidth: 0
                                  }}>
                                    💡 {currentDayData.morning.circadianTip}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDirections(currentDayData.morning)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--tourism-earth)',
                                      fontSize: '0.75rem',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      padding: '0.15rem 0.35rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.2rem',
                                      flexShrink: 0,
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <Navigation size={12} />
                                    <span>Directions</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* 🚖 TRANSIT STRIP 1 */}
                            <div className="itinerary-transit-strip" style={{ margin: '0.4rem 0', padding: '0.55rem 0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <Car size={13} color="var(--tourism-earth)" />
                                <strong style={{ color: '#0F172A', fontSize: '0.76rem' }}>Transit to Midday:</strong>
                                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>~{currentDayData.transit1.distanceKm} km ({currentDayData.transit1.travelTime})</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                                <span className="itinerary-transit-mode-pill">🛺 Auto: ₹{currentDayData.transit1.autoRickshawFare}</span>
                                <span className="itinerary-transit-mode-pill">🚕 Cab: ₹{currentDayData.transit1.cabFare}</span>
                                <span className="itinerary-transit-mode-pill">🚶 Walk: ~{currentDayData.transit1.walkingMins}m</span>
                              </div>
                            </div>

                            {/* ☀️ AFTERNOON COMPACT STOP */}
                            <div className="itinerary-compact-card">
                              <div style={{ width: '85px', height: '75px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                <img
                                  src={currentDayData.afternoon.image || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80'}
                                  alt={currentDayData.afternoon.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#FCEEE8', color: 'var(--tourism-earth)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800 }}>
                                  01:00 PM
                                </div>
                              </div>

                              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Sunset size={13} color="var(--tourism-earth)" />
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--tourism-earth)', textTransform: 'uppercase' }}>
                                      Midday Cultural Stop
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    {currentDayData.afternoon.duration} • Entry: ₹{currentDayData.afternoon.entryFee}
                                  </span>
                                </div>

                                <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                                  {currentDayData.afternoon.name}
                                </h4>

                                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                                  {currentDayData.afternoon.description}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    color: 'var(--tourism-sky)',
                                    backgroundColor: 'var(--tourism-sky-light)',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px',
                                    lineHeight: 1.35,
                                    flex: 1,
                                    minWidth: 0
                                  }}>
                                    💡 {currentDayData.afternoon.circadianTip}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDirections(currentDayData.afternoon)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--tourism-earth)',
                                      fontSize: '0.75rem',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      padding: '0.15rem 0.35rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.2rem',
                                      flexShrink: 0,
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <Navigation size={12} />
                                    <span>Directions</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* 🍛 REGIONAL LUNCH CALLOUT */}
                            <div className="itinerary-culinary-callout" style={{ margin: '0.4rem 0', padding: '0.55rem 0.85rem' }}>
                              <Utensils size={15} color="#D97706" style={{ flexShrink: 0 }} />
                              <div style={{ fontSize: '0.76rem', color: '#92400E', lineHeight: 1.4 }}>
                                <strong>Authentic Lunch in {currentDayData.city}:</strong> {currentDayData.lunchRecommendation.dish} — {currentDayData.lunchRecommendation.notes}
                              </div>
                            </div>

                            {/* 🚖 TRANSIT STRIP 2 */}
                            <div className="itinerary-transit-strip" style={{ margin: '0.4rem 0', padding: '0.55rem 0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                                <Car size={13} color="var(--tourism-sky)" />
                                <strong style={{ color: '#0F172A', fontSize: '0.76rem' }}>Transit to Sunset:</strong>
                                <span style={{ color: '#64748B', fontSize: '0.72rem' }}>~{currentDayData.transit2.distanceKm} km ({currentDayData.transit2.travelTime})</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
                                <span className="itinerary-transit-mode-pill">🛺 Auto: ₹{currentDayData.transit2.autoRickshawFare}</span>
                                <span className="itinerary-transit-mode-pill">🚕 Cab: ₹{currentDayData.transit2.cabFare}</span>
                                <span className="itinerary-transit-mode-pill">🚶 Walk: ~{currentDayData.transit2.walkingMins}m</span>
                              </div>
                            </div>

                            {/* 🌆 EVENING COMPACT STOP */}
                            <div className="itinerary-compact-card">
                              <div style={{ width: '85px', height: '75px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                <img
                                  src={currentDayData.evening.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80'}
                                  alt={currentDayData.evening.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80';
                                  }}
                                />
                                <div style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#E0F2FE', color: 'var(--tourism-sky)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 800 }}>
                                  05:00 PM
                                </div>
                              </div>

                              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.35rem', flexWrap: 'wrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Moon size={13} color="var(--tourism-sky)" />
                                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--tourism-sky)', textTransform: 'uppercase' }}>
                                      Sunset Vantage Point
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                    {currentDayData.evening.duration} • Entry: ₹{currentDayData.evening.entryFee}
                                  </span>
                                </div>

                                <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                                  {currentDayData.evening.name}
                                </h4>

                                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                                  {currentDayData.evening.description}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                                  <span style={{
                                    fontSize: '0.68rem',
                                    color: 'var(--tourism-earth)',
                                    backgroundColor: 'var(--tourism-earth-light)',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '4px',
                                    lineHeight: 1.35,
                                    flex: 1,
                                    minWidth: 0
                                  }}>
                                    💡 {currentDayData.evening.circadianTip}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDirections(currentDayData.evening)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--tourism-earth)',
                                      fontSize: '0.75rem',
                                      fontWeight: 800,
                                      cursor: 'pointer',
                                      padding: '0.15rem 0.35rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.2rem',
                                      flexShrink: 0,
                                      whiteSpace: 'nowrap'
                                    }}
                                  >
                                    <Navigation size={12} />
                                    <span>Directions</span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* 🧭 NEXT / PREV DAY STEPPER AT THE BOTTOM */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: '0.75rem',
                              marginTop: '0.4rem',
                              borderTop: '1px solid var(--tourism-sand-border)',
                              flexWrap: 'wrap',
                              gap: '0.5rem'
                            }}>
                              {currentDayData.dayNumber > 1 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDayNumber(currentDayData.dayNumber - 1);
                                    if (scrollContainerRef.current) {
                                      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.5rem 0.9rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid var(--tourism-sand-border)',
                                    backgroundColor: '#FFFFFF',
                                    color: '#334155',
                                    fontWeight: 800,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <ChevronLeft size={15} />
                                  <span>Previous: Day {currentDayData.dayNumber - 1}</span>
                                </button>
                              ) : <div />}

                              {currentDayData.dayNumber < currentItinerary.durationDays ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDayNumber(currentDayData.dayNumber + 1);
                                    if (scrollContainerRef.current) {
                                      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                  }}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: 'var(--tourism-earth)',
                                    color: '#FFFFFF',
                                    fontWeight: 900,
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 3px 10px rgba(200, 90, 50, 0.3)',
                                    transition: 'all 0.15s ease'
                                  }}
                                >
                                  <span>Continue to Day {currentDayData.dayNumber + 1}</span>
                                  <ChevronRight size={15} />
                                </button>
                              ) : (
                                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--tourism-forest)' }}>
                                  🎉 Complete {currentItinerary.durationDays}-Day Package Finished
                                </div>
                              )}
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── TAB 2: Interactive Route Map ── */}
                  {activePlanTab === 'map' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                            {destination} Geographic Route Map
                          </h4>
                          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                            All {routeMapMarkers.length} stops plotted across {currentItinerary.durationDays} days with verified GPS coordinates
                          </p>
                        </div>
                        <span className="tourism-badge badge-earth" style={{ fontSize: '0.72rem' }}>
                          {routeMapMarkers.length} Stops
                        </span>
                      </div>

                      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--tourism-sand-border)' }}>
                        <GoogleMapView
                          markers={routeMapMarkers}
                          center={routeMapCenter}
                          zoom={9}
                          height="460px"
                          fitBounds={true}
                          mapTitle={`${destination} Complete Route`}
                        />
                      </div>
                    </div>
                  )}

                  {/* ── TAB 3: Recommended Stays ── */}
                  {activePlanTab === 'hotels' && (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                          Curated Accommodations in {destination}
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                          Verified hotels matched to your {budget} budget tier
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                        {matchedHotels.map((htl) => (
                          <div
                            key={htl.id}
                            style={{
                              background: '#FFFFFF',
                              border: '1px solid var(--tourism-sand-border)',
                              borderRadius: '12px',
                              padding: '1rem',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--tourism-earth)', backgroundColor: 'var(--tourism-earth-light)', padding: '0.12rem 0.45rem', borderRadius: '4px' }}>
                                {'★'.repeat(htl.starCategory || 4)} {htl.propertyType || 'Hotel'}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', fontWeight: 800, color: '#0F172A' }}>
                                <Star size={12} fill="#D97706" color="#D97706" />
                                <span>{htl.guestRating || 4.7}</span>
                              </div>
                            </div>

                            <h5 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.3rem 0' }}>
                              {htl.name}
                            </h5>

                            <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.45, margin: '0 0 0.65rem 0', flex: 1 }}>
                              {htl.description}
                            </p>

                            <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '0.65rem' }}>
                              📍 {htl.address}
                            </div>

                            <a
                              href={htl.googleMapsUrl || buildGoogleMapsSearchUrl({ name: htl.name, city: htl.city })}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: '0.75rem', color: 'var(--tourism-earth)', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              <span>View on Maps</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 4: Budget Breakdown ── */}
                  {activePlanTab === 'budget' && (
                    <div>
                      <div style={{ marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                          Itemized Expense Sheet ({currentItinerary.durationDays} Days / {Math.max(1, currentItinerary.durationDays - 1)} Nights)
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                          Transparent cost projection for {currentItinerary.budget} tier
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Stay ({Math.max(1, currentItinerary.durationDays - 1)} Nights)</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A' }}>₹{estimatedBudget.stayTotal.toLocaleString('en-IN')}</div>
                        </div>

                        <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Monument Tickets</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--tourism-forest)' }}>₹{estimatedBudget.entryTotal.toLocaleString('en-IN')}</div>
                        </div>

                        <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Local Transit</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--tourism-sky)' }}>₹{estimatedBudget.transitTotal.toLocaleString('en-IN')}</div>
                        </div>

                        <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Food & Dining</div>
                          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--tourism-earth)' }}>₹{estimatedBudget.foodTotal.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div style={{
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        color: '#FFFFFF',
                        borderRadius: '14px',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>Total per Traveler</div>
                          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>
                            ₹{estimatedBudget.grandTotal.toLocaleString('en-IN')}{' '}
                            <span style={{ fontSize: '0.8rem', color: '#38BDF8' }}>(~₹{estimatedBudget.perDay}/day)</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => window.print()}
                          style={{ padding: '0.65rem 1rem', borderRadius: '8px', backgroundColor: 'var(--tourism-earth)', color: '#FFFFFF', fontWeight: 800, fontSize: '0.82rem', border: 'none', cursor: 'pointer' }}
                        >
                          Print Expense Sheet
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 5: Safety & Advisory ── */}
                  {activePlanTab === 'advisory' && (
                    <div>
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                          Travel Advisory & Emergency Safety
                        </h4>
                        <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                          Verified etiquette, UPI payment guidance & police dispatch
                        </p>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.35rem' }}>👗 Attire Guidelines</div>
                          <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                            Modest breathable cottons. Cover shoulders & knees in temples. Easy slip-on shoes recommended for quick removal at sanctums.
                          </p>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.35rem' }}>💳 Currency & UPI</div>
                          <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                            UPI digital QR payments work universally across street vendors and restaurants. Keep ₹1,500 cash for auto rickshaws & temple offerings.
                          </p>
                        </div>

                        <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '12px', padding: '1rem' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.35rem' }}>🚨 Emergency Contacts</div>
                          <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                            National Helpline: <strong>112</strong>. Multilingual Tourist Police: <strong>1363</strong> (toll-free, 12 languages supported).
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Global Directions Modal ── */}
      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        target={directionsTarget}
      />
    </div>
  );
}
