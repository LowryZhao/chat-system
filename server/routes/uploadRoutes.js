const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const fileFilter = (req, file, cb) => {
  const ok = /image\/(png|jpg|jpeg|gif|webp)/.test(file.mimetype);
  cb(ok ? null : new Error('Only image files are allowed'), ok);
};

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ path: `/uploads/${req.file.filename}` });
});

router.post('/chat-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ path: `/uploads/${req.file.filename}` });
});

module.exports = router;
