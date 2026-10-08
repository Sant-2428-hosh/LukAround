import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CityCard from '../components/tourism/CityCard';
import { cities, states, travelStyles } from '../data/indiaTourismData';
import { MapPin, Filter, Search } from 'lucide-react';

export default function Cities() {
  const [searchParams] = useSearchParams();
  const initialStyle = searchParams.get('travelStyle') || '';

  const [selectedState, setSelectedState] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = cities.filter((city) => {
    if (selectedState && city.stateSlug !== selectedState && city.state !== selectedState) {
      return false;
    }
    if (selectedStyle && !(city.travelStyles || []).includes(selectedStyle.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = city.name.toLowerCase().includes(q);
      const matchAliases = (city.aliases || []).some(a => a.toLowerCase().includes(q));
      const matchState = city.state.toLowerCase().includes(q);
      if (!matchName && !matchAliases && !matchState) return false;
    }
    return true;
  });

  return (
    <div className="tourism-page">
      <div style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '800px' }}>
          <span className="tourism-badge badge-forest" style={{ marginBottom: '0.75rem' }}>
            City Directory
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            Cities & Tourist Destinations
          </h1>
          <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Explore {cities.length} vibrant cities and destination hubs across India, featuring local culinary trails, heritage walks, and things to do.
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ marginTop: '2.5rem' }}>
        {/* Filter & Search Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--tourism-sand-border)',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          marginBottom: '2rem'
        }}>
          {/* Text search */}
          <div style={{ flex: '1 1 200px' }}>
            <input
              type="text"
              placeholder="Search by city name or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.95rem',
                borderRadius: '8px',
                border: '1px solid var(--tourism-sand-border)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Filter by State */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="filter-select"
            aria-label="Filter by state"
          >
            <option value="">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s.id} value={s.slug}>{s.name}</option>
            ))}
          </select>

          {/* Filter by Travel Style */}
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="filter-select"
            aria-label="Filter by travel style"
          >
            <option value="">All Travel Styles</option>
            {travelStyles.map((ts) => (
              <option key={ts.id} value={ts.id}>{ts.name}</option>
            ))}
          </select>

          {(selectedState || selectedStyle || searchQuery) && (
            <button
              onClick={() => { setSelectedState(''); setSelectedStyle(''); setSearchQuery(''); }}
              style={{
                background: 'none',
                border: '1px dashed #CBD5E1',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Cities Grid */}
        <div className="tourism-grid-3">
          {filteredCities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>

        {filteredCities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>No cities found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
