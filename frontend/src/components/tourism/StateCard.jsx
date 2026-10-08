import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, ArrowRight, Award } from 'lucide-react';
import SafeImage from './SafeImage';

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
    imageAlt,
    imagePhotographer,
    imageSourceName,
    majorCities = [],
    topDestinations = [],
    bestTimeToVisit,
    unescoSites = []
  } = state;

  const effectiveAlt = imageAlt || `Discover authentic landmarks of ${name}, India`;

  return (
    <div className="state-card">
      <div className="state-card-image-wrap">
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

        {priorityRank && (
          <div className="state-card-priority-badge" style={{ zIndex: 3 }}>
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
            gap: '0.3rem',
            zIndex: 3
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
          <div className="state-card-meta-item">
            <Calendar size={13} color="var(--tourism-earth)" />
            <span>{bestTimeToVisit || 'October to March'}</span>
          </div>

          <div className="state-card-meta-item">
            <MapPin size={13} color="var(--tourism-forest)" />
            <span>{majorCities.length} Cities</span>
          </div>

          <div className="state-card-meta-item">
            <Compass size={13} color="var(--tourism-sky)" />
            <span>{topDestinations.length} Top Places</span>
          </div>
        </div>

        {/* Cities Preview Chips */}
        {majorCities && majorCities.length > 0 && (
          <div className="state-card-chips">
            {majorCities.slice(0, 4).map((city) => (
              <span key={city} className="state-card-chip">
                {city}
              </span>
            ))}
            {majorCities.length > 4 && (
              <span className="state-card-chip" style={{ color: 'var(--tourism-earth)', fontWeight: 700 }}>
                +{majorCities.length - 4} more
              </span>
            )}
          </div>
        )}

        <div className="state-card-footer">
          <Link to={`/india/${slug}`} className="state-card-cta">
            <span>Explore {name}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
