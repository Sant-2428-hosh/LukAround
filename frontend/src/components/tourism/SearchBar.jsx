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
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', maxWidth: '780px', margin: '0 auto' }}>
      <form onSubmit={handleSearchSubmit} className="tourism-search-box">
        <Search size={20} color="var(--tourism-earth)" style={{ marginLeft: '0.75rem', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setDropdownOpen(true);
          }}
          placeholder={placeholder}
          className="tourism-search-input"
          autoFocus={autoFocus}
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

      {/* Autocomplete Dropdown Preview */}
      {dropdownOpen && (
        <div className="search-dropdown">
          {/* Attractions */}
          {suggestions.attractions.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', backgroundColor: '#F8FAFC' }}>
                Attractions & Places
              </div>
              {suggestions.attractions.map((a) => (
                <Link
                  key={a.id}
                  to={`/india/${a.stateSlug}/${a.citySlug}/${a.id}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <img src={a.image} alt={a.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{a.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{a.city}, {a.state}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--tourism-earth)', fontWeight: 600 }}>Explore</span>
                </Link>
              ))}
            </div>
          )}

          {/* Cities */}
          {suggestions.cities.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', backgroundColor: '#F8FAFC' }}>
                Cities & Destinations
              </div>
              {suggestions.cities.map((c) => (
                <Link
                  key={c.id}
                  to={`/india/${c.stateSlug}/${c.id}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <MapPin size={18} color="var(--tourism-earth)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{c.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.state}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* States */}
          {suggestions.states.length > 0 && (
            <div>
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#94A3B8', backgroundColor: '#F8FAFC' }}>
                States of India
              </div>
              {suggestions.states.map((s) => (
                <Link
                  key={s.id}
                  to={`/india/${s.slug}`}
                  className="search-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Landmark size={18} color="var(--tourism-sky)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Rank #{s.priorityRank} • {s.majorCities?.length} Cities</div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View All Search Results footer */}
          <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleSearchSubmit}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--tourism-earth)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              View all results for "{query}" →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
