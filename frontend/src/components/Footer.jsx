import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import { useApp } from "../context/AppContext";
import logoMark from "../assets/logo-mark.png";
import logoWordmarkLight from "../assets/logo-wordmark-light.png";

const NAV_LINKS = [
  { label: "Home",          path: "/" },
  { label: "Destinations",  path: "/destinations" },
  { label: "Itinerary",     path: "/itinerary" },
  { label: "Hotels",        path: "/hotels" },
  { label: "Safety & SOS",  path: "/safety" },
];

const CITIES = ["Jaipur", "Goa", "Munnar", "Varanasi", "Delhi", "Ooty"];

const HELPLINES = [
  { label: "Emergency",       number: "112"  },
  { label: "Women Helpline",  number: "1091" },
  { label: "Tourist Help",    number: "1363" },
  { label: "Ambulance",       number: "108"  },
];

export default function Footer() {
  const { setSelectedCity, handleGenerateItinerary, t } = useApp();
  const navigate = useNavigate();

  const handleCityClick = (city) => {
    setSelectedCity(city);
    handleGenerateItinerary(city, 3);
    navigate(`/itinerary?city=${encodeURIComponent(city)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      {/* ── Top grid ── */}
      <div className="container site-footer__grid">

        {/* Brand */}
        <div className="site-footer__brand">
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <img
              src={logoMark}
              alt="LukAround"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "contain",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))"
              }}
            />
            <img
              src={logoWordmarkLight}
              alt="LukAround"
              style={{
                height: "22px",
                width: "auto",
                objectFit: "contain"
              }}
            />
          </div>
          <p className="site-footer__tagline">
            {t("Travel beyond the Ordinary")}
          </p>
        </div>

        {/* Pages */}
        <nav className="site-footer__col" aria-label="Pages">
          <h3 className="site-footer__heading">Pages</h3>
          <ul className="site-footer__list">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="site-footer__link">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Cities */}
        <nav className="site-footer__col" aria-label="Popular cities">
          <h3 className="site-footer__heading">Popular Cities</h3>
          <ul className="site-footer__list">
            {CITIES.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  className="site-footer__link site-footer__city-btn"
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Helplines */}
        <div className="site-footer__col">
          <h3 className="site-footer__heading">
            <Phone size={11} aria-hidden="true" />
            Emergency Lines
          </h3>
          <ul className="site-footer__list">
            {HELPLINES.map((h) => (
              <li key={h.number} className="site-footer__helpline">
                <span className="site-footer__helpline-label">{h.label}</span>
                <a
                  href={`tel:${h.number}`}
                  className="site-footer__helpline-num"
                  aria-label={`Call ${h.label} at ${h.number}`}
                >
                  {h.number}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="site-footer__bar">
        <div className="container site-footer__bar-inner">
          <span>© {new Date().getFullYear()} Luk Around. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
