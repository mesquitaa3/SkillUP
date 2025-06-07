// VisualizarCursoInstrutor.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/cursoInstrutor.css";

function VisualizarCursoInstrutor() {
  const { id } = useParams();
  const [tab, setTab] = useState("detalhes");
  const [curso, setCurso] = useState(null);
  const [editandoCurso, setEditandoCurso] = useState(false);
  const [cursoEditado, setCursoEditado] = useState({ titulo: "", descricao: "", duracao: "" });
  const [tarefas, setTarefas] = useState([]);
  const [ficheiros, setFicheiros] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState({ titulo: "", descricao: "" });
  const [tarefaEditandoId, setTarefaEditandoId] = useState(null);
  const [tarefaEditada, setTarefaEditada] = useState({ titulo: "", descricao: "" });
  const [ficheiro, setFicheiro] = useState(null);
  const [tipoFicheiro, setTipoFicheiro] = useState("curso");
  const [tarefaFicheiro, setTarefaFicheiro] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState("");
  const [opcoes, setOpcoes] = useState([{ texto_opcao: "", correta: false }]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState("");
  const [exercicios, setExercicios] = useState([]);
  const [tarefaExercicios, setTarefaExercicios] = useState("");

  useEffect(() => {
    carregarCurso();
  }, [id]);

  const carregarCurso = () => {
    axios.get(`http://localhost:3001/api/instrutor/curso/${id}`).then(res => {
      setCurso(res.data);
      setCursoEditado({
        titulo: res.data.titulo,
        duracao: res.data.duracao,
        descricao: res.data.descricao
      });
      setTarefas(res.data.tarefas || []);
      setFicheiros(res.data.ficheiros || []);
    });

    axios.get(`http://localhost:3001/api/instrutor/curso/${id}/alunos`)
      .then(res => setAlunos(res.data))
      .catch(err => console.error("Erro ao carregar alunos:", err));
  };

  const handleEditarCurso = () => {
    axios.put(`http://localhost:3001/api/instrutor/curso/${id}`, cursoEditado).then(() => {
      setEditandoCurso(false);
      carregarCurso();
    });
  };

  const handleAdicionarTarefa = () => {
    axios.post(`http://localhost:3001/api/instrutor/curso/${id}/tarefas`, novaTarefa).then(() => {
      setNovaTarefa({ titulo: "", descricao: "" });
      carregarCurso();
    });
  };

  const handleEditarTarefa = (tarefaId) => {
    axios.put(`http://localhost:3001/api/instrutor/curso/${id}/tarefas/${tarefaId}`, tarefaEditada).then(() => {
      setTarefaEditandoId(null);
      setTarefaEditada({ titulo: "", descricao: "" });
      carregarCurso();
    });
  };

  const handleApagarTarefa = (tarefaId) => {
    axios.delete(`http://localhost:3001/api/instrutor/curso/${id}/tarefas/${tarefaId}`).then(() => carregarCurso());
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ficheiro", ficheiro);
    formData.append("tipo", tipoFicheiro);
    if (tipoFicheiro === "tarefa") formData.append("tarefa_id", tarefaFicheiro);

    axios.post(`http://localhost:3001/api/instrutor/curso/${id}/upload-ficheiro`, formData).then(() => {
      setFicheiro(null);
      carregarCurso();
    });
  };

  const handleApagarFicheiro = (ficheiroId) => {
    axios.delete(`http://localhost:3001/api/instrutor/curso/${id}/ficheiros/${ficheiroId}`).then(() => carregarCurso());
  };

  const adicionarOpcao = () => {
    setOpcoes([...opcoes, { texto_opcao: "", correta: false }]);
  };

  const removerOpcao = (i) => {
    const novas = [...opcoes];
    novas.splice(i, 1);
    setOpcoes(novas);
  };

  const atualizarOpcao = (i, campo, valor) => {
    const novas = [...opcoes];
    novas[i][campo] = valor;
    setOpcoes(novas);
  };

  const handleCriarExercicio = () => {
    axios.post(`http://localhost:3001/api/instrutor/tarefas/${tarefaSelecionada}/exercicio`, {
      pergunta: novaPergunta,
      opcoes
    }).then(() => {
      setNovaPergunta("");
      setOpcoes([{ texto_opcao: "", correta: false }]);
      setTarefaSelecionada("");
      alert("Exercício criado com sucesso!");
    });
  };

  const carregarExercicios = (tarefaId) => {
    setTarefaExercicios(tarefaId);
    axios.get(`http://localhost:3001/api/instrutor/tarefas/${tarefaId}/exercicios`)
      .then(res => setExercicios(res.data));
  };

  const apagarExercicio = (id) => {
    axios.delete(`http://localhost:3001/api/instrutor/exercicios/${id}`).then(() => carregarExercicios(tarefaExercicios));
  };

  if (!curso) return <div className="loading">📘 A carregar...</div>;

  return (
    <div className="curso-layout">
      <aside className="sidebar">
        <h2>{curso.titulo}</h2>
        <nav>
          <button className={tab === "detalhes" ? "active" : ""} onClick={() => setTab("detalhes")}>📝 Detalhes</button>
          <button className={tab === "tarefas" ? "active" : ""} onClick={() => setTab("tarefas")}>📚 Tarefas</button>
          <button className={tab === "ficheiros" ? "active" : ""} onClick={() => setTab("ficheiros")}>📂 Ficheiros</button>
          <button className={tab === "alunos" ? "active" : ""} onClick={() => setTab("alunos")}>👥 Alunos</button>
        </nav>
      </aside>

      <main className="content">
        {tab === "detalhes" && (
          <section className="card">
            {editandoCurso ? (
              <>
                <input value={cursoEditado.titulo} onChange={e => setCursoEditado({ ...cursoEditado, titulo: e.target.value })} />
                <input value={cursoEditado.duracao} onChange={e => setCursoEditado({ ...cursoEditado, duracao: e.target.value })} />
                <textarea value={cursoEditado.descricao} onChange={e => setCursoEditado({ ...cursoEditado, descricao: e.target.value })} />
                <button onClick={handleEditarCurso}>Guardar</button>
                <button onClick={() => setEditandoCurso(false)}>Cancelar</button>
              </>
            ) : (
              <>
                <p><strong>Duração:</strong> {curso.duracao}</p>
                <p><strong>Descrição:</strong> {curso.descricao}</p>
                <button onClick={() => setEditandoCurso(true)}>Editar</button>
              </>
            )}
          </section>
        )}

        {tab === "tarefas" && (
          <section className="card">
            <h3>📘 Tarefas</h3>

            <div className="form-bloco">
              <input placeholder="Título" value={novaTarefa.titulo} onChange={e => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })} />
              <textarea placeholder="Descrição" value={novaTarefa.descricao} onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })} />
              <button onClick={handleAdicionarTarefa}>Adicionar Tarefa</button>
            </div>

            <ul className="lista-tarefas">
              {tarefas.map(t => (
                <li key={t.id}>
                  {tarefaEditandoId === t.id ? (
                    <>
                      <input value={tarefaEditada.titulo} onChange={e => setTarefaEditada({ ...tarefaEditada, titulo: e.target.value })} />
                      <textarea value={tarefaEditada.descricao} onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })} />
                      <button onClick={() => handleEditarTarefa(t.id)}>Guardar</button>
                      <button onClick={() => setTarefaEditandoId(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <strong>{t.titulo}</strong> — {t.descricao}
                      <br />
                      <div className="botoes-tarefa">
                        <button onClick={() => { setTarefaEditandoId(t.id); setTarefaEditada(t); }}>Editar</button>
                        <button onClick={() => handleApagarTarefa(t.id)}>Apagar</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            <div className="form-bloco">
              <h4>Adicionar Exercício</h4>
              <select value={tarefaSelecionada} onChange={e => setTarefaSelecionada(e.target.value)}>
                <option value="">Selecionar Tarefa</option>
                {tarefas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
              <input placeholder="Pergunta" value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)} />
              {opcoes.map((op, i) => (
                <div key={i}>
                  <div className="opcao-linha">
                    <input
                      type="text"
                      placeholder={`Opção ${i + 1}`}
                      value={op.texto_opcao}
                      onChange={e => atualizarOpcao(i, "texto_opcao", e.target.value)}
                    />
                    <label className="checkbox-opcao">
                      <input
                        type="checkbox"
                        checked={op.correta}
                        onChange={e => atualizarOpcao(i, "correta", e.target.checked)}
                      />
                      Correta
                    </label>
                  </div>

                  {opcoes.length > 1 && <button onClick={() => removerOpcao(i)}>❌</button>}
                </div>
              ))}
              <div className="botoes-exercicio">
                <button onClick={adicionarOpcao}>+ Opção</button>
                <button onClick={handleCriarExercicio}>Guardar Exercício</button>
              </div>
            </div>

            <div className="form-bloco">
              <h4>Ver Exercícios</h4>
              <select value={tarefaExercicios} onChange={e => carregarExercicios(e.target.value)}>
                <option value="">Selecionar Tarefa</option>
                {tarefas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
              <ul>
                {exercicios.map(ex => (
                  <li key={ex.id}>
                    <strong>{ex.pergunta}</strong>
                    <ul>
                      {ex.opcoes.map(op => (
                        <li key={op.id}>{op.correta ? "✅" : "⬜"} {op.texto_opcao}</li>
                      ))}
                    </ul>
                    <button onClick={() => apagarExercicio(ex.id)}>Apagar</button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {tab === "ficheiros" && (
          <section className="card">
            <h3>📂 Ficheiros</h3>

            <form onSubmit={handleUpload}>
              <input type="file" onChange={e => setFicheiro(e.target.files[0])} />
              <select value={tipoFicheiro} onChange={e => setTipoFicheiro(e.target.value)}>
                <option value="curso">Curso</option>
                <option value="tarefa">Tarefa</option>
              </select>
              {tipoFicheiro === "tarefa" && (
                <select value={tarefaFicheiro} onChange={e => setTarefaFicheiro(e.target.value)}>
                  <option value="">Selecionar Tarefa</option>
                  {tarefas.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
                </select>
              )}
              <button type="submit">Enviar</button>
            </form>

            <ul>
              {ficheiros.map(f => (
                <li key={f.id}>
                  {f.tipo} - {f.nome_ficheiro}
                  <div className="ficheiro-botoes">
                    <a href={`http://localhost:3001/uploads/ficheiros/${f.nome_ficheiro}`} target="_blank" rel="noopener noreferrer">
                      <button>Ver</button>
                    </a>
                    <button onClick={() => handleApagarFicheiro(f.id)}>Apagar</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "alunos" && (
          <section className="card">
            <h3>👥 Alunos Inscritos</h3>
            <ul>
              {alunos.map(aluno => (
                <li key={aluno.utilizador_id}>
                  <strong>{aluno.nome}</strong> — {aluno.email}<br />
                  <small>Inscrito em {new Date(aluno.data_inscricao).toLocaleDateString()}</small>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}

export default VisualizarCursoInstrutor;

