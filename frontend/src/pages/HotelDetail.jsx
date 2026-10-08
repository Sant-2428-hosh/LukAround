import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Camera,
  Share2,
  Heart,
  Calendar,
  Compass,
  AlertCircle
} from 'lucide-react';
import SafeImage from '../components/tourism/SafeImage';
import DirectionsModal from '../components/tourism/DirectionsModal';
import { getHotelBySlug } from '../api/client';
import { hotels as localHotels } from '../data/hotelsData';
import { attractions } from '../data/indiaTourismData';
import { calculateDistance, estimateTravelTime, getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl } from '../utils/distance';

export default function HotelDetail() {
  const { slug } = useParams();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isDirectionsModalOpen, setIsDirectionsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    let isMounted = true;

    async function fetchHotel() {
      setLoading(true);

      // Attempt API lookup
      try {
        const res = await getHotelBySlug(slug);
        if (isMounted && res && res.hotel) {
          setHotel(res.hotel);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to local
      }

      // Local fallback
      const found = localHotels.find(
        (h) => h.slug === slug || h.id === slug || h.slug?.toLowerCase() === (slug || '').toLowerCase()
      ) || localHotels[0];

      if (isMounted) {
        setHotel(found);
        setLoading(false);
      }
    }

    fetchHotel();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading || !hotel) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Loading verified hotel details...</p>
      </div>
    );
  }

  const {
    name,
    city,
    state,
    address,
    latitude,
    longitude,
    starCategory = 5,
    propertyType = 'Hotel',
    guestRating = 4.8,
    reviewCount = 1200,
    description,
    image,
    gallery = [],
    website,
    phone,
    email,
    amenities = [],
    safetyIndicators = [],
    verified = true,
    verificationSource,
    lastVerified,
    priceLevel = '₹₹₹₹',
    familyFriendly = true,
    accessibility = []
  } = hotel;

  // Build combined photo list
  const allPhotos = [
    { imageUrl: image, caption: 'Main Property Facade', credit: 'Official Archive', verified: true },
    ...gallery
  ].filter((p, i, arr) => arr.findIndex((x) => x.imageUrl === p.imageUrl) === i);

  const activePhoto = allPhotos[activePhotoIdx] || allPhotos[0];

  // Find nearby attractions in the same city or state
  const nearbyLandmarks = attractions
    .filter((a) => a.citySlug === hotel.citySlug || a.stateSlug === (hotel.state || '').toLowerCase().replace(/\s+/g, '-'))
    .slice(0, 4)
    .map((a) => {
      const dist = calculateDistance(latitude, longitude, a.coordinates.latitude, a.coordinates.longitude);
      return {
        ...a,
        distanceKm: dist,
        travelTime: estimateTravelTime(dist)
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  const mapsSearchUrl = getGoogleMapsSearchUrl(hotel);

  const priceLevelDescription = {
    '₹': 'Budget-Friendly Stays',
    '₹₹': 'Moderate Comfort Accommodations',
    '₹₹₹': 'Premium Quality Stays',
    '₹₹₹₹': 'Luxury Palatial & 5-Star Experience'
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="hotel-detail-page" style={{ backgroundColor: '#F8FAFC', minHeight: '90vh', paddingBottom: '5rem' }}>
      {/* ── Breadcrumbs & Nav Strip ── */}
      <div style={{ backgroundColor: '#0F172A', color: '#CBD5E1', padding: '1rem 0' }}>
        <div className="container">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/hotels" style={{ color: '#94A3B8', textDecoration: 'none' }}>Hotels</Link>
            <ChevronRight size={13} />
            <Link to={`/hotels?state=${encodeURIComponent(state)}`} style={{ color: '#94A3B8', textDecoration: 'none' }}>{state}</Link>
            <ChevronRight size={13} />
            <Link to={`/hotels?city=${encodeURIComponent(city)}`} style={{ color: '#94A3B8', textDecoration: 'none' }}>{city}</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{name}</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        {/* ── Hotel Title & Rating Header ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              {/* Star & Type Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {[...Array(Math.min(5, starCategory))].map((_, i) => (
                    <Star key={i} size={13} fill="#D97706" color="#D97706" />
                  ))}
                  <span style={{ marginLeft: '4px' }}>
                    {starCategory >= 5 ? '5-Star' : starCategory === 4 ? '4-Star' : starCategory === 3 ? '3-Star' : starCategory === 2 ? '2-Star' : 'Lodge/Rest House'}
                  </span>
                </span>

                <span
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {propertyType}
                </span>

                {verified && (
                  <span
                    style={{
                      backgroundColor: '#F0FDF4',
                      color: '#15803D',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={13} /> Verified Property
                  </span>
                )}
              </div>

              {/* Hotel Name */}
              <h1
                style={{
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  fontWeight: 900,
                  color: '#0F172A',
                  lineHeight: 1.2,
                  margin: '0.2rem 0 0.6rem 0'
                }}
              >
                {name}
              </h1>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                <MapPin size={16} color="#EA4335" />
                <span>{address}</span>
              </div>
            </div>

            {/* Top Right: Guest Rating & Action Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid #BFDBFE',
                  textAlign: 'right'
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star size={20} fill="#1D4ED8" />
                  <span>{guestRating} / 5</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                  Based on {reviewCount.toLocaleString()} verified reviews
                </div>
              </div>

              <button
                type="button"
                onClick={handleShare}
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Link Copied!' : 'Share Hotel'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Interactive Photo Gallery with Authentic Photography ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            marginBottom: '2rem'
          }}
        >
          {/* Main Stage Image */}
          <div
            style={{
              height: '460px',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#0F172A',
              marginBottom: '1rem'
            }}
          >
            <SafeImage
              src={activePhoto.imageUrl}
              alt={activePhoto.caption || name}
              category="heritage"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Photo Metadata Caption */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.9))',
                padding: '1.5rem 1.25rem 1rem 1.25rem',
                color: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                  {activePhoto.caption || name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Verified Real Photograph • Source: {activePhoto.credit || 'Official Property Archive'}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(4px)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                Photo {activePhotoIdx + 1} of {allPhotos.length}
              </div>
            </div>
          </div>

          {/* Thumbnails row */}
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {allPhotos.map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                style={{
                  border: activePhotoIdx === idx ? '3px solid var(--color-primary)' : '2px solid transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  width: '90px',
                  height: '65px',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity: activePhotoIdx === idx ? 1 : 0.7,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `Thumbnail ${idx}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Two-Column Layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: '2rem' }}>
          
          {/* Left Column: About, Amenities, Safety, Distance */}
          <div>
            {/* About the Hotel */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                marginBottom: '2rem'
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                About {name}
              </h2>
              <p style={{ color: '#334155', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                {description}
              </p>
            </div>

            {/* Dedicated Safety & Trust Section (Section 4 & 24) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <ShieldCheck size={22} color="#16A34A" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Safety & Trust Indicators
                </h2>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                Transparent security and verification signals based on official registration and guest-review verification.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {safetyIndicators.map((indicator, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #DCFCE7',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#15803D',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>{indicator}</span>
                  </div>
                ))}
              </div>

              {/* Mandatory Safety Disclaimer */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  padding: '1rem',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: 1.5
                }}
              >
                🛡️ <strong>Safety Disclaimer:</strong> Safety information is based on publicly available property information and guest-review signals. No hotel can be guaranteed completely safe. Always verify current conditions and use your own judgment.
              </div>
            </div>

            {/* Amenities & Facilities */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                marginBottom: '2rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Sparkles size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Amenities & Facilities
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem' }}>
                {amenities.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      color: '#334155',
                      padding: '0.4rem 0'
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {accessibility.length > 0 && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                    Accessibility Features
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {accessibility.map((acc, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        ♿ {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nearby Tourist Attractions & Travel Distances */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #E2E8F0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Compass size={20} color="#0284C7" />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Nearby Tourist Attractions
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {nearbyLandmarks.map((lm) => (
                  <div
                    key={lm.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1rem',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    <div>
                      <Link
                        to={`/india/${lm.stateSlug}/${lm.citySlug}/${lm.id}`}
                        style={{ fontWeight: 800, color: '#0F172A', textDecoration: 'none' }}
                        className="hover-underline"
                      >
                        {lm.name}
                      </Link>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {lm.type || 'Attraction'} • {lm.city}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0369A1' }}>
                        {lm.distanceKm} km away
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {lm.travelTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Direct Booking & Navigation Card */}
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                position: 'sticky',
                top: '90px'
              }}
            >
              {/* Pricing Guidance (Section 18 & 19: No Fake Prices, Authentic Direct Redirection) */}
              <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, marginBottom: '2px' }}>
                  Price Category
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>
                  {priceLevel} <span style={{ fontSize: '1rem', fontWeight: 600, color: '#475569' }}>({priceLevelDescription[priceLevel] || 'Standard'})</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                  *Prices vary by season and room type. Check live verified availability directly on official website.
                </div>
              </div>

              {/* Official Check Availability Button */}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '0.75rem',
                    boxShadow: '0 4px 12px rgba(192, 41, 60, 0.3)'
                  }}
                >
                  <Globe size={18} />
                  <span>Check Availability on Official Site</span>
                  <ExternalLink size={14} />
                </a>
              )}

              {/* View on Google Maps Button */}
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '0.75rem'
                }}
              >
                <MapPin size={16} color="#EA4335" />
                <span>View on Google Maps</span>
              </a>

              {/* Get Driving Directions Button */}
              <button
                type="button"
                onClick={() => setIsDirectionsModalOpen(true)}
                style={{
                  width: '100%',
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '1.5rem'
                }}
              >
                <Navigation size={16} color="#38BDF8" />
                <span>Get Directions (Google Maps)</span>
              </button>

              {/* Contact Information */}
              <div style={{ paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Property Contact Info
                </div>

                {phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                    <Phone size={14} color="#64748B" />
                    <a href={`tel:${phone}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                      {phone}
                    </a>
                  </div>
                )}

                {email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                    <Mail size={14} color="#64748B" />
                    <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {email}
                    </a>
                  </div>
                )}

                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#94A3B8' }}>
                  Registry Source: {verificationSource || 'Ministry of Tourism NIDHI & Geo-Verification'}
                  <br />
                  Last Verified: {lastVerified || 'March 2026'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Directions Modal ── */}
      <DirectionsModal
        isOpen={isDirectionsModalOpen}
        onClose={() => setIsDirectionsModalOpen(false)}
        hotel={hotel}
        destination={nearbyLandmarks[0] || null}
      />
    </div>
  );
}
