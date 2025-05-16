// routes/login.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'skillup',
  port: 3307,
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login recebido:', email);

  db.query('SELECT * FROM utilizadores WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.passe);
    if (!match) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user.cargo === 'instrutor') {
      db.query('SELECT id FROM instrutores WHERE utilizador_id = ?', [user.id], (err2, instrutorResults) => {
        if (err2) return res.status(500).json({ message: 'Erro ao buscar dados do instrutor' });
        if (instrutorResults.length === 0) return res.status(404).json({ message: 'ID do instrutor não encontrado. Faz login novamente.' });

        const instrutor_id = instrutorResults[0].id;

        return res.json({
          id: user.id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          instrutor_id,
          data_criacao: user.data_criacao
        });
      });
    } else if (user.cargo === 'aluno') {
      db.query('SELECT id FROM alunos WHERE utilizador_id = ?', [user.id], (err2, alunoResults) => {
        if (err2) return res.status(500).json({ message: 'Erro ao buscar dados do aluno' });
        if (alunoResults.length === 0) return res.status(404).json({ message: 'ID do aluno não encontrado. Faz login novamente.' });

        const aluno_id = alunoResults[0].id;

        return res.json({
          id: user.id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          aluno_id,
          data_criacao: user.data_criacao
        });
      });
    } else {
      return res.json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        cargo: user.cargo,
        data_criacao: user.data_criacao
      });
    }
  });
});

module.exports = router;
