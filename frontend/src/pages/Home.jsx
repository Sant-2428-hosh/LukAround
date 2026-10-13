import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/tourism/SearchBar';
import StateCard from '../components/tourism/StateCard';
import AttractionCard from '../components/tourism/AttractionCard';
import CategoryCard from '../components/tourism/CategoryCard';
import TravelStyleCard from '../components/tourism/TravelStyleCard';
import ItineraryCard from '../components/tourism/ItineraryCard';
import PopularPlacesSection from '../components/tourism/PopularPlacesSection';
import TravelIntelligenceHub from '../components/tourism/TravelIntelligenceHub';
import {
  states, cities, attractions, categories, travelStyles, itineraries
} from '../data/indiaTourismData';
import {
  Compass, MapPin, ArrowRight, Sparkles, Award, Calendar,
  CheckCircle2, Flame, Star, Globe, Zap, ChevronLeft, ChevronRight, UtensilsCrossed,
  Users, Heart, Smile, Clock, Crown, Wallet, Landmark, Trees, Palmtree
} from 'lucide-react';
import { recordCardClick } from '../components/common/ScrollToTop';

const TRAVEL_STYLE_CONFIG = {
  family: {
    icon: Users,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Ooty', 'Jaipur', 'Mysore', 'Shimla'],
    badge: '140+ Cities',
    tag: 'All Generations',
    accent: '#F59E0B'
  },
  couples: {
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Udaipur', 'Alleppey', 'Manali', 'Munnar'],
    badge: '60+ Cities',
    tag: 'Romantic Getaways',
    accent: '#F43F5E'
  },
  solo: {
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Rishikesh', 'Pondicherry', 'Hampi', 'Kasol'],
    badge: '135+ Cities',
    tag: 'Soulful & Free',
    accent: '#10B981'
  },
  friends: {
    icon: Smile,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Goa', 'Manali', 'Gokarna', 'Leh'],
    badge: '95+ Cities',
    tag: 'High Energy',
    accent: '#06B6D4'
  },
  weekend: {
    icon: Clock,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Lonavala', 'Agra', 'Coorg', 'Mussoorie'],
    badge: '200+ Cities',
    tag: 'Quick 2-3 Days',
    accent: '#8B5CF6'
  },
  luxury: {
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Udaipur', 'Jodhpur', 'Jaipur', 'Agra'],
    badge: '100+ Cities',
    tag: 'Royal Palaces',
    accent: '#EAB308'
  },
  budget: {
    icon: Wallet,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Varanasi', 'Pushkar', 'McLeodGanj', 'Puri'],
    badge: '125+ Cities',
    tag: 'High Value',
    accent: '#14B8A6'
  },
  spiritual: {
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Varanasi', 'Madurai', 'Haridwar', 'Amritsar'],
    badge: '60+ Cities',
    tag: 'Sacred Shrines',
    accent: '#F97316'
  },
  heritage: {
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Hampi', 'Agra', 'Delhi', 'Khajuraho'],
    badge: '120+ Cities',
    tag: 'UNESCO Marvels',
    accent: '#D97706'
  },
  nature: {
    icon: Trees,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Munnar', 'Wayanad', 'Coonoor', 'Kaziranga'],
    badge: '80+ Cities',
    tag: 'Pristine Wilderness',
    accent: '#10B981'
  },
  adventure: {
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Rishikesh', 'Leh', 'Dandeli', 'Bir Billing'],
    badge: '25+ Cities',
    tag: 'Thrill & Adrenaline',
    accent: '#EF4444'
  },
  beach: {
    icon: Palmtree,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    sampleCities: ['Goa', 'Varkala', 'Andaman', 'Gokarna'],
    badge: '20+ Cities',
    tag: 'Coastal Serenity',
    accent: '#0EA5E9'
  }
};

const HERO_SLIDES = [
  {
    id: 'taj-mahal',
    place: 'The Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    stateSlug: 'uttar-pradesh',
    tag: '✦ AGRA, UTTAR PRADESH · UNESCO WORLD HERITAGE',
    badgeColor: '#F59E0B',
    line1: 'Where Marble Whispers Eternity',
    accentText: 'The Taj Mahal',
    accentClass: 'accent-taj',
    subtitle: 'An ivory-white marble poem bathed in rosy dawn on the sacred Yamuna riverbank.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/1280px-Taj_Mahal_%28Edited%29.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=80',
    tabLabel: 'Taj Mahal',
    tabLocation: 'Agra, UP',
    targetUrl: '/india/uttar-pradesh/agra/taj-mahal'
  },
  {
    id: 'kerala-backwaters',
    place: 'Kerala Backwaters',
    location: 'Alleppey & Kumarakom, Kerala',
    stateSlug: 'kerala',
    tag: '✦ ALLEPPEY, KERALA · GOD’S OWN COUNTRY',
    badgeColor: '#10B981',
    line1: 'Where Palms Dance on Glass Waters',
    accentText: 'Kerala Backwaters',
    accentClass: 'accent-kerala',
    subtitle: 'Drift through tranquil emerald lagoons and spice canals aboard traditional kettuvallam houseboats.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/House_Boat_DSW.jpg/1280px-House_Boat_DSW.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=80',
    tabLabel: 'Alleppey Lagoons',
    tabLocation: 'Kerala',
    targetUrl: '/india/kerala/alleppey'
  },
  {
    id: 'royal-rajasthan',
    place: 'Amber Fort & Palaces',
    location: 'Jaipur & Udaipur, Rajasthan',
    stateSlug: 'rajasthan',
    tag: '✦ JAIPUR, RAJASTHAN · LAND OF KINGS',
    badgeColor: '#F97316',
    line1: 'Where Golden Forts Crown Desert Skies',
    accentText: 'Royal Rajasthan',
    accentClass: 'accent-rajasthan',
    subtitle: 'Ascend sandstone ramparts, mirror-mosaic Sheesh Mahals, and royal desert citadels.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Jaipur_03-2016_02_Amber_Fort.jpg/1280px-Jaipur_03-2016_02_Amber_Fort.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=80',
    tabLabel: 'Amber Fort',
    tabLocation: 'Jaipur, Rajasthan',
    targetUrl: '/india/rajasthan/jaipur/amber-fort'
  },
  {
    id: 'sacred-himalayas',
    place: 'Sacred Himalayas',
    location: 'Kedarnath & Rishikesh, Uttarakhand',
    stateSlug: 'uttarakhand',
    tag: '✦ UTTARAKHAND · THRONE OF THE GODS',
    badgeColor: '#06B6D4',
    line1: 'Where Glacial Titans Pierce the Heavens',
    accentText: 'Sacred Himalayas',
    accentClass: 'accent-himalayas',
    subtitle: 'Mighty snow-crested peaks and sacred emerald rivers touching the divine.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Kedarnath_Temple_in_Rainy_season.jpg/1280px-Kedarnath_Temple_in_Rainy_season.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=80',
    tabLabel: 'Sacred Himalayas',
    tabLocation: 'Uttarakhand',
    targetUrl: '/india/uttarakhand/kedarnath/kedarnath-temple-shrine'
  },
  {
    id: 'thanjai-periya-kovil',
    place: 'Thanjai Periya Kovil',
    location: 'Thanjavur, Tamil Nadu',
    stateSlug: 'tamil-nadu',
    tag: '✦ THANJAVUR, TAMIL NADU · CHOLA EMPIRE MARVEL',
    badgeColor: '#EAB308',
    line1: 'Where Sacred Granite Echoes Chola Glory',
    accentText: 'Thanjai Periya Kovil',
    accentClass: 'accent-thanjavur',
    subtitle: 'Emperor Raja Raja Chola’s thousand-year monolithic granite marvel rising in timeless Dravidian glory.',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg/1280px-Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1675677044118-3fd84f9deaf0?auto=format&fit=crop&w=2000&q=80',
    tabLabel: 'Thanjai Periya Kovil',
    tabLocation: 'Thanjavur, TN',
    targetUrl: '/india/tamil-nadu/thanjavur/thanjai-periya-kovil'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedStateForJump, setSelectedStateForJump] = useState('');
  const [stateSortOrder, setStateSortOrder] = useState('priorityRank');
  const [attractionFilter, setAttractionFilter] = useState('all');
  const [hoveredStyle, setHoveredStyle] = useState(null);

  // 5-Destination Hero Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isControlsHovered, setIsControlsHovered] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [imageFailures, setImageFailures] = useState({});

  // Preload all 5 slide images immediately on mount for 0ms transition lag
  useEffect(() => {
    HERO_SLIDES.forEach((slide) => {
      const primary = new Image();
      primary.src = slide.image;
      if (slide.fallbackImage) {
        const fallback = new Image();
        fallback.src = slide.fallbackImage;
      }
    });
  }, []);

  // Reliable 6-second auto-timer that advances unless user is actively interacting with search
  useEffect(() => {
    if (isControlsHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setProgressKey((k) => k + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [isControlsHovered, currentSlide]);

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
    setProgressKey((k) => k + 1);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleSlideImageError = (slideId, fallbackUrl) => {
    if (fallbackUrl && !imageFailures[slideId]) {
      setImageFailures((prev) => ({ ...prev, [slideId]: fallbackUrl }));
    }
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  const sortedStates = [...states].sort(function(a, b) {
    if (stateSortOrder === 'name') return a.name.localeCompare(b.name);
    if (stateSortOrder === 'domesticVisits') return (b.domesticTouristVisits2024 || 0) - (a.domesticTouristVisits2024 || 0);
    return (a.priorityRank || 999) - (b.priorityRank || 999);
  });

  const FEATURED_ICONIC_IDS = [
    'taj-mahal',
    'thanjai-periya-kovil',
    'hampi-monuments',
    'amber-fort',
    'golden-temple',
    'meenakshi-temple',
    'qutub-minar',
    'mysore-palace',
    'red-fort',
    'khajuraho-temples'
  ];

  const featuredAttractions = attractions
    .filter(function(a) {
      if (attractionFilter === 'all') return a.featured === true;
      return (a.category || []).includes(attractionFilter) || a.type === attractionFilter;
    })
    .sort(function(a, b) {
      const idxA = FEATURED_ICONIC_IDS.indexOf(a.id);
      const idxB = FEATURED_ICONIC_IDS.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.priorityRank || 99) - (b.priorityRank || 99);
    })
    .slice(0, 8);

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

      {/* ══ 1. REFINED LUXURY 5-PLACE AUTO-SLIDESHOW HERO ══ */}
      <section className="tourism-hero-epic">
        {/* Slideshow Background Layers with smooth crossfade & guaranteed load */}
        <div className="hero-slideshow-container" aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            const imgSrc = imageFailures[slide.id] || slide.image;
            return (
              <div
                key={slide.id}
                className={`hero-slide-bg ${isActive ? 'active' : ''}`}
              >
                <img
                  src={imgSrc}
                  alt={slide.place}
                  className="hero-slide-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  onError={() => handleSlideImageError(slide.id, slide.fallbackImage)}
                />
              </div>
            );
          })}
          <div className="hero-slide-overlay" />
        </div>

        {/* Prev / Next Slide Arrow Controls */}
        <button
          type="button"
          className="hero-arrow-btn prev"
          onClick={prevSlide}
          aria-label="Previous destination"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          className="hero-arrow-btn next"
          onClick={nextSlide}
          aria-label="Next destination"
        >
          <ChevronRight size={22} />
        </button>

        {/* Clean, Uncluttered Hero Content */}
        <div className="tourism-hero-content-epic">

          {/* Place-Specific Heritage Badge & Title (smoothly rotates with slide) */}
          <div key={`slide-editorial-${currentSlide}`} className="hero-editorial-group">
            <div className="hero-trust-badge">
              <Sparkles size={13} color={activeSlide.badgeColor} />
              <span style={{ color: activeSlide.badgeColor, fontWeight: 700 }}>{activeSlide.tag}</span>
            </div>

            {/* Refined, Smaller, 2-Line Editorial Title */}
            <h1 className="tourism-hero-title-epic">
              <span className="hero-title-line-1">{activeSlide.line1}</span>
              <span className={`hero-accent-text ${activeSlide.accentClass}`}>
                {activeSlide.accentText}
              </span>
            </h1>

            {/* Simple and Sweet 1-Line Subtitle */}
            <p className="tourism-hero-subtitle-epic">
              {activeSlide.subtitle}
            </p>
          </div>

          {/* Clean, Centered Search Bar - Rock Solid & Never Unmounted */}
          <div
            className="hero-search-wrapper"
            onMouseEnter={() => setIsControlsHovered(true)}
            onMouseLeave={() => setIsControlsHovered(false)}
          >
            <SearchBar placeholder="Search a state, monument, beach, hill station or experience..." />
          </div>

          {/* 5 Places Slideshow Navigation Switcher */}
          <div
            className="hero-slideshow-nav"
            role="tablist"
            aria-label="Iconic Indian Destinations"
            onMouseEnter={() => setIsControlsHovered(true)}
            onMouseLeave={() => setIsControlsHovered(false)}
          >
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`hero-nav-card ${isActive ? 'active' : ''}`}
                  onClick={() => goToSlide(idx)}
                >
                  <div className="hero-nav-card-header">
                    <span className="hero-nav-number">0{idx + 1}</span>
                    <span className="hero-nav-tag">{slide.tabLocation}</span>
                  </div>
                  <div className="hero-nav-place">{slide.tabLabel}</div>
                  {isActive && (
                    <div
                      className="hero-nav-progress"
                      key={`prog-${idx}-${progressKey}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Category Quick Filter Pills */}
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

      {/* ══ 2. LUKAROUND TRAVEL INTELLIGENCE RADAR & VERIFIED RESOURCES ══ */}
      <TravelIntelligenceHub />

      {/* ══ INDIA'S MOST POPULAR TOURIST PLACES ══ */}
      <PopularPlacesSection />

      {/* ══ 3. THE MAGNIFICENT 16 STATES ══ */}
      <section className="section-states">
        <div className="tourism-container">
          <div className="section-header-split">
            <div>
              <span className="tourism-badge badge-forest"><Award size={11} /> The Magnificent 16</span>
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
            <Link
              to="/states"
              className="cta-btn-primary"
            >
              <Compass size={17} />
              <span>Explore More</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 4. TRAVEL CATEGORIES ══ */}
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

      {/* ══ 5. ICONS OF THE AGES ══ */}
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

      {/* ══ 6. TRAVEL STYLES ══ */}
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
          <div className="travel-styles-grid">
            {travelStyles.map((style) => (
              <TravelStyleCard
                key={style.id}
                style={style}
                config={TRAVEL_STYLE_CONFIG[style.id]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. ITINERARIES ══ */}
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

      {/* ══ 8. GRAND CLOSING CTA ══ */}
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
