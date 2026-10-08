import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ItineraryCard({ itinerary }) {
  if (!itinerary) return null;

  const {
    id,
    title,
    state,
    destination,
    durationDays,
    travelStyle,
    budget,
    heroImage,
    summary,
    days = []
  } = itinerary;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid var(--tourism-sand-border)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'var(--transition-smooth)'
    }}
    className="itinerary-card"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-floating)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
    }}
    >
      <div style={{ position: 'relative', width: '100%', height: '190px' }}>
        <img
          src={heroImage}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
          fontWeight: 700
        }}>
          {durationDays} Days / {durationDays - 1} Nights
        </div>

        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: '#FFFFFF',
          color: 'var(--tourism-earth)',
          padding: '0.2rem 0.55rem',
          borderRadius: '6px',
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'capitalize'
        }}>
          {travelStyle} Style
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.8rem',
          color: 'var(--tourism-earth)',
          fontWeight: 600,
          marginBottom: '0.35rem'
        }}>
          <MapPin size={13} />
          <span>{destination} ({state})</span>
        </div>

        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '0.5rem',
          lineHeight: 1.35
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: '0.85rem',
          color: '#475569',
          lineHeight: 1.5,
          marginBottom: '1rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {summary}
        </p>

        {/* Day-by-Day Snippet */}
        <div style={{
          backgroundColor: 'var(--tourism-sand)',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.78rem',
          color: '#334155'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '0.3rem', color: '#0F172A' }}>
            Day 1 Highlight:
          </div>
          <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {days[0]?.morning || days[0]?.title}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748B', textTransform: 'capitalize' }}>
            Budget: <strong>{budget}</strong>
          </span>

          <Link
            to="/planner"
            state={{ selectedItinerary: itinerary }}
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
            <span>View Full Plan</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
