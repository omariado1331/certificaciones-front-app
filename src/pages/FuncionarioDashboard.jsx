import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import logo from '../assets/logo.png'; // Ajusta la ruta según donde tengas tu logo

const FuncionarioDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('info'); // info, certificados, oficinas

  const renderContent = () => {
    switch(activeSection) {
      case 'info':
        return (
          <div className="content-section">
            <h2>Información del Funcionario</h2>
            <div className="info-card">
              <div className="info-item">
                <label>Nombre de Usuario:</label>
                <span>{user?.username}</span>
              </div>
              <div className="info-item">
                <label>ID Funcionario:</label>
                <span>{user?.id}</span>
              </div>
              <div className="info-item">
                <label>Rol:</label>
                <span className="rol-badge">Funcionario</span>
              </div>
              {user?.oficinaId && (
                <div className="info-item">
                  <label>ID Oficina:</label>
                  <span>{user.oficinaId}</span>
                </div>
              )}
            </div>
          </div>
        );
      
      case 'certificados':
        return (
          <div className="content-section">
            <h2>Certificados de Ascendencia</h2>
            <div className="certificados-grid">
              <div className="certificado-card">
                <h3>Certificado de Ascendencia #001</h3>
                <p>Fecha de emisión: 23/02/2026</p>
                <p>Estado: <span className="badge active">Vigente</span></p>
                <button className="action-button">Ver Detalles</button>
              </div>
              <div className="certificado-card">
                <h3>Certificado de Ascendencia #002</h3>
                <p>Fecha de emisión: 22/02/2026</p>
                <p>Estado: <span className="badge active">Vigente</span></p>
                <button className="action-button">Ver Detalles</button>
              </div>
              <div className="certificado-card">
                <h3>Certificado de Ascendencia #003</h3>
                <p>Fecha de emisión: 21/02/2026</p>
                <p>Estado: <span className="badge pending">En Proceso</span></p>
                <button className="action-button">Ver Detalles</button>
              </div>
            </div>
          </div>
        );
      
      case 'oficinas':
        return (
          <div className="content-section">
            <h2>Oficinas Disponibles</h2>
            <div className="oficinas-grid">
              <div className="oficina-card">
                <h3>Oficina Central</h3>
                <p><strong>Dirección:</strong> Av. Principal #123</p>
                <p><strong>Teléfono:</strong> (591) 2-1234567</p>
                <p><strong>Horario:</strong> 8:00 AM - 4:00 PM</p>
                <button className="action-button secondary">Seleccionar</button>
              </div>
              <div className="oficina-card">
                <h3>Oficina Norte</h3>
                <p><strong>Dirección:</strong> Calle Secundaria #456</p>
                <p><strong>Teléfono:</strong> (591) 2-7654321</p>
                <p><strong>Horario:</strong> 9:00 AM - 5:00 PM</p>
                <button className="action-button secondary">Seleccionar</button>
              </div>
              <div className="oficina-card">
                <h3>Oficina Sur</h3>
                <p><strong>Dirección:</strong> Av. del Sur #789</p>
                <p><strong>Teléfono:</strong> (591) 2-9876543</p>
                <p><strong>Horario:</strong> 8:30 AM - 4:30 PM</p>
                <button className="action-button secondary">Seleccionar</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="dashboard funcionario-dashboard">
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo SERECI" className="navbar-logo" />
          <span className="navbar-title">CERTIFICACIONES SERECI</span>
        </div>
        
        <div className="navbar-center">
          <button 
            className={`nav-button ${activeSection === 'info' ? 'active' : ''}`}
            onClick={() => setActiveSection('info')}
          >
            Información del Funcionario
          </button>
          <button 
            className={`nav-button ${activeSection === 'certificados' ? 'active' : ''}`}
            onClick={() => setActiveSection('certificados')}
          >
            Certificados Ascendencia
          </button>
          <button 
            className={`nav-button ${activeSection === 'oficinas' ? 'active' : ''}`}
            onClick={() => setActiveSection('oficinas')}
          >
            Oficinas
          </button>
        </div>

        <div className="navbar-right">
          <span className="user-info">
            {user?.username} ({user?.rol})
          </span>
          <button onClick={logout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default FuncionarioDashboard;