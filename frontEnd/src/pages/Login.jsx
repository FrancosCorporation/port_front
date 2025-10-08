import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Para redirecionar após login

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const newErrors = {};

    if (!email || !validateEmail(email)) {
      newErrors.email = 'Email inválido.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Simulação: Substitua por API call (ex: fetch('/api/login'))
      alert('Login realizado com sucesso! 🎉');
      console.log('Login:', { email, password });
      // Redireciona para dashboard ou home após sucesso
      navigate('/'); // Ou '/dashboard' se tiver
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <form className="form active" onSubmit={handleLogin}>
          <h2><i className="fas fa-lock"></i> Faça Login</h2>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Senha"
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn-primary">
            <i className="fas fa-arrow-right"></i> Entrar
          </button>
          
          {/* Botão para ir ao registro */}
          <p className="switch-link">
            Não tem conta? <Link to="/register">Registrar-se</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
