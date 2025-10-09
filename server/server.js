const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { connectDB } = require('./db');
const path = require('path');
const { ExpressPeerServer } = require('peer');

//加载路由
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const channelRoutes = require('./routes/channelRoutes');

const app = express();
const server = http.createServer(app);

//Express的配置
const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

//注册RSET API路由
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/channels', channelRoutes);

app.get('/', (req, res) =>
  res.send('Chat System API + Socket.IO + PeerJS + Image Support')
);

//连接mongodb
let db;
(async () => {
  db = await connectDB();
  console.log('MongoDB Connected');
})();

//实时聊天
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

//用户连接
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  //加入频道
  socket.on('joinChannel', async ({ channelId, username }) => {
    socket.join(channelId);
    console.log(`${username} joined channel ${channelId}`);

    const messages = await db.collection('messages')
      .find({ channelId })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    socket.emit('chatHistory', messages.reverse());
    socket.to(channelId).emit('userJoined', { username });
  });

  //接受和发送消息
  socket.on('chatMessage', async (data) => {
    const { channelId, userId, username, message, imageUrl } = data;
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

  //离开频道
  socket.on('leaveChannel', ({ channelId, username }) => {
    socket.leave(channelId);
    socket.to(channelId).emit('userLeft', { username });
  });

  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

//启动服务器
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//视频通话
const peerApp = express();
peerApp.use(cors(corsOptions));

const peerHttp = http.createServer(peerApp);
const peerServer = ExpressPeerServer(peerHttp, {
  path: '/', 
  debug: true
});

peerApp.use('/peerjs', peerServer);

peerHttp.listen(3001, () => {
  console.log('PeerJS server running on http://localhost:3001/peerjs');
});
