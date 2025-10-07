import React, { useRef, useState } from 'react';

const botToken = process.env.REACT_APP_BOT_KEY;
// ⚠️ Substitua pelos dados REAIS (o NOVO token e seu chat_id)
const chatId = process.env.REACT_APP_ID_TELEGRAM; // ex: 123456789
console.log(chatId,botToken)

const ContactForm = () => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const sendMessage = async (data) => {
    const message = `
<b>Novo contato recebido</b>\n
👤 <b>Nome:</b> ${data.user_name}
📧 <b>Email:</b> ${data.user_email}
📝 <b>Mensagem:</b>\n${data.message}
    `;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();
    if (!result.ok) throw new Error(result.description);
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = formRef.current;
    const data = {
      user_name: form.user_name.value,
      user_email: form.user_email.value,
      message: form.message.value
    };

    try {
      await sendMessage(data);
      alert('Mensagem enviada com sucesso!');
      form.reset();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao enviar mensagem. Verifique o token/chat_id.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
      <input type="text" name="user_name" placeholder="Seu Nome" required />
      <input type="email" name="user_email" placeholder="Seu Email" required />
      <textarea name="message" placeholder="Sua Mensagem" rows="5" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default ContactForm;
