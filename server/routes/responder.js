// routes/responder.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../db'); // ✅ importa a instância centralizada


// POST /api/responder
router.post('/', (req, res) => {
  const { alunoId, exercicioId, opcaoId } = req.body;

  if (!alunoId || !exercicioId || !opcaoId) {
    return res.status(400).json({ erro: 'Dados incompletos.' });
  }

  const verificarCorreta = 'SELECT correta FROM opcoes_exercicio WHERE id = ?';
  const gravarResposta = `
    INSERT INTO respostas_aluno (id_aluno, id_exercicio, id_opcao_escolhida, data_submissao)
    VALUES (?, ?, ?, NOW())
  `;

  db.query(verificarCorreta, [opcaoId], (err, resultado) => {
    if (err) {
      console.error('Erro ao verificar resposta:', err);
      return res.status(500).json({ erro: 'Erro ao verificar resposta.' });
    }

    const correta = resultado[0]?.correta === 1;

    db.query(gravarResposta, [alunoId, exercicioId, opcaoId], (err2) => {
      if (err2) {
        console.error('Erro ao gravar resposta:', err2);
        return res.status(500).json({ erro: 'Erro ao gravar resposta.' });
      }

      res.json({ correta });
    });
  });
});

// DELETE /api/responder/tarefa/:tarefaId/aluno/:alunoId
router.delete('/tarefa/:tarefaId/aluno/:alunoId', (req, res) => {
  const { tarefaId, alunoId } = req.params;

  const deleteQuery = `
    DELETE r.*
    FROM respostas_aluno r
    JOIN exercicios e ON e.id = r.id_exercicio
    WHERE e.id_tarefa = ? AND r.id_aluno = ?
  `;

  db.query(deleteQuery, [tarefaId, alunoId], (err, result) => {
    if (err) {
      console.error("Erro ao apagar respostas:", err);
      return res.status(500).json({ erro: "Erro ao reiniciar tarefa." });
    }

    res.json({ mensagem: "Tarefa reiniciada com sucesso!" });
  });
});

// DELETE /api/responder/curso/:cursoId/aluno/:alunoId
router.delete('/curso/:cursoId/aluno/:alunoId', (req, res) => {
  const { cursoId, alunoId } = req.params;

  const query = `
    DELETE r FROM respostas_aluno r
    JOIN exercicios e ON e.id = r.id_exercicio
    JOIN tarefas t ON t.id = e.id_tarefa
    WHERE t.id_curso = ? AND r.id_aluno = ?
  `;

  db.query(query, [cursoId, alunoId], (err, result) => {
    if (err) {
      console.error("Erro ao reiniciar curso:", err);
      return res.status(500).json({ erro: "Erro ao reiniciar curso." });
    }
    res.json({ mensagem: "Curso reiniciado com sucesso." });
  });
});


module.exports = router;
