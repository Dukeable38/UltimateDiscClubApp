const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('No token provided');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.player_id = decoded.player_id;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

// Middleware to verify admin
const adminMiddleware = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT is_admin FROM players WHERE id = $1', [req.player_id]);
    if (!result.rows[0] || !result.rows[0].is_admin) {
      return res.status(403).send('Admin access required');
    }
    next();
  } catch (err) {
    console.error('Admin check error:', err);
    res.status(500).send('Server Error');
  }
};

// Create a new session (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, datetime } = req.body;
  if (!name || !datetime) {
    return res.status(400).send('Name and session datetime are required');
  }
  try {
    const result = await pool.query(
      'INSERT INTO sessions (name, datetime) VALUES ($1, $2) RETURNING session_id, name, datetime',
      [name, datetime]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).send('Server Error');
  }
});

// Get all sessions (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT session_id, name, datetime FROM sessions');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).send('Server Error');
  }
});

// Get all check-ins for a session
router.get('/:sessionId/checkins', authMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  try {
    const result = await pool.query(
      'SELECT c.*, p.name as player_name FROM check_ins c JOIN players p ON c.player_id = p.id WHERE c.session_id = $1',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a session (with dependency check)
router.delete('/:sessionId', authMiddleware, adminMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  try {
    // Check for dependencies
    const dependencies = await Promise.all([
      pool.query('SELECT 1 FROM check_ins WHERE session_id = $1 LIMIT 1', [sessionId]),
      pool.query('SELECT 1 FROM draft_assignments WHERE session_id = $1 LIMIT 1', [sessionId]),
      pool.query('SELECT 1 FROM session_results WHERE session_id = $1 LIMIT 1', [sessionId]),
      pool.query('SELECT 1 FROM trophies WHERE session_id = $1 LIMIT 1', [sessionId]),
    ]);
    if (dependencies.some(dep => dep.rows.length > 0)) {
      return res.status(400).send('Cannot delete session with existing check-ins, draft assignments, results, or trophies');
    }
    // If no dependencies, delete the session
    const result = await pool.query('DELETE FROM sessions WHERE session_id = $1 RETURNING *', [sessionId]);
    if (result.rowCount === 0) {
      return res.status(404).send('Session not found');
    }
    res.status(200).json({ message: 'Session deleted' });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;