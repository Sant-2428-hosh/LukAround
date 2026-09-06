const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'platformSettings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory live visitor stream (retained in RAM with sliding window)
const liveVisitorsMap = new Map();

function readJsonFile(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    return false;
  }
}

// User store methods
const userStore = {
  getUsers() {
    return readJsonFile(USERS_FILE, []);
  },

  saveUsers(users) {
    return writeJsonFile(USERS_FILE, users);
  },

  getUserById(id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  getUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    const clean = String(email).trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === clean) || null;
  },

  /**
   * Determine role for a new user:
   * 1. If no users currently exist in DB OR no user has 'superadmin' role -> FIRST USER IS SUPER ADMIN!
   * 2. Else check if email is in adminInvites whitelist -> ADMIN
   * 3. Else standard 'user' ('Traveler')
   */
  resolveNewUserRole(email) {
    const users = this.getUsers();
    const hasSuperAdmin = users.some(u => u.role === 'superadmin');
    
    if (users.length === 0 || !hasSuperAdmin) {
      return {
        role: 'superadmin',
        title: 'Platform Super Administrator',
        isSuperAdmin: true,
        isAdmin: true
      };
    }

    const settings = this.getSettings();
    const cleanEmail = String(email).trim().toLowerCase();
    const isInvitedAdmin = (settings.adminInvites || []).some(
      inv => inv.email.toLowerCase() === cleanEmail && inv.status === 'pending'
    );

    if (isInvitedAdmin) {
      // Mark invite as accepted
      settings.adminInvites = settings.adminInvites.map(inv =>
        inv.email.toLowerCase() === cleanEmail ? { ...inv, status: 'claimed', claimedAt: new Date().toISOString() } : inv
      );
      this.saveSettings(settings);

      return {
        role: 'admin',
        title: 'Platform Administrator',
        isSuperAdmin: false,
        isAdmin: true
      };
    }

    return {
      role: 'user',
      title: 'Enterprise Traveler',
      isSuperAdmin: false,
      isAdmin: false
    };
  },

  createUser(userData) {
    const users = this.getUsers();
    const { role, title, isSuperAdmin, isAdmin } = this.resolveNewUserRole(userData.email);

    const newUser = {
      id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: userData.name || 'Traveler',
      email: String(userData.email).trim().toLowerCase(),
      passwordHash: userData.passwordHash || null,
      role: userData.role || role,
      title: userData.title || title,
      isSuperAdmin: userData.isSuperAdmin !== undefined ? userData.isSuperAdmin : isSuperAdmin,
      isAdmin: userData.isAdmin !== undefined ? userData.isAdmin : isAdmin,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'traveler')}`,
      status: 'active', // 'active' | 'suspended' | 'banned'
      provider: userData.provider || (userData.passwordHash ? 'password' : 'google'),
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      savedTripsCount: 0
    };

    users.push(newUser);
    this.saveUsers(users);

    this.addAuditLog(
      'USER_REGISTER',
      `User ${newUser.name} (${newUser.email}) registered with role: ${newUser.role.toUpperCase()}`,
      newUser.email
    );

    return newUser;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers(users);
    return users[index];
  },

  deleteUser(id) {
    const users = this.getUsers();
    const target = users.find(u => u.id === id);
    if (!target) return false;

    // Prevent deletion of the only superadmin
    if (target.role === 'superadmin') {
      const superAdmins = users.filter(u => u.role === 'superadmin');
      if (superAdmins.length <= 1) {
        throw new Error('Cannot delete the primary Super Administrator.');
      }
    }

    const filtered = users.filter(u => u.id !== id);
    this.saveUsers(filtered);
    return true;
  },

  // Platform Settings
  getSettings() {
    return readJsonFile(SETTINGS_FILE, {
      broadcast: { active: false, message: '', severity: 'info', updatedAt: null, updatedBy: null },
      featureFlags: {
        aiItineraryV2: true,
        userRegistrations: true,
        instantBooking: true,
        emergencySosDispatch: true,
        maintenanceMode: false
      },
      adminInvites: [],
      auditLogs: []
    });
  },

  saveSettings(settings) {
    return writeJsonFile(SETTINGS_FILE, settings);
  },

  addAuditLog(action, details, performedBy = 'System') {
    const settings = this.getSettings();
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      action,
      details,
      performedBy,
      timestamp: new Date().toISOString()
    };

    settings.auditLogs = [logEntry, ...(settings.auditLogs || [])].slice(0, 150); // Keep last 150 logs
    this.saveSettings(settings);
    return logEntry;
  },

  // Visitor Tracking
  trackVisitor(req) {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown Browser';
    const pathVisited = req.originalUrl || req.url || '/';
    const sessionId = req.cookies?.token ? `usr_sess_${req.cookies.token.slice(-8)}` : `anon_${ip.replace(/[^a-zA-Z0-9]/g, '')}`;

    const now = Date.now();
    const visitor = liveVisitorsMap.get(sessionId) || {
      id: sessionId,
      ip: ip.replace(/^::ffff:/, ''),
      userAgent: userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
      firstSeen: new Date(now).toISOString(),
      pageCount: 0
    };

    visitor.lastSeen = new Date(now).toISOString();
    visitor.currentRoute = pathVisited;
    visitor.pageCount += 1;

    // Attach user information if available
    if (req.user) {
      visitor.userEmail = req.user.email;
      visitor.userName = req.user.name;
      visitor.userRole = req.user.role;
    }

    liveVisitorsMap.set(sessionId, visitor);

    // Clean visitors inactive for > 15 minutes
    for (const [key, val] of liveVisitorsMap.entries()) {
      if (now - new Date(val.lastSeen).getTime() > 15 * 60 * 1000) {
        liveVisitorsMap.delete(key);
      }
    }
  },

  getLiveVisitors() {
    return Array.from(liveVisitorsMap.values()).sort(
      (a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );
  }
};

module.exports = userStore;
