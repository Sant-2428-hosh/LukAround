import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchBar from '../components/tourism/SearchBar';
import StateCard from '../components/tourism/StateCard';
import CityCard from '../components/tourism/CityCard';
import AttractionCard from '../components/tourism/AttractionCard';
import CategoryCard from '../components/tourism/CategoryCard';
import { states, cities, attractions, categories } from '../data/indiaTourismData';
import { Search, MapPin, Landmark, Compass, Award } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').trim();
  const [activeTab, setActiveTab] = useState('all');

  const qLower = query.toLowerCase();

  // Fuzzy filter
  const matchedStates = states.filter(s =>
    s.name.toLowerCase().includes(qLower) ||
    s.description.toLowerCase().includes(qLower) ||
    (s.majorCities || []).some(c => c.toLowerCase().includes(qLower)) ||
    (s.categories || []).some(cat => cat.toLowerCase().includes(qLower))
  );

  const matchedCities = cities.filter(c =>
    c.name.toLowerCase().includes(qLower) ||
    (c.aliases || []).some(a => a.toLowerCase().includes(qLower)) ||
    c.state.toLowerCase().includes(qLower) ||
    c.description.toLowerCase().includes(qLower) ||
    (c.thingsToDo || []).some(t => t.toLowerCase().includes(qLower))
  );

  const matchedAttractions = attractions.filter(a =>
    a.name.toLowerCase().includes(qLower) ||
    a.city.toLowerCase().includes(qLower) ||
    a.state.toLowerCase().includes(qLower) ||
    a.shortDescription.toLowerCase().includes(qLower) ||
    (a.category || []).some(cat => cat.toLowerCase().includes(qLower)) ||
    (a.tags || []).some(t => t.toLowerCase().includes(qLower)) ||
    (a.activities || []).some(act => act.toLowerCase().includes(qLower))
  );

  const matchedCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(qLower) ||
    cat.id.toLowerCase().includes(qLower) ||
    cat.description.toLowerCase().includes(qLower)
  );

  const totalCount = matchedStates.length + matchedCities.length + matchedAttractions.length + matchedCategories.length;

  return (
    <div className="tourism-page">
      {/* ── Search Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, marginBottom: '1.25rem' }}>
            Search Results for "{query || 'All'}"
          </h1>

          <SearchBar autoFocus={false} placeholder="Search destinations, cities, temples, beaches..." />

          <div style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: '#94A3B8' }}>
            Found <strong>{totalCount}</strong> matching destinations and experiences
          </div>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '2.5rem' }}>
        {/* Results Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--tourism-sand-border)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'all', label: `All Results (${totalCount})` },
            { id: 'attractions', label: `Attractions (${matchedAttractions.length})` },
            { id: 'cities', label: `Cities (${matchedCities.length})` },
            { id: 'states', label: `States (${matchedStates.length})` },
            { id: 'categories', label: `Categories (${matchedCategories.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--tourism-earth)' : '#FFFFFF',
                color: activeTab === tab.id ? '#FFFFFF' : '#475569',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--tourism-earth)' : 'var(--tourism-sand-border)',
                borderRadius: '9999px',
                padding: '0.45rem 1rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {totalCount === 0 && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--tourism-sand-border)'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              No exact match found for "{query}"
            </h3>
            <p style={{ color: '#64748B', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              Try searching by state name (e.g., "Tamil Nadu", "Rajasthan"), landmark (e.g., "Taj Mahal"), or category ("Beaches", "Wildlife").
            </p>
            <Link
              to="/attractions"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--tourism-earth)',
                color: '#FFFFFF',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <span>Browse All Tourist Attractions</span>
            </Link>
          </div>
        )}

        {/* ── Attractions Results ── */}
        {(activeTab === 'all' || activeTab === 'attractions') && matchedAttractions.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              Tourist Attractions ({matchedAttractions.length})
            </h3>
            <div className="tourism-grid-4">
              {matchedAttractions.map((a) => (
                <AttractionCard key={a.id} attraction={a} />
              ))}
            </div>
          </section>
        )}

        {/* ── Cities Results ── */}
        {(activeTab === 'all' || activeTab === 'cities') && matchedCities.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              Cities & Destinations ({matchedCities.length})
            </h3>
            <div className="tourism-grid-3">
              {matchedCities.map((c) => (
                <CityCard key={c.id} city={c} />
              ))}
            </div>
          </section>
        )}

        {/* ── States Results ── */}
        {(activeTab === 'all' || activeTab === 'states') && matchedStates.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              States of India ({matchedStates.length})
            </h3>
            <div className="tourism-grid-3">
              {matchedStates.map((s) => (
                <StateCard key={s.id} state={s} />
              ))}
            </div>
          </section>
        )}

        {/* ── Categories Results ── */}
        {(activeTab === 'all' || activeTab === 'categories') && matchedCategories.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              Matching Categories ({matchedCategories.length})
            </h3>
            <div className="tourism-grid-4">
              {matchedCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
