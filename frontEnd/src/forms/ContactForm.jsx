import { useState } from 'react';
import { sendForm } from './functionsReUsed';

function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
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
    if (!formData.name) newErrors.name = 'Nome obrigatório';
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.message) newErrors.message = 'Mensagem obrigatória';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const data = await sendForm({
        url: 'http://localhost:5000/api/sendMessage',
        body: formData,
      });
      alert(data.message || 'Mensagem enviada com sucesso!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome" />
      {errors.name && <span>{errors.name}</span>}
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <span>{errors.email}</span>}
      <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Mensagem" />
      {errors.message && <span>{errors.message}</span>}
      <button type="submit" disabled={isLoading}>{isLoading ? 'Enviando...' : 'Enviar'}</button>
    </form>
  );
}

export default ContactForm;
