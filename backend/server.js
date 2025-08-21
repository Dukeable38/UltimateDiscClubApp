const express = require('express');
const app = express();
const cors = require('cors');
const sessionsRouter = require('./routes/sessions');
const playersRouter = require('./routes/players');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessionsRouter);
app.use('/api/players', playersRouter); // Add this line
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;