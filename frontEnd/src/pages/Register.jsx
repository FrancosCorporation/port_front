import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css'; // CSS exclusivo para Register

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres.';
    }
    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido.';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulação de API (substitua por fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) }))
    setTimeout(() => {
      setIsLoading(false);
      alert('Registro realizado com sucesso! 🎉');
      console.log('Register Data:', formData);
      navigate('/login'); // Redireciona para login
    }, 1500);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <i className="fas fa-user-plus auth-icon"></i>
          <h1 className="auth-title">Crie Sua Conta</h1>
          <p className="auth-subtitle">Junte-se à FrancosCorp hoje</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <div className="input-field">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                name="name"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
              />
            </div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
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
                placeholder="Crie uma senha"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                required
                minLength={6}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="input-wrapper">
            <div className="input-field">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                required
              />
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Registrando...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i> Registrar
              </>
            )}
          </button>
        </form>
        <div className="auth-footer">
          <p>Já tem uma conta? <Link to="/login" className="link">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
