// ContaAluno.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/aluno.css';

const ContaAluno = () => {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    cargo: '',
    data_criacao: '',
    id: '',
    novaPasse: '',
  });

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== 'undefined') {
      try {
        const parsedData = JSON.parse(storedUserData);
        console.log('Dados do usuário carregados do localStorage:', parsedData);
        setUserData({ ...parsedData, novaPasse: '' });
      } catch (error) {
        console.error('Erro ao analisar os dados do usuário:', error);
      }
    } else {
      console.error('Nenhum dado de usuário encontrado no localStorage');
    }
  }, []);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const { email, novaPasse, id } = userData;
      const response = await axios.put(`http://localhost:3001/api/aluno/${id}`, {
        email,
        passe: novaPasse,
      });
      alert('Dados atualizados com sucesso!');
      console.log(response.data);

      // Atualizar localStorage
      const updatedData = { ...userData };
      delete updatedData.novaPasse;
      localStorage.setItem('userData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
      alert('Erro ao atualizar os dados.');
    }
  };

  return (
    <div className="conta-aluno-container">
      <h2 className="conta-aluno-title">Conta do Aluno</h2>

      <div className="info-conta">
        <div className="info-linha">
          <span className="info-label">Nome:</span>
          <span className="info-dado">{userData.nome}</span>
        </div>
        <div className="info-linha">
          <span className="info-label">Email:</span>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="info-dado"
          />
        </div>
        <div className="info-linha">
          <span className="info-label">Nova palavra-passe:</span>
          <input
            type="password"
            name="novaPasse"
            value={userData.novaPasse}
            onChange={handleChange}
            className="info-dado"
          />
        </div>
        <div className="info-linha">
          <span className="info-label">Data de Criação:</span>
          <span className="info-dado">
            {new Date(userData.data_criacao).toLocaleString()}
          </span>
        </div>
      </div>

      <br />
      <button onClick={handleUpdate}>Guardar Alterações</button>
    </div>
  );
};

export default ContaAluno;
