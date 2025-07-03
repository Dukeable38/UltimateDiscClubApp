const express = require('express');
const cors = require('cors');
require('dotenv').config();
const playerRoutes = require('./routes/players');
const sessionRoutes = require('./routes/sessions');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/players', playerRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
  res.send('Ultimate Disc Backend Running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

