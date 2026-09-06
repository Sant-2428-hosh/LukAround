import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import { useApp } from '../context/AppContext';
import { Compass, Sparkles, MapPin, Star, ArrowRight, ShieldCheck, Calendar, IndianRupee } from 'lucide-react';

export default function Home() {
  const { DESTINATIONS, setSelectedCity, handleGenerateItinerary } = useApp();
  const [selectedMood, setSelectedMood] = useState('All');
  const navigate = useNavigate();

  const MOODS = [
    { label: 'All', icon: '✨' },
    { label: 'Heritage', icon: '🏰' },
    { label: 'Nature', icon: '🍃' },
    { label: 'Spiritual', icon: '🛕' },
    { label: 'Beaches', icon: '🌴' },
    { label: 'Culture', icon: '🎭' },
  ];

  const filtered = selectedMood === 'All'
    ? DESTINATIONS.slice(0, 6)
    : DESTINATIONS.filter(d => d.category === selectedMood).slice(0, 6);

  const handlePlanTrip = (city) => {
    setSelectedCity(city);
    handleGenerateItinerary(city, 3);
    navigate(`/itinerary?city=${city}`);
  };

  return (
    <div>
      {/* ── 1. Full-Width Animated Hero Slider ── */}
      <HeroSlider onSelectSlide={(city) => handlePlanTrip(city)} />

      {/* ── 2. Quick Value Proposition Bar ── */}
      <section style={{ backgroundColor: "var(--color-canvas-warm)", borderBottom: "1px solid var(--color-rule)", padding: "1.75rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-button)", backgroundColor: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <Sparkles size={18} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>AI Proximity Clustering</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink-secondary)" }}>Zero backtracking routes</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-button)", backgroundColor: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>24/7 Verified Helplines</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink-secondary)" }}>Real police & medical aid</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-button)", backgroundColor: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                <IndianRupee size={18} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>Transparent ₹ Budgets</div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ink-secondary)" }}>Entry fees & fare breakdown</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Featured Destinations & Mood Picker ── */}
      <section style={{ padding: "4.5rem 0", backgroundColor: "#FFFFFF" }}>
        <div className="container">
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2.5rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-primary)", fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                <Compass size={14} /> Curated Travel Picks
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>
                Destinations Worth Your Time
              </h2>
            </div>

            {/* Mood Picker Pills */}
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {MOODS.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setSelectedMood(mood.label)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.45rem 0.9rem",
                    borderRadius: "var(--radius-button)",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    border: selectedMood === mood.label ? "1px solid var(--color-primary)" : "1px solid var(--color-rule)",
                    backgroundColor: selectedMood === mood.label ? "var(--color-primary-light)" : "#FFFFFF",
                    color: selectedMood === mood.label ? "var(--color-primary)" : "var(--color-ink)",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-rest)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span>{mood.icon}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="destination-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid var(--color-rule)",
                  boxShadow: "var(--shadow-rest)"
                }}
              >
                <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                  <img
                    src={dest.imageUrl}
                    alt={dest.city}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                  />
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.4rem" }}>
                    <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem" }}>
                      {dest.badge}
                    </span>
                  </div>
                  <div style={{ position: "absolute", top: "1rem", right: "1rem", backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", color: "#fff", padding: "0.25rem 0.5rem", borderRadius: "var(--radius-button)", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Star size={12} fill="#F59E0B" color="#F59E0B" /> {dest.rating}
                  </div>
                </div>

                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-ink-secondary)", fontSize: "0.8rem", marginBottom: "0.35rem" }}>
                    <MapPin size={13} color="var(--color-primary)" /> {dest.city}, {dest.state}
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>{dest.tagline}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-ink-secondary)", lineHeight: 1.5, marginBottom: "1.25rem", flexGrow: 1 }}>
                    {dest.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--color-rule)" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-ink-tertiary)" }}>
                      Avg: <strong style={{ color: "var(--color-ink)", fontSize: "0.9rem" }}>₹{dest.avgDailyBudgetInr}</strong>/day
                    </div>
                    <button
                      onClick={() => handlePlanTrip(dest.city)}
                      className="btn btn-primary"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.825rem", gap: "0.35rem" }}
                    >
                      <span>Plan for Your Trip</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link
              to="/destinations"
              className="btn btn-outline"
              style={{ padding: "0.85rem 2rem", fontSize: "0.95rem", fontWeight: 700, gap: "0.5rem" }}
            >
              <span>Explore All 11 Indian Cities</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
