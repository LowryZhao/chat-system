const { users, groups } = require('../models/data');

exports.createGroup = (req, res) => {
  const { name, adminId } = req.body;
  const admin = users.find(u => u.id === adminId && (u.roles.includes('super_admin') || u.roles.includes('group_admin')));
  if (!admin) return res.status(403).json({ error: 'Not authorized' });

  const newGroup = {
    id: String(groups.length + 1),
    name,
    admins: [adminId],
    members: [adminId],
    channels: []
  };

  groups.push(newGroup);
  admin.groups.push(newGroup.id);

  res.json(newGroup);
};

exports.joinGroup = (req, res) => {
  const { groupId, userId } = req.body;
  const group = groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    users.find(u => u.id === userId).groups.push(groupId);
  }

  res.json(group);
};

exports.leaveGroup = (req, res) => {
  const { groupId, userId } = req.body;
  const group = groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  group.members = group.members.filter(id => id !== userId);
  group.admins = group.admins.filter(id => id !== userId);
  users.find(u => u.id === userId).groups =
    users.find(u => u.id === userId).groups.filter(id => id !== groupId);

  res.json({ message: 'Left group successfully' });
};

exports.getUserGroups = (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userGroups = groups.filter(g => g.members.includes(userId));
  res.json(userGroups);
};
