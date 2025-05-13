// components/LayoutInstrutor.js
import React from 'react';
import NavbarInstrutor from './NavbarInstrutor'; // Usando a mesma Navbar, ou pode ser uma diferente
import { Outlet } from 'react-router-dom'; // Usado para renderizar as páginas internas do instrutor

const LayoutInstrutor = () => {
  return (
    <div>
      <NavbarInstrutor />
      <div className="main-content">
        <Outlet /> {/* Aqui renderiza as páginas internas do instrutor */}
      </div>
    </div>
  );
};

export default LayoutInstrutor;
