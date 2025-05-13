const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // <-- Necessário para path absoluto

// Importar as rotas
const registoRoute = require('./routes/registo');
const loginRoute = require('./routes/login');
const alunoRoute = require('./routes/aluno');
const instrutorRoute = require('./routes/instrutor');

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

// ✅ NOVO: Servir a pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para cursos (listar todos)
app.get('/api/cursos', (req, res) => {
  const query = 'SELECT * FROM cursos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar cursos:', err);
      return res.status(500).send('Erro ao buscar os cursos');
    }
    res.json(results);
  });
});

// Buscar 1 curso específico
app.get('/api/cursos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM cursos WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar curso:', err);
      return res.status(500).json({ erro: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ erro: 'Curso não encontrado' });
    }

    res.json(results[0]);
  });
});

// Cursos por instrutor
app.get('/api/instrutor/:id/cursos', (req, res) => {
  const instrutorId = req.params.id;
  const query = 'SELECT * FROM cursos WHERE instrutor_id = ?';

  db.query(query, [instrutorId], (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar cursos do instrutor:', err);
      return res.status(500).json({ erro: 'Erro ao buscar cursos do instrutor' });
    }

    res.json(results);
  });
});

// Ativar rotas
app.use('/api/registo', registoRoute);
app.use('/api/login', loginRoute);
app.use('/api/aluno', alunoRoute);
app.use('/api/instrutor', instrutorRoute);

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
