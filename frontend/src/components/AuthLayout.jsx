import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Building2, Route } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoMark from '../assets/logo-mark.png';

export default function AuthLayout({ children }) {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const targetPath = location.state?.from?.pathname || '/';
      navigate(targetPath, { replace: true });
    }
  }, [user, navigate, location]);

  const capabilities = [
    {
      icon: <Route size={16} color="var(--color-primary)" />,
      title: "Algorithmic Route Pacing",
      desc: "Optimized daily sequencing with transit logistics and balanced sightseeing intervals."
    },
    {
      icon: <Building2 size={16} color="#D97706" />,
      title: "Verified Accommodations",
      desc: "Direct booking links to handpicked boutique, heritage, and luxury hotel stays."
    },
    {
      icon: <ShieldCheck size={16} color="#10B981" />,
      title: "Emergency Safety Coordination",
      desc: "Integrated tourist helplines, rapid police contacts, and emergency assistance."
    }
  ];

  return (
    <div className="auth-page-root">
      {/* ── LEFT SHOWCASE PANEL (Desktop / Large Viewports) ── */}
      <div className="auth-showcase-panel">
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.16,
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }}
        />

        {/* 1. Top Brand Lockup */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <img
              src={logoMark}
              alt="LukAround Logo"
              style={{
                width: '38px',
                height: '38px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
                flexShrink: 0
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-brand, "Outfit", sans-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '-0.45px',
                  color: '#FFFFFF'
                }}
              >
                Luk<span style={{ background: 'linear-gradient(135deg, #0A7274 0%, #38BDF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Around</span>
              </span>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#D1D5DB',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <ShieldCheck size={11} color="var(--color-primary)" />
                Enterprise Portal
              </span>
            </div>
          </div>
        </div>

        {/* 2. Middle Value Proposition & Capabilities (Zero Overflow) */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0', padding: '1rem 0' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 2.1vw, 2rem)',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '0.6rem',
              letterSpacing: '-0.3px',
              color: '#FFFFFF'
            }}
          >
            Intelligent Travel Logistics & Itinerary Architecture.
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.8rem, 0.95vw, 0.875rem)',
              color: '#9CA3AF',
              lineHeight: 1.5,
              maxWidth: '430px',
              marginBottom: '1.25rem'
            }}
          >
            Plan multi-city journeys across India with automated day-by-day pacing, verified accommodations, and emergency safety coordination.
          </p>

          {/* 3 Crisp Capability Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '430px' }}>
            {capabilities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.7rem',
                  padding: '0.65rem 0.8rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#F3F4F6', marginBottom: '0.1rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9CA3AF', lineHeight: 1.35 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Bottom Platform Status Bar */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.85rem',
            fontSize: '0.72rem',
            color: '#9CA3AF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                boxShadow: '0 0 6px #22C55E'
              }}
            />
            <span>Luk Around Platform • Operational</span>
          </div>

          <div>11+ Destinations Active</div>
        </div>
      </div>

      {/* ── RIGHT AUTHENTICATION PANEL (No duplicate logo, fully responsive) ── */}
      <div className="auth-form-panel">
        {children}
      </div>
    </div>
  );
}
