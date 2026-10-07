import React, { useState, useRef, useEffect } from "react";
import { Sparkles, ArrowRight, MapPin, Compass, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const CITIES = [
  "Jaipur","Varanasi","Goa","Munnar","Agra","Delhi","Chennai",
  "Bangalore","Pondicherry","Kochi","Yercaud","Mumbai","Udaipur",
  "Hampi","Rishikesh","Mysore","Ooty","Darjeeling","Shimla",
  "Manali","Coorg","Alleppey","Trivandrum","Jodhpur","Jaisalmer",
  "Pushkar","Amritsar","Leh","Srinagar","Gangtok","Madurai",
];

const QUICK_PICKS = ["Jaipur","Varanasi","Goa","Munnar","Agra","Ooty"];

const DURATION_OPTIONS = [
  { label: "2D", value: 2 },
  { label: "3D", value: 3 },
  { label: "5D", value: 5 },
  { label: "7D", value: 7 },
];

const MOOD_CHIPS = [
  { label: "All",       icon: "✨", color: null       },
  { label: "Heritage",  icon: "🏰", color: "#FFB300"  },
  { label: "Beach",     icon: "🌴", color: "#00BCD4"  },
  { label: "Spiritual", icon: "🛕", color: "#FF7043"  },
  { label: "Nature",    icon: "🍃", color: "#43A047"  },
  { label: "City",      icon: "🌆", color: "#7C4DFF"  },
];

const CITY_BY_MOOD = {
  Heritage:  ["Jaipur","Agra","Hampi","Delhi","Pondicherry","Mysore"],
  Beach:     ["Goa","Kovalam","Varkala","Alleppey","Puri"],
  Spiritual: ["Varanasi","Rishikesh","Tirupati","Madurai","Amritsar","Pushkar"],
  Nature:    ["Munnar","Ooty","Coorg","Darjeeling","Shimla","Manali","Yercaud"],
  City:      ["Bangalore","Chennai","Mumbai","Delhi","Hyderabad","Pune"],
};

const PLACEHOLDERS = [
  '3 days in Goa on a budget...',
  'Spiritual tour of Varanasi...',
  'Hill stations near Chennai...',
  'Heritage walk in Jaipur...',
  'Beach escape to Munnar...',
];

export default function HeroChatSearch() {
  const navigate = useNavigate();
  const { setSelectedCity, setDays, handleGenerateItinerary } = useApp();

  const [query,            setQuery]            = useState("");
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [activeMood,       setActiveMood]       = useState("All");
  const [suggestions,      setSuggestions]      = useState([]);
  const [showSuggestions,  setShowSuggestions]  = useState(false);
  const [focused,          setFocused]          = useState(false);
  const [placeholderIdx,   setPlaceholderIdx]   = useState(0);
  const [isSubmitting,     setIsSubmitting]     = useState(false);
  const inputRef = useRef(null);
  const wrapRef  = useRef(null);

  // Rotating placeholder
  useEffect(() => {
    const tick = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(tick);
  }, []);

  // Autocomplete filter
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return; }
    const lower    = query.toLowerCase();
    const filtered = CITIES.filter(c => c.toLowerCase().startsWith(lower)).slice(0, 6);
    setSuggestions(filtered);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayPicks = activeMood === "All"
    ? QUICK_PICKS
    : (CITY_BY_MOOD[activeMood] || QUICK_PICKS).slice(0, 6);

  const handleSearch = (cityOverride) => {
    const cityInput = cityOverride || (() => {
      const lower   = query.toLowerCase();
      const matched = CITIES.find(c => lower.includes(c.toLowerCase()));
      return matched || query.trim();
    })();
    if (!cityInput) return;
    setIsSubmitting(true);
    setSelectedCity(cityInput);
    setDays(selectedDuration);
    handleGenerateItinerary(cityInput, selectedDuration);
    navigate(`/itinerary?city=${encodeURIComponent(cityInput)}&days=${selectedDuration}`);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter")  { setShowSuggestions(false); handleSearch(); }
    if (e.key === "Escape") { setShowSuggestions(false); setFocused(false); }
  };

  const pickCity = city => {
    setQuery(city);
    setShowSuggestions(false);
    handleSearch(city);
  };

  const selectMood = mood => {
    setActiveMood(mood);
    if (mood !== "All") { setQuery(""); setSuggestions([]); }
  };

  return (
    <section className="hcs-section" aria-label="AI Travel Planner Search">
      <div className="hcs-orb hcs-orb--left"  aria-hidden="true" />
      <div className="hcs-orb hcs-orb--right" aria-hidden="true" />
      <div className="hcs-orb hcs-orb--center" aria-hidden="true" />

      <div className="hcs-container">

        <div className="hcs-badge">
          <Sparkles size={13} aria-hidden="true" />
          <span>AI-Powered Travel Planner</span>
        </div>

        <h2 className="hcs-title">
          Where would you like to{" "}
          <span className="hcs-title__accent">explore</span> in India?
        </h2>

        <p className="hcs-subtitle">
          Describe your trip in natural language or pick a city — we will craft
          your perfect itinerary <em>instantly</em>.
        </p>

        <div className="hcs-search-wrap" ref={wrapRef} role="search">
          <div className={`hcs-search-bar${focused ? " hcs-search-bar--focused" : ""}`}>
            <div className="hcs-search-icon" aria-hidden="true">
              <Compass size={20} />
            </div>

            <input
              ref={inputRef}
              id="hero-city-search"
              type="text"
              className="hcs-search-input"
              placeholder={PLACEHOLDERS[placeholderIdx]}
              aria-label="Search destination or describe your trip"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => { setFocused(true); setShowSuggestions(true); }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />

            <div className="hcs-duration-group" role="group" aria-label="Trip duration">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selectedDuration === opt.value}
                  className={`hcs-dur-btn${selectedDuration === opt.value ? " hcs-dur-btn--active" : ""}`}
                  onClick={() => setSelectedDuration(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="hcs-divider" aria-hidden="true" />

            <button
              type="button"
              id="hero-plan-trip-btn"
              className={`hcs-cta${isSubmitting ? " hcs-cta--loading" : ""}`}
              onClick={() => handleSearch()}
              disabled={(!query.trim() && activeMood === "All") || isSubmitting}
              aria-label="Plan my trip"
            >
              {isSubmitting ? (
                <span className="hcs-cta__spinner" aria-hidden="true" />
              ) : (
                <>
                  <span>Plan My Trip</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="hcs-autocomplete" role="listbox" aria-label="City suggestions">
              {suggestions.map(city => (
                <button
                  key={city}
                  role="option"
                  className="hcs-autocomplete__item"
                  onMouseDown={() => pickCity(city)}
                >
                  <MapPin size={13} className="hcs-autocomplete__pin" aria-hidden="true" />
                  <span className="hcs-autocomplete__city">{city}</span>
                  <span className="hcs-autocomplete__cta" aria-hidden="true">Plan &rarr;</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hcs-mood-row" role="toolbar" aria-label="Filter by travel mood">
          {MOOD_CHIPS.map(m => (
            <button
              key={m.label}
              type="button"
              aria-pressed={activeMood === m.label}
              className={`hcs-mood${activeMood === m.label ? " hcs-mood--active" : ""}`}
              onClick={() => selectMood(m.label)}
              style={
                activeMood === m.label && m.color
                  ? { background: m.color, borderColor: m.color }
                  : undefined
              }
            >
              <span aria-hidden="true">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <div className="hcs-picks" aria-label="Quick city picks">
          <span className="hcs-picks__label">
            <Flame size={12} aria-hidden="true" />
            Trending:
          </span>
          {displayPicks.map(city => (
            <button
              key={city}
              type="button"
              className="hcs-pick-btn"
              onClick={() => pickCity(city)}
              aria-label={`Plan a trip to ${city}`}
            >
              {city}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
