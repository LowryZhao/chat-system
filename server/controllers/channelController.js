const { users, groups, channels } = require('../models/data');

exports.createChannel = (req, res) => {
  const { name, groupId, adminId } = req.body;
  const group = groups.find(g => g.id === groupId && g.admins.includes(adminId));
  if (!group) return res.status(403).json({ error: 'Not authorized' });
  const newChannel = {
    id: String(channels.length + 1),
    name,
    groupId
  };
  channels.push(newChannel);
  group.channels.push(newChannel.id);
  res.json(newChannel);
};

exports.joinChannel = (req, res) => {
  const { channelId, userId } = req.body;
  const channel = channels.find(c => c.id === channelId);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  const group = groups.find(g => g.id === channel.groupId && g.members.includes(userId));
  if (!group) return res.status(403).json({ error: 'Not a group member' });
  res.json(channel);
};

exports.leaveChannel = (req, res) => {
  const { channelId, userId } = req.body;
  const channel = channels.find(c => c.id === channelId);
  if (!channel) return res.status(404).json({ error: 'Channel not found' });
  res.json({ message: 'Left channel successfully' });
};