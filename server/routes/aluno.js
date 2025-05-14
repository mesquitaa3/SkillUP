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

// GET dados do aluno pelo ID do utilizador
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
      console.error('❌ Erro ao buscar dados do aluno:', err);
      return res.status(500).json({ error: 'Erro ao buscar os dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    res.json(results[0]);
  });
});

// Atualizar email e/ou palavra-passe do aluno
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



module.exports = router;
