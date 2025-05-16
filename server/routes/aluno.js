// routes/aluno.js
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'skillup',
  port: 3307,
});

//GET dados do aluno pelo ID do utilizador
router.get('/:id', (req, res) => {
  const idUtilizador = req.params.id;

  const query = `
    SELECT u.id, u.nome, u.email, u.cargo, u.data_criacao
    FROM utilizadores u
    JOIN alunos a ON a.utilizador_id = u.id 
    WHERE u.id = ? AND u.cargo = 'aluno'

  `;

  db.query(query, [idUtilizador], (err, results) => {
    if (err) {
      console.error('Erro ao buscar dados do aluno:', err);
      return res.status(500).json({ error: 'Erro ao buscar os dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.json(results[0]);
  });
});

//atualizar email e/ou palavra-passe do aluno
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, passe } = req.body;

  try {
    let updateFields = [];
    let values = [];

    if (email) {
      updateFields.push('email = ?');
      values.push(email);
    }

    if (passe) {
      const hashedPassword = await bcrypt.hash(passe, 10);
      updateFields.push('passe = ?');
      values.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar.' });
    }

    values.push(id);
    const sql = `UPDATE utilizadores SET ${updateFields.join(', ')} WHERE id = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erro ao atualizar utilizador:', err);
        return res.status(500).json({ message: 'Erro ao atualizar utilizador.' });
      }
      res.json({ message: 'Dados atualizados com sucesso.' });
    });
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

//inscrever aluno num curso (simular pós-pagamento)
router.post('/:alunoId/inscrever', (req, res) => {
  const { alunoId } = req.params;
  const { cursoId } = req.body;

  const sql = `
    INSERT INTO inscricoes (id_aluno, id_curso, data_inscricao, estado_pagamento)
    VALUES (?, ?, NOW(), 'pago')
  `;

  db.query(sql, [alunoId, cursoId], (err) => {
    if (err) {
      console.error('Erro ao inscrever aluno:', err);
      return res.status(500).json({ erro: 'Erro ao inscrever aluno' });
    }

    res.json({ mensagem: 'Inscrição realizada com sucesso!' });
  });
});

// GET /api/aluno/:id/inscricoes
router.get("/aluno/:id/inscricoes", (req, res) => {
  const alunoId = req.params.id;
  const query = `
    SELECT c.* FROM cursos c
    JOIN inscricoes i ON i.id_curso = c.id
    WHERE i.id_aluno = ?
  `;
  db.query(query, [alunoId], (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar cursos" });
    res.json(results);
  });
});

// GET /api/aluno/:id/inscricoes
router.get('/:id/inscricoes', (req, res) => {
  const alunoId = req.params.id;

  const query = `
    SELECT c.*
    FROM cursos c
    INNER JOIN inscricoes i ON i.id_curso = c.id
    WHERE i.id_aluno = ?
  `;

  db.query(query, [alunoId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar cursos inscritos:', err);
      return res.status(500).json({ erro: 'Erro ao buscar cursos inscritos' });
    }

    res.json(results);
  });
});

// GET /api/aluno/curso/:id?alunoId=...

router.get('/curso/:id', (req, res) => {
  const cursoId = req.params.id;
  const alunoId = req.query.alunoId;

  if (!alunoId) {
    return res.status(400).json({ erro: "alunoId não fornecido." });
  }

  const verificarInscricao = `
    SELECT * FROM inscricoes WHERE id_curso = ? AND id_aluno = ?
  `;

  const getCurso = `
  SELECT c.*, u.nome AS nome_instrutor
  FROM cursos c
  JOIN instrutores i ON c.instrutor_id = i.id
  JOIN utilizadores u ON i.utilizador_id = u.id
  WHERE c.id = ?
`;

  const getTarefas = `SELECT * FROM tarefas WHERE id_curso = ?`;
  const getFicheiros = `SELECT * FROM ficheiros WHERE curso_id = ?`;

  db.query(verificarInscricao, [cursoId, alunoId], (err, inscricoes) => {
    if (err) {
      console.error("Erro ao verificar inscrição:", err);
      return res.status(500).json({ erro: "Erro ao verificar inscrição." });
    }

    if (inscricoes.length === 0) {
      return res.status(403).json({ erro: "O aluno não está inscrito neste curso." });
    }

    db.query(getCurso, [cursoId], (err, cursoRes) => {
      if (err) {
        console.error("Erro ao buscar curso:", err);
        return res.status(500).json({ erro: "Erro ao buscar curso." });
      }

      db.query(getTarefas, [cursoId], (err, tarefasRes) => {
        if (err) {
          console.error("Erro ao buscar tarefas:", err);
          return res.status(500).json({ erro: "Erro ao buscar tarefas." });
        }

        db.query(getFicheiros, [cursoId], (err, ficheirosRes) => {
          if (err) {
            console.error("Erro ao buscar ficheiros:", err);
            return res.status(500).json({ erro: "Erro ao buscar ficheiros." });
          }

          res.json({
            curso: cursoRes[0],
            tarefas: tarefasRes,
            ficheiros: ficheirosRes
          });
        });
      });
    });
  });
});







module.exports = router;
