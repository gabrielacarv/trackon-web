import React from 'react';
import { Link } from 'react-router-dom';
import './NaoEncontrado.scss';

const NaoEncontrado = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>Página Não Encontrada</h2>
        <p>
          Oops! Parece que a página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <button className="back-btn">Voltar para a Página Inicial</button>
        </Link>
      </div>
    </div>
  );
};

export default NaoEncontrado;
