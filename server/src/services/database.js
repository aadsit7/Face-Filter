/**
 * Database Service - PostgreSQL connection pool
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/second_brain',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
