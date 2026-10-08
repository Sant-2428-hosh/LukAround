import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, ArrowRight, Award } from 'lucide-react';

export default function StateCard({ state }) {
  if (!state) return null;

  const {
    id,
    name,
    slug,
    priorityRank,
    domesticTouristVisits2024,
    description,
    heroImage,
    majorCities = [],
    topDestinations = [],
    bestTimeToVisit,
    unescoSites = []
  } = state;

  return (
    <div className="state-card">
      <div className="state-card-image-wrap">
        <img
          src={heroImage}
          alt={`Discover ${name}, India`}
          className="state-card-img"
          loading="lazy"
        />
        {priorityRank && (
          <div className="state-card-priority-badge">
            #{priorityRank} in Tourism
          </div>
        )}
        {unescoSites && unescoSites.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(2, 132, 199, 0.9)',
            backdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            padding: '0.25rem 0.55rem',
            borderRadius: '6px',
            fontSize: '0.7rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Award size={12} />
            {unescoSites.length} UNESCO Sites
          </div>
        )}
      </div>

      <div className="state-card-content">
        <h3 className="state-card-title">{name}</h3>
        <p className="state-card-desc">{description}</p>

        <div className="state-card-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} color="var(--tourism-earth)" />
            {bestTimeToVisit || 'October to March'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={13} color="var(--tourism-forest)" />
            {majorCities.length} Cities
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Compass size={13} color="var(--tourism-sky)" />
            {topDestinations.length} Top Places
          </span>
        </div>

        {/* Popular Cities Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
          {majorCities.slice(0, 4).map((city) => (
            <span
              key={city}
              style={{
                fontSize: '0.72rem',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              {city}
            </span>
          ))}
          {majorCities.length > 4 && (
            <span style={{ fontSize: '0.72rem', color: '#94A3B8', alignSelf: 'center' }}>
              +{majorCities.length - 4} more
            </span>
          )}
        </div>

        <Link to={`/india/${slug || id}`} className="state-card-btn">
          <span>Explore {name}</span>
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
