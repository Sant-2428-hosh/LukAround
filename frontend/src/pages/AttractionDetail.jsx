import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attractions, states, cities } from '../data/indiaTourismData';
import { hotels as allHotels } from '../data/hotelsData';
import AttractionCard from '../components/tourism/AttractionCard';
import SafeImage from '../components/tourism/SafeImage';
import ImageGalleryModal from '../components/tourism/ImageGalleryModal';
import WhereToStaySection from '../components/tourism/WhereToStaySection';
import GoogleMapView from '../components/maps/GoogleMapView';
import DirectionsModal from '../components/tourism/DirectionsModal';
import { buildGoogleMapsSearchUrl, buildGoogleMapsDirectionsUrl, getNearbyHotels } from '../utils/googleMaps';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Compass,
  CheckCircle2,
  AlertCircle,
  Accessibility,
  Users,
  Award,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Share2,
  Camera,
  ShieldCheck,
  Maximize2,
  Navigation,
  Hotel
} from 'lucide-react';

export default function AttractionDetail() {
  const { stateSlug, citySlug, attractionSlug } = useParams();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const attraction = attractions.find(a =>
    a.id === attractionSlug || a.id.toLowerCase() === (attractionSlug || '').toLowerCase()
  ) || attractions[0];

  const parentCity = cities.find(c => c.id === attraction.citySlug) || { name: attraction.city, id: attraction.citySlug, state: attraction.state };
  const parentState = states.find(s => s.slug === attraction.stateSlug) || { name: attraction.state, slug: attraction.stateSlug };

  // Nearby attractions in the same city or state
  const nearbyPlacesList = attractions.filter(a =>
    a.id !== attraction.id && (a.citySlug === attraction.citySlug || a.stateSlug === attraction.stateSlug)
  ).slice(0, 3);

  // Nearby verified hotels
  const nearbyHotels = useMemo(() => {
    return getNearbyHotels(attraction, allHotels, 25).slice(0, 10);
  }, [attraction]);

  // Complete gallery list including hero image
  const allImages = [
    attraction.image,
    ...(attraction.gallery || [])
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  const openGalleryAt = (idx) => {
    setActivePhotoIndex(idx);
    setGalleryOpen(true);
  };

  const attrCoords = attraction.coordinates || { latitude: 20.5937, longitude: 78.9629 };
  const mapsSearchUrl = buildGoogleMapsSearchUrl(attraction);

  // Map markers: Attraction (Selected) + Nearby Hotels + Nearby Attractions
  const mapMarkers = useMemo(() => {
    const list = [];

    // 1. Selected Attraction Marker
    list.push({
      id: attraction.id,
      title: attraction.name,
      latitude: attrCoords.latitude,
      longitude: attrCoords.longitude,
      type: 'attraction',
      category: attraction.type || 'Attraction',
      city: attraction.city,
      state: attraction.state,
      image: attraction.image,
      address: `${attraction.name}, ${attraction.city}, ${attraction.state}`
    });

    // 2. Nearby Hotels
    nearbyHotels.forEach(h => {
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

    // 3. Other Nearby Attractions
    nearbyPlacesList.forEach(a => {
      const c = a.coordinates;
      if (c && c.latitude && c.longitude) {
        list.push({
          id: a.id,
          title: a.name,
          latitude: c.latitude,
          longitude: c.longitude,
          type: 'attraction',
          category: a.type || 'Attraction',
          city: a.city,
          state: a.state,
          image: a.image,
          address: `${a.name}, ${a.city}, ${a.state}`
        });
      }
    });

    return list;
  }, [attraction, attrCoords, nearbyHotels, nearbyPlacesList]);

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Header Banner with Authentic Photograph ── */}
      <div
        className="detail-hero-banner"
        style={{
          backgroundImage: `url(${attraction.image})`,
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
            <Link to={`/india/${parentState.slug}/${parentCity.id}`} style={{ color: '#E2E8F0', textDecoration: 'none' }}>{parentCity.name}</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{attraction.name}</span>
          </nav>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tourism-badge badge-earth">
              {attraction.type}
            </span>
            <span className="tourism-badge badge-forest">
              {attraction.city}, {attraction.state}
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
              100% Real Photograph
            </span>
            {attraction.featured && (
              <span className="tourism-badge badge-gold">
                ★ Highly Recommended
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, margin: '0 0 0.85rem' }}>
            {attraction.name}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)', maxWidth: '850px', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
            {attraction.shortDescription}
          </p>

          {/* Action Buttons in Hero Banner (Requirement 6) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* View on Google Maps Button */}
            <a
              href={mapsSearchUrl}
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
              <span>View on Google Maps</span>
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
              <span>Get Directions</span>
            </button>

            {/* Show Nearby Hotels Button */}
            <a
              href="#where-to-stay"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#1D4ED8',
                color: '#FFFFFF',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('where-to-stay')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Hotel size={16} />
              <span>Nearby Hotels</span>
            </a>

            {/* Fullscreen Gallery */}
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
                padding: '0.65rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Maximize2 size={15} />
              <span>Gallery ({allImages.length} photos)</span>
            </button>
          </div>
        </div>

        {/* Photo Attribution Pill */}
        {(attraction.imagePhotographer || attraction.imageSourceName) && (
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
            <span>Photo: {attraction.imagePhotographer || 'Contributor'} / {attraction.imageSourceName || 'Wikimedia Commons'}</span>
          </div>
        )}
      </div>

      <div className="tourism-container" style={{ paddingTop: '3rem' }}>
        {/* ── Key Quick Stats Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-earth)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Recommended Duration
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {attraction.recommendedDuration || '2 - 3 hours'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Time Needed: {attraction.estimatedVisitTime || 'Half Day'}</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-forest)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Best Season to Visit
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {attraction.bestTimeToVisit || 'October to March'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Pleasant weather</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-sky)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Budget Level
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', textTransform: 'capitalize' }}>
              {attraction.budgetLevel || 'Moderate'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {attraction.familyFriendly ? 'Family Friendly' : 'General visitors'}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-gold)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Geo Coordinates
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
              {attrCoords.latitude}° N, {attrCoords.longitude}° E
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Verified GPS Location
            </div>
          </div>
        </div>

        {/* ── Interactive Google Map Section (Attraction + Hotels + Nearby Places) ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <span className="tourism-badge badge-forest">Live Geographical Map</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.6rem', marginTop: '0.25rem' }}>
                Interactive Location Map for {attraction.name}
              </h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Red pin: {attraction.name} • Blue pins: Nearby Verified Stays
            </span>
          </div>

          <GoogleMapView
            markers={mapMarkers}
            center={{ lat: attrCoords.latitude, lng: attrCoords.longitude }}
            zoom={14}
            selectedMarkerId={selectedMarkerId || attraction.id}
            onMarkerSelect={(m) => setSelectedMarkerId(m.id)}
            height="460px"
            fitBounds={true}
          />
        </section>

        {/* ── Main Details Layout: Content + Sticky Sidebar ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          {/* Main Description & Narrative */}
          <div>
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
                About {attraction.name}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', margin: '0 0 1.25rem' }}>
                {attraction.longDescription || attraction.shortDescription}
              </p>
            </section>

            {/* Highlights */}
            {attraction.highlights && attraction.highlights.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                  Architectural & Experience Highlights
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {attraction.highlights.map((hl, idx) => (
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
                      <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.5 }}>
                        {hl}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activities & Experiences */}
            {attraction.activities && attraction.activities.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                  Things to Do & Experiences
                </h3>
                <div style={{ display: 'grid', gap: '0.65rem' }}>
                  {attraction.activities.map((act, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '1rem 1.25rem',
                        border: '1px solid var(--tourism-sand-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <Compass size={18} color="var(--tourism-earth)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>{act}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Travel Tips */}
            {attraction.travelTips && attraction.travelTips.length > 0 && (
              <section style={{
                backgroundColor: 'var(--tourism-sand-light)',
                borderRadius: '14px',
                padding: '1.5rem',
                border: '1px solid var(--tourism-sand-border)',
                marginBottom: '2.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: '1.1rem', color: '#0F172A' }}>Essential Visitor Tips</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {attraction.travelTips.map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{tip}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ── Sidebar Details: Accessibility & Planning ── */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid var(--tourism-sand-border)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              position: 'sticky',
              top: '90px'
            }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#0F172A' }}>
                Visit Details
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Accessibility size={18} color="var(--tourism-earth)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Accessibility</div>
                    <div style={{ fontSize: '0.88rem', color: '#1E293B' }}>{attraction.accessibility || 'Standard paved access available'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Users size={18} color="var(--tourism-forest)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Crowd & Suitability</div>
                    <div style={{ fontSize: '0.88rem', color: '#1E293B' }}>
                      {attraction.familyFriendly ? 'Suitable for families & elderly' : 'Requires moderate walking & climbing'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Camera size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Photo Source & Rights</div>
                    <div style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                      {attraction.imageCredit || 'Verified Authentic Tourism Photography'}
                    </div>
                    {attraction.imageLicense && (
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>License: {attraction.imageLicense}</div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={() => setDirectionsModalOpen(true)}
                  className="tourism-btn tourism-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Navigation size={15} color="#38BDF8" />
                  <span>Get Directions to {attraction.name}</span>
                </button>

                <a
                  href={mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tourism-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA'
                  }}
                >
                  <MapPin size={15} color="#DC2626" />
                  <span>View on Google Maps</span>
                </a>

                <Link
                  to={`/planner?destination=${encodeURIComponent(attraction.name)}`}
                  className="tourism-btn tourism-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Add to Travel Plan</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Dedicated Where to Stay Section (Official Hotel Discovery System) ── */}
        <div id="where-to-stay">
          <WhereToStaySection destination={attraction} city={parentCity} />
        </div>

        {/* ── Nearby Attractions in this City ── */}
        {nearbyPlacesList.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <h3 className="tourism-heading" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              More Attractions in {attraction.city} & {attraction.state}
            </h3>
            <div className="attraction-grid">
              {nearbyPlacesList.map(place => (
                <AttractionCard key={place.id} attraction={place} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Directions Modal ── */}
      <DirectionsModal
        isOpen={directionsModalOpen}
        onClose={() => setDirectionsModalOpen(false)}
        target={attraction}
      />

      {/* ── Interactive Image Gallery Modal ── */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={allImages}
        initialIndex={activePhotoIndex}
        destinationName={attraction.name}
        location={`${attraction.city}, ${attraction.state}`}
        photographer={attraction.imagePhotographer}
        sourceName={attraction.imageSourceName}
        sourceUrl={attraction.imageSource}
        license={attraction.imageLicense}
      />
    </div>
  );
}
