import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { attractions, states, cities } from '../data/indiaTourismData';
import AttractionCard from '../components/tourism/AttractionCard';
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Compass,
  CheckCircle2,
  AlertCircle,
  Accessibility,
  Users,
  Award,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Share2
} from 'lucide-react';

export default function AttractionDetail() {
  const { stateSlug, citySlug, attractionSlug } = useParams();

  const attraction = attractions.find(a =>
    a.id === attractionSlug || a.id.toLowerCase() === (attractionSlug || '').toLowerCase()
  ) || attractions[0];

  const parentCity = cities.find(c => c.id === attraction.citySlug) || { name: attraction.city, id: attraction.citySlug };
  const parentState = states.find(s => s.slug === attraction.stateSlug) || { name: attraction.state, slug: attraction.stateSlug };

  // Nearby attractions in the same city or state
  const nearbyPlacesList = attractions.filter(a =>
    a.id !== attraction.id && (a.citySlug === attraction.citySlug || a.stateSlug === attraction.stateSlug)
  ).slice(0, 3);

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Header Banner ── */}
      <div
        className="detail-hero-banner"
        style={{ backgroundImage: `url(${attraction.image})` }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/states" style={{ color: '#E2E8F0', textDecoration: 'none' }}>States</Link>
            <ChevronRight size={13} />
            <Link to={`/india/${parentState.slug}`} style={{ color: '#E2E8F0', textDecoration: 'none' }}>{parentState.name}</Link>
            <ChevronRight size={13} />
            <Link to={`/india/${parentState.slug}/${parentCity.id}`} style={{ color: '#E2E8F0', textDecoration: 'none' }}>{parentCity.name}</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{attraction.name}</span>
          </nav>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tourism-badge badge-earth">
              {attraction.type}
            </span>
            <span className="tourism-badge badge-forest">
              {attraction.city}, {attraction.state}
            </span>
            {attraction.featured && (
              <span className="tourism-badge badge-gold">
                ★ Highly Recommended
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, margin: '0 0 0.85rem' }}>
            {attraction.name}
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)', maxWidth: '850px', lineHeight: 1.6, margin: 0 }}>
            {attraction.shortDescription}
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '3rem' }}>
        {/* ── Key Quick Stats Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-earth)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Recommended Duration
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {attraction.recommendedDuration || '2 - 3 hours'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Time Needed: {attraction.estimatedVisitTime || 'Half Day'}</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-forest)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Best Season to Visit
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
              {attraction.bestTimeToVisit || 'October to March'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Pleasant weather</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-sky)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Budget Level
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A', textTransform: 'capitalize' }}>
              {attraction.budgetLevel || 'Moderate'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              {attraction.familyFriendly ? 'Family Friendly' : 'General visitors'}
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--tourism-gold)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              Geo Coordinates
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
              {attraction.coordinates?.latitude}° N, {attraction.coordinates?.longitude}° E
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Verified GPS Location
            </div>
          </div>
        </div>

        {/* ── Main Content Layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2.5rem', marginBottom: '4rem' }}>
          <div>
            {/* Long Description */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 className="tourism-heading" style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
                About {attraction.name}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#334155' }}>
                {attraction.longDescription || attraction.shortDescription}
              </p>
            </section>

            {/* Gallery if any */}
            {attraction.gallery && attraction.gallery.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                  Photo Gallery
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                  {attraction.gallery.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt={`${attraction.name} view ${idx + 1}`}
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
                      loading="lazy"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Highlights */}
            {attraction.highlights && attraction.highlights.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                  Key Highlights & Architecture
                </h3>
                <div style={{ display: 'grid', gap: '0.65rem' }}>
                  {attraction.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '1rem 1.25rem',
                        border: '1px solid var(--tourism-sand-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <CheckCircle2 size={18} color="var(--tourism-forest)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Activities */}
            {attraction.activities && attraction.activities.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h3 className="tourism-heading" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                  Things to Do & Experiences
                </h3>
                <div style={{ display: 'grid', gap: '0.65rem' }}>
                  {attraction.activities.map((act, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '1rem 1.25rem',
                        border: '1px solid var(--tourism-sand-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <Compass size={18} color="var(--tourism-earth)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 600 }}>{act}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Travel Tips */}
            {attraction.travelTips && attraction.travelTips.length > 0 && (
              <section style={{
                backgroundColor: 'var(--tourism-sand-light)',
                borderRadius: '14px',
                padding: '1.5rem',
                border: '1px solid var(--tourism-sand-border)',
                marginBottom: '2.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: '1.1rem', color: '#0F172A' }}>Essential Visitor Tips</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  {attraction.travelTips.map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '0.4rem' }}>{tip}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ── Sidebar Details: Accessibility & Planning ── */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid var(--tourism-sand-border)',
              boxShadow: 'var(--shadow-subtle)',
              marginBottom: '1.5rem',
              position: 'sticky',
              top: '120px'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0F172A' }}>
                Visit Information
              </h3>

              {/* Accessibility */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <Accessibility size={14} color="var(--tourism-forest)" />
                  <span>Accessibility</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                  {attraction.accessibility || 'Standard paved access available.'}
                </p>
              </div>

              {/* Family Friendly */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  <Users size={14} color="var(--tourism-sky)" />
                  <span>Family Friendly</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0 }}>
                  {attraction.familyFriendly ? 'Yes, suitable for children and seniors.' : 'Moderate walking or stairs involved.'}
                </p>
              </div>

              {/* Categories & Tags */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Related Tags
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {(attraction.tags || []).map((t) => (
                    <span
                      key={t}
                      style={{
                        backgroundColor: 'var(--tourism-sand)',
                        color: '#475569',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add to Custom Planner CTA */}
              <Link
                to="/planner"
                state={{ defaultDestination: `${attraction.name}, ${attraction.city}` }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  backgroundColor: 'var(--tourism-earth)',
                  color: '#FFFFFF',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                <span>Plan Trip with this Destination</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Nearby Places Section ── */}
        {nearbyPlacesList.length > 0 && (
          <section style={{ borderTop: '1px solid var(--tourism-sand-border)', paddingTop: '3.5rem', marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-forest">Explore More</span>
              <h3 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Other Attractions Nearby in {attraction.city}
              </h3>
            </div>

            <div className="tourism-grid-3">
              {nearbyPlacesList.map((item) => (
                <AttractionCard key={item.id} attraction={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
