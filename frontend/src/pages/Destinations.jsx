import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Star, Search, ArrowRight, X, Loader2, Map, Compass, Filter, Sparkles } from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import { getFeaturedDestinations, searchDestinations } from '../api/client';

const CATEGORIES = ['All', 'Heritage', 'Nature', 'Spiritual', 'Culture', 'Beaches', 'City'];

const CATEGORY_ICONS = {
  All: '🌏',
  Heritage: '🏛️',
  Nature: '🌿',
  Spiritual: '🕌',
  Culture: '🎭',
  Beaches: '🏖️',
  City: '🌆',
};

// Per-category fallback images — different for each
const CATEGORY_FALLBACKS = {
  Beaches: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  Nature: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  Spiritual: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=800&q=80',
  Heritage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
  Culture: 'https://images.unsplash.com/photo-1614536759905-3c8e8e97af50?auto=format&fit=crop&w=800&q=80',
  City: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
};

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="dest-card-slot" aria-hidden="true">
      <div className="dest-card dest-card--skeleton">
        <div className="dest-card__img-wrap dest-card__img-wrap--skeleton" />
        <div className="dest-card__season-tag">
          <div className="skeleton-line" style={{ width: '45%', height: '0.75rem' }} />
        </div>
      </div>
    </div>
  );
}

// Individual destination card — hover reveals details with smooth animation
function DestCard({ dest, onPlanTrip }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const fallback = CATEGORY_FALLBACKS[dest.category] || CATEGORY_FALLBACKS.Heritage;
  const cleanDescription = (dest.description || '').replace(/[*_`#]/g, '').trim();

  // Format budget: show range if available, otherwise show avg
  const budgetDisplay = () => {
    const range = dest.budgetRange;
    const avg = dest.avgDailyBudgetInr || 2500;
    if (range && range.min && range.max) {
      return {
        text: `₹${range.min.toLocaleString('en-IN')} – ₹${range.max.toLocaleString('en-IN')}`,
        label: 'Est. Daily Budget Range',
      };
    }
    return {
      text: `₹${avg.toLocaleString('en-IN')}`,
      label: 'Est. Budget',
    };
  };
  const budget = budgetDisplay();

  return (
    <article className="dest-card" tabIndex={0} aria-label={`${dest.city}, ${dest.state}`}>
      {/* Image fills card — fixed height always */}
      <div className="dest-card__img-wrap">
        {!imgLoaded && <div className="dest-card__img-placeholder" />}
        <img
          src={imgError ? fallback : (dest.imageUrl || fallback)}
          alt={dest.city}
          className={`dest-card__img${imgLoaded ? ' dest-card__img--loaded' : ''}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => { setImgError(true); setImgLoaded(true); }}
          loading="lazy"
        />

        {/* Gradient overlay for always-visible info */}
        <div className="dest-card__img-overlay" />

        {/* Always visible over image */}
        <div className="dest-card__img-badges">
          <span className="dest-badge-pill">{dest.badge}</span>
        </div>
        <div className="dest-card__rating-pill">
          <Star size={11} fill="#F59E0B" color="#F59E0B" />
          <span>{dest.rating}</span>
          <span className="dest-card__reviews">({Number(dest.reviewsCount).toLocaleString()})</span>
        </div>
        <div className="dest-card__category-tag">
          {CATEGORY_ICONS[dest.category] || '🌏'} {dest.category}
        </div>

        {/* Name + location always visible at bottom of image */}
        <div className="dest-card__img-info">
          <h3 className="dest-card__name">{dest.city}</h3>
          <div className="dest-card__location-line">
            <MapPin size={11} />
            <span>{dest.nearCity || dest.city}, {dest.state}</span>
          </div>
        </div>
      </div>

      {/* Season tag — visible in default state, fades when reveal opens */}
      <div className="dest-card__season-tag">
        <span>🌤️</span>
        <span>Best: {dest.season}</span>
      </div>

      {/* Reveal panel — hidden by default, smooth clip-path animation on hover */}
      <div className="dest-card__reveal">
        <p className="dest-card__desc">{cleanDescription}</p>

        {/* Highlights pills */}
        <div className="dest-card__pills">
          {(dest.highlights || []).slice(0, 4).map((h, i) => (
            <span key={i} className="dest-pill">{h}</span>
          ))}
        </div>

        {/* Map */}
        <div className="dest-card__map">
          <LeafletMap
            lat={dest.lat || dest.latitude}
            lng={dest.lng || dest.longitude}
            title={`${dest.city} — ${dest.state}`}
            address={`${dest.city}, ${dest.state}, India`}
            height="110px"
            zoom={13}
          />
        </div>

        {/* Footer */}
        <div className="dest-card__footer">
          <div className="dest-card__budget">
            <span className="dest-card__budget-label">{budget.label}</span>
            <div>
              <span className="dest-card__budget-amount">{budget.text}</span>
              <span className="dest-card__budget-unit">/day</span>
            </div>
          </div>
          <button
            className="btn btn-primary dest-card__plan-btn"
            onClick={(e) => { e.stopPropagation(); onPlanTrip(dest.city); }}
            aria-label={`Plan trip to ${dest.city}`}
          >
            <span>Plan Trip</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function Destinations() {
  const {
    setSelectedCity,
    handleGenerateItinerary,
    userLocation,
    nearbyPlaces,
    locationLoading,
    detectUserLocation
  } = useApp();
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchNote, setSearchNote] = useState('');
  const [viewMode, setViewMode] = useState(() => (userLocation && nearbyPlaces.length > 0 ? 'nearby' : 'featured'));
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Auto-switch to nearby places as soon as user location & nearby places become available
  useEffect(() => {
    if (userLocation && nearbyPlaces.length > 0 && !hasSearched && !searchQuery.trim()) {
      setViewMode('nearby');
    }
  }, [userLocation, nearbyPlaces.length]);

  useEffect(() => {
    async function load() {
      try {
        setLoadingFeatured(true);
        const res = await getFeaturedDestinations();
        setFeatured(res.data || []);
      } catch (err) {
        console.error('[Destinations] Featured load error:', err);
      } finally {
        setLoadingFeatured(false);
      }
    }
    load();
  }, []);

  // Debounced search
  const runSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setSearchNote('');
      return;
    }
    try {
      setLoadingSearch(true);
      setSearchError('');
      const res = await searchDestinations(q, 12);
      setSearchResults(res.data || []);
      setSearchNote(res.note || '');
      setHasSearched(true);
    } catch (err) {
      console.error('[Destinations] Search error:', err);
      setSearchError('Search failed. Please try again.');
      setSearchResults([]);
      setHasSearched(true);
    } finally {
      setLoadingSearch(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(val), 520);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setSearchNote('');
    setSearchError('');
    searchInputRef.current?.focus();
  };

  const handlePlanTrip = (city) => {
    setSelectedCity(city);
    handleGenerateItinerary(city, 3);
    navigate(`/itinerary?city=${city}`);
  };

  // Filter featured by category
  const displayedFeatured = featured.filter(d =>
    activeCategory === 'All' || d.category === activeCategory
  );

  // Filter nearby places by category
  const displayedNearby = nearbyPlaces.filter(d =>
    activeCategory === 'All' || d.category === activeCategory
  );

  const isSearchMode = searchQuery.trim().length > 0;
  const isNearbyMode = !isSearchMode && viewMode === 'nearby' && userLocation;

  // Active cards to render
  const displayCards = isSearchMode
    ? searchResults
    : (isNearbyMode ? displayedNearby : displayedFeatured);

  // Show skeletons only when search is in progress or location is fetching nearby places
  const showSearchSkeletons = isSearchMode && loadingSearch;
  const showNearbySkeletons = !isSearchMode && viewMode === 'nearby' && locationLoading;

  // Show cards when loaded
  const showCards = (!isSearchMode && !loadingFeatured && !showNearbySkeletons) || (isSearchMode && !loadingSearch && displayCards.length > 0);

  return (
    <div className="destinations-page">

      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div className="destinations-hero">
        <div className="destinations-hero__content container">
          <div className="destinations-hero__eyebrow">
            <Compass size={14} />
            <span>Explore India</span>
          </div>
          <h1 className="destinations-hero__title">
            Discover Incredible<br />
            <span className="destinations-hero__accent">
              {isNearbyMode ? `Places Near ${userLocation.city || 'You'}` : 'Indian Destinations'}
            </span>
          </h1>
          <p className="destinations-hero__subtitle">
            {isNearbyMode
              ? `Real-time tourist attractions extracted within 40 km of ${userLocation.city || userLocation.formatted}. AI-sequenced for travel.`
              : 'Search any city, monument, or natural wonder across India. Real-time data from Geoapify & AI by Groq.'
            }
          </p>

          {/* Search bar */}
          <div className="destinations-search">
            <div className="destinations-search__inner">
              {loadingSearch
                ? <Loader2 size={17} color="var(--color-primary)" className="destinations-search__spin" />
                : <Search size={17} color="var(--color-ink-tertiary)" />
              }
              <input
                ref={searchInputRef}
                id="destination-search"
                type="search"
                autoComplete="off"
                className="destinations-search__input"
                placeholder="Search Hampi, Rishikesh, Taj Mahal, Kerala…"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search Indian destinations"
              />
              {searchQuery && (
                <button
                  className="destinations-search__clear"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <div className="destinations-search__hint">
              <Map size={12} /> Powered by Geoapify · AI by Groq · Maps by OpenStreetMap · Photos from Wikipedia
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="container destinations-body">

        {/* ── 📍 Geolocation Prompt / Active Location Notification ── */}
        {!isSearchMode && (
          <>
            {!userLocation ? (
              <div className="location-prompt-banner">
                <div className="location-prompt-content">
                  <div className="location-prompt-icon">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-ink)', marginBottom: '0.2rem' }}>
                      Discover Attractions Near Your Current Location
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-secondary)' }}>
                      Allow location access to instantly view historic sights, viewpoints, and monuments around you instead of common destinations.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => detectUserLocation(true)}
                  disabled={locationLoading}
                  className="btn btn-primary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {locationLoading ? <Loader2 size={16} className="spin" /> : <MapPin size={16} />}
                  <span>{locationLoading ? 'Detecting Location…' : '📍 Show Places Near Me'}</span>
                </button>
              </div>
            ) : (
              <div className="location-active-bar">
                <div className="location-active-info">
                  <MapPin size={18} color="var(--color-primary)" />
                  <div>
                    <span>Showing real-time places near <strong>{userLocation.city || userLocation.formatted || 'your location'}</strong></span>
                    {userLocation.state && <span style={{ color: 'var(--color-ink-tertiary)', fontSize: '0.8rem', marginLeft: '0.4rem' }}>({userLocation.state})</span>}
                  </div>
                  {nearbyPlaces.length > 0 && (
                    <span className="dest-pill" style={{ marginLeft: '0.5rem' }}>
                      {nearbyPlaces.length} Nearby Places Found
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button
                    onClick={() => detectUserLocation(true)}
                    disabled={locationLoading}
                    className="btn btn-outline"
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', gap: '0.35rem' }}
                  >
                    {locationLoading ? <Loader2 size={13} className="spin" /> : <span>🔄 Refresh Location</span>}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── View Mode Switcher (Nearby vs All India) ── */}
        {!isSearchMode && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {userLocation && (
              <button
                type="button"
                onClick={() => setViewMode('nearby')}
                className={`dest-filter-btn ${viewMode === 'nearby' ? 'dest-filter-btn--active' : ''}`}
                style={{ fontWeight: 700 }}
              >
                <span>📍</span>
                <span>Near You: {userLocation.city || 'Local'} ({nearbyPlaces.length})</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setViewMode('featured')}
              className={`dest-filter-btn ${viewMode === 'featured' ? 'dest-filter-btn--active' : ''}`}
            >
              <span>🌏</span>
              <span>All India Destinations ({featured.length})</span>
            </button>
          </div>
        )}

        {/* Category filter bar (shown when NOT in search mode) */}
        {!isSearchMode && (
          <div className="destinations-filters">
            <div className="destinations-filters__label">
              <Filter size={14} />
              <span>Filter by Type</span>
            </div>
            <div className="destinations-filters__pills">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  id={`dest-cat-${cat.toLowerCase()}`}
                  className={`dest-filter-btn${activeCategory === cat ? ' dest-filter-btn--active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search results header */}
        {isSearchMode && (
          <div className="destinations-results-header">
            {loadingSearch ? (
              <span className="destinations-results-header__text">Searching across India…</span>
            ) : hasSearched ? (
              <>
                <span className="destinations-results-header__text">
                  {searchResults.length > 0
                    ? <>Found <strong>{searchResults.length}</strong> tourist places near "<em>{searchQuery}</em>"</>
                    : <>No results for "<em>{searchQuery}</em>" — try a different keyword</>
                  }
                </span>
                {searchNote && (
                  <span className="destinations-results-header__note">
                    <Sparkles size={11} /> {searchNote}
                  </span>
                )}
              </>
            ) : null}
            {searchError && (
              <span className="destinations-results-header__error">{searchError}</span>
            )}
          </div>
        )}

        {/* Results count indicator */}
        {!isSearchMode && !loadingFeatured && !showNearbySkeletons && (
          <div className="destinations-count">
            {isNearbyMode ? (
              <>Showing <strong>{displayedNearby.length}</strong> attractions near <strong>{userLocation.city || 'your location'}</strong></>
            ) : (
              <>Showing <strong>{displayedFeatured.length}</strong> of <strong>{featured.length}</strong> curated Indian destinations</>
            )}
          </div>
        )}

        {/* ── Cards Grid ───────────────────────────────────────── */}
        <div className="destinations-grid" role="list" aria-label="Destination cards">

          {/* Featured loading skeletons */}
          {loadingFeatured && !isSearchMode && viewMode === 'featured' && (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          )}

          {/* Nearby loading skeletons */}
          {showNearbySkeletons && (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`nearby-sk-${i}`} />)
          )}

          {/* Search loading skeletons */}
          {showSearchSkeletons && (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`search-sk-${i}`} />)
          )}

          {/* Actual destination cards */}
          {showCards && displayCards.map((dest, i) => (
            <div key={dest.id || `${dest.city}-${i}`} className="dest-card-slot" role="listitem">
              <DestCard dest={dest} onPlanTrip={handlePlanTrip} />
            </div>
          ))}

          {/* No search results state */}
          {isSearchMode && !loadingSearch && hasSearched && searchResults.length === 0 && !searchError && (
            <div className="destinations-empty">
              <div className="destinations-empty__icon">🗺️</div>
              <h3 className="destinations-empty__title">No places found</h3>
              <p className="destinations-empty__text">
                Try searching for <strong>Hampi</strong>, <strong>Rishikesh</strong>, <strong>Ladakh</strong>, or any Indian city or monument.
              </p>
              <button className="btn btn-primary" onClick={clearSearch}>
                Browse All Destinations
              </button>
            </div>
          )}

          {/* Empty nearby places state */}
          {isNearbyMode && !locationLoading && displayedNearby.length === 0 && (
            <div className="destinations-empty">
              <div className="destinations-empty__icon">📍</div>
              <h3 className="destinations-empty__title">No attractions found in this category near {userLocation?.city || 'you'}</h3>
              <p className="destinations-empty__text">Try selecting "All" or browse our curated destinations across India.</p>
              <button className="btn btn-primary" onClick={() => { setActiveCategory('All'); setViewMode('featured'); }}>
                View All India Destinations
              </button>
            </div>
          )}

          {/* Empty category state */}
          {!isSearchMode && viewMode === 'featured' && !loadingFeatured && displayedFeatured.length === 0 && (
            <div className="destinations-empty">
              <div className="destinations-empty__icon">{CATEGORY_ICONS[activeCategory] || '🌏'}</div>
              <h3 className="destinations-empty__title">No {activeCategory} destinations yet</h3>
              <p className="destinations-empty__text">We're adding more soon. Try another category or search directly.</p>
              <button className="btn btn-primary" onClick={() => setActiveCategory('All')}>
                View All Destinations
              </button>
            </div>
          )}
        </div>

        {/* ── Bottom CTA ───────────────────────────────────────── */}
        {!isSearchMode && !loadingFeatured && (
          <div className="destinations-cta">
            <div className="destinations-cta__card">
              <div className="destinations-cta__icon">✨</div>
              <div className="destinations-cta__text">
                <h3>Want to plan an AI Itinerary for your city?</h3>
                <p>Generate day-by-day geo-sequenced routes with Groq AI, real timings, and realistic entry fees.</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => handlePlanTrip(userLocation?.city || 'Jaipur')}
              >
                <Sparkles size={14} />
                <span>{userLocation?.city ? `Plan Trip in ${userLocation.city}` : 'Plan Master Itinerary'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
