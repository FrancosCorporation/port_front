const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true,
        maxlength: [100, 'O nome não pode exceder 100 caracteres'],
    },
    description: {
        type: String,
        required: [true, 'A descrição é obrigatória'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'O preço é obrigatório'],
        min: [0, 'O preço não pode ser negativo'],
    },
    stock: {
        type: Number,
        required: [true, 'O estoque é obrigatório'],
        min: [0, 'O estoque não pode ser negativo'],
    },
    image: {
        type: String,
        default: 'no-photo.jpg', // Placeholder para imagem
    },
    // Chave de referência (FOREIGN KEY) para o usuário que criou o produto
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true // Adiciona createdAt e updatedAt
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;