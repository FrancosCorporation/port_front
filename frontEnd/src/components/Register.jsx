import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendForm } from './functionsReUsed'; // Função genérica que criamos
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

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

    if (!formData.name || formData.name.length < 2)
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres.';
    if (!formData.email || !validateEmail(formData.email))
      newErrors.email = 'Email inválido.';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Senhas não coincidem.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const data = await sendForm({
        url: 'api/register',
        body: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });

      alert(data.message || 'Registro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      alert(error.message || 'Erro ao registrar usuário.');
    } finally {
      setIsLoading(false);
    }
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
          {['name', 'email', 'password', 'confirmPassword'].map((field, index) => (
            <div className="input-wrapper" key={index}>
              <div className="input-field">
                <i
                  className={`fas ${
                    field === 'name'
                      ? 'fa-user'
                      : field.includes('email')
                      ? 'fa-envelope'
                      : 'fa-lock'
                  } input-icon`}
                ></i>

                <input
                  type={
                    field.toLowerCase().includes('password')
                      ? showPassword[field]
                        ? 'text'
                        : 'password'
                      : 'text'
                  }
                  name={field}
                  placeholder={
                    field === 'name'
                      ? 'Seu nome completo'
                      : field === 'email'
                      ? 'Seu email'
                      : field === 'password'
                      ? 'Crie uma senha'
                      : 'Confirme sua senha'
                  }
                  value={formData[field]}
                  onChange={handleChange}
                  className={errors[field] ? 'error' : ''}
                  required
                  minLength={field.includes('password') ? 6 : undefined}
                />

                {/* 👁️ Ícone para mostrar/ocultar senha */}
                {field.toLowerCase().includes('password') && (
                  <i
                    className={`fas ${
                      showPassword[field] ? 'fa-eye-slash' : 'fa-eye'
                    } toggle-visibility`}
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        [field]: !showPassword[field],
                      })
                    }
                  ></i>
                )}
              </div>
              {errors[field] && (
                <span className="error-message">{errors[field]}</span>
              )}
            </div>
          ))}

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
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="link">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
