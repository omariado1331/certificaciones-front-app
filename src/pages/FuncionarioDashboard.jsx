import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const FuncionarioDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard funcionario-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <h1>Panel de Funcionario</h1>
        </div>
        <button onClick={logout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Bienvenido, Funcionario</h2>
          <p>Email: {user?.email}</p>
          <p>ID Funcionario: {user?.id}</p>
        </div>
        
        <div className="tasks-grid">
          <div className="task-card">
            <h3>Tareas Pendientes</h3>
            <p>Contenido para funcionarios</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FuncionarioDashboard;