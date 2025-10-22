const axios = require("axios");

const formsSends = {
  sendContact: async (req, res) => {
    try {
      // Recebe dados do front-end
      const { user_name, user_email, user_phone, message } = req.body;
      console.log("📩 Dados recebidos do front:", req.body);

      // Validação simples
      if (!user_name || !user_email || !user_phone || !message) {
        return res.status(400).json({ message: "Campos obrigatórios faltando." });
      }

      // Monta mensagem formatada para o Telegram
      const text = `
<b>Novo contato recebido</b>\n
👤 <b>Nome:</b> ${user_name}
📧 <b>Email:</b> ${user_email}
📱 <b>Telefone:</b> ${user_phone}
📝 <b>Mensagem:</b>\n${message}
      `;

      // Envia para o Telegram
      const telegramResponse = await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_KEY}/sendMessage`,
        {
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
        }
      );

      if (telegramResponse.data.ok) {
        res.status(200).json({ message: "Mensagem enviada com sucesso ao Telegram!" });
      } else {
        res.status(500).json({ message: "Erro ao enviar mensagem", error: telegramResponse.data });
      }
    } catch (error) {
      console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
      res.status(500).json({
        message: "Erro interno ao enviar mensagem",
        error: error.response?.data || error.message,
      });
    }
  },
};

module.exports = formsSends;
