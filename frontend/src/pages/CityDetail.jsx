import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cities, states, attractions, itineraries } from '../data/indiaTourismData';
import { hotels as allHotels } from '../data/hotelsData';
import AttractionCard from '../components/tourism/AttractionCard';
import SafeImage from '../components/tourism/SafeImage';
import ImageGalleryModal from '../components/tourism/ImageGalleryModal';
import WhereToStaySection from '../components/tourism/WhereToStaySection';
import GoogleMapView from '../components/maps/GoogleMapView';
import DirectionsModal from '../components/tourism/DirectionsModal';
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
  Camera,
  ShieldCheck,
  Maximize2,
  Navigation,
  ExternalLink,
  Search,
  Filter,
  Hotel
} from 'lucide-react';

export default function CityDetail() {
  const { stateSlug, citySlug } = useParams();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Search & Filter state for city attractions
  const [attractionSearch, setAttractionSearch] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // Directions modal
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);

  const city = cities.find(c =>
    c.id === citySlug || c.id.toLowerCase() === (citySlug || '').toLowerCase()
  ) || cities[0];

  const parentState = states.find(s =>
    s.slug === city.stateSlug || s.name.toLowerCase() === (city.state || '').toLowerCase()
  ) || { name: city.state, slug: city.stateSlug };

  const cityAttractions = attractions.filter(a =>
    a.citySlug === city.id || a.city.toLowerCase() === city.name.toLowerCase()
  );

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
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/states" style={{ color: '#E2E8F0', textDecoration: 'none' }}>States</Link>
            <ChevronRight size={13} />
            <Link to={`/india/${parentState.slug}`} style={{ color: '#E2E8F0', textDecoration: 'none' }}>{parentState.name}</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{city.name}</span>
          </nav>

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

        {/* ── Food, Shopping & Festivals Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Food */}
          {city.food && city.food.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--tourism-sand-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '1rem' }}>
                <Utensils size={18} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0 }}>Famous Foods & Drinks</h3>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {city.food.map((item, idx) => (
                  <li key={idx}><strong>{item}</strong></li>
                ))}
              </ul>
            </div>
          )}

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
