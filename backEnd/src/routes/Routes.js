const express = require('express');
const router = express.Router();
const userControll = require('../controllers/userController');
const productControll = require('../controllers/productController');
const formsSends = require('../controllers/formsSends');
const multer = require("multer");
const upload = multer(); // processa form-data sem arquivos
const protect = require("../middlewares/authMiddleware");

//user routes
router.post('/register', upload.none(), userControll.createUser);
router.post('/login', upload.none(), userControll.loginUser);
router.get('/user/all', userControll.getAllUsers);
router.post('/sendMessage', upload.none(), formsSends.sendContact);
// Rota protegida
router.get("/profile", protect, userControll.getProfile);
// product routes
router.post('/products', protect, productControll.createProduct);
router.get('/products', protect, productControll.getProducts);    // read
router.put('/products/:id', protect, productControll.updateProduct); // update
router.delete('/products/:id', protect, productControll.deleteProduct); // delete

module.exports = router;
