import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/login';
import AdminDashboard from './pages/AdminDashboard';
import FuncionarioDashboard from './pages/FuncionarioDashboard';

// componente para rutas protegidas
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.rol !== allowedRole) {
    return <Navigate to={`/${user.rol}`} />;
  }

  return children;

}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/administrador"
        element={
          <ProtectedRoute allowedRole="administrador">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/funcionario"
        element={
          <ProtectedRoute allowedRole="funcionario">
            <FuncionarioDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
