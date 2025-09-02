const express = require('express');
const router = express.Router();
const groupCtrl = require('../controllers/groupController');

router.get('/user/:userId', groupCtrl.getUserGroups);
router.get('/all', groupCtrl.getAllGroups);
router.post('/create', groupCtrl.createGroup);
router.post('/:groupId/join', groupCtrl.addUserToGroup);
router.post('/:groupId/leave', groupCtrl.removeUserFromGroup);

module.exports = router;
