import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Award,
  Calendar,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Search,
  Filter,
  Share2,
  Check,
  Navigation,
  Utensils,
  PartyPopper,
  Plane,
  Train,
  Car,
  Shield,
  Sparkles,
  Building2,
  Eye,
  Map as MapIcon,
  X,
  Info,
  Landmark,
  Layers,
  Sun,
  Clock,
  Heart,
  SlidersHorizontal
} from 'lucide-react';
import { states, cities, attractions, itineraries } from '../../data/indiaTourismData';
import { STATE_CENTERS, buildGoogleMapsSearchUrl } from '../../utils/googleMaps';
import GoogleMapView from '../maps/GoogleMapView';
import DirectionsModal from './DirectionsModal';
import SafeImage from './SafeImage';

// Regional grouping for all 15 states
const STATE_REGIONS = {
  'uttar-pradesh': 'North India',
  'rajasthan': 'North India',
  'punjab': 'North India',
  'uttarakhand': 'North India',
  'tamil-nadu': 'South India',
  'karnataka': 'South India',
  'andhra-pradesh': 'South India',
  'telangana': 'South India',
  'kerala': 'South India',
  'maharashtra': 'West India',
  'gujarat': 'West India',
  'west-bengal': 'East India',
  'bihar': 'East India',
  'odisha': 'East India',
  'madhya-pradesh': 'Central India'
};

const REGIONS = ['All', 'North', 'South', 'West', 'East', 'Central'];

export default function MapExplorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // State selection from query param or default
  const paramState = searchParams.get('state');
  const paramTab = searchParams.get('tab');

  const [selectedStateSlug, setSelectedStateSlug] = useState(() => {
    if (paramState && states.some(s => s.slug === paramState)) {
      return paramState;
    }
    return 'uttar-pradesh';
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState(() => {
    const validTabs = ['overview', 'map', 'cities', 'attractions', 'cuisine', 'culture', 'logistics', 'itineraries'];
    if (paramTab && validTabs.includes(paramTab)) {
      return paramTab;
    }
    return 'overview';
  });

  // Sidebar filters
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'name' | 'visitors'

  // Map state
  const [mapPinFilter, setMapPinFilter] = useState('all'); // 'all' | 'cities' | 'attractions'
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Search inside cities/attractions tabs
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [attrCategoryFilter, setAttrCategoryFilter] = useState('all');

  // Directions Modal
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [directionsTarget, setDirectionsTarget] = useState(null);

  // Copied link toast
  const [copiedLink, setCopiedLink] = useState(false);

  // Synchronize state selection with URL params
  useEffect(() => {
    if (paramState && states.some(s => s.slug === paramState) && paramState !== selectedStateSlug) {
      setSelectedStateSlug(paramState);
    }
  }, [paramState]);

  const handleSelectState = (slug) => {
    setSelectedStateSlug(slug);
    setSelectedMarker(null);
    setCitySearchTerm('');
    setAttrCategoryFilter('all');
    setSearchParams({ state: slug, tab: activeTab }, { replace: true });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ state: selectedStateSlug, tab: tabId }, { replace: true });
  };

  // Find active state
  const selectedState = useMemo(() => {
    return states.find(s => s.slug === selectedStateSlug) || states[0];
  }, [selectedStateSlug]);

  const stateRegion = STATE_REGIONS[selectedState.slug] || 'India';
  const stateCities = useMemo(() => {
    return cities.filter(c => c.stateSlug === selectedState.slug || c.state === selectedState.name);
  }, [selectedState]);

  const stateAttractions = useMemo(() => {
    return attractions.filter(a => a.stateSlug === selectedState.slug || a.state === selectedState.name);
  }, [selectedState]);

  const stateItineraries = useMemo(() => {
    return itineraries.filter(i => i.state === selectedState.name);
  }, [selectedState]);

  // Filtered & sorted state list in sidebar
  const filteredStates = useMemo(() => {
    return states
      .filter((st) => {
        const matchesSearch = !sidebarSearch.trim() ||
          st.name.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
          st.capital?.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
          (st.topDestinations || []).some(d => d.toLowerCase().includes(sidebarSearch.toLowerCase()));

        const matchesRegion = selectedRegion === 'All' ||
          (STATE_REGIONS[st.slug] && STATE_REGIONS[st.slug].toLowerCase().includes(selectedRegion.toLowerCase()));

        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'visitors') return (b.domesticTouristVisits2024 || 0) - (a.domesticTouristVisits2024 || 0);
        return (a.priorityRank || 99) - (b.priorityRank || 99);
      });
  }, [sidebarSearch, selectedRegion, sortBy]);

  // Current state index for Prev / Next navigation
  const currentStateIndex = states.findIndex(s => s.slug === selectedState.slug);
  const handlePrevState = () => {
    const prevIndex = (currentStateIndex - 1 + states.length) % states.length;
    handleSelectState(states[prevIndex].slug);
  };
  const handleNextState = () => {
    const nextIndex = (currentStateIndex + 1) % states.length;
    handleSelectState(states[nextIndex].slug);
  };

  // Generate Map Markers for GoogleMapView
  const stateMapMarkers = useMemo(() => {
    const markers = [];

    // Cities
    if (mapPinFilter === 'all' || mapPinFilter === 'cities') {
      stateCities.forEach((c) => {
        if (c.latitude && c.longitude) {
          markers.push({
            id: `city-${c.id}`,
            entityId: c.id,
            title: c.name,
            name: c.name,
            latitude: c.latitude,
            longitude: c.longitude,
            type: 'city',
            category: 'Major City',
            city: c.name,
            state: selectedState.name,
            stateSlug: selectedState.slug,
            image: c.heroImage || c.image,
            days: c.recommendedDays || 2,
            address: `${c.name}, ${selectedState.name}, India`,
            description: c.description
          });
        }
      });
    }

    // Attractions
    if (mapPinFilter === 'all' || mapPinFilter === 'attractions') {
      stateAttractions.forEach((a) => {
        const lat = a.coordinates?.latitude || a.latitude;
        const lng = a.coordinates?.longitude || a.longitude;
        if (lat && lng) {
          markers.push({
            id: `attr-${a.id}`,
            entityId: a.id,
            title: a.name,
            name: a.name,
            latitude: lat,
            longitude: lng,
            type: 'attraction',
            category: (a.category && a.category[0]) || a.type || 'Attraction',
            city: a.city,
            citySlug: a.citySlug,
            state: selectedState.name,
            stateSlug: selectedState.slug,
            image: a.image,
            duration: a.recommendedDuration || '2-3 hours',
            address: `${a.name}, ${a.city}, ${selectedState.name}`,
            description: a.shortDescription || a.longDescription
          });
        }
      });
    }

    return markers;
  }, [stateCities, stateAttractions, selectedState, mapPinFilter]);

  // Center coordinate for the map
  const stateCenter = useMemo(() => {
    if (STATE_CENTERS[selectedState.slug]) {
      return {
        lat: STATE_CENTERS[selectedState.slug].latitude,
        lng: STATE_CENTERS[selectedState.slug].longitude
      };
    }
    return { lat: 21.7679, lng: 78.8718 };
  }, [selectedState]);

  const stateZoom = useMemo(() => {
    if (STATE_CENTERS[selectedState.slug]) {
      return Math.round(STATE_CENTERS[selectedState.slug].zoom);
    }
    return 7;
  }, [selectedState]);

  // Handle marker selection on map
  const handleMarkerSelect = (marker) => {
    setSelectedMarker(marker);
  };

  // Open Directions modal
  const handleOpenDirections = (targetEntity) => {
    setDirectionsTarget(targetEntity);
    setDirectionsModalOpen(true);
  };

  // Share link handler
  const handleShareLink = () => {
    const url = `${window.location.origin}/explore?state=${selectedState.slug}&tab=${activeTab}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Filtered cities within state
  const filteredStateCities = useMemo(() => {
    if (!citySearchTerm.trim()) return stateCities;
    const q = citySearchTerm.toLowerCase();
    return stateCities.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.aliases || []).some(a => a.toLowerCase().includes(q)) ||
      (c.description || '').toLowerCase().includes(q)
    );
  }, [stateCities, citySearchTerm]);

  // Filtered attractions within state
  const filteredStateAttractions = useMemo(() => {
    return stateAttractions.filter(a => {
      if (attrCategoryFilter === 'all') return true;
      const cats = Array.isArray(a.category) ? a.category : [a.category];
      return cats.some(c => c && c.toLowerCase().includes(attrCategoryFilter.toLowerCase())) ||
        (a.type && a.type.toLowerCase().includes(attrCategoryFilter.toLowerCase()));
    });
  }, [stateAttractions, attrCategoryFilter]);

  return (
    <div className="map-explorer-container" id="state-directory-explorer">
      {/* ── Left Column: Power-User State Directory Sidebar ── */}
      <div className="map-sidebar">
        <div className="map-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--tourism-earth)', letterSpacing: '0.5px' }}>
              Interactive Directory
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', backgroundColor: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '9999px', border: '1px solid var(--tourism-sand-border)' }}>
              {states.length} States
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.2rem 0' }}>
            Select Indian State
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 0.85rem 0', lineHeight: 1.4 }}>
            Traverse India's heritage, monuments, verified cities & maps
          </p>

          {/* Search State Input */}
          <div className="map-sidebar-search-wrap">
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search state, capital, or sight..."
              className="map-sidebar-search-input"
            />
            {sidebarSearch && (
              <button
                type="button"
                onClick={() => setSidebarSearch('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} color="#94A3B8" />
              </button>
            )}
          </div>

          {/* Region Filter Chips */}
          <div className="map-sidebar-regions">
            {REGIONS.map((reg) => {
              const isActive = selectedRegion === reg;
              return (
                <button
                  key={reg}
                  type="button"
                  onClick={() => setSelectedRegion(reg)}
                  className={`map-region-chip ${isActive ? 'active' : ''}`}
                >
                  {reg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable State List */}
        <div className="map-state-list-scroll">
          {filteredStates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B' }}>
              <Compass size={28} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>No matching states found</div>
              <p style={{ fontSize: '0.75rem', margin: '0.3rem 0 0.8rem' }}>Try clearing your search or selecting "All" regions</p>
              <button
                type="button"
                onClick={() => { setSidebarSearch(''); setSelectedRegion('All'); }}
                className="tourism-badge badge-earth"
                style={{ cursor: 'pointer', border: 'none' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredStates.map((state) => {
              const isActive = state.slug === selectedStateSlug;
              const region = STATE_REGIONS[state.slug] || 'India';
              return (
                <div
                  key={state.id}
                  onClick={() => handleSelectState(state.slug)}
                  className={`map-state-list-item ${isActive ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectState(state.slug); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'var(--tourism-earth)' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {state.priorityRank}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {state.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{state.capital}</span>
                        <span>•</span>
                        <span>{state.majorCities?.length || 0} Cities</span>
                        <span>•</span>
                        <span>{state.topDestinations?.length || 0} Sights</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} color={isActive ? 'var(--tourism-earth)' : '#CBD5E1'} style={{ flexShrink: 0 }} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right Column: Dynamic Interactive State Hub ── */}
      <div className="map-details-view">
        {/* 1. Top Utility Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--tourism-sand-border)'
        }}>
          {/* Breadcrumb + Prev/Next Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={handlePrevState}
                title="Previous State"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--tourism-sand-border)',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextState}
                title="Next State"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid var(--tourism-sand-border)',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              <span>India</span>
              <span style={{ margin: '0 0.35rem' }}>›</span>
              <span style={{ color: 'var(--tourism-forest)' }}>{stateRegion}</span>
              <span style={{ margin: '0 0.35rem' }}>›</span>
              <strong style={{ color: '#0F172A' }}>{selectedState.name}</strong>
              <span style={{ marginLeft: '0.5rem', fontSize: '0.72rem', color: '#94A3B8' }}>
                ({currentStateIndex + 1} of {states.length})
              </span>
            </div>
          </div>

          {/* Quick Actions Ribbon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleShareLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--tourism-sand-border)',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              {copiedLink ? <Check size={14} color="#16A34A" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share State'}</span>
            </button>

            <a
              href={buildGoogleMapsSearchUrl(selectedState)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid var(--tourism-sand-border)',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <Navigation size={14} color="var(--tourism-earth)" />
              <span>Google Maps</span>
              <ExternalLink size={12} color="#94A3B8" />
            </a>

            <Link
              to="/planner"
              state={{ selectedState: selectedState }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                background: 'var(--tourism-forest)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <Compass size={14} />
              <span>Plan Trip to {selectedState.name}</span>
            </Link>

            <Link
              to={`/india/${selectedState.slug}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                background: 'var(--tourism-earth)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none'
              }}
            >
              <span>Full State Guide</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 2. State Cinematic Hero Banner */}
        <div style={{
          position: 'relative',
          height: '240px',
          borderRadius: '18px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-medium)'
        }}>
          <SafeImage
            src={selectedState.heroImage}
            alt={`${selectedState.name} tourism and heritage`}
            aspectRatio="16:9"
            category="heritage"
            verified={true}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(180deg, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.88) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '1.75rem',
            color: '#FFFFFF'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.45rem' }}>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  Priority Rank #{selectedState.priorityRank}
                </span>
                <span style={{
                  backgroundColor: 'rgba(200, 90, 50, 0.85)',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}>
                  {stateRegion}
                </span>
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  Capital: {selectedState.capital}
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                {selectedState.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => handleTabChange('map')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#0F172A',
                border: 'none',
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <MapIcon size={16} color="var(--tourism-earth)" />
              <span>Explore Interactive Map</span>
            </button>
          </div>
        </div>

        {/* 3. Interactive Tab Navigation */}
        <div className="map-explorer-nav-tabs">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`map-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Compass size={16} />
            <span>Overview & Facts</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('map')}
            className={`map-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          >
            <MapIcon size={16} />
            <span>Interactive Map</span>
            <span className="map-tab-badge">{stateMapMarkers.length}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('cities')}
            className={`map-tab-btn ${activeTab === 'cities' ? 'active' : ''}`}
          >
            <Building2 size={16} />
            <span>Major Cities</span>
            <span className="map-tab-badge">{stateCities.length}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('attractions')}
            className={`map-tab-btn ${activeTab === 'attractions' ? 'active' : ''}`}
          >
            <Landmark size={16} />
            <span>Top Attractions</span>
            <span className="map-tab-badge">{stateAttractions.length}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('cuisine')}
            className={`map-tab-btn ${activeTab === 'cuisine' ? 'active' : ''}`}
          >
            <Utensils size={16} />
            <span>Local Cuisine</span>
            <span className="map-tab-badge">{selectedState.popularFoods?.length || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('culture')}
            className={`map-tab-btn ${activeTab === 'culture' ? 'active' : ''}`}
          >
            <PartyPopper size={16} />
            <span>Culture & Festivals</span>
            <span className="map-tab-badge">{selectedState.festivals?.length || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('logistics')}
            className={`map-tab-btn ${activeTab === 'logistics' ? 'active' : ''}`}
          >
            <Plane size={16} />
            <span>Connectivity & Safety</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('itineraries')}
            className={`map-tab-btn ${activeTab === 'itineraries' ? 'active' : ''}`}
          >
            <Calendar size={16} />
            <span>Recommended Itineraries</span>
            <span className="map-tab-badge">{stateItineraries.length}</span>
          </button>
        </div>

        {/* 4. Tab 1: Overview & Highlights */}
        {activeTab === 'overview' && (
          <div>
            {/* Description */}
            <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: '#334155', marginBottom: '1.75rem' }}>
              {selectedState.description}
            </p>

            {/* Quick Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', padding: '1.1rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <Sun size={15} color="var(--tourism-earth)" />
                  <span>Best Season to Visit</span>
                </div>
                <div style={{ fontWeight: 900, color: 'var(--tourism-earth)', fontSize: '1.05rem' }}>
                  {selectedState.bestTimeToVisit}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Pleasant weather for sightseeing</div>
              </div>

              <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', padding: '1.1rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <Award size={15} color="var(--tourism-forest)" />
                  <span>Annual Domestic Visitors</span>
                </div>
                <div style={{ fontWeight: 900, color: 'var(--tourism-forest)', fontSize: '1.05rem' }}>
                  {(selectedState.domesticTouristVisits2024 / 10000000).toFixed(1)} Crore (2024)
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Verified Ministry of Tourism data</div>
              </div>

              <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', padding: '1.1rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <Sparkles size={15} color="var(--tourism-sky)" />
                  <span>UNESCO Heritage Sites</span>
                </div>
                <div style={{ fontWeight: 900, color: 'var(--tourism-sky)', fontSize: '1.05rem' }}>
                  {selectedState.unescoSites?.length || 0} World Heritage Sites
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Global historical importance</div>
              </div>

              <div style={{ backgroundColor: 'var(--tourism-sand)', border: '1px solid var(--tourism-sand-border)', padding: '1.1rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <Layers size={15} color="var(--tourism-gold)" />
                  <span>Travel Themes</span>
                </div>
                <div style={{ fontWeight: 900, color: '#0F172A', fontSize: '0.92rem', textTransform: 'capitalize' }}>
                  {(selectedState.categories || []).join(' • ')}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>Ideal for diversified vacations</div>
              </div>
            </div>

            {/* Cultural Heritage Highlight */}
            {selectedState.culture && (
              <div style={{
                backgroundColor: 'var(--tourism-sand-light)',
                border: '1px solid var(--tourism-sand-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  <Sparkles size={15} />
                  <span>Cultural Tapestry & Living Traditions</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.65rem 0' }}>
                  Arts, Dance & Heritage Craftsmanship
                </h4>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {selectedState.culture}
                </p>
              </div>
            )}

            {/* Top Destinations Ribbon */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                Must-Visit Iconic Landmarks
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(selectedState.topDestinations || []).map((dest, idx) => (
                  <Link
                    key={idx}
                    to={`/search?q=${encodeURIComponent(dest)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.95rem',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--tourism-sand-border)',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      color: '#0F172A',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      boxShadow: 'var(--shadow-subtle)',
                      transition: 'var(--transition-smooth)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--tourism-earth)'; e.currentTarget.style.color = 'var(--tourism-earth)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--tourism-sand-border)'; e.currentTarget.style.color = '#0F172A'; }}
                  >
                    <MapPin size={13} color="var(--tourism-earth)" />
                    <span>{dest}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Preview Grids for Cities & Attractions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Major Cities Preview */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Major Cities ({stateCities.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleTabChange('cities')}
                    style={{ background: 'none', border: 'none', color: 'var(--tourism-earth)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {stateCities.slice(0, 4).map((city) => (
                    <Link
                      key={city.id}
                      to={`/india/${selectedState.slug}/${city.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'var(--tourism-sand)',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: '#0F172A'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{city.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{city.recommendedDays || 2} Days Recommended</div>
                      </div>
                      <ChevronRight size={15} color="#94A3B8" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Top Attractions Preview */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Top Attractions ({stateAttractions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleTabChange('attractions')}
                    style={{ background: 'none', border: 'none', color: 'var(--tourism-earth)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {stateAttractions.slice(0, 4).map((attr) => (
                    <Link
                      key={attr.id}
                      to={`/india/${selectedState.slug}/${attr.citySlug || (attr.city ? attr.city.toLowerCase().replace(/\s+/g, '-') : 'city')}/${attr.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        backgroundColor: 'var(--tourism-sand)',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        color: '#0F172A'
                      }}
                    >
                      <img src={attr.image} alt={attr.name} style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {attr.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{attr.city}</div>
                      </div>
                      <ChevronRight size={15} color="#94A3B8" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Tab 2: Interactive State Map */}
        {activeTab === 'map' && (
          <div>
            {/* Filter pins controls */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.85rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Show on Map:</span>
                <button
                  type="button"
                  onClick={() => setMapPinFilter('all')}
                  className={`tourism-badge ${mapPinFilter === 'all' ? 'badge-earth' : ''}`}
                  style={{ cursor: 'pointer', border: mapPinFilter === 'all' ? 'none' : '1px solid var(--tourism-sand-border)', background: mapPinFilter === 'all' ? 'var(--tourism-earth)' : '#FFFFFF', color: mapPinFilter === 'all' ? '#FFFFFF' : '#475569' }}
                >
                  All Pins ({stateCities.length + stateAttractions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMapPinFilter('cities')}
                  className={`tourism-badge ${mapPinFilter === 'cities' ? 'badge-forest' : ''}`}
                  style={{ cursor: 'pointer', border: mapPinFilter === 'cities' ? 'none' : '1px solid var(--tourism-sand-border)', background: mapPinFilter === 'cities' ? 'var(--tourism-forest)' : '#FFFFFF', color: mapPinFilter === 'cities' ? '#FFFFFF' : '#475569' }}
                >
                  Cities Only ({stateCities.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMapPinFilter('attractions')}
                  className={`tourism-badge ${mapPinFilter === 'attractions' ? 'badge-sky' : ''}`}
                  style={{ cursor: 'pointer', border: mapPinFilter === 'attractions' ? 'none' : '1px solid var(--tourism-sand-border)', background: mapPinFilter === 'attractions' ? 'var(--tourism-sky)' : '#FFFFFF', color: mapPinFilter === 'attractions' ? '#FFFFFF' : '#475569' }}
                >
                  Attractions Only ({stateAttractions.length})
                </button>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                Click any pin to inspect verified coordinates, photo & directions
              </div>
            </div>

            {/* Embedded Live Map Component */}
            <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--tourism-sand-border)', boxShadow: 'var(--shadow-subtle)' }}>
              <GoogleMapView
                markers={stateMapMarkers}
                center={stateCenter}
                zoom={stateZoom}
                selectedMarkerId={selectedMarker?.id}
                onMarkerSelect={handleMarkerSelect}
                height="540px"
                fitBounds={true}
                mapTitle={`${selectedState.name} Interactive Tourism Map`}
              />
            </div>

            {/* Active Marker Preview Flyout */}
            {selectedMarker ? (
              <div className="map-pin-preview-flyout">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                  <img
                    src={selectedMarker.image || selectedState.heroImage}
                    alt={selectedMarker.title}
                    style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="tourism-badge badge-earth" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                        {selectedMarker.category || selectedMarker.type}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                        {selectedMarker.city ? `${selectedMarker.city}, ` : ''}{selectedMarker.state}
                      </span>
                    </div>
                    <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedMarker.title}
                    </h5>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.2rem 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedMarker.address}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleOpenDirections(selectedMarker)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.55rem 1rem',
                      borderRadius: '10px',
                      background: 'var(--tourism-forest)',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Navigation size={14} />
                    <span>Get Directions</span>
                  </button>

                  {selectedMarker.type === 'city' ? (
                    <Link
                      to={`/india/${selectedState.slug}/${selectedMarker.entityId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1rem',
                        borderRadius: '10px',
                        background: 'var(--tourism-earth)',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Explore City</span>
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <Link
                      to={`/india/${selectedState.slug}/${selectedMarker.citySlug || 'attractions'}/${selectedMarker.entityId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.55rem 1rem',
                        borderRadius: '10px',
                        background: 'var(--tourism-earth)',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none'
                      }}
                    >
                      <span>View Attraction</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.8rem', color: '#94A3B8' }}>
                Tip: Click any marker on the map to inspect details, photos, and live navigation directions.
              </div>
            )}
          </div>
        )}

        {/* 6. Tab 3: Major Cities */}
        {activeTab === 'cities' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Major Tourist Cities in {selectedState.name}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                  Explore verified urban hubs, royal palaces, spiritual centers & transit routes
                </p>
              </div>

              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={citySearchTerm}
                  onChange={(e) => setCitySearchTerm(e.target.value)}
                  placeholder="Filter cities..."
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem 0.5rem 2rem',
                    borderRadius: '10px',
                    border: '1px solid var(--tourism-sand-border)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredStateCities.map((city) => (
                <div key={city.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--tourism-sand-border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    <div style={{ position: 'relative', height: '160px' }}>
                      <SafeImage
                        src={city.heroImage || city.image}
                        alt={city.name}
                        aspectRatio="16:9"
                        category="heritage"
                        verified={true}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(15,23,42,0.85)', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                        {city.recommendedDays || 2} Days
                      </div>
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h5 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                        {city.name}
                      </h5>
                      <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1rem 0', flex: 1 }}>
                        {city.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--tourism-sand-border)' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenDirections(city)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--tourism-forest)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          <Navigation size={13} />
                          <span>Directions</span>
                        </button>

                        <Link
                          to={`/india/${selectedState.slug}/${city.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--tourism-earth)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            textDecoration: 'none'
                          }}
                        >
                          <span>Explore City</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Tab 4: Top Attractions */}
        {activeTab === 'attractions' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Top Tourist Attractions & Monuments
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                  World Heritage sites, divine temples, regal forts and scenic landscapes
                </p>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {['all', 'heritage', 'spiritual', 'nature', 'architecture'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAttrCategoryFilter(cat)}
                    className={`map-region-chip ${attrCategoryFilter === cat ? 'active' : ''}`}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredStateAttractions.map((attr) => (
                <div key={attr.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--tourism-sand-border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    <div style={{ position: 'relative', height: '170px' }}>
                      <SafeImage
                        src={attr.image}
                        alt={attr.name}
                        aspectRatio="4:3"
                        category="heritage"
                        verified={true}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(200,90,50,0.9)', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'capitalize' }}>
                        {Array.isArray(attr.category) ? attr.category[0] : (attr.type || 'Attraction')}
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(6px)', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                        {attr.city}
                      </div>
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <h5 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                        {attr.name}
                      </h5>
                      <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.5, margin: '0 0 1rem 0', flex: 1 }}>
                        {attr.shortDescription || attr.longDescription}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--tourism-sand-border)' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenDirections(attr)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: 'none',
                            border: 'none',
                            color: 'var(--tourism-forest)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          <Navigation size={13} />
                          <span>Directions</span>
                        </button>

                        <Link
                          to={`/india/${selectedState.slug}/${attr.citySlug || (attr.city ? attr.city.toLowerCase().replace(/\s+/g, '-') : 'city')}/${attr.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--tourism-earth)',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            textDecoration: 'none'
                          }}
                        >
                          <span>Explore Sight</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Tab 5: Authentic Cuisine & Delicacies */}
        {activeTab === 'cuisine' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Authentic Delicacies & Culinary Heritage of {selectedState.name}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                Centuries-old royal recipes, traditional street fare, and indigenous spices
              </p>
            </div>

            {(!selectedState.popularFoods || selectedState.popularFoods.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                <Utensils size={32} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                <p>Culinary records for this state are being curated.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {selectedState.popularFoods.map((food, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--tourism-sand-light)',
                      border: '1px solid var(--tourism-sand-border)',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'var(--shadow-subtle)',
                      transition: 'var(--transition-smooth)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tourism-earth)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      <Utensils size={13} />
                      <span>Specialty #{idx + 1}</span>
                    </div>

                    <h5 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                      {food.name}
                    </h5>

                    <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem 0', flex: 1 }}>
                      {food.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--tourism-sand-border)' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Traditional Cuisine</span>
                      <Link
                        to={`/search?q=${encodeURIComponent(food.name)}`}
                        style={{ fontSize: '0.78rem', color: 'var(--tourism-earth)', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                      >
                        <span>Find Places</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 9. Tab 6: Culture & Festivals */}
        {activeTab === 'culture' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Grand Festivals & Cultural Celebrations
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                Living spiritual celebrations, classical dance festivals, and vibrant carnivals
              </p>
            </div>

            {/* Cultural overview */}
            {selectedState.culture && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(200,90,50,0.06) 0%, rgba(13,148,136,0.06) 100%)',
                border: '1px solid var(--tourism-sand-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tourism-earth)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <PartyPopper size={14} />
                  <span>State Cultural Essence</span>
                </div>
                <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                  {selectedState.culture}
                </p>
              </div>
            )}

            {/* Festivals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {(selectedState.festivals || []).map((fest, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--tourism-sand-border)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-subtle)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tourism-forest)', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    <Calendar size={13} />
                    <span>Annual Festival</span>
                  </div>

                  <h5 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                    {fest.name}
                  </h5>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, margin: '0', flex: 1 }}>
                    {fest.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. Tab 7: Travel Logistics & Connectivity */}
        {activeTab === 'logistics' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Verified Travel Logistics, Connectivity & Safety
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                Airports, major rail junctions, expressway networks, and verified emergency contacts
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {/* Airports */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Plane size={18} />
                  <span>Airports & Flight Hubs</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(selectedState.transportation?.airports || ['State International & Regional Terminals']).map((ap, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--tourism-sand)', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                      {ap}
                    </div>
                  ))}
                </div>
              </div>

              {/* Railway Junctions */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Train size={18} />
                  <span>Key Railway Junctions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(selectedState.transportation?.railway || ['Central Railway Terminus']).map((rw, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--tourism-sand)', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                      {rw}
                    </div>
                  ))}
                </div>
              </div>

              {/* Highway / Road */}
              <div style={{ background: '#FFFFFF', border: '1px solid var(--tourism-sand-border)', borderRadius: '16px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Car size={18} />
                  <span>Road & Expressways</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(selectedState.transportation?.road || ['National Highways & State Expressways']).map((rd, idx) => (
                    <div key={idx} style={{ padding: '0.6rem 0.75rem', backgroundColor: 'var(--tourism-sand)', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                      {rd}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Safety & Emergency Contacts Box */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Shield size={14} />
                  <span>24/7 Verified Tourist Safety & Helpline</span>
                </div>
                <h5 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>
                  National Emergency Helpline: Dial 112
                </h5>
                <p style={{ fontSize: '0.82rem', color: '#94A3B8', margin: 0, maxWidth: '540px' }}>
                  Round-the-clock tourist assistance, English & regional language support, GPS police dispatch, and medical SOS response.
                </p>
              </div>

              <Link
                to="/safety"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--tourism-earth)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                <span>Open Safety Hub</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* 11. Tab 8: Recommended Itineraries */}
        {activeTab === 'itineraries' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Curated Multi-Day State Itineraries
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                Algorithmic sequence minimizing travel time with circadian time-of-day suitability
              </p>
            </div>

            {stateItineraries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                <Calendar size={32} color="#94A3B8" style={{ margin: '0 auto 0.5rem' }} />
                <p>Generating custom itineraries for this state...</p>
                <Link
                  to="/planner"
                  state={{ selectedState: selectedState }}
                  className="tourism-badge badge-earth"
                  style={{ textDecoration: 'none', display: 'inline-block', marginTop: '0.5rem' }}
                >
                  Create Custom AI Itinerary Now
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {stateItineraries.map((itin) => (
                  <div
                    key={itin.id}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--tourism-sand-border)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--tourism-earth)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                          <Calendar size={13} />
                          <span>{itin.durationDays} Days / {itin.durationDays - 1} Nights</span>
                        </div>
                        <h5 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                          {itin.title}
                        </h5>
                      </div>

                      <Link
                        to="/planner"
                        state={{ selectedItinerary: itin }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'var(--tourism-earth)',
                          color: '#FFFFFF',
                          padding: '0.65rem 1.25rem',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          textDecoration: 'none'
                        }}
                      >
                        <span>Open in Trip Planner</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                      {itin.summary}
                    </p>

                    {/* Cities Covered Tags */}
                    {itin.citiesCovered && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Route:</span>
                        {itin.citiesCovered.map((cty, idx) => (
                          <span
                            key={idx}
                            style={{
                              backgroundColor: 'var(--tourism-sand)',
                              color: '#0F172A',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}
                          >
                            {cty}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
