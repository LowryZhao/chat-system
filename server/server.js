const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./db');
const path = require('path');

const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const channelRoutes = require('./routes/channelRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/channels', channelRoutes);

app.get('/', (req, res) => res.send('Chat System API + Socket.IO + Image Support'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinChannel', async ({ channelId, username }) => {
    socket.join(channelId);
    console.log(`👥 ${username} joined channel ${channelId}`);

    const db = await connectDB();
    const messages = await db.collection('messages')
      .find({ channelId })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    socket.emit('chatHistory', messages.reverse());

    socket.to(channelId).emit('userJoined', { username });
  });

  socket.on('chatMessage', async (data) => {
    const { channelId, userId, username, message, imageUrl } = data;
    const db = await connectDB();

    const user = await db.collection('users').findOne({ id: String(userId) });
    const avatar = user?.avatar || '/uploads/default-avatar.png';

    const newMsg = {
      channelId,
      userId,
      username,
      avatar,
      message: message || null,
      imageUrl: imageUrl || null,
      timestamp: new Date()
    };

    await db.collection('messages').insertOne(newMsg);


    io.to(channelId).emit('chatMessage', newMsg);
  });

  socket.on('leaveChannel', ({ channelId, username }) => {
    socket.leave(channelId);
    socket.to(channelId).emit('userLeft', { username });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
