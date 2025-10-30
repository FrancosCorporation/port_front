import { useState } from 'react';
import { sendForm } from '../../utils/functionsReUsed';
import './FormBase.css';

function ContactForm() {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
    message: ''
  });

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
      const data = await sendForm({ url: 'api/sendMessage', body: formData });
      alert(data.message || 'Mensagem enviada com sucesso!');
      setFormData({ user_name: '', user_email: '', user_phone: '', message: '' });
      setErrors({});
    } catch (error) {
      alert(error.message || 'Erro ao enviar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { name: 'user_name', label: 'Nome', type: 'text' },
    { name: 'user_email', label: 'Email', type: 'text' },
    { name: 'user_phone', label: 'Telefone', type: 'text' },
    { name: 'message', label: 'Mensagem', type: 'textarea' },
  ];

  return (
    <div className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <i className="fas fa-envelope form-icon"></i>
          <h1 className="form-title">Fale Conosco</h1>
          <p className="form-subtitle">Entre em contato e retornaremos em breve</p>
        </div>

        {fields.map((field, idx) => (
          <div className="input-wrapper" key={idx}>
            <div className="input-field">
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="Message_Text"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={errors[field.name] ? 'error' : ''}
                />
              )}
            </div>
            {errors[field.name] && <span className="error-message">{errors[field.name]}</span>}
          </div>
        ))}

        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
