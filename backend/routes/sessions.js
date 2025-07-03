const express = require('express');
     const router = express.Router();
     const pool = require('../db');

     // Get all sessions
     router.get('/', async (req, res) => {
       try {
         const result = await pool.query('SELECT * FROM sessions ORDER BY date DESC');
         res.json(result.rows);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     // Create a new session
     router.post('/', async (req, res) => {
       const { date, time, status, name } = req.body;
       try {
         const result = await pool.query(
           'INSERT INTO sessions (date, time, status, name) VALUES ($1, $2, $3, $4) RETURNING *',
           [date, time, status || 'upcoming', name]
         );
         res.json(result.rows[0]);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     // Check in a player to a session
     router.post('/:sessionId/checkins', async (req, res) => {
       const { sessionId } = req.params;
       const { player_id, is_training, shirt_color } = req.body;
       try {
         const sessionCheck = await pool.query('SELECT * FROM sessions WHERE session_id = $1', [sessionId]);
         if (sessionCheck.rows.length === 0) {
           return res.status(404).send('Session not found');
         }
         const playerCheck = await pool.query('SELECT * FROM players WHERE id = $1', [player_id]);
         if (playerCheck.rows.length === 0) {
           return res.status(404).send('Player not found');
         }
         const result = await pool.query(
           'INSERT INTO check_ins (session_id, player_id, is_training, shirt_color) VALUES ($1, $2, $3, $4) RETURNING *',
           [sessionId, player_id, is_training || false, shirt_color || 'black']
         );
         res.json(result.rows[0]);
       } catch (err) {
         console.error(err);
         if (err.code === '23505') {
           res.status(400).send('Player already checked in for this session');
         } else {
           res.status(500).send('Server Error');
         }
       }
     });

     // Get all check-ins for a session
     router.get('/:sessionId/checkins', async (req, res) => {
       const { sessionId } = req.params;
       try {
         const result = await pool.query(
           'SELECT c.*, p.name FROM check_ins c JOIN players p ON c.player_id = p.id WHERE c.session_id = $1',
           [sessionId]
         );
         res.json(result.rows);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     // Delete a check-in
     router.delete('/:sessionId/checkins/:checkInId', async (req, res) => {
       const { sessionId, checkInId } = req.params;
       try {
         const result = await pool.query(
           'DELETE FROM check_ins WHERE check_in_id = $1 AND session_id = $2 RETURNING *',
           [checkInId, sessionId]
         );
         if (result.rows.length === 0) {
           return res.status(404).send('Check-in not found');
         }
         res.json({ message: 'Check-in removed successfully' });
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     module.exports = router;