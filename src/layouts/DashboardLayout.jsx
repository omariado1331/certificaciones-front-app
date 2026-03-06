import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/sereci.png';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const navItems = [
    { path: 'informacion', label: 'Información del Funcionario', icon: 'fas fa-user' },
    { path: 'certificados', label: 'Certificados Descendencia', icon: 'fas fa-file-pdf' },
    { path: 'oficinas', label: 'Oficinas', icon: 'fas fa-building' }
  ];

  return (
    <div className="dashboard-layout">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo SERECI" className="navbar-logo" />
        </div>
        
        <div className="navbar-center">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-button ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <span className="user-info">
            <i className="fas fa-user-circle"></i>
            {user?.username}
          </span>
          <button onClick={logout} className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <Outlet /> {/* paginas hijas */}
      </main>
    </div>
  );
};

export default DashboardLayout;