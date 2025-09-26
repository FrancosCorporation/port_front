import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/send-telegram', async (req, res) => {
  const { user_name, user_email, message } = req.body;

  const text = `
<b>Novo contato:</b>
👤 Nome: ${user_name}
📧 Email: ${user_email}
📝 Mensagem:\n${message}
  `;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${process.env.BOT_KEY}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.ID_TELEGRAM,
        text,
        parse_mode: 'HTML',
      }),
    });

    const result = await tgRes.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem para o Telegram.' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});
