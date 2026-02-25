import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import RegistroFuncionarioModal from '../components/RegistroFuncionarioModal'
import logo from '../assets/sereci.png'; // Ajusta la ruta según donde tengas tu logo
import axios from 'axios';

const FuncionarioDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('info'); // info, certificados, oficinas
  const [funcionarioData, setFuncionarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const checkIfDataComplete = (data) => {

    if (!data) return false;

    // verificacion de los campos de informacion del funcionario
    return !(
      data.nombres === null && data.ci === null && (data.apellido_paterno === null || data.apellido_materno === null)
    );
  };

  useEffect(() => {
    const fetchFuncionarioData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/funcionario/me/informacion`);
        setFuncionarioData(response.data);

        // verificacion si los datos estan completos
        const isComplete = checkIfDataComplete(response.data);
        if (!isComplete) {
          setShowModal(true);
        }
      } catch (err) {
        setError('Error al cargar los datos del funcionario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFuncionarioData();  
  }, []);

  const handleDataSuccess = async () => {
    setShowModal(false);
    // recargar con los datos actualizados
    try {
      const response = await axios.get(`${apiUrl}/funcionario/me/informacion`);
      setFuncionarioData(response.data);
    } catch (err) {
      console.error('error al cargar los datos: ', err)
    }
  };

  const renderContent = () => {

    if (loading) {
      return (
        <div className='content-section loading-section'>
          <div className='loading-spinner'></div>
          <p>Cargando Informacion...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className='content-section error-section'>
          <p className='error-text'>{error}</p>
          <button onClick={ () => window.location.reload() } className='btn-primary'>
            Reintentar
          </button>
        </div>
      )
    }

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

              {/* Datos personales */}
              <div className="info-item">
                <label>Nombres:</label>
                <span>{funcionarioData?.nombres || '-' }</span>
              </div>

              <div className="info-item">
                <label>Apelido Paterno:</label>
                <span>{funcionarioData?.apellido_paterno || '-' }</span>
              </div>

              <div className="info-item">
                <label>Apelido Materno:</label>
                <span>{funcionarioData?.apellido_materno || '-' }</span>
              </div>

              <div className="info-item">
                <label>Carnet de Identidad:</label>
                <span>{funcionarioData?.ci || '-' }</span>
              </div>

              <div className="info-item">
                <label>Telefono:</label>
                <span>{funcionarioData?.telefono || '-' }</span>
              </div>

              <div className="info-item">
                <label>Oficina:</label>
                <span>{funcionarioData?.oficina_nombre  || 'No asignada' }</span>
              </div>

              <div className="info-item">
                <label>Dirección Oficina:</label>
                <span>{funcionarioData?.oficina_direccion || '—'}</span>
              </div>
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
          {/* <span className="navbar-title">CERTIFICACIONES SERECI</span> */}
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
            {user?.username}
          </span>
          <button onClick={logout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        {renderContent()}
      </main>

      {/* modal para completar los datos */}
      <RegistroFuncionarioModal
        isOpen={showModal}
        onClose={ () => setShowModal(false) }
        onSuccess={handleDataSuccess}
        user={user}
      />

    </div>
  );
};

export default FuncionarioDashboard;