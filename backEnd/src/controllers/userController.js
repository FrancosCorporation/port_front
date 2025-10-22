const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Criação de usuário
const userController = {
createUser : async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // verifica se email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário', error: error.message });
  }
},
// Função de login
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      console.log(req.body)
      console.log(email)
      console.log(password)

      // verifica se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Email ou senha incorretos' });
      }

      // compara senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Email ou senha incorretos' });
      }

      // retorna dados do usuário (sem senha)
      res.status(200).json({
        message: 'Login realizado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
  },

getAllUsers : async (req, res) => {
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
