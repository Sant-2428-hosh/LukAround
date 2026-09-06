const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userStore = require('../services/userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'luk_around_travel_secret_jwt_2026';

// Helper to generate JWT token
function generateToken(user) {
  const isSuperAdmin = user.role === 'superadmin';
  const isAdmin = user.role === 'superadmin' || user.role === 'admin';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isSuperAdmin,
      isAdmin,
      avatar: user.avatar
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Simple in-memory rate limiter to prevent brute force attacks (max 20 attempts per minute)
const rateLimitMap = new Map();
function rateLimiterMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown_ip';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxAttempts = 20;

  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(ip, record);

  if (record.count > maxAttempts) {
    return res.status(429).json({
      error: 'Too many authentication attempts. Please try again in a minute.'
    });
  }

  next();
}

/**
 * POST /api/auth/register
 * Register a new user (First user becomes Super Admin)
 */
router.post('/register', rateLimiterMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Server-side input validation & sanitization
    const trimmedName = String(name || '').trim();
    const trimmedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ error: 'Full name must be at least 2 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (!rawPassword || rawPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existing = userStore.getUserByEmail(trimmedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`;

    // Create user (userStore will promote 1st user to superadmin automatically)
    const newUser = userStore.createUser({
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: hashedPassword,
      avatar,
      provider: 'password'
    });

    const token = generateToken(newUser);
    const userPayload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      title: newUser.title,
      isSuperAdmin: newUser.isSuperAdmin,
      isAdmin: newUser.isAdmin,
      avatar: newUser.avatar,
      createdAt: newUser.createdAt
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: newUser.isSuperAdmin
        ? 'Welcome, Super Administrator! Your master account has been initialized.'
        : 'Account created successfully!',
      token,
      user: userPayload
    });

  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again later.' });
  }
});

/**
 * POST /api/auth/login
 * User login with credentials
 */
router.post('/login', rateLimiterMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;

    const trimmedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');

    if (!trimmedEmail || !rawPassword) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const foundUser = userStore.getUserByEmail(trimmedEmail);
    if (!foundUser) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    // Check account status
    if (foundUser.status === 'banned') {
      return res.status(403).json({ error: 'This account has been banned by the Administrator.' });
    }
    if (foundUser.status === 'suspended') {
      return res.status(403).json({ error: 'This account is currently suspended. Please contact support.' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(rawPassword, foundUser.passwordHash || '');
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    // Update last active
    userStore.updateUser(foundUser.id, { lastActive: new Date().toISOString() });
    userStore.addAuditLog('USER_LOGIN', `User ${foundUser.name} logged in via password`, foundUser.email);

    const token = generateToken(foundUser);
    const userPayload = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      title: foundUser.title,
      isSuperAdmin: foundUser.role === 'superadmin',
      isAdmin: foundUser.role === 'superadmin' || foundUser.role === 'admin',
      avatar: foundUser.avatar,
      createdAt: foundUser.createdAt
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: userPayload
    });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

/**
 * POST /api/auth/google
 * Google OAuth sign-in (with dynamic First User = Super Admin)
 */
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;

    const trimmedEmail = String(email || '').trim().toLowerCase();
    const trimmedName = String(name || 'Google Traveler').trim();

    if (!trimmedEmail) {
      return res.status(400).json({ error: 'Google account email is missing' });
    }

    let user = userStore.getUserByEmail(trimmedEmail);

    if (!user) {
      // First user to log in gets Super Admin automatically
      user = userStore.createUser({
        name: trimmedName,
        email: trimmedEmail,
        avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
        provider: 'google'
      });
    } else {
      // Check status
      if (user.status === 'banned') {
        return res.status(403).json({ error: 'This account has been banned by the Administrator.' });
      }
      if (user.status === 'suspended') {
        return res.status(403).json({ error: 'This account is currently suspended. Please contact support.' });
      }

      // Update avatar or name if changed
      user = userStore.updateUser(user.id, {
        name: trimmedName || user.name,
        avatar: avatar || user.avatar,
        lastActive: new Date().toISOString()
      });
      userStore.addAuditLog('GOOGLE_LOGIN', `User ${user.name} authenticated via Google SSO`, user.email);
    }

    const token = generateToken(user);
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      isSuperAdmin: user.role === 'superadmin',
      isAdmin: user.role === 'superadmin' || user.role === 'admin',
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: user.role === 'superadmin'
        ? 'Welcome, Super Administrator! Master session active.'
        : 'Google Sign-In successful!',
      token,
      user: userPayload
    });

  } catch (err) {
    console.error('Google OAuth Error:', err);
    return res.status(500).json({ error: 'Google sign-in failed.' });
  }
});

/**
 * GET /api/auth/me
 * Validate current user session token
 */
router.get('/me', (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const tokenFromCookie = req.cookies ? req.cookies.token : null;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ authenticated: false, error: 'No active session token found' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const freshUser = userStore.getUserById(decoded.id) || userStore.getUserByEmail(decoded.email);

    if (!freshUser) {
      return res.status(401).json({ authenticated: false, error: 'User account not found' });
    }

    if (freshUser.status === 'banned' || freshUser.status === 'suspended') {
      return res.status(403).json({ authenticated: false, error: `Account ${freshUser.status}` });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: freshUser.id,
        name: freshUser.name,
        email: freshUser.email,
        role: freshUser.role,
        title: freshUser.title,
        isSuperAdmin: freshUser.role === 'superadmin',
        isAdmin: freshUser.role === 'superadmin' || freshUser.role === 'admin',
        avatar: freshUser.avatar,
        status: freshUser.status,
        createdAt: freshUser.createdAt
      }
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false, error: 'Session expired or invalid' });
  }
});

/**
 * POST /api/auth/logout
 * Logout current user
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/**
 * POST /api/auth/update-avatar
 * Update avatar image URL for authenticated user
 */
router.post('/update-avatar', async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const tokenFromHeader = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const tokenFromCookie = req.cookies ? req.cookies.token : null;
    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const { avatar } = req.body;

    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ error: 'Valid avatar URL is required' });
    }

    const targetUser = userStore.getUserById(decoded.id) || userStore.getUserByEmail(decoded.email);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = userStore.updateUser(targetUser.id, {
      avatar: avatar.trim(),
      updatedAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: updated.avatar
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = {
  router,
  JWT_SECRET,
  generateToken
};
