import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CertificadoPreviewModal from "../../components/modals/CertificadoPreviewModal";
import '../../styles/funcionario/CertificadosPage.css'


const apiUrl = import.meta.env.VITE_API_URL;

const CertificadosPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        pageSize: 10
    });

    const handlePageChange = (newPage) => {
        fetchCertificados(newPage)
    };

    // Estado para el modal de previsualización
    const [previewModal, setPreviewModal] = useState({
        isOpen: false,
        certificadoId: null,
        previewUrl: null,
        loading: false
    });

    // modal de previsualizacion
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

    const closePreviewModal = () => {
        setPreviewModal({
        isOpen: false,
        certificadoId: null,
        previewUrl: null,
        loading: false
        });
    };

    // render para estado de certificado
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

    const tieneOficina = user?.oficinaId != null;

    useEffect(() => {
        if (tieneOficina) {
            fetchCertificados(1);
        };
    }, [tieneOficina]);

    const fetchCertificados = async (page=1) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/funcionario/me/certificados/?page=${page}&page_size=${pagination.pageSize}`);
            setCertificados(response.data.results);
            setPagination({
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
                currentPage: page,
                pageSize: pagination.pageSize
            });
        } catch (err) {
            console.error('error al cargar los certificados', err)
        } finally {
            setLoading(false);
        }
    };

    if (!tieneOficina) {
        return(
            <div className="content-section access-denied">
                <div className="access-denied-icon">🚫</div>
                <h2>Acceso Restringido</h2>
                <p>No tiene una oficina asignada en sistema</p>
                <p>Contacte con el administrador para la asignacion de una oficina</p>
            </div>
        )
    }

    return(
        <div className="content-section certificados-section">

            {/* cabecera de la seccion de certificados emitidos */}
            <div className="certificados-header">
                <h2>Certificados emitidos</h2>
                <button
                    className="btn-nuevo-certificado"
                    onClick={() => navigate('/funcionario/certificados/nuevo/')}
                >
                    <i className="fas fa-plus"/>
                    Nuevo Certificado
                </button>
                <div className="certificado-stats">
                    Total: <strong>{pagination.count}</strong>
                </div>
            </div>

            {/* tabla de certificados emitidos */}
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
            )};

            <CertificadoPreviewModal
                isOpen={previewModal.isOpen}
                onClose={ closePreviewModal }
                previewUrl={previewModal.previewUrl}
                loading={previewModal.loading}
                certificadoId={previewModal.certificadoId}
            />
        </div>
    )
};

export default CertificadosPage;
