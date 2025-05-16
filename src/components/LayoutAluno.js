// components/LayoutAluno.js
import React from 'react';
import NavbarAluno from './NavbarAluno';
import { Outlet } from 'react-router-dom'; //Renderizar as páginas internas do aluno

const LayoutAluno = () => {
  return (
    <div>
      <NavbarAluno /> {/* A Navbar do aluno estará aqui */}
      <div className="main-content">
        <Outlet />  {/* Renderiza as páginas internas do aluno */}
      </div>
    </div>
  );
};

export default LayoutAluno;
