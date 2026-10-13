import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, ArrowRight } from 'lucide-react';
import { recordCardClick } from '../common/ScrollToTop';

const TRAVEL_STYLE_FALLBACKS = {
  family: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
  couples: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  solo: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  friends: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  weekend: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  luxury: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  budget: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
  spiritual: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  heritage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
  nature: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  adventure: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
  beach: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80'
};

export default function TravelStyleCard({ style, config }) {
  if (!style) return null;

  const resolvedConfig = config || {
    icon: Compass,
    image: TRAVEL_STYLE_FALLBACKS[style.id] || TRAVEL_STYLE_FALLBACKS.default,
    sampleCities: ['Verified Destinations'],
    badge: 'Curated',
    tag: 'Curated',
    accent: '#F59E0B'
  };

  const IconComp = resolvedConfig.icon || Compass;
  const initialImg = resolvedConfig.image || TRAVEL_STYLE_FALLBACKS[style.id] || TRAVEL_STYLE_FALLBACKS.default;
  const [imgSrc, setImgSrc] = useState(initialImg);
  const [hasFailed, setHasFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    if (!hasFailed) {
      setHasFailed(true);
      const fallbackUrl = TRAVEL_STYLE_FALLBACKS[style.id] || TRAVEL_STYLE_FALLBACKS.default;
      setImgSrc(fallbackUrl);
    }
  };

  return (
    <Link
      to={'/cities?travelStyle=' + style.id}
      id={`place-${style.id}`}
      data-place-id={style.id}
      onClick={() => recordCardClick(style.id)}
      className="travel-style-card-pro"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="travel-style-card-media" style={{ backgroundColor: '#0F172A' }}>
        <img
          src={imgSrc}
          alt={style.name}
          className="travel-style-card-img"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="travel-style-card-overlay" />
      </div>

      <div className="travel-style-topbar">
        <div className="travel-style-tag-pill">
          <IconComp size={14} style={{ color: resolvedConfig.accent || '#FBBF24' }} />
          <span>{resolvedConfig.tag || 'Curated'}</span>
        </div>
        <div className="travel-style-count-pill">
          {resolvedConfig.badge}
        </div>
      </div>

      <div className="travel-style-content">
        <h3 className="travel-style-title">{style.name}</h3>
        <p className="travel-style-desc-text">{style.description}</p>

        <div className="travel-style-dest-pills">
          {Array.isArray(resolvedConfig.sampleCities) && resolvedConfig.sampleCities.map((cityName, idx) => (
            <span key={idx} className="travel-style-dest-chip">
              <MapPin size={10} />
              {cityName}
            </span>
          ))}
        </div>

        <div className="travel-style-cta-bar">
          <span className="travel-style-cta-label">Explore Destinations</span>
          <div
            className="travel-style-cta-arrow-box"
            style={{
              backgroundColor: isHovered ? (resolvedConfig.accent || '#FFFFFF') : undefined,
              borderColor: isHovered ? (resolvedConfig.accent || '#FFFFFF') : undefined,
              color: isHovered ? '#FFFFFF' : undefined
            }}
          >
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
