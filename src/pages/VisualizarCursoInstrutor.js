import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VisualizarCursoInstrutor = () => {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState({ titulo: '', descricao: '', ficheiro: null });

  useEffect(() => {
    axios.get(`http://localhost:3001/api/instrutor/curso/${id}`)
      .then(res => setCurso(res.data))
      .catch(err => console.error('Erro ao carregar curso:', err));

    axios.get(`http://localhost:3001/api/instrutor/curso/${id}/tarefas`)
      .then(res => setTarefas(res.data))
      .catch(err => console.error('Erro ao carregar tarefas:', err));
  }, [id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNovaTarefa({ ...novaTarefa, [name]: value });
  };

  const handleFileChange = e => {
    setNovaTarefa({ ...novaTarefa, ficheiro: e.target.files[0] });
  };

  const handleAdicionarTarefa = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('titulo', novaTarefa.titulo);
    formData.append('descricao', novaTarefa.descricao);
    if (novaTarefa.ficheiro) {
      formData.append('ficheiro', novaTarefa.ficheiro);
    }

    try {
      await axios.post(`http://localhost:3001/api/instrutor/curso/${id}/tarefa`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNovaTarefa({ titulo: '', descricao: '', ficheiro: null });
      const res = await axios.get(`http://localhost:3001/api/instrutor/curso/${id}/tarefas`);
      setTarefas(res.data);
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  if (!curso) return <p>A carregar curso...</p>;

  return (
    <div className="visualizar-curso-container">
      <h2>{curso.titulo}</h2>
      <p><strong>Descrição:</strong> {curso.descricao}</p>
      <p><strong>Duração:</strong> {curso.duracao}</p>

      <h3>Adicionar Tarefa</h3>
      <form onSubmit={handleAdicionarTarefa}>
        <input type="text" name="titulo" placeholder="Título" value={novaTarefa.titulo} onChange={handleInputChange} required />
        <textarea name="descricao" placeholder="Descrição" value={novaTarefa.descricao} onChange={handleInputChange} required />
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="btn btn-success">Adicionar</button>
      </form>

      <h3>Tarefas</h3>
      <ul>
        {tarefas.map(tarefa => (
          <li key={tarefa.id}>
            <strong>{tarefa.titulo}</strong> - {tarefa.descricao}
            {tarefa.ficheiro && (
              <div>
                <a href={`http://localhost:3001/uploads/${tarefa.ficheiro}`} target="_blank" rel="noopener noreferrer">
                  Ver ficheiro
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisualizarCursoInstrutor;
