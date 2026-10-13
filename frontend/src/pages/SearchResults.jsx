import React, { useState } from 'react';
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

  // 1. States scoring
  const scoredStates = (states || []).map(s => {
    let score = 0;
    const name = s.name.toLowerCase();
    const words = name.split(/\s+/);
    if (name === qLower) score = 100;
    else if (name.startsWith(qLower)) score = 95;
    else if (words.some(w => w.startsWith(qLower))) score = 90;
    else if ((s.majorCities || []).some(c => c.toLowerCase().startsWith(qLower))) score = 50;
    else if (qLower.length >= 3 && name.includes(qLower)) score = 30;
    else if (qLower.length >= 3 && (s.majorCities || []).some(c => c.toLowerCase().includes(qLower))) score = 25;
    else if (qLower.length >= 3 && s.description && s.description.toLowerCase().includes(qLower)) score = 20;
    return { item: s, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || (a.item.priorityRank || 99) - (b.item.priorityRank || 99));

  const matchedStates = scoredStates.map(x => x.item);

  // 2. Cities scoring
  const scoredCities = (cities || []).map(c => {
    let score = 0;
    const name = c.name.toLowerCase();
    const words = name.split(/\s+/);
    const state = (c.state || '').toLowerCase();
    if (name === qLower) score = 100;
    else if (name.startsWith(qLower)) score = 95;
    else if (words.some(w => w.startsWith(qLower))) score = 90;
    else if ((c.aliases || []).some(a => a.toLowerCase().startsWith(qLower))) score = 85;
    else if (state === qLower) score = 45;
    else if (state.startsWith(qLower)) score = 40;
    else if (qLower.length >= 3 && name.includes(qLower)) score = 30;
    else if (qLower.length >= 3 && (c.aliases || []).some(a => a.toLowerCase().includes(qLower))) score = 25;
    else if (qLower.length >= 3 && state.includes(qLower)) score = 15;
    return { item: c, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || (a.item.priorityRank || 99) - (b.item.priorityRank || 99));

  const matchedCities = scoredCities.map(x => x.item);

  // 3. Attractions scoring
  const scoredAttractions = (attractions || []).map(a => {
    let score = 0;
    const name = a.name.toLowerCase();
    const words = name.split(/[\s\-()]+/).filter(Boolean);
    const city = (a.city || '').toLowerCase();
    const state = (a.state || '').toLowerCase();

    if (name === qLower) score = 100;
    else if (name.startsWith(qLower)) score = 95;
    else if (words.some(w => w.startsWith(qLower))) score = 90;
    else if ((a.aliases || []).some(al => al.toLowerCase().startsWith(qLower))) score = 85;
    else if (city === qLower) score = 55;
    else if (city.startsWith(qLower)) score = 50;
    else if (state === qLower) score = 30 + (a.featured ? 10 : 0);
    else if (state.startsWith(qLower)) score = 25 + (a.featured ? 10 : 0);
    else if ((a.tags || []).some(t => t.toLowerCase() === qLower)) score = 15;
    else if ((a.tags || []).some(t => t.toLowerCase().startsWith(qLower))) score = 12;
    else if (qLower.length >= 3 && name.includes(qLower)) score = 35;
    else if (qLower.length >= 3 && (a.category || []).some(cat => cat.toLowerCase().includes(qLower))) score = 18;
    else if (qLower.length >= 3 && (a.tags || []).some(t => t.toLowerCase().includes(qLower))) score = 8;

    return { item: a, score };
  }).filter(x => x.score > 0).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (Boolean(a.item.featured) !== Boolean(b.item.featured)) {
      return a.item.featured ? -1 : 1;
    }
    return (a.item.priorityRank || 99) - (b.item.priorityRank || 99);
  });

  const matchedAttractions = scoredAttractions.map(x => x.item);

  // 4. Categories scoring
  const scoredCategories = (categories || []).map(cat => {
    let score = 0;
    const name = cat.name.toLowerCase();
    const id = cat.id.toLowerCase();
    if (name === qLower || id === qLower) score = 100;
    else if (name.startsWith(qLower) || id.startsWith(qLower)) score = 95;
    else if (name.includes(qLower) || id.includes(qLower)) score = 75;
    else if (cat.description && cat.description.toLowerCase().includes(qLower)) score = 30;
    return { item: cat, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score);

  const matchedCategories = scoredCategories.map(x => x.item);

  const totalCount = matchedStates.length + matchedCities.length + matchedAttractions.length + matchedCategories.length;

  const maxScores = {
    states: scoredStates[0]?.score || 0,
    cities: scoredCities[0]?.score || 0,
    attractions: scoredAttractions[0]?.score || 0,
    categories: scoredCategories[0]?.score || 0
  };

  const defaultPriority = { states: 4, cities: 3, attractions: 2, categories: 1 };
  const sectionOrder = ['states', 'cities', 'attractions', 'categories'].sort((a, b) => {
    const diff = (maxScores[b] || 0) - (maxScores[a] || 0);
    if (diff !== 0) return diff;
    return (defaultPriority[b] || 0) - (defaultPriority[a] || 0);
  });

  const tabs = [
    { id: 'all', label: `All Results (${totalCount})` },
    ...sectionOrder.map(secKey => {
      if (secKey === 'states') return { id: 'states', label: `States (${matchedStates.length})` };
      if (secKey === 'cities') return { id: 'cities', label: `Cities (${matchedCities.length})` };
      if (secKey === 'attractions') return { id: 'attractions', label: `Attractions (${matchedAttractions.length})` };
      if (secKey === 'categories') return { id: 'categories', label: `Categories (${matchedCategories.length})` };
      return null;
    }).filter(Boolean)
  ];

  return (
    <div className="tourism-page">
      {/* ── Search Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 50,
        overflow: 'visible'
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
          {tabs.map((tab) => (
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

        {/* Dynamic Section Ordering */}
        {sectionOrder.map((secKey) => {
          // ── STATES RESULTS ──
          if ((activeTab === 'all' || activeTab === 'states') && secKey === 'states' && matchedStates.length > 0) {
            return (
              <section key="states-section" style={{ marginBottom: '3.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  States of India ({matchedStates.length})
                </h3>
                <div className="tourism-grid-3">
                  {matchedStates.map((s) => (
                    <StateCard key={s.id} state={s} />
                  ))}
                </div>
              </section>
            );
          }

          // ── CITIES RESULTS ──
          if ((activeTab === 'all' || activeTab === 'cities') && secKey === 'cities' && matchedCities.length > 0) {
            return (
              <section key="cities-section" style={{ marginBottom: '3.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  Cities & Destinations ({matchedCities.length})
                </h3>
                <div className="tourism-grid-3">
                  {matchedCities.map((c) => (
                    <CityCard key={c.id} city={c} />
                  ))}
                </div>
              </section>
            );
          }

          // ── ATTRACTIONS RESULTS ──
          if ((activeTab === 'all' || activeTab === 'attractions') && secKey === 'attractions' && matchedAttractions.length > 0) {
            return (
              <section key="attractions-section" style={{ marginBottom: '3.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  Tourist Attractions ({matchedAttractions.length})
                </h3>
                <div className="tourism-grid-4">
                  {matchedAttractions.map((a) => (
                    <AttractionCard key={a.id} attraction={a} />
                  ))}
                </div>
              </section>
            );
          }

          // ── CATEGORIES RESULTS ──
          if ((activeTab === 'all' || activeTab === 'categories') && secKey === 'categories' && matchedCategories.length > 0) {
            return (
              <section key="categories-section" style={{ marginBottom: '3.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
                  Matching Categories ({matchedCategories.length})
                </h3>
                <div className="tourism-grid-4">
                  {matchedCategories.map((cat) => (
                    <CategoryCard key={cat.id} category={cat} />
                  ))}
                </div>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
