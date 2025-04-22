// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";  // Navbar global
import Hero from "./components/Hero";
import CursosLanding from "./components/CursosLanding";
import Footer from "./components/Footer";
import Cursos from "./pages/Cursos";
import CriarConta from "./pages/CriarConta";
import Login from "./pages/Login";
import PagAluno from "./pages/PagAluno";
import PagInstrutor from "./pages/PagInstrutor";
import SobreNos from "./pages/SobreNos";
import RecuperarPasse from "./pages/RecuperarPasse";
import LayoutAluno from "./components/LayoutAluno";
import LayoutInstrutor from "./components/LayoutInstrutor";
import PrivateRoute from './components/PrivateRoute';
import ContaAluno from "./pages/ContaAluno";  // Página de conta do aluno
import CursosAluno from "./pages/CursosAluno";  // Página de cursos do aluno
import "./assets/styles/styles.css";

function App() {
  return (
    <Router>
      <div id="app-wrapper">
        {/* Navbar global vai aparecer apenas em páginas fora da área protegida */}
        <Routes>
          {/* Rotas públicas (Navbar normal) */}
          <Route path="/" element={<><Navbar /><Hero /><CursosLanding /></>} />
          <Route path="/Cursos" element={<><Navbar /><Cursos /></>} />
          <Route path="/SobreNos" element={<><Navbar /><SobreNos /></>} />
          <Route path="/CriarConta" element={<><Navbar /><CriarConta /></>} />
          <Route path="/Login" element={<><Navbar /><Login /></>} />
          <Route path="/RecuperarPasse" element={<><Navbar /><RecuperarPasse /></>} />
          
          {/* Rotas protegidas com NavbarAluno ou NavbarInstrutor */}
          <Route path="/aluno/*" element={<PrivateRoute role="aluno"><LayoutAluno /></PrivateRoute>}>
            <Route path="" element={<PagAluno />} />  {/* Página principal do aluno */}
            <Route path="conta" element={<ContaAluno />} />  {/* Página de conta do aluno */}
            <Route path="cursos" element={<CursosAluno />} />  {/* Página de cursos do aluno */}
          </Route>
          <Route path="/instrutor/*" element={<PrivateRoute role="instrutor"><LayoutInstrutor /></PrivateRoute>}>
            <Route path="" element={<PagInstrutor />} />  {/* Página principal do instrutor */}
          </Route>
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
