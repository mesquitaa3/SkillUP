const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');  // Adiciona a importação do bcrypt
const { OpenAI } = require('openai');  // Importa diretamente a classe OpenAI

const registoRoute = require('./routes/registo');
const loginRoute = require('./routes/login');
const alunoRoute = require('./routes/aluno');
const instrutorRoute = require('./routes/instrutor');
const tarefaRoute = require('./routes/tarefa');
const responderRoute = require('./routes/responder');
const cursosRoute = require('./routes/cursos');

const app = express();

// Conexão com a base de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'skillup',
  port: 3307
});

db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao MariaDB:', err.stack);
    return;
  }
  console.log('✅ Conectado ao MariaDB');
});

// Middleware
app.use(cors());
app.use(express.json());

// Servir a pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Respostas automáticas (baseadas em palavras-chave ou expressões regulares)
function getAnswer(question) {
  const patterns = [
    {
      regex: /preciso de ajuda|ajuda/i,
      answer: "Claro! Como posso ajudar?"
    },

    {
        regex: /comandos|como funciona|quais são os comandos/i,
        answer: `
      Aqui estão alguns comandos que você pode usar:

      1. **"QUEM SOMOS?"** - Para saber mais sobre a nossa plataforma.
      2. **"CURSOS?"** - Para obter informações sobre os cursos disponíveis.
      3. **"PREÇO?"** - Para saber os preços dos cursos.
      4. **"INSCRIÇÃO?"** - Para aprender como se inscrever em um curso.
      5. **"INSTRUTORES"** - Para saber mais sobre nossos instrutores.
      6. **"Qual é a missão do SkillUP?"** - Para entender o objetivo da nossa plataforma.
      7. **"Quais as formas de pagamento aceites?"** - Para obter informações sobre os métodos de pagamento.

      Se você tiver mais perguntas, é só perguntar e eu ficarei feliz em ajudar!`
    },

    // Padrões de perguntas sobre a plataforma
    {
      regex: /o que é o skillup|o que é a plataforma skillup|o que é isto|qual é o objetivo do skillup/i,
      answer: "O SkillUP é uma plataforma online inovadora que liga alunos e instrutores com vontade de aprender e partilhar conhecimentos. Aqui, qualquer pessoa pode adquirir novas competências, impulsionar a sua carreira ou transformar a sua paixão numa fonte de rendimento."
    },

    // Padrões sobre a missão do SkillUP
    {
      regex: /qual é a missão do skillup|missão do skillup|qual é o objetivo do skillup/i,
      answer: "A missão do SkillUP é democratizar o acesso à educação de qualidade, oferecendo uma experiência de aprendizagem acessível, prática e moderna."
    },

    // Padrões sobre a visão do SkillUP
    {
      regex: /qual é a visão do skillup|visão do skillup/i,
      answer: "A visão do SkillUP é ser uma referência no ensino online, capacitando pessoas a crescer através do conhecimento."
    },

    // Padrões sobre como funciona a plataforma
    {
      regex: /como funciona o skillup|como funciona a plataforma|o que os alunos fazem no skillup/i,
      answer: "No SkillUP, os alunos exploram cursos, aprendem ao seu ritmo e desenvolvem novas competências."
    },

    // Padrões sobre o papel dos instrutores
    {
      regex: /como funciona para instrutores|o que os instrutores fazem no skillup/i,
      answer: "Os instrutores no SkillUP criam conteúdos, partilham a sua experiência e ajudam os alunos a aprender e a evoluir."
    },

    // Padrões sobre como juntar-se ao SkillUP
    {
      regex: /como me inscrever|como posso me juntar ao skillup|como me tornar aluno ou instrutor/i,
      answer: "Seja como aluno ou instrutor, o SkillUP é o espaço ideal para evoluíres, ensinares e te transformares. Começa hoje mesmo!"
    },

    // Padrão sobre o que oferece a plataforma
    {
      regex: /o que o skillup oferece|quais os benefícios de usar skillup/i,
      answer: "O SkillUP oferece uma plataforma moderna e acessível onde você pode aprender novas competências, impulsionar sua carreira e até mesmo transformar sua paixão em um negócio."
    },

    // Padrão para perguntas não reconhecidas
    {
      regex: /.*/,  // Padrão para caso a pergunta não seja reconhecida
      answer: "Desculpe, não entendi sua pergunta. Pode reformular?"
    }
  ];

  for (let pattern of patterns) {
    if (pattern.regex.test(question)) {
      return pattern.answer;
    }
  }
  return "Desculpe, não entendi sua pergunta.";
}


// Rota para interagir com o chatbot (respostas automáticas)
app.post('/api/chat', (req, res) => {
  const userQuestion = req.body.question.toLowerCase();  // Converte a pergunta para minúsculas

  // Busca uma resposta predefinida
  const response = getAnswer(userQuestion);

  // Enviar a resposta de volta para o frontend
  res.json({ answer: response });
});

// Rota para recuperação de palavra-passe
app.post('/api/recover', (req, res) => {
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
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Pode ser outro serviço de email (Outlook, Yahoo, etc.)
          auth: {
            user: 'dmmesquita0331@gmail.com',
            pass: 'uqdq uxfy omfd ebre'
          }
        });

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

// Rota para validar o token de recuperação
app.post('/api/reset-password/validate', (req, res) => {
  const { token } = req.body;

  db.query('SELECT * FROM utilizadores WHERE reset_token = ? AND reset_token_expiry > ?', 
    [token, new Date()], (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length === 0) {
        return res.status(400).json({ message: 'Token inválido ou expirado.' });
      }

      res.json({ message: 'Token válido.' });
    });
});

// Rota para redefinir a palavra-passe
app.post('/api/reset-password', (req, res) => {
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

// Ativar rotas principais
app.use('/api/registo', registoRoute);
app.use('/api/login', loginRoute);
app.use('/api/aluno', alunoRoute);
app.use('/api/instrutor', instrutorRoute); // agora esta rota contém /:id/cursos
app.use('/api/tarefa', tarefaRoute);
app.use('/api/responder', responderRoute);
app.use('/api/cursos', cursosRoute);

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
