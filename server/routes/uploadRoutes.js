const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const baseDir = path.join(__dirname, '../uploads');
const avatarDir = path.join(baseDir, 'avatars');
const chatDir = path.join(baseDir, 'chat');

[baseDir, avatarDir, chatDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

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


router.post('/image', uploadChat.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/uploads/chat/${req.file.filename}`;
  console.log(`Uploaded chat image: ${filePath}`);
  res.json({ path: filePath });
});

router.post('/avatar', uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = `/uploads/avatars/${req.file.filename}`;
  console.log(`Avatar uploaded: ${filePath}`);
  res.json({ path: filePath });
});

module.exports = router;
