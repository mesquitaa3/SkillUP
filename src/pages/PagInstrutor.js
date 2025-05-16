import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import '../assets/styles/instrutor.css';

const PagInstrutor = () => {
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);
  const [graficoData, setGraficoData] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    const instrutorId = localStorage.getItem("instrutorId");
    console.log("🔍 ID do instrutor usado na dashboard:", instrutorId);

    if (!role || !sessionExpiration || new Date().getTime() > sessionExpiration) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    if (role !== 'instrutor') {
      navigate('/login');
      return;
    }

      axios.get(`http://localhost:3001/api/instrutor/${instrutorId}/cursos`)
      .then(res => {
        console.log("Cursos recebidos:", res.data); // <-- isto
        setCursos(res.data);
        const dadosGrafico = res.data.map(curso => ({
          nome: curso.titulo,
          alunos: curso.total_alunos || 0,
        }));
        setGraficoData(dadosGrafico);
      })
      .catch(err => {
        console.error("Erro ao procurar cursos do instrutor:", err);
      });
  }, [navigate]);

  const handleVerCurso = (id) => { navigate(`/instrutor/visualizar-curso/${id}`); };

  return (
    <div className="pagina-instrutor">
      <h1>Dashboard do Instrutor</h1>

      <section className="secao-cursos">
        <h2>Cursos Criados</h2>
        {cursos.length === 0 ? (
          <p>Nenhum curso encontrado.</p>
        ) : (
          <div className="tabela-cursos">
            <div className="tabela-header">
              <span>Título</span>
              <span>Alunos Inscritos</span>
              <span>Ações</span>
            </div>
            {cursos.map(curso => (
              <div key={curso.id} className="tabela-linha">
                <span>{curso.titulo}</span>
                <span>{curso.total_alunos || 0}</span>
                <button onClick={() => handleVerCurso(curso.id)}>Ver</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default PagInstrutor;
