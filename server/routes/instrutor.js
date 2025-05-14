const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const bcrypt = require('bcrypt');


const router = express.Router();

// Configuração da base de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "skillup",
  port: 3307
});

// Configuração do multer para guardar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // pasta onde as imagens vão ser guardadas
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

// Criar novo curso com upload de imagem
router.post("/criar-curso", upload.single("imagem"), (req, res) => {
  const { titulo, descricao, duracao, preco, instrutor_id } = req.body;
  const imagem = req.file ? req.file.filename : null;

  console.log("📥 Dados recebidos:", req.body);
  console.log("🖼️ Ficheiro recebido:", req.file);

  if (!titulo || !descricao || !duracao || !preco || !instrutor_id) {
    return res.status(400).json({ erro: "Campos obrigatórios em falta" });
  }

  const sql = `
    INSERT INTO cursos (titulo, descricao, duracao, preco, imagem, instrutor_id, visivel)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `;

  db.query(
    sql,
    [titulo, descricao, duracao, preco, imagem, instrutor_id],
    (err, result) => {
      if (err) {
        console.error("❌ Erro ao criar curso:", err);
        return res.status(500).json({ erro: "Erro no servidor ao criar curso" });
      }

      console.log("✅ Curso criado com ID:", result.insertId);
      res.status(201).json({
        mensagem: "Curso criado com sucesso",
        id: result.insertId,
        imagem
      });
    }
  );
});

// Atualizar curso existente
router.put("/editar-curso/:id", (req, res) => {
  const cursoId = req.params.id;
  const { titulo, descricao, duracao, preco, imagem } = req.body;

  if (!titulo || !descricao || !duracao || !preco) {
    return res.status(400).json({ erro: "Campos obrigatórios em falta" });
  }

  const sql = `
    UPDATE cursos 
    SET titulo = ?, descricao = ?, duracao = ?, preco = ?, imagem = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [titulo, descricao, duracao, preco, imagem, cursoId],
    (err, result) => {
      if (err) {
        console.error("❌ Erro ao atualizar curso:", err);
        return res.status(500).json({ erro: "Erro ao atualizar curso" });
      }

      console.log("✅ Curso atualizado:", cursoId);
      res.json({ mensagem: "Curso atualizado com sucesso" });
    }
  );
});

// Listar cursos do instrutor
router.get("/:instrutorId/cursos", (req, res) => {
  const { instrutorId } = req.params;

  console.log("🔎 Instrutor ID recebido:", instrutorId);

  db.query(
    "SELECT * FROM cursos WHERE instrutor_id = ?",
    [instrutorId],
    (err, results) => {
      if (err) {
        console.error("❌ Erro ao buscar cursos:", err);
        return res.status(500).json({ erro: "Erro ao buscar cursos do instrutor" });
      }

      if (results.length === 0) {
        console.log("ℹ️ Nenhum curso encontrado para o instrutor:", instrutorId);
      }

      res.json(results);
    }
  );
});

router.put('/desativar-curso/:id', (req, res) => {
  const cursoId = req.params.id;
  db.query('UPDATE cursos SET visivel = 0 WHERE id = ?', [cursoId], (err, result) => {
    if (err) {
      console.error('Erro ao desativar curso:', err);
      return res.status(500).json({ erro: 'Erro ao desativar curso' });
    }
    res.json({ mensagem: 'Curso desativado com sucesso' });
  });
});

router.put('/ativar-curso/:id', (req, res) => {
  const cursoId = req.params.id;
  db.query('UPDATE cursos SET visivel = 1 WHERE id = ?', [cursoId], (err, result) => {
    if (err) {
      console.error('Erro ao ativar curso:', err);
      return res.status(500).json({ erro: 'Erro ao ativar curso' });
    }
    res.json({ mensagem: 'Curso ativado com sucesso' });
  });
});

// Obter tarefas do curso
router.get('/curso/:id/tarefas', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tarefas WHERE curso_id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Adicionar tarefa com upload
router.post('/curso/:id/tarefa', upload.single('ficheiro'), (req, res) => {
  const { id } = req.params;
  const { titulo, descricao } = req.body;
  const ficheiro = req.file ? req.file.filename : null;

  db.query(
    'INSERT INTO tarefas (curso_id, titulo, descricao, ficheiro) VALUES (?, ?, ?, ?)',
    [id, titulo, descricao, ficheiro],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ success: true, id: result.insertId });
    }
  );
});

router.get('/curso/:id', (req, res) => {
  const { id } = req.params;
  console.log("ID do curso recebido:", id); // <- ADICIONA ISTO

  db.query('SELECT * FROM cursos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]); // se result[0] for undefined, pode ser o problema
  });
});




// GET dados do instrutor pelo ID do utilizador
router.get('/:id', (req, res) => {
  const idUtilizador = req.params.id;

  const query = `
    SELECT u.id, u.nome, u.email, u.cargo, u.data_criacao
    FROM utilizadores u
    JOIN instrutores a ON a.utilizador_id = u.id 
    WHERE u.id = ? AND u.cargo = 'instrutor'

  `;

  db.query(query, [idUtilizador], (err, results) => {
    if (err) {
      console.error('❌ Erro ao buscar dados do instrutor:', err);
      return res.status(500).json({ error: 'Erro ao buscar os dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'instrutor não encontrado' });
    }

    res.json(results[0]);
  });
});

// Atualizar email e/ou palavra-passe do instrutor
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
