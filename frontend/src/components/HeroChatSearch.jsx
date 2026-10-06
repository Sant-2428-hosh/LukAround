import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, ArrowRight, MapPin, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CITIES = [
  'Jaipur', 'Varanasi', 'Goa', 'Munnar', 'Agra', 'Delhi', 'Chennai',
  'Bangalore', 'Pondicherry', 'Kochi', 'Yercaud', 'Mumbai', 'Udaipur',
  'Hampi', 'Rishikesh', 'Mysore', 'Ooty', 'Darjeeling', 'Shimla',
  'Manali', 'Coorg', 'Alleppey', 'Trivandrum', 'Jodhpur', 'Jaisalmer',
  'Pushkar', 'Amritsar', 'Leh', 'Srinagar', 'Gangtok', 'Madurai'
];

const QUICK_PICKS = ['Jaipur', 'Varanasi', 'Goa', 'Munnar', 'Agra', 'Ooty'];

const DURATION_OPTIONS = [
  { label: '2 Days', value: 2 },
  { label: '3 Days', value: 3 },
  { label: '5 Days', value: 5 },
  { label: '7 Days', value: 7 },
];

const MOOD_CHIPS = [
  { label: 'All', icon: '✨' },
  { label: 'Heritage', icon: '🏰' },
  { label: 'Beach', icon: '🌴' },
  { label: 'Spiritual', icon: '🛕' },
  { label: 'Nature', icon: '🍃' },
  { label: 'City', icon: '🌆' },
];

const CITY_BY_MOOD = {
  Heritage: ['Jaipur', 'Agra', 'Hampi', 'Delhi', 'Pondicherry', 'Mysore'],
  Beach: ['Goa', 'Kovalam', 'Varkala', 'Alleppey', 'Puri'],
  Spiritual: ['Varanasi', 'Rishikesh', 'Tirupati', 'Madurai', 'Amritsar', 'Pushkar'],
  Nature: ['Munnar', 'Ooty', 'Coorg', 'Darjeeling', 'Shimla', 'Manali', 'Yercaud'],
  City: ['Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'],
};

export default function HeroChatSearch() {
  const navigate = useNavigate();
  const { setSelectedCity, setDays, handleGenerateItinerary } = useApp();

  const [query, setQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(3);
  const [activeMood, setActiveMood] = useState('All');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Autocomplete filter
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = CITIES.filter(c => c.toLowerCase().startsWith(lower)).slice(0, 6);
    setSuggestions(filtered);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Get displayed quick picks based on mood
  const displayPicks = activeMood === 'All'
    ? QUICK_PICKS
    : (CITY_BY_MOOD[activeMood] || QUICK_PICKS).slice(0, 6);

  const handleSearch = (cityOverride) => {
    // Try to parse city from query if no override
    const cityInput = cityOverride || (() => {
      const lower = query.toLowerCase();
      const matched = CITIES.find(c => lower.includes(c.toLowerCase()));
      return matched || query.trim();
    })();

    if (!cityInput) return;

    setSelectedCity(cityInput);
    setDays(selectedDuration);
    handleGenerateItinerary(cityInput, selectedDuration);
    navigate(`/itinerary?city=${encodeURIComponent(cityInput)}&days=${selectedDuration}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setFocused(false);
    }
  };

  const pickCity = (city) => {
    setQuery(city);
    setShowSuggestions(false);
    handleSearch(city);
  };

  const selectMood = (mood) => {
    setActiveMood(mood);
    if (mood !== 'All') {
      setQuery('');
      setSuggestions([]);
    }
  };

  return (
    <section className="hero-chat-section">
      <div className="hero-chat-container">
        {/* Headline */}
        <div className="hero-chat-headline">
          <div className="hero-chat-badge">
            <Sparkles size={14} />
            AI-Powered Travel Planner
          </div>
          <h2 className="hero-chat-title">
            Where would you like to explore in India?
          </h2>
          <p className="hero-chat-subtitle">
            Describe your trip in natural language or pick a city below — we'll craft your perfect itinerary instantly.
          </p>
        </div>

        {/* Search bar */}
        <div className="hero-search-wrap" ref={wrapRef}>
          <div className={`hero-search-bar ${focused ? 'hero-search-bar--focused' : ''}`}>
            <div className="hero-search-icon">
              <Compass size={20} color="var(--color-primary)" />
            </div>
            <input
              ref={inputRef}
              type="text"
              className="hero-search-input"
              placeholder='Try "3 days in Goa on a budget" or just a city name…'
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => { setFocused(true); setShowSuggestions(true); }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
            />

            {/* Duration selector */}
            <div className="hero-duration-picker">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`hero-duration-btn ${selectedDuration === opt.value ? 'hero-duration-btn--active' : ''}`}
                  onClick={() => setSelectedDuration(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              className="hero-search-submit"
              onClick={() => handleSearch()}
              disabled={!query.trim() && activeMood === 'All'}
            >
              <span>Plan My Trip</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="hero-autocomplete">
              {suggestions.map((city) => (
                <button
                  key={city}
                  className="hero-autocomplete-item"
                  onMouseDown={() => pickCity(city)}
                >
                  <MapPin size={13} color="var(--color-primary)" />
                  <span>{city}</span>
                  <span className="hero-autocomplete-plan">Plan →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mood chips */}
        <div className="hero-mood-strip">
          {MOOD_CHIPS.map(m => (
            <button
              key={m.label}
              className={`hero-mood-chip ${activeMood === m.label ? 'hero-mood-chip--active' : ''}`}
              onClick={() => selectMood(m.label)}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Quick picks */}
        <div className="hero-quickpicks">
          <span className="hero-quickpick-label">Quick picks:</span>
          {displayPicks.map(city => (
            <button
              key={city}
              className="hero-quickpick-btn"
              onClick={() => pickCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
