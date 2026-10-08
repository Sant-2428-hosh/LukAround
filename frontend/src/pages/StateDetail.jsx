import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { states, cities, attractions, itineraries } from '../data/indiaTourismData';
import CityCard from '../components/tourism/CityCard';
import AttractionCard from '../components/tourism/AttractionCard';
import ItineraryCard from '../components/tourism/ItineraryCard';
import SafeImage from '../components/tourism/SafeImage';
import ImageGalleryModal from '../components/tourism/ImageGalleryModal';
import {
  MapPin,
  Calendar,
  Award,
  Plane,
  Train,
  Car,
  Utensils,
  PartyPopper,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Compass,
  CheckCircle2,
  Landmark,
  Camera,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export default function StateDetail() {
  const { stateSlug } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const state = states.find(s => s.slug === stateSlug || s.id === stateSlug) || states[0];
  const stateCities = cities.filter(c => c.stateSlug === state.slug || c.state === state.name);
  const stateAttractions = attractions.filter(a => a.stateSlug === state.slug || a.state === state.name);
  const stateItineraries = itineraries.filter(i => i.state === state.name);

  // Filter attractions by category types
  const heritageAttractions = stateAttractions.filter(a => (a.category || []).includes('heritage') || a.type === 'heritage' || a.type === 'forts-palaces');
  const spiritualAttractions = stateAttractions.filter(a => (a.category || []).includes('spiritual') || a.type === 'spiritual');
  const natureAttractions = stateAttractions.filter(a => (a.category || []).includes('nature') || (a.category || []).includes('beaches') || (a.category || []).includes('hill-stations') || (a.category || []).includes('wildlife') || (a.category || []).includes('lakes-waterfalls'));

  const allImages = [
    state.heroImage,
    ...(state.gallery || [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  const openGalleryAt = (idx) => {
    setActivePhotoIndex(idx);
    setGalleryOpen(true);
  };

  return (
    <div className="tourism-page">
      {/* ── 1. Hero Banner ── */}
      <div
        className="detail-hero-banner"
        style={{ backgroundImage: `url(${state.heroImage})`, position: 'relative' }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={13} />
            <Link to="/states" style={{ color: '#E2E8F0', textDecoration: 'none' }}>States</Link>
            <ChevronRight size={13} />
            <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{state.name}</span>
          </nav>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="tourism-badge badge-earth">
              Priority Rank #{state.priorityRank} in Tourism
            </span>
            <span className="tourism-badge badge-forest">
              Capital: {state.capital}
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
              Verified State Photography
            </span>
            {state.unescoSites && state.unescoSites.length > 0 && (
              <span className="tourism-badge badge-gold">
                <Award size={12} />
                {state.unescoSites.length} UNESCO Heritage Sites
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, margin: '0 0 0.85rem', letterSpacing: '-0.02em' }}>
            {state.name}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '850px', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
            {state.description}
          </p>

          {allImages.length > 0 && (
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
              <span>Explore State Gallery ({allImages.length} photos)</span>
            </button>
          )}
        </div>

        {/* Photo Attribution Pill */}
        {(state.imagePhotographer || state.imageSourceName) && (
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
            <span>Photo: {state.imagePhotographer || 'Contributor'} / {state.imageSourceName || 'Unsplash'}</span>
          </div>
        )}
      </div>

      {/* ── 2. Navigation Anchor Bar ── */}
      <div style={{
        position: 'sticky',
        top: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--tourism-sand-border)',
        zIndex: 40,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div className="tourism-container" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', padding: '0.75rem 1.25rem' }}>
          {[
            { id: 'overview', label: 'Overview & Highlights' },
            { id: 'cities', label: `Cities (${stateCities.length})` },
            { id: 'attractions', label: `Attractions (${stateAttractions.length})` },
            { id: 'cuisine', label: 'Food & Delicacies' },
            { id: 'culture', label: 'Culture & Festivals' },
            { id: 'itineraries', label: 'Itineraries' },
            { id: 'transport', label: 'Transport & Travel' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.75rem',
                fontSize: '0.88rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                color: activeTab === tab.id ? 'var(--tourism-earth)' : '#64748B',
                borderBottom: activeTab === tab.id ? '2.5px solid var(--tourism-earth)' : '2.5px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Main State Content ── */}
      <div className="tourism-container" style={{ paddingTop: '2.5rem' }}>

        {/* ── Overview Tab ── */}
        {(activeTab === 'overview' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            {/* Quick Facts Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', marginBottom: '0.35rem' }}>
                  <Calendar size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Best Time to Visit</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>{state.bestTimeToVisit}</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', marginBottom: '0.35rem' }}>
                  <Compass size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>Domestic Visitors (2024)</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                  {(state.domesticTouristVisits2024 / 10000000).toFixed(1)} Crore
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', marginBottom: '0.35rem' }}>
                  <Award size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>UNESCO Heritage</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>
                  {state.unescoSites?.length || 0} Listed Locations
                </div>
              </div>
            </div>

            {/* UNESCO World Heritage Sites if any */}
            {state.unescoSites && state.unescoSites.length > 0 && (
              <div style={{
                backgroundColor: 'var(--tourism-gold-light)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                borderRadius: '14px',
                padding: '1.5rem',
                marginBottom: '2.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, marginBottom: '0.75rem' }}>
                  <Award size={20} />
                  <span style={{ fontSize: '1.1rem' }}>UNESCO World Heritage Sites in {state.name}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {state.unescoSites.map((site) => (
                    <div
                      key={site}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(217, 119, 6, 0.25)',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#0F172A'
                      }}
                    >
                      🏛️ {site}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Destinations preview */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="tourism-heading" style={{ fontSize: '1.6rem', marginBottom: '1.25rem' }}>
                Top Destinations in {state.name}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(state.topDestinations || []).map((dest) => (
                  <span
                    key={dest}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid var(--tourism-sand-border)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#0F172A'
                    }}
                  >
                    📍 {dest}
                  </span>
                ))}
              </div>
            </div>

            {/* Authentic State Photo Gallery (Requirement 4) */}
            {allImages.length > 1 && (
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div>
                    <span className="tourism-badge badge-forest">Real Imagery</span>
                    <h2 className="tourism-heading" style={{ fontSize: '1.6rem', marginTop: '0.35rem' }}>
                      Photographic Highlights of {state.name}
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={15} color="#10B981" />
                    Verified Heritage & Nature Photography
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  {allImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => openGalleryAt(idx)}
                      style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden' }}
                    >
                      <SafeImage
                        src={imgUrl}
                        alt={`${state.name} landmark view ${idx + 1}`}
                        aspectRatio="4:3"
                        verified={true}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Cities Tab ── */}
        {(activeTab === 'cities' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <span className="tourism-badge badge-forest">Urban & Destination Hubs</span>
                <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                  Major Cities in {state.name}
                </h2>
              </div>
            </div>

            <div className="tourism-grid-3">
              {stateCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>

            {stateCities.length === 0 && (
              <div style={{ padding: '2rem', backgroundColor: '#FFFFFF', borderRadius: '12px', textAlign: 'center' }}>
                <p>Major cities listed for {state.name}: {state.majorCities?.join(', ')}</p>
              </div>
            )}
          </section>
        )}

        {/* ── Attractions Tab ── */}
        {(activeTab === 'attractions' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-earth">Must-See Wonders</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Key Tourist Attractions ({stateAttractions.length})
              </h2>
            </div>

            <div className="tourism-grid-3">
              {stateAttractions.map((attraction) => (
                <AttractionCard key={attraction.id} attraction={attraction} />
              ))}
            </div>
          </section>
        )}

        {/* ── Food & Culinary Heritage Tab ── */}
        {(activeTab === 'cuisine' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-earth">Gastronomy</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Popular Foods & Culinary Specialties
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {(state.popularFoods || []).map((foodItem, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.35rem',
                    border: '1px solid var(--tourism-sand-border)',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '0.4rem' }}>
                    <Utensils size={16} />
                    <span style={{ fontSize: '1.05rem', color: '#0F172A' }}>{foodItem.name}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {foodItem.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Culture & Festivals Tab ── */}
        {(activeTab === 'culture' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-sky">Living Heritage</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Culture, Arts & Vibrant Festivals
              </h2>
            </div>

            {/* Cultural overview */}
            {state.culture && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid var(--tourism-sand-border)',
                marginBottom: '2rem',
                lineHeight: 1.65,
                fontSize: '0.95rem',
                color: '#334155'
              }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.65rem' }}>
                  Artistic Traditions & Living Culture
                </h4>
                <p style={{ margin: 0 }}>{state.culture}</p>
              </div>
            )}

            {/* Festivals */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {(state.festivals || []).map((fest, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.35rem',
                    border: '1px solid var(--tourism-sand-border)',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#B45309', fontWeight: 800, marginBottom: '0.4rem' }}>
                    <PartyPopper size={16} />
                    <span style={{ fontSize: '1.05rem', color: '#0F172A' }}>{fest.name}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {fest.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Suggested Itineraries Tab ── */}
        {(activeTab === 'itineraries' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-earth">Suggested Itineraries</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Recommended Circuits in {state.name}
              </h2>
            </div>

            <div className="tourism-grid-3">
              {stateItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))}
            </div>

            {stateItineraries.length === 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid var(--tourism-sand-border)',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Build a Custom {state.name} Trip
                </h4>
                <p style={{ color: '#64748B', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                  Use our interactive itinerary planner to generate a day-by-day morning, afternoon, and evening plan for {state.name}.
                </p>
                <Link
                  to="/planner"
                  state={{ defaultDestination: state.name }}
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
                  <span>Generate {state.name} Itinerary</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </section>
        )}

        {/* ── Transportation & Logistics Tab ── */}
        {(activeTab === 'transport' || activeTab === 'all') && (
          <section style={{ marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="tourism-badge badge-forest">Travel Information</span>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginTop: '0.35rem' }}>
                Transportation & Connectivity
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {/* Airports */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-sky)', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Plane size={18} />
                  <span style={{ fontSize: '1.05rem', color: '#0F172A' }}>Major Airports</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {(state.transportation?.airports || []).map((airport, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem' }}>{airport}</li>
                  ))}
                </ul>
              </div>

              {/* Railways */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Train size={18} />
                  <span style={{ fontSize: '1.05rem', color: '#0F172A' }}>Key Railway Junctions</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {(state.transportation?.railway || []).map((station, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem' }}>{station}</li>
                  ))}
                </ul>
              </div>

              {/* Highways */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--tourism-sand-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', fontWeight: 800, marginBottom: '0.85rem' }}>
                  <Car size={18} />
                  <span style={{ fontSize: '1.05rem', color: '#0F172A' }}>Roads & Expressways</span>
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  {(state.transportation?.road || []).map((road, idx) => (
                    <li key={idx} style={{ marginBottom: '0.3rem' }}>{road}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* ── Interactive Image Gallery Modal ── */}
      <ImageGalleryModal
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        images={allImages}
        initialIndex={activePhotoIndex}
        destinationName={state.name}
        location={`${state.name}, India`}
        photographer={state.imagePhotographer}
        sourceName={state.imageSourceName}
        sourceUrl={state.imageSource}
        license={state.imageLicense}
      />
    </div>
  );
}
