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
        default: 'https://imgs.search.brave.com/9cd8GovxZ2sikDcLTKgRjxrEakKQmXBGplCP6wAp9XE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni85MTg3LzkxODc1/NTgucG5nP3NlbXQ9/YWlzX3doaXRlX2xh/YmVs',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

// Middleware para garantir que image nunca fique vazio
ProductSchema.pre('save', function(next) {
    if (!this.image || this.image.trim() === '') {
        this.image = 'https://imgs.search.brave.com/9cd8GovxZ2sikDcLTKgRjxrEakKQmXBGplCP6wAp9XE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4t/aWNvbnMtcG5nLmZy/ZWVwaWsuY29tLzI1/Ni85MTg3LzkxODc1/NTgucG5nP3NlbXQ9/YWlzX3doaXRlX2xh/YmVs';
    }
    next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
