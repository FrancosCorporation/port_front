import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendForm } from './functionsReUsed'; // Função genérica
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
      const response = await sendForm({
        url: '/api/login', // rota backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: formData,
      });

      console.log('Login Response:', response);

      // Se a API retornar token
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        navigate('/'); // redireciona para dashboard/home
      } else if (response.message) {
        alert(response.message);
      } else {
        alert('Erro ao logar');
      }
    } catch (err) {
      alert(err.message || 'Erro de conexão ou dados inválidos');
    } finally {
      setIsLoading(false);
    }
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
          {['email', 'password'].map((field, idx) => (
            <div className="input-wrapper" key={idx}>
              <div className="input-field">
                <i className={`fas ${field === 'email' ? 'fa-envelope' : 'fa-lock'} input-icon`}></i>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  placeholder={field === 'email' ? 'Seu email' : 'Sua senha'}
                  value={formData[field]}
                  onChange={handleChange}
                  className={errors[field] ? 'error' : ''}
                  required
                  minLength={field === 'password' ? 6 : undefined}
                />
              </div>
              {errors[field] && <span className="error-message">{errors[field]}</span>}
            </div>
          ))}
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
          <p>
            Não tem uma conta? <Link to="/register" className="link">Crie uma agora</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
