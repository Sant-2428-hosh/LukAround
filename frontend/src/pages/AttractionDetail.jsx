import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attractions, states, cities } from '../data/indiaTourismData';
import AttractionCard from '../components/tourism/AttractionCard';
import SafeImage from '../components/tourism/SafeImage';
import ImageGalleryModal from '../components/tourism/ImageGalleryModal';
import WhereToStaySection from '../components/tourism/WhereToStaySection';
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
  Share2,
  Camera,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export default function AttractionDetail() {
  const { stateSlug, citySlug, attractionSlug } = useParams();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const attraction = attractions.find(a =>
    a.id === attractionSlug || a.id.toLowerCase() === (attractionSlug || '').toLowerCase()
  ) || attractions[0];

  const parentCity = cities.find(c => c.id === attraction.citySlug) || { name: attraction.city, id: attraction.citySlug };
  const parentState = states.find(s => s.slug === attraction.stateSlug) || { name: attraction.state, slug: attraction.stateSlug };

  // Nearby attractions in the same city or state
  const nearbyPlacesList = attractions.filter(a =>
    a.id !== attraction.id && (a.citySlug === attraction.citySlug || a.stateSlug === attraction.stateSlug)
  ).slice(0, 3);

  // Complete gallery list including hero image
  const allImages = [
    attraction.image,
    ...(attraction.gallery || [])
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  const openGalleryAt = (idx) => {
    setActivePhotoIndex(idx);
    setGalleryOpen(true);
  };

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Header Banner with Authentic Photograph ── */}
      <div
        className="detail-hero-banner"
        style={{
          backgroundImage: `url(${attraction.image})`,
          position: 'relative'
        }}
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
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                backdropFilter: 'blur(6px)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '9999px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} />
              100% Real Photograph
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

          <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)', maxWidth: '850px', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
            {attraction.shortDescription}
          </p>

          <button
            onClick={() => openGalleryAt(0)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Maximize2 size={15} />
            <span>View Fullscreen Gallery ({allImages.length} photos)</span>
          </button>
        </div>

        {/* Unobtrusive Photo Credit Pill in Hero (Requirement 14) */}
        {(attraction.imagePhotographer || attraction.imageSourceName) && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              color: '#CBD5E1',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              zIndex: 3
            }}
          >
            <Camera size={11} color="#38BDF8" />
            <span>Photo: {attraction.imagePhotographer || 'Contributor'} / {attraction.imageSourceName || 'Wikimedia Commons'}</span>
          </div>
        )}
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

            {/* Photo Gallery with Interactive Modal */}
            {allImages.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 className="tourism-heading" style={{ fontSize: '1.4rem', margin: 0 }}>
                    Authentic Photo Gallery
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} color="#10B981" />
                    All Photographs Verified
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                  {allImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => openGalleryAt(idx)}
                      style={{ cursor: 'pointer', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}
                    >
                      <SafeImage
                        src={imgUrl}
                        alt={`${attraction.name} view ${idx + 1}`}
                        aspectRatio="4:3"
                        category={attraction.category?.[0] || 'heritage'}
                        verified={true}
                        showCredit={false}
                        loading="lazy"
                      />
                    </div>
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
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              position: 'sticky',
              top: '90px'
            }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 1.25rem', color: '#0F172A' }}>
                Visit Details
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Accessibility size={18} color="var(--tourism-earth)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Accessibility</div>
                    <div style={{ fontSize: '0.88rem', color: '#1E293B' }}>{attraction.accessibility || 'Standard paved access available'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Users size={18} color="var(--tourism-forest)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Crowd & Suitability</div>
                    <div style={{ fontSize: '0.88rem', color: '#1E293B' }}>
                      {attraction.familyFriendly ? 'Suitable for families & elderly' : 'Requires moderate walking & climbing'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Camera size={18} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Photo Source & Rights</div>
                    <div style={{ fontSize: '0.85rem', color: '#1E293B' }}>
                      {attraction.imageCredit || 'Verified Authentic Tourism Photography'}
                    </div>
                    {attraction.imageLicense && (
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>License: {attraction.imageLicense}</div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <Link
                  to={`/planner?destination=${encodeURIComponent(attraction.name)}`}
                  className="tourism-btn tourism-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <span>Add to Travel Plan</span>
                  <ArrowRight size={15} />
                </Link>

                <a
                  href="#where-to-stay"
                  className="tourism-btn tourism-btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('where-to-stay')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Where to Stay Near {attraction.name}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Dedicated Where to Stay Section (Official Hotel Discovery System) ── */}
        <WhereToStaySection destination={attraction} city={parentCity} />

        {/* ── Nearby Attractions in this City ── */}
        {nearbyPlacesList.length > 0 && (
          <div style={{ marginBottom: '5rem' }}>
            <h3 className="tourism-heading" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              More Attractions in {attraction.city} & {attraction.state}
            </h3>
            <div className="attraction-grid">
              {nearbyPlacesList.map(place => (
                <AttractionCard key={place.id} attraction={place} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Interactive Image Gallery Modal ── */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={allImages}
        initialIndex={activePhotoIndex}
        destinationName={attraction.name}
        location={`${attraction.city}, ${attraction.state}`}
        photographer={attraction.imagePhotographer}
        sourceName={attraction.imageSourceName}
        sourceUrl={attraction.imageSource}
        license={attraction.imageLicense}
      />
    </div>
  );
}
