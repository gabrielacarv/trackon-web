import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ConfigurarUsuario.scss';
import { Save, ArrowLeft, Edit, X } from 'lucide-react';

const ConfigurarUsuario = () => {
  const { user } = useContext(AuthContext);
  const [clienteId, setClienteId] = useState(null);
  const [dadosCliente, setDadosCliente] = useState({ nome: '', email: '' });

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [editandoInfo, setEditandoInfo] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});
  const navigate = useNavigate();

  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 5000);
  };

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`https://trackon.app.br/api/Cliente/email/${user.email}`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });

        if (response.ok) {
          const cliente = await response.json();
          setClienteId(cliente.id);
          setDadosCliente({ nome: cliente.nome, email: cliente.email });
        }
      } catch (err) {
        console.error('Erro ao carregar cliente', err);
      }
    };
    fetchCliente();
  }, [user]);

  const validarDados = () => {
    const novosErros = {};
    if (!dadosCliente.nome.trim()) novosErros.nome = 'Informe o nome.';
    if (!dadosCliente.email.trim()) novosErros.email = 'Informe o e-mail.';
    else if (!/\S+@\S+\.\S+/.test(dadosCliente.email)) novosErros.email = 'E-mail inválido.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarSenha = () => {
    const novosErros = {};
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!regex.test(novaSenha))
      novosErros.novaSenha = 'Deve ter 8 caracteres, 1 maiúscula, 1 número e 1 símbolo.';
    if (novaSenha !== confirmarSenha)
      novosErros.confirmarSenha = 'Senhas não coincidem.';
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarInfo = async () => {
    if (!validarDados()) return;
    setLoading(true);

    try {
      const resp = await fetch(`https://trackon.app.br/api/Cliente/${clienteId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCliente)
      });

      if (resp.ok) {
        showToast("Informações atualizadas ✅", "success");
        setEditandoInfo(false);
        setErros({});
      } else showToast("Erro ao atualizar ❌", "error");
    } finally { setLoading(false); }
  };

  const salvarSenha = async () => {
    if (!validarSenha()) return;
    setLoading(true);

    try {
      const resp = await fetch(`https://trackon.app.br/api/Cliente/${clienteId}/senha`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha })
      });

      if (resp.ok) {
        showToast("Senha alterada com sucesso 🔐", "success");
        setEditandoSenha(false);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        setErros({});
      } else showToast("Erro ao alterar senha ❌", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="config-user">
      {/* Toast */}
      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      {/* <div className="panel-header">
        <h2>Configurações da Conta</h2>
        <p>Gerencie seus dados e segurança da conta</p>
      </div> */}

      <header className="dashboard-header">
        <div className="header-left">
          <h2>Configurações da Conta</h2>
          <p className="customer-name">Gerencie seus dados e segurança da conta.</p>
        </div>
      </header>

      {/* Informações Pessoais */}
      <div className="card-section">
        <div className="card-header">
          <h3>Informações pessoais</h3>
          {!editandoInfo && (
            <button onClick={() => setEditandoInfo(true)}>
              <Edit size={18} /> Editar
            </button>
          )}
        </div>

        <div className="card-body">
          <label>Nome</label>
          <input
            disabled={!editandoInfo}
            value={dadosCliente.nome}
            onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
            className={erros.nome ? 'input-error' : ''}
          />
          {erros.nome && <span className="error">{erros.nome}</span>}

          <label>E-mail</label>
          <input
            disabled={!editandoInfo}
            value={dadosCliente.email}
            onChange={(e) => setDadosCliente({ ...dadosCliente, email: e.target.value })}
            className={erros.email ? 'input-error' : ''}
          />
          {erros.email && <span className="error">{erros.email}</span>}
        </div>

        {editandoInfo && (
          <div className="actions">
            <button className="btn-save" onClick={salvarInfo} disabled={loading}><Save size={18}/> Salvar {loading ? "Salvando..." : <><Save size={18}/> Salvar</>}</button>
            <button className="btn-cancel" onClick={() => setEditandoInfo(false)} disabled={loading}><X size={18}/> Cancelar</button>
          </div>
        )}
      </div>

      {/* Senha */}
      <div className="card-section">
        <div className="card-header">
          <h3>Segurança</h3>
          {!editandoSenha && (
            <button onClick={() => setEditandoSenha(true)}>
              <Edit size={18} /> Editar
            </button>
          )}
        </div>

        <div className="card-body">
          {editandoSenha && (
            <>
              <label>Senha atual</label>
              <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />

              <label>Nova senha</label>
              <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} className={erros.novaSenha ? 'input-error' : ''}/>
              {erros.novaSenha && <span className="error">{erros.novaSenha}</span>}

              <label>Confirmar nova senha</label>
              <input type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} className={erros.confirmarSenha ? 'input-error' : ''}/>
              {erros.confirmarSenha && <span className="error">{erros.confirmarSenha}</span>}
            </>
          )}
        </div>

        {editandoSenha && (
          <div className="actions">
            <button className="btn-save" onClick={salvarSenha}><Save size={18}/> Salvar</button>
            <button className="btn-cancel" onClick={() => setEditandoSenha(false)}><X size={18}/> Cancelar</button>
          </div>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate('/PaginaUsuario')}>
        <ArrowLeft size={16}/> Voltar ao painel
      </button>
    </div>
  );
};

export default ConfigurarUsuario;
