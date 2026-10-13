import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
import TouristSafetyDirectory from '../components/safety/TouristSafetyDirectory';
import { buildGoogleMapsSearchUrl, STATE_CENTERS } from '../utils/googleMaps';
import {
  STATE_OFFICIAL_BUS_PORTALS,
  OFFICIAL_TRAVEL_PORTALS,
  parseAirportInfo,
  parseRailwayInfo,
  parseRoadInfo
} from '../utils/transitBookingService';
import {
  MapPin,
  Calendar,
  Award,
  Plane,
  Train,
  Car,
  PartyPopper,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
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
  Hotel,
  Clock,
  Ticket
} from 'lucide-react';

export default function StateDetail() {
  const navigate = useNavigate();
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
  const stateAttractions = attractions
    .filter(a => a.stateSlug === state.slug || a.state === state.name)
    .sort((a, b) => (a.priorityRank || 99) - (b.priorityRank || 99));
  const stateItineraries = itineraries.filter(i => i.state === state.name);
  const stateHotels = allHotels.filter(h => h.state.toLowerCase() === state.name.toLowerCase());

  // Location-verified itineraries (curated or state-specific dynamic circuits)
  const effectiveItineraries = useMemo(() => {
    if (stateItineraries.length > 0) return stateItineraries;

    const topCitiesList = stateCities.slice(0, 3);
    const topAttrsList = stateAttractions.slice(0, 6);
    const primaryCity = topCitiesList[0]?.name || state.capital || state.name;
    const secondaryCity = topCitiesList[1]?.name || topCitiesList[0]?.name || state.name;

    return [
      {
        id: `${state.slug}-highlights-3d`,
        title: `3 Days Highlights of ${state.name}: ${primaryCity} & Heritage Trail`,
        state: state.name,
        destination: `${primaryCity} & Cultural Circuit`,
        durationDays: 3,
        travelStyle: 'heritage',
        budget: 'moderate',
        heroImage: topAttrsList[0]?.image || state.heroImage,
        summary: `Experience the finest landmarks, royal architecture, living traditions, and authentic cuisine of ${state.name} in this compact 3-day circuit.`,
        days: [
          {
            dayNumber: 1,
            title: `Arrival & Iconic Landmarks of ${primaryCity}`,
            morning: `Explore ${topAttrsList[0]?.name || primaryCity + ' Central Heritage Site'} and study classic regional architecture.`,
            afternoon: `Visit ${topAttrsList[1]?.name || primaryCity + ' Cultural Quarter'}; savor authentic ${state.popularFoods?.[0]?.name || 'local regional cuisine'}.`,
            evening: `Stroll through vibrant evening bazaars and enjoy sunset vistas over the city.`
          },
          {
            dayNumber: 2,
            title: `Historic Shrines & Royal Architecture`,
            morning: `Early morning excursion to ${topAttrsList[2]?.name || 'Historic District'}; admire intricate stone carvings.`,
            afternoon: `Tour local handicraft centers and museum archives; sample ${state.popularFoods?.[1]?.name || 'traditional delicacies'}.`,
            evening: `Evening cultural performance or lakeside sunset walk.`
          },
          {
            dayNumber: 3,
            title: `Scenic Landscapes & Cultural Departure`,
            morning: `Excursion to ${topAttrsList[3]?.name || 'Scenic Viewpoint'} for panoramic photography.`,
            afternoon: `Last-minute souvenir shopping for local textiles and GI-tagged crafts in the artisan quarter.`,
            evening: `Farewell dinner featuring ${state.popularFoods?.[2]?.name || 'regional banquet dishes'} before transit hub transfer.`
          }
        ]
      },
      {
        id: `${state.slug}-grand-circuit-5d`,
        title: `5 Days Grand Exploration: ${primaryCity}, ${secondaryCity} & Nature Escapes`,
        state: state.name,
        destination: `${primaryCity}, ${secondaryCity}`,
        durationDays: 5,
        travelStyle: 'discovery',
        budget: 'moderate',
        heroImage: topAttrsList[1]?.image || topCitiesList[0]?.heroImage || state.heroImage,
        summary: `A comprehensive 5-day journey taking you through imperial palaces, sacred shrines, rural craft villages, and scenic wonders across ${state.name}.`,
        days: [
          {
            dayNumber: 1,
            title: `Urban Heritage in ${primaryCity}`,
            morning: `Tour ${topAttrsList[0]?.name || 'Central Fort & Palace'} with a verified local guide.`,
            afternoon: `Savor culinary specialties including ${state.popularFoods?.[0]?.name || 'traditional lunch'} at heritage eateries.`,
            evening: `Evening walk through old city lanes and traditional spice markets.`
          },
          {
            dayNumber: 2,
            title: `Spiritual & Architectural Marvels`,
            morning: `Visit sacred shrines and world-renowned monuments (${topAttrsList[1]?.name || 'Spiritual Complex'}).`,
            afternoon: `Visit artisan workshops and explore regional textile weaving traditions.`,
            evening: `Sunset views and peaceful evening prayers.`
          },
          {
            dayNumber: 3,
            title: `Transit to ${secondaryCity}`,
            morning: `Scenic road trip or express train to ${secondaryCity}, observing rural scenery.`,
            afternoon: `Check into your stay; explore ${topAttrsList[2]?.name || secondaryCity + ' Central Sights'}.`,
            evening: `Taste authentic street food specialties and night bazaars in ${secondaryCity}.`
          },
          {
            dayNumber: 4,
            title: `Nature & Scenic Landscapes`,
            morning: `Early morning nature trail or wildlife safari in the regional reserve.`,
            afternoon: `Visit scenic lakes or mountain passes with breathtaking viewpoints.`,
            evening: `Relaxing dinner and stargazing at your resort.`
          },
          {
            dayNumber: 5,
            title: `Artisanal Crafts & Departure`,
            morning: `Visit local craft emporiums for certified GI products.`,
            afternoon: `Final photography session and celebration lunch.`,
            evening: `Transfer to transit hub for departure flight or train.`
          }
        ]
      }
    ];
  }, [stateItineraries, stateCities, stateAttractions, state]);

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
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{state.name}</span>
            </nav>
          </div>

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

            {/* Tourist Safety & Emergency Services Button */}
            <button
              type="button"
              onClick={() => setActiveTab('safety')}
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
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={16} color="#EF4444" />
              <span>Tourist Safety & Emergency</span>
            </button>
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
            { id: 'culture', label: 'Culture & Festivals' },
            { id: 'itineraries', label: 'Itineraries' },
            { id: 'transport', label: 'Transport & Travel' },
            { id: 'safety', label: '🛡️ Tourist Safety & Emergency' }
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

        {/* ── 2. Culture & Festivals Tab ── */}
        {(activeTab === 'culture' || activeTab === 'all') && (
          <section id="state-culture-festivals" style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="tourism-badge badge-forest" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <PartyPopper size={13} />
                <span>Heritage & Living Traditions</span>
              </span>
              <h2 className="tourism-heading" style={{ fontSize: '1.9rem', marginTop: '0.4rem', color: '#0F172A' }}>
                Culture, Living Arts & Grand Festivals of {state.name}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0.3rem 0 0', maxWidth: '820px', lineHeight: 1.6 }}>
                Explore centuries-old classical dance forms, sacred spiritual gatherings, indigenous folklore, world heritage monuments, and master artisanal craft guilds.
              </p>
            </div>

            {/* Cultural Tapestry Hero Card */}
            {state.culture && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(200,90,50,0.06) 0%, rgba(13,148,136,0.07) 100%)',
                border: '1px solid var(--tourism-sand-border)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2.5rem',
                boxShadow: 'var(--shadow-subtle)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <Sparkles size={16} />
                  <span>Cultural Soul & Classical Heritage</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.85rem 0' }}>
                  Living Traditions of {state.name}
                </h3>
                <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: 1.8, margin: 0, maxWidth: '960px' }}>
                  {state.culture}
                </p>

                {/* Categories / Highlights Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
                  {(state.categories || []).map((cat, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--tourism-sand-border)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        textTransform: 'capitalize'
                      }}
                    >
                      ✦ {cat} Heritage
                    </span>
                  ))}
                  {state.unescoSites && state.unescoSites.length > 0 && (
                    <span
                      style={{
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: '#1D4ED8',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 800
                      }}
                    >
                      🏛️ {state.unescoSites.length} UNESCO World Heritage Sites
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Grand Annual Festivals Grid */}
            {state.festivals && state.festivals.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                      Grand Annual Festivals ({state.festivals.length} Major Celebrations)
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0.2rem 0 0' }}>
                      Color, devotion, classical rituals and folk spectacles celebrated annually
                    </p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--tourism-forest)', fontWeight: 800, backgroundColor: 'rgba(13,148,136,0.1)', padding: '0.3rem 0.75rem', borderRadius: '9999px' }}>
                    📅 Verified Festival Calendar
                  </span>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem'
                }}>
                  {state.festivals.map((fest, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid var(--tourism-sand-border)',
                        padding: '1.4rem',
                        boxShadow: 'var(--shadow-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-floating)';
                        e.currentTarget.style.borderColor = 'var(--tourism-forest)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                        e.currentTarget.style.borderColor = 'var(--tourism-sand-border)';
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <span style={{
                            backgroundColor: 'rgba(13,148,136,0.1)',
                            color: 'var(--tourism-forest)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <Calendar size={11} />
                            <span>Annual Celebration</span>
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                            {state.bestTimeToVisit || 'Seasonal'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                          {fest.name}
                        </h4>

                        <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                          {fest.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>
                          Public & Tourist Access
                        </span>
                        <Link
                          to={`/search?q=${encodeURIComponent(`${fest.name} ${state.name}`)}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            color: 'var(--tourism-forest)',
                            textDecoration: 'none'
                          }}
                        >
                          <span>Explore Celebration</span>
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UNESCO World Heritage & Historic Landmarks in State */}
            {state.unescoSites && state.unescoSites.length > 0 && (
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--tourism-sand-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <Landmark size={15} />
                  <span>UNESCO World Heritage Recognition</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.85rem 0' }}>
                  World Heritage Monuments in {state.name}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {state.unescoSites.map((site, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        padding: '0.5rem 0.95rem',
                        borderRadius: '8px',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <Award size={14} color="#D97706" />
                      <span>{site}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── 3. Itineraries Tab ── */}
        {(activeTab === 'itineraries' || activeTab === 'all') && (
          <section id="state-itineraries" style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="tourism-badge badge-earth" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} />
                <span>Curated Multi-Day Routes</span>
              </span>
              <h2 className="tourism-heading" style={{ fontSize: '1.9rem', marginTop: '0.4rem', color: '#0F172A' }}>
                Recommended Travel Itineraries for {state.name}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0.3rem 0 0', maxWidth: '820px', lineHeight: 1.6 }}>
                Step-by-step day-by-day travel circuits designed to balance sightseeing, cultural depth, and comfortable transit.
              </p>
            </div>

            {/* Itineraries List with Day-by-Day Journey Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
              {effectiveItineraries.map((itin) => (
                <div
                  key={itin.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid var(--tourism-sand-border)',
                    boxShadow: 'var(--shadow-subtle)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Top Banner Row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    borderBottom: '1px solid var(--tourism-sand-border)'
                  }}>
                    <div style={{ position: 'relative', minHeight: '260px', height: '100%', overflow: 'hidden' }}>
                      <SafeImage
                        src={itin.heroImage || itin.image}
                        alt={itin.title}
                        category="heritage"
                        verified={true}
                        style={{ width: '100%', height: '100%', minHeight: '260px', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.76rem',
                        fontWeight: 800
                      }}>
                        {itin.durationDays} Days / {itin.durationDays - 1} Nights
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(200,90,50,0.92)',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'capitalize'
                      }}>
                        {itin.travelStyle} Style • {itin.budget} Budget
                      </div>
                    </div>

                    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tourism-earth)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                          <MapPin size={14} />
                          <span>{itin.destination || state.name}</span>
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', margin: '0 0 0.65rem 0', lineHeight: 1.35 }}>
                          {itin.title}
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                          {itin.summary}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>
                          Includes Morning, Afternoon & Evening Schedule
                        </span>

                        <Link
                          to="/planner"
                          state={{ selectedItinerary: itin, selectedState: state }}
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
                            textDecoration: 'none',
                            boxShadow: '0 4px 12px rgba(200,90,50,0.25)'
                          }}
                        >
                          <span>Open in AI Trip Planner</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Day-by-Day Timeline */}
                  {itin.days && itin.days.length > 0 && (
                    <div style={{ padding: '1.75rem', backgroundColor: '#FAFAFA' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={16} color="var(--tourism-earth)" />
                        <span>Day-by-Day Journey Timeline</span>
                      </h4>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                        {itin.days.map((day) => (
                          <div
                            key={day.dayNumber}
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '14px',
                              border: '1px solid #E2E8F0',
                              padding: '1.15rem',
                              display: 'flex',
                              flexDirection: 'column',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                              <span style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--tourism-earth)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 900
                              }}>
                                {day.dayNumber}
                              </span>
                              <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                                {day.title}
                              </h5>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5, marginTop: '0.25rem' }}>
                              {day.morning && (
                                <div>
                                  <strong style={{ color: 'var(--tourism-earth)' }}>🌅 Morning: </strong>
                                  {day.morning}
                                </div>
                              )}
                              {day.afternoon && (
                                <div>
                                  <strong style={{ color: '#D97706' }}>☀️ Afternoon: </strong>
                                  {day.afternoon}
                                </div>
                              )}
                              {day.evening && (
                                <div>
                                  <strong style={{ color: '#4F46E5' }}>🌙 Evening: </strong>
                                  {day.evening}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Trip Planner CTA Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: 'var(--shadow-floating)'
            }}>
              <div>
                <span style={{ color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Personalized Itinerary Engine
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: '0.35rem 0 0.4rem 0' }}>
                  Want a Custom Multi-Day Trip to {state.name}?
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
                  Select your duration, companion type, preferred travel budget, and favorite attractions. Our AI engine generates an optimized route with real-time driving distances and hotel stays.
                </p>
              </div>

              <Link
                to="/planner"
                state={{ selectedState: state }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--tourism-earth)',
                  color: '#FFFFFF',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(200,90,50,0.4)'
                }}
              >
                <Sparkles size={16} />
                <span>Generate AI Itinerary</span>
              </Link>
            </div>
          </section>
        )}

        {/* ── 4. Transport & Travel Logistics Tab ── */}
        {(activeTab === 'transport' || activeTab === 'all') && (
          <section id="state-transport-logistics" style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <span className="tourism-badge badge-sky" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Plane size={13} />
                <span>Connectivity & Logistics</span>
              </span>
              <h2 className="tourism-heading" style={{ fontSize: '1.9rem', marginTop: '0.4rem', color: '#0F172A' }}>
                Transport, Travel & Connectivity in {state.name}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748B', margin: '0.3rem 0 0', maxWidth: '820px', lineHeight: 1.6 }}>
                Verified airport terminals, major railway junctions, expressway corridors, local commuting guides, and travel seasons.
              </p>
            </div>

            {/* Official Indian Transit Ticket Booking Desk */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              borderRadius: '18px',
              padding: '1.5rem 1.75rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-floating)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Ticket size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                      Official Indian Transit & Ticket Booking Desk
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: '0.2rem 0 0' }}>
                      Direct booking portals for Indian Railways (IRCTC), State Govt RTC Buses, and live commercial flights
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34D399', backgroundColor: 'rgba(52, 211, 153, 0.15)', padding: '0.3rem 0.75rem', borderRadius: '9999px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  ✓ Official Government & Verified Portals
                </span>
              </div>

              {/* 4 Quick Booking Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
                {/* 1. IRCTC Trains */}
                <a
                  href="https://www.irctc.co.in/nget/train-search"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'; e.currentTarget.style.borderColor = 'var(--tourism-earth)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Train size={18} color="var(--tourism-earth)" />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>IRCTC Indian Railways</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Official e-Ticketing Portal</div>
                    </div>
                  </div>
                  <ExternalLink size={13} color="#94A3B8" />
                </a>

                {/* 2. Official State RTC Buses */}
                <a
                  href={(STATE_OFFICIAL_BUS_PORTALS[state.slug] || {}).url || `https://www.redbus.in/bus-tickets/${encodeURIComponent(state.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'; e.currentTarget.style.borderColor = 'var(--tourism-forest)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Car size={18} color="var(--tourism-forest)" />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>
                        {(STATE_OFFICIAL_BUS_PORTALS[state.slug] || {}).name || `${state.name} RTC`}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>State Govt Bus Booking</div>
                    </div>
                  </div>
                  <ExternalLink size={13} color="#94A3B8" />
                </a>

                {/* 3. Google Flights */}
                <a
                  href={`https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(state.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'; e.currentTarget.style.borderColor = 'var(--tourism-sky)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Plane size={18} color="var(--tourism-sky)" />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>Google Flights</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Live Fare Search to {state.name}</div>
                    </div>
                  </div>
                  <ExternalLink size={13} color="#94A3B8" />
                </a>

                {/* 4. MakeMyTrip Air & Intercity */}
                <a
                  href="https://www.makemytrip.com/flights/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)'; e.currentTarget.style.borderColor = '#F59E0B'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Compass size={18} color="#F59E0B" />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800 }}>MakeMyTrip Travel</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Flights, Trains & Cabs</div>
                    </div>
                  </div>
                  <ExternalLink size={13} color="#94A3B8" />
                </a>
              </div>
            </div>

            {/* 3-Column Connectivity Cards with Direct Booking Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              {/* 1. Flight / Airports */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--tourism-sand-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', fontSize: '0.92rem', fontWeight: 900 }}>
                    <Plane size={20} />
                    <span>Airports & Flight Hubs</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {(state.transportation?.airports || []).length} Terminals
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  Domestic & international aviation terminals connecting {state.name} to major Indian metros:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {(state.transportation?.airports || [
                    `${state.capital || state.name} International Airport`,
                    `Regional Domestic Terminals across ${state.name}`
                  ]).map((ap, idx) => {
                    const airport = parseAirportInfo(ap, state.name);
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Airport Title & IATA Code */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <CheckCircle2 size={14} color="var(--tourism-sky)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                              {airport?.name || ap}
                            </span>
                          </div>
                          {airport?.code && (
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: '#0F172A',
                              color: '#FFFFFF',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '6px',
                              letterSpacing: '0.04em',
                              flexShrink: 0
                            }}>
                              {airport.code}
                            </span>
                          )}
                        </div>

                        {/* Interactive Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                          <a
                            href={airport?.googleFlightsUrl || `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(ap)}`}
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
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              textDecoration: 'none'
                            }}
                            title="Compare live airfares and book tickets on Google Flights"
                          >
                            <span>Book Flights</span>
                            <ExternalLink size={11} />
                          </a>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <a
                              href={airport?.liveStatusUrl || `https://www.google.com/search?q=${encodeURIComponent(`${ap} flight arrivals departures schedule`)}`}
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
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                              }}
                              title="Track live flight arrivals and departures"
                            >
                              <span>Live Status</span>
                              <ExternalLink size={10} />
                            </a>

                            <a
                              href={airport?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ap} Terminal`)}`}
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
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                              }}
                              title="View airport location on Google Maps"
                            >
                              <MapPin size={11} color="var(--tourism-earth)" />
                              <span>Map</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Railway Hubs */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--tourism-sand-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontSize: '0.92rem', fontWeight: 900 }}>
                    <Train size={20} />
                    <span>Major Railway Junctions</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {(state.transportation?.railway || []).length} Stations
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  Key Indian Railways junctions, Vande Bharat, Rajdhani & Shatabdi Express halts:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {(state.transportation?.railway || [
                    `${state.capital || state.name} Central Junction`,
                    `Major Divisional Railway Terminals`
                  ]).map((rw, idx) => {
                    const railway = parseRailwayInfo(rw, state.name);
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Station Title & Code */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <CheckCircle2 size={14} color="var(--tourism-earth)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                              {railway?.name || rw}
                            </span>
                          </div>
                          {railway?.code && (
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              backgroundColor: 'var(--tourism-earth)',
                              color: '#FFFFFF',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '6px',
                              letterSpacing: '0.04em',
                              flexShrink: 0
                            }}>
                              {railway.code}
                            </span>
                          )}
                        </div>

                        {/* Interactive Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                          <a
                            href={railway?.irctcUrl || 'https://www.irctc.co.in/nget/train-search'}
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
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              textDecoration: 'none'
                            }}
                            title="Book train tickets on official Indian Railways portal (IRCTC)"
                          >
                            <span>Book on IRCTC Official</span>
                            <ExternalLink size={11} />
                          </a>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <a
                              href={railway?.liveTrainUrl || `https://www.railyatri.in/live-train-status?station=${encodeURIComponent(rw)}`}
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
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                              }}
                              title="Check live train running status & platform"
                            >
                              <span>Live Trains</span>
                              <ExternalLink size={10} />
                            </a>

                            <a
                              href={railway?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rw} Railway Station`)}`}
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
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                              }}
                              title="View station location on Google Maps"
                            >
                              <MapPin size={11} color="var(--tourism-earth)" />
                              <span>Map</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Road & Expressways */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--tourism-sand-border)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-subtle)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', fontSize: '0.92rem', fontWeight: 900 }}>
                    <Car size={20} />
                    <span>Expressways & Road Transit</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', backgroundColor: '#F1F5F9', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {(state.transportation?.road || []).length} Corridors
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                  National Highways (NH), State Expressways, and inter-city bus connectivity:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                  {(state.transportation?.road || [
                    `National Highways connecting ${state.name}`,
                    `State Road Transport Corporation (RTC) Bus Network`
                  ]).map((rd, idx) => {
                    const road = parseRoadInfo(rd, state.slug, state.name);
                    return (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.65rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Highway / Road Title */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <CheckCircle2 size={14} color="var(--tourism-forest)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                              {road?.name || rd}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px',
                            border: '1px solid #A7F3D0',
                            flexShrink: 0
                          }}>
                            {road?.officialRtc?.code || 'RTC Highway'}
                          </span>
                        </div>

                        {/* Interactive Action Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                          <a
                            href={road?.rtcUrl || 'https://www.redbus.in'}
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
                              padding: '0.35rem 0.7rem',
                              borderRadius: '6px',
                              textDecoration: 'none'
                            }}
                            title={`Book official government bus on ${road?.officialRtc?.fullName || 'State RTC'}`}
                          >
                            <span>Book Govt Bus ({road?.officialRtc?.code || 'RTC'})</span>
                            <ExternalLink size={11} />
                          </a>

                          <div style={{ display: 'flex', gap: '0.35rem' }}>
                            <a
                              href={road?.redBusUrl || 'https://www.redbus.in'}
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
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                              }}
                              title="Book AC / Volvo private and RTC buses on RedBus"
                            >
                              <span>RedBus</span>
                              <ExternalLink size={10} />
                            </a>

                            <a
                              href={road?.mapsRouteUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rd} in ${state.name}`)}`}
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
                                padding: '0.35rem 0.55rem',
                                borderRadius: '6px',
                                textDecoration: 'none'
                              }}
                              title="Inspect highway route, tolls and driving distance on Google Maps"
                            >
                              <Navigation size={11} color="var(--tourism-forest)" />
                              <span>Route</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Local Commuting Tips & Best Season Guidelines */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2.5rem'
            }}>
              {/* Commuting Advice */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--tourism-sand-border)',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  <Compass size={16} color="var(--tourism-earth)" />
                  <span>Local Commuting & Intra-City Travel</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#475569', lineHeight: 1.8 }}>
                  <li><strong>App Cabs & Taxis:</strong> Ola and Uber are widely available across major municipal cities and transit hubs.</li>
                  <li><strong>Auto-Rickshaws:</strong> Convenient for short urban hops; agree on meter fare or prepaid booth rates at railway stations.</li>
                  <li><strong>State RTC Buses:</strong> Government-operated deluxe AC and Volvo bus services connect district headquarters and tourist towns.</li>
                  <li><strong>Car Rentals:</strong> Chauffeur-driven tourist cabs are the most convenient for multi-city palace and temple circuits.</li>
                </ul>
              </div>

              {/* Season & Best Time Advice */}
              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--tourism-sand-border)',
                borderRadius: '16px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A', fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  <Calendar size={16} color="var(--tourism-forest)" />
                  <span>Best Visiting Season & Climate ({state.bestTimeToVisit})</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7, margin: '0 0 0.75rem 0' }}>
                  <strong>Peak Season ({state.bestTimeToVisit}):</strong> Clear skies, pleasant daytime temperatures, and ideal weather for walking tours, outdoor forts, and monument sightseeing.
                </p>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  <strong>Traveler Packing Tip:</strong> Carry breathable cotton clothes during summer/monsoon months and light woolens for winter evenings in northern and hill regions.
                </p>
              </div>
            </div>

            {/* Directions & Emergency Quick-Action Bar */}
            <div style={{
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38BDF8', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Navigation size={14} />
                  <span>Interactive GPS Navigation & Emergency Assistance</span>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: '0 0 0.35rem 0' }}>
                  Ready to Travel to {state.name}?
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: 0, maxWidth: '580px' }}>
                  Get live turn-by-turn driving directions from your location or view the 24/7 verified police, hospital and tourist emergency directory.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setDirectionsModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Navigation size={14} color="var(--tourism-earth)" />
                  <span>Get Directions to {state.capital || state.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('safety')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.25rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--tourism-earth)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>Open Emergency Safety Hub</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── Tourist Safety & Emergency Services Tab ── */}
        {(activeTab === 'safety' || activeTab === 'all') && (
          <section id="state-tourist-safety" style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-forest">Emergency Preparedness & Assistance</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Tourist Safety & Emergency Services ({state.name})
              </h2>
            </div>
            <TouristSafetyDirectory
              initialState={state.name}
              isEmbedded={true}
              showHeader={false}
            />
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
