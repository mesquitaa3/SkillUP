import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar a abertura do menu

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Alterna o estado do menu
    };

    return (
        <nav className="navbar">
            <div className="hamburger" onClick={toggleMenu}>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Cursos">Cursos</Link></li>
                <li><a href="/SobreNos">Sobre Nós</a></li>
                <li><Link to="/Chatbot">Chatbot</Link></li>
            </ul>
            <div className="logo">SkillUP</div>
            <div className="auth-buttons">
                <Link to="/Login" className="btn btn-primary">Login</Link>
                <Link to="/CriarConta" className="btn btn-outline">Registar</Link>
            </div>
        </nav>
    );
}

export default Navbar;