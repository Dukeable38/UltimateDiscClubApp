const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Player Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, student_number, gender } = req.body;
  try {
    if (!name || !email || !password || !student_number || !gender) {
      return res.status(400).send('All fields are required');
    }
    const emailCheck = await pool.query('SELECT * FROM players WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) return res.status(400).send('Email already exists');
    const studentCheck = await pool.query('SELECT * FROM players WHERE student_number = $1', [student_number]);
    if (studentCheck.rows.length > 0) return res.status(400).send('Student number already exists');
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO players (name, email, password, student_number, gender, skill, class, payment, is_admin, player_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, name, email, student_number, gender, skill, class, payment, is_admin',
      [name, email, hashedPassword, student_number, gender, 3, 'Novice', 'Weekly', false, 'New']
    );
    const token = jwt.sign({ player_id: result.rows[0].id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token, player: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Player Login (unchanged)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM players WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).send('Invalid email or password');
    const player = result.rows[0];
    const validPassword = await bcrypt.compare(password, player.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    const token = jwt.sign({ player_id: player.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    const redirectPath = player.is_admin ? '/admin/dashboard' : '/player/dashboard';
    res.json({ 
      token, 
      player: { 
        id: player.id, 
        name: player.name, 
        email: player.email, 
        student_number: player.student_number, 
        gender: player.gender, 
        skill: player.skill, 
        class: player.class, 
        payment: player.payment,
        is_admin: player.is_admin
      },
      redirect: redirectPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;