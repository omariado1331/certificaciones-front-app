import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <img src="/logo.png" alt="Logo" className="header-logo" />
          <h1>Panel de Administrador</h1>
        </div>
        <button onClick={logout} className="logout-button">
          Cerrar Sesión
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="welcome-card">
          <h2>Bienvenido, Administrador</h2>
          <p>Email: {user?.email}</p>
          <p>ID: {user?.id}</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Estadísticas</h3>
            <p>Contenido exclusivo para administradores</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;