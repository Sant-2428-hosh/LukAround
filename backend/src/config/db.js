const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'lukaround'}`;

const pool = new Pool({
  connectionString,
  // Uncomment below if using SSL in production (e.g., Supabase / Neon / Render)
  // ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Check database connection status
 * @returns {Promise<{connected: boolean, error?: string, latencyMs?: number}>}
 */
const checkDbConnection = async () => {
  const start = Date.now();
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW()');
    client.release();
    const latencyMs = Date.now() - start;
    return { connected: true, timestamp: res.rows[0].now, latencyMs };
  } catch (err) {
    return { connected: false, error: err.message, latencyMs: Date.now() - start };
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  checkDbConnection,
};
