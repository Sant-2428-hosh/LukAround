import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Star, ArrowRight, Navigation, ExternalLink, Hotel } from 'lucide-react';
import SafeImage from './SafeImage';
import DirectionsModal from './DirectionsModal';
import { buildGoogleMapsSearchUrl } from '../../utils/googleMaps';

export default function AttractionCard({ attraction }) {
  if (!attraction) return null;

  const [directionsOpen, setDirectionsOpen] = useState(false);

  const {
    id,
    name,
    state,
    stateSlug,
    city,
    citySlug,
    category = [],
    type,
    shortDescription,
    image,
    imageAlt,
    imagePhotographer,
    imageSourceName,
    verified,
    bestTimeToVisit,
    recommendedDuration,
    featured
  } = attraction;

  const primaryCategory = category[0] || type || 'heritage';
  const effectiveAlt = imageAlt || `Real photograph of ${name} in ${city}, ${state}`;
  const effectiveStateSlug = stateSlug || state.toLowerCase().replace(/\s+/g, '-');
  const effectiveCitySlug = citySlug || city.toLowerCase().replace(/\s+/g, '-');
  const mapsSearchUrl = buildGoogleMapsSearchUrl(attraction);

  return (
    <div className="attraction-card">
      <div className="attraction-card-image-wrap">
        <SafeImage
          src={image}
          alt={effectiveAlt}
          aspectRatio="4:3"
          category={primaryCategory}
          verified={verified !== false}
          showCredit={false}
          photographer={imagePhotographer}
          sourceName={imageSourceName}
          loading="lazy"
        />

        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(4px)',
          color: '#FFFFFF',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'capitalize',
          zIndex: 3
        }}>
          {primaryCategory}
        </div>

        {featured && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            padding: '0.2rem 0.55rem',
            borderRadius: '6px',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            zIndex: 3
          }}>
            FEATURED
          </div>
        )}
      </div>

      <div className="attraction-card-body">
        <h3 className="attraction-card-name">{name}</h3>

        <div className="attraction-card-location">
          <MapPin size={13} />
          <span>{city}, {state}</span>
        </div>

        <p className="attraction-card-desc">{shortDescription}</p>

        {/* Rating & Duration */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748B',
          marginBottom: '0.75rem'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#D97706', fontWeight: 700 }}>
            <Star size={13} fill="#D97706" color="#D97706" />
            4.8 <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Top Rated)</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} color="var(--tourism-earth)" />
            {recommendedDuration || '2-3 hours'}
          </span>
        </div>

        {/* Season */}
        <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.85rem' }}>
          <Calendar size={13} color="var(--tourism-forest)" />
          <span>Best Season: {bestTimeToVisit || 'Oct - Mar'}</span>
        </div>

        {/* ── Action Buttons Row (Requirement 6) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.4rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #F1F5F9'
        }}>
          {/* [View on Google Maps] */}
          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View on Google Maps"
            style={{
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              border: '1px solid #FECACA',
              padding: '0.45rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            <MapPin size={12} color="#DC2626" />
            <span>View on Maps</span>
          </a>

          {/* [Get Directions] */}
          <button
            type="button"
            onClick={() => setDirectionsOpen(true)}
            title="Get Directions on Google Maps"
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'background-color 0.2s'
            }}
          >
            <Navigation size={12} color="#38BDF8" />
            <span>Directions</span>
          </button>

          {/* [Show Nearby Hotels] */}
          <Link
            to={`/india/${effectiveStateSlug}/${effectiveCitySlug}/${id}#where-to-stay`}
            style={{
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #BFDBFE',
              padding: '0.45rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              gridColumn: 'span 2'
            }}
          >
            <Hotel size={13} color="#1D4ED8" />
            <span>Show Nearby Hotels</span>
          </Link>
        </div>

        {/* Explore Details Link */}
        <div style={{ marginTop: '0.6rem', textAlign: 'center' }}>
          <Link
            to={`/india/${effectiveStateSlug}/${effectiveCitySlug}/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--tourism-earth)',
              fontWeight: 700,
              fontSize: '0.8rem',
              textDecoration: 'none'
            }}
          >
            <span>Full Attraction Details & Verified Photos</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Directions Modal */}
      <DirectionsModal
        isOpen={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        target={attraction}
      />
    </div>
  );
}
