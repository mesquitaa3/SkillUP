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
  if (!tarefaSelecionada) {
    alert("Por favor, selecione uma tarefa para adicionar o exercício.");
    return;
  }

  const url = `http://localhost:3001/api/instrutor/tarefas/${tarefaSelecionada}/exercicio`;
  console.log("URL da requisição:", url);  // Verifique a URL no console

  axios.post(url, {
    pergunta: novaPergunta,
    opcoes
  }).then(() => {
    setNovaPergunta("");
    setOpcoes([{ texto_opcao: "", correta: false }]);
    setTarefaSelecionada(""); // Resetando a seleção após a criação do exercício
    alert("Exercício criado com sucesso!");
  }).catch(error => {
    console.error("Erro ao criar exercício:", error);
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

  if (!curso) return <div className="loading">A carregar...</div>;

  return (
    <div className="curso-layout">
      <aside className="sidebar-instrutor">
        <h2>{curso.titulo}</h2>
        <nav>
          <button className={tab === "detalhes" ? "active" : ""} onClick={() => setTab("detalhes")}>Detalhes</button>
          <button className={tab === "tarefas" ? "active" : ""} onClick={() => setTab("tarefas")}>Tarefas</button>
          <button className={tab === "ficheiros" ? "active" : ""} onClick={() => setTab("ficheiros")}>Ficheiros</button>
          <button className={tab === "alunos" ? "active" : ""} onClick={() => setTab("alunos")}>Alunos</button>
        </nav>
      </aside>

      <main className="content">
        {tab === "detalhes" && (
  <section className="card">
    {editandoCurso ? (
      <>
        <label htmlFor="titulo">Título do Curso:</label>
        <input
          id="titulo"
          value={cursoEditado.titulo}
          onChange={e => setCursoEditado({ ...cursoEditado, titulo: e.target.value })}
          placeholder="Exemplo: Curso de Programação"
        />
        
        <label htmlFor="descricao">Descrição:</label>
        <textarea
          id="descricao"
          value={cursoEditado.descricao}
          onChange={e => setCursoEditado({ ...cursoEditado, descricao: e.target.value })}
          placeholder="Exemplo: Curso completo para aprender a programar"
        />

        <label htmlFor="duracao">Duração:</label>
        <input
          id="duracao"
          value={cursoEditado.duracao}
          onChange={e => setCursoEditado({ ...cursoEditado, duracao: e.target.value })}
          placeholder="Exemplo: 10 Horas"
        />

        <label htmlFor="preco">Preço:</label>
        <input
          id="preco"
          type="text"
          value={cursoEditado.preco}
          onChange={e => {
            const valor = e.target.value;
            // Remover caracteres não numéricos, exceto ponto para decimais
            const precoSemSimbolo = valor.replace(/[^\d,.-]/g, '').replace(',', '.');
            setCursoEditado({ ...cursoEditado, preco: precoSemSimbolo });
          }}
          placeholder="Exemplo: 100 €"
        />

        <button onClick={handleEditarCurso}>Guardar</button>
        <button onClick={() => setEditandoCurso(false)}>Cancelar</button>
      </>
    ) : (
      <>
        <p><strong>Título do Curso:</strong> {curso.titulo}</p>
        <p><strong>Descrição:</strong> {curso.descricao}</p>
        <p><strong>Duração:</strong> {curso.duracao}</p>
        <p><strong>Preço:</strong> {curso.preco} €</p>
        <button onClick={() => setEditandoCurso(true)}>Editar</button>
      </>
    )}
  </section>
)}


        {tab === "tarefas" && (
  <section className="card-tarefas">
    <h3 className="section-title-tarefas">Tarefas</h3>

    {/* Formulário para adicionar uma nova tarefa */}
    <div className="form-bloco-tarefas">
      <h4 className="form-subtitle-tarefas">Adicionar Tarefa</h4>
      <input
        placeholder="Título da Tarefa"
        value={novaTarefa.titulo}
        onChange={e => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
        className="input-field-tarefas"
      />
      <textarea
        placeholder="Descrição da Tarefa"
        value={novaTarefa.descricao}
        onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
        className="textarea-field-tarefas"
      />
      <button onClick={handleAdicionarTarefa} className="button-primary-tarefas">Adicionar Tarefa</button>
    </div>

    {/* Lista de tarefas existentes */}
    <ul className="lista-tarefas-tarefas">
      {tarefas.map(t => (
        <li key={t.id} className="task-item-tarefas">
          {tarefaEditandoId === t.id ? (
            <div className="task-edit-tarefas">
              <input
                value={tarefaEditada.titulo}
                onChange={e => setTarefaEditada({ ...tarefaEditada, titulo: e.target.value })}
                className="input-field-tarefas"
              />
              <textarea
                value={tarefaEditada.descricao}
                onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })}
                className="textarea-field-tarefas"
              />
              <div className="button-group-tarefas">
                <button onClick={() => handleEditarTarefa(t.id)} className="button-primary-tarefas">Guardar</button>
                <button onClick={() => setTarefaEditandoId(null)} className="button-secondary-tarefas">Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="task-view-tarefas">
              <strong>{t.titulo}</strong> — {t.descricao}
              <div className="button-group-tarefas">
                <button onClick={() => { setTarefaEditandoId(t.id); setTarefaEditada(t); }} className="button-edit-tarefas">Editar</button>
                <button onClick={() => handleApagarTarefa(t.id)} className="button-delete-tarefas">Apagar</button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>

    {/* Formulário para adicionar um exercício */}
<div className="form-bloco-tarefas">
  <h4 className="form-subtitle-tarefas">Adicionar Exercício</h4>
  <select
  value={tarefaSelecionada}
  onChange={e => setTarefaSelecionada(e.target.value)}
  className="select-field-tarefas"
>
  <option value="">Selecionar Tarefa</option>
  {tarefas.map(t => (
    <option key={t.id} value={t.id}>{t.titulo}</option>
  ))}
</select>
  <input
    placeholder="Pergunta do Exercício"
    value={novaPergunta}
    onChange={e => setNovaPergunta(e.target.value)}
    className="input-field-tarefas"
  />
  {opcoes.map((op, i) => (
    <div key={i} className="option-row-tarefas">
      <input
        type="text"
        placeholder={`Opção ${i + 1}`}
        value={op.texto_opcao}
        onChange={e => atualizarOpcao(i, "texto_opcao", e.target.value)}
        className="input-field-tarefas"
      />
      <div className="checkbox-container-tarefas">
        <input
          type="checkbox"
          checked={op.correta}
          onChange={e => atualizarOpcao(i, "correta", e.target.checked)}
          className="checkbox-tarefas"
        />
        <span className="checkbox-label-tarefas">Correta</span>
      </div>
      {opcoes.length > 1 && <button onClick={() => removerOpcao(i)} className="button-remove-tarefas">❌</button>}
    </div>
  ))}
  <div className="button-group-tarefas">
    <button onClick={adicionarOpcao} className="button-secondary-tarefas">+ Opção</button>
    <button onClick={handleCriarExercicio} className="button-primary-tarefas">Guardar Exercício</button>
  </div>
</div>

    {/* Lista de exercícios */}
    <div className="form-bloco-tarefas">
      <h4 className="form-subtitle-tarefas">Ver Exercícios</h4>
      <select
        value={tarefaExercicios}
        onChange={e => carregarExercicios(e.target.value)}
        className="select-field-tarefas"
      >
        <option value="">Selecionar Tarefa</option>
        {tarefas.map(t => (
          <option key={t.id} value={t.id}>{t.titulo}</option>
        ))}
      </select>
      <ul>
        {exercicios.map(ex => (
          <li key={ex.id} className="exercise-item-tarefas">
            <strong>{ex.pergunta}</strong>
            <ul>
              {ex.opcoes.map(op => (
                <li key={op.id}>
                  {op.correta ? "✅" : "⬜"} {op.texto_opcao}
                </li>
              ))}
            </ul>
            <button onClick={() => apagarExercicio(ex.id)} className="button-delete-tarefas">Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  </section>
)}


        {tab === "ficheiros" && (
  <section className="card-ficheiros">
    <h3 className="card-title-ficheiros">Ficheiros</h3>

    <form onSubmit={handleUpload} className="form-ficheiros">
      <input 
        type="file" 
        onChange={e => setFicheiro(e.target.files[0])} 
        className="input-file-ficheiros"
      />
      <button type="submit" className="button-submit-ficheiros">Enviar</button>
    </form>

    <ul className="list-ficheiros">
      {ficheiros.map(f => (
        <li key={f.id} className="file-item-ficheiros">
          <div className="file-info-ficheiros">
            <span className="file-type-ficheiros">{f.tipo}</span> - <span className="file-name-ficheiros">{f.nome_ficheiro}</span>
          </div>
          <div className="file-buttons-ficheiros">
            <a href={`http://localhost:3001/uploads/ficheiros/${f.nome_ficheiro}`} target="_blank" rel="noopener noreferrer">
              <button className="button-view-ficheiros">Ver</button>
            </a>
            <button onClick={() => handleApagarFicheiro(f.id)} className="button-delete-ficheiros">Apagar</button>
          </div>
        </li>
      ))}
    </ul>
  </section>
)}


        {tab === "alunos" && (
          <section className="card">
            <h3>Alunos Inscritos</h3>
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

