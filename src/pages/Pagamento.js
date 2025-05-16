import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalButtons } from '@paypal/react-paypal-js';
import '../assets/styles/pagamento.css'; 
import '../assets/styles/cursos.css'; 

const Pagamento = () => {
  const [curso, setCurso] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const cursoId = queryParams.get('cursoId');
  const navigate = useNavigate();

  useEffect(() => {
    if (cursoId) {
      fetch(`http://localhost:3001/api/cursos/${cursoId}`)
        .then(response => response.json())
        .then(data => {
          setCurso(data);
        })
        .catch(error => {
          console.error('Erro ao buscar curso:', error);
        });
    }
  }, [cursoId]);

  const handleApprove = (data, actions) => {
  actions.order.capture().then(function (details) {
    alert(`Pagamento bem-sucedido! ${details.payer.name.given_name}`);

    //Simular ID do aluno autenticado (podes ajustar com o login real)
    const alunoId = localStorage.getItem('alunoId'); //ou usa um contexto/login real

    fetch(`http://localhost:3001/api/aluno/${alunoId}/inscrever`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cursoId }),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.mensagem);
        navigate('/aluno/cursos'); //redirecionar após inscrição
      })
      .catch(error => {
        console.error('Erro ao registar inscrição:', error);
      });
  });
};


  const formatarPreco = (preco) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(preco);
  };

  return (
    <div className="pagamento-container">
      <div className="pagamento-card">
        <h1>Finalizar Compra</h1>
        {curso ? (
          <div className="curso-detalhes">
            <h2>{curso.titulo}</h2>
            <p className="descricao"><strong>Descrição:</strong> {curso.descricao}</p>
            <p><strong>Duração:</strong> {curso.duracao}</p>
            <p className="preco"><strong>Preço:</strong> {formatarPreco(curso.preco)}</p>

            <div className="">
              <PayPalButtons 
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: curso.preco,
                        },
                      },
                    ],
                  });
                }}
                onApprove={handleApprove}
              />
            </div>
          </div>
        ) : (
          <p>Carregar detalhes do curso...</p>
        )}
      </div>
    </div>
  );
};

export default Pagamento;
