import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Painel.scss';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { AuthContext } from '../context/AuthContext';
import { faChartLine, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const API_BASE = "http://52.14.133.217";

const isEmpty = (arr) => !arr || arr.length === 0;
const safeArray = (arr) => Array.isArray(arr) ? arr : [];

const StatCard = ({ title, value, description }) => (
  <div className="stat-card">
    <h4>{title}</h4>
    <div className="stat-value">{value}</div>
    {description && <div className="stat-description">{description}</div>}
  </div>
);

// const CalendarHeatmap = ({ data }) => {
//   if (isEmpty(data)) return <div className="empty-chart">Sem dados</div>;

//   const getColor = (value) => {
//     if (value >= 99.99) return '#006400';
//     if (value >= 99.5) return '#3CB371';
//     if (value >= 95) return '#FFD700';
//     return '#DC143C';
//   };

//   return (
//     <div className="calendar-heatmap">
//       {data.map((d, i) => (
//         <div
//           key={i}
//           className="calendar-cell"
//           title={`${d.data} - ${d.percentualUptime.toFixed(2)}%`}
//           style={{ backgroundColor: getColor(d.percentualUptime) }}
//         />
//       ))}
//     </div>
//   );
// };

// const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// const FalhasHeatmap = ({ data }) => {
//   if (isEmpty(data)) return <div className="empty-chart">Sem dados</div>;

//   const max = Math.max(...data.map(d => d.contagemFalhas), 1);
//   const grid = Array.from({ length: 7 }, (_, dia) =>
//     Array.from({ length: 24 }, (_, hora) =>
//       data.find(d => d.diaSemana === dia && d.hora === hora)?.contagemFalhas || 0
//     )
//   );

//   const getColor = (value) => {
//     const intensity = Math.floor((value / max) * 255);
//     return `rgb(200, ${255 - intensity}, ${255 - intensity})`;
//   };

//   return (
//     <div className="heatmap-container">
//       <div className="heatmap-days">
//         {diasSemana.map((d, i) => (
//           <div key={i} className="heatmap-day-label">{d}</div>
//         ))}
//       </div>
//       <div className="heatmap-grid">
//         {grid.map((coluna, dia) =>
//           coluna.map((valor, hora) => (
//             <div
//               key={`${dia}-${hora}`}
//               className="heatmap-cell"
//               title={`${diasSemana[dia]} ${hora}h: ${valor} falhas`}
//               style={{ backgroundColor: getColor(valor) }}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

const safeHostname = (url) => {
  try { return new URL(url).hostname; } catch { return url; }
};

const Uptime24hBars = ({ data }) => {
  const safeData = safeArray(data);

  if (isEmpty(safeData)) return (
    <div className="stat-card uptime-card">
      <div className="uptime-title-row">
        <h4>Disponibilidade 24h</h4>
      </div>
      <div className="empty-chart">Sem dados</div>
    </div>
  );

  const getColor = (percent) => {
    if (percent >= 99.99) return '#45ac26';
    if (percent >= 99.5) return '#3CB371';
    if (percent >= 95) return '#FFD700';
    return '#e33044';
  };

  const filled = Array.from({ length: 24 }).map((_, hour) => {
    const item = safeData.find(d => d.hora === hour);

    const total = item?.total ?? 0;
    const sucessos = item?.quantidadeSucesso ?? (total - (item?.quantidadeFalha ?? 0));
    const percent = total > 0 ? (sucessos / total) * 100 : 0;

    return { hora: `${hour}h`, percent };
  });

  const media = filled.reduce((sum, x) => sum + x.percent, 0) / 24;

  return (
    <div className="stat-card uptime-card">
      <div className="uptime-title-row">
        <h4>Disponibilidade 24h</h4>
        <span className="uptime-percent" style={{ color: getColor(media) }}>
          {media.toFixed(2)}%
        </span>
      </div>

      <div className="uptime-bars-container">
        {filled.map((h, i) => (
          <div
            key={i}
            className="uptime-bar"
            style={{ backgroundColor: getColor(h.percent) }}
            title={`${h.hora} - ${h.percent.toFixed(2)}% Disponível`}
          />
        ))}
      </div>

      <div className="stat-description">Percentual de sucesso das verificações</div>
    </div>
  );
};


const Sparkline = ({ data, color = "#45ac26" }) => {
  const safeData = safeArray(data);

  if (isEmpty(safeData))
    return <div className="empty-chart">Sem dados suficientes</div>;

  return (
    <div style={{ width: "100%", height: 60, marginTop: 6 }}>
      <ResponsiveContainer>
        <LineChart data={safeData}>
          <Line
            type="monotone"
            dataKey="latencia"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
          <Tooltip
            formatter={(value) => [`${value} ms`, "Latência"]}
            labelFormatter={(l) =>
              new Date(l).toLocaleString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
              })
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const GraficoFalhasPorHora = ({ data }) => {
  if (isEmpty(data))
    return <div className="empty-chart">Sem falhas registradas</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="hora" />
        <YAxis />
        <Tooltip formatter={(v) => [`${v} falhas`, "Ocorrências"]} />
        <Bar dataKey="quantidadeDePings" fill="#e74c3c" barSize={25} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const Painel = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const email = user?.email;
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState('');

  const [periodo, setPeriodo] = useState(7);

  // const [pingServiceNumberByHour, setPingServiceNumberByHour] = useState([]);
  // const [pingFailureDistribution, setPingFailureDistribution] = useState([]);
  // const [pingFailuresPercentage, setPingFailuresPercentage] = useState([]);
  const [totalPingsByService, setTotalPingsByService] = useState([]);
  const [TotalPingsFalhosByService, setTotalPingsFalhosByService] = useState([]);
  // const [uptimeDiario, setUptimeDiario] = useState([]);
  // const [proporcaoUptimeDowntime, setProporcaoUptimeDowntime] = useState([]);
  // const [padraoFalhasHeatmap, setPadraoFalhasHeatmap] = useState([]);
  const [uptime, setUptime] = useState('');
  const [statusServico, setStatusServico] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ultimoRegistroRelativo, setUltimoRegistroRelativo] = useState("...");
  const [uptime24h, setUptime24h] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [responseTime, setResponseTime] = useState([]);
  const [incidentCount, setIncidentCount] = useState(0);
  const [failureReasons, setFailureReasons] = useState([]);
  const [falhasPorHora, setFalhasPorHora] = useState([]);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const formatTempoRelativo = useCallback((date) => {
    if (!date) return "Sem dados";

    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return `${diff} segundos atrás`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutos atrás`;
    return `${Math.floor(diff / 3600)} horas atrás`;
  }, []);

  const calcularUptime = useCallback((date) => {
    if (!date) return "Sem dados";

    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    const dias = Math.floor(diff / 86400);
    const horas = Math.floor((diff % 86400) / 3600);
    const minutos = Math.floor((diff % 3600) / 60);

    return `${dias}d, ${horas}h, ${minutos}m`;
  }, []);

  const fetchCustomer = useCallback(async () => {
    if (!email || !token) return;

    try {
      const res = await fetch(
        `${API_BASE}/api/Cliente/email/${encodeURIComponent(email)}`,
        { headers: authHeaders }
      );
      if (res.ok) setCustomer(await res.json());
    } catch {
      // silencioso
    }
  }, [email, token, authHeaders]);

  const fetchServicos = useCallback(async (clienteId) => {
    if (!clienteId || !token) {
      setServicos([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/Servico/Cliente/${clienteId}`,
        { headers: authHeaders }
      );
      setServicos(res.ok ? await res.json() : []);
    } catch {
      setServicos([]);
    }
  }, [token, authHeaders]);

  const basePainelUrl = useMemo(() => {
    if (!customer?.id) return null;
    return `${API_BASE}/api/clientes/${customer.id}/painel`;
  }, [customer]);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (servicoSelecionado) params.append('servicoId', servicoSelecionado);
    if (periodo) params.append('dias', periodo);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }, [servicoSelecionado, periodo]);

  const fetchData = useCallback(
    async (endpoint, setter, includeDias = true) => {
      if (!basePainelUrl || !token) {
        setter([]);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (servicoSelecionado) params.append('servicoId', servicoSelecionado);
        if (includeDias && periodo) params.append('dias', periodo);
        const qs = params.toString();

        const url = `${basePainelUrl}/${endpoint}${qs ? `?${qs}` : ''}`;

        const res = await fetch(url, { headers: authHeaders });
        setter(res.ok ? await res.json() : []);
      } catch {
        setter([]);
      }
    },
    [basePainelUrl, token, servicoSelecionado, periodo, authHeaders]
  );

const fetchUltimoRegistro = useCallback(async () => {
  if (!basePainelUrl || !token) {
    setUltimoRegistroRelativo("Sem dados");
    setUptime("Sem dados");
    setStatusServico(false);
    return;
  }

  try {
    const query = servicoSelecionado ? `?servicoId=${servicoSelecionado}` : '';
    const url = `${basePainelUrl}/ultimo-ping${query}`;

    const res = await fetch(url, { headers: authHeaders });
    const data = res.ok ? await res.json() : null;

    if (!data) {
      setUltimoRegistroRelativo("Sem dados");
      setUptime("Sem dados");
      setStatusServico(false);
      return;
    }

    const dt = new Date(Date.parse(data.horaPing + "Z"));
    const rel = formatTempoRelativo(dt);
    const up = calcularUptime(dt);

    const statusTexto = data.observacao?.toLowerCase();
    let isUp = false;

    if (statusTexto?.includes("sucesso") || statusTexto?.includes("ok")) {
      isUp = true;
    } else if (statusTexto?.includes("falha")) {
      isUp = false;
    } else {
      isUp = false;
    }

    setUltimoRegistroRelativo(rel);
    setUptime(up);
    setStatusServico(isUp ? "UP" : "DOWN");
  } catch {
    setUltimoRegistroRelativo("Erro");
    setStatusServico("DOWN");
  }
}, [
  basePainelUrl,
  token,
  servicoSelecionado,
  formatTempoRelativo,
  calcularUptime,
  authHeaders
]);


  const fetchHealthHistory = useCallback(async () => {
    if (!basePainelUrl || !token) {
      setStatusServico("DOWN");
      return;
    }

    try {
      const query = servicoSelecionado ? `?servicoId=${servicoSelecionado}` : "";
      const url = `${basePainelUrl}/historico-saude${query}`;

      const res = await fetch(url, { headers: authHeaders });
      const history = res.ok ? await res.json() : [];

      if (isEmpty(history)) { setStatusServico("DOWN"); return; }

      const successes = history.filter(h =>
        h.observacao?.toLowerCase().includes("sucesso")
      ).length;

      const successRate = successes / history.length;

      if (successRate === 1) setStatusServico("UP");
      else if (successRate > 0) setStatusServico("INSTAVEL");
      else setStatusServico("DOWN");

    } catch {
      setStatusServico("DOWN");
    }
  }, [basePainelUrl, token, servicoSelecionado, authHeaders]);

  const fetchUptime24h = useCallback(async () => {
    if (!basePainelUrl || !token) {
      setUptime24h([]);
      return;
    }

    try {
      const query = servicoSelecionado ? `?servicoId=${servicoSelecionado}` : "";
      const url = `${basePainelUrl}/uptime-24h${query}`;

      const res = await fetch(url, { headers: authHeaders });
      setUptime24h(res.ok ? await res.json() : []);
    } catch {
      setUptime24h([]);
    }
  }, [basePainelUrl, token, servicoSelecionado, authHeaders]);

  const fetchIncidentes = useCallback(async () => {
    if (!basePainelUrl || !token) {
      setIncidents([]);
      setIncidentCount(0);
      return;
    }

    try {
      const qs = buildQuery();
      const url = `${basePainelUrl}/incidentes${qs}`;

      const res = await fetch(url, { headers: authHeaders });

      if (!res.ok || res.status === 204) {
        setIncidents([]);
        setIncidentCount(0);
        return;
      }

      const data = await res.json().catch(() => []);
      const lista = Array.isArray(data) ? data : [];

      setIncidents(lista);
      setIncidentCount(lista.length);
    } catch {
      setIncidents([]);
      setIncidentCount(0);
    }
  }, [basePainelUrl, token, buildQuery, authHeaders]);

  const fetchResponseTime = useCallback(async () => {
    if (!basePainelUrl || !token) {
      setResponseTime([]);
      return;
    }

    try {
      const qs = buildQuery();
      const url = `${basePainelUrl}/response-time${qs}`;

      const res = await fetch(url, { headers: authHeaders });
      setResponseTime(res.ok ? await res.json() : []);
    } catch {
      setResponseTime([]);
    }
  }, [basePainelUrl, token, buildQuery, authHeaders]);

  const fetchFailureReasons = useCallback(async () => {
    if (!basePainelUrl || !token) {
      setFailureReasons([]);
      return;
    }

    try {
      const qs = buildQuery();
      const url = `${basePainelUrl}/motivos-falhas${qs}`;

      const res = await fetch(url, { headers: authHeaders });
      const data = res.ok ? await res.json() : [];
      setFailureReasons(data);
    } catch {
      setFailureReasons([]);
    }
  }, [basePainelUrl, token, buildQuery, authHeaders]);

  const fetchFalhasPorHora = useCallback(async () => {
    if (!basePainelUrl || !token) {
      setFalhasPorHora([]);
      return;
    }

    try {
      const qs = buildQuery();
      const url = `${basePainelUrl}/falhas-por-hora${qs}`;

      const res = await fetch(url, { headers: authHeaders });
      setFalhasPorHora(res.ok ? await res.json() : []);
    } catch {
      setFalhasPorHora([]);
    }
  }, [basePainelUrl, token, buildQuery, authHeaders]);

  // valores de resposta de tempo (memo pra não recalcular toda hora)
  const valoresLatencia = useMemo(
    () => responseTime.map(r => r.latency ?? r.latencia ?? 0),
    [responseTime]
  );

  const avg = useMemo(
    () => valoresLatencia.length
      ? (valoresLatencia.reduce((a, b) => a + b) / valoresLatencia.length).toFixed(2)
      : 0,
    [valoresLatencia]
  );

  const min = useMemo(
    () => valoresLatencia.length
      ? Math.min(...valoresLatencia)
      : 0,
    [valoresLatencia]
  );

  const max = useMemo(
    () => valoresLatencia.length
      ? Math.max(...valoresLatencia)
      : 0,
    [valoresLatencia]
  );

  useEffect(() => {
    if (!user) {
      navigate('/entrar');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (email && token) {
      fetchCustomer();
    }
  }, [email, token, fetchCustomer]);

  useEffect(() => {
    if (customer?.id) {
      fetchServicos(customer.id);
    }
  }, [customer, fetchServicos]);

  useEffect(() => {
    if (!basePainelUrl || !token) return;

    let cancelado = false;

    const load = async () => {
      setLoading(true);

      try {
        await Promise.all([
          // fetchData('pings-por-hora', setPingServiceNumberByHour),
          // fetchData('distribuicao-falhas', setPingFailureDistribution),
          // fetchData('percentual-falhas', setPingFailuresPercentage),
          fetchData('total-pings-por-servico', setTotalPingsByService),
          fetchData('total-falhas-por-servico', setTotalPingsFalhosByService),
          // fetchData('uptime-diario', setUptimeDiario),
          // fetchData('proporcao-uptime-downtime', setProporcaoUptimeDowntime),
          // fetchData('padrao-falhas', setPadraoFalhasHeatmap),

          fetchUltimoRegistro(),
          fetchHealthHistory(),
          fetchUptime24h(),
          fetchIncidentes(),
          fetchResponseTime(),
          fetchFailureReasons(),
          fetchFalhasPorHora()
        ]);
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    };

    load();

    return () => { cancelado = true; };
  }, [
    basePainelUrl,
    token,
    servicoSelecionado,
    periodo,
    fetchData,
    fetchUltimoRegistro,
    fetchHealthHistory,
    fetchUptime24h,
    fetchIncidentes,
    fetchResponseTime,
    fetchFailureReasons,
    fetchFalhasPorHora
  ]);

  if (!user) return <div className="loading-overlay"><div className="loader" /></div>;
  if (loading) return <div className="loading-overlay"><div className="loader" /></div>;

  const totalPings = totalPingsByService.reduce((sum, item) => sum + item.totalDePings, 0);
  const totalFailures = TotalPingsFalhosByService.reduce((sum, item) => sum + item.pingsFalhos, 0);

  const modoGeral = !servicoSelecionado;

  return (
    <div className="dashboard-modern">
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Painel de Monitoramento</h2>
          <p className="customer-name">Olá, {customer?.nome}</p>
        </div>
      </header>

      <div className="service-selector">
        <div className="period-selector">
          <label>Selecione o serviço:</label>
          <select value={servicoSelecionado} onChange={e => setServicoSelecionado(e.target.value)}>
            <option value="">Todos</option>
            {servicos.map(s => <option key={s.id} value={s.id}>{s.enderecoUrl}</option>)}
          </select>
        </div>
        <div className="period-selector">
          <label>Período: </label>
          <select value={periodo} onChange={e => setPeriodo(Number(e.target.value))}>
            <option value={1}>Últimas 24h</option>
            <option value={3}>Últimos 3 dias</option>
            <option value={7}>Últimos 7 dias</option>
            <option value={15}>Últimos 15 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={60}>Últimos 60 dias</option>
            <option value={90}>Últimos 90 dias</option>
            <option value={180}>Últimos 180 dias</option>
            <option value={365}>Últimos 365 dias</option>
          </select>
        </div>
      </div>

      <div className="stats-grid">
        {modoGeral ? (
          <>
            <StatCard title="Total de Pings" value={totalPings} description="em todos os serviços" />
            <StatCard title="Falhas Totais" value={totalFailures} description="em todos os serviços" />
            <StatCard title="Serviços Monitorados" value={totalPingsByService.length} description="ativos" />
          </>
        ) : (
          <>
            <StatCard title="Último Ping" value={ultimoRegistroRelativo} description="Verificado a cada 5m" />

            <StatCard
              title="Status Atual"
              value={
                <div className="status-wrapper">
                  <span
                    className={`status-dot ${statusServico === "UP"
                      ? "up"
                      : statusServico === "INSTAVEL"
                        ? "instavel"
                        : "down"
                      }`}
                  />
                  <span
                    className={`status-text ${statusServico === "UP"
                      ? "up"
                      : statusServico === "INSTAVEL"
                        ? "instavel"
                        : "down"
                      }`}
                  >
                    {statusServico === "UP"
                      ? "Online"
                      : statusServico === "INSTAVEL"
                        ? "Instável"
                        : "Offline"}
                  </span>
                </div>
              }
              description={
                statusServico === "UP"
                  ? `Online há ${uptime}`
                  : statusServico === "INSTAVEL"
                    ? `Oscilando — Último registro: ${ultimoRegistroRelativo}`
                    : `Offline desde ${ultimoRegistroRelativo}`
              }
            />

            <Uptime24hBars data={uptime24h} />
          </>
        )}

        <StatCard
          title="Incidentes (24h)"
          value={incidentCount}
          description={modoGeral ? "Todos os serviços" : "Este serviço"}
        />
      </div>

      <div className="main-grid">

        {modoGeral && (
          <>
            <div className="chart-card large-card">
              <h3>Falhas por Serviço</h3>

              {isEmpty(TotalPingsFalhosByService) ? (
                <div className="empty-incidents">Sem falhas registradas 🎉</div>
              ) : (
                <>
                  <div className="failure-header">
                    <span>Serviço</span>
                    <span>Falhas</span>
                  </div>

                  <div className="failure-table">
                    {TotalPingsFalhosByService.map((item, idx) => {
                      const host = (() => {
                        try { return new URL(item.nomeServico).hostname; } catch { return item.nomeServico; }
                      })();

                      return (
                        <div key={idx} className="failure-row">
                          <span className="failure-name">{host}</span>
                          <span className="failure-pill">{item.pingsFalhos}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {!modoGeral && (
          <>
            <div className="chart-card large-card">
              <div className="chart-header">
                <h3>Tempo de Resposta</h3>
              </div>

              <Sparkline data={responseTime} />

              <div className="response-stats">
                <div>
                  <FontAwesomeIcon icon={faChartLine} className="icon-media" />
                  <strong>{avg} ms</strong><br />Média
                </div>
                <div>
                  <FontAwesomeIcon icon={faArrowDown} className="icon-min" />
                  <strong>{min} ms</strong><br />Min
                </div>
                <div>
                  <FontAwesomeIcon icon={faArrowUp} className="icon-max" />
                  <strong>{max} ms</strong><br />Máx
                </div>
              </div>

            </div>

            <div className="chart-card">
              <h3>Motivos das Falhas</h3>

              {isEmpty(failureReasons) ? (
                <div className="empty-incidents">Sem falhas recentes</div>
              ) : (
                <ul className="failure-list">
                  {failureReasons.map((item, idx) => (
                    <li key={idx} className="failure-item">
                      <span className="failure-reason">{item.motivo}</span>
                      <span className="failure-count">{item.quantidade}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="chart-card">
              <h3>Horas com Mais Falhas</h3>
              <GraficoFalhasPorHora data={falhasPorHora} />
            </div>
          </>
        )}

        <div className="chart-card large-card">
          <h3>Últimos Incidentes</h3>

          <div className="incidents-header">
            <div>Status</div>
            <div>Serviço</div>
            <div>Erro</div>
            <div>Data</div>
            <div>Hora</div>
          </div>

          <div className="incidents-list">
            {isEmpty(incidents) ? (
              <div className="empty-incidents">Nenhum incidente recente</div>
            ) : (
              incidents.slice(0, 5).map((i) => {
                const host = safeHostname(i.enderecoUrl);
                return (
                  <div className="incident-row" key={i.id}>
                    <div className="incident-col status">
                      {i.ativo ? (
                        <span className="incident-col service">OK {i.codigoStatus}</span>
                      ) : (
                        <span className="incident-col service">Falha {i.codigoStatus}</span>
                      )}
                    </div>
                    <div className="incident-col service">{host}</div>
                    <div className="incident-col service">{i.codigoStatus || i.descricaoStatus || "—"}</div>
                    <div className="incident-col date">{new Date(i.inicio).toLocaleDateString()}</div>
                    <div className="incident-col hour">
                      {new Date(i.inicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Painel;
