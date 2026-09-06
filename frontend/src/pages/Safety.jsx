import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ShieldAlert, Phone, MapPin, Check, Info } from 'lucide-react';
import { getSafetyInfo } from '../api/client';

export default function Safety() {
  const {
    selectedCity,
    setSelectedCity,
    safetyData,
    setIsSosModalOpen
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  const CITIES = [
    "Jaipur", "Munnar", "Varanasi", "Goa", "Chennai", "Agra", "Bangalore", "Kochin", "Pondicherry", "Yercaud", "Delhi"
  ];

  useEffect(() => {
    const qCity = searchParams.get('city');
    if (qCity && qCity !== selectedCity) {
      setSelectedCity(qCity);
    }
  }, [searchParams]);

  const onCityChange = (city) => {
    setSelectedCity(city);
    setSearchParams({ city });
  };

  return (
    <div style={{ backgroundColor: "var(--color-canvas)", minHeight: "85vh", padding: "3.5rem 0 5rem 0" }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ maxWidth: "700px", marginBottom: "2.5rem" }}>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>
            24/7 Verified Emergency Infrastructure
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.85rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.6rem" }}>
            Tourist Safety & Police Directory in {selectedCity}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-ink-secondary)", lineHeight: 1.6 }}>
            Direct emergency telephone numbers, real police station contacts, women's safety helplines, and local area safety advisories.
          </p>
        </div>

        {/* City Selector Bar & SOS Callout */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          padding: "1.25rem",
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--color-rule)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-rest)",
          marginBottom: "2.5rem"
        }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink-tertiary)", marginBottom: "0.35rem" }}>
              Active Destination
            </label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "var(--radius-button)",
                border: "1px solid var(--color-rule)",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: "var(--color-canvas-warm)",
                color: "var(--color-ink)",
                cursor: "pointer"
              }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsSosModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: "0.65rem 1.4rem", fontSize: "0.9rem", gap: "0.4rem" }}
          >
            <ShieldAlert size={16} />
            <span>Open Emergency SOS Dialer</span>
          </button>
        </div>

        {/* Safety Details Grid */}
        {safetyData && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            
            {/* 1. Verified Police Stations Card */}
            <div className="card" style={{ padding: "1.75rem", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <ShieldCheck size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Local Police Stations</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {safetyData.policeStations?.map((ps, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "1rem",
                      backgroundColor: "var(--color-canvas-warm)",
                      borderRadius: "var(--radius-button)",
                      border: "1px solid var(--color-rule)"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{ps.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--color-ink-secondary)", marginBottom: "0.6rem" }}>
                      <MapPin size={13} color="var(--color-primary)" /> {ps.address}
                    </div>

                    <a
                      href={`tel:${ps.phone}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        textDecoration: "none"
                      }}
                    >
                      <Phone size={13} /> {ps.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Medical Aid Posts Card */}
            <div className="card" style={{ padding: "1.75rem", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Info size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Medical & First Aid Posts</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {safetyData.medicalPosts?.map((mp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "1rem",
                      backgroundColor: "var(--color-canvas-warm)",
                      borderRadius: "var(--radius-button)",
                      border: "1px solid var(--color-rule)"
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{mp.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", color: "var(--color-ink-secondary)", marginBottom: "0.6rem" }}>
                      <MapPin size={13} color="var(--color-primary)" /> {mp.address}
                    </div>

                    <a
                      href={`tel:${mp.phone}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--color-primary)",
                        textDecoration: "none"
                      }}
                    >
                      <Phone size={13} /> {mp.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. General Safety Guidelines */}
            <div className="card" style={{ padding: "1.75rem", backgroundColor: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <Check size={20} color="var(--color-primary)" />
                <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Travel Safety Tips</h2>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", color: "var(--color-ink-secondary)" }}>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>✓</span>
                  <span>Use prepaid taxi/auto booths at airport and major railway terminuses.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>✓</span>
                  <span>Keep electronic copies of passport/Aadhaar on secure offline cloud storage.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>✓</span>
                  <span>Dial 112 from any Indian SIM card for instant unified police, ambulance, and fire dispatch.</span>
                </li>
                <li style={{ display: "flex", gap: "0.5rem" }}>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>✓</span>
                  <span>National 24/7 Multi-Lingual Tourist Helpline is available at 1363.</span>
                </li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
