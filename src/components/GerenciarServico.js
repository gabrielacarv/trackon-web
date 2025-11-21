import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './GerenciarServico.scss';

const GerenciarServico = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const clienteId = user?.id;

  const [rows, setRows] = useState([{ url: '', type: '1' }]);
  const [servicesToSave, setServicesToSave] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState('');

  const handleAdd = (i) => {
    const item = rows[i];

    if (!item.url.startsWith('http://') && !item.url.startsWith('https://')) {
      return setUrlError('URL deve começar com http:// ou https://');
    }

    setUrlError('');
    setServicesToSave([...servicesToSave, item]);

    const nova = [...rows];
    nova[i] = { url: '', type: '1' };
    setRows(nova);
  };

  const handleEditService = (index) => {
    const serviceToEdit = servicesToSave[index];
    setRows([{ url: serviceToEdit.url, type: serviceToEdit.type }]);
    setServicesToSave(servicesToSave.filter((_, i) => i !== index));
  };

  const handleDeleteService = (index) => {
    setServicesToSave(servicesToSave.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!clienteId) return alert('Cliente não carregado ainda.');
    setLoading(true);

    try {
      for (const svc of servicesToSave) {
        const payload = {
          enderecoUrl: svc.url,
          tipo: parseInt(svc.type),
          clienteId
        };

        await fetch('https://trackon.app.br/api/Servico', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload)
        });
      }

      alert('Serviços salvos com sucesso!');
      setServicesToSave([]);
    } catch {
      alert('Erro ao salvar serviços.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-modern gerenciar-servico">

      {loading && (
        <div className="loading-overlay"><div className="loader" /></div>
      )}

      <header className="dashboard-header">
        <div className="header-left">
          <h2>Adicionar Serviços</h2>
          <p className="customer-name">Adicione URLs para monitorar.</p>
        </div>
      </header>

      <div className="chart-card large-card" style={{ padding: "2rem" }}>
        <div className="header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px', fontWeight: '600', marginBottom: '1rem' }}>
          <span>URL do Serviço</span>
          <span>Tipo</span>
          <span>Ação</span>
        </div>

        {rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px', gap: '10px', marginBottom: '10px' }}>
            <input
              value={row.url}
              onChange={e => {
                const cp = [...rows];
                cp[i].url = e.target.value;
                setRows(cp);
              }}
              placeholder="https://seusite.com"
            />

            <select
              value={row.type}
              onChange={e => {
                const cp = [...rows];
                cp[i].type = e.target.value;
                setRows(cp);
              }}
            >
              <option value="1">Http</option>
              <option value="2">Ping</option>
            </select>

            <button className="add-service-button" title="Adicionar" onClick={() => handleAdd(i)}>+</button>
          </div>
        ))}

        {urlError && <p style={{ color: 'red' }}>{urlError}</p>}
      </div>

      {servicesToSave.length > 0 && (
        <div className="chart-card" style={{ marginTop: '1rem' }}>
          <h3>Serviços pendentes</h3>

          {servicesToSave.map((svc, idx) => (
            <div key={idx} className="service-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee' }}>
              <span>{svc.url} — {svc.type === '1' ? 'Http' : 'Ping'}</span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="icon-button" title="Editar" onClick={() => handleEditService(idx)}>
                  <Edit size={18} />
                </button>

                <button className="icon-button Excluir" title="Excluir" onClick={() => handleDeleteService(idx)}>
                  <Trash size={18} />
                </button>
              </div>

            </div>
          ))}

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button className="save-button" onClick={handleSave} disabled={servicesToSave.length === 0}>Salvar</button>
          </div>
        </div>
      )}

      <button className="btn-back" onClick={() => navigate('/PaginaUsuario')}>
        <ArrowLeft size={16} /> Voltar ao painel
      </button>
    </div>
  );
};

export default GerenciarServico;
