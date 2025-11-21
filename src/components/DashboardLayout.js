import { useNavigate, useLocation } from "react-router-dom";
import {

  FaChartBar, FaTools, FaListAlt, FaUserCog, FaPowerOff, FaChevronLeft, FaChevronRight
} from "react-icons/fa";

import { useState, useEffect } from "react";
import "./DashboardLayout.scss";

export default function DashboardLayout({ user, nomeCliente, children }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const [mobile, setMobile] = useState(window.innerWidth < 900);
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`dashboard-layout ${menuOpen ? "menu-open" : ""}`}>


      <button
        className={`side-toggle ${mobile ? "mobile" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <aside className="sidebar">
        <nav className="menu">
          <button
            className={location.pathname === "/PaginaUsuario/painel" ? "active" : ""}
            onClick={() => navigate("/PaginaUsuario/painel")}
          >
            <FaChartBar /><span className="label">Painel</span>
          </button>

          <button
            className={location.pathname === "/PaginaUsuario/adicionar-servicos" ? "active" : ""}
            onClick={() => navigate("/PaginaUsuario/adicionar-servicos")}
          >
            <FaTools /><span className="label">Adicionar Serviços</span>
          </button>

          <button
            className={location.pathname === "/PaginaUsuario/servicos" ? "active" : ""}
            onClick={() => navigate("/PaginaUsuario/servicos")}
          >
            <FaListAlt /><span className="label">Serviços Cadastrados</span>
          </button>

          <button
            className={location.pathname === "/PaginaUsuario/config-conta" ? "active" : ""}
            onClick={() => navigate("/PaginaUsuario/config-conta")}
          >
            <FaUserCog /><span className="label">Conta</span>
          </button>

          <button className="btn-sair" onClick={logout}><FaPowerOff /><span className="label">Sair</span></button>
        </nav>

      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}
