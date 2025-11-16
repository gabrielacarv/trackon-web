// import React, { useContext, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
// import Pagina from './components/Pagina';
// import Entrar from './components/Entrar';
// import Cadastro from './components/Cadastro';
// import Contato from './components/Contato';
// import Sobre from './components/Sobre';
// import NaoEncontrado from './components/NaoEncontrado';
// import EscolherPlano from './components/EscolherPlano';
// import PaginaUsuario from './components/PaginaUsuario';
// import InfoPlano from './components/InfoPlano'; 
// import Painel from './components/Painel';
// import GerenciarServico from './components/GerenciarServico';
// import PaginaSucesso from './components/PaginaSucesso';
// import ServicosCadastrados from './components/ServicosCadastrados';
// import ConfigurarUsuario from './components/ConfigurarUsuario';
// import './styles/main.scss';
// import logo from './assets/images/logo.png';
// import { AuthContext } from './context/AuthContext';

// function App() {
//   const { user, loading, logout } = useContext(AuthContext);
//   const location = useLocation(); // pega a rota atual

//   useEffect(() => {
//     const handleScroll = () => {
//       const header = document.getElementById('myHeader');
//       const sticky = header.offsetTop;
//       if (window.pageYOffset > sticky) {
//         header.classList.add('sticky');
//       } else {
//         header.classList.remove('sticky');
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   const currentYear = new Date().getFullYear();

//   if (loading) {
//     return <div className="loading-overlay"><div className="loader"></div></div>;
//   }

//   return (
//     <>
//       <header id="myHeader">
//         {/* {location.pathname !== '/' && ( */}
//           <Link to="/">
//             <img src={logo} alt="TrackOn Logo" className="logo" />
//           </Link>
//         {/* )} */}
//         <nav>
//           {!user ? (
//             <>
//               <Link to="/Cadastro">Cadastro</Link>
//               <Link to="/Entrar">Entrar</Link>
//             </>
//           ) : (
//             <>
//               <Link to="/Painel">Meu Painel</Link>
//               <button onClick={logout} className="botao-sair">Sair</button>
//             </>
//           )}
//         </nav>
//       </header>

//       <div className="container">
//         <Routes>
//           <Route path="/Entrar" element={<Entrar />} />
//           <Route path="/Cadastro" element={<Cadastro />} />
//           <Route path="/Sobre" element={<Sobre />} />
//           <Route path="/Contato" element={<Contato />} />
//           <Route path="/EscolherPlano" element={user ? <EscolherPlano user={user} /> : <Entrar />} />
//           <Route path="/PaginaUsuario" element={user ? <PaginaUsuario user={user} /> : <Entrar />} />
//           <Route path="/InfoPlano" element={user ? <InfoPlano user={user} /> : <Entrar />} />
//           <Route path="/Painel" element={user ? <Painel user={user} /> : <Entrar />} />
//           <Route path="/GerenciarServico" element={user ? <GerenciarServico user={user} /> : <Entrar />} />
//           <Route path="/PaginaSucesso" element={<PaginaSucesso />} />
//           <Route path="/ServicosCadastrados" element={<ServicosCadastrados user={user} />} />
//           <Route path="/ConfigurarUsuario" element={<ConfigurarUsuario />} />
//           <Route path="/" element={<Pagina />} />
//           <Route path="*" element={<NaoEncontrado />} />
//         </Routes>
//       </div>

//       <footer>
//         &copy; {currentYear} TrackOn. Todos os direitos reservados.
//       </footer>
//     </>
//   );
// }

// // Envolvendo o App com Router, necessário para usar useLocation
// export default function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   );
// }

import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom'; // ✅ adicionado useNavigate
import Pagina from './components/Pagina';
import Entrar from './components/Entrar';
import Cadastro from './components/Cadastro';
import NaoEncontrado from './components/NaoEncontrado';
import PaginaUsuario from './components/PaginaUsuario';
import Painel from './components/Painel';
import GerenciarServico from './components/GerenciarServico';
import ServicosCadastrados from './components/ServicosCadastrados';
import ConfigurarUsuario from './components/ConfigurarUsuario';
import './styles/main.scss';
import logo from './assets/images/logo.png';
import { AuthContext } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function App() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ agora pode usar

  useEffect(() => {
    const header = document.getElementById('myHeader');
    if (!header) return;
    const sticky = header.offsetTop;

    const handleScroll = () => {
      if (window.pageYOffset > sticky) header.classList.add('sticky');
      else header.classList.remove('sticky');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentYear = new Date().getFullYear();

  if (loading) {
    return <div className="loading-overlay"><div className="loader"></div></div>;
  }

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 500);
  };


  return (
    <>
      <header id="myHeader">
        <Link to="/">
          <img src={logo} alt="TrackOn Logo" className="logo" />
        </Link>

        <nav>
          {!user ? (
            <>
              <Link to="/Cadastro">Cadastro</Link>
              <Link to="/Entrar">Entrar</Link>
            </>
          ) : (
            <>
              <Link to="/PaginaUsuario">Meu Painel</Link>
              <button onClick={handleLogout} className="botao-sair">Sair</button>
            </>
          )}
        </nav>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Pagina />} />
          <Route path="/Entrar" element={<Entrar />} />
          <Route path="/Cadastro" element={<Cadastro />} />

          {user && (
            <Route path="/PaginaUsuario" element={<PaginaUsuario />}>
              <Route index element={<Navigate to="painel" replace />} />
              <Route path="painel" element={<Painel />} />
              <Route path="adicionar-servicos" element={<GerenciarServico />} />
              <Route path="servicos" element={<ServicosCadastrados />} />
              <Route path="config-conta" element={<ConfigurarUsuario />} />
            </Route>
          )}

          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </div>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
