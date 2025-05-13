// pages/CursosAluno.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/cursos.css';

const CursosAluno = () => {
  const [cursos, setCursos] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [duracaoFiltro, setDuracaoFiltro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/cursos')
      .then(res => {
        setCursos(res.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao buscar cursos:', err);
        setCarregando(false);
      });
  }, []);

  const cursosFiltrados = cursos.filter(curso => {
    const matchPesquisa = curso.titulo.toLowerCase().includes(pesquisa.toLowerCase());
    const matchDuracao = duracaoFiltro ? curso.duracao === duracaoFiltro : true;
    return matchPesquisa && matchDuracao;
  });

  return (
    <div className="cursos-page">
      <h1 className="h1cursos">Cursos Disponíveis</h1>

      <div className="filtros">
        <input
          type="text"
          placeholder="Pesquisar curso..."
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />

        <select value={duracaoFiltro} onChange={(e) => setDuracaoFiltro(e.target.value)}>
          <option value="">Todas as durações</option>
          <option value="1 mês">1 mês</option>
          <option value="3 meses">3 meses</option>
          <option value="6 meses">6 meses</option>
        </select>
      </div>

      {carregando ? (
        <p>Carregando cursos...</p>
      ) : (
        <div className="cursos-lista">
          {cursosFiltrados.map((curso) => {
            const imagemUrl = curso.imagem
              ? `http://localhost:3001/uploads/${curso.imagem}`
              : "https://placehold.co/250x150";

            return (
              <div key={curso.id} className="curso-card">
                <img
                  src={imagemUrl}
                  alt={curso.titulo}
                />
                <h3>{curso.titulo}</h3>
                <p>{curso.descricao}</p>
                <p><strong>Duração:</strong> {curso.duracao}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/aluno/cursos/${curso.id}`)}
                >
                  Ver Mais
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CursosAluno;
