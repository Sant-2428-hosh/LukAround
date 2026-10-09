import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { states, cities, attractions, itineraries } from '../data/indiaTourismData';
import { hotels as allHotels } from '../data/hotelsData';
import CityCard from '../components/tourism/CityCard';
import AttractionCard from '../components/tourism/AttractionCard';
import HotelCard from '../components/tourism/HotelCard';
import ItineraryCard from '../components/tourism/ItineraryCard';
import SafeImage from '../components/tourism/SafeImage';
import ImageGalleryModal from '../components/tourism/ImageGalleryModal';
import GoogleMapView from '../components/maps/GoogleMapView';
import DirectionsModal from '../components/tourism/DirectionsModal';
import { buildGoogleMapsSearchUrl, STATE_CENTERS } from '../utils/googleMaps';
import {
  MapPin,
  Calendar,
  Award,
  Plane,
  Train,
  Car,
  Utensils,
  PartyPopper,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Compass,
  CheckCircle2,
  Landmark,
  Camera,
  ShieldCheck,
  Maximize2,
  Navigation,
  ExternalLink,
  Search,
  Filter,
  Hotel
} from 'lucide-react';

export default function StateDetail() {
  const { stateSlug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Search & Filter State
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState('all');
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // Directions Modal
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  const state = states.find(s => s.slug === stateSlug || s.id === stateSlug) || states[0];
  const stateCities = cities.filter(c => c.stateSlug === state.slug || c.state === state.name);
  const stateAttractions = attractions.filter(a => a.stateSlug === state.slug || a.state === state.name);
  const stateItineraries = itineraries.filter(i => i.state === state.name);
  const stateHotels = allHotels.filter(h => h.state.toLowerCase() === state.name.toLowerCase());

  // Filter attractions by category types
  const heritageAttractions = stateAttractions.filter(a => (a.category || []).includes('heritage') || a.type === 'heritage' || a.type === 'forts-palaces');
  const spiritualAttractions = stateAttractions.filter(a => (a.category || []).includes('spiritual') || a.type === 'spiritual');
  const natureAttractions = stateAttractions.filter(a => (a.category || []).includes('nature') || (a.category || []).includes('beaches') || (a.category || []).includes('hill-stations') || (a.category || []).includes('wildlife') || (a.category || []).includes('lakes-waterfalls'));

  // City filtering
  const filteredCities = useMemo(() => {
    return stateCities.filter(c => {
      const matchesSearch = !citySearchTerm.trim() ||
        c.name.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(citySearchTerm.toLowerCase());

      const matchesStyle = selectedStyleFilter === 'all' ||
        (c.travelStyles || []).some(s => s.toLowerCase() === selectedStyleFilter.toLowerCase());

      return matchesSearch && matchesStyle;
    });
  }, [stateCities, citySearchTerm, selectedStyleFilter]);

  // Map markers for this state
  const stateMapMarkers = useMemo(() => {
    const markers = [];

    // All Cities in State
    stateCities.forEach(c => {
      if (c.latitude && c.longitude) {
        markers.push({
          id: c.id,
          title: c.name,
          latitude: c.latitude,
          longitude: c.longitude,
          type: 'city',
          category: 'City',
          city: c.name,
          state: state.name,
          image: c.heroImage || c.image,
          address: `${c.name}, ${state.name}, India`
        });
      }
    });

    // Top Attractions in State
    stateAttractions.forEach(a => {
      const coords = a.coordinates || { latitude: a.latitude, longitude: a.longitude };
      if (coords && coords.latitude && coords.longitude) {
        markers.push({
          id: a.id,
          title: a.name,
          latitude: coords.latitude,
          longitude: coords.longitude,
          type: 'attraction',
          category: a.type || 'Attraction',
          city: a.city,
          state: state.name,
          image: a.image,
          address: `${a.name}, ${a.city}, ${state.name}`
        });
      }
    });

    return markers;
  }, [stateCities, stateAttractions, state.name]);

  const mapCenter = useMemo(() => {
    if (STATE_CENTERS[state.slug]) {
      return {
        lat: STATE_CENTERS[state.slug].latitude,
        lng: STATE_CENTERS[state.slug].longitude
      };
    }
    if (stateCities[0] && stateCities[0].latitude) {
      return { lat: stateCities[0].latitude, lng: stateCities[0].longitude };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [state.slug, stateCities]);

  const mapZoom = useMemo(() => {
    return STATE_CENTERS[state.slug]?.zoom || 7;
  }, [state.slug]);

  const allImages = [
    state.heroImage,
    ...(state.gallery || [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const openGalleryAt = (idx) => {
    setActivePhotoIndex(idx);
    setGalleryOpen(true);
  };

  const stateMapsUrl = buildGoogleMapsSearchUrl({
    name: `${state.name}, India`,
    state: state.name,
    latitude: STATE_CENTERS[state.slug]?.latitude,
    longitude: STATE_CENTERS[state.slug]?.longitude
  });

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Banner ── */}
      <div
        className="detail-hero-banner"
        style={{ backgroundImage: `url(${state.heroImage})`, position: 'relative' }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/states" style={{ color: '#E2E8F0', textDecoration: 'none' }}>States</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{state.name}</span>
          </nav>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tourism-badge badge-earth">
              Priority Rank #{state.priorityRank} in Tourism
            </span>
            <span className="tourism-badge badge-forest">
              Capital: {state.capital}
            </span>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                backdropFilter: 'blur(6px)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '9999px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} />
              Verified State Photography
            </span>
            {state.unescoSites && state.unescoSites.length > 0 && (
              <span className="tourism-badge badge-gold">
                <Award size={12} />
                {state.unescoSites.length} UNESCO Heritage Sites
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, margin: '0 0 0.85rem', letterSpacing: '-0.02em' }}>
            {state.name}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '850px', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
            {state.description}
          </p>

          {/* Action Buttons in Hero Banner (Requirement 4) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* View on Google Maps Button */}
            <a
              href={stateMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
              }}
            >
              <MapPin size={16} />
              <span>View {state.name} on Google Maps</span>
              <ExternalLink size={13} />
            </a>

            {/* Get Directions Button */}
            <button
              type="button"
              onClick={() => setDirectionsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Navigation size={16} color="#38BDF8" />
              <span>Get Directions to {state.capital || state.name}</span>
            </button>

            {/* Gallery Button */}
            {allImages.length > 0 && (
              <button
                onClick={() => openGalleryAt(0)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Maximize2 size={15} />
                <span>Gallery ({allImages.length} photos)</span>
              </button>
            )}
          </div>
        </div>

        {/* Photo Attribution Pill */}
        {(state.imagePhotographer || state.imageSourceName) && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#CBD5E1',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              zIndex: 3
            }}
          >
            <Camera size={11} color="#38BDF8" />
            <span>Photo: {state.imagePhotographer || 'Contributor'} / {state.imageSourceName || 'Unsplash'}</span>
          </div>
        )}
      </div>

      {/* ── 2. Navigation Anchor Bar ── */}
      <div style={{
        position: 'sticky',
        top: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--tourism-sand-border)',
        zIndex: 40,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div className="tourism-container" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.75rem 1.25rem' }}>
          {[
            { id: 'overview', label: 'Overview & Interactive Map' },
            { id: 'cities', label: `Cities (${stateCities.length})` },
            { id: 'attractions', label: `Attractions (${stateAttractions.length})` },
            { id: 'hotels', label: `Hotels & Stays (${stateHotels.length})` },
            { id: 'cuisine', label: 'Food & Delicacies' },
            { id: 'culture', label: 'Culture & Festivals' },
            { id: 'itineraries', label: 'Itineraries' },
            { id: 'transport', label: 'Transport & Travel' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.75rem',
                fontSize: '0.88rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                color: activeTab === tab.id ? 'var(--tourism-earth)' : '#64748B',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--tourism-earth)' : '2.5px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Main State Content ── */}
      <div className="tourism-container" style={{ paddingTop: '2.5rem' }}>

        {/* ── Overview Tab (Includes Interactive Map per Requirement 4) ── */}
        {(activeTab === 'overview' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            {/* Quick Facts Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', marginBottom: '0.35rem' }}>
                  <Calendar size={18} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Best Time to Visit</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  {state.bestTimeToVisit || 'October to March'}
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', marginBottom: '0.35rem' }}>
                  <MapPin size={18} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Urban Centers</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  {stateCities.length} Listed Cities
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', marginBottom: '0.35rem' }}>
                  <Compass size={18} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Key Attractions</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  {stateAttractions.length} Verified Monuments
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D97706', marginBottom: '0.35rem' }}>
                  <Hotel size={18} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>Accommodations</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>
                  {stateHotels.length} Verified Hotels
                </div>
              </div>
            </div>

            {/* ── Interactive Map of State (Requirement 4) ── */}
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="tourism-badge badge-forest">Live Geographical Map</span>
                  <h2 className="tourism-heading" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                    Interactive Map of {state.name} Destinations
                  </h2>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Click any marker to open location card & get direct driving directions
                </span>
              </div>

              <GoogleMapView
                markers={stateMapMarkers}
                center={mapCenter}
                zoom={mapZoom}
                selectedMarkerId={selectedMarkerId}
                onMarkerSelect={(m) => setSelectedMarkerId(m.id)}
                height="500px"
                fitBounds={true}
              />
            </div>

            {/* UNESCO World Heritage Sites */}
            {state.unescoSites && state.unescoSites.length > 0 && (
              <div style={{
                backgroundColor: 'rgba(217, 119, 6, 0.06)',
                border: '1px solid rgba(217, 119, 6, 0.25)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Award size={20} />
                  <span style={{ fontSize: '1.1rem' }}>UNESCO World Heritage Sites in {state.name}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {state.unescoSites.map((site) => (
                    <div
                      key={site}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(217, 119, 6, 0.25)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#0F172A'
                      }}
                    >
                      🏛️ {site}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Cities Tab (Requirement 4) ── */}
        {(activeTab === 'cities' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="tourism-badge badge-forest">Urban & Destination Hubs</span>
                <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                  All Cities & Destinations in {state.name} ({stateCities.length})
                </h2>
              </div>

              {/* City Search & Filter Controls */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder={`Search cities in ${state.name}...`}
                    value={citySearchTerm}
                    onChange={(e) => setCitySearchTerm(e.target.value)}
                    style={{
                      padding: '0.5rem 0.75rem 0.5rem 2rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      minWidth: '220px'
                    }}
                  />
                </div>

                <select
                  value={selectedStyleFilter}
                  onChange={(e) => setSelectedStyleFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600
                  }}
                >
                  <option value="all">All Styles</option>
                  <option value="heritage">Heritage</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="nature">Nature / Hill</option>
                  <option value="beaches">Beaches</option>
                </select>
              </div>
            </div>

            <div className="tourism-grid-3">
              {filteredCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>

            {filteredCities.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <p style={{ color: '#64748B', fontWeight: 600 }}>No cities matched your filter criteria.</p>
                <button
                  type="button"
                  onClick={() => { setCitySearchTerm(''); setSelectedStyleFilter('all'); }}
                  style={{ padding: '0.4rem 1rem', borderRadius: '6px', backgroundColor: '#0F172A', color: '#FFF', border: 'none', cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* ── Attractions Tab ── */}
        {(activeTab === 'attractions' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-earth">Landmarks & Sights</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Iconic Attractions in {state.name} ({stateAttractions.length})
              </h2>
            </div>

            <div className="tourism-grid-4">
              {stateAttractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          </section>
        )}

        {/* ── Hotels & Stays Tab (Requirement 4) ── */}
        {(activeTab === 'hotels' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-sky">Verified Accommodations</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Where to Stay in {state.name} ({stateHotels.length} Stays)
              </h2>
            </div>

            {stateHotels.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}>
                {stateHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <p style={{ color: '#64748B', fontWeight: 600 }}>No verified hotels recorded yet in this state catalog.</p>
              </div>
            )}
          </section>
        )}

        {/* ── Cuisine Tab ── */}
        {(activeTab === 'cuisine' || activeTab === 'all') && state.popularFoods && state.popularFoods.length > 0 && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-earth">Gastronomy</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Culinary Heritage of {state.name}
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {state.popularFoods.map((food, idx) => (
                <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '0.5rem' }}>
                    <Utensils size={16} />
                    <span style={{ fontSize: '1.1rem', color: '#0F172A' }}>{food.name}</span>
                  </div>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem', lineHeight: 1.6 }}>{food.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── State Level Directions Modal ── */}
      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        target={{
          name: `${state.capital || state.name}, ${state.name}`,
          city: state.capital || state.name,
          state: state.name,
          latitude: STATE_CENTERS[state.slug]?.latitude,
          longitude: STATE_CENTERS[state.slug]?.longitude
        }}
      />

      {/* ── Interactive Image Gallery Modal ── */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={allImages}
        initialIndex={activePhotoIndex}
        destinationName={state.name}
        location={`${state.name}, India`}
        photographer={state.imagePhotographer}
        sourceName={state.imageSourceName}
        sourceUrl={state.heroImage}
        license={state.imageLicense}
      />
    </div>
  );
}
