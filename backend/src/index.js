const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const healthRouter = require('./routes/health');
const citiesRouter = require('./routes/cities');
const itineraryRouter = require('./routes/itinerary');
const { router: transportRouter } = require('./routes/transport');
const hotelsRouter = require('./routes/hotels');
const safetyRouter = require('./routes/safety');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const translateRouter = require('./routes/translate');
const destinationsRouter = require('./routes/destinations');
const chatRouter = require('./routes/chat');
const userStore = require('./services/userStore');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request Logging & Live Visitor Tracking Middleware
app.use((req, res, next) => {
  // Track visitor for real-time traffic radar
  try {
    userStore.trackVisitor(req);
  } catch (err) {
    // Silently continue if tracking fails
  }
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/health', healthRouter);
app.use('/api/cities', citiesRouter);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/transport', transportRouter);
app.use('/api/hotels', hotelsRouter);
app.use('/api/safety', safetyRouter);
app.use('/api/auth', authRouter.router || authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/translate', translateRouter);
app.use('/api/destinations', destinationsRouter);
app.use('/api/chat', chatRouter);

// Public settings endpoint (broadcast banner, public flags)
app.get('/api/public/settings', (req, res) => {
  try {
    const settings = userStore.getSettings();
    res.json({
      success: true,
      broadcast: settings.broadcast || { active: false },
      featureFlags: settings.featureFlags || {}
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve public settings' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Luk Around API - Smart Tourist Itinerary Generator for Indian Cities',
    documentation: '/api/health',
    endpoints: {
      health: '/api/health',
      cities: '/api/cities',
      generateItinerary: 'POST /api/itinerary',
      transportInfo: 'GET /api/transport?from=X&to=Y',
      hotelListings: 'GET /api/hotels?city=X&tier=Y',
      safetyPanel: 'GET /api/safety?city=X'
    },
    status: 'Running'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Luk Around Backend Server is active!`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`🗺️ Itinerary API: POST http://localhost:${PORT}/api/itinerary`);
  console.log(`🛺 Transport API: GET http://localhost:${PORT}/api/transport`);
  console.log(`🏨 Hotel API: GET http://localhost:${PORT}/api/hotels?city=X&tier=Y`);
  console.log(`🛡️ Safety API: GET http://localhost:${PORT}/api/safety?city=X`);
  console.log(`=================================================`);
});
