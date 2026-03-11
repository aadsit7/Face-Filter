/**
 * Notes Routes - Structured notes CRUD
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../services/database');

const router = express.Router();

// GET /api/notes - List all notes
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [req.user.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET /api/notes/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST /api/notes - Create or update a note
router.post('/', async (req, res) => {
  try {
    const {
      sessionId, title, summary, rawTranscript,
      keyTopics, actionItems, decisions, questions,
      people, ideas, tags, sentiment, importance, followUps,
    } = req.body;

    const id = req.body.id || uuidv4();

    const result = await db.query(
      `INSERT INTO notes (
        id, user_id, session_id, title, summary, raw_transcript,
        key_topics, action_items, decisions, questions,
        people, ideas, tags, sentiment, importance, follow_ups
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        raw_transcript = EXCLUDED.raw_transcript,
        key_topics = EXCLUDED.key_topics,
        action_items = EXCLUDED.action_items,
        decisions = EXCLUDED.decisions,
        questions = EXCLUDED.questions,
        people = EXCLUDED.people,
        ideas = EXCLUDED.ideas,
        tags = EXCLUDED.tags,
        sentiment = EXCLUDED.sentiment,
        importance = EXCLUDED.importance,
        follow_ups = EXCLUDED.follow_ups,
        updated_at = NOW()
      RETURNING *`,
      [
        id, req.user.userId, sessionId, title, summary, rawTranscript,
        JSON.stringify(keyTopics || []),
        JSON.stringify(actionItems || []),
        JSON.stringify(decisions || []),
        JSON.stringify(questions || []),
        JSON.stringify(people || []),
        JSON.stringify(ideas || []),
        JSON.stringify(tags || []),
        sentiment || 'neutral',
        importance || 'medium',
        JSON.stringify(followUps || []),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Failed to create note:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
