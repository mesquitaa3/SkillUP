const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const router = express.Router();

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123", 
  database: "skillup", 
  port: 3307
});

// Rota para registo de utilizadores
router.post("/", async (req, res) => {
  const { nome, email, passe, cargo } = req.body;
  const hash = await bcrypt.hash(passe, 10);

  db.query(
    "INSERT INTO utilizadores (nome, email, passe, cargo) VALUES (?, ?, ?, ?)",
    [nome, email, hash, cargo],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const utilizador_id = result.insertId;

      if (cargo === "aluno") {
        db.query("INSERT INTO alunos (utilizador_id) VALUES (?)", [utilizador_id]);
      } else {
        db.query("INSERT INTO instrutores (utilizador_id) VALUES (?)", [utilizador_id]);
      }

      res.json({ message: "Conta criada com sucesso!" });
    }
  );
});

module.exports = router;
