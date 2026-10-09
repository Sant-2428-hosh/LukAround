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

  // Extract a clean, complete essence sentence instead of a truncated mid-word paragraph
  const cleanDesc = description
    ? (description.split('. ')[0] + (description.includes('.') ? '.' : ''))
    : '';

  return (
    <Link
      to={`/india/${slug}`}
      className="state-card"
      aria-label={`Explore ${name}, India`}
    >
      <div className="state-card-image-wrap">
        <SafeImage
          src={heroImage}
          alt={effectiveAlt}
          aspectRatio="16:9"
          category="heritage"
          verified={false}
          showCredit={false}
          photographer={imagePhotographer}
          sourceName={imageSourceName}
          loading="lazy"
        />

        {priorityRank && (
          <div className="state-card-priority-badge">
            #{priorityRank} in Tourism
          </div>
        )}

        {unescoSites && unescoSites.length > 0 && (
          <div className="state-card-unesco-badge">
            <Award size={12} />
            <span>{unescoSites.length} UNESCO Sites</span>
          </div>
        )}
      </div>

      <div className="state-card-content">
        <h3 className="state-card-title">{name}</h3>

        <p className="state-card-desc">
          {cleanDesc}
        </p>

        {/* Clean, neatly spaced metadata pills */}
        <div className="state-card-meta">
          <div className="state-card-pill">
            <Calendar size={13} color="var(--tourism-earth, #C85A32)" />
            <span>{bestTimeToVisit || 'Oct – Mar'}</span>
          </div>

          <div className="state-card-pill">
            <MapPin size={13} color="var(--tourism-forest, #2D6A4F)" />
            <span>{majorCities.length} Cities</span>
          </div>

          <div className="state-card-pill">
            <Compass size={13} color="var(--tourism-sky, #0284C7)" />
            <span>{topDestinations.length} Top Places</span>
          </div>
        </div>

        {/* Full-width interactive action button */}
        <div className="state-card-footer">
          <span className="state-card-btn">
            <span>Explore {name}</span>
            <ArrowRight size={15} className="state-card-arrow" />
          </span>
        </div>
      </div>
    </Link>
  );
}
