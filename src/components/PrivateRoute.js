import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const sessionExpiration = localStorage.getItem('sessionExpiration');

    // Verifica se o cargo não existe ou se a sessão expirou
    if (!storedRole || !sessionExpiration || new Date().getTime() > sessionExpiration) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('sessionExpiration');
    }
  }, []);

  const storedRole = localStorage.getItem('userRole');
  const sessionExpiration = localStorage.getItem('sessionExpiration');

  if (!storedRole || !sessionExpiration || new Date().getTime() > sessionExpiration || storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
