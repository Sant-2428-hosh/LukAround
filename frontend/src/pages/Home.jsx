import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/tourism/SearchBar';
import StateCard from '../components/tourism/StateCard';
import AttractionCard from '../components/tourism/AttractionCard';
import CategoryCard from '../components/tourism/CategoryCard';
import ItineraryCard from '../components/tourism/ItineraryCard';
import MapExplorer from '../components/tourism/MapExplorer';
import {
  states, cities, attractions, categories, travelStyles, itineraries
} from '../data/indiaTourismData';
import {
  Compass, MapPin, ArrowRight, Sparkles, Award, Calendar,
  CheckCircle2, Flame, Star, Globe, Zap
} from 'lucide-react';

function useCounter(target, duration) {
  if (duration === undefined) duration = 1800;
  const [count, setCount] = useState(0);
  useEffect(function() {
    var start = 0;
    var step = target / (duration / 16);
    var timer = setInterval(function() {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return function() { clearInterval(timer); };
  }, [target, duration]);
  return count;
}

function StatCounter(props) {
  var value = props.value;
  var suffix = props.suffix || '';
  var label = props.label;
  var color = props.color;
  var count = useCounter(parseInt(value));
  return (
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: '2.2rem', fontWeight: 900, color: color, letterSpacing: '-0.04em', lineHeight: 1 } },
        count, suffix
      ),
      React.createElement('div', { style: { fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: '0.3rem' } },
        label
      )
    )
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [selectedStateForJump, setSelectedStateForJump] = useState('');
  const [stateSortOrder, setStateSortOrder] = useState('priorityRank');
  const [attractionFilter, setAttractionFilter] = useState('all');
  const [hoveredStyle, setHoveredStyle] = useState(null);

  const sortedStates = [...states].sort(function(a, b) {
    if (stateSortOrder === 'name') return a.name.localeCompare(b.name);
    if (stateSortOrder === 'domesticVisits') return (b.domesticTouristVisits2024 || 0) - (a.domesticTouristVisits2024 || 0);
    return (a.priorityRank || 999) - (b.priorityRank || 999);
  });

  const featuredAttractions = attractions.filter(function(a) {
    if (attractionFilter === 'all') return a.featured === true;
    return (a.category || []).includes(attractionFilter) || a.type === attractionFilter;
  }).slice(0, 8);

  const handleStateJump = function(e) {
    e.preventDefault();
    if (selectedStateForJump) navigate('/india/' + selectedStateForJump);
  };

  const FILTER_TABS = [
    { id: 'all', label: '✦ All Wonders' },
    { id: 'heritage', label: '🏰 Heritage' },
    { id: 'spiritual', label: '🛕 Spiritual' },
    { id: 'beaches', label: '🌊 Coastal' },
    { id: 'wildlife', label: '🐅 Wild' },
  ];

  return (
    <div className="tourism-page">

      {/* ══ 1. CINEMATIC HERO ══ */}
      <section className="tourism-hero-epic">
        <div className="hero-particle-1" />
        <div className="hero-particle-2" />
        <div className="hero-particle-3" />

        <div className="tourism-hero-content-epic">

          <div className="hero-trust-badge">
            <Sparkles size={13} color="#FDBA74" />
            <span>India's Most Comprehensive Travel Discovery Platform</span>
            <span className="hero-badge-dot" />
            <span style={{ color: '#86EFAC', fontWeight: 800 }}>15 States · 77 Cities · 198+ Wonders</span>
          </div>

          <h1 className="tourism-hero-title-epic">
            <span className="hero-title-line-1">Where Every</span>
            <span className="hero-title-line-2">Horizon Holds</span>
            <span className="hero-title-line-3">
              <span className="hero-title-gradient">a Story</span>
            </span>
          </h1>

          <p className="tourism-hero-subtitle-epic">
            From the snow-kissed peaks of the Himalayas to the sun-drenched shores of Kerala —
            unlock the raw, unfiltered soul of <strong>Incredible India</strong> through
            curated journeys, hidden sanctuaries, and timeless wonders that will leave you breathless.
          </p>

          <div className="hero-search-wrapper">
            <SearchBar placeholder="Search a state, monument, beach, hill station or experience..." />
          </div>

          <form onSubmit={handleStateJump} className="hero-state-selector">
            <Globe size={14} color="rgba(255,255,255,0.6)" />
            <span className="hero-selector-label">Teleport to →</span>
            <select
              value={selectedStateForJump}
              onChange={(e) => setSelectedStateForJump(e.target.value)}
              className="hero-state-select"
              aria-label="Select an Indian state"
            >
              <option value="" style={{ color: '#0F172A' }}>Choose a State…</option>
              {states.map((s) => (
                <option key={s.id} value={s.slug} style={{ color: '#0F172A' }}>
                  #{s.priorityRank} {s.name}
                </option>
              ))}
            </select>
            <button type="submit" disabled={!selectedStateForJump} className="hero-state-btn">
              <Zap size={14} />
              Explore Now
            </button>
          </form>

          <div className="hero-category-pills">
            <Link to="/categories/heritage" className="hero-pill-btn">🏰 Ancient Heritage</Link>
            <Link to="/categories/beaches" className="hero-pill-btn">🌊 Coastal Escapes</Link>
            <Link to="/categories/hill-stations" className="hero-pill-btn">⛰️ Misty Highlands</Link>
            <Link to="/categories/wildlife" className="hero-pill-btn">🐅 Wild Sanctuaries</Link>
            <Link to="/categories/spiritual" className="hero-pill-btn">🛕 Sacred Temples</Link>
            <Link to="/categories/adventure" className="hero-pill-btn">🛶 Thrill & Adventure</Link>
            <Link to="/categories/food" className="hero-pill-btn">🍲 Culinary Trails</Link>
            <Link to="/categories/culture" className="hero-pill-btn">🎭 Living Culture</Link>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <div className="hero-scroll-line" />
          <span>Scroll to Discover</span>
        </div>
      </section>

      {/* ══ 2. CREDIBILITY METRICS ══ */}
      <section className="metrics-strip">
        <div className="tourism-container">
          <div className="metrics-grid">
            <div className="metric-item">
              <div className="metric-icon" style={{ backgroundColor: '#FCEEE8', color: '#C85A32' }}>🏛️</div>
              <StatCounter value={15} label="Sovereign States Charted" color="#C85A32" />
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-icon" style={{ backgroundColor: '#CCFBF1', color: '#0D9488' }}>🌆</div>
              <StatCounter value={77} label="Iconic Destination Cities" color="#0D9488" />
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-icon" style={{ backgroundColor: '#E0F2FE', color: '#0284C7' }}>✨</div>
              <StatCounter value={198} suffix="+" label="Verified Masterpiece Attractions" color="#0284C7" />
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-icon" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>🏆</div>
              <StatCounter value={42} suffix="+" label="UNESCO World Heritage Sites" color="#D97706" />
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-icon" style={{ backgroundColor: '#F3E8FF', color: '#9333EA' }}>🗺️</div>
              <StatCounter value={6} label="Curated Signature Itineraries" color="#9333EA" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. INTERACTIVE MAP EXPLORER ══ */}
      <section className="section-explore-map">
        <div className="tourism-container">
          <div className="section-header-centered">
            <span className="tourism-badge badge-earth"><Globe size={11} /> Interactive State Map & Directory</span>
            <h2 className="tourism-heading section-heading-xl">
              Chart Your Own Course<br />
              <span style={{ color: 'var(--tourism-earth)' }}>Across the Subcontinent</span>
            </h2>
            <p className="tourism-subtitle section-subtitle-center">
              Click any state on the map to instantly preview its crown jewels — legendary forts,
              serpentine backwaters, tiger reserves, and the local flavours that define a civilisation.
            </p>
          </div>
          <div style={{ marginTop: '2.5rem' }}>
            <MapExplorer />
          </div>
        </div>
      </section>

      {/* ══ 4. THE MAGNIFICENT 15 STATES ══ */}
      <section className="section-states">
        <div className="tourism-container">
          <div className="section-header-split">
            <div>
              <span className="tourism-badge badge-forest"><Award size={11} /> The Magnificent 15</span>
              <h2 className="tourism-heading section-heading-xl">
                India's Most Breathtaking<br />
                <span style={{ color: 'var(--tourism-forest)' }}>Tourism Destinations</span>
              </h2>
              <p className="tourism-subtitle" style={{ maxWidth: '520px' }}>
                Painstakingly ranked by domestic footfall, UNESCO heritage density,
                and sheer magnitude of natural and cultural grandeur.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Rank By</span>
              <select value={stateSortOrder} onChange={(e) => setStateSortOrder(e.target.value)} className="filter-select" aria-label="Sort states">
                <option value="priorityRank">✦ Tourism Priority (Default)</option>
                <option value="domesticVisits">📊 Annual Tourist Footfall</option>
                <option value="name">🔤 Alphabetical (A → Z)</option>
              </select>
            </div>
          </div>
          <div className="tourism-grid-3" style={{ marginTop: '2.5rem' }}>
            {sortedStates.map((state) => (<StateCard key={state.id} state={state} />))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/states" className="cta-btn-primary">
              <Compass size={17} />
              <span>Unveil All 28 States & 8 Union Territories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 5. TRAVEL CATEGORIES ══ */}
      <section className="section-categories">
        <div className="tourism-container">
          <div className="section-header-centered">
            <span className="tourism-badge badge-sky"><Compass size={11} /> Travel by Passion</span>
            <h2 className="tourism-heading section-heading-xl">
              What Does Your Soul<br />
              <span style={{ color: 'var(--tourism-sky)' }}>Crave to See?</span>
            </h2>
            <p className="tourism-subtitle section-subtitle-center">
              Whether you're chasing the electric silence of snow-draped Himalayan passes,
              the hypnotic rhythm of ocean waves, or the golden hush of ancient temple corridors —
              your India awaits.
            </p>
          </div>
          <div className="tourism-grid-4" style={{ marginTop: '2.5rem' }}>
            {categories.map((category) => (<CategoryCard key={category.id} category={category} />))}
          </div>
        </div>
      </section>

      {/* ══ 6. ICONS OF THE AGES ══ */}
      <section className="section-attractions">
        <div className="tourism-container">
          <div className="section-header-split">
            <div>
              <span className="tourism-badge badge-gold"><Flame size={11} /> Icons of the Ages</span>
              <h2 className="tourism-heading section-heading-xl">
                Monuments That<br />
                <span style={{ color: 'var(--tourism-gold)' }}>Redefine Grandeur</span>
              </h2>
              <p className="tourism-subtitle" style={{ maxWidth: '500px' }}>
                From marble mausoleums that made emperors weep to primal forests
                where Bengal tigers still reign supreme — these are India's non-negotiable wonders.
              </p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAttractionFilter(tab.id)}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '9999px', border: '1.5px solid',
                    borderColor: attractionFilter === tab.id ? 'var(--tourism-earth)' : 'var(--tourism-sand-border)',
                    backgroundColor: attractionFilter === tab.id ? 'var(--tourism-earth)' : '#FFFFFF',
                    color: attractionFilter === tab.id ? '#FFFFFF' : '#64748B',
                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                  }}
                >{tab.label}</button>
              ))}
            </div>
          </div>
          <div className="tourism-grid-4" style={{ marginTop: '2.5rem' }}>
            {featuredAttractions.map((attraction) => (<AttractionCard key={attraction.id} attraction={attraction} />))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              to="/attractions"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', fontWeight: 800, fontSize: '1rem', textDecoration: 'none' }}
            >
              <span>Discover all {attractions.length} legendary destinations across India</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 7. TRAVEL STYLES ══ */}
      <section className="section-travel-styles">
        <div className="tourism-container">
          <div className="section-header-centered">
            <span className="tourism-badge badge-forest"><Star size={11} /> Craft Your Journey</span>
            <h2 className="tourism-heading section-heading-xl">
              Every Traveller Has<br />
              <span style={{ color: 'var(--tourism-forest)' }}>a Different North Star</span>
            </h2>
            <p className="tourism-subtitle section-subtitle-center">
              Solo nomad. Luxury escapist. Family adventurer. Spiritual pilgrim.
              We've curated hyper-personalised Indian journeys for every kind of wandering soul.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
            {travelStyles.map((style) => (
              <Link
                key={style.id}
                to={'/cities?travelStyle=' + style.id}
                className="travel-style-card"
                onMouseEnter={() => setHoveredStyle(style.id)}
                onMouseLeave={() => setHoveredStyle(null)}
                style={{
                  transform: hoveredStyle === style.id ? 'translateY(-6px)' : 'translateY(0)',
                  borderColor: hoveredStyle === style.id ? 'var(--tourism-earth)' : 'var(--tourism-sand-border)',
                  boxShadow: hoveredStyle === style.id ? '0 16px 40px rgba(200, 90, 50, 0.15)' : 'var(--shadow-subtle)'
                }}
              >
                <div className="travel-style-icon">{style.icon || '🌍'}</div>
                <h4 className="travel-style-name">{style.name}</h4>
                <p className="travel-style-desc">{style.description}</p>
                <div className="travel-style-cta">
                  <span>Explore Cities for This Style</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 8. ITINERARIES ══ */}
      <section className="section-itineraries">
        <div className="tourism-container">
          <div className="section-header-split">
            <div>
              <span className="tourism-badge badge-earth"><Calendar size={11} /> Day-by-Day Masterplans</span>
              <h2 className="tourism-heading section-heading-xl">
                Journeys Worth<br />
                <span style={{ color: 'var(--tourism-earth)' }}>Every Single Second</span>
              </h2>
              <p className="tourism-subtitle" style={{ maxWidth: '500px' }}>
                Obsessively crafted morning-to-midnight schedules — no guesswork,
                no missed sunsets, no wasted kilometres. Just pure, distilled India.
              </p>
            </div>
            <Link to="/planner" className="cta-btn-outline">
              <Sparkles size={15} />
              <span>Design My Dream Trip</span>
              <ArrowRight size={15} />
            </Link>
          </div>
          <div className="tourism-grid-3" style={{ marginTop: '2.5rem' }}>
            {itineraries.slice(0, 6).map((itinerary) => (<ItineraryCard key={itinerary.id} itinerary={itinerary} />))}
          </div>
        </div>
      </section>

      {/* ══ 9. GRAND CLOSING CTA ══ */}
      <section className="section-grand-cta">
        <div className="grand-cta-bg" />
        <div className="tourism-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="grand-cta-inner">
            <div className="grand-cta-badge">
              <Sparkles size={14} color="#FDBA74" />
              <span>The Future of Indian Travel Discovery</span>
            </div>
            <h2 className="grand-cta-title">
              India Has 1.4 Billion Stories.
              <br />
              <span className="grand-cta-title-accent">Yours Begins Right Here.</span>
            </h2>
            <p className="grand-cta-subtitle">
              We're rapidly expanding our living atlas to cover all 28 states, 8 Union Territories,
              1,000+ cities, 5,000+ verified attractions, AI trip assistants, and immersive virtual experiences.
              The most ambitious India travel guide ever built — and it's just getting started.
            </p>
            <div className="grand-cta-buttons">
              <Link to="/planner" className="grand-cta-btn-primary">
                <Sparkles size={16} />
                <span>Ignite My Adventure</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="grand-cta-btn-secondary">
                <span>Explore Our Vision</span>
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grand-cta-social-proof">
              <CheckCircle2 size={14} color="#22C55E" />
              <span>Trusted by thousands of travellers planning trips across India</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
