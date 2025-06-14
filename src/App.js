import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
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
import ResetPassword from "./pages/ResetPassword";  // Adiciona o import para a página de reset
import LayoutAluno from "./components/LayoutAluno";
import LayoutInstrutor from "./components/LayoutInstrutor";
import PrivateRoute from './components/PrivateRoute';
import ContaAluno from "./pages/ContaAluno";  // Página de conta do aluno
import CursosAluno from "./pages/CursosAluno";  // Página de cursos do aluno
import CursoDetalhes from "./pages/CursoDetalhes";  // Detalhes do curso
import Pagamento from "./pages/Pagamento";  // Rota para a página de pagamento
import CursosInstrutor from "./pages/CursosInstrutor";
import CriarCurso from "./pages/CriarCurso";  // Página de criação de curso
import EditarCurso from "./pages/EditarCurso";  // Página de edição de curso
import ContaInstrutor from "./pages/ContaInstrutor";  // Página de conta do instrutor
import VisualizarCursoInstrutor from "./pages/VisualizarCursoInstrutor";  // Página de visualização do curso
import CursoAlunoDetalhes from "./pages/CursoAlunoDetalhes";
import CursosInscritosAluno from "./pages/CursosInscritoAluno";  // Página de cursos inscritos do aluno
import Logout from "./pages/Logout";
import Chatbot from "./pages/Chatbot";
import "./assets/styles/styles.css";

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": "AXNHOkvHFY2L0o8OHd61yV_emAmvM32ekXBQhedJNFuTSyfxAbuGEhb-O6gdGOPbGsxVCwhtATo8ZBGe" }}>
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
          <Route path="/reset-password/:token" element={<><Navbar /><ResetPassword /></>} />  {/* Rota para redefinir a palavra-passe */}
          <Route path="/Chatbot" element={<><Navbar /><Chatbot /></>} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Rotas protegidas com NavbarAluno ou NavbarInstrutor */}
          <Route path="/aluno/*" element={<PrivateRoute role="aluno"><LayoutAluno /></PrivateRoute>}>
            <Route path="" element={<PagAluno />} />  {/* Página principal do aluno */}
            <Route path="conta" element={<ContaAluno />} />
            <Route path="cursos" element={<CursosAluno />} />
            <Route path="cursos/:id" element={<CursoDetalhes />} />
            <Route path="pagamento" element={<Pagamento />} />
            <Route path="curso-detalhes/:id" element={<CursoAlunoDetalhes />} />  {/* Detalhes do curso */}
            <Route path="cursos-inscritos" element={<CursosInscritosAluno />} />
          </Route>
          <Route path="/instrutor/*" element={<PrivateRoute role="instrutor"><LayoutInstrutor /></PrivateRoute>}>
            <Route path="" element={<PagInstrutor />} />  {/* Página principal do instrutor */}
            <Route path="conta" element={<ContaInstrutor />} />
            <Route path="cursos" element={<CursosInstrutor />} />
            <Route path="criar-curso" element={<CriarCurso />} />
            <Route path="editar-curso/:id" element={<EditarCurso />} />  {/* Editar curso */}
            <Route path="visualizar-curso/:id" element={<VisualizarCursoInstrutor />} />  {/* Visualizar curso */}
          </Route>
        </Routes>

        <Footer />
      </div>
    </Router>
    </PayPalScriptProvider>
  );
}

export default App;
