import React, { useState } from "react";
import { Link } from "react-router-dom";

function NavbarAluno() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/aluno">Home</Link></li>
        <li><Link to="/aluno/cursos">Cursos</Link></li>
        <li><Link to="/aluno/cursos-inscritos">Cursos Inscritos</Link></li>
      </ul>
      <div className="logo">SkillUP</div>
      <div className="auth-buttons">
        <Link to="/aluno/conta" className="btn btn-outline">Conta</Link>
        <Link to="/Logout" className="btn btn-primary">Sair</Link>
      </div>
    </nav>
  );
}

export default NavbarAluno;
