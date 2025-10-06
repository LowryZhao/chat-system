const express = require('express');
const router = express.Router();
const groupCtrl = require('../controllers/groupController');

router.get('/user/:userId', groupCtrl.getUserGroups);
router.get('/all', groupCtrl.getAllGroups);

router.post('/create', groupCtrl.createGroup);
router.post('/:groupId/add-user', groupCtrl.addUserToGroup);
router.post('/:groupId/remove-user', groupCtrl.removeUserFromGroup);
router.delete('/:groupId', groupCtrl.deleteGroup);

module.exports = router;
