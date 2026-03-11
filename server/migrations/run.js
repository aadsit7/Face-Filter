/**
 * Migration Runner - Executes SQL migrations against the database
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Create migrations tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Get already-executed migrations
    const executed = await pool.query('SELECT name FROM migrations ORDER BY id');
    const executedNames = new Set(executed.rows.map(r => r.name));

    // Find and run pending migrations
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (executedNames.has(file)) {
        console.log(`Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`Running ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await pool.query('BEGIN');
      try {
        await pool.query(sql);
        await pool.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        await pool.query('COMMIT');
        console.log(`Completed ${file}`);
      } catch (err) {
        await pool.query('ROLLBACK');
        console.error(`Failed ${file}:`, err.message);
        process.exit(1);
      }
    }

    console.log('All migrations complete.');
  } finally {
    await pool.end();
  }
}

runMigrations().catch(console.error);
