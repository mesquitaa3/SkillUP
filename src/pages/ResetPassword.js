import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../assets/styles/recuperarpasse.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useParams(); // Obtém o token da URL

  useEffect(() => {
    // Verificar se o token é válido
    axios.post("http://localhost:3001/api/reset-password/validate", { token })
      .then((response) => {
        setMessage("Token válido. Pode agora redefinir a sua palavra-passe.");
      })
      .catch((error) => {
        setMessage("Token inválido ou expirado.");
      });
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("As palavras-passe não coincidem.");
    }

    try {
      const response = await axios.post("http://localhost:3001/api/reset-password", { token, newPassword });
      alert(response.data.message); // Mensagem de sucesso
    } catch (error) {
      console.error("Erro ao redefinir a palavra-passe:", error);
      alert("Erro ao redefinir a palavra-passe.");
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-form" onSubmit={handleSubmit}>
        <h2>Redefinir Palavra-Passe</h2>
        <p>{message}</p>
        <input
          type="password"
          placeholder="Nova palavra-passe"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar palavra-passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Redefinir</button>
        <p className="back-to-login">
          <a href="/Login">Voltar ao Login</a>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
