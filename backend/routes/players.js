const express = require('express');
     const router = express.Router();
     const pool = require('../db');

     // Get all players
     router.get('/', async (req, res) => {
       try {
         const result = await pool.query('SELECT * FROM players');
         res.json(result.rows);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     // Add a player
     router.post('/', async (req, res) => {
       const { name, student_number, payment, playerClass, skill, gender, is_admin } = req.body;
       try {
         const result = await pool.query(
           'INSERT INTO players (name, student_number, payment, class, skill, gender, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
           [name, student_number, payment, playerClass, skill, gender, is_admin]
         );
         res.json(result.rows[0]);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     // Update a player
     router.put('/:id', async (req, res) => {
       const { id } = req.params;
       const { name, student_number, payment, playerClass, skill, gender, is_admin } = req.body;
       try {
         const result = await pool.query(
           'UPDATE players SET name=$1, student_number=$2, payment=$3, class=$4, skill=$5, gender=$6, is_admin=$7 WHERE id=$8 RETURNING *',
           [name, student_number, payment, playerClass, skill, gender, is_admin, id]
         );
         if (result.rows.length === 0) {
           return res.status(404).send('Player not found');
         }
         res.json(result.rows[0]);
       } catch (err) {
         console.error(err);
         res.status(500).send('Server Error');
       }
     });

     module.exports = router;