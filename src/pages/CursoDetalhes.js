// pages/CursoDetalhes.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/cursos.css';

const CursoDetalhes = () => {
  const { id } = useParams(); // Pega o ID do curso da URL
  const [curso, setCurso] = useState(null); // Estado para armazenar os dados do curso
  const [carregando, setCarregando] = useState(true); // Estado para indicar carregamento
  const navigate = useNavigate(); // Função de navegação

  // Carregar os detalhes do curso ao carregar a página
  useEffect(() => {
    axios.get(`http://localhost:3001/api/cursos/${id}`)
      .then(res => {
        setCurso(res.data); // Atualiza o estado com os dados do curso
        setCarregando(false); // Fim do carregamento
      })
      .catch(err => {
        console.error('Erro ao buscar detalhes do curso:', err);
        setCarregando(false); // Fim do carregamento, mesmo com erro
      });
  }, [id]); // Reexecuta quando o ID do curso mudar

  // Se estiver carregando, exibe uma mensagem
  if (carregando) return <p>A carregar...</p>;

  // Se o curso não for encontrado, exibe uma mensagem de erro
  if (!curso) return <p>Curso não encontrado.</p>;

  // Função para redirecionar para a página de pagamento
  const handleInscrever = () => {
    navigate(`/aluno/pagamento?cursoId=${id}`);
  };
  

  return (
    <div className="curso-detalhes-container">
      <h2>{curso.titulo}</h2>
      <img src={curso.imagem || "https://placehold.co/400x200"} alt={curso.titulo} />
      <p><strong>Descrição:</strong> {curso.descricao}</p>
      <p><strong>Duração:</strong> {curso.duracao}</p>
      <p><strong>Instrutor:</strong> {curso.instrutor_nome || "Desconhecido"}</p>

      {/* Botão de inscrição que redireciona para a página de pagamento */}
      <button className="btn btn-success" onClick={handleInscrever}>Inscrever</button>
    </div>
  );
};

export default CursoDetalhes;
