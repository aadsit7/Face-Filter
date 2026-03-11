/**
 * Chat Routes - Conversational AI interface with knowledge base context
 */

const express = require('express');
const db = require('../services/database');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// POST /api/chat - Send a message and get AI response
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get relevant notes for context
    const notesResult = await db.query(
      `SELECT title, summary, key_topics, action_items, decisions, created_at
       FROM notes
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    const context = notesResult.rows.map(n =>
      `[${n.created_at}] "${n.title}": ${n.summary}`
    ).join('\n');

    // Save user message
    await db.query(
      'INSERT INTO chat_history (id, user_id, role, content) VALUES ($1, $2, $3, $4)',
      [uuidv4(), userId, 'user', message]
    );

    // In production, call AI API here with context
    // For now, return a placeholder that indicates the system is working
    const response = `I found ${notesResult.rows.length} notes in your knowledge base. To get AI-powered responses, configure your API key in the extension settings.`;

    // Save assistant response
    await db.query(
      'INSERT INTO chat_history (id, user_id, role, content) VALUES ($1, $2, $3, $4)',
      [uuidv4(), userId, 'assistant', response]
    );

    res.json({
      response,
      notesUsed: notesResult.rows.length,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat request failed' });
  }
});

// GET /api/chat/history - Get chat history
router.get('/history', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM chat_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.userId]
    );
    res.json(result.rows.reverse());
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
