const express = require('express');
const router = express.Router();
const { createChannel, joinChannel, leaveChannel } = require('../controllers/channelController');

router.post('/create', createChannel);
router.post('/join', joinChannel);
router.post('/leave', leaveChannel);

module.exports = router;