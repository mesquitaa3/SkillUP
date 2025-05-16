// src/pages/CursoAlunoDetalhes.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/cursoAluno.css";

const CursoAlunoDetalhes = () => {
  const { id } = useParams(); // ID do curso
  const [curso, setCurso] = useState(null);
  const [tab, setTab] = useState("detalhes");
  const [tarefas, setTarefas] = useState([]);
  const [ficheiros, setFicheiros] = useState([]);
  const [exerciciosPorTarefa, setExerciciosPorTarefa] = useState({});
  const [selectedRespostas, setSelectedRespostas] = useState({});
  const [respostasCorretas, setRespostasCorretas] = useState({});

  const alunoId = localStorage.getItem("alunoId");

  useEffect(() => {
    axios.get(`http://localhost:3001/api/aluno/curso/${id}?alunoId=${alunoId}`)
      .then(res => {
        setCurso(res.data.curso);
        setTarefas(res.data.tarefas);
        setFicheiros(res.data.ficheiros);
      })
      .catch(err => {
        console.error("Erro ao carregar curso:", err.response?.data || err.message);
      });
  }, [id, alunoId]);

  useEffect(() => {
    tarefas.forEach(tarefa => {
      axios.get(`http://localhost:3001/api/tarefa/${tarefa.id}/exercicios`)
        .then(res => {
          setExerciciosPorTarefa(prev => ({ ...prev, [tarefa.id]: res.data }));
        })
        .catch(err => console.error("Erro ao procurar exercícios:", err));
    });
  }, [tarefas]);

  const handleSubmeterResposta = (e, exercicio, opcaoId) => {
    e.preventDefault();
    if (!opcaoId) return;

    axios.post("http://localhost:3001/api/responder", {
      alunoId,
      exercicioId: exercicio.id,
      opcaoId
    })
      .then(res => {
        const correta = res.data.correta;
        setRespostasCorretas(prev => ({ ...prev, [exercicio.id]: correta }));
        alert(correta ? "Resposta correta!" : "Resposta errada. Tente novamente.");
      })
      .catch(err => console.error("Erro ao submeter resposta:", err));
  };

  if (!curso) return <div>A carregar...</div>;

  return (
    <div className="curso-aluno-container">
      <h2>{curso.titulo}</h2>

      <div className="tabs">
        <button className={tab === "detalhes" ? "active" : ""} onClick={() => setTab("detalhes")}>Detalhes</button>
        <button className={tab === "tarefas" ? "active" : ""} onClick={() => setTab("tarefas")}>Tarefas</button>
        <button className={tab === "ficheiros" ? "active" : ""} onClick={() => setTab("ficheiros")}>Materiais</button>
      </div>

      <div className="conteudo-tab">
        {tab === "detalhes" && (
          <div>
            <p><strong>Instrutor:</strong> {curso.nome_instrutor}</p>
            <p><strong>Duração:</strong> {curso.duracao}</p>
            <p><strong>Descrição:</strong> {curso.descricao}</p>
          </div>
        )}

        {tab === "tarefas" && (
          <div>
            {tarefas.map(tarefa => (
              <div key={tarefa.id} className="tarefa-box">
                <h4>{tarefa.titulo}</h4>
                <p>{tarefa.descricao}</p>

                {exerciciosPorTarefa[tarefa.id] && (
                  <div className="exercicios-box">
                    <h5>Exercícios</h5>
                    {exerciciosPorTarefa[tarefa.id].map((ex, index) => {
                      const anteriorCorreto = index === 0 || respostasCorretas[exerciciosPorTarefa[tarefa.id][index - 1].id];
                      return (
                        <div key={ex.id} className="exercicio">
                          <p><strong>{ex.pergunta}</strong></p>
                          {anteriorCorreto ? (
                            <form onSubmit={(e) => handleSubmeterResposta(e, ex, selectedRespostas[ex.id])}>
                              {ex.opcoes.map(op => (
                                <label key={op.id} style={{
                                  display: 'block',
                                  color: respostasCorretas[ex.id] !== undefined
                                    ? op.id === selectedRespostas[ex.id]
                                      ? respostasCorretas[ex.id] && op.correta ? 'green' : 'red'
                                      : 'black'
                                    : 'black'
                                }}>
                                  <input
                                    type="radio"
                                    name={`exercicio-${ex.id}`}
                                    value={op.id}
                                    disabled={respostasCorretas[ex.id]}
                                    checked={selectedRespostas[ex.id] === op.id}
                                    onChange={() => setSelectedRespostas(prev => ({
                                      ...prev,
                                      [ex.id]: op.id
                                    }))}
                                  />
                                  {op.texto}
                                </label>
                              ))}
                              <br />
                              <button type="submit" disabled={respostasCorretas[ex.id]}>Submeter Resposta</button>
                            </form>
                          ) : (
                            <p>Precisa de acertar o exercicio para desbloquear o próximo!</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === "ficheiros" && (
          <div>
            <h4>Ficheiros do Curso</h4>
            <ul>
              {ficheiros.map(f => (
                <li key={f.id}>
                  <a href={`http://localhost:3001/uploads/ficheiros/${f.nome_ficheiro}`} target="_blank" rel="noreferrer">
                    {f.nome_ficheiro}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CursoAlunoDetalhes;
