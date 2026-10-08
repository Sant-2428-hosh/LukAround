import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { states, categories, travelStyles } from '../../data/indiaTourismData';

export default function FilterPanel({ filters, onFilterChange, onReset }) {
  const {
    stateSlug = '',
    category = '',
    budget = '',
    travelStyle = '',
    duration = '',
    familyFriendlyOnly = false
  } = filters;

  return (
    <div className="tourism-filter-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A', fontWeight: 700, fontSize: '0.9rem', marginRight: '0.5rem' }}>
        <Filter size={16} color="var(--tourism-earth)" />
        <span>Filters:</span>
      </div>

      {/* State Filter */}
      <select
        value={stateSlug}
        onChange={(e) => onFilterChange('stateSlug', e.target.value)}
        className="filter-select"
        aria-label="Filter by Indian State"
      >
        <option value="">All States ({states.length})</option>
        {states.map((s) => (
          <option key={s.id} value={s.slug}>{s.name}</option>
        ))}
      </select>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => onFilterChange('category', e.target.value)}
        className="filter-select"
        aria-label="Filter by Category"
      >
        <option value="">All Categories ({categories.length})</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>

      {/* Travel Style Filter */}
      <select
        value={travelStyle}
        onChange={(e) => onFilterChange('travelStyle', e.target.value)}
        className="filter-select"
        aria-label="Filter by Travel Style"
      >
        <option value="">All Travel Styles</option>
        {travelStyles.map((ts) => (
          <option key={ts.id} value={ts.id}>{ts.name}</option>
        ))}
      </select>

      {/* Budget Filter */}
      <select
        value={budget}
        onChange={(e) => onFilterChange('budget', e.target.value)}
        className="filter-select"
        aria-label="Filter by Budget"
      >
        <option value="">Any Budget</option>
        <option value="free">Free Entry</option>
        <option value="budget">Budget Friendly</option>
        <option value="moderate">Moderate</option>
        <option value="luxury">Luxury</option>
      </select>

      {/* Family Friendly Toggle */}
      <label style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: '#334155',
        cursor: 'pointer',
        userSelect: 'none',
        padding: '0.4rem 0.65rem',
        borderRadius: '8px',
        backgroundColor: familyFriendlyOnly ? 'var(--tourism-forest-light)' : 'transparent',
        border: `1px solid ${familyFriendlyOnly ? 'var(--tourism-forest)' : 'transparent'}`
      }}>
        <input
          type="checkbox"
          checked={familyFriendlyOnly}
          onChange={(e) => onFilterChange('familyFriendlyOnly', e.target.checked)}
          style={{ accentColor: 'var(--tourism-forest)' }}
        />
        <span>Family Friendly Only</span>
      </label>

      {/* Reset Filters button */}
      {(stateSlug || category || budget || travelStyle || duration || familyFriendlyOnly) && (
        <button
          type="button"
          onClick={onReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.45rem 0.85rem',
            background: 'none',
            border: '1px dashed #CBD5E1',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#64748B',
            cursor: 'pointer',
            marginLeft: 'auto'
          }}
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
}
