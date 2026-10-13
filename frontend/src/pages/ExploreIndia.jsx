import React, { useState } from 'react';
import MapExplorer from '../components/tourism/MapExplorer';
import SearchBar from '../components/tourism/SearchBar';
import { states, categories } from '../data/indiaTourismData';
import { Compass, MapPin, Landmark, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExploreIndia() {
  return (
    <div className="tourism-page">
      {/* ── Page Header ── */}
      <div style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -15%, rgba(200, 90, 50, 0.25) 0%, #0F172A 60%, #0B1120 100%)',
        color: '#FFFFFF',
        padding: '5rem 1.5rem 6.5rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 50,
        overflow: 'visible'
      }}>
        {/* Subtle Decorative Starburst */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <div style={{
            position: 'absolute',
            top: '-120px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(200, 90, 50, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
        </div>

        <div className="tourism-container" style={{ maxWidth: '880px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.25rem' }}>
            <span className="tourism-badge badge-earth" style={{ boxShadow: '0 0 20px rgba(200, 90, 50, 0.35)' }}>
              Official India Travel Directory
            </span>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#E2E8F0',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              border: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              16 States • 120+ Cities • 40+ UNESCO Sites
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 900,
            marginBottom: '1rem',
            letterSpacing: '-0.5px',
            lineHeight: 1.15,
            textShadow: '0 2px 14px rgba(0,0,0,0.5)'
          }}>
            Explore India: <span style={{ color: 'var(--tourism-gold, #F59E0B)' }}>State by State</span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.8vw, 1.12rem)',
            color: '#94A3B8',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
            maxWidth: '720px',
            margin: '0 auto 2.25rem'
          }}>
            Traverse India's geographic and cultural tapestry. Select any state to uncover major cities, famous monuments, authentic regional cuisines, and verified travel logistics.
          </p>

          <SearchBar placeholder="Search any Indian destination, state, city, or temple..." />

          {/* Key Geographic Quick Jump Chips */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginTop: '1.5rem'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginRight: '0.25rem' }}>
              Quick Regions:
            </span>
            {[
              { name: 'North India', state: 'uttar-pradesh' },
              { name: 'South India', state: 'tamil-nadu' },
              { name: 'West India', state: 'maharashtra' },
              { name: 'East India', state: 'west-bengal' },
              { name: 'Central India', state: 'madhya-pradesh' }
            ].map((reg) => (
              <a
                key={reg.name}
                href={`#state-directory-explorer`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById('state-directory-explorer');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Dispatch custom URL param or click if possible
                    window.history.pushState({}, '', `/explore?state=${reg.state}`);
                    window.dispatchEvent(new Event('popstate'));
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#E2E8F0',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--tourism-earth)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'var(--tourism-earth)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#E2E8F0';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {reg.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Map Explorer Section ── */}
      <div className="tourism-container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 1 }}>
        <MapExplorer />
      </div>

      {/* ── Quick Categories Grid ── */}
      <div className="tourism-container" style={{ marginTop: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="tourism-badge badge-forest">Themes & Styles</span>
          <h2 className="tourism-heading" style={{ fontSize: '2rem', marginTop: '0.4rem' }}>
            Explore by Experience Type
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem'
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.25rem',
                border: '1px solid var(--tourism-sand-border)',
                textDecoration: 'none',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: 'var(--shadow-subtle)',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--tourism-earth)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--tourism-sand-border)';
              }}
            >
              <img
                src={cat.heroImage}
                alt={cat.name}
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {cat.count}+ places to visit
                </div>
              </div>
              <ArrowRight size={15} color="var(--tourism-earth)" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
