// components/LayoutInstrutor.js
import React from 'react';
import NavbarInstrutor from './NavbarInstrutor';
import { Outlet } from 'react-router-dom'; //Renderizar as páginas internas do instrutor

const LayoutInstrutor = () => {
  return (
    <div>
      <NavbarInstrutor />
      <div className="main-content">
        <Outlet /> {/* Renderiza as páginas internas do instrutor */}
      </div>
    </div>
  );
};

export default LayoutInstrutor;
