/**
 * Search Routes - Full-text and semantic search across knowledge base
 */

const express = require('express');
const db = require('../services/database');

const router = express.Router();

// GET /api/search?q=query&tags=tag1,tag2&type=all
router.get('/', async (req, res) => {
  try {
    const { q, tags, type } = req.query;
    const userId = req.user.userId;

    if (!q && !tags) {
      return res.status(400).json({ error: 'Search query or tags required' });
    }

    let query;
    let params;

    if (q) {
      // Full-text search across notes
      query = `
        SELECT *,
          ts_rank(
            to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '') || ' ' || COALESCE(raw_transcript, '')),
            plainto_tsquery('english', $2)
          ) AS rank
        FROM notes
        WHERE user_id = $1
          AND (
            to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '') || ' ' || COALESCE(raw_transcript, ''))
            @@ plainto_tsquery('english', $2)
            OR title ILIKE '%' || $2 || '%'
            OR summary ILIKE '%' || $2 || '%'
          )
        ORDER BY rank DESC, created_at DESC
        LIMIT 20
      `;
      params = [userId, q];
    } else {
      // Tag-based search
      const tagList = tags.split(',').map(t => t.trim().toLowerCase());
      query = `
        SELECT * FROM notes
        WHERE user_id = $1
          AND tags::jsonb ?| $2
        ORDER BY created_at DESC
        LIMIT 20
      `;
      params = [userId, tagList];
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/search/tags - Get all unique tags
router.get('/tags', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT jsonb_array_elements_text(tags::jsonb) AS tag
       FROM notes
       WHERE user_id = $1
       ORDER BY tag`,
      [req.user.userId]
    );
    res.json(result.rows.map(r => r.tag));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// GET /api/search/people - Get all mentioned people
router.get('/people', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT jsonb_array_elements_text(people::jsonb) AS person
       FROM notes
       WHERE user_id = $1
       ORDER BY person`,
      [req.user.userId]
    );
    res.json(result.rows.map(r => r.person));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch people' });
  }
});

module.exports = router;
