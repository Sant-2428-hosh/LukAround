import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Landmark, Flame, Palmtree, Mountain, Coffee, Sparkles } from 'lucide-react';
import { recordCardClick } from '../common/ScrollToTop';

const ICON_MAP = {
  Landmark,
  Flame,
  Palmtree,
  Mountain,
  Compass,
  Coffee,
  Sparkles
};

const CATEGORY_FALLBACKS = {
  heritage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  spiritual: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  beaches: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'hill-stations': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  wildlife: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  adventure: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
};

export default function CategoryCard({ category }) {
  if (!category) return null;

  const { id, name, slug, heroImage, tagline, description, count, icon } = category;
  const targetId = slug || id;
  const IconComponent = ICON_MAP[icon] || Compass;

  const defaultImg = heroImage || CATEGORY_FALLBACKS[targetId] || CATEGORY_FALLBACKS.default;
  const [imgSrc, setImgSrc] = useState(defaultImg);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImageError = () => {
    if (!imgFailed) {
      setImgFailed(true);
      const fallbackUrl = CATEGORY_FALLBACKS[targetId] || CATEGORY_FALLBACKS[id] || CATEGORY_FALLBACKS.default;
      setImgSrc(fallbackUrl);
    }
  };

  return (
    <Link
      to={`/categories/${targetId}`}
      id={`category-${targetId}`}
      data-place-id={targetId}
      onClick={() => recordCardClick(targetId)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '320px',
        borderRadius: '16px',
        overflow: 'hidden',
        textDecoration: 'none',
        color: '#FFFFFF',
        backgroundColor: '#0F172A',
        boxShadow: 'var(--shadow-subtle)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      className="category-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-floating)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
      }}
    >
      {/* Background Image with Gradient Overlay */}
      <img
        src={imgSrc}
        alt={name}
        onError={handleImageError}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s ease'
        }}
        loading="lazy"
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.1) 0%, rgba(15, 23, 42, 0.85) 85%)'
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '1.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          padding: '0.3rem 0.65rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: 700,
          marginBottom: '0.65rem'
        }}>
          <IconComponent size={13} />
          <span>{count}+ Destinations</span>
        </div>

        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          marginBottom: '0.35rem',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.01em'
        }}>
          {name}
        </h3>

        <p style={{
          fontSize: '0.82rem',
          color: 'rgba(255, 255, 255, 0.85)',
          lineHeight: 1.45,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {description}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#FDBA74'
        }}>
          <span>Explore Category</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
