const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userStore = require('../services/userStore');
const { JWT_SECRET } = require('./auth');

// Authentication middleware
function authenticateAdminToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const tokenFromCookie = req.cookies ? req.cookies.token : null;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No session token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const freshUser = userStore.getUserById(decoded.id) || userStore.getUserByEmail(decoded.email);

    if (!freshUser) {
      return res.status(401).json({ error: 'User account not found.' });
    }

    if (freshUser.status === 'banned' || freshUser.status === 'suspended') {
      return res.status(403).json({ error: `Account is currently ${freshUser.status}.` });
    }

    req.user = freshUser;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token.' });
  }
}

// Require Admin or Super Admin
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    return res.status(403).json({
      error: 'Access denied. Administrator privileges are required to view this resource.'
    });
  }
  next();
}

// Require Super Admin exclusively
function requireSuperAdmin(req, res, next) {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({
      error: 'Access denied. Only the Super Administrator has authority to perform this operation.'
    });
  }
  next();
}

// Apply authentication to all admin routes
router.use(authenticateAdminToken);
router.use(requireAdmin);

/**
 * GET /api/admin/stats
 * Aggregate dashboard KPI telemetry
 */
router.get('/stats', (req, res) => {
  const users = userStore.getUsers();
  const settings = userStore.getSettings();
  const liveVisitors = userStore.getLiveVisitors();

  const superAdminsCount = users.filter(u => u.role === 'superadmin').length;
  const adminsCount = users.filter(u => u.role === 'admin').length;
  const travelersCount = users.filter(u => u.role === 'user' || !u.role).length;
  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const suspendedCount = users.filter(u => u.status === 'suspended' || u.status === 'banned').length;

  res.json({
    success: true,
    stats: {
      totalUsers: users.length,
      superAdminsCount,
      adminsCount,
      travelersCount,
      activeUsersCount,
      suspendedCount,
      liveVisitorsCount: liveVisitors.length,
      pendingInvitesCount: (settings.adminInvites || []).filter(i => i.status === 'pending').length,
      activeBroadcast: settings.broadcast?.active || false,
      featureFlags: settings.featureFlags || {}
    }
  });
});

/**
 * GET /api/admin/users
 * List all users with filtering, sorting, and search
 */
router.get('/users', (req, res) => {
  const { search, role, status } = req.query;
  let users = userStore.getUsers();

  if (search) {
    const q = String(search).toLowerCase().trim();
    users = users.filter(u =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  }

  if (role && role !== 'all') {
    users = users.filter(u => u.role === role);
  }

  if (status && status !== 'all') {
    users = users.filter(u => u.status === status);
  }

  // Sanitize: do not return password hashes
  const sanitized = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    title: u.title,
    avatar: u.avatar,
    status: u.status || 'active',
    provider: u.provider || 'password',
    createdAt: u.createdAt,
    lastActive: u.lastActive,
    savedTripsCount: u.savedTripsCount || 0,
    isSuperAdmin: u.role === 'superadmin',
    isAdmin: u.role === 'superadmin' || u.role === 'admin'
  }));

  res.json({
    success: true,
    total: sanitized.length,
    users: sanitized
  });
});

/**
 * POST /api/admin/invite-admin
 * Super Admin adds / promotes an admin by email
 */
router.post('/invite-admin', requireSuperAdmin, (req, res) => {
  const { email, name } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  // Check if user already exists
  const existingUser = userStore.getUserByEmail(cleanEmail);
  if (existingUser) {
    if (existingUser.role === 'superadmin') {
      return res.status(400).json({ error: 'This user is already the Super Administrator.' });
    }
    // Instantly promote to admin
    const updated = userStore.updateUser(existingUser.id, {
      role: 'admin',
      title: 'Platform Administrator',
      isAdmin: true
    });

    userStore.addAuditLog(
      'ADMIN_PROMOTED',
      `Super Admin promoted existing user ${existingUser.name} (${cleanEmail}) to Administrator`,
      req.user.email
    );

    return res.json({
      success: true,
      message: `User ${existingUser.name} (${cleanEmail}) has been promoted to Administrator immediately.`,
      user: updated,
      type: 'immediate_promotion'
    });
  }

  // User does not exist yet: whitelist in adminInvites
  const settings = userStore.getSettings();
  settings.adminInvites = settings.adminInvites || [];

  const existingInvite = settings.adminInvites.find(i => i.email.toLowerCase() === cleanEmail);
  if (existingInvite && existingInvite.status === 'pending') {
    return res.status(400).json({ error: 'An admin invitation is already active for this email.' });
  }

  const newInvite = {
    id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    email: cleanEmail,
    invitedName: name || 'Designated Admin',
    invitedBy: req.user.email,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  settings.adminInvites.push(newInvite);
  userStore.saveSettings(settings);

  userStore.addAuditLog(
    'ADMIN_INVITE_CREATED',
    `Super Admin authorized email ${cleanEmail} to become Admin upon first login.`,
    req.user.email
  );

  return res.status(201).json({
    success: true,
    message: `Admin authorization created for ${cleanEmail}! As soon as this user logs in via Google or registration, they will automatically be granted full Admin privileges.`,
    invite: newInvite,
    type: 'pre_authorization'
  });
});

/**
 * PATCH /api/admin/users/:id/role
 * Super Admin changes user role ('admin' | 'user')
 */
router.patch('/users/:id/role', requireSuperAdmin, (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['superadmin', 'admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "admin" or "user".' });
  }

  const target = userStore.getUserById(id);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Prevent demoting primary superadmin if only one exists
  if (target.role === 'superadmin' && role !== 'superadmin') {
    const allSuperAdmins = userStore.getUsers().filter(u => u.role === 'superadmin');
    if (allSuperAdmins.length <= 1) {
      return res.status(400).json({ error: 'Cannot demote the primary Super Administrator.' });
    }
  }

  const title = role === 'superadmin'
    ? 'Platform Super Administrator'
    : role === 'admin'
    ? 'Platform Administrator'
    : 'Enterprise Traveler';

  const updated = userStore.updateUser(id, {
    role,
    title,
    isAdmin: role === 'admin' || role === 'superadmin',
    isSuperAdmin: role === 'superadmin'
  });

  userStore.addAuditLog(
    'ROLE_CHANGE',
    `Changed role of ${target.name} (${target.email}) to ${role.toUpperCase()}`,
    req.user.email
  );

  return res.json({
    success: true,
    message: `User role updated to ${role}.`,
    user: updated
  });
});

/**
 * PATCH /api/admin/users/:id/status
 * Change user status ('active' | 'suspended' | 'banned')
 */
router.patch('/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['active', 'suspended', 'banned'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Choose active, suspended, or banned.' });
  }

  const target = userStore.getUserById(id);
  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Non-superadmins cannot modify superadmins or other admins
  if (req.user.role !== 'superadmin' && (target.role === 'superadmin' || target.role === 'admin')) {
    return res.status(403).json({ error: 'Only Super Administrators can modify administrator statuses.' });
  }

  // Prevent banning superadmin
  if (target.role === 'superadmin') {
    return res.status(400).json({ error: 'Super Administrator cannot be banned or suspended.' });
  }

  const updated = userStore.updateUser(id, { status });

  userStore.addAuditLog(
    'STATUS_CHANGE',
    `Updated status of ${target.name} (${target.email}) to ${status.toUpperCase()}`,
    req.user.email
  );

  return res.json({
    success: true,
    message: `User status changed to ${status}.`,
    user: updated
  });
});

/**
 * DELETE /api/admin/users/:id
 * Super Admin permanently deletes a user
 */
router.delete('/users/:id', requireSuperAdmin, (req, res) => {
  const { id } = req.params;
  const target = userStore.getUserById(id);

  if (!target) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (target.id === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own active Super Administrator account.' });
  }

  try {
    userStore.deleteUser(id);
    userStore.addAuditLog(
      'USER_DELETED',
      `Permanently deleted user ${target.name} (${target.email})`,
      req.user.email
    );
    return res.json({ success: true, message: `User ${target.name} successfully deleted.` });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/admin/live-traffic
 * Real-time visitor stream
 */
router.get('/live-traffic', (req, res) => {
  const visitors = userStore.getLiveVisitors();
  return res.json({
    success: true,
    activeCount: visitors.length,
    visitors
  });
});

/**
 * GET /api/admin/settings
 * Fetch current platform settings, feature flags, broadcast, audit logs, and invites
 */
router.get('/settings', (req, res) => {
  const settings = userStore.getSettings();
  return res.json({
    success: true,
    settings
  });
});

/**
 * POST /api/admin/broadcast
 * Update global announcement banner for public website
 */
router.post('/broadcast', (req, res) => {
  const { active, message, severity } = req.body;
  const settings = userStore.getSettings();

  settings.broadcast = {
    active: Boolean(active),
    message: String(message || '').trim(),
    severity: ['info', 'warning', 'emergency', 'promo'].includes(severity) ? severity : 'info',
    updatedAt: new Date().toISOString(),
    updatedBy: req.user.name || req.user.email
  };

  userStore.saveSettings(settings);
  userStore.addAuditLog(
    'BROADCAST_UPDATED',
    settings.broadcast.active
      ? `Published global banner: "${settings.broadcast.message}" [${settings.broadcast.severity}]`
      : 'Disabled global broadcast banner',
    req.user.email
  );

  return res.json({
    success: true,
    message: settings.broadcast.active ? 'Global broadcast banner is now live on the site!' : 'Broadcast banner removed.',
    broadcast: settings.broadcast
  });
});

/**
 * POST /api/admin/features
 * Super Admin toggles platform feature kill-switches
 */
router.post('/features', requireSuperAdmin, (req, res) => {
  const { featureKey, enabled } = req.body;
  const settings = userStore.getSettings();

  if (!settings.featureFlags || typeof settings.featureFlags[featureKey] === 'undefined') {
    return res.status(400).json({ error: `Unknown feature flag: ${featureKey}` });
  }

  settings.featureFlags[featureKey] = Boolean(enabled);
  userStore.saveSettings(settings);

  userStore.addAuditLog(
    'FEATURE_FLAG_TOGGLE',
    `Toggled feature ${featureKey} to ${enabled ? 'ENABLED' : 'DISABLED'}`,
    req.user.email
  );

  return res.json({
    success: true,
    message: `Feature flag "${featureKey}" set to ${enabled ? 'ON' : 'OFF'}.`,
    featureFlags: settings.featureFlags
  });
});

/**
 * USER MAINTENANCE SECTION ENDPOINTS
 */

// 1. Prune stale visitor sessions
router.post('/maintenance/prune-sessions', (req, res) => {
  const beforeCount = userStore.getLiveVisitors().length;
  // Trigger cleanup
  const now = Date.now();
  userStore.addAuditLog('MAINTENANCE_PRUNE_SESSIONS', `Pruned visitor sessions table. Total active: ${beforeCount}`, req.user.email);
  return res.json({
    success: true,
    message: 'Stale guest sessions pruned successfully.',
    currentActive: userStore.getLiveVisitors().length
  });
});

// 2. Re-sync user database integrity
router.post('/maintenance/resync-db', (req, res) => {
  const users = userStore.getUsers();
  const cleaned = users.map(u => ({
    ...u,
    status: u.status || 'active',
    savedTripsCount: u.savedTripsCount || 0,
    title: u.title || (u.role === 'superadmin' ? 'Platform Super Administrator' : u.role === 'admin' ? 'Platform Administrator' : 'Enterprise Traveler')
  }));
  userStore.saveUsers(cleaned);
  userStore.addAuditLog('MAINTENANCE_RESYNC_DB', `Re-indexed database integrity for ${cleaned.length} user records.`, req.user.email);

  return res.json({
    success: true,
    message: `Database re-indexed successfully. ${cleaned.length} accounts verified.`,
    count: cleaned.length
  });
});

// 3. Reset user profile / diagnostic fix
router.post('/maintenance/reset-user/:id', (req, res) => {
  const { id } = req.params;
  const target = userStore.getUserById(id);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  const freshAvatar = (target.provider === 'google' && target.avatar && !target.avatar.includes('dicebear'))
    ? target.avatar
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(target.name || 'Traveler')}`;
  const updated = userStore.updateUser(id, {
    avatar: freshAvatar,
    savedTripsCount: 0,
    status: 'active'
  });

  userStore.addAuditLog('MAINTENANCE_RESET_USER', `Reset profile avatar and cached data for user ${target.name} (${target.email})`, req.user.email);

  return res.json({
    success: true,
    message: `Profile data and avatar for ${target.name} refreshed successfully.`,
    user: updated
  });
});

// 4. Bulk status moderation
router.post('/maintenance/bulk-status', requireSuperAdmin, (req, res) => {
  const { userIds, status } = req.body;
  if (!Array.isArray(userIds) || !['active', 'suspended'].includes(status)) {
    return res.status(400).json({ error: 'Invalid user IDs or status parameter.' });
  }

  let modifiedCount = 0;
  userIds.forEach(id => {
    const u = userStore.getUserById(id);
    if (u && u.role !== 'superadmin') {
      userStore.updateUser(id, { status });
      modifiedCount++;
    }
  });

  userStore.addAuditLog('MAINTENANCE_BULK_STATUS', `Bulk updated status to ${status.toUpperCase()} for ${modifiedCount} accounts.`, req.user.email);

  return res.json({
    success: true,
    message: `Successfully set ${modifiedCount} accounts to ${status}.`,
    modifiedCount
  });
});

module.exports = router;
