import { useState } from 'react';
import { sendForm } from './functionsReUsed';

function ContactForm() {
  const [formData, setFormData] = useState({ user_name: '', user_email: '', message: '', user_phone: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.user_name) newErrors.user_name = 'Nome obrigatório';
    if (!formData.user_email || !validateEmail(formData.user_email)) newErrors.user_email = 'Email inválido';
    if (!formData.user_phone) newErrors.user_phone = 'Telefone obrigatório';
    if (!formData.message) newErrors.message = 'Mensagem obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await sendForm({
        url: 'api/sendMessage',
        body: formData,
      });
      alert(data.message || 'Mensagem enviada com sucesso!');
      setFormData({ user_name: '', user_email: '', message: '', user_phone: '' });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='contact-formSend'>
      <input name="user_name" className='name-input' value={formData.user_name} onChange={handleChange} placeholder="Nome" />
      {errors.user_name && <span>{errors.user_name}</span>}
      <input name="user_email" className='email-input' value={formData.user_email} onChange={handleChange} placeholder="Email" />
      {errors.user_email && <span>{errors.user_email}</span>}
      <input name="user_phone" className='telefone-input' value={formData.user_phone} onChange={handleChange} placeholder="Telefone" />
      {errors.user_phone && <span>{errors.user_phone}</span>}
      <textarea name="message" className='message-input' value={formData.message} onChange={handleChange} placeholder="Mensagem" />
      {errors.message && <span>{errors.message}</span>}
      <button type="submit" disabled={isLoading}>{isLoading ? 'Enviando...' : 'Enviar'}</button>
    </form>
  );
}

export default ContactForm;
