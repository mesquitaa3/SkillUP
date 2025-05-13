// src/pages/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Apaga apenas os dados da sessão
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("sessionExpiration");

    // Redireciona para login
    navigate("/login");
  }, [navigate]);

  return null; // Ou podes mostrar uma mensagem tipo "A terminar sessão..."
};

export default Logout;
