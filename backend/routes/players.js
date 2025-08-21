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

// Get all players
router.get('/', authMiddleware, adminMiddleware, async (req, res) => { // Added authMiddleware and adminMiddleware
  try {
    const result = await pool.query('SELECT * FROM players ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get player profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const player = await pool.query(
      'SELECT id, name, email, student_number, gender, skill, payment FROM players WHERE id = $1',
      [req.player_id]
    );
    const checkins = await pool.query(
      'SELECT COUNT(*) as total_checkins FROM check_ins WHERE player_id = $1',
      [req.player_id]
    );
    const mvps = await pool.query(
      'SELECT COUNT(*) as mvp_count FROM trophies WHERE player_id = $1 AND type = $2 AND status = $3',
      [req.player_id, 'mvp', 'confirmed']
    );
    const trophies = await pool.query(
      'SELECT name FROM trophies WHERE player_id = $1 AND type = $2 AND status = $3',
      [req.player_id, 'custom', 'confirmed']
    );
    res.json({
      ...player.rows[0],
      payment_type: player.rows[0].payment || 'Weekly',
      total_checkins: parseInt(checkins.rows[0].total_checkins),
      mvp_nominations: parseInt(mvps.rows[0].mvp_count),
      custom_trophies: trophies.rows.map(t => t.name + ' Trophy')
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get sessions for player
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const sessions = await pool.query(`
      SELECT s.session_id, s.name, s.datetime, s.status,
             c.player_id IS NOT NULL as checked_in,
             d.team,
             r.light_score, r.dark_score
      FROM sessions s
      LEFT JOIN check_ins c ON s.session_id = c.session_id AND c.player_id = $1
      LEFT JOIN draft_assignments d ON s.session_id = d.session_id AND d.player_id = $1 AND d.status = 'final'
      LEFT JOIN session_results r ON s.session_id = r.session_id
      ORDER BY s.datetime DESC
    `, [req.player_id]);
    res.json(sessions.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Player check-in
router.post('/checkin/:sessionId', authMiddleware, async (req, res) => {
  const { sessionId } = req.params;
  const { is_training, shirt_color } = req.body;
  try {
    const sessionCheck = await pool.query('SELECT * FROM sessions WHERE session_id = $1 AND status = $2', [sessionId, 'Open']);
    if (sessionCheck.rows.length === 0) {
      return res.status(404).send('Session not found or not open for check-in');
    }
    const checkInCheck = await pool.query(
      'SELECT * FROM check_ins WHERE session_id = $1 AND player_id = $2',
      [sessionId, req.player_id]
    );
    if (checkInCheck.rows.length > 0) {
      return res.status(400).send('Already checked in');
    }
    const result = await pool.query(
      'INSERT INTO check_ins (session_id, player_id, is_training, shirt_color) VALUES ($1, $2, $3, $4) RETURNING *',
      [sessionId, req.player_id, is_training || false, shirt_color || 'Both']
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update admin status (admin only)
router.put('/:id/admin', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { is_admin } = req.body;
  if (typeof is_admin !== 'boolean') {
    return res.status(400).send('is_admin must be a boolean value');
  }
  try {
    const playerCheck = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    if (playerCheck.rows.length === 0) return res.status(404).send('Player not found');
    const result = await pool.query(
      'UPDATE players SET is_admin = $1 WHERE id = $2 RETURNING id, name, email, student_number, gender, skill, class, payment, is_admin, player_status',
      [is_admin, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating admin status:', err);
    res.status(500).send('Server Error');
  }
});

// Update existing player (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, gender, student_number, payment, class: playerClass, skill, player_status } = req.body;
  if (!name || !email || !gender || !student_number) {
    return res.status(400).send('Name, email, gender, and student_number are required');
  }
  try {
    const playerCheck = await pool.query('SELECT * FROM players WHERE id = $1', [id]);
    if (playerCheck.rows.length === 0) return res.status(404).send('Player not found');
    const emailCheck = await pool.query('SELECT * FROM players WHERE email = $1 AND id != $2', [email, id]);
    if (emailCheck.rows.length > 0) return res.status(400).send('Email already exists');
    const studentCheck = await pool.query('SELECT * FROM players WHERE student_number = $1 AND id != $2', [student_number, id]);
    if (studentCheck.rows.length > 0) return res.status(400).send('Student number already exists');
    const updateData = {
      name,
      email,
      gender,
      student_number,
      payment: payment || 'Weekly',
      class: playerClass || 'Novice',
      skill: skill || 3,
      player_status: player_status || 'New',
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const result = await pool.query(
      `UPDATE players SET name = $1, email = $2, gender = $3, student_number = $4, payment = $5, class = $6, skill = $7, player_status = $8, password = COALESCE($9, password)
       WHERE id = $10 RETURNING id, name, email, student_number, gender, skill, class, payment, is_admin, player_status`,
      [name, email, gender, student_number, updateData.payment, updateData.class, updateData.skill, updateData.player_status, updateData.password, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;