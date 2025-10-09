const { connectDB } = require('../db');

//登录接口
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = await connectDB();
    const users = db.collection('users');

    const user = await users.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

//注册
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = await connectDB();
    const users = db.collection('users');

    const exists = await users.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Username taken' });

    const count = await users.countDocuments();
    const newUser = {
      id: String(count + 1),
      username,
      email,
      password,
      roles: ['user'],
      groups: [],
      avatar: '/uploads/default-avatar.png'
    };

    await users.insertOne(newUser);
    res.json(newUser);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

//admin创建用户
exports.createUserByAdmin = async (req, res) => {
  try {
    const { adminId, username, email, password, role } = req.body;
    const db = await connectDB();
    const users = db.collection('users');

    const admin = await users.findOne({ id: String(adminId), roles: { $in: ['super_admin'] } });
    if (!admin) return res.status(403).json({ error: 'Not authorized (Super Admin only)' });

    const exists = await users.findOne({ username });
    if (exists) return res.status(400).json({ error: 'Username already exists' });

    const count = await users.countDocuments();
    const newUser = {
      id: String(count + 1),
      username,
      email,
      password,
      roles: [role || 'user'],
      groups: [],
      avatar: '/uploads/default-avatar.png'
    };

    await users.insertOne(newUser);
    res.json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    console.error('CreateUserByAdmin error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

//admin移除用户
exports.removeUser = async (req, res) => {
  try {
    const { adminId, userId } = req.body;
    const db = await connectDB();
    const users = db.collection('users');

    const admin = await users.findOne({ id: String(adminId), roles: { $in: ['super_admin'] } });
    if (!admin) return res.status(403).json({ error: 'Not authorized (Super Admin only)' });

    const result = await users.deleteOne({ id: String(userId) });
    if (result.deletedCount === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User removed successfully' });
  } catch (err) {
    console.error('RemoveUser error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

//更新头像
exports.updateAvatar = async (req, res) => {
  try {
    const { userId, avatarPath } = req.body;
    const db = await connectDB();
    const users = db.collection('users');

    const result = await users.updateOne(
      { id: String(userId) },
      { $set: { avatar: avatarPath } }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Avatar updated successfully', avatar: avatarPath });
  } catch (err) {
    console.error('UpdateAvatar error:', err);
    res.status(500).json({ error: 'Server error' });
  }

};
