const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require("express");
const mysql = require("mysql2");

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123", 
  database: "skillup", 
  port: 3307
});

// Criar diretório se não existir
const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/tarefas', async (req, res) => {
  const { id_curso, titulo, descricao } = req.body;
  db.query(
    'INSERT INTO tarefas (id_curso, titulo, descricao) VALUES (?, ?, ?)',
    [id_curso, titulo, descricao],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id_tarefa: result.insertId });
    }
  );
});

router.post('/ficheiros/:id_tarefa', upload.single('ficheiro'), (req, res) => {
  const { id_tarefa } = req.params;
  const { originalname, mimetype, filename } = req.file;
  const caminho = path.join(uploadPath, filename);

  db.query(
    'INSERT INTO ficheiros (id_tarefa, nome_original, caminho_armazenamento, tipo) VALUES (?, ?, ?, ?)',
    [id_tarefa, originalname, caminho, mimetype],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ mensagem: 'Ficheiro carregado com sucesso!' });
    }
  );
});

module.exports = router;
