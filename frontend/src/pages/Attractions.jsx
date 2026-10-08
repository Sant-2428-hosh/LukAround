import React, { useState } from 'react';
import AttractionCard from '../components/tourism/AttractionCard';
import FilterPanel from '../components/tourism/FilterPanel';
import { attractions } from '../data/indiaTourismData';

export default function Attractions() {
  const [filters, setFilters] = useState({
    stateSlug: '',
    category: '',
    budget: '',
    travelStyle: '',
    duration: '',
    familyFriendlyOnly: false
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      stateSlug: '',
      category: '',
      budget: '',
      travelStyle: '',
      duration: '',
      familyFriendlyOnly: false
    });
    setSearchQuery('');
  };

  const filteredAttractions = attractions.filter(a => {
    if (filters.stateSlug && a.stateSlug !== filters.stateSlug) return false;
    if (filters.category && !(a.category || []).includes(filters.category) && a.type !== filters.category) return false;
    if (filters.budget && a.budgetLevel !== filters.budget) return false;
    if (filters.familyFriendlyOnly && a.familyFriendly !== true) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q);
      const matchCity = a.city.toLowerCase().includes(q);
      const matchState = a.state.toLowerCase().includes(q);
      const matchTag = (a.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchCity && !matchState && !matchTag) return false;
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
          <span className="tourism-badge badge-earth" style={{ marginBottom: '0.75rem' }}>
            Destinations & Sights
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            Tourist Attractions of India
          </h1>
          <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Browse through {attractions.length} verified historic monuments, spiritual temples, beaches, national parks, and geological wonders.
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ marginTop: '2.5rem' }}>
        {/* Quick Search and Filter Bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Search attractions by name, location, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid var(--tourism-sand-border)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.95rem',
              outline: 'none',
              marginBottom: '1rem',
              boxShadow: 'var(--shadow-subtle)'
            }}
          />

          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
            Showing <strong>{filteredAttractions.length}</strong> of {attractions.length} places
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="tourism-grid-4">
          {filteredAttractions.map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>

        {filteredAttractions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>No attractions found matching the selected filters.</p>
            <button
              onClick={handleReset}
              style={{
                marginTop: '1rem',
                backgroundColor: 'var(--tourism-earth)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
