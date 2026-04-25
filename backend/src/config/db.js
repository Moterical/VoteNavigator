const { Pool } = require('pg');
require('dotenv').config();

// Standard PostgreSQL connection pool
// This will connect to Cloud SQL when deployed, or local Postgres for dev
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // SSL is required for Cloud SQL in most cases
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
