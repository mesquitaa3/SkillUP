// routes/cursos.js
const express = require("express");
const mysql = require("mysql2");
const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "skillup",
  port: 3307,
});

// GET /api/cursos - todos os cursos visíveis
router.get("/", (req, res) => {
  const query = "SELECT * FROM cursos WHERE visivel = 1";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar cursos:", err);
      return res.status(500).json({ erro: "Erro ao buscar cursos" });
    }
    res.json(results);
  });
});

// GET /api/cursos/:id - detalhes de um curso
router.get("/:id", (req, res) => {
  const cursoId = req.params.id;
  const query = `
    SELECT c.*, u.nome AS instrutor_nome
    FROM cursos c
    JOIN instrutores i ON c.instrutor_id = i.id
    JOIN utilizadores u ON i.utilizador_id = u.id
    WHERE c.id = ?
  `;
  db.query(query, [cursoId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar curso:", err);
      return res.status(500).json({ erro: "Erro ao buscar curso" });
    }
    res.json(results[0]);
  });
});

// GET /api/cursos/populares - top 3 cursos com mais inscrições
router.get("/populares", (req, res) => {
  const query = `
    SELECT c.*, COUNT(i.id) AS num_inscricoes
    FROM cursos c
    LEFT JOIN inscricoes i ON c.id = i.id_curso
    GROUP BY c.id
    ORDER BY num_inscricoes DESC
    LIMIT 3
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar cursos populares:", err);
      return res.status(500).json({ erro: "Erro ao buscar cursos populares" });
    }
    res.json(results);
  });
});

module.exports = router;
