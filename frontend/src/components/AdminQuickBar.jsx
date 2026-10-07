import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Crown, Radio, ChevronRight, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminQuickBar() {
  const { user, isSuperAdmin, isAdmin } = useApp();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Do not show if not admin, or already on /admin page
  if (!isAdmin || location.pathname.startsWith('/admin')) {
    return null;
  }

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        title="Open Admin Quick Controls"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9990,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          backgroundColor: isSuperAdmin ? '#B45309' : '#0F766E',
          color: '#FFFFFF',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s',
        }}
      >
        {isSuperAdmin ? <Crown size={22} color="#FDE047" /> : <Shield size={20} />}
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9990,
        backgroundColor: isSuperAdmin
          ? 'rgba(26, 17, 8, 0.95)'
          : 'rgba(6, 38, 35, 0.95)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${isSuperAdmin ? '#F59E0B' : '#14B8A6'}`,
        borderRadius: '16px',
        padding: '0.65rem 0.9rem',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#FFFFFF',
        maxWidth: '380px'
      }}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          backgroundColor: isSuperAdmin ? 'rgba(245, 158, 11, 0.2)' : 'rgba(20, 184, 166, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {isSuperAdmin ? <Crown size={18} color="#FBBF24" /> : <Shield size={18} color="#2DD4BF" />}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: isSuperAdmin ? '#FDE047' : '#5EEAD4'
            }}
          >
            {isSuperAdmin ? '👑 Super Admin' : '🛡️ Admin Access'}
          </span>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981'
            }}
          />
        </div>
        <span style={{ fontSize: '0.75rem', color: '#D1D5DB', fontWeight: 500 }}>
          Manage incoming visitors & controls
        </span>
      </div>

      <Link
        to="/admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          backgroundColor: isSuperAdmin ? '#F59E0B' : '#0D9488',
          color: '#FFFFFF',
          textDecoration: 'none',
          padding: '0.4rem 0.65rem',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.15s ease'
        }}
      >
        <span>Command</span>
        <ChevronRight size={13} />
      </Link>

      <button
        type="button"
        onClick={() => setCollapsed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#9CA3AF',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Minimize Quick Bar"
      >
        <X size={14} />
      </button>
    </div>
  );
}
