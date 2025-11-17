const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Para fazer o hash da senha

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    // Adicione outros campos conforme necessário (ex: role, createdAt)
}, {
    timestamps: true // Adiciona createdAt e updatedAt
});

// Pré-salvamento: Hash da senha antes de salvar no DB
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;