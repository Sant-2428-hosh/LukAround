import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, Star, ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';

export default function AttractionCard({ attraction }) {
  if (!attraction) return null;

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

        <div className="attraction-card-footer">
          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} color="var(--tourism-forest)" />
            {bestTimeToVisit || 'Oct - Mar'}
          </span>

          <Link
            to={`/india/${stateSlug || state.toLowerCase().replace(/\s+/g, '-')}/${citySlug || city.toLowerCase().replace(/\s+/g, '-')}/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'var(--tourism-earth)',
              color: '#FFFFFF',
              padding: '0.45rem 0.95rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Explore</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
