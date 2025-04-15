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

    // Sucesso no login, retornar o cargo
    console.log('✅ Login bem-sucedido:', user.email);

    // Em vez de enviar apenas o cargo, também podemos adicionar um token de autenticação ou ID do usuário para segurança extra
    res.json({
      cargo: user.cargo, // Retorna o cargo do usuário
      id: user.id,       // Opcional: Retornar o ID do usuário (caso precise para verificações futuras)
    });
  });
});

module.exports = router;
