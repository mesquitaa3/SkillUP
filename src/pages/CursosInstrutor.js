import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/cursos.css';

const CursosInstrutor = () => {
  const [cursos, setCursos] = useState([]);
  const [filtro, setFiltro] = useState('ativos');
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('userData'));
  const instrutorId = localStorage.getItem("instrutorId");

  useEffect(() => {
    if (!userData || userData.cargo !== 'instrutor') {
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:3001/api/instrutor/${instrutorId}/cursos`)
      .then(res => setCursos(res.data))
      .catch(err => console.error('Erro ao carregar cursos:', err));
  }, []);

  const handleAdicionarCurso = () => navigate('/instrutor/criar-curso');
  const handleVisualizarCurso = (id) => navigate(`/instrutor/visualizar-curso/${id}`);

  const handleDesativarCurso = async (id) => {
    if (window.confirm('Deseja desativar este curso?')) {
      await axios.put(`http://localhost:3001/api/instrutor/desativar-curso/${id}`);
      setCursos(cursos.map(c => c.id === id ? { ...c, visivel: 0 } : c));
    }
  };

  const handleAtivarCurso = async (id) => {
    if (window.confirm('Deseja ativar este curso?')) {
      await axios.put(`http://localhost:3001/api/instrutor/ativar-curso/${id}`);
      setCursos(cursos.map(c => c.id === id ? { ...c, visivel: 1 } : c));
    }
  };

  const cursosFiltrados = cursos.filter(curso =>
    filtro === 'ativos' ? curso.visivel === 1 : curso.visivel === 0
  );

  return (
    <div className="instrutor-cursos-container">
      <div className="instrutor-cursos-header">
        <h2 className="instrutor-cursos-title">Os Meus Cursos</h2>
        <div className="instrutor-cursos-filtros">
          <button className={`btn ${filtro === 'ativos' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFiltro('ativos')}>
            Ativos
          </button>
          <button className={`btn ${filtro === 'desativados' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFiltro('desativados')}>
            Desativados
          </button>
        </div>
        <button className="btn btn-success" onClick={handleAdicionarCurso}>
          + Adicionar Curso
        </button>
      </div>

      {cursosFiltrados.length > 0 ? (
        <div className="instrutor-cursos-grid">
          {cursosFiltrados.map(curso => {
            const imagemUrl = curso.imagem
              ? `http://localhost:3001/uploads/${curso.imagem}`
              : "https://placehold.co/300x150";

            return (
              <div key={curso.id} className="curso-card">
                <img src={imagemUrl} alt={curso.titulo} className="curso-imagem" />
                <h3>{curso.titulo}</h3>
                <p>{curso.descricao}</p>
                <p><strong>Duração:</strong> {curso.duracao} <strong>Horas</strong></p>
                <div className="curso-actions">
                  <button className="btn btn-primary" onClick={() => handleVisualizarCurso(curso.id)}>
                    Visualizar
                  </button>
                  {curso.visivel === 1 ? (
                    <button className="btn btn-danger" onClick={() => handleDesativarCurso(curso.id)}>
                      Desativar
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={() => handleAtivarCurso(curso.id)}>
                      Ativar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="instrutor-sem-cursos">Nenhum curso {filtro === 'ativos' ? 'ativo' : 'desativado'} encontrado.</p>
      )}
    </div>
  );
};

export default CursosInstrutor;
