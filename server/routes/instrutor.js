const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");

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

module.exports = router;
