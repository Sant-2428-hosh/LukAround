import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Compass, Landmark, X, ChevronRight } from 'lucide-react';
import { states, cities, attractions, categories } from '../../data/indiaTourismData';

export default function SearchBar({ placeholder = "Search states, cities, attractions, beaches, wildlife...", autoFocus = false }) {
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState({
    orderedSections: [],
    states: [],
    cities: [],
    attractions: [],
    categories: []
  });
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const itemRefs = useRef([]);
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

  // Compute live local suggestions with smart relevance scoring & NO 2-letter substring false positives
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) {
      setSuggestions({ orderedSections: [], states: [], cities: [], attractions: [], categories: [] });
      setDropdownOpen(false);
      setSelectedIndex(-1);
      return;
    }

    // 1. States scoring
    const scoredStates = (states || []).map(s => {
      let score = 0;
      const name = s.name.toLowerCase();
      const words = name.split(/\s+/);
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 95;
      else if (words.some(w => w.startsWith(q))) score = 90;
      else if ((s.majorCities || []).some(c => c.toLowerCase().startsWith(q))) score = 50;
      // Substring match inside a single word is only allowed for queries of 3+ letters to prevent 'ta' matching 'Karnataka'
      else if (q.length >= 3 && name.includes(q)) score = 30;
      else if (q.length >= 3 && (s.majorCities || []).some(c => c.toLowerCase().includes(q))) score = 25;
      return { item: s, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || (a.item.priorityRank || 99) - (b.item.priorityRank || 99));

    // 2. Cities scoring
    const scoredCities = (cities || []).map(c => {
      let score = 0;
      const name = c.name.toLowerCase();
      const words = name.split(/\s+/);
      const state = (c.state || '').toLowerCase();
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 95;
      else if (words.some(w => w.startsWith(q))) score = 90;
      else if ((c.aliases || []).some(a => a.toLowerCase().startsWith(q))) score = 85;
      else if (state === q) score = 45;
      else if (state.startsWith(q)) score = 40;
      else if (q.length >= 3 && name.includes(q)) score = 30;
      else if (q.length >= 3 && (c.aliases || []).some(a => a.toLowerCase().includes(q))) score = 25;
      else if (q.length >= 3 && state.includes(q)) score = 15;
      return { item: c, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || (a.item.priorityRank || 99) - (b.item.priorityRank || 99));

    // 3. Attractions scoring
    const scoredAttractions = (attractions || []).map(a => {
      let score = 0;
      const name = a.name.toLowerCase();
      const words = name.split(/[\s\-()]+/).filter(Boolean);
      const city = (a.city || '').toLowerCase();
      const state = (a.state || '').toLowerCase();

      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 95;
      else if (words.some(w => w.startsWith(q))) score = 90;
      else if ((a.aliases || []).some(al => al.toLowerCase().startsWith(q))) score = 85;
      else if (city === q) score = 55;
      else if (city.startsWith(q)) score = 50;
      else if (state === q) score = 30 + (a.featured ? 10 : 0);
      else if (state.startsWith(q)) score = 25 + (a.featured ? 10 : 0);
      else if ((a.tags || []).some(t => t.toLowerCase() === q)) score = 15;
      else if ((a.tags || []).some(t => t.toLowerCase().startsWith(q))) score = 12;
      else if (q.length >= 3 && name.includes(q)) score = 40;
      else if (q.length >= 3 && (a.category || []).some(cat => cat.toLowerCase().includes(q))) score = 18;
      else if (q.length >= 3 && (a.tags || []).some(t => t.toLowerCase().includes(q))) score = 8;

      return { item: a, score };
    }).filter(x => x.score > 0).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (Boolean(a.item.featured) !== Boolean(b.item.featured)) {
        return a.item.featured ? -1 : 1;
      }
      return (a.item.priorityRank || 99) - (b.item.priorityRank || 99);
    });

    // 4. Categories scoring
    const scoredCats = (categories || []).map(cat => {
      let score = 0;
      const name = cat.name.toLowerCase();
      const id = cat.id.toLowerCase();
      if (name === q || id === q) score = 100;
      else if (name.startsWith(q) || id.startsWith(q)) score = 95;
      else if (q.length >= 3 && (name.includes(q) || id.includes(q))) score = 75;
      return { item: cat, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

    const maxScores = {
      states: scoredStates[0]?.score || 0,
      cities: scoredCities[0]?.score || 0,
      attractions: scoredAttractions[0]?.score || 0,
      categories: scoredCats[0]?.score || 0
    };

    // Determine section priority ordering:
    // Highest relevance score dictates leading section; default fallback is States -> Cities -> Attractions -> Categories
    const defaultPriority = { states: 4, cities: 3, attractions: 2, categories: 1 };
    const orderedSections = ['states', 'cities', 'attractions', 'categories']
      .filter(secKey => {
        if (secKey === 'states') return scoredStates.length > 0;
        if (secKey === 'cities') return scoredCities.length > 0;
        if (secKey === 'attractions') return scoredAttractions.length > 0;
        if (secKey === 'categories') return scoredCats.length > 0;
        return false;
      })
      .sort((a, b) => {
        const diff = (maxScores[b] || 0) - (maxScores[a] || 0);
        if (diff !== 0) return diff;
        return (defaultPriority[b] || 0) - (defaultPriority[a] || 0);
      });

    const hasResults = orderedSections.length > 0;
    setSuggestions({
      orderedSections,
      states: scoredStates.slice(0, 3).map(x => x.item),
      cities: scoredCities.slice(0, 3).map(x => x.item),
      attractions: scoredAttractions.slice(0, 4).map(x => x.item),
      categories: scoredCats.slice(0, 2).map(x => x.item)
    });
    setDropdownOpen(hasResults);
    setSelectedIndex(-1);
  }, [query]);

  // Guaranteed scroll reset to top whenever query changes or dropdown opens
  useEffect(() => {
    if (dropdownRef.current) {
      dropdownRef.current.scrollTop = 0;
    }
  }, [query, dropdownOpen]);

  // Flatten suggestions into linear navigable list for Arrow Key navigation
  const flattenedItems = [];
  suggestions.orderedSections.forEach((secKey) => {
    (suggestions[secKey] || []).forEach((item) => {
      let targetUrl = '';
      if (secKey === 'states') targetUrl = `/india/${item.slug}`;
      else if (secKey === 'cities') targetUrl = `/india/${item.stateSlug}/${item.id}`;
      else if (secKey === 'attractions') targetUrl = `/india/${item.stateSlug}/${item.citySlug}/${item.id}`;
      else if (secKey === 'categories') targetUrl = `/categories/${item.id}`;
      flattenedItems.push({ ...item, _type: secKey, _url: targetUrl });
    });
  });

  const handleKeyDown = (e) => {
    if (!dropdownOpen || flattenedItems.length === 0) {
      if (e.key === 'Escape') setDropdownOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev < flattenedItems.length - 1 ? prev + 1 : 0;
        if (itemRefs.current[next]) {
          itemRefs.current[next].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        return next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => {
        const next = prev > 0 ? prev - 1 : flattenedItems.length - 1;
        if (itemRefs.current[next]) {
          itemRefs.current[next].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        return next;
      });
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < flattenedItems.length) {
        e.preventDefault();
        setDropdownOpen(false);
        navigate(flattenedItems[selectedIndex]._url);
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!query.trim()) return;
    setDropdownOpen(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // Track global linear index to bind keyboard selection with rendered DOM nodes
  let currentFlatIndex = 0;

  return (
    <div
      ref={wrapperRef}
      className={`search-bar-root ${dropdownOpen ? 'dropdown-active' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '780px',
        margin: '0 auto',
        zIndex: dropdownOpen ? 999999 : 50
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
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="tourism-search-input"
          autoFocus={autoFocus}
          aria-label="Search destinations"
          autoComplete="off"
          spellCheck="false"
        />

        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setDropdownOpen(false); setSelectedIndex(-1); }}
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
        <div ref={dropdownRef} className="search-dropdown">
          {suggestions.orderedSections.map((secKey) => {
            // ── STATES SECTION ──
            if (secKey === 'states' && suggestions.states.length > 0) {
              return (
                <div key="states-section">
                  <div className="search-dropdown-section-title">
                    <span>🗺️ States of India</span>
                    <span className="search-section-count">{suggestions.states.length}</span>
                  </div>
                  {suggestions.states.map((s) => {
                    const thisIndex = currentFlatIndex++;
                    const isSelected = selectedIndex === thisIndex;
                    return (
                      <Link
                        key={s.id}
                        ref={(el) => (itemRefs.current[thisIndex] = el)}
                        to={`/india/${s.slug}`}
                        className={`search-dropdown-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setDropdownOpen(false)}
                        onMouseEnter={() => setSelectedIndex(thisIndex)}
                      >
                        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                          <div className="search-item-icon-box state" style={{ width: 44, height: 44 }}>
                            <Landmark size={18} />
                          </div>
                          {(s.heroImage || s.image) && (
                            <img
                              src={s.heroImage || s.image}
                              alt={s.name}
                              className="search-item-thumb"
                              style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44 }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="search-item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span>{s.name}</span>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#E0F2FE', color: '#0369A1', borderRadius: '4px', fontWeight: 700 }}>
                              State
                            </span>
                          </div>
                          <div className="search-item-sub">
                            <span>Capital: {s.capital} • {s.majorCities?.length || 0} Key Hubs</span>
                          </div>
                        </div>
                        <span className="search-item-badge">
                          <span>Explore</span>
                          <ChevronRight size={12} />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              );
            }

            // ── CITIES SECTION ──
            if (secKey === 'cities' && suggestions.cities.length > 0) {
              return (
                <div key="cities-section">
                  <div className="search-dropdown-section-title">
                    <span>🌆 Cities & Hubs</span>
                    <span className="search-section-count">{suggestions.cities.length}</span>
                  </div>
                  {suggestions.cities.map((c) => {
                    const thisIndex = currentFlatIndex++;
                    const isSelected = selectedIndex === thisIndex;
                    return (
                      <Link
                        key={c.id}
                        ref={(el) => (itemRefs.current[thisIndex] = el)}
                        to={`/india/${c.stateSlug}/${c.id}`}
                        className={`search-dropdown-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setDropdownOpen(false)}
                        onMouseEnter={() => setSelectedIndex(thisIndex)}
                      >
                        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                          <div className="search-item-icon-box city" style={{ width: 44, height: 44 }}>
                            <MapPin size={18} />
                          </div>
                          {(c.heroImage || c.image) && (
                            <img
                              src={c.heroImage || c.image}
                              alt={c.name}
                              className="search-item-thumb"
                              style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44 }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="search-item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span>{c.name}</span>
                            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#FCEEE8', color: '#C85A32', borderRadius: '4px', fontWeight: 700 }}>
                              City
                            </span>
                          </div>
                          <div className="search-item-sub">
                            <MapPin size={12} color="var(--tourism-earth)" />
                            <span>{c.state}</span>
                          </div>
                        </div>
                        <span className="search-item-badge">
                          <span>Explore</span>
                          <ChevronRight size={12} />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              );
            }

            // ── ATTRACTIONS SECTION ──
            if (secKey === 'attractions' && suggestions.attractions.length > 0) {
              return (
                <div key="attractions-section">
                  <div className="search-dropdown-section-title">
                    <span>🏛️ Attractions & Monuments</span>
                    <span className="search-section-count">{suggestions.attractions.length}</span>
                  </div>
                  {suggestions.attractions.map((a) => {
                    const thisIndex = currentFlatIndex++;
                    const isSelected = selectedIndex === thisIndex;
                    return (
                      <Link
                        key={a.id}
                        ref={(el) => (itemRefs.current[thisIndex] = el)}
                        to={`/india/${a.stateSlug}/${a.citySlug}/${a.id}`}
                        className={`search-dropdown-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setDropdownOpen(false)}
                        onMouseEnter={() => setSelectedIndex(thisIndex)}
                      >
                        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                          <div className="search-item-icon-box city" style={{ width: 44, height: 44, background: '#FEF3C7', color: '#B45309' }}>
                            <Landmark size={18} />
                          </div>
                          {a.image && (
                            <img
                              src={a.image}
                              alt={a.name}
                              className="search-item-thumb"
                              style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44 }}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="search-item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span>{a.name}</span>
                            {a.featured && (
                              <span style={{ fontSize: '0.65rem', padding: '1px 5px', background: '#FEF3C7', color: '#B45309', borderRadius: '4px', fontWeight: 700 }}>
                                Top Spot
                              </span>
                            )}
                          </div>
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
                    );
                  })}
                </div>
              );
            }

            // ── CATEGORIES SECTION ──
            if (secKey === 'categories' && suggestions.categories && suggestions.categories.length > 0) {
              return (
                <div key="categories-section">
                  <div className="search-dropdown-section-title">
                    <span>✨ Travel Experiences</span>
                    <span className="search-section-count">{suggestions.categories.length}</span>
                  </div>
                  {suggestions.categories.map((cat) => {
                    const thisIndex = currentFlatIndex++;
                    const isSelected = selectedIndex === thisIndex;
                    return (
                      <Link
                        key={cat.id}
                        ref={(el) => (itemRefs.current[thisIndex] = el)}
                        to={`/categories/${cat.id}`}
                        className={`search-dropdown-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => setDropdownOpen(false)}
                        onMouseEnter={() => setSelectedIndex(thisIndex)}
                      >
                        <div className="search-item-icon-box category" style={{ width: 44, height: 44 }}>
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
                    );
                  })}
                </div>
              );
            }

            return null;
          })}

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
