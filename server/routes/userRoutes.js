const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt: ${username}, ${password}`);
  if (username === 'super' && password === '123') {
    res.json({ id: '1', username: 'super', roles: ['admin'] });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;