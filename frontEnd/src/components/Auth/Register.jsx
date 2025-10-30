import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendForm } from '../../utils/functionsReUsed';
import '../Form/FormBase.css';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) newErrors.name = 'Nome deve ter pelo menos 2 caracteres.';
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.password || !validatePassword(formData.password)) 
      newErrors.password = 'Mínimo 8 caracteres e ao menos 1 caractere especial.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await sendForm({ 
        url: 'api/register', 
        body: { 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        } 
      });
      navigate('/login');
    } catch (error) {
      alert(error.message || 'Erro ao registrar usuário.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <i className="fas fa-user-plus form-icon"></i>
          <h1 className="form-title">Crie Sua Conta</h1>
          <p className="form-subtitle">Junte-se à FrancosCorp hoje</p>
        </div>

        {['name', 'email', 'password', 'confirmPassword'].map((field, idx) => (
          <div className="input-wrapper" key={idx}>
            <div className="input-field">
              <input
                type={field.toLowerCase().includes('password') ? (showPassword[field] ? 'text' : 'password') : 'text'}
                name={field}
                placeholder={
                  field === 'name' ? 'Seu nome completo' :
                  field === 'email' ? 'Seu email' :
                  field === 'password' ? 'Crie uma senha' : 'Confirme sua senha'
                }
                value={formData[field]}
                onChange={handleChange}
                className={errors[field] ? 'error' : ''}
                required
                minLength={field.includes('password') ? 8 : undefined}
              />
              {field.toLowerCase().includes('password') && (
                <i className={`fas ${showPassword[field] ? 'fa-eye-slash' : 'fa-eye'} toggle-visibility`} 
                   onClick={() => setShowPassword({ ...showPassword, [field]: !showPassword[field] })}></i>
              )}
            </div>
            {errors[field] && <span className="error-message">{errors[field]}</span>}
          </div>
        ))}

        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>

        <div className="form-footer">
          <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Register;
