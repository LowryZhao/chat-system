const { users } = require('../models/data');

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.json(user);
  return res.status(401).json({ error: 'Invalid credentials' });
};

exports.register = (req, res) => {
  const { username, email, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username taken' });
  }
  const newUser = {
    id: String(users.length + 1),
    username,
    email,
    password,
    roles: ['user'],
    groups: []
  };
  users.push(newUser);
  res.json(newUser);
};