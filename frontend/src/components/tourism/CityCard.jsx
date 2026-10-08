import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import SafeImage from './SafeImage';

export default function CityCard({ city }) {
  if (!city) return null;

  const {
    id,
    name,
    state,
    stateSlug,
    description,
    heroImage,
    imageAlt,
    imagePhotographer,
    imageSourceName,
    bestTimeToVisit,
    topAttractions = [],
    recommendedDays = 2,
    travelStyles = []
  } = city;

  const effectiveAlt = imageAlt || `Travel to ${name}, ${state}`;

  return (
    <div className="attraction-card">
      <div className="attraction-card-image-wrap">
        <SafeImage
          src={heroImage}
          alt={effectiveAlt}
          aspectRatio="16:9"
          category="heritage"
          verified={true}
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
          color: '#FFFFFF',
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          zIndex: 3
        }}>
          {state}
        </div>

        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          color: '#0F172A',
          padding: '0.25rem 0.55rem',
          borderRadius: '6px',
          fontSize: '0.7rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          zIndex: 3
        }}>
          <Clock size={11} color="var(--tourism-earth)" />
          {recommendedDays} Days Suggested
        </div>
      </div>

      <div className="attraction-card-body">
        <h3 className="attraction-card-name">{name}</h3>

        <div className="attraction-card-location">
          <MapPin size={13} />
          <span>{state}</span>
        </div>

        <p className="attraction-card-desc">{description}</p>

        {/* Travel Styles Chips */}
        {travelStyles && travelStyles.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
            {travelStyles.slice(0, 3).map((style) => (
              <span
                key={style}
                style={{
                  backgroundColor: 'var(--tourism-sand)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  color: '#475569'
                }}
              >
                {style}
              </span>
            ))}
          </div>
        )}

        <div className="attraction-card-footer">
          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} color="var(--tourism-forest)" />
            {bestTimeToVisit || 'Oct - Mar'}
          </span>

          <Link
            to={`/india/${stateSlug || state.toLowerCase().replace(/\s+/g, '-')}/${id}`}
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
            <span>Explore City</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
