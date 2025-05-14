// route/login.js
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
      // Consultar a tabela instrutores para obter o instrutor_id (não o utilizador_id)
      db.query('SELECT id FROM instrutores WHERE utilizador_id = ?', [user.id], (err, instrutorResults) => {
        if (err) {
          console.error('❌ Erro ao buscar instrutor_id:', err);
          return res.status(500).json({ message: 'Erro ao buscar dados do instrutor' });
        }

        console.log('🔎 Dados do instrutor encontrados:', instrutorResults);

        // Verificar se encontramos o instrutor
        if (instrutorResults.length === 0) {
          console.log('⚠️ Nenhum instrutor encontrado para este utilizador');
          return res.status(404).json({ message: 'ID do instrutor não encontrado. Faz login novamente.' });
        }

        const instrutor_id = instrutorResults[0].id; // Obtém o instrutor_id da tabela instrutores

        // Sucesso no login, retornar todos os dados necessários
        console.log('✅ Login bem-sucedido:', user.email);

        // Alterando a correspondência dos ids
        res.json({
          id: user.id, // ✅ ID da tabela 'utilizadores', usado para updates
          nome: user.nome,
          email: user.email,
          cargo: user.cargo,
          instrutor_id: instrutor_id, // ✅ ID da tabela 'instrutores', usado para outras operações
          data_criacao: user.data_criacao
        });

      });
    } else {
      // Para outros cargos (por exemplo, aluno)
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
