import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../store/authContext';

export const ProtectedRoute = () => {
  const { token, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>; // O un spinner más elegante
  }

  return token ? <Outlet /> : <Navigate to="/login" />;
};
