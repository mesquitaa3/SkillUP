// src/pages/RecuperarPasse.js
import React, { useState } from "react";
import axios from "axios";
import "../assets/styles/recuperarpasse.css";

const RecuperarPasse = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/recover", { email });
      alert(response.data.message); // Exibe a mensagem de sucesso ou erro
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
      alert("Erro ao enviar as instruções. Tente novamente.");
    }
  };

  return (
    <div className="recuperar-container">
      <form className="recuperar-form" onSubmit={handleSubmit}>
        <h2>Recuperar Palavra-Passe</h2>
        <p>Introduz o teu email e enviaremos instruções para redefinir a tua palavra-passe.</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar Instruções</button>
        <p className="back-to-login">
          <a href="/Login">Voltar ao Login</a>
        </p>
      </form>
    </div>
  );
};

export default RecuperarPasse;
