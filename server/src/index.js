/**
 * Second Brain API Server
 * Handles cloud sync, search, and AI processing
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sessionsRoutes = require('./routes/sessions');
const notesRoutes = require('./routes/notes');
const chatRoutes = require('./routes/chat');
const searchRoutes = require('./routes/search');

const { authMiddleware } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
app.use(cors({
  origin: [
    'chrome-extension://*',
    'http://localhost:*',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'second-brain-api', version: '1.0.0' });
});

// ===== Public Routes =====
app.use('/api/auth', authRoutes);

// ===== Protected Routes =====
app.use('/api/sessions', authMiddleware, sessionsRoutes);
app.use('/api/notes', authMiddleware, notesRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);
app.use('/api/search', authMiddleware, searchRoutes);

// ===== Error Handler =====
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`Second Brain API running on port ${PORT}`);
});

module.exports = app;
