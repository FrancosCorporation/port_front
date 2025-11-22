const Product = require('../models/Product');

const ProductController = {
  // CREATE - criar produto
  createProduct: async (req, res) => {
    try {
      const userId = req.user.id;

      // Valida campos obrigatórios
      const { name, price, stock } = req.body;
      if (!name || price === undefined) {
        return res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
      }
      // Cria o produto
      const newProduct = await Product.create({
        ...req.body,
        image: req.body.image || undefined, // se vazio, usa default do schema
        user: userId,
      });

      res.status(201).json({
        message: 'Produto criado com sucesso!',
        product: newProduct,
      });
    } catch (error) {
      console.error("❌ Erro ao criar produto:", error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  },

  // READ - listar produtos do usuário logado
  getProducts: async (req, res) => {
    try {
      const userId = req.user.id;
      const products = await Product.find({ user: userId }).sort({ createdAt: -1 });
      res.status(200).json({ products });
    } catch (error) {
      console.error("❌ Erro ao listar produtos:", error);
      res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  },

  // UPDATE - editar produto
  updateProduct: async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.id;

      const product = await Product.findOne({ _id: productId, user: userId });
      if (!product) return res.status(404).json({ message: 'Produto não encontrado ou não autorizado' });

      // Atualiza somente os campos enviados
      ['name', 'description', 'price', 'stock', 'image'].forEach(field => {
        
        if (req.body[field] !== undefined) product[field] = req.body[field];
      });

      await product.save();
      res.status(200).json({ message: 'Produto atualizado com sucesso!', product });
    } catch (error) {
      console.error("❌ Erro ao atualizar produto:", error);
      res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  },

  // DELETE - deletar produto
  deleteProduct: async (req, res) => {
    try {
      const userId = req.user.id;
      const productId = req.params.id;

      const product = await Product.findOneAndDelete({ _id: productId, user: userId });
      if (!product) return res.status(404).json({ message: 'Produto não encontrado ou não autorizado' });

      res.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
      console.error("❌ Erro ao deletar produto:", error);
      res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  },
};

module.exports = ProductController;
