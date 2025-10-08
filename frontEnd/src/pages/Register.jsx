import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // Estilos compartilhados

function Register() {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const newErrors = {};

    if (!name || name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres.';
    }
    if (!email || !validateEmail(email)) {
      newErrors.email = 'Email inválido.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Simulação: Substitua por API call (ex: fetch('/api/register'))
      alert('Registro realizado com sucesso! 🎉');
      console.log('Registro:', { name, email, password });
      // Redireciona para login após sucesso
      navigate('/login');
    }
  };

  return (
    <div className="login-container">
      <div className="form-card">
        <form className="form active" onSubmit={handleRegister}>
          <h2><i className="fas fa-user-plus"></i> Crie uma Conta</h2>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
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
              placeholder="Senha (mín. 6 chars)"
              required
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirme a Senha"
              required
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn-primary">
            <i className="fas fa-check"></i> Registrar
          </button>
          
          {/* Botão para ir ao login */}
          <p className="switch-link">
            Já tem conta? <Link to="/login">Fazer Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;