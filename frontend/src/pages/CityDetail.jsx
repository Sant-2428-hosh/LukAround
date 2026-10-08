import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { cities, states, attractions, itineraries } from '../data/indiaTourismData';
import AttractionCard from '../components/tourism/AttractionCard';
import ItineraryCard from '../components/tourism/ItineraryCard';
import {
  MapPin,
  Calendar,
  Clock,
  Compass,
  Utensils,
  ShoppingBag,
  PartyPopper,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function CityDetail() {
  const { stateSlug, citySlug } = useParams();

  const city = cities.find(c =>
    c.id === citySlug ||
    (c.aliases || []).some(a => a.toLowerCase().replace(/\s+/g, '-') === citySlug)
  ) || cities[0];

  const parentState = states.find(s => s.slug === city.stateSlug || s.name === city.state) || states[0];

  // Attractions in this city
  const cityAttractions = attractions.filter(a =>
    a.citySlug === city.id || a.city.toLowerCase() === city.name.toLowerCase()
  );

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Banner ── */}
      <div
        className="detail-hero-banner"
        style={{ backgroundImage: `url(${city.heroImage})` }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/states" style={{ color: '#E2E8F0', textDecoration: 'none' }}>States</Link>
            <ChevronRight size={13} />
            <Link to={`/india/${parentState.slug}`} style={{ color: '#E2E8F0', textDecoration: 'none' }}>{parentState.name}</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{city.name}</span>
          </nav>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tourism-badge badge-forest">
              {city.state}
            </span>
            <span className="tourism-badge badge-earth">
              <Clock size={12} />
              {city.recommendedDays || 2} Days Recommended
            </span>
            {city.aliases && city.aliases.length > 0 && (
              <span className="tourism-badge badge-sky">
                Also Known As: {city.aliases[0]}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900, margin: '0 0 0.85rem' }}>
            {city.name}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>
            {city.description}
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '3rem' }}>
        {/* Quick Meta Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-earth)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Best Season
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {city.bestTimeToVisit || 'October to March'}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-forest)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Recommended Stay
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {city.recommendedDays || 2} Days / {Math.max((city.recommendedDays || 2) - 1, 1)} Nights
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-sky)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Travel Styles
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.3rem' }}>
              {(city.travelStyles || []).map((style) => (
                <span
                  key={style}
                  style={{
                    backgroundColor: 'var(--tourism-sand)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    color: '#334155'
                  }}
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Key Attractions in this City ── */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="tourism-badge badge-earth">Explore the Highlights</span>
            <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
              Top Attractions in {city.name}
            </h2>
          </div>

          <div className="tourism-grid-3">
            {cityAttractions.map((attraction) => (
              <AttractionCard key={attraction.id} attraction={attraction} />
            ))}
          </div>
        </section>

        {/* ── Things To Do ── */}
        {city.thingsToDo && city.thingsToDo.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <span className="tourism-badge badge-forest">Curated Experiences</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Things to Do in {city.name}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              {city.thingsToDo.map((activity, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.1rem 1.25rem',
                    border: '1px solid var(--tourism-sand-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <CheckCircle2 size={18} color="var(--tourism-forest)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.5 }}>
                    {activity}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Food, Shopping & Festivals Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Food */}
          {city.food && city.food.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--tourism-sand-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '1rem' }}>
                <Utensils size={18} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0 }}>Famous Foods & Drinks</h3>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {city.food.map((item, idx) => (
                  <li key={idx}><strong>{item}</strong></li>
                ))}
              </ul>
            </div>
          )}

          {/* Shopping */}
          {city.shopping && city.shopping.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--tourism-sand-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', fontWeight: 800, marginBottom: '1rem' }}>
                <ShoppingBag size={18} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0 }}>Local Shopping & Crafts</h3>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {city.shopping.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Festivals */}
          {city.festivals && city.festivals.length > 0 && (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.75rem', border: '1px solid var(--tourism-sand-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, marginBottom: '1rem' }}>
                <PartyPopper size={18} />
                <h3 style={{ fontSize: '1.2rem', color: '#0F172A', margin: 0 }}>Celebrations & Festivals</h3>
              </div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {city.festivals.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Nearby Destinations ── */}
        {city.nearbyDestinations && city.nearbyDestinations.length > 0 && (
          <section style={{
            backgroundColor: 'var(--tourism-sand-light)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--tourism-sand-border)',
            marginBottom: '4rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
              Nearby Destinations from {city.name}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {city.nearbyDestinations.map((dest, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--tourism-sand-border)',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#334155'
                  }}
                >
                  🚗 {dest}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
