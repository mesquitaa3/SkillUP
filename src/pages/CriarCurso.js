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
  
    const user = JSON.parse(localStorage.getItem("userData"));
    const instrutor_id = user?.instrutor_id;
  
    if (!instrutor_id) {
      alert("ID do instrutor não encontrado. Faz login novamente.");
      return;
    }
  
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("duracao", duracao);
    formData.append("preco", preco);
    formData.append("imagem", imagem); // ficheiro
    formData.append("instrutor_id", instrutor_id);
  
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
      alert("Curso criado com sucesso!");
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      alert("Erro ao criar curso.");
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Criar Curso</h2>
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="text"
        placeholder="Duração (horas)"
        value={duracao}
        onChange={(e) => setDuracao(e.target.value)}
      />
      <input
        type="text"
        placeholder="Preço (€)"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagem(e.target.files[0])}
      />
      <button type="submit">Criar Curso</button>
    </form>
  );
};

export default CriarCurso;
