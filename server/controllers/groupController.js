const { users, groups } = require('../models/data');

exports.createGroup = (req, res) => {
  const { name, adminId } = req.body;

  const admin = users.find(
    (u) => u.id === adminId && (u.roles.includes('super_admin') || u.roles.includes('group_admin'))
  );
  if (!admin) return res.status(403).json({ error: 'Not authorized' });

  const newGroup = {
    id: String(groups.length + 1),
    name,
    admins: [adminId],
    members: [adminId],
    channels: []
  };

  groups.push(newGroup);

  const adminUser = users.find((u) => u.id === adminId);
  if (adminUser && !adminUser.groups.includes(newGroup.id)) {
    adminUser.groups.push(newGroup.id);
  }

  return res.json(newGroup);
};

exports.getAllGroups = (req, res) => {
  const { groups } = require('../models/data');
  return res.json(groups);
};


exports.addUserToGroup = (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  const group = groups.find((g) => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!group.members.includes(userId)) {
    group.members.push(userId);
  }

  const user = users.find((u) => u.id === userId);
  if (user && !user.groups.includes(groupId)) {
    user.groups.push(groupId);
  }

  return res.json({ message: 'Joined group successfully', group });
};

exports.removeUserFromGroup = (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;

  const group = groups.find((g) => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  group.members = group.members.filter((id) => id !== userId);

  const user = users.find((u) => u.id === userId);
  if (user) {
    user.groups = user.groups.filter((id) => id !== groupId);
  }

  return res.json({ message: 'Left group successfully', group });
};

exports.getUserGroups = (req, res) => {
  const { userId } = req.params;

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userGroups = groups.filter((g) => g.members.includes(userId));
  return res.json(userGroups);
};
