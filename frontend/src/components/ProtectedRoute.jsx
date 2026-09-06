import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Compass, ShieldCheck } from 'lucide-react';

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
            backgroundColor: 'var(--color-primary-light)',
            animation: 'pulse 1.8s infinite ease-in-out',
            opacity: 0.7
          }} />
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 24px rgba(192, 41, 60, 0.25)',
            zIndex: 2
          }}>
            <Compass size={28} />
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--color-ink)',
            marginBottom: '0.35rem',
            letterSpacing: '-0.3px'
          }}>
            Luk Around
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-ink-secondary)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={16} color="var(--color-primary)" />
            Verifying secure enterprise session credentials...
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
