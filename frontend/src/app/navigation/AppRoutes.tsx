import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LoginScreen from '../screens/LoginScreen';
// Importaremos los otros componentes cuando los separemos de App.tsx

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
          <Route path="/produccion" element={<div>Produccion Placeholder</div>} />
          <Route path="/ventas" element={<div>Ventas Placeholder</div>} />
          <Route path="/inventario" element={<div>Inventario Placeholder</div>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
