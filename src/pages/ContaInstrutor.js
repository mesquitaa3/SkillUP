// ContaInstrutor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/conta.css';

const ContaInstrutor = () => {
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
      const response = await axios.put(`http://localhost:3001/api/instrutor/${id}`, {
        email,
        passe: novaPasse,
      });
      alert('Dados atualizados com sucesso!');
      const updatedData = { ...userData };
      delete updatedData.novaPasse;
      localStorage.setItem('userData', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
      alert('Erro ao atualizar os dados.');
    }
  };

  return (
      <div className="conta-wrapper">
    <div className="conta-container">
      <h2>Conta do Instrutor</h2>
      <form className="conta-form" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        <div className="campo">
          <label>Nome:</label>
          <span>{userData.nome}</span>
        </div>
        <div className="campo">
          <label>Email:</label>
          <input type="email" name="email" value={userData.email} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Nova Palavra-passe:</label>
          <input type="password" name="novaPasse" value={userData.novaPasse} onChange={handleChange} />
        </div>
        <div className="campo">
          <label>Data de Criação:</label>
          <span>{new Date(userData.data_criacao).toLocaleString()}</span>
        </div>
        <button type="submit">Guardar Alterações</button>
      </form>
    </div>
    </div>
  );
};

export default ContaInstrutor;
