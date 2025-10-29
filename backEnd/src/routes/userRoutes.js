const express = require('express');
const router = express.Router();
const userControll = require('../controllers/userController');
const formsSends = require('../controllers/formsSends');
const multer = require("multer");
const upload = multer(); // processa form-data sem arquivos
const authenticateJWT = require("../middlewares/authMiddleware");

router.post('/register', upload.none(), userControll.createUser);
router.post('/login', upload.none(), userControll.loginUser);
router.get('/user/all', userControll.getAllUsers);
router.post('/sendMessage', upload.none(), formsSends.sendContact);
// Rota protegida
router.get("/profile", authenticateJWT, async(req, res) => {
  res.json({
    message: "Dados do perfil do usuário autenticado",
    user: await User.findById(req.user.id).select("-password"), // vem do token decodificado
  });
});

module.exports = router;
