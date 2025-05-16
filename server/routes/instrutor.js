const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin123", 
  database: "skillup", 
  port: 3307
});

// Criar pastas se não existirem
const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const ficheirosPath = path.join(__dirname, "../uploads/ficheiros");
if (!fs.existsSync(ficheirosPath)) fs.mkdirSync(ficheirosPath, { recursive: true });

// Configuração do multer (para imagens ou ficheiros genéricos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const storageFicheiros = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ficheirosPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const uploadFicheiros = multer({ storage: storageFicheiros });

// ✅ Obter cursos do instrutor (funciona com /api/instrutor/:id/cursos)
router.get("/:id/cursos", (req, res) => {
  const instrutorId = req.params.id;
  db.query("SELECT * FROM cursos WHERE instrutor_id = ?", [instrutorId], (err, results) => {
    if (err) {
      console.error("Erro ao obter cursos:", err);
      return res.status(500).json({ erro: "Erro ao obter cursos" });
    }
    res.json(results);
  });
});

router.post('/criar-curso', upload.single('imagem'), (req, res) => {
  const { titulo, descricao, duracao, preco, instrutor_id } = req.body;
  const imagem = req.file?.filename || null;

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
        console.error("Erro ao criar curso:", err);
        return res.status(500).json({ erro: "Erro ao criar curso" });
      }

      res.json({ mensagem: "Curso criado com sucesso!", id: result.insertId });
    }
  );
});

router.get("/curso/:id", (req, res) => {
  const cursoId = req.params.id;

  const getCurso = () =>
    new Promise((resolve, reject) =>
      db.query("SELECT * FROM cursos WHERE id = ?", [cursoId], (err, results) =>
        err ? reject(err) : resolve(results[0])
      )
    );

  const getTarefas = () =>
    new Promise((resolve, reject) => {
      db.query('SELECT * FROM tarefas WHERE id_curso = ?', [cursoId], (err, results) => {
        err ? reject(err) : resolve(results);
      });
    });

  const getFicheiros = () =>
    new Promise((resolve, reject) =>
      db.query("SELECT * FROM ficheiros WHERE curso_id = ?", [cursoId], (err, results) =>
        err ? reject(err) : resolve(results)
      )
    );

  Promise.all([getCurso(), getTarefas(), getFicheiros()])
    .then(([curso, tarefas, ficheiros]) => {
      if (!curso) return res.status(404).json({ erro: "Curso não encontrado" });
      res.json({ ...curso, tarefas, ficheiros });
    })
    .catch((err) => {
      console.error("Erro ao obter curso completo:", err);
      res.status(500).json({ erro: "Erro ao obter curso" });
    });
});

router.put("/curso/:id", (req, res) => {
  const cursoId = req.params.id;
  const { titulo, descricao, duracao } = req.body;
  db.query(
    "UPDATE cursos SET titulo = ?, descricao = ?, duracao = ? WHERE id = ?",
    [titulo, descricao, duracao, cursoId],
    (err) => {
      if (err) {
        console.error("Erro ao atualizar curso:", err);
        return res.status(500).json({ erro: "Erro ao atualizar curso" });
      }
      res.json({ mensagem: "Curso atualizado com sucesso" });
    }
  );
});

router.put("/curso/:id/ativar", (req, res) => {
  const cursoId = req.params.id;
  const { ativo } = req.body;
  db.query("UPDATE cursos SET ativo = ? WHERE id = ?", [ativo, cursoId], (err) => {
    if (err) {
      console.error("Erro ao alterar estado do curso:", err);
      return res.status(500).json({ erro: "Erro ao alterar estado do curso" });
    }
    res.json({ mensagem: "Estado do curso atualizado com sucesso" });
  });
});

router.post("/curso/:id/tarefas", (req, res) => {
  const cursoId = req.params.id;
  const { titulo, descricao } = req.body;
  db.query("INSERT INTO tarefas (id_curso, titulo, descricao) VALUES (?, ?, ?)", [cursoId, titulo, descricao], (err) => {
    if (err) {
      console.error("Erro ao adicionar tarefa:", err);
      return res.status(500).json({ erro: "Erro ao adicionar tarefa" });
    }
    res.json({ mensagem: "Tarefa adicionada com sucesso" });
  });
});

router.post("/curso/:id/upload-ficheiro", uploadFicheiros.single("ficheiro"), (req, res) => {
  const cursoId = req.params.id;
  const { tarefa_id } = req.body;
  const ficheiro = req.file?.filename;

  if (!ficheiro) return res.status(400).json({ erro: "Ficheiro não fornecido" });

  db.query("INSERT INTO ficheiros (curso_id, tarefa_id, nome_ficheiro, tipo) VALUES (?, ?, ?, ?)", [cursoId, tarefa_id, ficheiro, req.file.mimetype], (err) => {
    if (err) {
      console.error("Erro ao guardar ficheiro:", err);
      return res.status(500).json({ erro: "Erro ao guardar ficheiro" });
    }
    res.json({ mensagem: "Ficheiro carregado com sucesso" });
  });
});

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
      console.error('Erro ao buscar dados do instrutor:', err);
      return res.status(500).json({ error: 'Erro ao buscar os dados' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Instrutor não encontrado' });
    }

    res.json(results[0]);
  });
});

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

router.put("/curso/:cursoId/tarefas/:tarefaId", (req, res) => {
  const { cursoId, tarefaId } = req.params;
  const { titulo, descricao } = req.body;

  const sql = "UPDATE tarefas SET titulo = ?, descricao = ? WHERE id = ? AND id_curso = ?";
  db.query(sql, [titulo, descricao, tarefaId, cursoId], (err) => {
    if (err) {
      console.error("Erro ao atualizar tarefa:", err);
      return res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
    res.json({ mensagem: "Tarefa atualizada com sucesso" });
  });
});

router.delete("/curso/:cursoId/tarefas/:tarefaId", (req, res) => {
  const { cursoId, tarefaId } = req.params;

  const sql = "DELETE FROM tarefas WHERE id = ? AND id_curso = ?";
  db.query(sql, [tarefaId, cursoId], (err) => {
    if (err) {
      console.error("Erro ao apagar tarefa:", err);
      return res.status(500).json({ erro: "Erro ao apagar tarefa" });
    }
    res.json({ mensagem: "Tarefa apagada com sucesso" });
  });
});

router.delete("/curso/:cursoId/ficheiros/:ficheiroId", (req, res) => {
  const { cursoId, ficheiroId } = req.params;

  const sql = "DELETE FROM ficheiros WHERE id = ? AND curso_id = ?";
  db.query(sql, [ficheiroId, cursoId], (err) => {
    if (err) {
      console.error("Erro ao apagar ficheiro:", err);
      return res.status(500).json({ erro: "Erro ao apagar ficheiro" });
    }
    res.json({ mensagem: "Ficheiro apagado com sucesso" });
  });
});

router.get("/curso/:id/alunos", (req, res) => {
  const cursoId = req.params.id;

  const sql = `
    SELECT u.id AS utilizador_id, u.nome, u.email, i.data_inscricao
    FROM inscricoes i
    JOIN alunos a ON a.id = i.id_aluno
    JOIN utilizadores u ON u.id = a.utilizador_id
    WHERE i.id_curso = ? AND i.estado_pagamento = 'pago'
  `;

  db.query(sql, [cursoId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar alunos inscritos:", err);
      return res.status(500).json({ erro: "Erro ao buscar alunos" });
    }
    res.json(results);
  });
});

router.post("/tarefas/:id/exercicio", (req, res) => {
  const idTarefa = req.params.id;
  const { pergunta, opcoes } = req.body;

  const sqlExercicio = "INSERT INTO exercicios (id_tarefa, pergunta, tipo) VALUES (?, ?, 'escolha_multipla')";

  db.query(sqlExercicio, [idTarefa, pergunta], (err, result) => {
    if (err) {
      console.error("Erro ao criar exercício:", err);
      return res.status(500).json({ erro: "Erro ao criar exercício" });
    }

    const idExercicio = result.insertId;
    const valoresOpcoes = opcoes.map(op => [idExercicio, op.texto_opcao, op.correta ? 1 : 0]);

    const sqlOpcoes = "INSERT INTO opcoes_exercicio (id_exercicio, texto_opcao, correta) VALUES ?";

    db.query(sqlOpcoes, [valoresOpcoes], (err2) => {
      if (err2) {
        console.error("Erro ao guardar opções:", err2);
        return res.status(500).json({ erro: "Erro ao guardar opções" });
      }

      res.json({ mensagem: "Exercício criado com sucesso" });
    });
  });
});

router.get("/tarefas/:id/exercicios", (req, res) => {
  const tarefaId = req.params.id;

  const sql = `
    SELECT e.id AS exercicio_id, e.pergunta, o.id AS opcao_id, o.texto_opcao, o.correta
    FROM exercicios e
    JOIN opcoes_exercicio o ON o.id_exercicio = e.id
    WHERE e.id_tarefa = ?
    ORDER BY e.id, o.id
  `;

  db.query(sql, [tarefaId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar exercícios:", err);
      return res.status(500).json({ erro: "Erro ao buscar exercícios" });
    }

    const exercicios = [];
    const mapa = {};

    results.forEach(row => {
      if (!mapa[row.exercicio_id]) {
        mapa[row.exercicio_id] = {
          id: row.exercicio_id,
          pergunta: row.pergunta,
          opcoes: []
        };
        exercicios.push(mapa[row.exercicio_id]);
      }

      mapa[row.exercicio_id].opcoes.push({
        id: row.opcao_id,
        texto_opcao: row.texto_opcao,
        correta: row.correta
      });
    });

    res.json(exercicios);
  });
});

router.delete("/exercicios/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM opcoes_exercicio WHERE id_exercicio = ?", [id], err => {
    if (err) {
      console.error("Erro ao apagar opções:", err);
      return res.status(500).json({ erro: "Erro ao apagar opções" });
    }

    db.query("DELETE FROM exercicios WHERE id = ?", [id], err2 => {
      if (err2) {
        console.error("Erro ao apagar exercício:", err2);
        return res.status(500).json({ erro: "Erro ao apagar exercício" });
      }

      res.json({ mensagem: "Exercício apagado com sucesso" });
    });
  });
});

module.exports = router;
