// src/pages/CursosInscritosAluno.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/cursos.css";

const CursosInscritosAluno = () => {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();
  const alunoId = localStorage.getItem("alunoId");

  useEffect(() => {
    if (!alunoId) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3001/api/aluno/${alunoId}/inscricoes`)
      .then((res) => setCursos(res.data))
      .catch((err) => console.error("Erro ao procurar cursos inscritos:", err));
  }, [alunoId, navigate]);

  return (
    <div className="cursos-page">
      <h1 className="h1cursos">Os meus Cursos</h1>

      {cursos.length === 0 ? (
        <p>Não estás inscrito em nenhum curso.</p>
      ) : (
        <div className="cursos-lista">
          {cursos.map((curso) => (
            <div key={curso.id} className="curso-card">
              <img
                src={
                  curso.imagem
                    ? `http://localhost:3001/uploads/${curso.imagem}`
                    : "https://placehold.co/250x150"
                }
                alt={curso.titulo}
              />
              <h3>{curso.titulo}</h3>
              <p>{curso.descricao}</p>
              <p><strong>Duração:</strong> {curso.duracao}</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/aluno/curso-detalhes/${curso.id}`)}
              >
                Ver Curso
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CursosInscritosAluno;
