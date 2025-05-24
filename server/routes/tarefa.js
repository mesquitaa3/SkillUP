const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = require('../db'); // ✅ importa a instância centralizada


// Rota: GET /api/tarefa/:id/exercicios
router.get('/:id/exercicios', (req, res) => {
  const tarefaId = req.params.id;
  console.log("📥 Buscar exercícios da tarefa:", tarefaId);

  const queryExercicios = `
    SELECT id, pergunta
    FROM exercicios
    WHERE id_tarefa = ?
  `;

  db.query(queryExercicios, [tarefaId], (err, exercicios) => {
    if (err) {
      console.error("Erro ao buscar exercícios:", err);
      return res.status(500).json({ erro: 'Erro ao buscar exercícios' });
    }

    // Nenhum exercício — retorna array vazio
    if (exercicios.length === 0) {
      return res.json([]);
    }

    // Para cada exercício, buscar as opções
    const promises = exercicios.map(ex => {
      return new Promise((resolve, reject) => {
        db.query(
          'SELECT id, texto_opcao AS texto, correta FROM opcoes_exercicio WHERE id_exercicio = ?',
          [ex.id],
          (err2, opcoes) => {
            if (err2) {
              console.error("Erro ao buscar opções:", err2);
              return reject(err2);
            }
            resolve({ ...ex, opcoes });
          }
        );
      });
    });

    // Responder ao cliente com os exercícios + opções
    Promise.all(promises)
      .then(result => res.json(result))
      .catch(err => {
        console.error("Erro ao processar exercícios:", err);
        res.status(500).json({ erro: 'Erro ao processar exercícios' });
      });
  });
});

module.exports = router;
