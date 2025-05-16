import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/aluno.css';

const PagAluno = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const sessionExpiration = localStorage.getItem('sessionExpiration');

    if (!role || !sessionExpiration || new Date().getTime() > sessionExpiration) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionExpiration');
      navigate('/login');
    } else if (role !== 'aluno') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="pag-aluno-container">
      <h2 className="pag-aluno-title">Bem-vindo de volta, Aluno!</h2>

      <div className="info-cards">
        <div className="card">
          <h3>Cursos Adquiridos</h3>
          <p>3 cursos ativos</p>
        </div>
        <div className="card">
          <h3>Progresso Total</h3>
          <p>72% completo</p>
        </div>
        <div className="card">
          <h3>Horas de Estudo</h3>
          <p>120h no total</p>
        </div>
      </div>

      <div className="graficos-section">
        <h3>Desempenho em Gráficos</h3>
        <div className="grafico-placeholder">[ Gráfico aqui futuramente ]</div>
      </div>
    </div>
  );
};

export default PagAluno;
