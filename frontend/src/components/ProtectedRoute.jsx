import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShieldCheck } from 'lucide-react';
import logoMark from '../assets/logo-mark.png';
import logoWordmark from '../assets/logo-wordmark.png';

export default function ProtectedRoute({ children, requireAdmin = false, requireSuperAdmin = false }) {
  const { user, isAuthChecking, isAdmin, isSuperAdmin } = useApp();
  const location = useLocation();

  if (isAuthChecking) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'var(--font-body)'
      }}>
        {/* Animated Brand Pulsing Icon */}
        <div style={{
          position: 'relative',
          width: '72px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 114, 116, 0.15)',
            animation: 'pulse 1.8s infinite ease-in-out',
            opacity: 0.7
          }} />
          <img
            src={logoMark}
            alt="LukAround Logo"
            style={{
              width: '56px',
              height: '56px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 6px 16px rgba(10, 114, 116, 0.25))',
              zIndex: 2
            }}
          />
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <img
            src={logoWordmark}
            alt="LukAround"
            style={{
              height: '30px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '0.45rem',
              display: 'inline-block'
            }}
          />
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-ink-secondary)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={16} color="#0A7274" />
            Travel beyond the Ordinary — Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated user to /login, preserving target page in location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin access gate
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Super Admin access gate
  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
}
