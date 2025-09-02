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
  console.log(`Joining group ${groupId} for user ${userId}`);
  res.json({ success: true, groupId, userId });
});

module.exports = router;
