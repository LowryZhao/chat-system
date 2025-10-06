const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.post('/login', userCtrl.login);

router.post('/register', userCtrl.register);

router.post('/create', userCtrl.createUserByAdmin);

router.post('/remove', userCtrl.removeUser);

router.post('/update-avatar', userCtrl.updateAvatar);

module.exports = router;
