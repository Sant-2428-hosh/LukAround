import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sparkles, ArrowRight, MapPin, Compass, Flame,
  X, Star, Clock, CheckCircle2, Shuffle, Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const CITIES = [
  "Jaipur", "Varanasi", "Goa", "Munnar", "Agra", "Delhi", "Chennai",
  "Bangalore", "Pondicherry", "Kochi", "Yercaud", "Mumbai", "Udaipur",
  "Hampi", "Rishikesh", "Mysore", "Ooty", "Darjeeling", "Shimla",
  "Manali", "Coorg", "Alleppey", "Trivandrum", "Jodhpur", "Jaisalmer",
  "Pushkar", "Amritsar", "Leh", "Srinagar", "Gangtok", "Madurai"
];

const TRENDING_HOTSPOTS = [
  { city: "Jaipur", icon: "🏰", rating: "4.9", state: "Rajasthan", tag: "Heritage", days: 3 },
  { city: "Goa", icon: "🌴", rating: "4.8", state: "Goa", tag: "Beach", days: 4 },
  { city: "Varanasi", icon: "🛕", rating: "4.9", state: "Uttar Pradesh", tag: "Spiritual", days: 2 },
  { city: "Munnar", icon: "🍃", rating: "4.9", state: "Kerala", tag: "Nature", days: 3 },
  { city: "Udaipur", icon: "👑", rating: "4.9", state: "Rajasthan", tag: "Heritage", days: 3 },
  { city: "Manali", icon: "🏔️", rating: "4.8", state: "Himachal", tag: "Hills", days: 4 },
  { city: "Agra", icon: "🕌", rating: "4.8", state: "Uttar Pradesh", tag: "Heritage", days: 2 },
  { city: "Ooty", icon: "🌲", rating: "4.7", state: "Tamil Nadu", tag: "Nature", days: 3 }
];

const DURATION_OPTIONS = [
  { label: "2 Days", short: "2D", value: 2 },
  { label: "3 Days", short: "3D", value: 3 },
  { label: "5 Days", short: "5D", value: 5 },
  { label: "7 Days", short: "7D", value: 7 }
];

const MOOD_CHIPS = [
  { label: "All Horizons", short: "All", icon: "✨", color: "#E11D48", glow: "rgba(225, 29, 72, 0.4)", query: "" },
  { label: "Royal Heritage", short: "Heritage", icon: "🏰", color: "#F59E0B", glow: "rgba(245, 158, 11, 0.4)", query: "Heritage palaces in Jaipur" },
  { label: "Sunlit Beaches", short: "Beach", icon: "🌴", color: "#06B6D4", glow: "rgba(6, 182, 212, 0.4)", query: "Beach getaway in Goa" },
  { label: "Sacred & Spiritual", short: "Spiritual", icon: "🛕", color: "#F97316", glow: "rgba(249, 115, 22, 0.4)", query: "Ganga Aarti in Varanasi" },
  { label: "Mist & Hills", short: "Nature", icon: "🍃", color: "#10B981", glow: "rgba(16, 185, 129, 0.4)", query: "Tea plantations in Munnar" },
  { label: "Metro & Culture", short: "City", icon: "🏙️", color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.4)", query: "City exploration in Mumbai" }
];

const CITY_BY_MOOD = {
  Heritage: ["Jaipur", "Udaipur", "Agra", "Hampi", "Delhi", "Mysore", "Jodhpur"],
  Beach: ["Goa", "Pondicherry", "Alleppey", "Kochi", "Chennai"],
  Spiritual: ["Varanasi", "Rishikesh", "Amritsar", "Madurai", "Pushkar"],
  Nature: ["Munnar", "Ooty", "Manali", "Coorg", "Darjeeling", "Shimla"],
  City: ["Mumbai", "Bangalore", "Delhi", "Chennai", "Hyderabad"]
};

const SAMPLE_PROMPTS = [
  "3-day royal palace & heritage walk in Jaipur...",
  "Relaxing beach holiday in South Goa on a budget...",
  "Spiritual sunrise boat ride & Ganga Aarti in Varanasi...",
  "Misty tea hills & waterfalls trail in Munnar...",
  "Romantic sunset cruise on Lake Pichola in Udaipur...",
  "Street food trail & historic monuments in Delhi...",
  "Snow-capped mountain escape in Manali with cafe visits..."
];

const QUICK_INSPIRATIONS = [
  { title: "Royal Jaipur Trail", city: "Jaipur", days: 3, icon: "🏰", tag: "Heritage & Forts" },
  { title: "Goa Coastal Vibe", city: "Goa", days: 4, icon: "🌴", tag: "Beaches & Sunset" },
  { title: "Sacred Varanasi Aarti", city: "Varanasi", days: 2, icon: "🛕", tag: "Ancient Ghats" },
  { title: "Misty Munnar Peaks", city: "Munnar", days: 3, icon: "🍃", tag: "Tea Plantations" }
];

export default function HeroChatSearch() {
  const navigate = useNavigate();
  const { setSelectedCity, setDays, handleGenerateItinerary } = useApp();

  const [query, setQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [activeMood, setActiveMood] = useState("All Horizons");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // ── Smooth Typewriter Animation for Placeholder ─────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let charIdx = 0;
    let promptIdx = 0;
    let isDeleting = false;
    let timeoutId = null;

    const typeLoop = () => {
      if (!isMounted) return;
      const currentPrompt = SAMPLE_PROMPTS[promptIdx];

      if (!isDeleting) {
        charIdx++;
        setPlaceholderText(currentPrompt.slice(0, charIdx));
        if (charIdx === currentPrompt.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeLoop();
          }, 2400);
          return;
        }
        timeoutId = setTimeout(typeLoop, 42);
      } else {
        charIdx--;
        setPlaceholderText(currentPrompt.slice(0, charIdx));
        if (charIdx === 0) {
          isDeleting = false;
          promptIdx = (promptIdx + 1) % SAMPLE_PROMPTS.length;
          timeoutId = setTimeout(typeLoop, 500);
          return;
        }
        timeoutId = setTimeout(typeLoop, 22);
      }
    };

    timeoutId = setTimeout(typeLoop, 800);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // ── Autocomplete Filter ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = CITIES.filter(c => c.toLowerCase().includes(lower)).slice(0, 6);
    setSuggestions(filtered);
  }, [query]);

  // ── Close dropdown on outside click ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Destination Picks based on selected mood ────────────────────────────────
  const activeMoodObj = useMemo(() => {
    return MOOD_CHIPS.find(m => m.label === activeMood) || MOOD_CHIPS[0];
  }, [activeMood]);

  const displayHotspots = useMemo(() => {
    if (activeMoodObj.short === "All") return TRENDING_HOTSPOTS;
    const moodCities = CITY_BY_MOOD[activeMoodObj.short] || [];
    return TRENDING_HOTSPOTS.filter(h => moodCities.includes(h.city));
  }, [activeMoodObj]);

  // ── Execute Trip Search / Navigation ─────────────────────────────────────────
  const handleSearch = (cityOverride, daysOverride) => {
    const targetDays = daysOverride || selectedDuration;
    const cityInput = cityOverride || (() => {
      const lower = query.toLowerCase();
      const matched = CITIES.find(c => lower.includes(c.toLowerCase()));
      return matched || query.trim();
    })();

    if (!cityInput) {
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setSelectedCity(cityInput);
    setDays(targetDays);
    handleGenerateItinerary(cityInput, targetDays);
    navigate(`/itinerary?city=${encodeURIComponent(cityInput)}&days=${targetDays}`);
    setTimeout(() => setIsSubmitting(false), 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
      handleSearch();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const pickCity = (city, suggestedDays) => {
    setQuery(city);
    setShowSuggestions(false);
    handleSearch(city, suggestedDays || selectedDuration);
  };

  const handleMoodSelect = (moodItem) => {
    setActiveMood(moodItem.label);
    if (moodItem.query) {
      setQuery(moodItem.query);
      setShowSuggestions(false);
    } else {
      setQuery("");
    }
  };

  const handleSurpriseMe = () => {
    const randomPick = TRENDING_HOTSPOTS[Math.floor(Math.random() * TRENDING_HOTSPOTS.length)];
    pickCity(randomPick.city, randomPick.days);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <section className="hcs-section" aria-label="AI Travel Planner Search">
      {/* ── Cinematic Ambient Orbs & Atmospheric Aurora ── */}
      <div className="hcs-orb hcs-orb--left" aria-hidden="true" />
      <div className="hcs-orb hcs-orb--right" aria-hidden="true" />
      <div className="hcs-orb hcs-orb--center" aria-hidden="true" />
      <div className="hcs-starlight-grid" aria-hidden="true" />

      <div className="hcs-container">

        {/* ── Luxury Glowing Badge ── */}
        <div className="hcs-badge" title="Powered by LukAround AI Itinerary Engine">
          <span className="hcs-badge-dot" />
          <Sparkles size={13} className="hcs-badge-sparkle" aria-hidden="true" />
          <span>NEXT-GEN AI TRAVEL CONCIERGE</span>
        </div>

        {/* ── High-Impact Headline with Radiant Gradient Shimmer ── */}
        <h2 className="hcs-title">
          Where would you like to{" "}
          <span className="hcs-title__accent">explore</span> in India?
        </h2>

        {/* ── Subtitle ── */}
        <p className="hcs-subtitle">
          Describe your dream trip or pick a destination — our AI crafts your personalized
          day-by-day itinerary with <em>verified ₹ budgets</em> & live routes instantly.
        </p>

        {/* ── The Centerpiece: Floating Luxury Search Dock ── */}
        <div className="hcs-search-wrap" ref={wrapRef} role="search">
          <div className={`hcs-search-bar ${focused ? "hcs-search-bar--focused" : ""}`}>
            
            {/* Compass / Compass Icon Shield */}
            <div className="hcs-search-icon-badge" aria-hidden="true">
              <Compass size={20} className="hcs-search-compass" />
            </div>

            {/* Input with Typewriter Placeholder */}
            <div className="hcs-input-inner">
              <input
                ref={inputRef}
                id="hero-city-search"
                type="text"
                className="hcs-search-input"
                placeholder={placeholderText || "Heritage walk in Jaipur, Goa beaches..."}
                aria-label="Search destination or describe your trip"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  setFocused(true);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="hcs-clear-btn"
                  onClick={handleClear}
                  title="Clear input"
                  aria-label="Clear search input"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Trip Duration Segmented Control */}
            <div className="hcs-duration-group" role="group" aria-label="Trip duration">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={selectedDuration === opt.value}
                  className={`hcs-dur-btn ${selectedDuration === opt.value ? "hcs-dur-btn--active" : ""}`}
                  onClick={() => setSelectedDuration(opt.value)}
                  title={`${opt.label} itinerary`}
                >
                  <span className="hcs-dur-full">{opt.label}</span>
                  <span className="hcs-dur-short">{opt.short}</span>
                </button>
              ))}
            </div>

            <div className="hcs-divider" aria-hidden="true" />

            {/* Radiant CTA Button */}
            <button
              type="button"
              id="hero-plan-trip-btn"
              className={`hcs-cta ${isSubmitting ? "hcs-cta--loading" : ""}`}
              onClick={() => handleSearch()}
              aria-label="Plan my trip"
              title="Generate AI Itinerary"
            >
              {isSubmitting ? (
                <>
                  <span className="hcs-cta__spinner" aria-hidden="true" />
                  <span>Crafting...</span>
                </>
              ) : (
                <>
                  <span>Plan My Trip</span>
                  <ArrowRight size={16} className="hcs-cta-arrow" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {/* ── Smart Autocomplete & Quick Inspiration Floating Panel ── */}
          {showSuggestions && (
            <div className="hcs-autocomplete" role="listbox" aria-label="City suggestions">
              {suggestions.length > 0 ? (
                // Filtered Matches
                <div className="hcs-autocomplete-list">
                  <div className="hcs-dropdown-section-title">Matching Destinations</div>
                  {suggestions.map((city) => {
                    const matchData = TRENDING_HOTSPOTS.find(h => h.city === city);
                    return (
                      <button
                        key={city}
                        role="option"
                        className="hcs-autocomplete__item"
                        onMouseDown={() => pickCity(city)}
                      >
                        <div className="hcs-autocomplete__item-left">
                          <div className="hcs-autocomplete__pin-ring">
                            <MapPin size={13} className="hcs-autocomplete__pin" aria-hidden="true" />
                          </div>
                          <div className="hcs-autocomplete__city-info">
                            <span className="hcs-autocomplete__city">{city}</span>
                            {matchData && (
                              <span className="hcs-autocomplete__state">
                                {matchData.state} • {matchData.tag}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hcs-autocomplete__item-right">
                          {matchData && (
                            <span className="hcs-autocomplete__rating">
                              <Star size={11} fill="#F59E0B" color="#F59E0B" /> {matchData.rating}
                            </span>
                          )}
                          <span className="hcs-autocomplete__cta" aria-hidden="true">
                            Plan Trip &rarr;
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Quick Inspirations when search input is empty or broad
                <div className="hcs-dropdown-inspirations">
                  <div className="hcs-dropdown-section-title">
                    <Sparkles size={12} color="#E11D48" />
                    <span>Popular AI Trip Blueprints</span>
                  </div>
                  <div className="hcs-inspiration-grid">
                    {QUICK_INSPIRATIONS.map((insp) => (
                      <button
                        key={insp.city}
                        type="button"
                        className="hcs-inspiration-card"
                        onMouseDown={() => pickCity(insp.city, insp.days)}
                      >
                        <span className="hcs-inspiration-icon">{insp.icon}</span>
                        <div className="hcs-inspiration-meta">
                          <span className="hcs-inspiration-title">{insp.title}</span>
                          <span className="hcs-inspiration-sub">{insp.days} Days • {insp.tag}</span>
                        </div>
                        <ArrowRight size={13} className="hcs-inspiration-arrow" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Glassmorphism Mood / Category Filter Pills ── */}
        <div className="hcs-mood-row" role="toolbar" aria-label="Filter by travel mood">
          {MOOD_CHIPS.map((m) => {
            const isActive = activeMood === m.label;
            return (
              <button
                key={m.label}
                type="button"
                aria-pressed={isActive}
                className={`hcs-mood ${isActive ? "hcs-mood--active" : ""}`}
                onClick={() => handleMoodSelect(m)}
                style={
                  isActive
                    ? {
                        background: m.color,
                        borderColor: m.color,
                        boxShadow: `0 4px 18px ${m.glow}`
                      }
                    : undefined
                }
              >
                <span className="hcs-mood-icon" aria-hidden="true">{m.icon}</span>
                <span className="hcs-mood-label">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Trending Hotspots Pill Bar with Ratings ── */}
        <div className="hcs-picks" aria-label="Trending destinations in India">
          <div className="hcs-picks__label">
            <Flame size={14} className="hcs-flame-icon" aria-hidden="true" />
            <span>Trending:</span>
          </div>

          <div className="hcs-picks-list">
            {displayHotspots.map((item) => (
              <button
                key={item.city}
                type="button"
                className="hcs-pick-btn"
                onClick={() => pickCity(item.city, item.days)}
                aria-label={`Plan a trip to ${item.city}`}
                title={`Explore ${item.city} (${item.state})`}
              >
                <span className="hcs-pick-icon">{item.icon}</span>
                <span className="hcs-pick-name">{item.city}</span>
                <span className="hcs-pick-rating">
                  <Star size={10} fill="#F59E0B" color="#F59E0B" /> {item.rating}
                </span>
              </button>
            ))}

            {/* Surprise Me Shuffle Button */}
            <button
              type="button"
              className="hcs-pick-btn hcs-pick-btn--surprise"
              onClick={handleSurpriseMe}
              title="Surprise me with a random destination!"
            >
              <Shuffle size={12} />
              <span>Surprise Me</span>
            </button>
          </div>
        </div>

        {/* ── Trust & Quality Assurance Ribbon ── */}
        <div className="hcs-trust-bar">
          <div className="hcs-trust-item">
            <CheckCircle2 size={13} className="hcs-trust-check" />
            <span>100% Free & Instant</span>
          </div>
          <span className="hcs-trust-dot">•</span>
          <div className="hcs-trust-item">
            <CheckCircle2 size={13} className="hcs-trust-check" />
            <span>AI Proximity Clustering</span>
          </div>
          <span className="hcs-trust-dot">•</span>
          <div className="hcs-trust-item">
            <CheckCircle2 size={13} className="hcs-trust-check" />
            <span>Verified ₹ Budgets & Helplines</span>
          </div>
        </div>

      </div>
    </section>
  );
}
