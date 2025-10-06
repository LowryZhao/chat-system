const data = require('../models/data');
const { users, groups, channels } = data;

function isGroupAdmin(userId, group) {
  return group.admins.includes(userId) || isSuperAdmin(userId);
}
function isSuperAdmin(userId) {
  const u = users.find(u => u.id === userId);
  return !!u && u.roles && u.roles.includes('super_admin');
}

exports.createChannel = (req, res) => {
  const { name, groupId, adminId } = req.body;

  const group = groups.find(g => g.id === String(groupId));
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!isGroupAdmin(adminId, group)) return res.status(403).json({ error: 'Not authorized' });

  const newChannel = {
    id: String(channels.length + 1),
    name,
    groupId: String(groupId),
    members: [adminId]
  };

  channels.push(newChannel);
  if (!group.channels.includes(newChannel.id)) group.channels.push(newChannel.id);

  data.saveData();

  console.log(`New channel created: ${name} (Group ${groupId}) by user ${adminId}`);
  return res.json({ message: 'Channel created successfully', channel: newChannel });
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

  data.saveData();

  console.log(`👥 User ${userId} added to channel ${channelId} by ${adminId}`);
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

  data.saveData();

  console.log(`👤 User ${userId} removed from channel ${channelId} by ${adminId}`);
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

  data.saveData();

  console.log(`User ${userId} left channel ${channelId}`);
  res.json({ message: 'Left channel successfully' });
};

exports.deleteChannel = (req, res) => {
  const { channelId } = req.params;
  const { adminId } = req.body;

  const channelIndex = channels.findIndex(c => c.id === channelId);
  if (channelIndex === -1) return res.status(404).json({ error: 'Channel not found' });

  const channel = channels[channelIndex];
  const group = groups.find(g => g.id === channel.groupId);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!isGroupAdmin(adminId, group)) {
    return res.status(403).json({ error: 'Not authorized to delete channel' });
  }

  group.channels = group.channels.filter(id => id !== channelId);

  channels.splice(channelIndex, 1);

  data.saveData();

  console.log(`Channel ${channelId} deleted by user ${adminId}`);
  return res.json({ message: 'Channel deleted successfully' });
};
