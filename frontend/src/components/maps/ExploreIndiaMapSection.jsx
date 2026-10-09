import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Navigation,
  Search,
  Crosshair,
  Building,
  Hotel,
  Award,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Filter
} from 'lucide-react';
import GoogleMapView from './GoogleMapView';
import DirectionsModal from '../tourism/DirectionsModal';
import CityCard from '../tourism/CityCard';
import AttractionCard from '../tourism/AttractionCard';
import HotelCard from '../tourism/HotelCard';
import { states, cities, attractions } from '../../data/indiaTourismData';
import { hotels as allHotels } from '../../data/hotelsData';
import {
  STATE_CENTERS,
  INDIA_CENTER,
  buildGoogleMapsSearchUrl,
  buildGoogleMapsDirectionsUrl
} from '../../utils/googleMaps';

export default function ExploreIndiaMapSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial selection from URL query or default to 'all' or 'tamil-nadu'
  const stateQuery = searchParams.get('state') || '';
  const cityQuery = searchParams.get('city') || '';

  const [selectedStateSlug, setSelectedStateSlug] = useState(stateQuery || 'all');
  const [selectedCityId, setSelectedCityId] = useState(cityQuery || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all', 'cities', 'attractions', 'hotels', 'heritage', 'spiritual', 'nature'
  const [showHotelsOnMap, setShowHotelsOnMap] = useState(true);

  // Directions Modal
  const [directionsTarget, setDirectionsTarget] = useState(null);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  // Selected Marker for Highlight
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // Synchronize state selection with URL params
  const handleSelectState = (slug) => {
    setSelectedStateSlug(slug);
    setSelectedCityId('all');
    setSelectedMarkerId(null);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('state');
      newParams.delete('city');
    } else {
      newParams.set('state', slug);
      newParams.delete('city');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSelectCity = (cityId) => {
    setSelectedCityId(cityId);
    setSelectedMarkerId(cityId);
    const newParams = new URLSearchParams(searchParams);
    if (cityId === 'all') {
      newParams.delete('city');
    } else {
      newParams.set('city', cityId);
    }
    setSearchParams(newParams, { replace: true });
  };

  // Currently active state object
  const currentState = useMemo(() => {
    if (selectedStateSlug === 'all') return null;
    return states.find(s => s.slug === selectedStateSlug || s.id === selectedStateSlug) || null;
  }, [selectedStateSlug]);

  // Cities filtered by state
  const stateCities = useMemo(() => {
    if (!currentState) return cities;
    return cities.filter(c => c.stateSlug === currentState.slug || c.state === currentState.name);
  }, [currentState]);

  // Attractions filtered by state & city
  const stateAttractions = useMemo(() => {
    let list = attractions;
    if (currentState) {
      list = list.filter(a => a.stateSlug === currentState.slug || a.state === currentState.name);
    }
    if (selectedCityId !== 'all') {
      list = list.filter(a => a.citySlug === selectedCityId || a.city.toLowerCase() === selectedCityId.toLowerCase());
    }
    return list;
  }, [currentState, selectedCityId]);

  // Hotels filtered by state & city
  const stateHotels = useMemo(() => {
    let list = allHotels;
    if (currentState) {
      list = list.filter(h => h.state.toLowerCase() === currentState.name.toLowerCase());
    }
    if (selectedCityId !== 'all') {
      list = list.filter(h => h.citySlug === selectedCityId || h.city.toLowerCase() === selectedCityId.toLowerCase());
    }
    return list;
  }, [currentState, selectedCityId]);

  // Search filter across states, cities, attractions, hotels
  const filteredSearchList = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    return {
      matchedStates: states.filter(s => s.name.toLowerCase().includes(q)),
      matchedCities: cities.filter(c => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)),
      matchedAttractions: attractions.filter(a => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.state.toLowerCase().includes(q)),
      matchedHotels: allHotels.filter(h => h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q))
    };
  }, [searchQuery]);

  // Compute map center and zoom
  const mapCenter = useMemo(() => {
    if (selectedCityId !== 'all') {
      const cityObj = cities.find(c => c.id === selectedCityId);
      if (cityObj && cityObj.latitude && cityObj.longitude) {
        return { lat: cityObj.latitude, lng: cityObj.longitude };
      }
    }
    if (selectedStateSlug !== 'all' && STATE_CENTERS[selectedStateSlug]) {
      return {
        lat: STATE_CENTERS[selectedStateSlug].latitude,
        lng: STATE_CENTERS[selectedStateSlug].longitude
      };
    }
    return { lat: INDIA_CENTER.latitude, lng: INDIA_CENTER.longitude };
  }, [selectedStateSlug, selectedCityId]);

  const mapZoom = useMemo(() => {
    if (selectedCityId !== 'all') return 12;
    if (selectedStateSlug !== 'all' && STATE_CENTERS[selectedStateSlug]) {
      return STATE_CENTERS[selectedStateSlug].zoom;
    }
    return INDIA_CENTER.zoom;
  }, [selectedStateSlug, selectedCityId]);

  // Prepare Map Markers
  const mapMarkers = useMemo(() => {
    const list = [];

    // 1. City Markers
    if (activeCategory === 'all' || activeCategory === 'cities') {
      stateCities.forEach(c => {
        if (c.latitude && c.longitude) {
          list.push({
            id: c.id,
            title: c.name,
            latitude: c.latitude,
            longitude: c.longitude,
            type: 'city',
            category: 'City',
            city: c.name,
            state: c.state,
            image: c.heroImage || c.image,
            address: `${c.name}, ${c.state}, India`
          });
        }
      });
    }

    // 2. Attraction Markers
    if (activeCategory === 'all' || activeCategory === 'attractions' || ['heritage', 'spiritual', 'nature'].includes(activeCategory)) {
      stateAttractions.forEach(a => {
        const coords = a.coordinates || { latitude: a.latitude, longitude: a.longitude };
        if (coords && coords.latitude && coords.longitude) {
          const cat = a.type || (a.category && a.category[0]) || 'attraction';
          if (activeCategory === 'all' || activeCategory === 'attractions' || cat.toLowerCase().includes(activeCategory)) {
            list.push({
              id: a.id,
              title: a.name,
              latitude: coords.latitude,
              longitude: coords.longitude,
              type: 'attraction',
              category: a.type || 'Attraction',
              city: a.city,
              state: a.state,
              image: a.image,
              address: `${a.name}, ${a.city}, ${a.state}`
            });
          }
        }
      });
    }

    // 3. Hotel Markers
    if (showHotelsOnMap && (activeCategory === 'all' || activeCategory === 'hotels')) {
      stateHotels.slice(0, 40).forEach(h => {
        if (h.latitude && h.longitude) {
          list.push({
            id: h.id,
            title: h.name,
            latitude: h.latitude,
            longitude: h.longitude,
            type: 'hotel',
            category: 'Hotel',
            city: h.city,
            state: h.state,
            address: h.address,
            rating: h.guestRating,
            starCategory: h.starCategory,
            image: h.image,
            website: h.website
          });
        }
      });
    }

    return list;
  }, [stateCities, stateAttractions, stateHotels, activeCategory, showHotelsOnMap]);

  return (
    <section className="explore-maps-section" style={{ padding: '4rem 0', backgroundColor: '#F8FAFC' }}>
      <div className="tourism-container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(234, 67, 53, 0.1)',
            color: '#DC2626',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.75rem'
          }}>
            <Navigation size={14} />
            <span>Interactive Google Maps Exploration</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, color: '#0F172A', margin: '0 0 0.85rem' }}>
            Explore India on Google Maps
          </h2>

          <p style={{ fontSize: '1.05rem', color: '#64748B', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
            Seamlessly navigate all 15 priority Indian states, 77 iconic cities, verified tourist attractions, and curated stays. Every location links to real Google Maps with turn-by-turn routing.
          </p>
        </div>

        {/* ── Search & Filter Control Bar ── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid var(--tourism-sand-border)',
          marginBottom: '2rem'
        }}>
          {/* Top Row: State Selector, City Selector, Global Search, GPS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            {/* 1. Searchable State Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem' }}>
                Select State
              </label>
              <select
                value={selectedStateSlug}
                onChange={(e) => handleSelectState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <option value="all">🇮🇳 All India (15 States Overview)</option>
                {states.map(s => (
                  <option key={s.id} value={s.slug}>
                    #{s.priorityRank} {s.name} ({s.majorCities?.length || 0} Cities)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Searchable City Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem' }}>
                Select City
              </label>
              <select
                value={selectedCityId}
                onChange={(e) => handleSelectCity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  backgroundColor: '#F8FAFC'
                }}
              >
                <option value="all">
                  {currentState ? `All Cities in ${currentState.name} (${stateCities.length})` : 'All Cities (77)'}
                </option>
                {stateCities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {currentState ? '' : `(${c.state})`}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Destination Text Search */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.4rem' }}>
                Find Destination / Attraction
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Taj Mahal, Meenakshi Temple, Ooty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.25rem',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.92rem',
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>
            </div>

            {/* 4. Current Location Quick Action */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setDirectionsTarget(currentState ? { name: `${currentState.capital || currentState.name}, ${currentState.name}`, state: currentState.name } : cities[0]);
                  setDirectionsModalOpen(true);
                }}
                style={{
                  height: '46px',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0 1.25rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s'
                }}
              >
                <Crosshair size={16} color="#38BDF8" />
                <span>My Directions Origin</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Category Chips & Hotel Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #F1F5F9'
          }}>
            {/* Category Filter Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={13} /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Markers' },
                { id: 'cities', label: 'Cities Only' },
                { id: 'attractions', label: 'Attractions' },
                { id: 'hotels', label: 'Hotels' },
                { id: 'heritage', label: 'Heritage' },
                { id: 'spiritual', label: 'Spiritual' },
                { id: 'nature', label: 'Nature' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    backgroundColor: activeCategory === cat.id ? '#0F172A' : '#F1F5F9',
                    color: activeCategory === cat.id ? '#FFFFFF' : '#475569',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Hotel Layer Toggle */}
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
              <input
                type="checkbox"
                checked={showHotelsOnMap}
                onChange={(e) => setShowHotelsOnMap(e.target.checked)}
                style={{ accentColor: '#1D4ED8', cursor: 'pointer' }}
              />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Hotel size={14} color="#1D4ED8" />
                <span>Show Nearby Hotels</span>
              </span>
            </label>
          </div>
        </div>

        {/* ── Interactive Google Map View ── */}
        <div style={{ marginBottom: '2.5rem' }}>
          <GoogleMapView
            markers={mapMarkers}
            center={mapCenter}
            zoom={mapZoom}
            selectedMarkerId={selectedMarkerId}
            onMarkerSelect={(m) => {
              setSelectedMarkerId(m.id);
              if (m.type === 'city') {
                setSelectedCityId(m.id);
              }
            }}
            height="560px"
            fitBounds={selectedCityId === 'all'}
          />
        </div>

        {/* ── Synchronized Cards & Results Lists ── */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--tourism-earth)', letterSpacing: '0.5px' }}>
                Synchronized Directory
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', margin: '0.2rem 0 0' }}>
                {currentState ? `Destinations in ${currentState.name}` : 'Priority Destinations Across India'}
              </h3>
            </div>

            {currentState && (
              <Link
                to={`/india/${currentState.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--tourism-earth)',
                  color: '#FFFFFF',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>Full {currentState.name} Guide</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {/* Cities Grid in Selected State */}
          <div style={{ marginBottom: '3rem' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              Cities in this region ({stateCities.length})
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {stateCities.map(city => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
          </div>

          {/* Attractions Grid in Selected Region */}
          {stateAttractions.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                Key Tourist Attractions ({stateAttractions.length})
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem'
              }}>
                {stateAttractions.slice(0, 12).map(attraction => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            </div>
          )}

          {/* Nearby Hotels in Region */}
          {stateHotels.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                Verified Accommodations & Stays ({stateHotels.length})
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {stateHotels.slice(0, 6).map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Directions Modal for Origin Selection */}
      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        target={directionsTarget}
      />
    </section>
  );
}
