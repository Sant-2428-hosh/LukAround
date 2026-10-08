import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function CityCard({ city }) {
  if (!city) return null;

  const {
    id,
    name,
    state,
    stateSlug,
    description,
    heroImage,
    bestTimeToVisit,
    topAttractions = [],
    recommendedDays = 2,
    travelStyles = []
  } = city;

  return (
    <div className="attraction-card">
      <div className="attraction-card-image-wrap">
        <img
          src={heroImage}
          alt={`Travel to ${name}, ${state}`}
          className="attraction-card-img"
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
          fontWeight: 700
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
          gap: '0.3rem'
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

        {/* Travel styles tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          {travelStyles.slice(0, 3).map((style) => (
            <span
              key={style}
              style={{
                fontSize: '0.7rem',
                backgroundColor: 'var(--tourism-sand-light)',
                color: 'var(--tourism-forest-dark)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600,
                textTransform: 'capitalize'
              }}
            >
              {style}
            </span>
          ))}
        </div>

        <div className="attraction-card-footer">
          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} color="var(--tourism-earth)" />
            {bestTimeToVisit || 'Oct - Mar'}
          </span>

          <Link
            to={`/india/${stateSlug || state.toLowerCase().replace(/\s+/g, '-')}/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'var(--tourism-earth)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}
          >
            <span>Discover</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
