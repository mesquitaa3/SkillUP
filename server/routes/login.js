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

// Rota de login
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  console.log('📩 Login recebido:', email);

  db.query('SELECT * FROM utilizadores WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error('❌ Erro MySQL:', err);
      return res.status(500).json({ error: err });
    }

    // Verificar se o utilizador existe
    if (results.length === 0) {
      console.log('⚠️ Nenhum utilizador encontrado com esse email');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = results[0];
    console.log('🔎 Utilizador encontrado:', user);

    // Comparar a senha com a armazenada (criptografada)
    const match = await bcrypt.compare(password, user.passe);
    if (!match) {
      console.log('❌ Senha incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Se o utilizador for um instrutor
    if (user.cargo === 'instrutor') {
      db.query('SELECT id FROM instrutores WHERE utilizador_id = ?', [user.id], (err2, instrutorResults) => {
        if (err2) {
          console.error('❌ Erro ao buscar instrutor_id:', err2);
          return res.status(500).json({ message: 'Erro ao buscar dados do instrutor' });
        }

        if (instrutorResults.length === 0) {
          console.log('⚠️ Nenhum instrutor encontrado para este utilizador');
          return res.status(404).json({ message: 'ID do instrutor não encontrado. Faz login novamente.' });
        }

        const instrutor_id = instrutorResults[0].id;

        console.log('✅ Login bem-sucedido (instrutor):', user.email);

        res.json({
          id: user.id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          instrutor_id: instrutor_id,
          data_criacao: user.data_criacao
        });
      });

    } else if (user.cargo === 'aluno') {
      db.query('SELECT id FROM alunos WHERE utilizador_id = ?', [user.id], (err2, alunoResults) => {
        if (err2) {
          console.error('❌ Erro ao buscar aluno_id:', err2);
          return res.status(500).json({ message: 'Erro ao buscar dados do aluno' });
        }

        if (alunoResults.length === 0) {
          console.log('⚠️ Nenhum aluno encontrado para este utilizador');
          return res.status(404).json({ message: 'ID do aluno não encontrado. Faz login novamente.' });
        }

        const aluno_id = alunoResults[0].id;

        console.log('✅ Login bem-sucedido (aluno):', user.email);

        res.json({
          id: user.id,
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          aluno_id: aluno_id,
          data_criacao: user.data_criacao
        });
      });

    } else {
      // Outro tipo de utilizador (caso não seja aluno nem instrutor)
      res.json({
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
