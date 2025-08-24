const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors()); 
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Chat System API - Phase 1');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/api/users', require('./routes/userRoutes'));
