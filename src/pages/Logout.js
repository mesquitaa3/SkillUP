// src/pages/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //apaga os dados da sessão
    localStorage.removeItem("userData");
    localStorage.removeItem("userRole");
    localStorage.removeItem("sessionExpiration");

    //redireciona para a página de login
    navigate("/login");
  }, [navigate]);

  return null;
};

export default Logout;
