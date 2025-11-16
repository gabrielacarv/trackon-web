import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo.png';
import monitorSvg from '../assets/images/monitor-animate.svg'; // 🔹 nova ilustração SVG animada
import './Cadastro.scss';

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const forcaSenha = (senha) => {
  let score = 0;
  if (senha.length >= 8) score++;
  if (/[A-Z]/.test(senha)) score++;
  if (/[0-9]/.test(senha)) score++;
  if (/[^A-Za-z0-9]/.test(senha)) score++;
  return score;
};

const PasswordInput = ({ label, value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-container">
      <label>{label}</label>
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        required
      />
      <span
        className="password-toggle-icon"
        onClick={() => setVisible(!visible)}
      >
        <FontAwesomeIcon icon={visible ? faEyeSlash : faEye} />
      </span>
    </div>
  );
};

const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({ field: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError({ field: '', message: '' });

    if (!validarEmail(email))
      return setError({ field: 'email', message: 'Email inválido' });
    if (password !== confirmPassword)
      return setError({ field: 'confirmPassword', message: 'As senhas não coincidem' });

    setLoading(true);
    try {
      const response = await fetch('https://52.14.133.217/auth/api/Autenticacao/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const loginResponse = await fetch('https://52.14.133.217/auth/api/Autenticacao/autenticar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (loginResponse.ok) {
          const data = await loginResponse.json();
          login({ email, token: data.token, name: data.name });
          navigate('/user-page');
        } else {
          setError({ field: 'global', message: 'Falha ao fazer login automático.' });
        }
      } else {
        setError({ field: 'global', message: 'Falha ao registrar. Tente novamente.' });
      }
    } catch {
      setError({ field: 'global', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-left">
        {/* <img src={logo} alt="TrackOn" className="cadastro-logo" /> */}
        <h1>Monitore. Confie. Cresça.</h1>
        <p>Cadastre-se e veja seus serviços sempre online, com relatórios em tempo real e alertas inteligentes.</p>
        <img src={monitorSvg} alt="Ilustração de monitoramento" className="cadastro-illustration" />
      </div>

      <div className="cadastro-right">
        <div className="form-card">
          <h2>Criar Conta</h2>
          <form onSubmit={handleSignUp}>
            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              required
            />
            {error.field === 'email' && <p className="error-message">{error.message}</p>}

            <label>Senha</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <div className="password-meter">
                <div className={`bar strength-${forcaSenha(password)}`}></div>
                <span>
                  {['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'][forcaSenha(password)]}
                </span>
              </div>
            )}

            {password && (
              <>
                <label>Confirmar Senha</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {error.field === 'confirmPassword' && (
                  <p className="error-message">{error.message}</p>
                )}
              </>
            )}


            {error.field === 'global' && (
              <p className="error-message global">{error.message}</p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            <p className="login-redirect">
              {/* <Link to="/Entrar">Esqueceu a senha?</Link>  */}
              <span>Já tem conta? <Link to="/Entrar">Entrar</Link></span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
