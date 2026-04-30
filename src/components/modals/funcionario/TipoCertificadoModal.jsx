import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../../../styles/funcionario/TipoCertificadoModal.css';

const TipoCertificadoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleSeleccionar = (tipo) => {
    onClose();
    
    switch(tipo) {
      case 'descendencia':
        navigate('/funcionario/certificados/nuevo-certificado-descendencia');
        break;
      case 'ascendencia':
        navigate('/funcionario/certificados/nuevo-certificado-ascendencia');
        break;
      case 'partida':
        navigate('/funcionario/certificados/nuevo-partida-unica');
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tipo-certificado-overlay" onClick={onClose}>
      <div className="tipo-certificado-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Seleccionar Tipo</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <button 
            className="opcion-button"
            onClick={() => handleSeleccionar('descendencia')}
          >
            <i className="fas fa-file"></i>
            <span>Certificado de Descendencia</span>
            <i className="fas fa-chevron-right"></i>
          </button>

          <button 
            className="opcion-button"
            onClick={() => handleSeleccionar('ascendencia')}
          >
            <i className="fas fa-file"></i>
            <span>Certificado de Ascendencia</span>
            <i className="fas fa-chevron-right"></i>
          </button>

          <button 
            className="opcion-button"
            onClick={() => handleSeleccionar('partida')}
          >
            <i className="fas fa-file-alt"></i>
            <span>Partida Única</span>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

TipoCertificadoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TipoCertificadoModal;