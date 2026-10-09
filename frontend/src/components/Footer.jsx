import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  MapPin,
  Compass,
  ShieldAlert,
  ArrowUp,
  ExternalLink,
  Sparkles,
  Award,
  Heart,
  Navigation,
  ChevronRight,
  Globe,
  ShieldCheck,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoMark from '../assets/logo-mark.png';
import logoWordmarkLight from '../assets/logo-wordmark-light.png';
import './Footer.css';

const POPULAR_STATES = [
  { name: 'Tamil Nadu', slug: 'tamil-nadu', highlight: 'Ancient Temples & Nilgiris' },
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh', highlight: 'Taj Mahal & Varanasi' },
  { name: 'Rajasthan', slug: 'rajasthan', highlight: 'Royal Palaces & Desert Forts' },
  { name: 'Kerala', slug: 'kerala', highlight: 'Backwaters & Tropical Hills' },
  { name: 'Karnataka', slug: 'karnataka', highlight: 'Hampi & Western Ghats' },
  { name: 'Maharashtra', slug: 'maharashtra', highlight: 'Ajanta & Konkan Coast' },
  { name: 'Uttarakhand', slug: 'uttarakhand', highlight: 'Sacred Himalayas & Rishikesh' },
];

const POPULAR_CITIES = [
  { name: 'Jaipur', path: '/india/rajasthan/jaipur', tag: 'The Pink City' },
  { name: 'Varanasi', path: '/india/uttar-pradesh/varanasi', tag: 'Spiritual Sanctum' },
  { name: 'Agra', path: '/india/uttar-pradesh/agra', tag: 'City of Taj Mahal' },
  { name: 'Madurai', path: '/india/tamil-nadu/madurai', tag: 'Temple Capital' },
  { name: 'Alleppey', path: '/india/kerala/alleppey', tag: 'Venice of the East' },
  { name: 'Amritsar', path: '/india/punjab/amritsar', tag: 'Golden Sanctum' },
  { name: 'Mumbai', path: '/india/maharashtra/mumbai', tag: 'Gateway of India' },
];

const TRAVEL_THEMES = [
  { label: '🏰 Ancient Heritage & UNESCO', path: '/categories/heritage' },
  { label: '🛕 Sacred Temples & Pilgrimages', path: '/categories/spiritual' },
  { label: '🌊 Coastal Escapes & Beaches', path: '/categories/beaches' },
  { label: '⛰️ Misty Highlands & Hill Stations', path: '/categories/hill-stations' },
  { label: '🐅 Wild Sanctuaries & Safaris', path: '/categories/wildlife' },
  { label: '🍲 Culinary Trails & Royal Flavors', path: '/categories/food' },
  { label: '🛶 Thrill & Adventure Expeditions', path: '/categories/adventure' },
];

const OFFICIAL_HELPLINES = [
  { label: 'Tourist Helpline (24/7 Multi-Lingual)', number: '1363', desc: 'Ministry of Tourism' },
  { label: 'National Emergency Service', number: '112', desc: 'Police / Fire / Medical' },
  { label: "Women's Safety Helpline", number: '1091', desc: 'National Commission' },
  { label: 'Medical Ambulance Emergency', number: '108', desc: 'Emergency Medical Response' },
];

export default function Footer() {
  const { setIsSosModalOpen, t } = useApp();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer luk-footer">
      {/* ── Pre-Footer Trust Ribbon ── */}
      <div className="luk-footer__ribbon">
        <div className="container luk-footer__ribbon-grid">
          <div className="luk-footer__ribbon-item">
            <div className="luk-footer__ribbon-icon">🏛️</div>
            <div>
              <div className="luk-footer__ribbon-title">15 Priority States</div>
              <div className="luk-footer__ribbon-desc">Comprehensive Living Atlas</div>
            </div>
          </div>

          <div className="luk-footer__ribbon-item">
            <div className="luk-footer__ribbon-icon">🗺️</div>
            <div>
              <div className="luk-footer__ribbon-title">Google Maps Directions</div>
              <div className="luk-footer__ribbon-desc">Turn-by-turn routing on all places</div>
            </div>
          </div>

          <div className="luk-footer__ribbon-item">
            <div className="luk-footer__ribbon-icon">🏆</div>
            <div>
              <div className="luk-footer__ribbon-title">42+ UNESCO Wonders</div>
              <div className="luk-footer__ribbon-desc">Verified Heritage & Living Culture</div>
            </div>
          </div>

          <div className="luk-footer__ribbon-item">
            <div className="luk-footer__ribbon-icon">🛡️</div>
            <div>
              <div className="luk-footer__ribbon-title">24/7 Tourist Support</div>
              <div className="luk-footer__ribbon-desc">Official Helplines (1363 & 112)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Navigation Grid ── */}
      <div className="container luk-footer__grid">
        {/* Brand & Mission Identity */}
        <div className="luk-footer__brand">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <img
              src={logoMark}
              alt="LukAround"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
              }}
            />
            <img
              src={logoWordmarkLight}
              alt="LukAround"
              style={{
                height: '24px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </Link>

          <p className="luk-footer__tagline">
            India's Living Travel & Tourism Atlas — Explore sacred temple corridors, mist-clad highlands, royal palaces, and tropical coastlines with verified Google Maps navigation.
          </p>

          <div className="luk-footer__badges">
            <span className="luk-footer__badge">
              <span>🇮🇳</span>
              <span>Incredible India</span>
            </span>
            <span className="luk-footer__badge">
              <ShieldCheck size={12} color="#10B981" />
              <span>Google Maps Verified</span>
            </span>
          </div>

          <Link to="/planner" className="luk-footer__cta-pill">
            <Sparkles size={14} />
            <span>AI Trip Planner</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Priority Sovereign States */}
        <nav className="luk-footer__col" aria-label="Priority States">
          <h4 className="luk-footer__heading">
            <Award size={13} color="#F59E0B" />
            <span>Priority States</span>
          </h4>
          <ul className="luk-footer__list">
            {POPULAR_STATES.map((state) => (
              <li key={state.slug}>
                <Link to={`/india/${state.slug}`} className="luk-footer__link">
                  <span>{state.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/states" className="luk-footer__link luk-footer__link--highlight">
                <span>View All 28 States & UTs →</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Iconic Cities & Capitals */}
        <nav className="luk-footer__col" aria-label="Iconic Cities">
          <h4 className="luk-footer__heading">
            <MapPin size={13} color="#F59E0B" />
            <span>Iconic Cities</span>
          </h4>
          <ul className="luk-footer__list">
            {POPULAR_CITIES.map((city) => (
              <li key={city.name}>
                <Link to={city.path} className="luk-footer__link">
                  <span>{city.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/cities" className="luk-footer__link luk-footer__link--highlight">
                <span>Explore All 212 Cities →</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Travel Themes & Passions */}
        <nav className="luk-footer__col" aria-label="Travel Themes">
          <h4 className="luk-footer__heading">
            <Compass size={13} color="#F59E0B" />
            <span>Travel Themes</span>
          </h4>
          <ul className="luk-footer__list">
            {TRAVEL_THEMES.map((theme) => (
              <li key={theme.path}>
                <Link to={theme.path} className="luk-footer__link">
                  <span>{theme.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/categories" className="luk-footer__link luk-footer__link--highlight">
                <span>Browse All Themes →</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Emergency Helplines & Safety */}
        <div className="luk-footer__col" aria-label="Emergency Helplines">
          <h4 className="luk-footer__heading">
            <Phone size={13} color="#F59E0B" />
            <span>24/7 Helplines</span>
          </h4>

          <div className="luk-footer__helpline-group">
            {OFFICIAL_HELPLINES.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="luk-footer__helpline-card"
                title={`Call ${h.label} at ${h.number}`}
              >
                <div>
                  <div className="luk-footer__helpline-label">{h.label.split('(')[0].trim()}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{h.desc}</div>
                </div>
                <span className="luk-footer__helpline-num">{h.number}</span>
              </a>
            ))}

            <button
              type="button"
              className="luk-footer__sos-btn"
              onClick={() => setIsSosModalOpen && setIsSosModalOpen(true)}
            >
              <ShieldAlert size={14} />
              <span>Emergency SOS Helplines</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar & Disclaimers ── */}
      <div className="luk-footer__bar">
        <div className="container luk-footer__bar-inner">
          <div>
            © {new Date().getFullYear()} <strong>LukAround</strong>. All rights reserved. Crafted for extraordinary journeys across India.
          </div>

          <div className="luk-footer__sources">
            <span>Verified with Ministry of Tourism, Govt of India · UNESCO World Heritage Centre · Google Maps Platform</span>
          </div>

          <button
            type="button"
            className="luk-footer__top-btn"
            onClick={scrollToTop}
            title="Scroll to top of page"
          >
            <span>Back to Top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
