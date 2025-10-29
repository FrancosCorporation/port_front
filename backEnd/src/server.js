const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();


const app = express();

app.use(cors({
  origin: process.env.URL_FRONT, // URL do seu frontend React
  credentials: true, // permite enviar cookies
}));

app.use(express.json());
app.use(cookieParser()); 
// Rotas da API
app.use('/api', userRoutes);


// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// -----------------------------
// Middleware para capturar páginas não encontradas (404)

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
