// src/pages/RecuperarPasse.js
import React, { useState } from "react";
import "../assets/styles/recuperarpasse.css";

const RecuperarPasse = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui no futuro vais fazer a chamada à API
    alert("Se o email estiver registado, enviámos instruções para recuperar a palavra-passe.");
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
