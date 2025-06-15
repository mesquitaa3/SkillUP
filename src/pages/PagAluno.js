// src/pages/PagAluno.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/aluno.css"; // CSS para o aluno

const PagAluno = () => {
  const [cursos, setCursos] = useState([]);
  const [horasEstudo, setHorasEstudo] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const sessionExpiration = localStorage.getItem("sessionExpiration");

    // Verificando se a sessão está expirada ou se o papel do usuário não é 'aluno'
    if (!role || !sessionExpiration || new Date().getTime() > sessionExpiration) {
      localStorage.removeItem("userRole");
      localStorage.removeItem("sessionExpiration");
      navigate("/login");
    } else if (role !== "aluno") {
      navigate("/login");
    }

    // Função para carregar os cursos do aluno
    const carregarCursos = async () => {
      try {
        const alunoId = localStorage.getItem("alunoId"); // Pegando o id do aluno do localStorage
        if (!alunoId) {
          navigate("/login");
          return;
        }

        const token = localStorage.getItem("authToken"); // Supondo que você tenha armazenado o token no localStorage

        const response = await axios.get(`http://localhost:3001/api/aluno/${alunoId}/cursos`, {
          headers: {
            Authorization: `Bearer ${token}`, // Passando o token de autenticação
          },
        });

        console.log("Cursos carregados:", response.data); // Verifique se os cursos são retornados corretamente
        setCursos(response.data);

        // Somar as horas de todos os cursos (supondo que "duracao" seja um número)
        const totalHoras = response.data.reduce((acc, curso) => {
          const duracao = parseFloat(curso.duracao) || 0;  // Verifica e soma a duração do curso
          return acc + duracao;
        }, 0);
        setHorasEstudo(totalHoras);
      } catch (error) {
        console.error("Erro ao carregar os cursos:", error);
      }
    };

    carregarCursos();
  }, [navigate]);

  const progressoTotal = () => {
    
    return cursos.length > 0 ? 72 : 0;
  };

  return (
    <div className="pag-aluno-container">
      <h2 className="pag-aluno-title">Bem-vindo de volta, Aluno!</h2>

      <div className="info-cards">
        <div className="card">
          <h3>Cursos Adquiridos</h3>
          <p>{cursos.length} cursos ativos</p>
        </div>
        <div className="card">
          <h3>Progresso Total</h3>
          <p>{progressoTotal()}% completo</p>
        </div>
        <div className="card">
          <h3>Horas de Estudo</h3>
          <p>{horasEstudo}h no total</p>
        </div>
      </div>

      <div className="graficos-section">
        <h3>Desempenho em Gráficos</h3>
        <div className="grafico-placeholder">
          {/* Barra de progresso */}
          <div className="progress-bar" style={{ width: `${progressoTotal()}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default PagAluno;
