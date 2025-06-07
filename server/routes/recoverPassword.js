// routes/recoverPassword.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db'); // instância centralizada
const router = express.Router();

// Configuração do transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail', // Pode ser outro serviço de email (Outlook, Yahoo, etc.), caso esteja a usar outro
  auth: {
    user: 'dmmesquita0331@gmail.com',  // Aqui vai o endereço de email que enviará os emails de recuperação
    pass: 'uqdq uxfy omfd ebre'             // A senha ou o token de autenticação gerado pelo provedor (exemplo: senha de app no Gmail)
  }
});

// Rota para recuperação de palavra-passe
router.post('/recover', (req, res) => {
  const { email } = req.body;

  db.query('SELECT * FROM utilizadores WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) {
      return res.status(404).json({ message: 'Email não encontrado.' });
    }

    const user = results[0];
    const token = crypto.randomBytes(20).toString('hex'); // Gera um token único

    // Armazenar o token na base de dados (idealmente com data de expiração)
    db.query('UPDATE utilizadores SET reset_token = ?, reset_token_expiry = ? WHERE email = ?', 
      [token, new Date(Date.now() + 3600000), email], (err) => { // O token expira em 1 hora
        if (err) return res.status(500).json({ error: err });

        // Enviar email com o link de recuperação
        const resetLink = `http://localhost:3000/reset-password/${token}`;
        const mailOptions = {
          from: 'dmmesquita0331@gmail.com',
          to: email,
          subject: 'Recuperação de Palavra-Passe',
          text: `Clique no link para redefinir a sua palavra-passe: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(500).json({ message: 'Erro ao enviar email.', error: err });
          }
          res.json({ message: 'Instruções enviadas para o seu email.' });
        });
      });
  });
});

// Rota para redefinir a palavra-passe
router.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  db.query('SELECT * FROM utilizadores WHERE reset_token = ? AND reset_token_expiry > ?', 
    [token, new Date()], (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
      }

      const user = results[0];
      
      // Atualizar a palavra-passe e remover o token
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ error: err });

        db.query('UPDATE utilizadores SET passe = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?', 
          [hashedPassword, user.id], (err) => {
            if (err) return res.status(500).json({ error: err });

            res.json({ message: 'Palavra-passe atualizada com sucesso!' });
          });
      });
    });
});


module.exports = router;
