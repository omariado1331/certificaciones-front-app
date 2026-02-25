import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import '../styles/CertificadoPreviewModal.css';

const CertificadoPreviewModal = ({ isOpen, onClose, previewUrl, loading, certificadoId }) => {
  const [pdfContent, setPdfContent] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  useEffect(() => {
    if (previewUrl && isOpen) {
      fetchPdfWithAuth();
    }
  }, [previewUrl, isOpen]);

  const fetchPdfWithAuth = async () => {
    setPdfLoading(true);
    setPdfError('');
    
    try {
      const response = await axios.get(previewUrl, {
        responseType: 'blob'
      });
      
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfContent(pdfUrl);
      
    } catch (err) {
      console.error('Error al cargar PDF:', err);
      setPdfError('Error al cargar el PDF');
    } finally {
      setPdfLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="preview-modal-overlay" onClick={onClose}>
      <div className="preview-modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <h3>Previsualizar Certificado #{certificadoId}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="preview-modal-body">
          {loading || pdfLoading ? (
            <div className="preview-loading">
              <div className="loading-spinner"></div>
              <p>Cargando previsualización...</p>
            </div>
          ) : pdfError ? (
            <div className="preview-error">
              <p>{pdfError}</p>
              <button className="btn-primary" onClick={fetchPdfWithAuth}>
                Reintentar
              </button>
            </div>
          ) : pdfContent ? (
            <iframe
              src={pdfContent}
              className="pdf-iframe"
              title={`Certificado ${certificadoId}`}
            />
          ) : (
            <div className="preview-error">
              <p>No se pudo cargar el PDF</p>
            </div>
          )}
        </div>
        
        <div className="preview-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
          {pdfContent && (
            <a
              href={pdfContent}
              download={`certificado-${certificadoId}.pdf`}
              className="btn-primary"
            >
              Descargar
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

CertificadoPreviewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  previewUrl: PropTypes.string,
  loading: PropTypes.bool,
  certificadoId: PropTypes.number
};

export default CertificadoPreviewModal;