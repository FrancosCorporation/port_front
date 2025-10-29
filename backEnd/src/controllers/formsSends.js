const axios = require("axios");

const formsSends = {
  sendContact: async (req, res) => {
    try {
      // ⚠️ Aqui o req.body pode existir mas ter campos vazios
      if (!req.body) {
        return res.status(400).json({ message: "O corpo da requisição não foi recebido." });
      }

      const { user_name, user_email, user_phone, message } = req.body;

      // Lista de campos obrigatórios e os que estão faltando
      const missingFields = [];
      if (!user_name) missingFields.push("user_name");
      if (!user_email) missingFields.push("user_email");
      if (!user_phone) missingFields.push("user_phone");
      if (!message) missingFields.push("message");

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Campos obrigatórios ausentes.",
          missing: missingFields,
        });
      }

      // Validação de e-mail
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user_email) ) {
        return res.status(400).json({ message: "O e-mail informado não é válido." });
      }

      // Validação de telefone
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(user_phone) || user_phone.length < 9) {
        return res.status(400).json({ message: "O telefone deve conter apenas números e ter pelo menos 9 dígitos." });
      }

      // Envia para o Telegram
      const text = `
<b>Novo contato recebido</b>\n
👤 <b>Nome:</b> ${user_name}
📧 <b>Email:</b> ${user_email}
📱 <b>Telefone:</b> ${user_phone}
📝 <b>Mensagem:</b>\n${message}
      `;

      const telegramResponse = await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_KEY}/sendMessage`,
        {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }
      );

      if (telegramResponse.data.ok) {
        return res.status(200).json({ message: "Mensagem enviada com sucesso !" });
      } else {
        return res.status(500).json({
          message: "Erro ao enviar mensagem.",
          error: telegramResponse.data,
        });
      }
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
      return res.status(500).json({
        message: "Erro interno ao enviar mensagem.",
        error: error.response?.data || error.message,
      });
    }
  },
};

module.exports = formsSends;
