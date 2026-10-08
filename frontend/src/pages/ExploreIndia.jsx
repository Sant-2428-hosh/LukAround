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
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '800px' }}>
          <span className="tourism-badge badge-earth" style={{ marginBottom: '1rem' }}>
            Interactive Directory
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.85rem' }}>
            Explore India: State by State
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '2rem' }}>
            Traverse India's geographic and cultural tapestry. Select any state to uncover major cities, famous monuments, local cuisine, and verified travel logistics.
          </p>

          <SearchBar placeholder="Search any Indian destination, state, city, or temple..." />
        </div>
      </div>

      {/* ── Map Explorer Section ── */}
      <div className="tourism-container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
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
