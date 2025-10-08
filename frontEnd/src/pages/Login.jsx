import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // CSS exclusivo para Login

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido.';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulação de API (substitua por fetch('/api/login', { method: 'POST', body: JSON.stringify(formData) }))
    setTimeout(() => {
      setIsLoading(false);
      alert('Login realizado com sucesso! 🎉');
      console.log('Login Data:', formData);
      navigate('/'); // Redireciona para home ou dashboard
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <i className="fas fa-sign-in-alt auth-icon"></i>
          <h1 className="auth-title">Bem-vindo de Volta</h1>
          <p className="auth-subtitle">Faça login para continuar</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <div className="input-field">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="Seu email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
              />
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="input-wrapper">
            <div className="input-field">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                required
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Entrando...
              </>
            ) : (
              <>
                <i className="fas fa-arrow-right"></i> Entrar
              </>
            )}
          </button>
        </form>
        <div className="auth-footer">
          <p>Não tem uma conta? <Link to="/register" className="link">Crie uma agora</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
