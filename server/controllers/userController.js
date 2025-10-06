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

exports.createUserByAdmin = (req, res) => {
  const { adminId, username, email, password, role } = req.body;

  const admin = users.find(u => u.id === adminId && u.roles.includes('super_admin'));
  if (!admin) return res.status(403).json({ error: 'Not authorized (Super Admin only)' });

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const newUser = {
    id: String(users.length + 1),
    username,
    email,
    password,
    roles: [role || 'user'],
    groups: []
  };

  users.push(newUser);
  res.json({ message: 'User created successfully', user: newUser });
};

exports.removeUser = (req, res) => {
  const { adminId, userId } = req.body;

  const admin = users.find(u => u.id === adminId && u.roles.includes('super_admin'));
  if (!admin) return res.status(403).json({ error: 'Not authorized (Super Admin only)' });

  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ error: 'User not found' });

  const removed = users.splice(index, 1);
  res.json({ message: 'User removed successfully', removed });
};
