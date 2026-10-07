import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Building2, Route } from 'lucide-react';
import { useApp } from '../context/AppContext';
import logoMark from '../assets/logo-mark.png';
import logoWordmarkLight from '../assets/logo-wordmark-light.png';

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
      title: "Smart Day-by-Day Itineraries",
      desc: "Clustered routes with balanced transit logistics and zero backtracking."
    },
    {
      icon: <Building2 size={16} color="#D97706" />,
      title: "Verified Heritage & Boutique Stays",
      desc: "Curated accommodations tailored to authentic local travel styles."
    },
    {
      icon: <ShieldCheck size={16} color="#10B981" />,
      title: "24/7 Verified Tourist Safety",
      desc: "Instant access to verified police helplines and medical assistance."
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

        {/* 1. Top Brand Lockup (Clean, professional, without enterprise tags) */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={logoMark}
              alt="LukAround Logo"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))',
                flexShrink: 0
              }}
            />

            <img
              src={logoWordmarkLight}
              alt="LukAround"
              style={{
                height: '26px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
        </div>

        {/* 2. Middle Value Proposition & Capabilities */}
        <div style={{ position: 'relative', zIndex: 2, margin: 'auto 0', padding: '1.5rem 0' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.65rem, 2.3vw, 2.2rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}
          >
            Travel Beyond the Ordinary.
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.85rem, 1vw, 0.95rem)',
              color: '#9CA3AF',
              lineHeight: 1.6,
              maxWidth: '430px',
              marginBottom: '1.75rem'
            }}
          >
            Plan multi-city journeys across India with intelligent day-by-day pacing, handpicked stays, and real-time culinary guidance.
          </p>

          {/* 3 Crisp Capability Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '430px' }}>
            {capabilities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.8rem',
                  padding: '0.75rem 0.95rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.07)'
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
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
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F3F4F6', marginBottom: '0.15rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT AUTHENTICATION PANEL ── */}
      <div className="auth-form-panel">
        {children}
      </div>
    </div>
  );
}
