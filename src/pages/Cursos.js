import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/cursos.css";

const Cursos = () => {
  const [cursos, setCursos] = useState([]); // Estado para armazenar os cursos
  const [loading, setLoading] = useState(true); // Estado para verificar se os cursos estão a ser carregados

  useEffect(() => {
    // Fazer a requisição para a API do backend para obter os cursos
    axios
      .get('http://localhost:3001/api/cursos') // A URL do backend
      .then((response) => {
        setCursos(response.data); // Atualizar o estado com os cursos retornados
        setLoading(false); // Marcar como carregado
      })
      .catch((error) => {
        console.error('Erro ao buscar os cursos:', error);
        setLoading(false); // Marcar como carregado mesmo em caso de erro
      });
  }, []); // O array vazio faz a requisição ser feita apenas uma vez quando o componente for montado

  if (loading) {
    return <div>Carregando cursos...</div>;
  }

  return (
    <>
      <div className="cursos-page">
        <h1 className="h1cursos">Cursos</h1>
        <div className="cursos-lista">
          {cursos.map((curso) => (
            <div key={curso.id} className="curso-card">
              <img
                src={curso.imagem || "https://placehold.co/250x150"} // Garantir que tenha uma imagem de fallback
                alt={curso.titulo}
              />
              <h3>{curso.titulo}</h3>
              <p>{curso.descricao}</p>
              <p>
                <strong>Duração:</strong> {curso.duracao}
              </p>
              <button className="btn btn-primary">Ver mais</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Cursos;
