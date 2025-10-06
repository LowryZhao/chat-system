const { users, groups, channels } = require('../models/data');

function isGroupAdmin(userId, group) {
  return group.admins.includes(userId) || isSuperAdmin(userId);
}
function isSuperAdmin(userId) {
  const u = users.find(u => u.id === userId);
  return u && u.roles && u.roles.includes('super_admin');
}

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

  if (!admin.groups.includes(newGroup.id)) {
    admin.groups.push(newGroup.id);
  }

  return res.json(newGroup);
};

exports.getAllGroups = (req, res) => {
  return res.json(groups);
};

exports.addUserToGroup = (req, res) => {
  const { groupId } = req.params;
  const { adminId, userId } = req.body;

  const group = groups.find((g) => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!isGroupAdmin(adminId, group)) {
    return res.status(403).json({ error: 'Only Group Admin or Super Admin can add members' });
  }

  if (!group.members.includes(userId)) {
    group.members.push(userId);
  }

  const user = users.find((u) => u.id === userId);
  if (user && !user.groups.includes(groupId)) {
    user.groups.push(groupId);
  }

  return res.json({ message: 'User added to group successfully', group });
};

exports.removeUserFromGroup = (req, res) => {
  const { groupId } = req.params;
  const { adminId, userId } = req.body;

  const group = groups.find((g) => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!isGroupAdmin(adminId, group)) {
    return res.status(403).json({ error: 'Only Group Admin or Super Admin can remove members' });
  }

  group.members = group.members.filter((id) => id !== userId);

  channels.forEach(c => {
    if (c.groupId === groupId) {
      c.members = c.members.filter(id => id !== userId);
    }
  });

  const user = users.find((u) => u.id === userId);
  if (user) {
    user.groups = user.groups.filter((id) => id !== groupId);
  }

  return res.json({ message: 'User removed from group successfully', group });
};

exports.deleteGroup = (req, res) => {
  const { groupId } = req.params;
  const { adminId } = req.body;

  const index = groups.findIndex(g => g.id === groupId);
  if (index === -1) return res.status(404).json({ error: 'Group not found' });

  const group = groups[index];
  if (!isGroupAdmin(adminId, group)) {
    return res.status(403).json({ error: 'Only Group Admin or Super Admin can delete groups' });
  }

  for (let i = channels.length - 1; i >= 0; i--) {
    if (channels[i].groupId === groupId) {
      channels.splice(i, 1);
    }
  }

  users.forEach(u => {
    u.groups = u.groups.filter(id => id !== groupId);
  });

  groups.splice(index, 1);

  return res.json({ message: 'Group deleted successfully' });
};

exports.getUserGroups = (req, res) => {
  const { userId } = req.params;

  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const userGroups = groups.filter((g) => g.members.includes(userId));
  return res.json(userGroups);
};
