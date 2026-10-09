import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Hotel,
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronRight,
  Filter,
  Grid,
  Map,
  X,
  RotateCcw
} from 'lucide-react';
import HotelCard from '../components/tourism/HotelCard';
import HotelComparisonModal from '../components/tourism/HotelComparisonModal';
import DirectionsModal from '../components/tourism/DirectionsModal';
import GoogleMapView from '../components/maps/GoogleMapView';
import DiscoverFoodSection from '../components/food/DiscoverFoodSection';
import { useApp } from '../context/AppContext';
import { hotels as allHotelsData } from '../data/hotelsData';
import { states, cities } from '../data/indiaTourismData';
import { sortHotels, calculateDistance } from '../utils/distance';
import { getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl } from '../utils/googleMaps';

export default function Hotels() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL Query Parameters
  const paramCity = searchParams.get('city') || '';
  const paramState = searchParams.get('state') || '';
  const paramStar = searchParams.get('stars') || '';

  // Local Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState(paramState);
  const [selectedCity, setSelectedCity] = useState(paramCity);
  const [selectedStars, setSelectedStars] = useState(paramStar ? [parseInt(paramStar, 10)] : []);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedSafety, setSelectedSafety] = useState([]);
  const [priceLevelFilter, setPriceLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');

  // Compare & Directions Modals
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [directionsHotel, setDirectionsHotel] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { setActiveDestinationContext } = useApp();

  // Sync state if URL search params change
  useEffect(() => {
    if (paramCity && paramCity !== selectedCity) setSelectedCity(paramCity);
    if (paramState && paramState !== selectedState) setSelectedState(paramState);
  }, [paramCity, paramState]);

  // Sync active destination context for Dishly AI
  useEffect(() => {
    if (selectedCity && setActiveDestinationContext) {
      setActiveDestinationContext({
        state: selectedState || '',
        city: selectedCity,
        attraction: `Hotels in ${selectedCity}`,
        coordinates: null
      });
    }
  }, [selectedCity, selectedState, setActiveDestinationContext]);

  // Available cities filtered by selected state
  const availableCities = useMemo(() => {
    if (!selectedState) return cities;
    return cities.filter(
      (c) => c.state.toLowerCase() === selectedState.toLowerCase() ||
             c.stateSlug.toLowerCase() === selectedState.toLowerCase()
    );
  }, [selectedState]);

  // Star Category toggle
  const toggleStar = (starNum) => {
    setSelectedStars((prev) =>
      prev.includes(starNum) ? prev.filter((s) => s !== starNum) : [...prev, starNum]
    );
  };

  // Amenity toggle
  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Safety indicator toggle
  const toggleSafety = (indicator) => {
    setSelectedSafety((prev) =>
      prev.includes(indicator) ? prev.filter((s) => s !== indicator) : [...prev, indicator]
    );
  };

  // Property type toggle
  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedState('');
    setSelectedCity('');
    setSelectedStars([]);
    setSelectedTypes([]);
    setMinRating(0);
    setSelectedAmenities([]);
    setSelectedSafety([]);
    setPriceLevelFilter('all');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredHotels = useMemo(() => {
    let list = [...allHotelsData];

    // Search query (name, address, city, state)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.state.toLowerCase().includes(q) ||
          h.address.toLowerCase().includes(q) ||
          (h.amenities || []).some((a) => a.toLowerCase().includes(q))
      );
    }

    // State filter
    if (selectedState) {
      const s = selectedState.toLowerCase();
      list = list.filter(
        (h) => (h.state || '').toLowerCase() === s || (h.state || '').toLowerCase().includes(s)
      );
    }

    // City filter
    if (selectedCity) {
      const c = selectedCity.toLowerCase();
      list = list.filter(
        (h) =>
          (h.city || '').toLowerCase() === c ||
          (h.citySlug || '').toLowerCase() === c ||
          (h.city || '').toLowerCase().includes(c)
      );
    }

    // Star classification
    if (selectedStars.length > 0) {
      list = list.filter((h) => selectedStars.includes(h.starCategory));
    }

    // Property Type
    if (selectedTypes.length > 0) {
      list = list.filter((h) =>
        selectedTypes.some((t) => (h.propertyType || '').toLowerCase().includes(t.toLowerCase()))
      );
    }

    // Guest Rating filter
    if (minRating > 0) {
      list = list.filter((h) => (h.guestRating || 0) >= minRating);
    }

    // Price Level filter
    if (priceLevelFilter !== 'all') {
      list = list.filter((h) => h.priceLevel === priceLevelFilter);
    }

    // Amenities filter (ALL selected must match)
    if (selectedAmenities.length > 0) {
      list = list.filter((h) =>
        selectedAmenities.every((req) =>
          (h.amenities || []).some((a) => a.toLowerCase().includes(req.toLowerCase()))
        )
      );
    }

    // Safety Indicators filter (ALL selected must match)
    if (selectedSafety.length > 0) {
      list = list.filter((h) =>
        selectedSafety.every((req) =>
          (h.safetyIndicators || []).some((s) => s.toLowerCase().includes(req.toLowerCase()))
        )
      );
    }

    // Apply sorting
    return sortHotels(list, sortBy);
  }, [
    allHotelsData,
    searchQuery,
    selectedState,
    selectedCity,
    selectedStars,
    selectedTypes,
    minRating,
    priceLevelFilter,
    selectedAmenities,
    selectedSafety,
    sortBy
  ]);

  // Map markers for GoogleMapView
  const hotelMarkers = useMemo(() => {
    return filteredHotels
      .filter((h) => h.latitude && h.longitude)
      .map((h) => ({
        id: h.id || h.slug,
        title: h.name,
        name: h.name,
        latitude: h.latitude,
        longitude: h.longitude,
        address: h.address,
        type: 'hotel',
        category: h.starCategory ? `${h.starCategory}-Star ${h.propertyType || 'Hotel'}` : (h.propertyType || 'Hotel'),
        rating: h.guestRating,
        mapsSearchUrl: getGoogleMapsSearchUrl(h),
        directionsUrl: getGoogleMapsDirectionsUrl(h)
      }));
  }, [filteredHotels]);

  // Center coordinate for map view
  const mapCenter = useMemo(() => {
    if (hotelMarkers.length > 0) {
      return { lat: hotelMarkers[0].latitude, lng: hotelMarkers[0].longitude };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [hotelMarkers]);

  // Comparison Handlers
  const handleToggleCompare = (hotel) => {
    setCompareList((prev) => {
      const exists = prev.some((h) => h.id === hotel.id);
      if (exists) {
        return prev.filter((h) => h.id !== hotel.id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 hotels simultaneously.');
        return prev;
      }
      return [...prev, hotel];
    });
  };

  const handleRemoveCompare = (hotelId) => {
    setCompareList((prev) => prev.filter((h) => h.id !== hotelId));
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '90vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="container">
        {/* ── Page Header Banner ── */}
        <div style={{ maxWidth: '840px', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
            <span
              style={{
                backgroundColor: '#FEF2F2',
                color: 'var(--color-primary)',
                border: '1px solid #FEE2E2',
                borderRadius: '9999px',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Hotel size={13} /> Verified Hospitality Platform
            </span>
            <span
              style={{
                backgroundColor: '#F0FDF4',
                color: '#15803D',
                borderRadius: '9999px',
                padding: '0.25rem 0.7rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CheckCircle2 size={12} /> Real Properties • All 15 States
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 900,
              color: '#0F172A',
              lineHeight: 1.2,
              marginBottom: '0.75rem'
            }}
          >
            Hotel & Accommodation Discovery
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Discover authentic heritage palaces, luxury resorts, and verified budget lodges across India. Direct Google Maps navigation, transparent safety indicators, and official booking links.
          </p>
        </div>

        {/* ── Search & Quick Filter Bar ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Search Input */}
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search
              size={18}
              color="#94A3B8"
              style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search hotel name, monument, city, or amenity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* State Dropdown */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('');
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="">All 15 States</option>
              {states.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Dropdown */}
          <div style={{ flex: '0 1 180px' }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="">All Cities</option>
              {availableCities.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ flex: '0 1 200px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="recommended">Recommended (Safety First)</option>
              <option value="rating">Highest Rated (4.8+)</option>
              <option value="reviews">Most Reviewed</option>
              <option value="5-star">5-Star First</option>
              <option value="3-star">3-Star First</option>
              <option value="budget">Budget First</option>
              <option value="family">Family-Friendly</option>
              <option value="best-overall">Best Overall</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={resetFilters}
            title="Reset all filters"
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>

        {/* ── Two-Column Layout: Sidebar Filters + Hotel Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
          
          {/* ── Sidebar Filters (Sticky) ── */}
          <aside
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
              position: 'sticky',
              top: '90px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
              <Filter size={18} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Filter Accommodations
              </h3>
            </div>

            {/* 1. Official Star Category */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#334155', marginBottom: '0.6rem' }}>
                Star Classification
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { star: 5, label: '★★★★★ 5-Star' },
                  { star: 4, label: '★★★★ 4-Star' },
                  { star: 3, label: '★★★ 3-Star' },
                  { star: 2, label: '★★ 2-Star & Lodges' }
                ].map(({ star, label }) => (
                  <label
                    key={star}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStars.includes(star)}
                      onChange={() => toggleStar(star)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Guest Rating */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#334155', marginBottom: '0.6rem' }}>
                Minimum Guest Rating
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {[
                  { val: 0, label: 'All' },
                  { val: 4.5, label: '4.5+' },
                  { val: 4.0, label: '4.0+' },
                  { val: 3.5, label: '3.5+' }
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinRating(val)}
                    style={{
                      flex: 1,
                      padding: '0.35rem 0.4rem',
                      borderRadius: '6px',
                      border: minRating === val ? '1px solid var(--color-primary)' : '1px solid #CBD5E1',
                      backgroundColor: minRating === val ? 'var(--color-primary)' : '#F8FAFC',
                      color: minRating === val ? '#FFFFFF' : '#334155',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Price Category */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#334155', marginBottom: '0.6rem' }}>
                Price Tier
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { id: 'all', label: 'All Tiers' },
                  { id: '₹₹₹₹', label: '₹₹₹₹ — Luxury' },
                  { id: '₹₹₹', label: '₹₹₹ — Premium' },
                  { id: '₹₹', label: '₹₹ — Moderate' },
                  { id: '₹', label: '₹ — Budget' }
                ].map(({ id, label }) => (
                  <label
                    key={id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="priceTier"
                      checked={priceLevelFilter === id}
                      onChange={() => setPriceLevelFilter(id)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Safety & Trust Indicators */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#15803D', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Safety Indicators
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  'Verified Property',
                  '24-Hour Front Desk',
                  'CCTV Monitored Premises',
                  'Family-Friendly',
                  'Strong Guest Reviews'
                ].map((ind) => (
                  <label
                    key={ind}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedSafety.includes(ind)}
                      onChange={() => toggleSafety(ind)}
                      style={{ accentColor: '#16A34A' }}
                    />
                    <span>{ind}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Essential Amenities */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#334155', marginBottom: '0.6rem' }}>
                Essential Amenities
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  'Swimming Pool',
                  'Spa',
                  'Fine Dining',
                  'Free Parking',
                  '24-Hour Front Desk'
                ].map((am) => (
                  <label
                    key={am}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(am)}
                      onChange={() => toggleAmenity(am)}
                      style={{ accentColor: 'var(--color-primary)' }}
                    />
                    <span>{am}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Results Grid ── */}
          <main>
            {/* Results count & status & view switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.95rem', color: '#334155' }}>
                Showing <strong style={{ color: '#0F172A' }}>{filteredHotels.length}</strong> verified accommodations
                {selectedCity ? ` in ${selectedCity}` : selectedState ? ` in ${selectedState}` : ' across India'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {/* View Switcher */}
                <div style={{ display: 'inline-flex', backgroundColor: '#E2E8F0', padding: '3px', borderRadius: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                      color: viewMode === 'grid' ? '#0F172A' : '#64748B',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <Grid size={14} /> Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: viewMode === 'map' ? '#FFFFFF' : 'transparent',
                      color: viewMode === 'map' ? '#0F172A' : '#64748B',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <Map size={14} /> Map
                  </button>
                </div>

                {/* Mandatory Section 24 disclaimer reminder */}
                <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#16A34A" /> 100% Real Properties & Official Maps
                </div>
              </div>
            </div>

            {/* Map View Mode */}
            {viewMode === 'map' ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '620px', borderRadius: '12px', overflow: 'hidden' }}>
                  <GoogleMapView
                    center={mapCenter}
                    zoom={selectedCity ? 12 : selectedState ? 8 : 5}
                    markers={hotelMarkers}
                    height="100%"
                    mapId="hotels-page-map"
                    showControls={true}
                  />
                </div>
              </div>
            ) : filteredHotels.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  border: '1px solid #E2E8F0'
                }}
              >
                <Hotel size={42} color="#94A3B8" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                  No hotels match your specific filters
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Try loosening your filter criteria or clearing specific amenities.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    isSelectedForCompare={compareList.some((ch) => ch.id === hotel.id)}
                    onToggleCompare={handleToggleCompare}
                    onOpenDirections={(h) => setDirectionsHotel(h)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* ── Food & Restaurants Near Hotels ── */}
        <div style={{ marginTop: '3.5rem', width: '100%' }}>
          <DiscoverFoodSection
            destination={{
              city: selectedCity || 'Jaipur',
              state: selectedState || 'Rajasthan',
              attraction: selectedCity ? `Hotels in ${selectedCity}` : 'Selected Hotel'
            }}
            sectionTitle={`Famous Food & Restaurants Near Hotels in ${selectedCity || 'India'}`}
            subtitle="Verified authentic eateries, local food spots, and must-try delicacies located conveniently near popular stay options."
          />
        </div>

        {/* ── Floating Compare Tray (Sticky at bottom when hotels selected) ── */}
        {compareList.length > 0 && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              zIndex: 9000
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
              Comparing <strong style={{ color: '#38BDF8' }}>{compareList.length} / 3</strong> hotels
            </div>
            <button
              type="button"
              onClick={() => setIsCompareModalOpen(true)}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.45rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Compare Now</span>
              <ChevronRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => setCompareList([])}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear
            </button>
          </div>
        )}

        {/* ── Comparison Modal ── */}
        <HotelComparisonModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          hotels={compareList}
          onRemoveHotel={handleRemoveCompare}
        />

        {/* ── Directions Modal ── */}
        {directionsHotel && (
          <DirectionsModal
            isOpen={Boolean(directionsHotel)}
            onClose={() => setDirectionsHotel(null)}
            hotel={directionsHotel}
          />
        )}
      </div>
    </div>
  );
}
