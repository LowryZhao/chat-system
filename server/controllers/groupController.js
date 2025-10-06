const { connectDB } = require('../db');

async function isSuperAdmin(db, userId) {
  const user = await db.collection('users').findOne({ id: userId });
  return user?.roles?.includes('super_admin');
}

async function isGroupAdmin(db, userId, group) {
  return group.admins.includes(userId) || await isSuperAdmin(db, userId);
}

exports.createGroup = async (req, res) => {
  try {
    const { name, adminId } = req.body;
    const db = await connectDB();
    const users = db.collection('users');
    const groups = db.collection('groups');

    const admin = await users.findOne({ id: adminId });
    if (!admin || !admin.roles.some(r => ['super_admin', 'group_admin'].includes(r)))
      return res.status(403).json({ error: 'Not authorized' });

    const newGroup = {
      id: String(Date.now()),
      name,
      admins: [adminId],
      members: [adminId],
      channels: []
    };

    await groups.insertOne(newGroup);
    await users.updateOne({ id: adminId }, { $addToSet: { groups: newGroup.id } });

    res.json(newGroup);
  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const db = await connectDB();
    const groups = await db.collection('groups').find().toArray();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addUserToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminId, userId } = req.body;
    const db = await connectDB();
    const groupsCol = db.collection('groups');
    const usersCol = db.collection('users');

    const group = await groupsCol.findOne({ id: groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    await groupsCol.updateOne({ id: groupId }, { $addToSet: { members: userId } });
    await usersCol.updateOne({ id: userId }, { $addToSet: { groups: groupId } });

    res.json({ message: 'User added to group successfully' });
  } catch (err) {
    console.error('Add user to group error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeUserFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminId, userId } = req.body;
    const db = await connectDB();
    const groupsCol = db.collection('groups');
    const usersCol = db.collection('users');

    const group = await groupsCol.findOne({ id: groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    await groupsCol.updateOne({ id: groupId }, { $pull: { members: userId } });
    await usersCol.updateOne({ id: userId }, { $pull: { groups: groupId } });

    res.json({ message: 'User removed from group successfully' });
  } catch (err) {
    console.error('Remove user from group error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { adminId } = req.body;
    const db = await connectDB();
    const groupsCol = db.collection('groups');
    const usersCol = db.collection('users');
    const channelsCol = db.collection('channels');

    const group = await groupsCol.findOne({ id: groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    await channelsCol.deleteMany({ groupId });
    await groupsCol.deleteOne({ id: groupId });
    await usersCol.updateMany({}, { $pull: { groups: groupId } });

    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    console.error('Delete group error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = await connectDB();
    const groups = await db.collection('groups')
      .find({ members: userId })
      .toArray();

    res.json(groups);
  } catch (err) {
    console.error('Get user groups error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
