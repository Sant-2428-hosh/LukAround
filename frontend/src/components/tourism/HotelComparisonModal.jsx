import React from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Minus,
  ExternalLink,
  Navigation,
  Sparkles
} from 'lucide-react';
import SafeImage from './SafeImage';
import { getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl } from '../../utils/distance';

export default function HotelComparisonModal({
  isOpen,
  onClose,
  hotels = [],
  onRemoveHotel,
  destinationName = null
}) {
  if (!isOpen || !hotels || hotels.length === 0) return null;

  const ALL_KEY_AMENITIES = [
    'Swimming Pool',
    'High-Speed Wi-Fi',
    '24-Hour Front Desk',
    'Spa & Wellness',
    'Fine Dining',
    'Free Parking',
    'Airport Transfer',
    'Fitness Centre',
    'Room Service',
    'Electric Vehicle Charging'
  ];

  const ALL_KEY_SAFETY = [
    'Verified Property',
    '24-Hour Front Desk',
    'CCTV Monitored Premises',
    'Secure Keycard Access',
    'Strong Guest Reviews',
    'Family-Friendly',
    'Dedicated Security Staff',
    'Doctor on Call'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FAFAF8'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Hotel Comparison ({hotels.length}/3)
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
              Side-by-side comparison of verified properties {destinationName ? `near ${destinationName}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Comparison Table Content */}
        <div style={{ overflowY: 'auto', padding: '1.5rem 1.75rem', flex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `200px repeat(${hotels.length}, minmax(240px, 1fr))`,
              gap: '1rem',
              alignItems: 'stretch'
            }}
          >
            {/* ── Row 1: Property Overview ── */}
            <div style={{ fontWeight: 800, color: '#64748B', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
              Property Details
            </div>
            {hotels.map((h) => (
              <div
                key={h.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  padding: '1rem',
                  position: 'relative',
                  border: '1px solid #E2E8F0'
                }}
              >
                <button
                  type="button"
                  onClick={() => onRemoveHotel(h.id)}
                  title="Remove from comparison"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #CBD5E1',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#64748B',
                    zIndex: 5
                  }}
                >
                  <X size={14} />
                </button>

                <div style={{ height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                  <SafeImage
                    src={h.image || (h.gallery && h.gallery[0] && h.gallery[0].imageUrl)}
                    alt={h.name}
                    category="heritage"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', lineHeight: 1.3, marginBottom: '4px' }}>
                  {h.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '6px' }}>
                  {h.city}, {h.state}
                </div>

                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '4px' }}>
                  {[...Array(Math.min(5, h.starCategory || 3))].map((_, i) => (
                    <Star key={i} size={13} fill="#F59E0B" color="#F59E0B" />
                  ))}
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', marginLeft: '4px' }}>
                    {h.starCategory}-Star
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="#1D4ED8" /> {h.guestRating} / 5 ({h.reviewCount?.toLocaleString()} reviews)
                </div>
              </div>
            ))}

            {/* ── Row 2: Distance ── */}
            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
              Distance to Attraction
            </div>
            {hotels.map((h) => (
              <div
                key={h.id}
                style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid #F1F5F9',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0369A1'
                }}
              >
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                {h.distanceFromDestination || `${h.distanceInKm || 1.2} km`}
              </div>
            ))}

            {/* ── Row 3: Travel Time ── */}
            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem', paddingTop: '0.75rem' }}>
              Estimated Travel Time
            </div>
            {hotels.map((h) => (
              <div key={h.id} style={{ paddingTop: '0.75rem', fontSize: '0.85rem', color: '#334155' }}>
                <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                {h.estimatedTravelTime || 'Approx. 5 min'}
              </div>
            ))}

            {/* ── Row 4: Price Level ── */}
            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem', paddingTop: '0.75rem' }}>
              Price Level
            </div>
            {hotels.map((h) => (
              <div key={h.id} style={{ paddingTop: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                {h.priceLevel}
              </div>
            ))}

            {/* ── Section: Safety & Trust Indicators ── */}
            <div
              style={{
                gridColumn: `1 / -1`,
                padding: '1rem 0 0.5rem 0',
                borderTop: '2px solid #E2E8F0',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={18} /> Safety & Trust Indicators
            </div>

            {ALL_KEY_SAFETY.map((indicator) => (
              <React.Fragment key={indicator}>
                <div style={{ fontSize: '0.8rem', color: '#475569', padding: '0.4rem 0' }}>
                  {indicator}
                </div>
                {hotels.map((h) => {
                  const hasIndicator = (h.safetyIndicators || []).some(
                    (s) => s.toLowerCase().includes(indicator.toLowerCase()) || indicator.toLowerCase().includes(s.toLowerCase())
                  );
                  return (
                    <div key={h.id} style={{ padding: '0.4rem 0' }}>
                      {hasIndicator ? (
                        <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Check size={14} /> Yes
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                          <Minus size={14} /> —
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* ── Section: Amenities Checklist ── */}
            <div
              style={{
                gridColumn: `1 / -1`,
                padding: '1rem 0 0.5rem 0',
                borderTop: '2px solid #E2E8F0',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={18} color="#C0293C" /> Amenities & Facilities
            </div>

            {ALL_KEY_AMENITIES.map((amenity) => (
              <React.Fragment key={amenity}>
                <div style={{ fontSize: '0.8rem', color: '#475569', padding: '0.4rem 0' }}>
                  {amenity}
                </div>
                {hotels.map((h) => {
                  const hasAmenity = (h.amenities || []).some(
                    (a) => a.toLowerCase().includes(amenity.toLowerCase()) || amenity.toLowerCase().includes(a.toLowerCase())
                  );
                  return (
                    <div key={h.id} style={{ padding: '0.4rem 0' }}>
                      {hasAmenity ? (
                        <span style={{ color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                          <Check size={14} /> Included
                        </span>
                      ) : (
                        <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                          <Minus size={14} /> Not listed
                        </span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}

            {/* ── Action Links Row ── */}
            <div style={{ gridColumn: `1 / -1`, paddingTop: '1.25rem', borderTop: '2px solid #E2E8F0' }} />
            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.85rem' }}>
              Direct Actions
            </div>
            {hotels.map((h) => {
              const mapsUrl = getGoogleMapsSearchUrl(h);
              const dirUrl = getGoogleMapsDirectionsUrl(h);
              return (
                <div key={h.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {h.website && (
                    <a
                      href={h.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        padding: '0.45rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Check on Official Site</span>
                      <ExternalLink size={12} />
                    </a>
                  )}

                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#F8FAFC',
                      color: '#1E293B',
                      border: '1px solid #CBD5E1',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <MapPin size={12} color="#EA4335" />
                    <span>View on Google Maps</span>
                  </a>

                  <a
                    href={dirUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Navigation size={12} color="#38BDF8" />
                    <span>Get Directions</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div
          style={{
            padding: '0.85rem 1.75rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            fontSize: '0.75rem',
            color: '#64748B'
          }}
        >
          🛡️ <em>Safety information is based on publicly available property information and guest-review signals. No hotel can be guaranteed completely safe. Always verify current conditions and use your own judgment.</em>
        </div>
      </div>
    </div>
  );
}
