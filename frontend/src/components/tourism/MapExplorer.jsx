import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, Award, Calendar, ArrowRight, ChevronRight, ExternalLink } from 'lucide-react';
import { states, cities, attractions, itineraries } from '../../data/indiaTourismData';

export default function MapExplorer() {
  const [selectedStateSlug, setSelectedStateSlug] = useState('uttar-pradesh');

  const selectedState = states.find(s => s.slug === selectedStateSlug) || states[0];
  const stateCities = cities.filter(c => c.stateSlug === selectedState.slug || c.state === selectedState.name);
  const stateAttractions = attractions.filter(a => a.stateSlug === selectedState.slug || a.state === selectedState.name);
  const stateItinerary = itineraries.find(i => i.state === selectedState.name) || itineraries[0];

  return (
    <div className="map-explorer-container">
      {/* ── Left Sidebar: State Selector ── */}
      <div className="map-sidebar">
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--tourism-earth)', letterSpacing: '0.5px' }}>
            Interactive Directory
          </span>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
            Select Indian State
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Choose a destination to preview cities, monuments & itineraries
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {states.map((state) => {
            const isActive = state.slug === selectedStateSlug;
            return (
              <div
                key={state.id}
                onClick={() => setSelectedStateSlug(state.slug)}
                className={`map-state-list-item ${isActive ? 'active' : ''}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--tourism-earth)' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {state.priorityRank}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                      {state.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      {state.majorCities?.length} Cities • {state.topDestinations?.length} Key Sights
                    </div>
                  </div>
                </div>

                <ChevronRight size={15} color={isActive ? 'var(--tourism-earth)' : '#94A3B8'} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Content Area: State Overview & City/Attraction Drill-Down ── */}
      <div className="map-details-view">
        {/* State Banner Preview */}
        <div style={{
          position: 'relative',
          height: '200px',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-subtle)'
        }}>
          <img
            src={selectedState.heroImage}
            alt={selectedState.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '1.5rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                marginBottom: '0.4rem'
              }}>
                Priority Rank #{selectedState.priorityRank} • Capital: {selectedState.capital}
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                {selectedState.name}
              </h2>
            </div>
          </div>
        </div>

        {/* State Description */}
        <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#475569', marginBottom: '1.5rem' }}>
          {selectedState.description}
        </p>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ backgroundColor: 'var(--tourism-sand)', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Best Season to Visit</div>
            <div style={{ fontWeight: 800, color: 'var(--tourism-earth)', fontSize: '0.95rem' }}>
              {selectedState.bestTimeToVisit}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--tourism-sand)', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Annual Domestic Visitors</div>
            <div style={{ fontWeight: 800, color: 'var(--tourism-forest)', fontSize: '0.95rem' }}>
              {(selectedState.domesticTouristVisits2024 / 10000000).toFixed(1)} Crore (2024)
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--tourism-sand)', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Key UNESCO Sites</div>
            <div style={{ fontWeight: 800, color: 'var(--tourism-sky)', fontSize: '0.95rem' }}>
              {selectedState.unescoSites?.length || 0} World Heritage Sites
            </div>
          </div>
        </div>

        {/* Major Cities Preview */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Major Tourist Cities ({stateCities.length})
            </h4>
            <Link to="/cities" style={{ fontSize: '0.8rem', color: 'var(--tourism-earth)', fontWeight: 700, textDecoration: 'none' }}>
              View All Cities →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.65rem' }}>
            {stateCities.slice(0, 6).map((city) => (
              <Link
                key={city.id}
                to={`/india/${selectedState.slug}/${city.id}`}
                style={{
                  display: 'block',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--tourism-sand-border)',
                  borderRadius: '10px',
                  padding: '0.65rem',
                  textDecoration: 'none',
                  color: '#0F172A',
                  transition: 'border-color 0.2s ease, transform 0.2s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{city.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{city.recommendedDays || 2} Days</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Attractions Preview */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Top Attractions ({stateAttractions.length})
            </h4>
            <Link to="/attractions" style={{ fontSize: '0.8rem', color: 'var(--tourism-earth)', fontWeight: 700, textDecoration: 'none' }}>
              View All Attractions →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
            {stateAttractions.slice(0, 4).map((attr) => (
              <Link
                key={attr.id}
                to={`/india/${selectedState.slug}/${attr.citySlug}/${attr.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--tourism-sand-border)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  textDecoration: 'none',
                  color: '#0F172A'
                }}
              >
                <img src={attr.image} alt={attr.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {attr.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{attr.city}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended Itinerary Snippet */}
        {stateItinerary && (
          <div style={{
            backgroundColor: 'var(--tourism-sand-light)',
            border: '1px solid var(--tourism-sand-border)',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--tourism-earth)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              <Calendar size={13} />
              <span>Recommended State Itinerary</span>
            </div>
            <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.4rem 0' }}>
              {stateItinerary.title}
            </h5>
            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, margin: '0 0 0.85rem 0' }}>
              {stateItinerary.summary}
            </p>
            <Link
              to="/planner"
              state={{ selectedItinerary: stateItinerary }}
              style={{
                fontSize: '0.82rem',
                color: 'var(--tourism-earth)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>Explore this {stateItinerary.durationDays}-Day Itinerary</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Explore Full State Details Button */}
        <Link
          to={`/india/${selectedState.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--tourism-earth)',
            color: '#FFFFFF',
            padding: '0.85rem 1.75rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.95rem',
            textDecoration: 'none',
            alignSelf: 'flex-start'
          }}
        >
          <span>Complete Guide to {selectedState.name}</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
