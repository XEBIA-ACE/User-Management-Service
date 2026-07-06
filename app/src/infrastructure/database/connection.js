'use strict';

const { Pool } = require('pg');
const logger = require('../logger');

let pool;

/**
 * Initialise the PostgreSQL connection pool.
 * @returns {Promise<void>}
 */
async function connectDB() {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'user_management',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Verify connectivity
  const client = await pool.connect();
  client.release();
  logger.info('PostgreSQL connected');
}

/**
 * Return the shared pool instance.
 * @returns {import('pg').Pool}
 */
function getPool() {
  if (!pool) throw new Error('Database not initialised. Call connectDB() first.');
  return pool;
}

module.exports = { connectDB, getPool };
