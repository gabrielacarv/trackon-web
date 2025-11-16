import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash, ArrowLeft, PlusCircle, Save } from 'lucide-react';
import './ServicosCadastrados.scss';

const ServicosCadastrados = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [servicos, setServicos] = useState([]);
  const [clienteId, setClienteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [editedUrl, setEditedUrl] = useState('');
  const [editedType, setEditedType] = useState('1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const res = await fetch(`https://localhost:7257/api/Cliente/email/${user.email}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const cliente = await res.json();
        setClienteId(cliente.id);
      } catch {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [user]);

  useEffect(() => {
    if (!clienteId) return;

    const fetchServicos = async () => {
      try {
        const res = await fetch(`https://localhost:7257/api/Servico/Cliente/${clienteId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setServicos(await res.json());
      } catch {}
      setLoading(false);
    };
    fetchServicos();
  }, [clienteId, user]);

  const handleEdit = (s) => {
    setEditing(s.id);
    setEditedUrl(s.url);
    setEditedType(s.tipo.toString());
            console.log(s.tipo);
  };

  const handleSaveEdit = async () => {
    await fetch(`https://localhost:7257/api/Servico/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ id: editing, url: editedUrl, tipo: parseInt(editedType), clienteId, ativo: true })
    });

    const res = await fetch(`https://localhost:7257/api/Servico/Cliente/${clienteId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setServicos(await res.json());
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Confirma excluir este serviço?')) return;

    await fetch(`https://localhost:7257/api/Servico/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });

    setServicos(servicos.filter(s => s.id !== id));
  };

  // if (loading) return <div className='loader-page'><div className='loader'></div></div>;
  if (!user) return <div className="loading-overlay"><div className="loader" /></div>;
  if (loading) return <div className="loading-overlay"><div className="loader" /></div>;

  return (
    <div className="dashboard-modern"> 
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Meus Serviços</h2>
          <p className="customer-name">Gerencie os sites e serviços monitorados.</p>
        </div>
      </header>

      {servicos.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum serviço cadastrado ainda.</p>
          <button className="btn-primary" onClick={() => navigate('/PaginaUsuario/adicionar-servicos')}>
            <PlusCircle size={18}/> Adicionar primeiro serviço
          </button>
        </div>
      ) : (
        <div className="service-grid">
          {servicos.map(s => (
            <div className="service-card" key={s.id}>
              {editing === s.id ? (
                <>
                  <input value={editedUrl} onChange={e=>setEditedUrl(e.target.value)} className="input"/>
                  <select value={editedType} onChange={e=>setEditedType(e.target.value)} className="input">
                    <option value="1">Http</option>
                    <option value="2">Ping</option>
                  </select>
                  <div className="card-actions">
                    <button className="btn-save" onClick={handleSaveEdit}><Save size={18}/></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="service-info">
                    <div className="service-top-row">
                      <span className="badge">{s.tipo === 1 ? 'Http' : 'Ping'}</span>

                      <div className="card-actions">
                        <button onClick={() => handleEdit(s)}><Edit size={18} /></button>
                        <button className="delete" onClick={() => handleDelete(s.id)}><Trash size={18} /></button>
                      </div>
                    </div>

                    <h4 className="service-url" title={s.enderecoUrl}>{s.enderecoUrl}</h4>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="btn-secondary back" onClick={() => navigate('/PaginaUsuario/painel')}>
        <ArrowLeft size={16}/> Voltar ao Painel
      </button>
    </div>
  );
};

export default ServicosCadastrados;
