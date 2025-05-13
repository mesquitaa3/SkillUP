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
    const instrutorId = localStorage.getItem('userId');

    if (!role || !sessionExpiration || new Date().getTime() > sessionExpiration) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    if (role !== 'instrutor') {
      navigate('/login');
      return;
    }

    // Buscar cursos criados por este instrutor
    axios.get(`http://localhost:3001/api/instrutor/${instrutorId}/cursos`)
      .then(res => {
        setCursos(res.data);

        // Criar dados para gráfico
        const dadosGrafico = res.data.map(curso => ({
          nome: curso.titulo,
          alunos: curso.total_alunos || 0,
        }));
        setGraficoData(dadosGrafico);
      })
      .catch(err => {
        console.error("Erro ao buscar cursos do instrutor:", err);
      });
  }, [navigate]);

  return (
    <div className="pagina-instrutor">
      <h1>Dashboard do Instrutor</h1>

      <section className="secao-cursos">
        <h2>Cursos Criados</h2>
        {cursos.length === 0 ? (
          <p>Nenhum curso encontrado.</p>
        ) : (
          <ul className="lista-cursos">
            {cursos.map(curso => (
              <li key={curso.id}>
                <h3>{curso.titulo}</h3>
                <p><strong>Descrição:</strong> {curso.descricao}</p>
                <p><strong>Duração:</strong> {curso.duracao}</p>
                <p><strong>Alunos inscritos:</strong> {curso.total_alunos || 0}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Alunos por Curso</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={graficoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nome" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="alunos" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default PagInstrutor;
