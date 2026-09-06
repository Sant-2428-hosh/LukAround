import React, { useState } from 'react';
import { AlertTriangle, Flame, Sparkles, Info, X, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BroadcastBanner() {
  const { broadcast } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!broadcast || !broadcast.active || !broadcast.message || dismissed) {
    return null;
  }

  const severityConfig = {
    emergency: {
      bg: 'linear-gradient(90deg, #991B1B 0%, #DC2626 50%, #991B1B 100%)',
      text: '#FFFFFF',
      icon: <Flame size={16} className="animate-pulse" />,
      tag: 'CRITICAL ADVISORY'
    },
    warning: {
      bg: 'linear-gradient(90deg, #92400E 0%, #D97706 50%, #92400E 100%)',
      text: '#FFFFFF',
      icon: <AlertTriangle size={16} />,
      tag: 'TRAVEL NOTICE'
    },
    promo: {
      bg: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #4F46E5 100%)',
      text: '#FFFFFF',
      icon: <Sparkles size={16} />,
      tag: 'EXCLUSIVE'
    },
    info: {
      bg: 'linear-gradient(90deg, #075985 0%, #0284C7 50%, #075985 100%)',
      text: '#FFFFFF',
      icon: <Info size={16} />,
      tag: 'BULLETIN'
    }
  };

  const config = severityConfig[broadcast.severity] || severityConfig.info;

  return (
    <div
      style={{
        background: config.bg,
        color: config.text,
        padding: '0.45rem 1rem',
        fontSize: '0.825rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 9998,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        letterSpacing: '0.2px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingRight: '2rem',
          textAlign: 'center'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '0.15rem 0.5rem',
            borderRadius: '999px',
            fontSize: '0.7rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontWeight: 800
          }}
        >
          {config.icon}
          {config.tag}
        </span>
        <span style={{ lineHeight: 1.3 }}>{broadcast.message}</span>
      </div>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.85)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          borderRadius: '4px'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}
