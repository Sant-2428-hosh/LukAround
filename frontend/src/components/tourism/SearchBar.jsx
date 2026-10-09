import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Compass, Landmark, X, ChevronRight } from 'lucide-react';
import { states, cities, attractions, categories } from '../../data/indiaTourismData';

export default function SearchBar({ placeholder = "Search states, cities, attractions, beaches, wildlife...", autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState({ states: [], cities: [], attractions: [], categories: [] });
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live local suggestions for immediate 0ms response
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      setSuggestions({ states: [], cities: [], attractions: [], categories: [] });
      setDropdownOpen(false);
      return;
    }

    const matchedStates = (states || []).filter(s =>
      s.name.toLowerCase().includes(q) || (s.majorCities || []).some(c => c.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedCities = (cities || []).filter(c =>
      c.name.toLowerCase().includes(q) || (c.aliases || []).some(a => a.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedAttractions = (attractions || []).filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      (a.category || []).some(cat => cat.toLowerCase().includes(q)) ||
      (a.tags || []).some(t => t.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedCats = (categories || []).filter(cat =>
      cat.name.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q)
    ).slice(0, 2);

    const hasResults = matchedStates.length > 0 || matchedCities.length > 0 || matchedAttractions.length > 0 || matchedCats.length > 0;
    setSuggestions({
      states: matchedStates,
      cities: matchedCities,
      attractions: matchedAttractions,
      categories: matchedCats
    });
    setDropdownOpen(hasResults);
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div
      ref={wrapperRef}
      className={`search-bar-root ${dropdownOpen ? 'dropdown-active' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        zIndex: dropdownOpen ? 99999 : 50
      }}
    >
      <form onSubmit={handleSearchSubmit} className="tourism-search-box">
        <Search size={20} color="var(--tourism-earth)" style={{ marginLeft: '0.75rem', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setDropdownOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setDropdownOpen(false);
          }}
          placeholder={placeholder}
          className="tourism-search-input"
          autoFocus={autoFocus}
          aria-label="Search destinations"
        />

        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setDropdownOpen(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: '#94A3B8' }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <button type="submit" className="tourism-search-btn">
          <span>Search</span>
          <ChevronRight size={16} />
        </button>
      </form>

      {/* Autocomplete Dropdown Preview - Absolute High Z-Index Layer */}
      {dropdownOpen && (
        <div className="search-dropdown">
          {/* Attractions */}
          {suggestions.attractions.length > 0 && (
            <div>
              <div className="search-dropdown-section-title">
                <span>🏛️ Attractions & Monuments</span>
                <span className="search-section-count">{suggestions.attractions.length}</span>
              </div>
              {suggestions.attractions.map((a) => (
                <Link
                  key={a.id}
                  to={`/india/${a.stateSlug}/${a.citySlug}/${a.id}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img
                    src={a.image}
                    alt={a.name}
                    className="search-item-thumb"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=120&q=80';
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="search-item-title">{a.name}</div>
                    <div className="search-item-sub">
                      <MapPin size={12} color="var(--tourism-earth)" />
                      <span>{a.city}, {a.state}</span>
                    </div>
                  </div>
                  <span className="search-item-badge">
                    <span>Explore</span>
                    <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Cities */}
          {suggestions.cities.length > 0 && (
            <div>
              <div className="search-dropdown-section-title">
                <span>🌆 Cities & Hubs</span>
                <span className="search-section-count">{suggestions.cities.length}</span>
              </div>
              {suggestions.cities.map((c) => (
                <Link
                  key={c.id}
                  to={`/india/${c.stateSlug}/${c.id}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="search-item-icon-box city">
                    <MapPin size={19} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="search-item-title">{c.name}</div>
                    <div className="search-item-sub">{c.state}</div>
                  </div>
                  <span className="search-item-badge">
                    <span>Explore</span>
                    <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* States */}
          {suggestions.states.length > 0 && (
            <div>
              <div className="search-dropdown-section-title">
                <span>🗺️ States of India</span>
                <span className="search-section-count">{suggestions.states.length}</span>
              </div>
              {suggestions.states.map((s) => (
                <Link
                  key={s.id}
                  to={`/india/${s.slug}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="search-item-icon-box state">
                    <Landmark size={19} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="search-item-title">{s.name}</div>
                    <div className="search-item-sub">Rank #{s.priorityRank} • {s.majorCities?.length} Cities</div>
                  </div>
                  <span className="search-item-badge">
                    <span>Explore</span>
                    <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Categories */}
          {suggestions.categories && suggestions.categories.length > 0 && (
            <div>
              <div className="search-dropdown-section-title">
                <span>✨ Travel Experiences</span>
                <span className="search-section-count">{suggestions.categories.length}</span>
              </div>
              {suggestions.categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="search-item-icon-box category">
                    <Compass size={19} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="search-item-title">{cat.name}</div>
                    <div className="search-item-sub">{cat.tagline || 'Curated Category'}</div>
                  </div>
                  <span className="search-item-badge">
                    <span>Discover</span>
                    <ChevronRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* View All Search Results footer */}
          <div className="search-dropdown-footer">
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="search-view-all-btn"
            >
              <span>View all results for "{query}"</span>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
