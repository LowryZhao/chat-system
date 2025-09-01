const express = require('express');
const router = express.Router();
const { createGroup, joinGroup, leaveGroup } = require('../controllers/groupController');

router.post('/create', createGroup); 
router.post('/join', joinGroup); 
router.post('/leave', leaveGroup); 

module.exports = router;