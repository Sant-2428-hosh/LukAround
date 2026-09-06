const express = require('express');
const router = express.Router();
const { checkDbConnection } = require('../config/db');

/**
 * GET /api/health
 * Public health check endpoint
 */
router.get('/', async (req, res) => {
  const dbStatus = await checkDbConnection();

  const healthData = {
    status: 'online',
    appName: 'Luk Around API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      connected: dbStatus.connected,
      latencyMs: dbStatus.latencyMs,
      error: dbStatus.connected ? null : dbStatus.error,
      mode: dbStatus.connected ? 'PostgreSQL Database' : 'Mock Fallback Mode (Database offline)',
    },
    system: {
      nodeVersion: process.version,
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    }
  };

  res.status(200).json(healthData);
});

module.exports = router;
