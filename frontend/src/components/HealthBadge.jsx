import React from 'react';
import { Server, Database, Activity, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function HealthBadge({ health, loading, onRefresh }) {
  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <RefreshCw size={18} className="animate-spin" color="var(--primary-light)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pinging backend API...</span>
        </div>
      </div>
    );
  }

  const isServerOnline = health?.status === 'online';
  const isDbConnected = health?.database?.connected;

  return (
    <div className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={20} color="var(--primary-light)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Connection Health Monitor</h3>
        </div>
        <button
          onClick={onRefresh}
          className="btn btn-outline"
          style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
          title="Re-check API status"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {/* Express Server Badge */}
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Server size={16} /> Node / Express API
            </span>
            {isServerOnline ? (
              <span className="badge badge-success">
                <span className="status-dot online"></span> Connected
              </span>
            ) : (
              <span className="badge badge-danger">
                <span className="status-dot offline"></span> Disconnected
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>Target: <code>http://localhost:5000/api/health</code></div>
            {isServerOnline && (
              <div style={{ marginTop: '0.2rem', color: '#9CA3AF' }}>
                Uptime: {health.uptimeSeconds}s | Node: {health.system?.nodeVersion}
              </div>
            )}
          </div>
        </div>

        {/* PostgreSQL DB Badge */}
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Database size={16} /> PostgreSQL Database
            </span>
            {isDbConnected ? (
              <span className="badge badge-success">
                <CheckCircle2 size={13} /> Active ({health.database?.latencyMs}ms)
              </span>
            ) : (
              <span className="badge badge-warning">
                <AlertCircle size={13} /> Mock Mode
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div>Status: {health?.database?.mode || 'Offline'}</div>
            {!isDbConnected && (
              <div style={{ color: '#FBBF24', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                Start local PostgreSQL to sync schema.sql
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
