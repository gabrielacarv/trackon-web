import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext';
import monitorSvg from '../assets/images/Entrar.svg';
import './Entrar.scss';

const Entrar = () => {
  const [email, setEmail] = useState('');
  const [senha, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://trackon.app.br/api/Autenticacao/autenticar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, name } = data;
        login({ email, token, name });
        navigate('/PaginaUsuario');
      } else {
        const errorData = await response.text();
        setError(`Falha no login: ${errorData}`);
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h1>Bem-vindo</h1>
        <p>Monitore seus serviços, visualize relatórios e mantenha seu site sempre online.</p>
        <img src={monitorSvg} alt="Monitoramento" className="login-illustration" />
      </div>

      <div className="login-right">
        <div className="form-card">
          <h2>Entrar</h2>

          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Senha</label>
            <div className="password-container">
              <input
                type="text"
                placeholder="Digite sua senha"
                className={passwordVisible ? "pass-visible" : "pass-hidden"}
                value={senha}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <span
                className="password-toggle-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
              </span>
            </div>


            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="login-links">
              <Link to="/RecuperarSenha">Esqueceu a senha?</Link><br />
              Ainda não tem conta? <Link to="/Cadastro">Cadastre-se</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Entrar;
