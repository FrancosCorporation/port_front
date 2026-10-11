import { useState } from 'react';

// ⚠️ SEGURANÇA (C4): a credencial antiga do Telegram já foi exposta em builds
// do cliente. O navegador agora envia apenas os dados do formulário ao endpoint
// próprio; o token permanece exclusivamente no ambiente do servidor. Rotacione
// a credencial antiga antes de voltar a usar o bot.
const fallbackMessage = 'Não foi possível enviar agora. Tente novamente ou fale com a Francos pelo LinkedIn.';

function ContactForm() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();

    if (sending) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || '').trim(),
    };

    setSending(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || fallbackMessage);
      }

      form.reset();
      setFeedback({ type: 'success', message: 'Mensagem enviada. Obrigado por entrar em contato!' });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error && error.message !== 'Failed to fetch'
          ? error.message
          : fallbackMessage,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__row">
        <div className="field">
          <label htmlFor="contact-name">Seu nome</label>
          <input
            autoComplete="name"
            id="contact-name"
            maxLength="100"
            name="name"
            placeholder="Como podemos chamar você?"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Seu e-mail</label>
          <input
            autoComplete="email"
            id="contact-email"
            maxLength="254"
            name="email"
            placeholder="voce@exemplo.com"
            required
            type="email"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-message">Como podemos ajudar?</label>
        <textarea
          id="contact-message"
          maxLength="3000"
          minLength="10"
          name="message"
          placeholder="Conte um pouco sobre a sua ideia ou desafio."
          required
          rows="5"
        />
      </div>

      <div aria-hidden="true" className="contact-form__trap">
        <label htmlFor="contact-website">Não preencha este campo</label>
        <input autoComplete="off" id="contact-website" name="website" tabIndex="-1" />
      </div>

      <div className="contact-form__footer">
        <p aria-atomic="true" aria-live="polite" className={`form-feedback form-feedback--${feedback.type}`}>
          {feedback.message}
        </p>
        <button className="button button--primary form-submit" disabled={sending} type="submit">
          {sending ? 'Enviando…' : 'Enviar mensagem'}
          <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
    </form>
  );
}

export default ContactForm;
