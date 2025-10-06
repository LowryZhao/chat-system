const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/channelController');

router.post('/create', ctrl.createChannel);
router.post('/:channelId/add-user', ctrl.addUserToChannel);
router.post('/:channelId/remove-user', ctrl.removeUserFromChannel);
router.post('/leave', ctrl.leaveChannel);

router.get('/group/:groupId', ctrl.getGroupChannelsForUser);

module.exports = router;
