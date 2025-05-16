// pages/CursoDetalhes.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/cursos.css';

const CursoDetalhes = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  //carregar os detalhes do curso
  useEffect(() => {
    axios.get(`http://localhost:3001/api/cursos/${id}`)
      .then(res => {
        setCurso(res.data);
        setCarregando(false);
      })
      .catch(err => {
        console.error('Erro ao procurar os detalhes do curso:', err);
        setCarregando(false);
      });
  }, [id]);

  //se os detalhes estiverem a carregar, exibe a seguinte mensagem
  if (carregando) return <p>A carregar...</p>;

  //se o curso não for encontrado, exibe a seguinte mensagem
  if (!curso) return <p>Curso não encontrado.</p>;

  //redirecionar para a pagina de pagamento
  const handleInscrever = () => {
    navigate(`/aluno/pagamento?cursoId=${id}`);
  };
  

  return (
    <div className="curso-detalhes-container">
      <h2 className="titulo-curso-detalhes">{curso.titulo}</h2>
      <img className="img-curso-detalhes" src={curso.imagem
                  ? `http://localhost:3001/uploads/${curso.imagem}`
                  : "https://placehold.co/250x150"} alt={curso.titulo} />
      <p><strong>Descrição:</strong> {curso.descricao}</p>
      <p><strong>Duração:</strong> {curso.duracao}</p>
      <p><strong>Instrutor:</strong> {curso.instrutor_nome || "Desconhecido"}</p>
      <p><strong>Preço:</strong> {curso.preco} €</p>

      <button className="btn btn-success" onClick={handleInscrever}>Inscrever no Curso</button>
    </div>
  );
};

export default CursoDetalhes;
