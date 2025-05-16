import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/styles/cursos.css";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/cursos")
      .then((response) => {
        setCursos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao procurar cursos:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>A carregar os cursos...</div>;
  }

  return (
    <div className="cursos-page">
      <h1 className="h1cursos">Cursos</h1>
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
              className="curso-imagem"
            />
            <h3>{curso.titulo}</h3>
            <p><strong>Descrição:</strong> {curso.descricao}</p>
            <p>
              <strong>Duração: </strong> {curso.duracao} <strong>Horas</strong>
            </p>
            <p> <strong>Preço: </strong> {curso.preco} <strong>€</strong></p>
            <button className="btn btn-primary">Ver mais</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cursos;
