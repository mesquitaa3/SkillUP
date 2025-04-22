// components/LayoutAluno.js
import React from 'react';
import NavbarAluno from './NavbarAluno';
import { Outlet } from 'react-router-dom';  // Esse é o ponto onde as páginas filhas serão renderizadas

const LayoutAluno = () => {
  return (
    <div>
      <NavbarAluno />  {/* A Navbar do aluno estará aqui */}
      <div className="main-content">
        <Outlet />  {/* A página filha (como PagAluno) será renderizada aqui */}
      </div>
    </div>
  );
};

export default LayoutAluno;
