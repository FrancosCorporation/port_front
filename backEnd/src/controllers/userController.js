const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Criação de usuário
const userController = {
  createUser: async (req, res) => {
    try {
      // ✅ 1. Verifica se o corpo da requisição existe e contém os campos
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Corpo da requisição vazio (Missing Body)' });
      }
      const { name, email, password } = req.body;


      // ✅ 2. Verifica campos obrigatórios individualmente
      const missingFields = [];
      if (!name || name.trim() === '') missingFields.push('name');
      if (!email || email.trim() === '') missingFields.push('email');
      if (!password || password.trim() === '') missingFields.push('password');

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Campos obrigatórios ausentes: ${missingFields.join(', ')}`,
        });
      }

      // ✅ 3. Valida formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email inválido' });
      }

      // ✅ 4. Valida tamanho mínimo da senha
      if (password.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
      }

      // ✅ 5. Verifica se o email já está cadastrado
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe' });
      }

      // ✅ 6. Gera o hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ 7. Cria o usuário
      const user = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      });

      // ✅ 8. Retorna sucesso
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ message: 'Erro interno ao criar usuário', error: error.message });
    }
  },

  loginUser: async (req, res) => {
  try {
    // ✅ 1. Verifica corpo da requisição
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Corpo da requisição vazio (Missing Body)" });
    }

    const { email, password } = req.body || {};

    // ✅ 2. Verifica campos obrigatórios
    const missingFields = [];
    if (!email || email.trim() === "") missingFields.push("email");
    if (!password || password.trim() === "") missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
      });
    }

    // ✅ 3. Valida formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email inválido" });
    }

    // ✅ 4. Procura usuário
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      return res.status(400).json({ message: "Email ou senha incorretos" });
    }

    // ✅ 6. Cria token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Define o token em um cookie seguro
    res.cookie("jwt", token, {
      httpOnly: true, // não acessível via JS (protege contra XSS)
      secure: process.env.NODE_ENV === "production", // só HTTPS em prod
      sameSite: "lax", // evita CSRF simples
      maxAge: 60 * 60 * 1000, // 1h
    });

    // ✅ 7. Retorna dados do usuário + token
    res.status(200).json({
      message: "Login realizado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno ao fazer login", error: error.message });
  }
},


  getAllUsers: async (req, res) => {
    try {
      // busca todos os usuários no banco
      const users = await User.find({}, 'name email password createdAt'); // seleciona apenas name e email, sem a senha

      res.status(200).json({
        message: 'Lista de usuários',
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
        })),
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
    }
  },
};
module.exports = userController
