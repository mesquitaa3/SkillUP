// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/styles/login.css"; // Importa o CSS

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/login", formData);

      const { cargo } = response.data;

      // Armazenar o cargo e o tempo de expiração
      localStorage.setItem("userRole", cargo);
      const expirationTime = new Date().getTime() + 15 * 60 * 1000; // 15 minutos
      localStorage.setItem("sessionExpiration", expirationTime);

      // Redirecionar com base no cargo
      if (cargo === "aluno") {
        navigate("/aluno");
      } else if (cargo === "instrutor") {
        navigate("/instrutor");
      } else {
        alert("Cargo não reconhecido.");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="main-login-content">
      <form className="login-container" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
          required
        />
        <button type="submit">Entrar</button>
        <p className="register-link">
          Não tem uma conta? <a href="/CriarConta">Registar</a>
        </p>
        <p className="forgot-password-link">
          <a href="/RecuperarPasse">Recuperar palavra-passe</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
