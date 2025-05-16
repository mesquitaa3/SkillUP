// components/PaypalButton.js
import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PaypalButton = ({ amount }) => {
  const handlePaymentSuccess = (details) => {
    console.log("Pagamento realizado com sucesso:", details);
    alert("Pagamento realizado com sucesso!");
    
  };

  return (
    <div>
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount, //valor a pagar
              },
            }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            handlePaymentSuccess(details);
          });
        }}
        onError={(err) => {
          console.error("Erro no pagamento:", err);
          alert("Erro ao processar o pagamento.");
        }}
      />
    </div>
  );
};

export default PaypalButton;
