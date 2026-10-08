import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Landmark, Flame, Palmtree, Mountain, Coffee, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Landmark,
  Flame,
  Palmtree,
  Mountain,
  Compass,
  Coffee,
  Sparkles
};

export default function CategoryCard({ category }) {
  if (!category) return null;

  const { id, name, slug, heroImage, tagline, description, count, icon } = category;
  const IconComponent = ICON_MAP[icon] || Compass;

  return (
    <Link
      to={`/categories/${slug || id}`}
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
        src={heroImage}
        alt={name}
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
