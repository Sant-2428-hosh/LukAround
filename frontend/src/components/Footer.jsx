import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setSelectedCity, handleGenerateItinerary } = useApp();
  const navigate = useNavigate();

  const handleCityClick = (cityName) => {
    setSelectedCity(cityName);
    handleGenerateItinerary(cityName, 3);
    navigate(`/itinerary?city=${cityName}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: "var(--color-primary-dark)",
      color: "#FFFFFF",
      padding: "4rem 0 2.5rem 0",
      borderTop: "1px solid rgba(255,255,255,0.1)"
    }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", marginBottom: "3rem" }}>
          
          {/* Brand Col */}
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{
                width: "32px",
                height: "32px",
                backgroundColor: "var(--color-primary)",
                borderRadius: "var(--radius-button)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Compass size={16} color="#fff" />
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "#FFFFFF" }}>
                Luk Around
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6, maxWidth: "360px" }}>
              Honest travel advice, intelligent day clustering, multi-modal transport guidance, and persistent tourist safety across India.
            </p>
          </div>

          {/* Quick Pages Navigation */}
          <div>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
              Explore Pages
            </h4>
            <ul style={{ listStyle: "none", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { label: "Home", path: "/" },
                { label: "All Destinations", path: "/destinations" },
                { label: "Smart Itinerary", path: "/itinerary" },
                { label: "Hotels & Stays", path: "/hotels" },
                { label: "Safety & SOS", path: "/safety" },
                { label: "Trip Budget", path: "/budget" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.target.style.color = "#FFFFFF")}
                    onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Cities */}
          <div>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
              Popular Cities
            </h4>
            <ul style={{ listStyle: "none", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["Jaipur", "Goa", "Bangalore", "Chennai", "Agra", "Munnar", "Varanasi"].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => handleCityClick(c)}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", cursor: "pointer", padding: 0, fontSize: "0.85rem" }}
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Helplines */}
          <div>
            <h4 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
              Emergency Lines
            </h4>
            <ul style={{ listStyle: "none", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem", color: "rgba(255,255,255,0.85)" }}>
              <li>🚨 Emergency: 112</li>
              <li>👩 Women's Helpline: 1091</li>
              <li>🧳 Tourist Helpline: 1363</li>
              <li>🚑 Ambulance: 108</li>
            </ul>
          </div>
        </div>

        <div style={{
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.6)"
        }}>
          <p>© 2025–2026 Luk Around. All rights reserved.</p>
          <p>Powered by Express.js, Vite & Local Intelligence Engine</p>
        </div>
      </div>
    </footer>
  );
}
