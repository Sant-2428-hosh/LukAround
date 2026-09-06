import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateItinerary, getCities, getHotels, getSafetyInfo, getCurrentUser, logoutUser, getPublicSettings, updateUserAvatar, getNearbyPlaces } from '../api/client';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  setDomTranslatorLanguage,
  getTranslationSync,
  translateTextAsync,
  translateRealtimeData,
  onTranslationsUpdated
} from '../services/translator';

const AppContext = createContext();

export const DESTINATIONS = [
  {
    id: "jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    category: "Heritage",
    tagline: "Imperial Palaces & Pink Sandstone Forts",
    rating: 4.9,
    reviewsCount: 14280,
    latitude: 26.9124,
    longitude: 75.7873,
    lat: 26.9124,
    lng: 75.7873,
    place_id: "ChIJFae3pU--bTkR3WshzK_Lwio",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    description: "Walk through royal courtyards, astronomical observatories, and hill-fort battlements across the regal Pink City of Rajasthan.",
    highlights: ["Amber Fort Hilltop", "Hawa Mahal Facade", "City Palace Museum", "Nahargarh Fort Sunset"],
    suggestedDays: 3,
    avgDailyBudgetInr: 3200,
    badge: "Most Popular",
    season: "Oct – Mar"
  },
  {
    id: "munnar",
    city: "Munnar",
    state: "Kerala",
    category: "Nature",
    tagline: "Emerald Tea Hills & Cloud-Draped Peaks",
    rating: 4.9,
    reviewsCount: 11450,
    latitude: 10.0889,
    longitude: 77.0595,
    lat: 10.0889,
    lng: 77.0595,
    place_id: "ChIJ27dC-85mBzsR6j92X5aY60k",
    imageUrl: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
    description: "Endless rolling tea plantations, cool mountain breeze, rare Nilgiri Tahr sanctuaries, and mist-wrapped lakes 1,600m above sea level.",
    highlights: ["Eravikulam National Park", "KDHP Tea Museum", "Top Station Peak", "Mattupetty Dam"],
    suggestedDays: 3,
    avgDailyBudgetInr: 2800,
    badge: "Hill Station Pick",
    season: "Sep – May"
  },
  {
    id: "varanasi",
    city: "Varanasi",
    state: "Uttar Pradesh",
    category: "Spiritual",
    tagline: "Ancient Ganga Ghats & Sacred Evening Aarti",
    rating: 4.9,
    reviewsCount: 16800,
    latitude: 25.3176,
    longitude: 82.9739,
    lat: 25.3176,
    lng: 82.9739,
    place_id: "ChIJn6w9n4_sjjkR2gZ8-fG7k-0",
    imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    description: "One of the world's oldest living cities. Experience divine twilight Ganga Aarti rituals, labyrinthine heritage alleys, and morning boat journeys.",
    highlights: ["Dashashwamedh Aarti", "Kashi Vishwanath Temple", "Assi Ghat Dawn", "Sarnath Stupa"],
    suggestedDays: 2,
    avgDailyBudgetInr: 2100,
    badge: "Spiritual Icon",
    season: "Oct – Mar"
  },
  {
    id: "goa",
    city: "Goa",
    state: "Goa",
    category: "Beaches",
    tagline: "Golden Sands, Portuguese Quarters & Coastal Flavours",
    rating: 4.8,
    reviewsCount: 18920,
    latitude: 15.2993,
    longitude: 74.1240,
    lat: 15.2993,
    lng: 74.1240,
    place_id: "ChIJQbc2YxC6vzsRkkDzYv-H-Oo",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    description: "Golden palm-fringed coastlines, 17th-century Latin Quarter villas, spice plantations, and fresh seafood shacks.",
    highlights: ["Fontainhas Latin Quarter", "Aguada Fort", "Anjuna Coastline", "Dudhsagar Falls"],
    suggestedDays: 4,
    avgDailyBudgetInr: 3500,
    badge: "Coastal Classic",
    season: "Nov – Feb"
  },
  {
    id: "chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    category: "Culture",
    tagline: "Dravidian Temples, Marina Breeze & Carnatic Heritage",
    rating: 4.8,
    reviewsCount: 13920,
    latitude: 13.0827,
    longitude: 80.2707,
    lat: 13.0827,
    lng: 80.2707,
    place_id: "ChIJYTN9T-plUjoRMugZXDa04Cg",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    description: "The cultural gateway of South India. Marvel at 7th-century Dravidian temple towers, world's second-longest urban beach, and filter coffee cafes.",
    highlights: ["Kapaleeshwarar Temple", "Marina Beach Shore", "San Thome Basilica", "Mylapore Heritage Walk"],
    suggestedDays: 3,
    avgDailyBudgetInr: 2600,
    badge: "Cultural Capital",
    season: "Nov – Feb"
  },
  {
    id: "agra",
    city: "Agra",
    state: "Uttar Pradesh",
    category: "Heritage",
    tagline: "Mughal Architecture & The Wonder of the World",
    rating: 4.8,
    reviewsCount: 22100,
    latitude: 27.1767,
    longitude: 78.0081,
    lat: 27.1767,
    lng: 78.0081,
    place_id: "ChIJmZ5m6S1FddkRUXuH3v463uM",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    description: "Home to the immortal Taj Mahal, the colossal red sandstone Agra Fort, and the abandoned royal city of Fatehpur Sikri.",
    highlights: ["Taj Mahal Sunrise", "Agra Red Fort", "Mehtab Bagh Views", "Fatehpur Sikri"],
    suggestedDays: 2,
    avgDailyBudgetInr: 2900,
    badge: "UNESCO Wonder",
    season: "Oct – Mar"
  },
  {
    id: "bangalore",
    city: "Bangalore",
    state: "Karnataka",
    category: "City",
    tagline: "Garden City Heritage, Palaces & Craft Breweries",
    rating: 4.7,
    reviewsCount: 9840,
    latitude: 12.9716,
    longitude: 77.5946,
    lat: 12.9716,
    lng: 77.5946,
    place_id: "ChIJbU60yXAWrjsR4E9-Ule3vno",
    imageUrl: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
    description: "A vibrant blend of royal Tudor palaces, sprawling 240-acre botanical gardens, historic silk markets, and energetic modern avenues.",
    highlights: ["Bangalore Palace", "Lalbagh Glass House", "Cubbon Park", "Tipu Sultan Summer Palace"],
    suggestedDays: 2,
    avgDailyBudgetInr: 3400,
    badge: "Garden City",
    season: "Year-round"
  },
  {
    id: "kochin",
    city: "Kochin",
    state: "Kerala",
    category: "Culture",
    tagline: "Colonial Spice Harbours & Chinese Fishing Nets",
    rating: 4.8,
    reviewsCount: 8420,
    latitude: 9.9312,
    longitude: 76.2673,
    lat: 9.9312,
    lng: 76.2673,
    place_id: "ChIJL9_eT_76CDsReO6X6Q2fM3o",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    description: "Portuguese churches, Jew Town antique alleys, Kathakali dance theatres, and scenic sunset ferry journeys.",
    highlights: ["Fort Kochi Nets", "Mattancherry Palace", "Jew Town Synagogue", "Kathakali Performance"],
    suggestedDays: 3,
    avgDailyBudgetInr: 2900,
    badge: "Spice Gateway",
    season: "Oct – Apr"
  },
  {
    id: "pondicherry",
    city: "Pondicherry",
    state: "Puducherry",
    category: "Heritage",
    tagline: "French Colonial Boulevards, Promenades & Auroville",
    rating: 4.7,
    reviewsCount: 7910,
    latitude: 11.9416,
    longitude: 79.8083,
    lat: 11.9416,
    lng: 79.8083,
    place_id: "ChIJ03wY3l9fUjoRk7sU1L8k_Ew",
    imageUrl: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    description: "Pastel French Quarter villas draped in bougainvillea, breezy seaside Rock Beach promenade, artisanal cafes, and spiritual sanctuaries.",
    highlights: ["White Town French Walk", "Rock Beach Promenade", "Auroville Matrimandir", "Sri Aurobindo Ashram"],
    suggestedDays: 2,
    avgDailyBudgetInr: 3100,
    badge: "French Riviera",
    season: "Oct – Mar"
  },
  {
    id: "yercaud",
    city: "Yercaud",
    state: "Tamil Nadu",
    category: "Nature",
    tagline: "Tranquil Shevaroy Hills, Coffee Forests & Viewpoints",
    rating: 4.6,
    reviewsCount: 4200,
    latitude: 11.7753,
    longitude: 78.2093,
    lat: 11.7753,
    lng: 78.2093,
    place_id: "ChIJyWd4v3g_qzsR74zV0u-s30k",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    description: "Quiet, unhurried hill station in the Eastern Ghats. Fragrant orange groves, spice plantations, and peaceful boathouse waters.",
    highlights: ["Emerald Lake Boating", "Pagoda Point", "Kiliyur Waterfalls", "Shevaroy Temple Peak"],
    suggestedDays: 2,
    avgDailyBudgetInr: 2200,
    badge: "Quiet Retreat",
    season: "Oct – Jun"
  },
  {
    id: "delhi",
    city: "Delhi",
    state: "Delhi NCR",
    category: "Heritage",
    tagline: "Millennium Heritage, Mughal Fortresses & Culinary Bazaars",
    rating: 4.8,
    reviewsCount: 24500,
    latitude: 28.6139,
    longitude: 77.2090,
    lat: 28.6139,
    lng: 77.2090,
    place_id: "ChIJLbZ-NFv9DDkRzk0gTkm3wlI",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    description: "Centuries of dynastic history from the Qutub Minar to Old Delhi's spice markets and the majestic India Gate.",
    highlights: ["Qutub Minar Complex", "Humayun's Tomb", "Red Fort & Chandni Chowk", "India Gate Boulevard"],
    suggestedDays: 3,
    avgDailyBudgetInr: 3100,
    badge: "Imperial Capital",
    season: "Oct – Mar"
  }
];

export const THEMES = [
  { id: 'crimson', name: 'Editorial Crimson', color: '#C0293C', dark: '#7A1626', light: '#F4E4E6', subtitle: 'Classic Luk Around Red' },
  { id: 'sunset', name: 'Sunset Terracotta', color: '#E65100', dark: '#BF360C', light: '#FFEBE5', subtitle: 'Warm Saffron & Rajput Earth' },
  { id: 'emerald', name: 'Kerala Emerald', color: '#059669', dark: '#064E3B', light: '#E6F7F0', subtitle: 'Lush Forest & Coastal Teal' },
  { id: 'lotus', name: 'Jaipur Lotus', color: '#E11D48', dark: '#881337', light: '#FFE8EC', subtitle: 'Pink City Rose & Purple' },
  { id: 'gold', name: 'Maharaja Gold', color: '#D97706', dark: '#78350F', light: '#FEF3C7', subtitle: '24K Royal Amber & Sunlight' },
  { id: 'himalaya', name: 'Himalayan Glacier', color: '#0284C7', dark: '#0C4A6E', light: '#E0F2FE', subtitle: 'Glacier Blue & High Cobalt' },
  { id: 'varanasi', name: 'Varanasi Twilight', color: '#EA580C', dark: '#7C2D12', light: '#FFEDD5', subtitle: 'Aarti Fire & Marigold' },
  { id: 'goa', name: 'Goa Sunset', color: '#DB2777', dark: '#831843', light: '#FCE7F3', subtitle: 'Tropical Orchid & Coral' },
  { id: 'indigo', name: 'Midnight Indigo', color: '#4F46E5', dark: '#312E81', light: '#EEF2FF', subtitle: 'Royal Lake Palace & Starlight' },
  { id: 'teal', name: 'Darjeeling Mint', color: '#0D9488', dark: '#134E4A', light: '#CCFBF1', subtitle: 'Lush Pine & Mountain Tea' },
];

/**
 * Supported Languages (Maximum 5 Indian / Global Languages)
 */
export const LANGUAGES = [
  { id: 'en', code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { id: 'hi', code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { id: 'ta', code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { id: 'te', code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { id: 'kn', code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

/**
 * Fast synchronous fallbacks for essential core nav labels (prevents momentary flicker)
 */
export const QUICK_NAV = {
  hi: { home: "होम", Home: "होम", destinations: "गंतव्य", Destinations: "गंतव्य", itinerary: "यात्रा योजना", Itinerary: "यात्रा योजना", hotels: "होटल", Hotels: "होटल", budget: "बजट", Budget: "बजट", safety: "सुरक्षा", Safety: "सुरक्षा", admin: "व्यवस्थापक", Admin: "व्यवस्थापक", superAdmin: "सुपर व्यवस्थापक", 'Super Admin': "सुपर व्यवस्थापक", sos: "SOS", SOS: "SOS", "travel india": "भारत यात्रा" },
  ta: { home: "முகப்பு", Home: "முகப்பு", destinations: "இடங்கள்", Destinations: "இடங்கள்", itinerary: "திட்டம்", Itinerary: "திட்டம்", hotels: "தங்குமிடம்", Hotels: "தங்குமிடம்", budget: "பட்ஜெட்", Budget: "பட்ஜெட்", safety: "பாதுகாப்பு", Safety: "பாதுகாப்பு", admin: "அட்மின்", Admin: "அட்மின்", superAdmin: "சூப்பர் அட்மின்", 'Super Admin': "சூப்பர் அட்மின்", sos: "SOS", SOS: "SOS", "travel india": "இந்தியா பயணம்" },
  te: { home: "హోమ్", Home: "హोమ్", destinations: "గమ్యస్థానాలు", Destinations: "గమ్యస్థానాలు", itinerary: "ప్రణాళిక", Itinerary: "ప్రణాళిక", hotels: "హోటళ్ళు", Hotels: "హోటళ్ళు", budget: "బడ్జెట్", Budget: "బడ్జెట్", safety: "భద్రత", Safety: "భద్రత", admin: "అడ్మిన్", Admin: "అడ్మిన్", superAdmin: "సూపర్ అడ్మిన్", 'Super Admin': "సూపర్ అడ్మిన్", sos: "SOS", SOS: "SOS", "travel india": "భారత ప్రయాణం" },
  kn: { home: "ಮುಖಪುಟ", Home: "ಮುಖಪುಟ", destinations: "ತಾಣಗಳು", Destinations: "ತಾಣಗಳು", itinerary: "ಪ್ರವಾಸ ಯೋಜನೆ", Itinerary: "ಪ್ರವಾಸ ಯೋಜನೆ", hotels: "ಹೋಟೆಲ್‌ಗಳು", Hotels: "ಹೋಟೆಲ್‌ಗಳು", budget: "ಬಜೆಟ್", Budget: "ಬಜೆಟ್", safety: "ಸುರಕ್ಷತೆ", Safety: "ಸುರಕ್ಷತೆ", admin: "ಅಡ್ಮಿನ್", Admin: "ಅಡ್ಮಿನ್", superAdmin: "ಸೂಪರ್ ಅಡ್ಮಿನ್", 'Super Admin': "ಸೂಪರ್ ಅಡ್ಮಿನ್", sos: "SOS", SOS: "SOS", "travel india": "ಭಾರತ ಪ್ರವಾಸ" }
};

export const TRANSLATIONS = QUICK_NAV;

export function AppProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState("Jaipur");
  const [days, setDays] = useState(3);
  const [itineraryData, setItineraryData] = useState(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [activeDay, setActiveDay] = useState(1);

  const [selectedTier, setSelectedTier] = useState("all");
  const [hotels, setHotels] = useState([]);
  const [activeBookingModal, setActiveBookingModal] = useState(null);

  const [safetyData, setSafetyData] = useState(null);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  const [currentTheme, setCurrentTheme] = useState('crimson');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // ── Geolocation & Real-time Nearby Places State ──
  const [userLocation, setUserLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('luk_user_loc');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);

  const detectUserLocation = (force = false) => {
    if (!navigator.geolocation) {
      console.warn('[detectUserLocation] Geolocation not supported');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await getNearbyPlaces(latitude, longitude, 40);
          if (res && res.success && res.location) {
            setUserLocation(res.location);
            setNearbyPlaces(res.data || []);
            localStorage.setItem('luk_user_loc', JSON.stringify(res.location));
          }
        } catch (err) {
          console.warn('[detectUserLocation] Nearby places API error:', err);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        console.warn('[detectUserLocation] Geolocation error / denied:', err.message);
        setLocationLoading(false);
      },
      { timeout: 12000, enableHighAccuracy: false }
    );
  };

  // Gentle location prompt on initial load
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem('luk_loc_prompted');
    if (!hasPrompted && !userLocation) {
      sessionStorage.setItem('luk_loc_prompted', '1');
      detectUserLocation();
    }
  }, []);

  // Fetch nearby places if userLocation is available (e.g. restored from localStorage) but nearbyPlaces list is empty
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng && nearbyPlaces.length === 0) {
      setLocationLoading(true);
      getNearbyPlaces(userLocation.lat, userLocation.lng, 40)
        .then((res) => {
          if (res && res.success && Array.isArray(res.data)) {
            setNearbyPlaces(res.data);
          }
        })
        .catch((err) => console.warn('[AppContext] Cached loc nearby places error:', err))
        .finally(() => setLocationLoading(false));
    }
  }, [userLocation]);

  // Authentication State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('luk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('luk_token') || null;
  });

  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authToast, setAuthToast] = useState(null);

  // Platform Broadcast & Feature Flags State
  const [broadcast, setBroadcast] = useState({ active: false });
  const [featureFlags, setFeatureFlags] = useState({});

  const fetchSettings = async () => {
    try {
      const data = await getPublicSettings();
      if (data && data.broadcast) setBroadcast(data.broadcast);
      if (data && data.featureFlags) setFeatureFlags(data.featureFlags);
    } catch (e) {
      // Offline fallback
    }
  };

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 20000);
    return () => clearInterval(interval);
  }, []);

  const isSuperAdmin = Boolean(user && (user.role === 'superadmin' || user.isSuperAdmin === true));
  const isAdmin = Boolean(isSuperAdmin || (user && (user.role === 'admin' || user.isAdmin === true)));

  // Validate stored session with backend on startup
  useEffect(() => {
    async function verifySession() {
      const storedToken = localStorage.getItem('luk_token');
      if (storedToken) {
        try {
          const res = await getCurrentUser(storedToken);
          if (res && res.authenticated && res.user) {
            setUser(res.user);
            localStorage.setItem('luk_user', JSON.stringify(res.user));
          } else {
            // Expired or invalid token
            setUser(null);
            setToken(null);
            localStorage.removeItem('luk_user');
            localStorage.removeItem('luk_token');
          }
        } catch (e) {
          // Keep offline state if server temporarily unreachable
        }
      } else {
        setUser(null);
      }
      setIsAuthChecking(false);
    }
    verifySession();
  }, []);

  const loginAuth = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr || '');
    if (userData) localStorage.setItem('luk_user', JSON.stringify(userData));
    if (tokenStr) localStorage.setItem('luk_token', tokenStr);
  };

  const logoutAuth = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Backend logout warning:', e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('luk_user');
    localStorage.removeItem('luk_token');
  };

  const showToast = (message, type = 'success') => {
    setAuthToast({ message, type });
    setTimeout(() => setAuthToast(null), 4000);
  };

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setThemeDropdownOpen(false);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('luk_lang') || 'en';
  });
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [, setLangRenderTrigger] = useState(0);

  // Subscribe to background translation updates so components calling t() re-render dynamically
  useEffect(() => {
    return onTranslationsUpdated(() => {
      setLangRenderTrigger(prev => prev + 1);
    });
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('luk_lang', langCode);
    setLanguageDropdownOpen(false);
    setDomTranslatorLanguage(langCode);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem('luk_lang') || 'en';
    setDomTranslatorLanguage(savedLang);
  }, []);

  // Universal real-time dynamic translation helper for any incoming API data (itinerary, hotels, safety, etc.)
  const dynamicTranslate = async (dataOrText) => {
    if (!dataOrText || currentLanguage === 'en') return dataOrText;
    if (typeof dataOrText === 'string') {
      return await translateTextAsync(dataOrText, currentLanguage);
    }
    return await translateRealtimeData(dataOrText, currentLanguage);
  };

  // Universal dynamic translation helper: works for any string (static or real-time)
  const t = (text) => {
    if (!text || typeof text !== 'string') return text || '';
    if (currentLanguage === 'en') return text;
    // Check quick nav labels first for instant zero-latency UI
    if (QUICK_NAV[currentLanguage]?.[text]) {
      return QUICK_NAV[currentLanguage][text];
    }
    return getTranslationSync(text, currentLanguage);
  };

  // ── Auto-sync Google Profile Photo from Firebase Auth ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.photoURL) {
        const googlePhoto = fbUser.photoURL;
        setUser((prev) => {
          if (prev && (!prev.avatar || prev.avatar.includes('dicebear') || prev.avatar !== googlePhoto)) {
            const updated = { ...prev, avatar: googlePhoto };
            localStorage.setItem('luk_user', JSON.stringify(updated));
            const storedToken = localStorage.getItem('luk_token');
            if (storedToken) {
              updateUserAvatar(storedToken, googlePhoto);
            }
            return updated;
          }
          return prev;
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Initial Itinerary generation for authenticated user
  useEffect(() => {
    if (user) {
      handleGenerateItinerary("Jaipur", 3);
    }
  }, [user?.id]);

  async function handleGenerateItinerary(cityToGen, daysToGen) {
    const c = cityToGen || selectedCity;
    const d = Number(daysToGen || days);
    setLoadingItinerary(true);

    try {
      // 1. Fetch Itinerary from POST /api/itinerary
      const itinRes = await generateItinerary(c, d);
      if (itinRes && (itinRes.success || itinRes.itinerary)) {
        const payload = itinRes.itinerary ? itinRes : (itinRes.data || itinRes);
        setItineraryData(payload);
        setActiveDay(1);
      }

      // 2. Fetch Hotels from GET /api/hotels
      const hotelsRes = await getHotels(c, selectedTier);
      if (hotelsRes) {
        const hotelList = Array.isArray(hotelsRes.data)
          ? hotelsRes.data
          : (hotelsRes.data?.hotels || hotelsRes.hotels || []);
        setHotels(hotelList);
      }

      // 3. Fetch Safety Info from GET /api/safety
      const safetyRes = await getSafetyInfo(c);
      if (safetyRes) {
        setSafetyData(safetyRes.data || safetyRes);
      }
    } catch (err) {
      console.error("Failed to generate plan:", err);
    } finally {
      setLoadingItinerary(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        DESTINATIONS,
        THEMES,
        LANGUAGES,
        currentLanguage,
        handleLanguageChange,
        languageDropdownOpen,
        setLanguageDropdownOpen,
        t,
        dynamicTranslate,
        selectedCity,
        setSelectedCity,
        days,
        setDays,
        itineraryData,
        loadingItinerary,
        activeDay,
        setActiveDay,
        selectedTier,
        setSelectedTier,
        hotels,
        setHotels,
        activeBookingModal,
        setActiveBookingModal,
        safetyData,
        isSosModalOpen,
        setIsSosModalOpen,
        currentTheme,
        handleThemeChange,
        themeDropdownOpen,
        setThemeDropdownOpen,
        handleGenerateItinerary,
        user,
        token,
        isAuthChecking,
        loginAuth,
        logoutAuth,
        authToast,
        setAuthToast,
        showToast,
        isSuperAdmin,
        isAdmin,
        broadcast,
        setBroadcast,
        featureFlags,
        fetchSettings,
        userLocation,
        setUserLocation,
        nearbyPlaces,
        locationLoading,
        detectUserLocation
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
