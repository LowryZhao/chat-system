const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const channelRoutes = require('./routes/channelRoutes');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/channels', channelRoutes);

app.get('/', (req, res) => {
  res.send('Chat System API - Phase 1');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});