import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BroadcastBanner from './BroadcastBanner';
import AdminQuickBar from './AdminQuickBar';
import { useApp } from '../context/AppContext';
import { ShieldAlert, X, Globe } from 'lucide-react';

export default function Layout() {
  const {
    isSosModalOpen,
    setIsSosModalOpen,
    activeBookingModal,
    setActiveBookingModal
  } = useApp();

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-body)", color: "var(--color-ink)" }}>
      {/* ── Global Broadcast Advisory Banner (Super Admin controlled) ── */}
      <BroadcastBanner />

      {/* ── Shared Sticky Navigation ── */}
      <Navbar />

      {/* ── Floating Executive Admin HUD (Super Admin & Admin only) ── */}
      <AdminQuickBar />

      {/* ── Page Content ── */}
      <main>
        <Outlet />
      </main>

      {/* ── Shared Footer ── */}
      <Footer />

      {/* ── Floating SOS Modal ── */}
      {isSosModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            maxWidth: "480px",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "var(--radius-card)",
            border: "2px solid var(--color-primary)",
            padding: "1.75rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={22} color="var(--color-primary)" />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Emergency SOS Helplines</h3>
              </div>
              <button onClick={() => setIsSosModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {[
                { name: "National Emergency (Police/Fire/Ambulance)", number: "112" },
                { name: "Women's Safety Helpline", number: "1091" },
                { name: "National Tourist Helpline (24/7 Multi-Lingual)", number: "1363" },
                { name: "Medical Ambulance Emergency", number: "108" }
              ].map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.85rem 1rem",
                    border: "1px solid var(--color-rule)",
                    borderRadius: "var(--radius-button)",
                    textDecoration: "none",
                    backgroundColor: "var(--color-canvas-warm)"
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-ink)" }}>{item.name}</span>
                  <span style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--color-primary)" }}>{item.number}</span>
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsSosModalOpen(false)}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.65rem",
                fontWeight: 700,
                cursor: "pointer",
                borderRadius: "var(--radius-button)"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Booking Portals Modal ── */}
      {activeBookingModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(6px)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            maxWidth: "500px",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-rule)",
            padding: "1.75rem",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", textTransform: "uppercase", fontWeight: 700 }}>
                  Instant Redirection Portals
                </span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginTop: "0.2rem" }}>
                  Book {activeBookingModal.name}
                </h3>
              </div>
              <button onClick={() => setActiveBookingModal(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {activeBookingModal.portals?.map((p, pIdx) => (
                <a
                  key={pIdx}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.85rem 1rem",
                    border: "1px solid var(--color-rule)",
                    borderRadius: "var(--radius-button)",
                    textDecoration: "none",
                    backgroundColor: "var(--color-canvas-warm)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Globe size={16} color="var(--color-primary)" />
                    <div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-ink)" }}>{p.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)" }}>{p.label}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 700 }}>
                    {p.badge} ↗
                  </span>
                </a>
              ))}
            </div>

            <button
              onClick={() => setActiveBookingModal(null)}
              className="btn btn-outline"
              style={{ width: "100%", padding: "0.6rem", fontWeight: 700, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
