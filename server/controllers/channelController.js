const { connectDB } = require('../db');

async function isSuperAdmin(db, userId) {
  const user = await db.collection('users').findOne({ id: userId });
  return user?.roles?.includes('super_admin');
}

async function isGroupAdmin(db, userId, group) {
  return group.admins.includes(userId) || await isSuperAdmin(db, userId);
}

exports.createChannel = async (req, res) => {
  try {
    const { name, groupId, adminId } = req.body;
    const db = await connectDB();
    const groups = db.collection('groups');
    const channels = db.collection('channels');

    const group = await groups.findOne({ id: String(groupId) });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    const newChannel = {
      id: String(Date.now()),
      name,
      groupId: String(groupId),
      members: [adminId]
    };

    await channels.insertOne(newChannel);
    await groups.updateOne(
      { id: String(groupId) },
      { $addToSet: { channels: newChannel.id } }
    );

    console.log(`New channel created: ${name} (Group ${groupId}) by user ${adminId}`);
    res.json({ message: 'Channel created successfully', channel: newChannel });
  } catch (err) {
    console.error('Create channel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addUserToChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { adminId, userId } = req.body;
    const db = await connectDB();
    const channels = db.collection('channels');
    const groups = db.collection('groups');

    const channel = await channels.findOne({ id: channelId });
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    const group = await groups.findOne({ id: channel.groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    await groups.updateOne({ id: group.id }, { $addToSet: { members: userId } });
    await channels.updateOne({ id: channelId }, { $addToSet: { members: userId } });

    console.log(`👥 User ${userId} added to channel ${channelId} by ${adminId}`);
    res.json({ message: 'User added to channel successfully' });
  } catch (err) {
    console.error('Add user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeUserFromChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { adminId, userId } = req.body;
    const db = await connectDB();
    const channels = db.collection('channels');
    const groups = db.collection('groups');

    const channel = await channels.findOne({ id: channelId });
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    const group = await groups.findOne({ id: channel.groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    await channels.updateOne({ id: channelId }, { $pull: { members: userId } });

    console.log(`👤 User ${userId} removed from channel ${channelId} by ${adminId}`);
    res.json({ message: 'User removed from channel successfully' });
  } catch (err) {
    console.error('Remove user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGroupChannelsForUser = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.query;
    const db = await connectDB();
    const channels = db.collection('channels');

    const visibleChannels = await channels
      .find({ groupId: String(groupId), members: userId })
      .toArray();

    res.json(visibleChannels);
  } catch (err) {
    console.error('Get channels error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.leaveChannel = async (req, res) => {
  try {
    const { channelId, userId } = req.body;
    const db = await connectDB();
    const channels = db.collection('channels');

    await channels.updateOne({ id: channelId }, { $pull: { members: userId } });

    console.log(`🚪 User ${userId} left channel ${channelId}`);
    res.json({ message: 'Left channel successfully' });
  } catch (err) {
    console.error('Leave channel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { adminId } = req.body;
    const db = await connectDB();
    const channels = db.collection('channels');
    const groups = db.collection('groups');

    const channel = await channels.findOne({ id: channelId });
    if (!channel) return res.status(404).json({ error: 'Channel not found' });

    const group = await groups.findOne({ id: channel.groupId });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!(await isGroupAdmin(db, adminId, group)))
      return res.status(403).json({ error: 'Not authorized' });

    await channels.deleteOne({ id: channelId });
    await groups.updateOne({ id: group.id }, { $pull: { channels: channelId } });

    console.log(`Channel ${channelId} deleted by ${adminId}`);
    res.json({ message: 'Channel deleted successfully' });
  } catch (err) {
    console.error('Delete channel error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
