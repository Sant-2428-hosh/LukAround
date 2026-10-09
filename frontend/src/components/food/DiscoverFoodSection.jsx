import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  MapPin,
  Sparkles,
  Compass,
  Filter,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Flame,
  Coffee,
  Heart,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import RestaurantCard from './RestaurantCard';
import MustTryFoodSection from './MustTryFoodSection';
import GoogleMapView from '../maps/GoogleMapView';
import DirectionsModal from '../tourism/DirectionsModal';
import { fetchNearbyRestaurants, fetchMustTryFood } from '../../services/restaurantService';
import { useApp } from '../../context/AppContext';

export default function DiscoverFoodSection({
  type = 'city', // 'attraction' | 'city' | 'state'
  destination = null, // attraction object, city object, or state object
  city = null,
  state = null
}) {
  const { openDishlyWithPrompt, setActiveDestinationContext } = useApp();

  // Determine names & coordinates
  const destName = destination?.name || city?.name || state?.name || 'Destination';
  const cityName = city?.name || destination?.city || (type === 'city' ? destination?.name : '') || '';
  const stateName = state?.name || destination?.state || city?.state || (type === 'state' ? destination?.name : '') || '';

  // Geographic coordinates for distance calculation
  const lat = destination?.latitude || destination?.coordinates?.latitude || city?.latitude || null;
  const lng = destination?.longitude || destination?.coordinates?.longitude || city?.longitude || null;

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRadius, setSelectedRadius] = useState(type === 'attraction' ? 3 : 5);
  const [selectedDietary, setSelectedDietary] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedRestaurantForDirections, setSelectedRestaurantForDirections] = useState(null);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  // Data States
  const [restaurants, setRestaurants] = useState([]);
  const [mustTryDishes, setMustTryDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState('');
  const [mapsSearchUrl, setMapsSearchUrl] = useState('');

  // Target count: 5–8 for attractions, 8–15 for cities
  const targetLimit = type === 'attraction' ? 8 : 14;

  // Sync destination context with global AppContext for Dishly AI
  useEffect(() => {
    if (setActiveDestinationContext) {
      setActiveDestinationContext({
        state: stateName,
        stateSlug: state?.slug || destination?.stateSlug || '',
        city: cityName,
        citySlug: city?.id || destination?.citySlug || '',
        attraction: type === 'attraction' ? destName : '',
        attractionSlug: type === 'attraction' ? (destination?.id || '') : '',
        coordinates: lat && lng ? { latitude: lat, longitude: lng } : null,
        hotel: null
      });
    }
  }, [destName, cityName, stateName, lat, lng, type, setActiveDestinationContext]);

  // Load Restaurants & Must-Try Food
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadFoodData() {
      try {
        const [restRes, foodRes] = await Promise.all([
          fetchNearbyRestaurants({
            lat,
            lng,
            attraction: type === 'attraction' ? destName : '',
            city: cityName,
            state: stateName,
            radius: selectedRadius,
            category: selectedCategory,
            dietary: selectedDietary,
            limit: targetLimit
          }),
          fetchMustTryFood({
            state: stateName,
            city: cityName,
            attraction: type === 'attraction' ? destName : ''
          })
        ]);

        if (isMounted) {
          if (restRes && restRes.success) {
            setRestaurants(restRes.data || []);
            setApiNotice(restRes.apiNotice || '');
            setMapsSearchUrl(restRes.mapsSearchUrl || '');
          }
          if (foodRes && foodRes.success) {
            setMustTryDishes(foodRes.data || []);
          }
        }
      } catch (err) {
        console.warn('[DiscoverFoodSection] Load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadFoodData();
    return () => { isMounted = false; };
  }, [lat, lng, destName, cityName, stateName, selectedRadius, selectedCategory, selectedDietary, targetLimit, type]);

  // Filtered restaurants for local text search
  const filteredRestaurants = useMemo(() => {
    if (!searchTerm.trim()) return restaurants;
    const q = searchTerm.toLowerCase();
    return restaurants.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.cuisine || '').toLowerCase().includes(q) ||
      (r.address || '').toLowerCase().includes(q) ||
      (r.mustTryDishes || []).some(d => d.toLowerCase().includes(q))
    );
  }, [restaurants, searchTerm]);

  // Map markers for GoogleMapView
  const restaurantMarkers = useMemo(() => {
    const list = [];

    // Add origin marker (e.g. attraction or city center)
    if (lat && lng) {
      list.push({
        id: 'origin-marker',
        title: destName,
        type: type === 'attraction' ? 'attraction' : 'city',
        latitude: lat,
        longitude: lng,
        address: `${destName}, ${cityName || stateName}`,
        city: cityName,
        state: stateName
      });
    }

    // Add restaurant markers
    filteredRestaurants.forEach(r => {
      if (r.latitude && r.longitude) {
        list.push({
          id: r.id,
          title: r.name,
          type: 'restaurant',
          latitude: r.latitude,
          longitude: r.longitude,
          address: r.address,
          rating: r.rating,
          priceTier: r.priceTier,
          cuisine: r.cuisine,
          city: r.city,
          state: r.state
        });
      }
    });

    return list;
  }, [filteredRestaurants, lat, lng, destName, cityName, stateName, type]);

  // Section Header Titles according to Prompt Section 20
  let sectionBadge = 'Culinary Discovery';
  let sectionHeading = `Discover Food in ${destName}`;
  let sectionSub = `Curated authentic restaurants, local delicacies and Google Maps navigation`;

  if (type === 'attraction') {
    sectionBadge = 'Food Near Attraction';
    sectionHeading = `Eat Near ${destName}`;
    sectionSub = `Hand-picked ${filteredRestaurants.length} popular and verified restaurants within ${selectedRadius} km of this monument`;
  } else if (type === 'city') {
    sectionBadge = 'Famous City Flavors';
    sectionHeading = `Famous Food in ${cityName || destName}`;
    sectionSub = `Must-try regional dishes, iconic local eateries and verified dining spots across ${cityName || destName}`;
  } else if (type === 'state') {
    sectionBadge = 'Regional Culinary Heritage';
    sectionHeading = `Discover the Taste of ${stateName || destName}`;
    sectionSub = `Authentic flavors, royal legacies and culinary landmarks across ${stateName || destName}`;
  }

  // Categories list (Section 8)
  const categoryTabs = [
    'All',
    'Local Food',
    'Must-Try Food',
    'Vegetarian',
    'Non-Vegetarian',
    'Breakfast',
    'Budget-Friendly',
    'Family-Friendly',
    'Premium Dining',
    'Cafes & Bakeries',
    'Sweets & Desserts'
  ];

  const handleDishFilter = (dishName) => {
    setSearchTerm(dishName);
    const element = document.getElementById('restaurant-discovery-cards');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDirections = (rest) => {
    setSelectedRestaurantForDirections(rest);
    setDirectionsModalOpen(true);
  };

  return (
    <section
      id="discover-food-section"
      style={{
        marginTop: '3.5rem',
        marginBottom: '4rem',
        scrollMarginTop: '90px'
      }}
    >
      {/* ── Section Header ── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="tourism-badge badge-forest" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Utensils size={12} />
              <span>{sectionBadge}</span>
            </span>
            <h2 className="tourism-heading" style={{ fontSize: '1.9rem', marginTop: '0.35rem' }}>
              {sectionHeading}
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0.35rem 0 0' }}>
              {sectionSub}
            </p>
          </div>

          {/* View Toggle (Grid vs Map) */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px', display: 'flex' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'grid' ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Cards ({filteredRestaurants.length})
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: viewMode === 'map' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'map' ? '#0F172A' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <MapIcon size={12} />
                <span>Map View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Dishly AI Interactive Concierge Banner (Section 5 & 20) ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FFEDD5 100%)',
          border: '1px solid #FDE68A',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Sparkles size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#78350F' }}>
                Ask Dishly AI • Your Indian Food & Dining Assistant
              </div>
              <div style={{ fontSize: '0.82rem', color: '#92400E' }}>
                Instantly find dishes, verified pure veg spots, budget lunch, or places near {destName}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openDishlyWithPrompt?.(`Recommend the best restaurants and must-try local food near ${destName}.`)}
            className="tourism-btn"
            style={{
              backgroundColor: '#B45309',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              padding: '0.45rem 0.9rem',
              border: 'none',
              boxShadow: '0 2px 8px rgba(180, 83, 9, 0.25)'
            }}
          >
            <span>Chat with Dishly</span>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            `What are famous restaurants near ${destName}?`,
            `Show pure veg spots near ${cityName || destName}`,
            `What local food should I try in ${cityName || destName}?`,
            `Find affordable restaurants within 2 km`
          ].map((prompt, pi) => (
            <button
              key={pi}
              type="button"
              onClick={() => openDishlyWithPrompt?.(prompt)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FCD34D',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#78350F',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Must-Try Local Food Section (Section 6 & 7) ── */}
      {mustTryDishes.length > 0 && (
        <MustTryFoodSection
          dishes={mustTryDishes}
          destinationName={destName}
          onSelectDish={handleDishFilter}
        />
      )}

      {/* ── Filter & Search Toolbar ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '1rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Top Controls: Search & Radius */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={`Search dishes or restaurants in ${destName}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                backgroundColor: '#F8FAFC'
              }}
            />
          </div>

          {/* Radius selector (Section 11) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
              Radius:
            </span>
            {[1, 2, 5, 10, 20].map(rad => (
              <button
                key={rad}
                type="button"
                onClick={() => setSelectedRadius(rad)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedRadius === rad ? '#1E293B' : '#E2E8F0',
                  backgroundColor: selectedRadius === rad ? '#1E293B' : '#FFFFFF',
                  color: selectedRadius === rad ? '#FFFFFF' : '#475569',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {rad} km
              </button>
            ))}
          </div>

          {/* Dietary toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {['All', 'Vegetarian', 'Non-Vegetarian'].map(diet => (
              <button
                key={diet}
                type="button"
                onClick={() => setSelectedDietary(diet)}
                style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedDietary === diet ? '#059669' : '#E2E8F0',
                  backgroundColor: selectedDietary === diet ? '#ECFDF5' : '#FFFFFF',
                  color: selectedDietary === diet ? '#065F46' : '#64748B',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {diet}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs (Section 8) */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {categoryTabs.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                whiteSpace: 'nowrap',
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#D97706' : '#E2E8F0',
                backgroundColor: selectedCategory === cat ? '#FFFBEB' : '#FFFFFF',
                color: selectedCategory === cat ? '#92400E' : '#475569',
                fontSize: '0.78rem',
                fontWeight: selectedCategory === cat ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content View: Grid or Map ── */}
      {viewMode === 'map' ? (
        <div style={{ marginBottom: '2rem' }}>
          <GoogleMapView
            markers={restaurantMarkers}
            center={lat && lng ? { lat: Number(lat), lng: Number(lng) } : { lat: 21.7679, lng: 78.8718 }}
            zoom={type === 'attraction' ? 14 : 12}
            height="460px"
            fitBounds={true}
            mapTitle={`Food & Restaurants near ${destName}`}
          />
        </div>
      ) : null}

      {/* ── Restaurant Cards Grid (Section 4 & 9) ── */}
      <div id="restaurant-discovery-cards">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
            <Utensils size={32} color="#D97706" style={{ animation: 'spin 1.5s linear infinite' }} />
            <div style={{ marginTop: '0.75rem', fontWeight: 700 }}>Finding verified restaurants near {destName}...</div>
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {filteredRestaurants.map(rest => (
              <RestaurantCard
                key={rest.id}
                restaurant={rest}
                originName={destName}
                originCoords={lat && lng ? { lat, lng } : null}
                onGetDirections={handleDirections}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              padding: '2.5rem',
              textAlign: 'center',
              border: '1px dashed #CBD5E1'
            }}
          >
            <Utensils size={28} color="#94A3B8" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: '0.75rem 0 0.35rem' }}>
              No restaurants matching selected filter within {selectedRadius} km
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '460px', margin: '0 auto 1.25rem' }}>
              Try expanding your search radius to 10 km or 20 km, or explore live verified dining options directly on Google Maps.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => { setSelectedRadius(10); setSelectedCategory('All'); setSearchTerm(''); }}
                className="tourism-btn tourism-btn-primary"
                style={{ fontSize: '0.82rem' }}
              >
                Expand to 10 km
              </button>
              {mapsSearchUrl && (
                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tourism-btn tourism-btn-outline"
                  style={{ fontSize: '0.82rem' }}
                >
                  <MapPin size={13} color="#DC2626" />
                  <span>Search on Google Maps</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Google Maps Direct Link & Transparency Notice (Section 17 & 22) ── */}
      {mapsSearchUrl && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.82rem',
            color: '#64748B'
          }}
        >
          <div>
            <strong style={{ color: '#1E293B' }}>Live Google Maps Verification: </strong>
            <span>All recommendations link to verified Google Place IDs and coordinate routing.</span>
          </div>

          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#DC2626',
              fontWeight: 800,
              textDecoration: 'none'
            }}
          >
            <span>Explore all real-time restaurants near {destName} on Google Maps</span>
            <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* ── Directions Modal for Restaurant Navigation ── */}
      {selectedRestaurantForDirections && (
        <DirectionsModal
          isOpen={directionsModalOpen}
          onClose={() => {
            setDirectionsModalOpen(false);
            setSelectedRestaurantForDirections(null);
          }}
          target={{
            name: selectedRestaurantForDirections.name,
            address: selectedRestaurantForDirections.address,
            city: selectedRestaurantForDirections.city,
            state: selectedRestaurantForDirections.state,
            latitude: selectedRestaurantForDirections.latitude,
            longitude: selectedRestaurantForDirections.longitude,
            googlePlaceId: selectedRestaurantForDirections.googlePlaceId
          }}
        />
      )}
    </section>
  );
}
