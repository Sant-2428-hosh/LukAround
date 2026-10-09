import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowRight, ShieldAlert, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoMark from '../assets/logo-mark.png';
import logoWordmarkLight from '../assets/logo-wordmark-light.png';
import './Footer.css';

const PRIORITY_STATES = [
  { name: 'Tamil Nadu', slug: 'tamil-nadu' },
  { name: 'Uttar Pradesh', slug: 'uttar-pradesh' },
  { name: 'Rajasthan', slug: 'rajasthan' },
  { name: 'Kerala', slug: 'kerala' },
  { name: 'Karnataka', slug: 'karnataka' },
  { name: 'Maharashtra', slug: 'maharashtra' },
  { name: 'Uttarakhand', slug: 'uttarakhand' },
];

const POPULAR_CITIES = [
  { name: 'Jaipur', path: '/india/rajasthan/jaipur' },
  { name: 'Varanasi', path: '/india/uttar-pradesh/varanasi' },
  { name: 'Agra', path: '/india/uttar-pradesh/agra' },
  { name: 'Madurai', path: '/india/tamil-nadu/madurai' },
  { name: 'Alleppey', path: '/india/kerala/alleppey' },
  { name: 'Amritsar', path: '/india/punjab/amritsar' },
  { name: 'Mumbai', path: '/india/maharashtra/mumbai' },
];

const EXPERIENCES = [
  { label: 'Heritage & UNESCO Sites', path: '/categories/heritage' },
  { label: 'Sacred & Spiritual Trails', path: '/categories/spiritual' },
  { label: 'Hill Stations & Highlands', path: '/categories/hill-stations' },
  { label: 'Coastal & Beach Escapes', path: '/categories/beaches' },
  { label: 'Wildlife Sanctuaries', path: '/categories/wildlife' },
  { label: 'Curated Itinerary Planner', path: '/planner' },
  { label: 'Verified Hotels & Stays', path: '/hotels' },
];

const HELPLINES = [
  { name: 'Tourist Helpline (24/7)', number: '1363' },
  { name: 'National Emergency', number: '112' },
  { name: "Women's Safety Helpline", number: '1091' },
  { name: 'Medical Ambulance', number: '108' },
];

export default function Footer() {
  const { setIsSosModalOpen } = useApp();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="luk-footer">
      <div className="luk-footer__container">
        <div className="luk-footer__grid">

          {/* ── Brand Column ── */}
          <div className="luk-footer__brand">
            <Link to="/" className="luk-footer__brand-link" aria-label="LukAround Home">
              <img
                src={logoMark}
                alt=""
                style={{
                  width: '32px',
                  height: '32px',
                  objectFit: 'contain'
                }}
              />
              <img
                src={logoWordmarkLight}
                alt="LukAround"
                style={{
                  height: '22px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Link>

            <p className="luk-footer__brand-desc">
              A comprehensive travel companion charting India's sovereign states, cultural capitals, and verified monuments with real-time navigation.
            </p>

            <div className="luk-footer__meta-note">
              Verified geographical data aligned with Ministry of Tourism, Government of India and UNESCO World Heritage Centre.
            </div>
          </div>

          {/* ── States & Regions ── */}
          <nav aria-label="States & Regions">
            <h4 className="luk-footer__heading">States & Regions</h4>
            <ul className="luk-footer__list">
              {PRIORITY_STATES.map((state) => (
                <li key={state.slug}>
                  <Link to={`/india/${state.slug}`} className="luk-footer__link">
                    {state.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/states" className="luk-footer__link luk-footer__link--more">
                  <span>View All 28 States & UTs</span>
                  <ArrowRight size={13} />
                </Link>
              </li>
            </ul>
          </nav>

          {/* ── Iconic Cities ── */}
          <nav aria-label="Featured Destinations">
            <h4 className="luk-footer__heading">Featured Cities</h4>
            <ul className="luk-footer__list">
              {POPULAR_CITIES.map((city) => (
                <li key={city.name}>
                  <Link to={city.path} className="luk-footer__link">
                    {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/cities" className="luk-footer__link luk-footer__link--more">
                  <span>Explore All 212 Cities</span>
                  <ArrowRight size={13} />
                </Link>
              </li>
            </ul>
          </nav>

          {/* ── Experiences & Tools ── */}
          <nav aria-label="Experiences and Tools">
            <h4 className="luk-footer__heading">Experiences</h4>
            <ul className="luk-footer__list">
              {EXPERIENCES.map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="luk-footer__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── 24/7 Support & Safety ── */}
          <div>
            <h4 className="luk-footer__heading">24/7 Assistance</h4>
            <div className="luk-footer__helplines">
              {HELPLINES.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="luk-footer__helpline-row"
                  title={`Call ${item.name}`}
                >
                  <span className="luk-footer__helpline-name">{item.name}</span>
                  <span className="luk-footer__helpline-num">{item.number}</span>
                </a>
              ))}

              <button
                type="button"
                className="luk-footer__sos-action"
                onClick={() => setIsSosModalOpen && setIsSosModalOpen(true)}
              >
                Emergency Helplines & SOS
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="luk-footer__bottom">
        <div className="luk-footer__bottom-inner">
          <div>
            © {new Date().getFullYear()} LukAround. All rights reserved.
          </div>

          <div className="luk-footer__legal-links">
            <Link to="/safety" className="luk-footer__legal-link">
              Safety Guidelines
            </Link>
            <Link to="/about" className="luk-footer__legal-link">
              About
            </Link>
            <Link to="/planner" className="luk-footer__legal-link">
              Trip Planner
            </Link>
            <button
              type="button"
              className="luk-footer__scroll-top"
              onClick={handleScrollToTop}
            >
              <span>Back to top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
