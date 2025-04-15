// src/pages/CriarConta.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import "../assets/styles/criarconta.css"; // Importa o CSS

const CriarConta = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    passe: "",
    cargo: "aluno",
  });

  const navigate = useNavigate(); // Inicializando o useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/registo", formData);
      alert("Conta criada com sucesso!");

      // Redirecionar para a página correta com base no cargo
      if (formData.cargo === "aluno") {
        navigate("/aluno");
      } else {
        navigate("/instrutor");
      }
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  return (
    <div className="criar-conta-container">
      <form className="criar-conta-form" onSubmit={handleSubmit}>
        <h2>Criar Conta</h2>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="passe"
          placeholder="Palavra-passe"
          onChange={handleChange}
          required
        />
        <select name="cargo" onChange={handleChange} className="cargo">
          <option value="aluno">Aluno</option>
          <option value="instrutor">Instrutor</option>
        </select>
        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default CriarConta;