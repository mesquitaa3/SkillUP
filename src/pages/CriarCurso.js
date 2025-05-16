// src/pages/CriarCurso.js
import React, { useState } from "react";
import axios from "axios";

const CriarCurso = () => {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [duracao, setDuracao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = JSON.parse(localStorage.getItem("userData"));
    const instrutor_id = userData?.instrutor_id || localStorage.getItem("instrutorId");

    if (!instrutor_id) {
      alert("ID do instrutor não encontrado. Faz login novamente.");
      return;
    }

    if (!titulo || !descricao || !duracao || !preco) {
      alert("Preenche todos os campos obrigatórios.");
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("duracao", duracao);
    formData.append("preco", preco);
    formData.append("instrutor_id", instrutor_id);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/instrutor/criar-curso",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Curso criado com sucesso!");
      console.log("📦 Dados recebidos:", response.data);

      // Limpar campos
      setTitulo("");
      setDescricao("");
      setDuracao("");
      setPreco("");
      setImagem(null);
    } catch (error) {
      console.error("❌ Erro ao criar curso:", error);
      alert("Erro ao criar curso. Tente novamente.");
    }
  };

  return (
    <div className="criar-curso-container">
      <h2>Criar Curso</h2>
      <form onSubmit={handleSubmit} className="form-criar-curso">
        <input
          type="text"
          placeholder="Título do curso"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descrição do curso"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Duração (ex: 3 meses)"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Preço (€)"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagem(e.target.files[0])}
        />
        <button type="submit">Criar Curso</button>
      </form>
    </div>
  );
};

export default CriarCurso;
