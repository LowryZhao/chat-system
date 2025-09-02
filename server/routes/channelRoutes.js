const express = require('express');
const router = express.Router();
const {
  createChannel,
  joinChannel,
  leaveChannel,
  getGroupChannels 
} = require('../controllers/channelController');

router.post('/create', createChannel);
router.post('/join', joinChannel);
router.post('/leave', leaveChannel);

router.get('/group/:groupId', getGroupChannels);

module.exports = router;
