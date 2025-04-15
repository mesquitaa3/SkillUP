import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });

      const { cargo } = response.data;

      // Armazenar o cargo no localStorage e o tempo de expiração da sessão
      localStorage.setItem('userRole', cargo);
      const expirationTime = new Date().getTime() + 15 * 60 * 1000; // Sessão expira em 15 minutos
      localStorage.setItem('sessionExpiration', expirationTime);

      // Redirecionar para a página correta com base no cargo
      if (cargo === 'aluno') {
        navigate('/aluno');
      } else if (cargo === 'instrutor') {
        navigate('/instrutor');
      } else {
        alert('Cargo não reconhecido.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
