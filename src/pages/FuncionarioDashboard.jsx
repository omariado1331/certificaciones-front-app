import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Dashboard.css';
import RegistroFuncionarioModal from '../components/RegistroFuncionarioModal'
import CertificadoPreviewModal from '../components/CertificadoPreviewModal'
import logo from '../assets/sereci.png';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const FuncionarioDashboard = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('info'); // info, certificados, oficinas
  const [funcionarioData, setFuncionarioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const [certificados, setCertificados] = useState([]);
  const [certificadosLoading, setCertificadosLoading] = useState(false);
  const [certificadosError, setCertificadosError] = useState('');

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10
  });

  // Estado para el modal de previsualización
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    certificadoId: null,
    previewUrl: null,
    loading: false
  });

  // variable para verificar si el funcionario tiene oficina asignada
  const tieneOficina = user?.oficinaId != null;

  const checkIfDataComplete = (data) => {

    if (!data) return false;

    // verificacion de los campos de informacion del funcionario
    return !(
      data.nombres === null && data.ci === null && (data.apellido_paterno === null || data.apellido_materno === null)
    );
  };

  // Carga de datos del funcionario
  useEffect(() => {
    const fetchFuncionarioData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/funcionario/me/informacion/`);
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

  // carga los certificados 
  useEffect(() => {
    if (activeSection === 'certificados' && tieneOficina){
      fetchCertificados(1);
    }
  }, [activeSection, tieneOficina]);

  const fetchCertificados = async (page=1) => {
    setCertificadosLoading(true);
    setCertificadosError('');

    try {
      const response = await axios.get(
        `${apiUrl}/funcionario/me/certificados/?page=${page}&page_size=${pagination.pageSize}`
      );
      setCertificados(response.data.results);
      console.log(certificados);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
        currentPage: page,
        pageSize: pagination.pageSize
      });
    } catch (err) {
      setCertificadosError('Error al cargar los certificados');
      console.error(err);
    } finally {
      setCertificadosLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchCertificados(newPage)
  };

  const handlePreview = async (certificadoId) => {
    setPreviewModal({
      isOpen: true,
      certificadoId,
      previewUrl: null,
      loading: true
    });

    try {
      const response = await axios.get(
        `${apiUrl}/certificados-descendencia/${certificadoId}/preview/`
      );

      setPreviewModal({
        isOpen: true,
        certificadoId,
        previewUrl: response.data.preview_url,
        loading: false,
        expiresIn: response.data.expires_in
      });



    } catch (err) {
      console.error('error al abrir el certificado:', err);
      setPreviewModal({
        isOpen: false,
        certificadoId: null,
        previewUrl: null,
        loading: false
      });
      alert('error al cargar el certificado');
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({
      isOpen: false,
      certificadoId: null,
      previewUrl: null,
      loading: false
    });
  };


  const handleDataSuccess = async () => {
    setShowModal(false);
    // recargar con los datos actualizados
    try {
      const response = await axios.get(`${apiUrl}/funcionario/me/informacion/`);
      setFuncionarioData(response.data);
    } catch (err) {
      console.error('error al cargar los datos: ', err)
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEstadoBadge = (estado) => {
    const estadoLower = estado?.toLowerCase();
    let className = 'badge';

    if (estadoLower === 'vigente'){
      className += ' active';
    } else if (estadoLower === 'expirado') {
      className += ' cancelled'
    }

    return <span className={className}>{estado}</span>
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
        if (!tieneOficina) {
          return (
            <div className="content-section access-denied">
              <div className="access-denied-icon">🚫</div>
              <h2>Acceso Restringido</h2>
              <p>No tienes una oficina asignada. No puedes acceder a la sección de certificados.</p>
              <p className="access-denied-hint">Contacta al administrador para que te asigne una oficina.</p>
            </div>
          );
        }
        return (
          <div className="content-section certificados-section">
            <div className="certificados-header">
              <h2>Certificados Emitidos</h2>
              <div className="certificado-stats">
                Total: <strong>{pagination.count}</strong> certificados
              </div>
            </div>

            {certificadosError && (
              <div className="error-message">
                {certificadosError}
              </div>
            )}

            {certificadosLoading ? (
              <div className="loading-section">
                <div className="loading-spinner">
                  <p>Cargando Certificados...</p>
                </div>
              </div>
            ) : (
              <> 
                <div className="table-responsive">
                  <table className="certificados-table">
                    <thead>
                      <tr>
                        <th>Correlativo</th>
                        <th>CI Solicitante</th>
                        <th>Nombres Solicitante</th>
                        <th>Estado</th>
                        <th>Oficina</th>
                        <th>Fecha de Emision</th>
                        <th>Previsualizacion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificados.length > 0 ? (
                        certificados.map((cert) => (
                          <tr key={cert.id}>
                            <td>
                              <span className='cert-numero'>{cert.numero_certificado}</span>
                            </td>
                            <td>{cert.ci_solicitante}</td>
                            <td>{cert.nombres_solicitante}</td>
                            <td>{renderEstadoBadge(cert.estado_certificado)}</td>
                            <td>{cert.nombre_oficina}</td>
                            <td>{formatDate(cert.fecha_emision)}</td>
                            <td>
                              <button 
                                className='action-button preview-btn'
                                onClick={() => handlePreview(cert.id)}
                                title='Previsualizar certificado'>
                                <i className='fa fa-file-text'></i>
                                Ver PDF
                              </button>
                            </td>
                          </tr>
                        )
                      )
                    ) : (
                      <tr>
                        <td colSpan="8" className='empty-table'>
                          No hay certificados emitidos
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>

                {/* PAGINACION */}
                {pagination.count>0 && (
                  <div className="pagination">
                    <button 
                      className='pagination-button'
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.previous}
                    >
                      &larr; Anterior
                    </button>

                    <span className='pagination-info'>
                      Pagina {pagination.currentPage} de {Math.ceil(pagination.count / pagination.pageSize)}
                    </span>

                    <button
                      className='pagination-button'
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.next}
                    >
                      Siguiente &rarr;
                    </button>

                  </div>
                )}
              </>
            )
            }
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

      <CertificadoPreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        previewUrl={previewModal.previewUrl}
        loading={previewModal.loading}
        certificadoId={previewModal.certificadoId}
      />

    </div>
  );
};

export default FuncionarioDashboard;