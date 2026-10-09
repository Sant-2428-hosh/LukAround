import React, { useState } from 'react';
import {
  MapPin,
  Star,
  Clock,
  Navigation,
  ExternalLink,
  Utensils,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Footprints,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RestaurantCard({
  restaurant,
  originName = '',
  originCoords = null,
  onGetDirections = null,
  compact = false
}) {
  const { openDishlyWithPrompt } = useApp();
  const [expanded, setExpanded] = useState(false);

  if (!restaurant) return null;

  const {
    id,
    name,
    city,
    state,
    address,
    cuisine,
    rating = 4.5,
    userRatingCount,
    priceTier = '₹₹',
    priceForTwo,
    categories = [],
    dietaryOptions = [],
    mustTryDishes = [],
    verifiedDishes = [],
    ambiance,
    timings,
    distanceKm,
    travelTime,
    googleMapsUri,
    directionsUrl,
    photos = [],
    websiteUri,
    menuUrl,
    isLiveVerified
  } = restaurant;

  const photoUrl = photos && photos.length > 0 ? photos[0] : null;

  // Format reviews count
  const formattedReviews = userRatingCount
    ? (userRatingCount >= 1000 ? `${(userRatingCount / 1000).toFixed(1)}k` : userRatingCount)
    : null;

  const isPureVeg = (dietaryOptions || []).some(d => d.toLowerCase().includes('pure veg') || d.toLowerCase() === 'vegetarian');
  const isNonVeg = (dietaryOptions || []).some(d => d.toLowerCase().includes('non'));

  const handleAskDishly = () => {
    if (openDishlyWithPrompt) {
      openDishlyWithPrompt(`Tell me about signature specialties, crowd ambiance, and the best time to visit ${name} in ${city}.`);
    }
  };

  const handleDirectionsClick = () => {
    if (onGetDirections) {
      onGetDirections(restaurant);
    } else if (directionsUrl) {
      window.open(directionsUrl, '_blank', 'noopener,noreferrer');
    } else {
      const q = encodeURIComponent(`${name}, ${address || city}`);
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`restaurant-card ${compact ? 'restaurant-card--compact' : ''}`}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* ── Card Image & Badges ── */}
      <div style={{ position: 'relative', height: compact ? '150px' : '190px', backgroundColor: '#F1F5F9', overflow: 'hidden' }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={`${name} in ${city}`}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback pattern when photo fails or is absent */}
        <div
          style={{
            display: photoUrl ? 'none' : 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            flexDirection: 'column',
            gap: '0.4rem',
            color: '#EA580C'
          }}
        >
          <Utensils size={32} />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9A3412' }}>Authentic Culinary Landmark</span>
        </div>

        {/* Rating Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '4px 9px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.82rem',
            fontWeight: 800,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <Star size={13} fill="#F59E0B" color="#F59E0B" />
          <span>{Number(rating).toFixed(1)}</span>
          {formattedReviews && (
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>
              ({formattedReviews})
            </span>
          )}
        </div>

        {/* Dietary Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {isPureVeg && (
            <span
              style={{
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 2px 6px rgba(16,185,129,0.3)'
              }}
            >
              Pure Veg
            </span>
          )}
          {isNonVeg && !isPureVeg && (
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                boxShadow: '0 2px 6px rgba(220,38,38,0.3)'
              }}
            >
              Non-Veg
            </span>
          )}
          <span
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(4px)',
              color: '#F8FAFC',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700
            }}
          >
            {priceTier}
          </span>
        </div>

        {/* Distance Badge if available */}
        {distanceKm != null && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              backdropFilter: 'blur(6px)',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Compass size={11} color="#38BDF8" />
            <span>{distanceKm} km away</span>
            {travelTime?.walking && (
              <span style={{ color: '#CBD5E1', marginLeft: '4px' }}>
                • {travelTime.walking}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Content Section ── */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name and Cuisine */}
        <div style={{ marginBottom: '0.65rem' }}>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 0.25rem',
              lineHeight: 1.3
            }}
          >
            {name}
          </h3>
          <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
            {cuisine || 'Traditional Regional Cuisine'}
          </div>
        </div>

        {/* Address */}
        {address && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#475569',
              marginBottom: '0.75rem',
              lineHeight: 1.4
            }}
          >
            <MapPin size={13} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{address}</span>
          </div>
        )}

        {/* Must Try Dishes Chip */}
        {mustTryDishes && mustTryDishes.length > 0 && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              marginBottom: '0.85rem'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={11} />
              <span>Must-Try Specialty</span>
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78350F' }}>
              {mustTryDishes.slice(0, 3).join(', ')}
            </div>
          </div>
        )}

        {/* Timings & Price info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#64748B',
            marginTop: 'auto',
            paddingTop: '0.5rem',
            borderTop: '1px solid #F1F5F9',
            marginBottom: '0.85rem'
          }}
        >
          {timings && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} color="#64748B" />
              <span>{timings.split(',')[0]}</span>
            </div>
          )}
          {priceForTwo && (
            <span style={{ fontWeight: 700, color: '#0F172A' }}>
              {priceForTwo}
            </span>
          )}
        </div>

        {/* Detailed Ambiance / Notes if Expanded */}
        {expanded && ambiance && (
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              padding: '0.65rem 0.75rem',
              fontSize: '0.8rem',
              color: '#334155',
              lineHeight: 1.5,
              marginBottom: '0.85rem',
              border: '1px solid #E2E8F0'
            }}
          >
            <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Ambiance & Experience:</div>
            <div>{ambiance}</div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={handleDirectionsClick}
              className="tourism-btn tourism-btn-primary"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.65rem',
                justifyContent: 'center',
                backgroundColor: '#1E293B',
                color: '#FFFFFF'
              }}
              title="Get driving or walking directions"
            >
              <Navigation size={13} color="#38BDF8" />
              <span>Directions</span>
            </button>

            <a
              href={googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address || city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tourism-btn"
              style={{
                fontSize: '0.8rem',
                padding: '0.45rem 0.65rem',
                justifyContent: 'center',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                border: '1px solid #FECACA'
              }}
              title="View on Google Maps"
            >
              <MapPin size={13} color="#DC2626" />
              <span>Google Maps</span>
            </a>
          </div>

          <div style={{ display: 'flex', gap: '0.45rem' }}>
            <button
              type="button"
              onClick={handleAskDishly}
              className="tourism-btn tourism-btn-secondary"
              style={{
                flex: 1,
                fontSize: '0.78rem',
                padding: '0.4rem 0.6rem',
                justifyContent: 'center',
                backgroundColor: '#FFF7ED',
                color: '#C2410C',
                border: '1px solid #FFEDD5'
              }}
              title="Ask Dishly about this restaurant"
            >
              <Sparkles size={12} color="#EA580C" />
              <span>Ask Dishly</span>
            </button>

            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.4rem 0.6rem',
                fontSize: '0.78rem',
                color: '#64748B',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <span>{expanded ? 'Less' : 'Details'}</span>
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
