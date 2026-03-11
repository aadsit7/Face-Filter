/**
 * Sessions Routes - Recording session CRUD
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../services/database');

const router = express.Router();

// GET /api/sessions - List all sessions for the user
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/sessions/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// POST /api/sessions - Create a new session
router.post('/', async (req, res) => {
  try {
    const { rawTranscript, mode, duration, source } = req.body;
    const id = req.body.id || uuidv4();

    const result = await db.query(
      `INSERT INTO sessions (id, user_id, raw_transcript, mode, duration, source)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         raw_transcript = EXCLUDED.raw_transcript,
         mode = EXCLUDED.mode,
         duration = EXCLUDED.duration,
         updated_at = NOW()
       RETURNING *`,
      [id, req.user.userId, rawTranscript, mode, duration, source]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Failed to create session:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM sessions WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
