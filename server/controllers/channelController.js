const { users, groups, channels } = require('../models/data');

function isGroupAdmin(userId, group) {
  return group.admins.includes(userId) || isSuperAdmin(userId);
}
function isSuperAdmin(userId) {
  const u = users.find(u => u.id === userId);
  return !!u && u.roles && u.roles.includes('super_admin');
}

exports.createChannel = (req, res) => {
  const { name, groupId, adminId } = req.body;

  const group = groups.find(g => g.id === groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!isGroupAdmin(adminId, group)) return res.status(403).json({ error: 'Not authorized' });

  const newChannel = {
    id: String(channels.length + 1),
    name,
    groupId,
    members: [adminId] 
  };

  channels.push(newChannel);
  if (!group.channels.includes(newChannel.id)) group.channels.push(newChannel.id);

  res.json(newChannel);
};

exports.addUserToChannel = (req, res) => {
  const { channelId } = req.params;
  const { adminId, userId } = req.body;

  const channel = channels.find(c => c.id === channelId);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });

  const group = groups.find(g => g.id === channel.groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!isGroupAdmin(adminId, group)) return res.status(403).json({ error: 'Not authorized' });

  if (!group.members.includes(userId)) group.members.push(userId);

  if (!channel.members) channel.members = [];
  if (!channel.members.includes(userId)) channel.members.push(userId);

  res.json({ message: 'User added to channel successfully', channel });
};

exports.removeUserFromChannel = (req, res) => {
  const { channelId } = req.params;
  const { adminId, userId } = req.body;

  const channel = channels.find(c => c.id === channelId);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });

  const group = groups.find(g => g.id === channel.groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });
  if (!isGroupAdmin(adminId, group)) return res.status(403).json({ error: 'Not authorized' });

  channel.members = channel.members.filter(id => id !== userId);
  res.json({ message: 'User removed from channel successfully', channel });
};

exports.getGroupChannelsForUser = (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.query;

  const visibleChannels = channels.filter(
    c => c.groupId === groupId && c.members && c.members.includes(userId)
  );

  return res.json(visibleChannels);
};

exports.leaveChannel = (req, res) => {
  const { channelId, userId } = req.body;

  const channel = channels.find(c => c.id === channelId);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });

  channel.members = channel.members.filter(id => id !== userId);
  res.json({ message: 'Left channel successfully' });
};
