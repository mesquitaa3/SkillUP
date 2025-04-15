import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CursosLanding from "./components/CursosLanding";
import Footer from "./components/Footer";
import Cursos from "./pages/Cursos";
import CriarConta from "./pages/CriarConta"; // Importando CriarConta
import Login from "./pages/Login"; // Importando Login
import PagAluno from "./pages/PagAluno"; // Importando PagAluno
import PagInstrutor from "./pages/PagInstrutor"; // Importando PagInstrutor
import PrivateRoute from './components/PrivateRoute';
import "./assets/styles/styles.css";

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionExpiration');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Limpar o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div id="root">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<><Hero /><CursosLanding /></>} />
            <Route path="/Cursos" element={<Cursos />} />
            <Route path="/CriarConta" element={<CriarConta />} /> {/* Adicionando a rota para CriarConta */}
            <Route path="/Login" element={<Login />} /> {/* Adicionando a rota para Login */}
            <Route path="/aluno" element={<PrivateRoute role="aluno"><PagAluno /></PrivateRoute>} /> {/* Protegendo a página de Aluno */}
            <Route path="/instrutor" element={<PrivateRoute role="instrutor"><PagInstrutor /></PrivateRoute>} /> {/* Protegendo a página de Instrutor */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
