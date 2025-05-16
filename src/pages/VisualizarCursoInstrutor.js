import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/instrutor.css';

function VisualizarCursoInstrutor() {
  const { id } = useParams();
  const [tab, setTab] = useState('detalhes');
  const [curso, setCurso] = useState(null);
  const [editandoCurso, setEditandoCurso] = useState(false);
  const [cursoEditado, setCursoEditado] = useState({ titulo: '', descricao: '', duracao: '' });
  const [tarefas, setTarefas] = useState([]);
  const [ficheiros, setFicheiros] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState({ titulo: '', descricao: '' });
  const [tarefaEditandoId, setTarefaEditandoId] = useState(null);
  const [tarefaEditada, setTarefaEditada] = useState({ titulo: '', descricao: '' });
  const [ficheiro, setFicheiro] = useState(null);
  const [tipoFicheiro, setTipoFicheiro] = useState('curso');
  const [tarefaFicheiro, setTarefaFicheiro] = useState('');
  const [alunos, setAlunos] = useState([]);
  const [novaPergunta, setNovaPergunta] = useState('');
  const [opcoes, setOpcoes] = useState([{ texto_opcao: '', correta: false }]);
  const [tarefaSelecionada, setTarefaSelecionada] = useState('');
  const [exercicios, setExercicios] = useState([]);
const [tarefaExercicios, setTarefaExercicios] = useState('');


  const carregarCurso = () => {
    axios.get(`http://localhost:3001/api/instrutor/curso/${id}`)
      .then(res => {
        setCurso({ titulo: res.data.titulo, duracao: res.data.duracao, descricao: res.data.descricao });
        setCursoEditado({ titulo: res.data.titulo, duracao: res.data.duracao, descricao: res.data.descricao });
        setTarefas(res.data.tarefas || []);
        setFicheiros(res.data.ficheiros || []);
      });

    axios.get(`http://localhost:3001/api/instrutor/curso/${id}/alunos`)
      .then(res => setAlunos(res.data))
      .catch(err => console.error("Erro ao carregar alunos:", err));
  };

  useEffect(() => {
    carregarCurso();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAdicionarTarefa = () => {
    if (!novaTarefa.titulo) return;
    axios.post(`http://localhost:3001/api/instrutor/curso/${id}/tarefas`, novaTarefa)
      .then(() => {
        setNovaTarefa({ titulo: '', descricao: '' });
        carregarCurso();
      })
      .catch(err => console.error("Erro ao criar tarefa:", err));
  };

  const handleEditarTarefa = (tarefaId) => {
    axios.put(`http://localhost:3001/api/instrutor/curso/${id}/tarefas/${tarefaId}`, tarefaEditada)
      .then(() => {
        setTarefaEditandoId(null);
        setTarefaEditada({ titulo: '', descricao: '' });
        carregarCurso();
      })
      .catch(err => console.error("Erro ao editar tarefa:", err));
  };

  const handleApagarTarefa = (tarefaId) => {
    axios.delete(`http://localhost:3001/api/instrutor/curso/${id}/tarefas/${tarefaId}`)
      .then(() => carregarCurso())
      .catch(err => console.error("Erro ao apagar tarefa:", err));
  };

  const handleEditarCurso = () => {
    axios.put(`http://localhost:3001/api/instrutor/curso/${id}`, cursoEditado)
      .then(() => {
        setEditandoCurso(false);
        carregarCurso();
      })
      .catch(err => console.error("Erro ao editar curso:", err));
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!ficheiro) return;

    const formData = new FormData();
    formData.append('ficheiro', ficheiro);
    formData.append('tipo', tipoFicheiro);
    if (tipoFicheiro === 'tarefa') formData.append('tarefa_id', tarefaFicheiro);

    axios.post(`http://localhost:3001/api/instrutor/curso/${id}/upload-ficheiro`, formData)
      .then(() => {
        setFicheiro(null);
        carregarCurso();
      })
      .catch(err => console.error("Erro ao fazer upload dos ficheiros:", err));
  };

  const handleApagarFicheiro = (ficheiroId) => {
    axios.delete(`http://localhost:3001/api/instrutor/curso/${id}/ficheiros/${ficheiroId}`)
      .then(() => carregarCurso())
      .catch(err => console.error("Erro ao apagar ficheiro:", err));
  };

  const adicionarOpcao = () => {
    setOpcoes([...opcoes, { texto_opcao: '', correta: false }]);
  };

  const removerOpcao = (index) => {
    const novas = [...opcoes];
    novas.splice(index, 1);
    setOpcoes(novas);
  };

  const atualizarOpcao = (index, campo, valor) => {
    const novas = [...opcoes];
    novas[index][campo] = valor;
    setOpcoes(novas);
  };

  const handleCriarExercicio = () => {
    if (!novaPergunta || opcoes.length < 2 || !tarefaSelecionada) return alert('Preenche todos os campos.');

    axios.post(`http://localhost:3001/api/instrutor/tarefas/${tarefaSelecionada}/exercicio`, {
      pergunta: novaPergunta,
      opcoes
    })
      .then(() => {
        setNovaPergunta('');
        setOpcoes([{ texto_opcao: '', correta: false }]);
        setTarefaSelecionada('');
        alert('Exercício criado com sucesso!');
      })
      .catch(err => {
        console.error("Erro ao criar exercício:", err);
        alert("Erro ao criar exercício.");
      });
  };

  const carregarExercicios = (tarefaId) => {
  setTarefaExercicios(tarefaId);

  axios.get(`http://localhost:3001/api/instrutor/tarefas/${tarefaId}/exercicios`)
    .then(res => setExercicios(res.data))
    .catch(err => console.error("Erro ao carregar exercícios:", err));
};


const apagarExercicio = (exercicioId) => {
  axios.delete(`http://localhost:3001/api/instrutor/exercicios/${exercicioId}`)
    .then(() => carregarExercicios(tarefaExercicios))
    .catch(err => console.error("Erro ao apagar exercício:", err));
};


  if (!curso) return <div className="carregando">A carregar curso...</div>;

  return (
    <div className="visualizar-curso-container">
      <h2>{curso.titulo}</h2>
      <div className="tabs">
        <button className={tab === 'detalhes' ? 'active' : ''} onClick={() => setTab('detalhes')}>Detalhes do Curso</button>
        <button className={tab === 'tarefas' ? 'active' : ''} onClick={() => setTab('tarefas')}>Tarefas</button>
        <button className={tab === 'ficheiros' ? 'active' : ''} onClick={() => setTab('ficheiros')}>Ficheiros</button>
        <button className={tab === 'alunos' ? 'active' : ''} onClick={() => setTab('alunos')}>Alunos</button>
      </div>

      <div className="conteudo-tab">
        {tab === 'detalhes' && (
          <div>
            {editandoCurso ? (
              <div>
                <input value={cursoEditado.titulo} onChange={e => setCursoEditado({ ...cursoEditado, titulo: e.target.value })} />
                <input value={cursoEditado.duracao} onChange={e => setCursoEditado({ ...cursoEditado, duracao: e.target.value })} />
                <textarea value={cursoEditado.descricao} onChange={e => setCursoEditado({ ...cursoEditado, descricao: e.target.value })} />
                <button onClick={handleEditarCurso}>Guardar</button>
                <button onClick={() => setEditandoCurso(false)}>Cancelar</button>
              </div>
            ) : (
              <div>
                <p><strong>Duração:</strong> {curso.duracao}</p>
                <p><strong>Descrição:</strong> {curso.descricao}</p>
                <button onClick={() => setEditandoCurso(true)}>Editar Curso</button>
              </div>
            )}
          </div>
        )}

        {tab === 'tarefas' && (
          <div>
            <div className="form-bloco">
              <h3>Nova Tarefa</h3>
              <input type="text" placeholder="Título" value={novaTarefa.titulo} onChange={e => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })} />
              <textarea placeholder="Descrição" value={novaTarefa.descricao} onChange={e => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })} />
              <button onClick={handleAdicionarTarefa}>Adicionar Tarefa</button>
            </div>

            <div className="lista-bloco">
              <h3>Tarefas</h3>
              {tarefas.length === 0 ? <p>Sem tarefas ainda.</p> : (
                <ul>
                  {tarefas.map(tarefa => (
                    <li key={tarefa.id}>
                      {tarefaEditandoId === tarefa.id ? (
                        <div>
                          <input value={tarefaEditada.titulo} onChange={e => setTarefaEditada({ ...tarefaEditada, titulo: e.target.value })} />
                          <textarea value={tarefaEditada.descricao} onChange={e => setTarefaEditada({ ...tarefaEditada, descricao: e.target.value })} />
                          <button onClick={() => handleEditarTarefa(tarefa.id)}>Guardar</button>
                          <button onClick={() => setTarefaEditandoId(null)}>Cancelar</button>
                        </div>
                      ) : (
                        <div>
                          <strong>{tarefa.titulo}</strong><br />
                          <span>{tarefa.descricao}</span><br />
                          <button onClick={() => {
                            setTarefaEditandoId(tarefa.id);
                            setTarefaEditada({ titulo: tarefa.titulo, descricao: tarefa.descricao });
                          }}>Editar</button>
                          <button onClick={() => handleApagarTarefa(tarefa.id)}>Apagar</button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-bloco">
              <h3>Criar Exercício</h3>
              <select value={tarefaSelecionada} onChange={e => setTarefaSelecionada(e.target.value)}>
                <option value="">Escolher Tarefa</option>
                {tarefas.map(tarefa => (
                  <option key={tarefa.id} value={tarefa.id}>{tarefa.titulo}</option>
                ))}
              </select>
              <input type="text" placeholder="Pergunta do exercício" value={novaPergunta} onChange={e => setNovaPergunta(e.target.value)} />
              {opcoes.map((op, i) => (
                <div key={i}>
                  <input type="text" placeholder={`Opção ${i + 1}`} value={op.texto_opcao} onChange={e => atualizarOpcao(i, 'texto_opcao', e.target.value)} />
                  <label>
                    <input type="checkbox" checked={op.correta} onChange={e => atualizarOpcao(i, 'correta', e.target.checked)} /> Correta
                  </label>
                  {opcoes.length > 1 && <button onClick={() => removerOpcao(i)}>Remover</button>}
                </div>
              ))}
              <button onClick={adicionarOpcao}>Adicionar Opção</button>
              <button onClick={handleCriarExercicio}>Guardar Exercício</button>
            </div>

            <div className="form-bloco">
  <h3>Ver Exercícios</h3>
  <select value={tarefaExercicios} onChange={e => carregarExercicios(e.target.value)}>
    <option value="">Escolher Tarefa</option>
    {tarefas.map(tarefa => (
      <option key={tarefa.id} value={tarefa.id}>{tarefa.titulo}</option>
    ))}
  </select>

  {exercicios.length > 0 && (
    <ul>
      {exercicios.map(ex => (
        <li key={ex.id}>
          <strong>{ex.pergunta}</strong>
          <ul>
            {ex.opcoes.map(op => (
              <li key={op.id}>
                {op.correta ? '✅' : '⬜️'} {op.texto_opcao}
              </li>
            ))}
          </ul>
          <button onClick={() => apagarExercicio(ex.id)}>Apagar Exercício</button>
        </li>
      ))}
    </ul>
  )}
</div>

          </div>
        )}

        {tab === 'ficheiros' && (
          <div>
            <div className="form-bloco">
              <h3>Upload de Ficheiro</h3>
              <form onSubmit={handleUpload}>
                <input type="file" onChange={e => setFicheiro(e.target.files[0])} />
                <select value={tipoFicheiro} onChange={e => setTipoFicheiro(e.target.value)}>
                  <option value="curso">Curso</option>
                  <option value="tarefa">Tarefa</option>
                </select>
                {tipoFicheiro === 'tarefa' && (
                  <select value={tarefaFicheiro} onChange={e => setTarefaFicheiro(e.target.value)}>
                    <option value="">Escolher Tarefa</option>
                    {tarefas.map(tarefa => (
                      <option key={tarefa.id} value={tarefa.id}>{tarefa.titulo}</option>
                    ))}
                  </select>
                )}
                <button type="submit">Enviar</button>
              </form>
            </div>

            <div className="lista-bloco">
              <h3>Ficheiros</h3>
              {ficheiros.length === 0 ? <p>Nenhum ficheiro enviado.</p> : (
                <ul>
                  {ficheiros.map(f => (
                    <li key={f.id}>
                      {f.tipo === 'curso' ? 'Curso' : 'Tarefa'} - {f.nome_ficheiro}
                      <button onClick={() => handleApagarFicheiro(f.id)}>Apagar</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {tab === 'alunos' && (
          <div className="lista-bloco">
            <h3>Alunos Inscritos</h3>
            {alunos.length === 0 ? <p>Nenhum aluno inscrito</p> : (
              <ul>
                {alunos.map(aluno => (
                  <li key={aluno.utilizador_id}>
                    <strong>{aluno.nome}</strong> - {aluno.email}<br />
                    <small>Inscrito em: {new Date(aluno.data_inscricao).toLocaleDateString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VisualizarCursoInstrutor;