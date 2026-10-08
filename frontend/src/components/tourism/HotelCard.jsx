import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Sparkles,
  Wifi,
  Car,
  Utensils,
  Layers
} from 'lucide-react';
import SafeImage from './SafeImage';
import { getGoogleMapsSearchUrl, getGoogleMapsDirectionsUrl } from '../../utils/distance';

export default function HotelCard({
  hotel,
  originCoords = null,
  destinationName = null,
  isSelectedForCompare = false,
  onToggleCompare = null,
  onOpenDirections = null,
  layout = 'card' // 'card' or 'horizontal'
}) {
  if (!hotel) return null;

  const {
    id,
    name,
    slug,
    city,
    state,
    starCategory = 5,
    propertyType = 'Hotel',
    guestRating = 4.5,
    reviewCount = 1200,
    priceLevel = '₹₹₹',
    image,
    gallery = [],
    amenities = [],
    safetyIndicators = [],
    verified = true,
    distanceFromDestination,
    distanceInKm,
    estimatedTravelTime,
    website
  } = hotel;

  // Render official star classification (distinct from guest rating)
  const renderStars = () => {
    const stars = [];
    const count = Math.min(5, Math.max(1, starCategory));
    for (let i = 0; i < count; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          fill="#F59E0B"
          color="#F59E0B"
          style={{ display: 'inline-block' }}
        />
      );
    }
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {stars}
        <span style={{ marginLeft: '4px', fontSize: '0.8rem', fontWeight: 700, color: '#B45309' }}>
          {starCategory >= 5 ? '5-Star' : starCategory === 4 ? '4-Star' : starCategory === 3 ? '3-Star' : starCategory === 2 ? '2-Star' : 'Lodge/Rest House'}
        </span>
      </span>
    );
  };

  const mapsSearchUrl = getGoogleMapsSearchUrl(hotel);
  const mapsDirectionsUrl = getGoogleMapsDirectionsUrl(hotel, originCoords);

  const displayDistance = distanceFromDestination || (distanceInKm != null ? `${distanceInKm} km away` : 'Nearby');
  const displayTravelTime = estimatedTravelTime || (distanceInKm != null ? `Approx. ${Math.round(distanceInKm * 3)} min drive` : null);

  const primaryPhoto = image || (gallery[0] && gallery[0].imageUrl) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const photoCredit = (gallery[0] && gallery[0].credit) || 'Verified Property';

  const priceLevelMap = {
    '₹': 'Budget',
    '₹₹': 'Moderate',
    '₹₹₹': 'Premium',
    '₹₹₹₹': 'Luxury'
  };

  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={`hotel-discovery-card ${isSelectedForCompare ? 'selected-for-compare' : ''}`}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: isSelectedForCompare ? '2px solid var(--color-primary)' : '1px solid #E2E8F0',
        boxShadow: isSelectedForCompare ? '0 10px 25px -5px rgba(192, 41, 60, 0.2)' : '0 4px 14px 0 rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      {/* ── Image Section ── */}
      <div
        style={{
          position: 'relative',
          width: isHorizontal ? '38%' : '100%',
          minWidth: isHorizontal ? '280px' : 'auto',
          height: isHorizontal ? 'auto' : '220px',
          backgroundColor: '#0F172A',
          flexShrink: 0
        }}
      >
        <SafeImage
          src={primaryPhoto}
          alt={`Real photograph of ${name} in ${city}, ${state}`}
          aspectRatio={isHorizontal ? undefined : '16:9'}
          category="heritage"
          verified={verified}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Official Star Badge overlay */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            padding: '0.3rem 0.65rem',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 3
          }}
        >
          {renderStars()}
        </div>

        {/* Verification Badge */}
        {verified && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.92)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 3
            }}
          >
            <CheckCircle2 size={12} /> Verified Property
          </div>
        )}

        {/* Real photo attribution chip */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#CBD5E1',
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            zIndex: 3
          }}
        >
          📷 {photoCredit}
        </div>
      </div>

      {/* ── Content Section ── */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Top row: Property Type & Guest Rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 700,
                color: '#64748B'
              }}
            >
              {propertyType} • {city}
            </span>

            {/* Guest Rating & Review Count (Separate from Star Category) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#EFF6FF',
                color: '#1D4ED8',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}
            >
              <Star size={12} fill="#1D4ED8" />
              <span>{guestRating} / 5</span>
              <span style={{ color: '#64748B', fontWeight: 500, fontSize: '0.72rem' }}>
                ({reviewCount.toLocaleString()} reviews)
              </span>
            </div>
          </div>

          {/* Hotel Name */}
          <h3
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '0.45rem',
              lineHeight: 1.3
            }}
          >
            <Link
              to={`/hotels/${slug || id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
              className="hover-underline"
            >
              {name}
            </Link>
          </h3>

          {/* Distance & Travel Time from Destination */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '0.8rem',
              fontSize: '0.85rem'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                color: '#0369A1'
              }}
            >
              <MapPin size={14} color="#0284C7" />
              {displayDistance}
            </span>

            {displayTravelTime && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#475569'
                }}
              >
                <Clock size={13} color="#64748B" />
                {displayTravelTime}
              </span>
            )}

            <span
              style={{
                backgroundColor: '#F1F5F9',
                color: '#334155',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {priceLevel} ({priceLevelMap[priceLevel] || 'Moderate'})
            </span>
          </div>

          {/* Safety & Trust Indicators (Dedicated section per requirement) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              marginBottom: '0.85rem'
            }}
          >
            {(safetyIndicators || []).slice(0, 3).map((ind, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#F0FDF4',
                  color: '#15803D',
                  border: '1px solid #DCFCE7',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <ShieldCheck size={11} color="#16A34A" /> {ind}
              </span>
            ))}
          </div>

          {/* Amenities preview */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.35rem',
              marginBottom: '1rem',
              color: '#475569',
              fontSize: '0.75rem'
            }}
          >
            {(amenities || []).slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                {amenity}
              </span>
            ))}
            {amenities.length > 4 && (
              <span style={{ color: '#94A3B8', padding: '0.15rem 0.3rem' }}>
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* ── Action Buttons Row ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid #F1F5F9',
            flexWrap: 'wrap'
          }}
        >
          {/* Left actions: Compare Checkbox */}
          {onToggleCompare && (
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: '#475569',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                checked={isSelectedForCompare}
                onChange={() => onToggleCompare(hotel)}
                style={{ accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
              <span style={{ fontWeight: 600 }}>Compare</span>
            </label>
          )}

          {/* Right action buttons: View Hotel, View on Maps, Get Directions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {/* View Hotel Page */}
            <Link
              to={`/hotels/${slug || id}`}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'background-color 0.2s ease'
              }}
            >
              View Hotel
            </Link>

            {/* Official Google Maps Search Button */}
            <a
              href={mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View on Google Maps"
              style={{
                backgroundColor: '#F8FAFC',
                color: '#1E293B',
                border: '1px solid #CBD5E1',
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <MapPin size={13} color="#EA4335" />
              <span>Map</span>
            </a>

            {/* Get Directions Button */}
            {onOpenDirections ? (
              <button
                type="button"
                onClick={() => onOpenDirections(hotel)}
                style={{
                  backgroundColor: '#0F172A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Navigation size={13} color="#38BDF8" />
                <span>Directions</span>
              </button>
            ) : (
              <a
                href={mapsDirectionsUrl}
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Navigation size={13} color="#38BDF8" />
                <span>Directions</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
