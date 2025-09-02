const express = require('express');
const router = express.Router();

router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const groups = userId === '1' ? [
    { id: '1', name: 'Group 1', members: ['user1'] },
    { id: '2', name: 'Group 2', members: ['user1', 'user2'] }
  ] : [];
  res.json(groups);
});

router.post('/:groupId/join', (req, res) => {
  const groupId = req.params.groupId;
  const { userId } = req.body;
  console.log(`User ${userId} joining group ${groupId}`);
  let groups = JSON.parse(localStorage.getItem('groupsData') || '[]');
  const group = groups.find(g => g.id === groupId);
  if (group && !group.members.includes(userId)) {
    group.members.push(userId);
    localStorage.setItem('groupsData', JSON.stringify(groups));
    res.json({ success: true, groupId, userId });
  } else {
    res.status(400).json({ success: false, message: 'Join failed' });
  }
});

module.exports = router;