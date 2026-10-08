import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Crown,
  Shield,
  Radio,
  Users,
  Megaphone,
  Sliders,
  FileText,
  Search,
  UserPlus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Flame,
  Sparkles,
  Info,
  RefreshCw,
  Eye,
  Lock,
  ArrowLeft,
  ExternalLink,
  Power,
  Globe,
  Smartphone,
  Monitor,
  Wrench,
  Download,
  RotateCcw,
  CheckSquare,
  Square,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  fetchAdminUsers,
  inviteAdminByEmail,
  updateUserRole,
  updateUserStatus,
  deleteUserAccount,
  getLiveTraffic,
  getAdminSettings,
  updateBroadcastBanner,
  toggleFeatureFlag,
  getAdminStats,
  pruneVisitorSessions,
  resyncUserDatabase,
  resetUserProfile,
  bulkUpdateUserStatus
} from '../api/client';

export default function AdminPanel() {
  const { user, token, isSuperAdmin, isAdmin, showToast, refreshBroadcast, currentTheme } = useApp();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('traffic'); // 'traffic' | 'users' | 'maintenance' | 'broadcast' | 'features' | 'logs'
  const [loading, setLoading] = useState(true);

  // Telemetry & Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    superAdminsCount: 0,
    adminsCount: 0,
    travelersCount: 0,
    activeUsersCount: 0,
    suspendedCount: 0,
    liveVisitorsCount: 0
  });

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  // Add Admin Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  // Live Traffic State
  const [visitors, setVisitors] = useState([]);
  const [autoRefreshTraffic, setAutoRefreshTraffic] = useState(true);

  // Broadcast State
  const [broadcastForm, setBroadcastForm] = useState({
    active: false,
    message: '',
    severity: 'info'
  });
  const [broadcastSubmitting, setBroadcastSubmitting] = useState(false);

  // Feature Flags & Settings
  const [featureFlags, setFeatureFlags] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);

  // Maintenance Selection State
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [maintenanceRunning, setMaintenanceRunning] = useState(false);

  // Load All Dashboard Data
  const loadDashboardData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [statsRes, usersRes, trafficRes, settingsRes] = await Promise.all([
        getAdminStats(token).catch(() => null),
        fetchAdminUsers(token).catch(() => null),
        getLiveTraffic(token).catch(() => null),
        getAdminSettings(token).catch(() => null)
      ]);

      if (statsRes && statsRes.stats) setStats(statsRes.stats);
      if (usersRes && usersRes.users) setUsersList(usersRes.users);
      if (trafficRes && trafficRes.visitors) setVisitors(trafficRes.visitors);
      if (settingsRes && settingsRes.settings) {
        if (settingsRes.settings.broadcast) setBroadcastForm(settingsRes.settings.broadcast);
        if (settingsRes.settings.featureFlags) setFeatureFlags(settingsRes.settings.featureFlags);
        if (settingsRes.settings.auditLogs) setAuditLogs(settingsRes.settings.auditLogs);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      showToast(err.message || 'Failed to sync admin telemetry', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  // Traffic Poller
  useEffect(() => {
    if (!autoRefreshTraffic || !token) return;
    const interval = setInterval(async () => {
      try {
        const res = await getLiveTraffic(token);
        if (res && res.visitors) setVisitors(res.visitors);
      } catch (e) {}
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefreshTraffic, token]);

  // Handle Add Admin by Email
  const handleInviteAdmin = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setInviteSubmitting(true);
    try {
      const res = await inviteAdminByEmail(token, { email: inviteEmail, name: inviteName });
      showToast(res.message || 'Admin authorized successfully!', 'success');
      setIsInviteModalOpen(false);
      setInviteEmail('');
      setInviteName('');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to add admin', 'error');
    } finally {
      setInviteSubmitting(false);
    }
  };

  // Handle User Role Change
  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      await updateUserRole(token, userId, newRole);
      showToast(`User role updated to ${newRole.toUpperCase()}`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update role', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle User Status Change (active | suspended | banned)
  const handleStatusChange = async (userId, newStatus) => {
    setActionLoading(userId);
    try {
      await updateUserStatus(token, userId, newStatus);
      showToast(`Account status set to ${newStatus.toUpperCase()}`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to change status', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle User Deletion
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"? This cannot be undone.`)) {
      return;
    }
    setActionLoading(userId);
    try {
      await deleteUserAccount(token, userId);
      showToast(`User "${userName}" deleted successfully`, 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Broadcast Submission
  const handleSaveBroadcast = async (e) => {
    e.preventDefault();
    setBroadcastSubmitting(true);
    try {
      const res = await updateBroadcastBanner(token, broadcastForm);
      showToast(res.message || 'Broadcast updated successfully', 'success');
      if (refreshBroadcast) refreshBroadcast();
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update broadcast', 'error');
    } finally {
      setBroadcastSubmitting(false);
    }
  };

  // Handle Feature Flag Toggle
  const handleToggleFlag = async (featureKey) => {
    if (!isSuperAdmin) {
      showToast('Only the Super Admin can toggle platform kill switches', 'error');
      return;
    }
    const currentVal = Boolean(featureFlags[featureKey]);
    const nextVal = !currentVal;
    try {
      await toggleFeatureFlag(token, featureKey, nextVal);
      setFeatureFlags((prev) => ({ ...prev, [featureKey]: nextVal }));
      showToast(`Feature "${featureKey}" is now ${nextVal ? 'ENABLED' : 'DISABLED'}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to toggle feature', 'error');
    }
  };

  // Maintenance Action: Prune Sessions
  const handlePruneSessions = async () => {
    setMaintenanceRunning(true);
    try {
      const res = await pruneVisitorSessions(token);
      showToast(res.message || 'Guest sessions pruned successfully', 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to prune sessions', 'error');
    } finally {
      setMaintenanceRunning(false);
    }
  };

  // Maintenance Action: Re-sync Database
  const handleResyncDb = async () => {
    setMaintenanceRunning(true);
    try {
      const res = await resyncUserDatabase(token);
      showToast(res.message || 'Database integrity verified', 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to re-sync database', 'error');
    } finally {
      setMaintenanceRunning(false);
    }
  };

  // Maintenance Action: Reset User Profile
  const handleResetUser = async (userId) => {
    setActionLoading(userId);
    try {
      const res = await resetUserProfile(token, userId);
      showToast(res.message || 'User profile reset successfully', 'success');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to reset profile', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Maintenance Action: Bulk Status Update
  const handleBulkStatus = async (status) => {
    if (selectedUserIds.length === 0) {
      showToast('Select at least one user to perform bulk maintenance', 'error');
      return;
    }
    setMaintenanceRunning(true);
    try {
      const res = await bulkUpdateUserStatus(token, { userIds: selectedUserIds, status });
      showToast(res.message || `Bulk status set to ${status.toUpperCase()}`, 'success');
      setSelectedUserIds([]);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Bulk maintenance failed', 'error');
    } finally {
      setMaintenanceRunning(false);
    }
  };

  // Maintenance Action: Export User Data
  const handleExportUsers = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(usersList, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `lukaround-users-maintenance-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Exported user records successfully!', 'success');
  };

  // Filtered Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div
      style={{
        minHeight: '85vh',
        backgroundColor: 'var(--color-canvas-warm)',
        color: 'var(--color-ink)',
        fontFamily: 'var(--font-body)',
        padding: 'clamp(1rem, 2.5vw, 2.5rem) clamp(0.75rem, 2.5vw, 2rem)'
      }}
    >
      <div style={{ maxWidth: 'clamp(320px, 94vw, 1380px)', margin: '0 auto' }}>
        {/* ── Executive Breadcrumb & Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'clamp(0.75rem, 2vw, 1.5rem)',
            marginBottom: 'clamp(1rem, 2vw, 1.75rem)',
            paddingBottom: 'clamp(0.75rem, 1.5vw, 1.25rem)',
            borderBottom: '1px solid var(--color-rule)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1.5vw, 1rem)' }}>
            <div
              style={{
                width: 'clamp(42px, 5vw, 52px)',
                height: 'clamp(42px, 5vw, 52px)',
                borderRadius: 'var(--radius-card)',
                backgroundColor: isSuperAdmin ? 'var(--color-primary)' : 'var(--color-primary-dark)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-rest)',
                flexShrink: 0
              }}
            >
              {isSuperAdmin ? <Crown size={26} color="#FDE047" /> : <Shield size={24} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.85rem)',
                    fontWeight: 800,
                    color: 'var(--color-ink)',
                    margin: 0,
                    letterSpacing: '-0.3px'
                  }}
                >
                  {isSuperAdmin ? 'Super Administrator Command Center' : 'Operations Admin Panel'}
                </h1>
                <span
                  style={{
                    fontSize: 'clamp(0.65rem, 1vw, 0.75rem)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isSuperAdmin ? 'var(--color-primary-light)' : 'var(--color-canvas-subtle)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)'
                  }}
                >
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <p
                style={{
                  fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)',
                  color: 'var(--color-ink-secondary)',
                  margin: '0.25rem 0 0',
                  fontWeight: 500
                }}
              >
                Website Theme Integrated • Real-Time Inbound Telemetry & Operations
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 1.5vw, 1rem)', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                padding: 'clamp(0.35rem, 1vw, 0.5rem) clamp(0.65rem, 1.5vw, 1rem)',
                borderRadius: 'var(--radius-full)',
                fontSize: 'clamp(0.72rem, 1.1vw, 0.825rem)',
                fontWeight: 700,
                color: '#059669',
                boxShadow: 'var(--shadow-rest)'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 8px #10B981'
                }}
                className="animate-pulse"
              />
              <span>{visitors.length} Active On Site</span>
            </div>

            <button
              type="button"
              onClick={loadDashboardData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: 'clamp(0.4rem, 1vw, 0.55rem) clamp(0.75rem, 1.5vw, 1rem)',
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-button)',
                fontSize: 'clamp(0.75rem, 1vw, 0.825rem)',
                fontWeight: 600,
                color: 'var(--color-ink)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-rest)',
                transition: 'all 0.15s ease'
              }}
              title="Refresh telemetry"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} color="var(--color-primary)" />
              <span className="hidden sm:inline">Sync Data</span>
            </button>
          </div>
        </div>

        {/* ── Metric Telemetry Cards (Responsive Clamp Grid) ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 20vw, 220px), 1fr))',
            gap: 'clamp(0.65rem, 1.5vw, 1.1rem)',
            marginBottom: 'clamp(1rem, 2vw, 1.75rem)'
          }}
        >
          {[
            { label: 'Total Registered', value: stats.totalUsers || usersList.length, icon: <Users size={18} color="var(--color-primary)" />, badge: 'Accounts' },
            { label: 'Super Admin', value: stats.superAdminsCount || usersList.filter(u => u.role === 'superadmin').length, icon: <Crown size={18} color="#D97706" />, badge: 'Master Authority' },
            { label: 'Operations Admins', value: stats.adminsCount || usersList.filter(u => u.role === 'admin').length, icon: <Shield size={18} color="#059669" />, badge: 'Staff' },
            { label: 'Active Travelers', value: stats.travelersCount || usersList.filter(u => u.role === 'user').length, icon: <Globe size={18} color="#4F46E5" />, badge: 'Public' },
            { label: 'Live Traffic Now', value: `${visitors.length} Active`, icon: <Radio size={18} color="#10B981" />, badge: 'Real-time Radar' },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(0.85rem, 2vw, 1.25rem)',
                boxShadow: 'var(--shadow-rest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: 'clamp(0.68rem, 1vw, 0.78rem)', color: 'var(--color-ink-secondary)', fontWeight: 600 }}>
                  {c.label}
                </div>
                <div
                  style={{
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    fontWeight: 800,
                    color: 'var(--color-ink)',
                    marginTop: '2px',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  {c.value}
                </div>
                <span style={{ fontSize: 'clamp(0.62rem, 0.9vw, 0.7rem)', color: 'var(--color-ink-tertiary)', fontWeight: 500 }}>
                  {c.badge}
                </span>
              </div>
              <div
                style={{
                  width: 'clamp(36px, 4vw, 44px)',
                  height: 'clamp(36px, 4vw, 44px)',
                  borderRadius: 'var(--radius-button)',
                  backgroundColor: 'var(--color-canvas-subtle)',
                  border: '1px solid var(--color-rule)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {c.icon}
              </div>
            </div>
          ))}
        </div>

        {/* ── Navigation Tabs ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(0.35rem, 1vw, 0.65rem)',
            borderBottom: '2px solid var(--color-rule)',
            paddingBottom: 'clamp(0.35rem, 1vw, 0.5rem)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            marginBottom: 'clamp(1rem, 2.5vw, 1.75rem)'
          }}
        >
          {[
            { id: 'traffic', label: '🛰️ Live Traffic Radar', badge: `${visitors.length}` },
            { id: 'images', label: '📸 Real Tourism Image Studio', badge: '198' },
            { id: 'users', label: '👥 User & Admin Command', badge: `${usersList.length}` },
            { id: 'maintenance', label: '🛠️ User Maintenance', badge: 'SYSTEM' },
            { id: 'broadcast', label: '📢 Global Broadcast Banner', badge: broadcastForm.active ? 'ACTIVE' : null },
            { id: 'features', label: '🎛️ Platform Controls & Switches', badge: isSuperAdmin ? 'MASTER' : 'VIEW' },
            { id: 'logs', label: '📜 Security Audit Trail', badge: `${auditLogs.length}` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'images') {
                  navigate('/admin/images');
                } else {
                  setActiveTab(tab.id);
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: 'clamp(0.5rem, 1.2vw, 0.7rem) clamp(0.75rem, 1.8vw, 1.15rem)',
                borderRadius: 'var(--radius-button)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                backgroundColor: activeTab === tab.id ? 'var(--color-primary-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-ink-secondary)',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: 'clamp(0.78rem, 1.2vw, 0.875rem)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    fontSize: 'clamp(0.6rem, 0.85vw, 0.7rem)',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: tab.badge === 'ACTIVE' ? 'var(--color-primary)' : 'var(--color-canvas)',
                    color: tab.badge === 'ACTIVE' ? '#FFFFFF' : 'var(--color-ink)',
                    border: '1px solid var(--color-rule)',
                    fontWeight: 800
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: LIVE TRAFFIC RADAR */}
        {/* ========================================================= */}
        {activeTab === 'traffic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.85rem, 2vw, 1.25rem)' }}>
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                boxShadow: 'var(--shadow-rest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                    fontWeight: 800,
                    margin: 0,
                    color: 'var(--color-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Radio size={20} color="#10B981" />
                  Live Traveler Radar & Session Stream
                </h2>
                <p style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: 'var(--color-ink-secondary)', margin: '0.25rem 0 0' }}>
                  Real-time monitor of incoming visitors, explored destinations, devices, and heartbeats.
                </p>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'clamp(0.75rem, 1.1vw, 0.85rem)', color: 'var(--color-ink)', fontWeight: 600, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoRefreshTraffic}
                  onChange={(e) => setAutoRefreshTraffic(e.target.checked)}
                />
                <span>Live Pulse (Auto-poll 8s)</span>
              </label>
            </div>

            {/* Radar Stream Table */}
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-rest)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-canvas-subtle)', color: 'var(--color-ink-secondary)', borderBottom: '1px solid var(--color-rule)', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 0.9vw, 0.72rem)', letterSpacing: '0.5px' }}>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Visitor ID / User</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Current Route</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Device Type</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Hits</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Arrival Time</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Last Ping</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>State</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: '0.875rem' }}>
                        No incoming traffic recorded yet. Open a public tab to see it stream live!
                      </td>
                    </tr>
                  ) : (
                    visitors.map((v, idx) => (
                      <tr key={v.id || idx} style={{ borderBottom: '1px solid var(--color-rule)', fontSize: 'clamp(0.75rem, 1.1vw, 0.825rem)' }}>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{v.userName || 'Anonymous Traveler'}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--color-ink-tertiary)' }}>{v.userEmail || v.ip}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontWeight: 600 }}>
                          {v.currentRoute || '/'}
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            {v.userAgent?.includes('Mobile') ? <Smartphone size={14} /> : <Monitor size={14} />}
                            <span>{v.userAgent}</span>
                          </div>
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink)', fontWeight: 700 }}>
                          {v.pageCount || 1}
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink-tertiary)', fontSize: '0.75rem' }}>
                          {v.firstSeen ? new Date(v.firstSeen).toLocaleTimeString() : 'Just now'}
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: '#059669', fontSize: '0.75rem', fontWeight: 600 }}>
                          {v.lastSeen ? new Date(v.lastSeen).toLocaleTimeString() : 'Active'}
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>
                          <span style={{ fontSize: '0.675rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-full)', backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                            ACTIVE
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: USER & ADMIN COMMAND */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.85rem, 2vw, 1.25rem)' }}>
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                boxShadow: 'var(--shadow-rest)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: 'clamp(280px, 45vw, 480px)' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink-tertiary)' }} />
                  <input
                    type="text"
                    placeholder="Search by user name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.45rem, 1vw, 0.6rem) 0.5rem clamp(0.45rem, 1vw, 0.6rem) 2rem',
                      backgroundColor: 'var(--color-canvas-warm)',
                      border: '1px solid var(--color-rule)',
                      borderRadius: 'var(--radius-button)',
                      color: 'var(--color-ink)',
                      fontSize: 'clamp(0.78rem, 1.1vw, 0.85rem)'
                    }}
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    backgroundColor: 'var(--color-canvas-warm)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-button)',
                    color: 'var(--color-ink)',
                    fontSize: 'clamp(0.75rem, 1.1vw, 0.825rem)',
                    padding: 'clamp(0.45rem, 1vw, 0.6rem) 0.75rem'
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="superadmin">Super Admins</option>
                  <option value="admin">Admins</option>
                  <option value="user">Travelers</option>
                </select>
              </div>

              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    padding: 'clamp(0.5rem, 1.2vw, 0.65rem) clamp(0.85rem, 1.8vw, 1.25rem)',
                    fontSize: 'clamp(0.78rem, 1.1vw, 0.85rem)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-rest)'
                  }}
                >
                  <UserPlus size={16} />
                  <span>Add / Promote Admin by Email</span>
                </button>
              )}
            </div>

            {/* Users Table */}
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-rest)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-canvas-subtle)', color: 'var(--color-ink-secondary)', borderBottom: '1px solid var(--color-rule)', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 0.9vw, 0.72rem)', letterSpacing: '0.5px' }}>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>User Profile</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Email</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Authority</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Provider</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Status</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Joined</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: '0.875rem' }}>
                        No users found matching your search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, idx) => (
                      <tr key={u.id || idx} style={{ borderBottom: '1px solid var(--color-rule)', fontSize: 'clamp(0.75rem, 1.1vw, 0.825rem)' }}>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                            <img
                              src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                              alt={u.name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-rule)' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{u.name}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--color-ink-tertiary)' }}>ID: {u.id}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink)' }}>
                          {u.email}
                        </td>

                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              fontSize: '0.685rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor:
                                u.role === 'superadmin'
                                  ? 'var(--color-primary-light)'
                                  : u.role === 'admin'
                                  ? '#CCFBF1'
                                  : 'var(--color-canvas-subtle)',
                              color:
                                u.role === 'superadmin'
                                  ? 'var(--color-primary)'
                                  : u.role === 'admin'
                                  ? '#0F766E'
                                  : 'var(--color-ink-secondary)',
                              border: '1px solid var(--color-rule)'
                            }}
                          >
                            {u.role === 'superadmin' && <Crown size={12} />}
                            {u.role === 'admin' && <Shield size={12} />}
                            {u.role ? u.role.toUpperCase() : 'USER'}
                          </span>
                        </td>

                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
                          {u.provider === 'google' ? 'Google OAuth' : 'Password'}
                        </td>

                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.45rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor:
                                u.status === 'banned'
                                  ? '#FEE2E2'
                                  : u.status === 'suspended'
                                  ? '#FEF3C7'
                                  : '#ECFDF5',
                              color:
                                u.status === 'banned'
                                  ? '#DC2626'
                                  : u.status === 'suspended'
                                  ? '#D97706'
                                  : '#059669',
                              border: '1px solid var(--color-rule)'
                            }}
                          >
                            {(u.status || 'ACTIVE').toUpperCase()}
                          </span>
                        </td>

                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink-tertiary)', fontSize: '0.75rem' }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                        </td>

                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                            {isSuperAdmin && u.id !== user.id && (
                              <select
                                value={u.role || 'user'}
                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                disabled={actionLoading === u.id}
                                style={{
                                  backgroundColor: 'var(--color-canvas)',
                                  border: '1px solid var(--color-rule)',
                                  borderRadius: 'var(--radius-button)',
                                  color: 'var(--color-ink)',
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.45rem',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="user">Traveler</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                              </select>
                            )}

                            {u.role !== 'superadmin' && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'suspended' : 'active')}
                                disabled={actionLoading === u.id}
                                style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: 'var(--radius-button)',
                                  border: '1px solid var(--color-rule)',
                                  backgroundColor: u.status === 'active' ? 'var(--color-canvas)' : '#ECFDF5',
                                  color: u.status === 'active' ? '#D97706' : '#059669',
                                  fontSize: '0.725rem',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            )}

                            {isSuperAdmin && u.id !== user.id && (
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                disabled={actionLoading === u.id}
                                style={{
                                  padding: '0.25rem 0.45rem',
                                  borderRadius: 'var(--radius-button)',
                                  border: '1px solid #FECACA',
                                  backgroundColor: '#FEF2F2',
                                  color: '#DC2626',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                title="Delete user"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SEPARATE USER MAINTENANCE SECTION */}
        {/* ========================================================= */}
        {activeTab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
            {/* Maintenance Overview Cards */}
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                boxShadow: 'var(--shadow-rest)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Wrench size={22} color="var(--color-primary)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                  User Maintenance & System Diagnostic Operations
                </h2>
              </div>
              <p style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Dedicated maintenance tools to prune guest sessions, verify account database integrity, reset corrupted profiles, and bulk moderate user access.
              </p>

              {/* Maintenance Tools Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 28vw, 360px), 1fr))',
                  gap: 'clamp(0.75rem, 2vw, 1.25rem)',
                  marginTop: 'clamp(1rem, 2vw, 1.5rem)'
                }}
              >
                {/* Tool 1 */}
                <div
                  style={{
                    backgroundColor: 'var(--color-canvas-warm)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'clamp(0.85rem, 2vw, 1.25rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                      <RotateCcw size={16} color="var(--color-primary)" />
                      <span>Re-Sync User DB Integrity</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary)', margin: '0.35rem 0 1rem' }}>
                      Re-indexes users.json, verifies required schema fields, and fixes orphaned trip counts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResyncDb}
                    disabled={maintenanceRunning}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-button)',
                      backgroundColor: 'var(--color-canvas)',
                      border: '1px solid var(--color-rule)',
                      color: 'var(--color-ink)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <RefreshCw size={14} className={maintenanceRunning ? 'animate-spin' : ''} />
                    <span>Run Database Re-Sync</span>
                  </button>
                </div>

                {/* Tool 2 */}
                <div
                  style={{
                    backgroundColor: 'var(--color-canvas-warm)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'clamp(0.85rem, 2vw, 1.25rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                      <Activity size={16} color="#10B981" />
                      <span>Prune Stale Guest Sessions</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary)', margin: '0.35rem 0 1rem' }}>
                      Purges inactive visitor radar sessions older than 15 minutes to keep telemetry lean.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePruneSessions}
                    disabled={maintenanceRunning}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-button)',
                      backgroundColor: 'var(--color-canvas)',
                      border: '1px solid var(--color-rule)',
                      color: 'var(--color-ink)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Activity size={14} />
                    <span>Prune Guest Sessions</span>
                  </button>
                </div>

                {/* Tool 3 */}
                <div
                  style={{
                    backgroundColor: 'var(--color-canvas-warm)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'clamp(0.85rem, 2vw, 1.25rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-ink)' }}>
                      <Download size={16} color="#4F46E5" />
                      <span>Export Maintenance Backup</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-ink-secondary)', margin: '0.35rem 0 1rem' }}>
                      Generates an instant offline JSON file of all user accounts and system state.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportUsers}
                    style={{
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-button)',
                      backgroundColor: 'var(--color-canvas)',
                      border: '1px solid var(--color-rule)',
                      color: 'var(--color-ink)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Download size={14} />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions & Diagnostic User Table */}
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-rest)',
                overflow: 'hidden'
              }}
            >
              {/* Bulk Toolbar */}
              <div
                style={{
                  padding: 'clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem)',
                  borderBottom: '1px solid var(--color-rule)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  backgroundColor: 'var(--color-canvas-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedUserIds.length === usersList.length) {
                        setSelectedUserIds([]);
                      } else {
                        setSelectedUserIds(usersList.map((u) => u.id));
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--color-ink)'
                    }}
                  >
                    {selectedUserIds.length > 0 && selectedUserIds.length === usersList.length ? (
                      <CheckSquare size={16} color="var(--color-primary)" />
                    ) : (
                      <Square size={16} color="var(--color-ink-tertiary)" />
                    )}
                    <span>Select All ({selectedUserIds.length} chosen)</span>
                  </button>
                </div>

                {isSuperAdmin && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleBulkStatus('active')}
                      disabled={selectedUserIds.length === 0 || maintenanceRunning}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-button)',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: selectedUserIds.length === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Bulk Activate
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBulkStatus('suspended')}
                      disabled={selectedUserIds.length === 0 || maintenanceRunning}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-button)',
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        color: '#D97706',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: selectedUserIds.length === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Bulk Suspend
                    </button>
                  </div>
                )}
              </div>

              {/* Maintenance Diagnostic Table */}
              <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-canvas)', color: 'var(--color-ink-secondary)', borderBottom: '1px solid var(--color-rule)', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 0.9vw, 0.72rem)', letterSpacing: '0.5px' }}>
                      <th style={{ width: '40px', padding: '0.75rem 1rem' }}></th>
                      <th style={{ padding: '0.75rem 1rem' }}>User Profile</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Account Health</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Auth Provider</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Trips Cache</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Maintenance Tools</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => {
                      const isSelected = selectedUserIds.includes(u.id);
                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--color-rule)', fontSize: 'clamp(0.75rem, 1.1vw, 0.825rem)' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUserIds((prev) =>
                                  isSelected ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                                );
                              }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                            >
                              {isSelected ? (
                                <CheckSquare size={16} color="var(--color-primary)" />
                              ) : (
                                <Square size={16} color="var(--color-ink-tertiary)" />
                              )}
                            </button>
                          </td>

                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <img
                                src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                                alt={u.name}
                                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-ink)' }}>{u.name}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-ink-tertiary)' }}>{u.email}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                fontSize: '0.675rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: u.status === 'active' ? '#ECFDF5' : '#FEF3C7',
                                color: u.status === 'active' ? '#059669' : '#D97706',
                                border: '1px solid var(--color-rule)'
                              }}
                            >
                              {u.status === 'active' ? 'HEALTHY (ACTIVE)' : 'SUSPENDED'}
                            </span>
                          </td>

                          <td style={{ padding: '0.75rem 1rem', color: 'var(--color-ink-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
                            {u.provider === 'google' ? 'Google SSO' : 'Standard Password'}
                          </td>

                          <td style={{ padding: '0.75rem 1rem', color: 'var(--color-ink)', fontWeight: 600 }}>
                            {u.savedTripsCount || 0} Itineraries
                          </td>

                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleResetUser(u.id)}
                              disabled={actionLoading === u.id}
                              style={{
                                padding: '0.35rem 0.65rem',
                                borderRadius: 'var(--radius-button)',
                                backgroundColor: 'var(--color-canvas)',
                                border: '1px solid var(--color-rule)',
                                color: 'var(--color-ink)',
                                fontSize: '0.725rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                              title="Reset user avatar, cached counts, and clean state"
                            >
                              {actionLoading === u.id ? 'Resetting...' : 'Reset Cache & Profile'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: GLOBAL BROADCAST BANNER */}
        {/* ========================================================= */}
        {activeTab === 'broadcast' && (
          <div style={{ maxWidth: 'clamp(320px, 92vw, 820px)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1rem, 2.5vw, 1.75rem)',
                boxShadow: 'var(--shadow-rest)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Megaphone size={22} color="var(--color-primary)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                  Global Website Broadcast Center
                </h2>
              </div>
              <p style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Deploy a real-time announcement or emergency banner across the header of every page on the public site.
              </p>

              <form onSubmit={handleSaveBroadcast} style={{ marginTop: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.85rem, 1.5vw, 1.25rem)' }}>
                {/* Active Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', backgroundColor: 'var(--color-canvas-warm)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-button)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-ink)' }}>Broadcast Live Status</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-secondary)' }}>Toggle to show or hide the announcement on the live website</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={broadcastForm.active}
                    onChange={(e) => setBroadcastForm((prev) => ({ ...prev, active: e.target.checked }))}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                {/* Severity Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                    Advisory Severity Theme
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(130px, 20vw, 180px), 1fr))', gap: '0.5rem' }}>
                    {[
                      { id: 'emergency', label: 'Emergency (Red)', color: '#DC2626' },
                      { id: 'warning', label: 'Warning (Amber)', color: '#D97706' },
                      { id: 'promo', label: 'Promo (Indigo)', color: '#6366F1' },
                      { id: 'info', label: 'Bulletin (Sky)', color: '#0284C7' },
                    ].map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setBroadcastForm((prev) => ({ ...prev, severity: s.id }))}
                        style={{
                          padding: '0.65rem 0.5rem',
                          borderRadius: 'var(--radius-button)',
                          border: broadcastForm.severity === s.id ? `2px solid ${s.color}` : '1px solid var(--color-rule)',
                          backgroundColor: broadcastForm.severity === s.id ? 'var(--color-canvas-subtle)' : 'var(--color-canvas)',
                          color: 'var(--color-ink)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }} />
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Text */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.4rem' }}>
                    Announcement Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g., Heavy monsoon rainfall alert for Munnar routes: emergency response active. Or: Flash 25% discount on Jaipur heritage luxury resorts!"
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm((prev) => ({ ...prev, message: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      backgroundColor: 'var(--color-canvas-warm)',
                      border: '1px solid var(--color-rule)',
                      borderRadius: 'var(--radius-button)',
                      color: 'var(--color-ink)',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                {/* Live Preview Simulation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink-tertiary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Live Preview Simulation
                  </label>
                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-button)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      background:
                        broadcastForm.severity === 'emergency'
                          ? 'linear-gradient(90deg, #991B1B, #DC2626)'
                          : broadcastForm.severity === 'warning'
                          ? 'linear-gradient(90deg, #92400E, #D97706)'
                          : broadcastForm.severity === 'promo'
                          ? 'linear-gradient(90deg, #4F46E5, #7C3AED)'
                          : 'linear-gradient(90deg, #075985, #0284C7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      textAlign: 'center'
                    }}
                  >
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.25)', padding: '0.15rem 0.45rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 800 }}>
                      {broadcastForm.severity.toUpperCase()}
                    </span>
                    <span>{broadcastForm.message || 'No broadcast message composed yet...'}</span>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={broadcastSubmitting}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: broadcastForm.active ? 'var(--color-primary)' : 'var(--color-ink)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-rest)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {broadcastSubmitting
                    ? 'Updating...'
                    : broadcastForm.active
                    ? 'Publish Live Broadcast to Website'
                    : 'Save Configuration (Inactive)'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: PLATFORM CONTROLS & SWITCHES */}
        {/* ========================================================= */}
        {activeTab === 'features' && (
          <div style={{ maxWidth: 'clamp(320px, 92vw, 820px)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1rem, 2.5vw, 1.75rem)',
                boxShadow: 'var(--shadow-rest)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                <Sliders size={22} color="var(--color-primary)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                  Platform Controls & Feature Kill Switches
                </h2>
              </div>
              <p style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Instant live feature toggles. Changes reflect dynamically across the site without restarting services.
              </p>

              <div style={{ marginTop: 'clamp(1rem, 2vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  {
                    key: 'aiItineraryV2',
                    title: 'AI Smart Itinerary Engine V2',
                    desc: 'Generates day-by-day itineraries, budget breakdowns, and activity schedules.'
                  },
                  {
                    key: 'userRegistrations',
                    title: 'Public User Registrations',
                    desc: 'Allow new travelers to create accounts. (If disabled, only existing users can log in).'
                  },
                  {
                    key: 'instantBooking',
                    title: 'Direct Hotel Booking Redirection Portals',
                    desc: 'Enable instant redirection to verified booking partners like MakeMyTrip, Agoda, and Booking.com.'
                  },
                  {
                    key: 'emergencySosDispatch',
                    title: 'Emergency SOS Modal & Helplines',
                    desc: 'Quick access to 112 National Helpline, Tourist police, and medical ambulance emergency triggers.'
                  },
                  {
                    key: 'maintenanceMode',
                    title: 'Site Maintenance Mode',
                    desc: 'Display temporary maintenance screen to regular users while Admins retain full access.'
                  }
                ].map((f) => {
                  const isEnabled = Boolean(featureFlags[f.key]);
                  return (
                    <div
                      key={f.key}
                      style={{
                        padding: 'clamp(0.75rem, 1.8vw, 1.1rem)',
                        borderRadius: 'var(--radius-button)',
                        backgroundColor: 'var(--color-canvas-warm)',
                        border: isEnabled ? '1px solid var(--color-rule)' : '1px solid #FECACA',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-ink)' }}>{f.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-ink-secondary)', marginTop: '2px' }}>{f.desc}</div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFlag(f.key)}
                        disabled={!isSuperAdmin}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-button)',
                          backgroundColor: isEnabled ? '#ECFDF5' : '#FEF2F2',
                          color: isEnabled ? '#059669' : '#DC2626',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: isSuperAdmin ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          minWidth: '85px',
                          justifyContent: 'center',
                          border: `1px solid ${isEnabled ? '#A7F3D0' : '#FECACA'}`
                        }}
                      >
                        <Power size={13} />
                        <span>{isEnabled ? 'ACTIVE' : 'MUTED'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SECURITY AUDIT TRAIL */}
        {/* ========================================================= */}
        {activeTab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.85rem, 2vw, 1.25rem)' }}>
            <div
              style={{
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--color-rule)',
                borderRadius: 'var(--radius-card)',
                padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                boxShadow: 'var(--shadow-rest)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <FileText size={20} color="var(--color-primary)" />
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                  System Security & Operational Audit Trail
                </h2>
              </div>
              <p style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.85rem)', color: 'var(--color-ink-secondary)', margin: 0 }}>
                Immutable ledger of logins, promotions, broadcast deployments, and administrative maintenance actions.
              </p>
            </div>

            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', backgroundColor: 'var(--color-canvas)', border: '1px solid var(--color-rule)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-rest)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-canvas-subtle)', color: 'var(--color-ink-secondary)', borderBottom: '1px solid var(--color-rule)', textTransform: 'uppercase', fontSize: 'clamp(0.65rem, 0.9vw, 0.72rem)', letterSpacing: '0.5px' }}>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Action Code</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Event Details</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>Executed By</th>
                    <th style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', textAlign: 'right' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', color: 'var(--color-ink-tertiary)', fontSize: '0.875rem' }}>
                        No audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log, idx) => (
                      <tr key={log.id || idx} style={{ borderBottom: '1px solid var(--color-rule)', fontSize: 'clamp(0.75rem, 1.1vw, 0.825rem)' }}>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)' }}>
                          <span style={{ fontSize: '0.675rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: 'var(--radius-button)', backgroundColor: 'var(--color-canvas-subtle)', color: 'var(--color-ink)', border: '1px solid var(--color-rule)', fontFamily: 'var(--font-mono)' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-ink)', fontWeight: 500 }}>
                          {log.details}
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 600 }}>
                          {log.performedBy}
                        </td>
                        <td style={{ padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(0.75rem, 1.8vw, 1rem)', textAlign: 'right', color: 'var(--color-ink-tertiary)', fontSize: '0.75rem' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Promote Admin Modal ── */}
      {isInviteModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            style={{
              maxWidth: 'clamp(300px, 92vw, 480px)',
              width: '100%',
              backgroundColor: 'var(--color-canvas)',
              borderRadius: 'var(--radius-card)',
              border: '2px solid var(--color-primary)',
              padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <Crown size={22} color="var(--color-primary)" />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', fontWeight: 800, margin: 0, color: 'var(--color-ink)' }}>
                Add New Admin by Email
              </h3>
            </div>
            <p style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.825rem)', color: 'var(--color-ink-secondary)', margin: '0 0 1.25rem' }}>
              Super Admin privilege: Enter an email address. If already registered, they receive Admin powers immediately. If not, they are pre-authorized to become an Admin upon their first sign-in!
            </p>

            <form onSubmit={handleInviteAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.35rem' }}>
                  Admin Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin.colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-canvas-warm)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-button)',
                    color: 'var(--color-ink)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: '0.35rem' }}>
                  Designated Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Operations Specialist"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--color-canvas-warm)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-button)',
                    color: 'var(--color-ink)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '0.65rem',
                    backgroundColor: 'var(--color-canvas-subtle)',
                    color: 'var(--color-ink)',
                    border: '1px solid var(--color-rule)',
                    borderRadius: 'var(--radius-button)',
                    fontWeight: 600,
                    fontSize: '0.825rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  style={{
                    flex: 2,
                    padding: '0.65rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    fontWeight: 800,
                    fontSize: '0.825rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-rest)'
                  }}
                >
                  {inviteSubmitting ? 'Authorizing...' : 'Authorize Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
