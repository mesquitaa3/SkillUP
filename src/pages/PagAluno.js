import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PagAluno = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const sessionExpiration = localStorage.getItem('sessionExpiration');

    // Se o cargo não estiver no localStorage ou a sessão expirou, redireciona para o login
    if (!role || !sessionExpiration || new Date().getTime() > sessionExpiration) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionExpiration');
      navigate('/login');
    } else if (role !== 'aluno') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Bem-vindo à página do Aluno!</h2>
      {/* Conteúdo da página */}
    </div>
  );
};

export default PagAluno;
