const express = require('express');
const router = express.Router();
const userControll = require('../controllers/userController');
const formsSends = require('../controllers/formsSends');

router.post('/register', userControll.createUser);
router.post('/login', userControll.loginUser);
router.get('/user/all', userControll.getAllUsers);
router.post('/sendMessage', formsSends.sendContact);


module.exports = router;
