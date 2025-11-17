const Product = require('../models/Product');

/**
 * Cria um novo produto e o associa ao usuário logado.
 * @route POST /api/products
 * @access Private (necessita de JWT válido)
 */
const ProductController = {
createProduct: async (req, res) => {
    try {
        // O userId é injetado pelo middleware 'protect'
        const userId = req.userId; 
        
        // 1. Validações básicas (você pode adicionar mais, mas o Mongoose já faz algumas)
        if (!req.body.name || !req.body.price) {
            return res.status(400).json({ message: 'Nome e preço são obrigatórios.' });
        }
        
        // 2. Cria o novo produto, anexando o ID do usuário
        const newProduct = await Product.create({
            ...req.body,
            user: userId, // <-- Vínculo com o usuário logado
        });

        // 3. Retorna o novo produto
        res.status(201).json({
            message: 'Produto criado com sucesso!',
            product: newProduct,
        });

    } catch (error) {
        // Erro de validação do Mongoose ou erro interno
        console.error("❌ Erro ao criar produto:", error);
        // Verifica se é um erro de validação do Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
},
};
module.exports = ProductController;