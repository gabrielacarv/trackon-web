import React from 'react';
import { Link } from 'react-router-dom';
// import { GoRocket } from "react-icons/go";
import { FaServer, FaChartLine, FaDatabase, FaCogs, FaClock, FaDesktop } from "react-icons/fa";
import './Pagina.scss';
import logo from '../assets/images/logo.png';
import painel from '../assets/images/painel.png';

const Pagina = () => {
  const features = [
    {
      title: "Monitoramento em Tempo Real",
      desc: "Saiba instantaneamente quando seu site está fora do ar e acompanhe o status em tempo real.",
      Icon: FaDesktop
    },
    {
      title: "Histórico Completo",
      desc: "Tenha gráficos e relatórios detalhados sobre uptime e downtime.",
      Icon: FaClock
    },
    {
      title: "Microsserviço Assíncrono",
      desc: "Monitoramento eficiente via requisições HTTP e ping.",
      Icon: FaCogs
    },
    {
      title: "Armazenamento Confiável",
      desc: "Banco de dados robusto garantindo integridade das informações.",
      Icon: FaDatabase
    },
    {
      title: "Dashboard Intuitivo",
      desc: "Interface web prática e responsiva para visualização dos dados.",
      Icon: FaChartLine
    },
    {
      title: "Escalabilidade & Confiabilidade",
      desc: "Arquitetura moderna em microsserviços pronta para crescer com você.",
      Icon: FaServer
    }
  ];

  return (
    <div className="landing-page">
      {/* Seção Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <img src={logo} alt="TrackOn Logo" className="logo" />
            <h1>Monitore, confie e cresça.</h1>
            <p>Seu site sempre online, seus clientes sempre satisfeitos.</p>
            <Link to="/cadastro" className="cta-btn">Começar agora</Link>
          </div>

          <div className="hero-illustration">
            {/* Exemplo: SVG ilustrativo ou imagem abstrata */}
            <img
              src={painel}
              alt="Ilustração de monitoramento"
            />
          </div>
        </div>
      </section>

      {/* Seção Features */}
      <section className="features">
        <h2>Recursos que impulsionam seu negócio</h2>
        <div className="features-grid">
          {features.map((f, idx) => (
            <div className="feature-card" key={idx}>
              <div className="icon">
                <f.Icon size={32} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

            {/* Seção Footer */}
<footer className="footer">
  <div className="footer-content">
    <div className="footer-left">
      <h2 className="footer-title">TrackOn</h2>
            <p>
        Monitore seus sites com confiança. O TrackOn mantém você sempre
        informado, com alertas em tempo real e dados claros para decisões melhores.
      </p>
    </div>

    
    <div className="footer-contact">
      <h4>Entre em contato</h4>
      <ul>
        <li>suporte@trackon.com.br</li>
        <li>(34) 99999-0000</li>
        <li>Araxá - MG</li>
      </ul>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} TrackOn | Monitoramento inteligente para todos.</p>
  </div>
</footer>



    </div>
  );

}

export default Pagina;
