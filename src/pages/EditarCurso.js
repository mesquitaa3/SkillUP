// pages/EditarCurso.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditarCurso = () => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [duracao, setDuracao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const { id } = useParams();  // Obtém o ID do curso da URL
  const navigate = useNavigate();

  useEffect(() => {
    // Buscar o curso para edição
    axios.get(`http://localhost:3001/api/cursos/${id}`)
      .then(res => {
        const curso = res.data;
        setTitulo(curso.titulo);
        setDescricao(curso.descricao);
        setDuracao(curso.duracao);
        setPreco(curso.preco);
        setImagem(curso.imagem);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar curso:', err);
        setErro('Erro ao carregar os dados do curso.');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cursoData = { titulo, descricao, duracao, preco, imagem };

    try {
      const response = await axios.put(`http://localhost:3001/api/instrutor/editar-curso/${id}`, cursoData);
      console.log('Curso atualizado com sucesso:', response.data);
      alert('Curso atualizado com sucesso!');
      navigate('/instrutor/cursos');  // Redireciona para a lista de cursos
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      alert('Erro ao atualizar o curso.');
    }
  };

  if (loading) {
    return <p>Carregando curso...</p>;
  }

  return (
    <div className="editar-curso-container">
      <h2>Editar Curso</h2>
      {erro && <p className="erro">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          type="text"
          placeholder="Duração (ex: 1 mês, 3 meses)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
        />
        <input
          type="text"
          placeholder="Preço (€)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL da imagem"
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
        />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditarCurso;
