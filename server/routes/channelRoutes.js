const express = require('express');
const router = express.Router();

const channelController = require('../controllers/channelController');

router.post('/create', channelController.createChannel);

router.post('/:channelId/add-user', channelController.addUserToChannel);
router.post('/:channelId/remove-user', channelController.removeUserFromChannel);

router.post('/leave', channelController.leaveChannel);

router.get('/group/:groupId', channelController.getGroupChannelsForUser);

router.delete('/:channelId', channelController.deleteChannel);

module.exports = router;
