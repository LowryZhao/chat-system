const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('../db');
const router = express.Router();

//文件路径和目录
const baseDir = path.join(__dirname, '../uploads');
const avatarDir = path.join(baseDir, 'avatars');
const chatDir = path.join(baseDir, 'chat');

[baseDir, avatarDir, chatDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

//图片上传
const chatStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, chatDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});
const uploadChat = multer({ storage: chatStorage });

//头像上传
const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = 'avatar-' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const uploadAvatar = multer({ storage: avatarStorage });

//上传图片的接口
router.post('/image', uploadChat.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/uploads/chat/${req.file.filename}`;
  console.log(`Uploaded chat image: ${filePath}`);
  res.json({ path: filePath });
});

//上传头像后更新数据库库
router.post('/avatar', uploadAvatar.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const filePath = `/uploads/avatars/${req.file.filename}`;
  const userId = req.body.userId; 

  console.log(`Avatar uploaded for user ${userId}: ${filePath}`);

  try {
    const db = await connectDB();
    const users = db.collection('users');

    const result = await users.updateOne(
      { id: String(userId) },
      { $set: { avatar: filePath } }
    );

    if (result.matchedCount === 0) {
      console.warn(`User not found in DB: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Avatar uploaded and database updated successfully',
      path: filePath
    });
  } catch (err) {
    console.error('Failed to update user avatar in MongoDB:', err);
    res.status(500).json({ error: 'Database update failed' });
  }
});

module.exports = router;
