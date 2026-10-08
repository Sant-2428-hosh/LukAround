import React, { useState } from 'react';
import StateCard from '../components/tourism/StateCard';
import { states } from '../data/indiaTourismData';
import { Landmark, ArrowUpDown, Filter } from 'lucide-react';

export default function States() {
  const [sortOrder, setSortOrder] = useState('priorityRank');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredStates = states
    .filter(s =>
      s.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (s.majorCities || []).some(c => c.toLowerCase().includes(filterQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortOrder === 'name') return a.name.localeCompare(b.name);
      if (sortOrder === 'domesticVisits') return (b.domesticTouristVisits2024 || 0) - (a.domesticTouristVisits2024 || 0);
      return (a.priorityRank || 999) - (b.priorityRank || 999);
    });

  return (
    <div className="tourism-page">
      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '800px' }}>
          <span className="tourism-badge badge-forest" style={{ marginBottom: '0.75rem' }}>
            National Directory
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            States & Territories of India
          </h1>
          <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Browse high-priority Indian states with complete tourism datasets including top cities, heritage landmarks, cuisines, and travel logistics.
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ marginTop: '2.5rem' }}>
        {/* Controls Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          border: '1px solid var(--tourism-sand-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Quick Search */}
          <div style={{ flex: '1 1 250px' }}>
            <input
              type="text"
              placeholder="Search by state or city name..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--tourism-sand-border)',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
          </div>

          {/* Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={15} color="#64748B" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
              aria-label="Sort states directory"
            >
              <option value="priorityRank">Priority Rank (Default)</option>
              <option value="domesticVisits">Annual Footfall (High to Low)</option>
              <option value="name">Alphabetical (A - Z)</option>
            </select>
          </div>
        </div>

        {/* States Grid */}
        <div className="tourism-grid-3">
          {filteredStates.map((state) => (
            <StateCard key={state.id} state={state} />
          ))}
        </div>

        {filteredStates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>No states matching "{filterQuery}"</p>
            <button
              onClick={() => setFilterQuery('')}
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
              Clear Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
