// CursoAlunoDetalhes.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/cursoAlunoDetalhes.css";

const CursoAlunoDetalhes = () => {
  const { id } = useParams();
  const [tab, setTab] = useState("detalhes");
  const [curso, setCurso] = useState(null);
  const [tarefas, setTarefas] = useState([]);
  const [ficheiros, setFicheiros] = useState([]);
  const [exerciciosPorTarefa, setExerciciosPorTarefa] = useState({});
  const [respostasCorretas, setRespostasCorretas] = useState({});
  const [selectedRespostas, setSelectedRespostas] = useState({});

  const alunoId = localStorage.getItem("alunoId");

  useEffect(() => {
    axios.get(`http://localhost:3001/api/aluno/curso/${id}?alunoId=${alunoId}`)
      .then(res => {
        setCurso(res.data.curso);
        setTarefas(res.data.tarefas);
        setFicheiros(res.data.ficheiros);
      })
      .catch(err => console.error(err));
  }, [id, alunoId]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/aluno/${alunoId}/respostas`)
      .then(res => {
        const mapa = {};
        res.data.respostas.forEach(r => {
          mapa[r.exercicioId] = r.correta;
        });
        setRespostasCorretas(mapa);
      })
      .catch(err => console.error("Erro ao buscar progresso:", err));
  }, [alunoId]);

  useEffect(() => {
    tarefas.forEach(tarefa => {
      axios.get(`http://localhost:3001/api/tarefa/${tarefa.id}/exercicios`)
        .then(res => {
          setExerciciosPorTarefa(prev => ({ ...prev, [tarefa.id]: res.data }));
        })
        .catch(err => console.error(err));
    });
  }, [tarefas]);

  const handleSubmit = (e, exercicio, opcaoId) => {
    e.preventDefault();
    if (!opcaoId) return;

    axios.post("http://localhost:3001/api/responder", {
      alunoId,
      exercicioId: exercicio.id,
      opcaoId
    }).then(res => {
      setRespostasCorretas(prev => ({ ...prev, [exercicio.id]: res.data.correta }));
    });
  };

  const handleReiniciarCurso = () => {
    if (!window.confirm("Tem a certeza que deseja reiniciar TODO o curso?")) return;

    axios.delete(`http://localhost:3001/api/responder/curso/${id}/aluno/${alunoId}`)
      .then(() => {
        setRespostasCorretas({});
        setSelectedRespostas({});
      })
      .catch(err => console.error("Erro ao reiniciar curso:", err));
  };

  if (!curso) return <div className="loading">📘 A carregar o curso...</div>;

  return (
    <div className="curso-layout">
      <aside className="sidebar">
        <h2>{curso.titulo}</h2>
        <nav>
          <button onClick={() => setTab("detalhes")} className={tab === "detalhes" ? "active" : ""}>📝 Detalhes</button>
          <button onClick={() => setTab("tarefas")} className={tab === "tarefas" ? "active" : ""}>📚 Tarefas</button>
          <button onClick={() => setTab("ficheiros")} className={tab === "ficheiros" ? "active" : ""}>📂 Materiais</button>
        </nav>
      </aside>

      <main className="content">
        {tab === "detalhes" && (
          <section className="detalhe-panel">
            <h3>📘 Informações do Curso</h3>
            <div className="detalhe-grid">
              <div className="detalhe-item">
                <span className="detalhe-label">Instrutor:</span>
                <span>{curso.nome_instrutor}</span>
              </div>
              <div className="detalhe-item">
                <span className="detalhe-label">Duração:</span>
                <span>{curso.duracao}</span>
              </div>
              <div className="detalhe-item detalhe-descricao">
                <span className="detalhe-label">Descrição:</span>
                <p>{curso.descricao}</p>
              </div>
            </div>
          </section>
        )}

        {tab === "tarefas" && (
          <section>
            {(() => {
              const totalEx = tarefas.flatMap(t => exerciciosPorTarefa[t.id] || []);
              const totalRespondidos = totalEx.filter(ex => respostasCorretas[ex.id]).length;
              const progressoGlobal = (totalRespondidos / totalEx.length) * 100 || 0;

              return (
                <div className="progresso-global">
                  <p><strong>Progresso Global:</strong> {totalRespondidos} de {totalEx.length} exercícios concluídos</p>
                  <div className="barra-externa">
                    <div className="barra-interna" style={{ width: `${progressoGlobal}%` }} />
                  </div>
                  <button className="reiniciar-btn" onClick={handleReiniciarCurso}>
                    🔄 Reiniciar Curso
                  </button>
                </div>
              );
            })()}

            {tarefas.map((tarefa, tarefaIndex) => {
              const exercicios = exerciciosPorTarefa[tarefa.id] || [];
              const respondidos = exercicios.filter(ex => respostasCorretas[ex.id]).length;
              const desbloqueada = tarefaIndex === 0 || tarefas.slice(0, tarefaIndex).every(t => {
                const exs = exerciciosPorTarefa[t.id] || [];
                return exs.length > 0 && exs.every(ex => respostasCorretas[ex.id]);
              });

              if (!desbloqueada) return null;

              return (
                <div key={tarefa.id} className="card tarefa-panel">
                  <div className="tarefa-header">
                    <div>
                      <h4>{tarefa.titulo}</h4>
                      <p>{tarefa.descricao}</p>
                      <small>{exercicios.length} exercício(s) | {respondidos} concluído(s)</small>
                    </div>
                    <div className="tarefa-progresso">
                      <div style={{ width: `${(respondidos / exercicios.length) * 100 || 0}%` }} />
                    </div>
                  </div>

                  {exercicios.map((ex, index) => {
                    const desbloqueado = index === 0 || respostasCorretas[exercicios[index - 1].id];
                    const status = respostasCorretas[ex.id] ? "✅" : desbloqueado ? "🕒" : "🔒";

                    return (
                      <div key={ex.id} className="exercicio-card">
                        <div className="exercicio-header">
                          <span className="exercicio-status">{status}</span>
                          <h5>{ex.pergunta}</h5>
                        </div>

                        {respostasCorretas[ex.id] === true ? (
                          <div className="resposta-final correta">
                            <p>✅ Resposta correta!</p>
                            {ex.opcoes.map(op => (
                              op.correta && (
                                <div key={op.id} className="resposta-correta">
                                  ✅ {op.texto}
                                </div>
                              )
                            ))}
                          </div>
                        ) : desbloqueado ? (
                          <form onSubmit={(e) => handleSubmit(e, ex, selectedRespostas[ex.id])}>
                            <div className="opcoes">
                              {ex.opcoes.map(op => (
                                <label
                                  key={op.id}
                                  className={`opcao ${op.id === selectedRespostas[ex.id] ? "selecionada" : ""}`}
                                >
                                  <input
                                    type="radio"
                                    name={`ex-${ex.id}`}
                                    value={op.id}
                                    checked={selectedRespostas[ex.id] === op.id}
                                    onChange={() => setSelectedRespostas(prev => ({ ...prev, [ex.id]: op.id }))}
                                  />
                                  {op.texto}
                                </label>
                              ))}
                            </div>
                            <button type="submit">Responder</button>
                          </form>
                        ) : (
                          <p className="bloqueado">🔒 Responda corretamente ao exercício anterior.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </section>
        )}

        {tab === "ficheiros" && (
          <section className="card ficheiro-card">
            <h3>📂 Materiais do Curso</h3>
            <ul className="ficheiros-grid">
              {ficheiros.map(f => (
                <li key={f.id} className="ficheiro-item">
                  <span className="ficheiro-icone">📄</span>
                  <a href={`http://localhost:3001/uploads/ficheiros/${f.nome_ficheiro}`} target="_blank" rel="noreferrer">
                    {f.nome_ficheiro}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default CursoAlunoDetalhes;
