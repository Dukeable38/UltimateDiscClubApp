const express = require('express');
     const router = express.Router();
     const pool = require('../db');
     const jwt = require('jsonwebtoken');

     // Middleware to verify JWT
     const authMiddleware = (req, res, next) => {
       const token = req.headers.authorization?.split(' ')[1];
       if (!token) return res.status(401).send('No token provided');
       try {
         const decoded = jwt.verify(token, 'your_jwt_secret');
         req.player_id = decoded.player_id;
         next();
       } catch (err) {
         res.status(401).send('Invalid token');
       }
     };

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
           SELECT s.session_id, s.name, s.date, s.time, s.status,
                  c.player_id IS NOT NULL as checked_in,
                  d.team,
                  r.black_score, r.white_score
           FROM sessions s
           LEFT JOIN check_ins c ON s.session_id = c.session_id AND c.player_id = $1
           LEFT JOIN draft_assignments d ON s.session_id = d.session_id AND d.player_id = $1 AND d.status = 'final'
           LEFT JOIN session_results r ON s.session_id = r.session_id
           ORDER BY s.date DESC, s.time DESC
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
         const sessionCheck = await pool.query('SELECT * FROM sessions WHERE session_id = $1 AND status = $2', [sessionId, 'upcoming']);
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
           [sessionId, req.player_id, is_training || false, shirt_color || 'black']
         );
         res.json(result.rows[0]);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     module.exports = router;