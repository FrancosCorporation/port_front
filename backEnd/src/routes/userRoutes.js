const express = require('express');
const router = express.Router();
const { createUser , getAllUsers} = require('../controllers/userController');

router.post('/register', createUser);
router.get('/user/all', getAllUsers);


module.exports = router;
