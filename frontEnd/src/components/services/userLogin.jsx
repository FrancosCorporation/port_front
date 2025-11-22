//userLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendForm } from '../../utils/functionsReUsed';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = 'Email inválido.';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await sendForm({ url: 'api/login', body: formData });
      navigate('/Dashboard3');
    } catch (err) {
      alert(err.message || 'Erro ao logar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-header">
          <i className="fas fa-sign-in-alt form-icon"></i>
          <h1 className="form-title">Bem-vindo de Volta</h1>
          <p className="form-subtitle">Faça login para continuar</p>
        </div>

        {['email', 'password'].map((field, idx) => (
          <div className="input-wrapper" key={idx}>
            <div className="input-field">
              <input
                type={field === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                name={field}
                placeholder={field === 'email' ? 'Seu email' : 'Sua senha'}
                value={formData[field]}
                onChange={handleChange}
                className={errors[field] ? 'error' : ''}
                required
              />
              {field === 'password' && (
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-visibility`} 
                   onClick={() => setShowPassword(!showPassword)}></i>
              )}
            </div>
            {errors[field] && <span className="error-message">{errors[field]}</span>}
          </div>
        ))}

        <button type="submit" className="form-button" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        <div className="form-footer">
          <p>Não tem uma conta? <Link to="/register">Crie uma agora</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;
