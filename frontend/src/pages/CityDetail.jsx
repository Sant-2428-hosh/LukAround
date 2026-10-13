import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { cities, states, attractions, itineraries } from '../data/indiaTourismData';
import { hotels as allHotels } from '../data/hotelsData';
import AttractionCard from '../components/tourism/AttractionCard';
import SafeImage from '../components/tourism/SafeImage';
import ImageGalleryModal from '../components/tourism/ImageGalleryModal';
import WhereToStaySection from '../components/tourism/WhereToStaySection';
import GoogleMapView from '../components/maps/GoogleMapView';
import DirectionsModal from '../components/tourism/DirectionsModal';
import TouristSafetyDirectory from '../components/safety/TouristSafetyDirectory';
import { buildGoogleMapsSearchUrl, buildGoogleMapsDirectionsUrl } from '../utils/googleMaps';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  PartyPopper,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Camera,
  ShieldCheck,
  Maximize2,
  Navigation,
  ExternalLink,
  Search,
  Filter,
  Hotel,
  Ticket,
  Plane,
  Train,
  Car
} from 'lucide-react';
import {
  parseAirportInfo,
  parseRailwayInfo,
  parseRoadInfo,
  getStateBusPortal,
  STATE_OFFICIAL_BUS_PORTALS
} from '../utils/transitBookingService';

export default function CityDetail() {
  const navigate = useNavigate();
  const { stateSlug, citySlug } = useParams();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Search & Filter state for city attractions
  const [attractionSearch, setAttractionSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // Directions modal
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  const city = useMemo(() => {
    if (!citySlug) return cities[0];
    const target = citySlug.toLowerCase().trim();
    let found = cities.find(c => c.id.toLowerCase() === target);
    if (found) return found;
    found = cities.find(c => c.aliases && c.aliases.some(a => a.toLowerCase().replace(/\s+/g, '-') === target));
    if (found) return found;
    found = cities.find(c => c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === target);
    if (found) return found;
    if (stateSlug) {
      const stateCities = cities.filter(c => c.stateSlug === stateSlug || c.state.toLowerCase() === stateSlug.toLowerCase());
      found = stateCities.find(c => c.id.includes(target) || target.includes(c.id));
      if (found) return found;
    }
    return null;
  }, [citySlug, stateSlug]);

  if (!city) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
        <MapPin size={48} color="#94A3B8" />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>City Not Found</h2>
        <p style={{ color: '#64748B', maxWidth: '420px' }}>The requested city could not be found in our verified database.</p>
        <Link to="/cities" className="tourism-btn tourism-btn-primary" style={{ textDecoration: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', color: '#FFF' }}>
          Explore Verified Cities
        </Link>
      </div>
    );
  }

  const parentState = states.find(s =>
    s.slug === city.stateSlug || s.name.toLowerCase() === (city.state || '').toLowerCase()
  ) || { name: city.state, slug: city.stateSlug };

  const cityAttractions = attractions.filter(a =>
    a.citySlug === city.id ||
    a.city.toLowerCase() === city.name.toLowerCase() ||
    (city.id === 'mathura-vrindavan' && (a.citySlug === 'mathura' || a.citySlug === 'vrindavan')) ||
    (city.topAttractions && city.topAttractions.includes(a.id))
  ).sort((a, b) => {
    if (city.topAttractions) {
      const idxA = city.topAttractions.indexOf(a.id);
      const idxB = city.topAttractions.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
    }
    return (a.priorityRank || 99) - (b.priorityRank || 99);
  });

  const cityHotels = allHotels.filter(h =>
    h.citySlug === city.id || h.city.toLowerCase() === city.name.toLowerCase()
  );

  const allImages = [
    city.heroImage || city.image,
    ...(city.gallery || [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const openGalleryAt = (idx) => {
    setActivePhotoIndex(idx);
    setGalleryOpen(true);
  };

  // Filtered attractions
  const filteredAttractions = useMemo(() => {
    return cityAttractions.filter(a => {
      const matchesSearch = !attractionSearch.trim() ||
        a.name.toLowerCase().includes(attractionSearch.toLowerCase()) ||
        a.shortDescription.toLowerCase().includes(attractionSearch.toLowerCase());

      const matchesType = selectedTypeFilter === 'all' ||
        (a.type && a.type.toLowerCase() === selectedTypeFilter.toLowerCase()) ||
        (a.category && a.category.some(c => c.toLowerCase() === selectedTypeFilter.toLowerCase()));

      return matchesSearch && matchesType;
    });
  }, [cityAttractions, attractionSearch, selectedTypeFilter]);

  // City Map Markers (City Center + Attractions + Hotels)
  const cityMapMarkers = useMemo(() => {
    const list = [];

    // 1. City Center Marker
    if (city.latitude && city.longitude) {
      list.push({
        id: city.id,
        title: `${city.name} (City Center)`,
        latitude: city.latitude,
        longitude: city.longitude,
        type: 'city',
        category: 'City Center',
        city: city.name,
        state: city.state,
        image: city.heroImage || city.image,
        address: `${city.name}, ${city.state}, India`
      });
    }

    // 2. Attraction Markers with verified coordinates
    cityAttractions.forEach(a => {
      const coords = a.coordinates || { latitude: a.latitude, longitude: a.longitude };
      if (coords && coords.latitude && coords.longitude) {
        list.push({
          id: a.id,
          title: a.name,
          latitude: coords.latitude,
          longitude: coords.longitude,
          type: 'attraction',
          category: a.type || 'Attraction',
          city: city.name,
          state: city.state,
          image: a.image,
          address: `${a.name}, ${city.name}, ${city.state}`
        });
      }
    });

    // 3. Hotel Markers with verified coordinates
    cityHotels.slice(0, 15).forEach(h => {
      if (h.latitude && h.longitude) {
        list.push({
          id: h.id,
          title: h.name,
          latitude: h.latitude,
          longitude: h.longitude,
          type: 'hotel',
          category: 'Hotel',
          city: city.name,
          state: city.state,
          address: h.address,
          rating: h.guestRating,
          starCategory: h.starCategory,
          image: h.image,
          website: h.website
        });
      }
    });

    return list;
  }, [city, cityAttractions, cityHotels]);

  // City Transit & Connectivity Information
  const cityTransit = useMemo(() => {
    const words = city.name.toLowerCase().split(/[\s,&/]+/).filter(w => w.length >= 3);
    const stateAirports = parentState?.transportation?.airports || [];
    const stateRailways = parentState?.transportation?.railway || [];
    const stateRoads = parentState?.transportation?.road || [];

    const matchedAirportStr = stateAirports.find(a => words.some(w => new RegExp(`\\b${w}\\b`, 'i').test(a)))
      || stateAirports[0]
      || `${city.name} Domestic Airport`;

    const matchedRailwayStr = stateRailways.find(r => words.some(w => new RegExp(`\\b${w}\\b`, 'i').test(r)))
      || stateRailways[0]
      || `${city.name} Railway Junction`;

    const matchedRoadStr = stateRoads[0] || `National Highway Connecting ${city.name}`;

    const airport = parseAirportInfo(matchedAirportStr, city.state || parentState?.name || '');
    const railway = parseRailwayInfo(matchedRailwayStr, city.state || parentState?.name || '');
    const road = parseRoadInfo(matchedRoadStr, city.stateSlug || parentState?.slug || '', city.state || parentState?.name || '');
    const officialRtc = getStateBusPortal(city.stateSlug || parentState?.slug || '');

    return {
      airport,
      railway,
      road,
      officialRtc
    };
  }, [city, parentState]);

  const mapCenter = useMemo(() => {
    if (city.latitude && city.longitude) {
      return { lat: city.latitude, lng: city.longitude };
    }
    return { lat: 20.5937, lng: 78.9629 };
  }, [city]);

  const cityMapsUrl = buildGoogleMapsSearchUrl(city);

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Banner ── */}
      <div
        className="detail-hero-banner"
        style={{
          backgroundImage: `url(${city.heroImage || city.image})`,
          position: 'relative'
        }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Return to where you left off"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#CBD5E1', flexWrap: 'wrap' }}>
              <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
              <ChevronRight size={13} />
              <Link to="/states" style={{ color: '#E2E8F0', textDecoration: 'none' }}>States</Link>
              <ChevronRight size={13} />
              <Link to={`/india/${parentState.slug}`} style={{ color: '#E2E8F0', textDecoration: 'none' }}>{parentState.name}</Link>
              <ChevronRight size={13} />
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{city.name}</span>
            </nav>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tourism-badge badge-forest">
              {city.state}
            </span>
            <span className="tourism-badge badge-earth">
              <Clock size={12} />
              {city.recommendedDays || 2} Days Recommended
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
              Verified City Photography
            </span>
            {city.aliases && city.aliases.length > 0 && (
              <span className="tourism-badge badge-sky">
                Also Known As: {city.aliases[0]}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900, margin: '0 0 0.85rem' }}>
            {city.name}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '800px', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
            {city.description}
          </p>

          {/* Action Buttons in Hero Banner (Requirement 5) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* View City on Google Maps Button */}
            <a
              href={cityMapsUrl}
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
              <span>View {city.name} on Google Maps</span>
              <ExternalLink size={13} />
            </a>

            {/* Get Directions to City Center Button */}
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
              <span>Get Directions to {city.name}</span>
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

            {/* Safety & Emergency Anchor Button */}
            <a
              href="#city-tourist-safety"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(239, 68, 68, 0.55)',
                color: '#FCA5A5',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={16} color="#EF4444" />
              <span>Tourist Safety & Emergency</span>
            </a>
          </div>
        </div>

        {/* Photo Attribution Pill */}
        {(city.imagePhotographer || city.imageSourceName) && (
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
            <span>Photo: {city.imagePhotographer || 'Contributor'} / {city.imageSourceName || 'Wikimedia Commons'}</span>
          </div>
        )}
      </div>

      <div className="tourism-container" style={{ paddingTop: '3rem' }}>
        {/* Quick Meta Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-earth)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Best Season
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {city.bestTimeToVisit || 'October to March'}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-forest)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Recommended Stay
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {city.recommendedDays || 2} Days / {Math.max((city.recommendedDays || 2) - 1, 1)} Nights
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-sky)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Attractions in City
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {cityAttractions.length} Verified Monuments
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Travel Styles
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
              {(city.travelStyles || []).map((style) => (
                <span
                  key={style}
                  style={{
                    backgroundColor: 'var(--tourism-sand)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: '#334155'
                  }}
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Interactive Google Map of City Attractions & Stays (Requirement 5) ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span className="tourism-badge badge-forest">Geographical Overview</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                Interactive Map of {city.name} Attractions
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Markers indicate exact verified attraction & hotel coordinates
            </span>
          </div>

          <GoogleMapView
            markers={cityMapMarkers}
            center={mapCenter}
            zoom={13}
            selectedMarkerId={selectedMarkerId}
            onMarkerSelect={(m) => setSelectedMarkerId(m.id)}
            height="480px"
            fitBounds={true}
          />
        </section>

        {/* ── Key Attractions in this City (Requirement 5) ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="tourism-badge badge-earth">Explore the Highlights</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Top Attractions in {city.name} ({cityAttractions.length})
              </h2>
            </div>

            {/* Search & Filter Controls */}
            {cityAttractions.length > 3 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search attractions..."
                    value={attractionSearch}
                    onChange={(e) => setAttractionSearch(e.target.value)}
                    style={{
                      padding: '0.45rem 0.75rem 0.45rem 2rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  style={{
                    padding: '0.45rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 600
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="heritage">Heritage</option>
                  <option value="spiritual">Spiritual</option>
                  <option value="nature">Nature</option>
                </select>
              </div>
            )}
          </div>

          <div className="tourism-grid-3">
            {filteredAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>

          {filteredAttractions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
              <p style={{ color: '#64748B', fontWeight: 600 }}>No attractions found matching your search.</p>
            </div>
          )}
        </section>

        {/* ── Authentic City Photo Gallery ── */}
        {allImages.length > 1 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span className="tourism-badge badge-forest">Real Imagery</span>
                <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                  {city.name} Photographic Highlights
                </h2>
              </div>
              <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={15} color="#10B981" />
                Verified Landmarks
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              {allImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => openGalleryAt(idx)}
                  style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden' }}
                >
                  <SafeImage
                    src={imgUrl}
                    alt={`${city.name} view ${idx + 1}`}
                    aspectRatio="4:3"
                    verified={true}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Things To Do ── */}
        {city.thingsToDo && city.thingsToDo.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="tourism-badge badge-forest">Curated Experiences</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Things to Do in {city.name}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {city.thingsToDo.map((activity, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.1rem 1.25rem',
                    border: '1px solid var(--tourism-sand-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <CheckCircle2 size={18} color="var(--tourism-forest)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.5 }}>
                    {activity}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Shopping & Festivals Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>

          {/* Shopping */}
          {city.shopping && city.shopping.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--tourism-sand-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', fontWeight: 800, marginBottom: '1rem' }}>
                <ShoppingBag size={18} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0 }}>Local Shopping & Crafts</h3>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {city.shopping.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Festivals */}
          {city.festivals && city.festivals.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--tourism-sand-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, marginBottom: '1rem' }}>
                <PartyPopper size={18} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0 }}>Celebrations & Festivals</h3>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {city.festivals.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Verified Accommodations in this City ── */}
        <WhereToStaySection
          destination={{
            id: city.id,
            name: city.name,
            city: city.name,
            state: city.state,
            coordinates: { latitude: city.latitude, longitude: city.longitude }
          }}
          city={city}
        />

        {/* ── Official Travel Connectivity & Ticket Booking Desk ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <span className="tourism-badge badge-forest">Direct Travel & Connectivity</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                How to Reach {city.name} & Official Ticket Desk
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Direct access to IRCTC Indian Railways, State Govt RTC, Google Flights & ASI Monument Tickets
            </span>
          </div>

          {/* Quick Desk Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            color: '#FFFFFF',
            marginBottom: '1.75rem',
            boxShadow: '0 4px 15px rgba(15, 23, 42, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38BDF8'
                }}>
                  <Ticket size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                    Official Transit & Monument Booking Desk for {city.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '0.15rem 0 0' }}>
                    Government e-ticketing portals, IRCTC train booking, state buses & ASI entry permits
                  </p>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#38BDF8',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                Verified Portals
              </span>
            </div>

            {/* 4 Official Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.85rem'
            }}>
              {/* 1. IRCTC */}
              <a
                href="https://www.irctc.co.in/nget/train-search"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Train size={18} color="#38BDF8" />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>IRCTC Indian Railways</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Official e-Ticketing Portal</div>
                  </div>
                </div>
                <ExternalLink size={13} color="#94A3B8" />
              </a>

              {/* 2. Official State RTC */}
              <a
                href={cityTransit.officialRtc?.url || `https://www.redbus.in/bus-tickets/${encodeURIComponent((parentState?.slug || 'india'))}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Car size={18} color="#10B981" />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>
                      {cityTransit.officialRtc?.code || 'State RTC'} Govt Buses
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      {cityTransit.officialRtc?.badge || 'Official State Bus'}
                    </div>
                  </div>
                </div>
                <ExternalLink size={13} color="#94A3B8" />
              </a>

              {/* 3. Google Flights */}
              <a
                href={cityTransit.airport?.googleFlightsUrl || `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(`${city.name} ${city.state}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Plane size={18} color="#60A5FA" />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>Google Flights</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Fares to {city.name}</div>
                  </div>
                </div>
                <ExternalLink size={13} color="#94A3B8" />
              </a>

              {/* 4. ASI Monument Tickets */}
              <a
                href="https://asi.payumoney.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Ticket size={18} color="#F59E0B" />
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>ASI Monument Tickets</div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Official Archaeological Entry</div>
                  </div>
                </div>
                <ExternalLink size={13} color="#94A3B8" />
              </a>
            </div>
          </div>

          {/* 3 Detailed Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '1.25rem'
          }}>
            {/* 1. Airport */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--tourism-sand-border)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', fontSize: '0.9rem', fontWeight: 900 }}>
                  <Plane size={18} />
                  <span>Aviation Gateway</span>
                </div>
                {cityTransit.airport?.code && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: '#0F172A', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>
                    {cityTransit.airport.code}
                  </span>
                )}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  {cityTransit.airport?.name || `${city.name} Domestic Terminal`}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                  Serving {city.name} & surrounding region with direct and connecting flights
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                <a
                  href={cityTransit.airport?.googleFlightsUrl || `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'var(--tourism-sky)',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Book Flights</span>
                  <ExternalLink size={11} />
                </a>
                <a
                  href={cityTransit.airport?.liveStatusUrl || `https://www.google.com/search?q=${encodeURIComponent(`${city.name} flight schedule`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#475569',
                    backgroundColor: '#F1F5F9',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Flight Status</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* 2. Railway */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--tourism-sand-border)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontSize: '0.9rem', fontWeight: 900 }}>
                  <Train size={18} />
                  <span>Indian Railways Station</span>
                </div>
                {cityTransit.railway?.code && (
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, backgroundColor: 'var(--tourism-earth)', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '5px' }}>
                    {cityTransit.railway.code}
                  </span>
                )}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  {cityTransit.railway?.name || `${city.name} Railway Station`}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                  Halts for Superfast, Express, and Vande Bharat trains across the Indian rail network
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                <a
                  href="https://www.irctc.co.in/nget/train-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'var(--tourism-earth)',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Book on IRCTC Official</span>
                  <ExternalLink size={11} />
                </a>
                <a
                  href={cityTransit.railway?.liveTrainUrl || `https://www.railyatri.in/live-train-status?station=${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#475569',
                    backgroundColor: '#F1F5F9',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Live Trains</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>

            {/* 3. Road & Bus */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--tourism-sand-border)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', fontSize: '0.9rem', fontWeight: 900 }}>
                  <Car size={18} />
                  <span>State RTC & Expressways</span>
                </div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#059669', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                  {cityTransit.officialRtc?.code || 'State RTC'}
                </span>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0' }}>
                  {cityTransit.officialRtc?.fullName || `${city.state} State Transport`}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                  Regular deluxe, AC sleeper, and government buses connecting {city.name} to major districts
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                <a
                  href={cityTransit.officialRtc?.url || 'https://www.redbus.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    backgroundColor: 'var(--tourism-forest)',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>Book Govt Bus ({cityTransit.officialRtc?.code || 'RTC'})</span>
                  <ExternalLink size={11} />
                </a>
                <a
                  href={`https://www.redbus.in/bus-tickets/${encodeURIComponent(city.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: '#475569',
                    backgroundColor: '#F1F5F9',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <span>RedBus</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Tourist Safety & Emergency Services Section (Master Prompt Requirement) ── */}
        <div id="city-tourist-safety" style={{ marginBottom: '4rem' }}>
          <TouristSafetyDirectory
            initialCity={city.name}
            initialState={city.state}
            isEmbedded={true}
            showHeader={false}
          />
        </div>

        {/* ── Nearby Destinations ── */}
        {city.nearbyDestinations && city.nearbyDestinations.length > 0 && (
          <section style={{
            backgroundColor: 'var(--tourism-sand-light)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--tourism-sand-border)',
            marginBottom: '4rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              Nearby Destinations from {city.name}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {city.nearbyDestinations.map((dest, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--tourism-sand-border)',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#334155'
                  }}
                >
                  🚗 {dest}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── City Level Directions Modal ── */}
      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        target={city}
      />

      {/* ── Interactive Image Gallery Modal ── */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={allImages}
        initialIndex={activePhotoIndex}
        destinationName={city.name}
        location={`${city.name}, ${city.state}`}
        photographer={city.imagePhotographer}
        sourceName={city.imageSourceName}
        sourceUrl={city.imageSource}
        license={city.imageLicense}
      />
    </div>
  );
}
