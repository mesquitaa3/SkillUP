const express = require('express');
const mysql = require('mysql2'); // usa mysql2, que é melhor para promessas
const cors = require('cors');

// Importar as rotas
const registoRoute = require('./routes/registo');
const loginRoute = require('./routes/login'); // <-- Importa a rota de login

const app = express();

// Conexão com a base de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123',
  database: 'skillup',
  port: 3307
});

// Verifica a conexão
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

// Rota para cursos (exemplo)
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

// Ativar as rotas
app.use('/api/registo', registoRoute);
app.use('/api/login', loginRoute); // <-- Ativa a rota de login aqui!

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
