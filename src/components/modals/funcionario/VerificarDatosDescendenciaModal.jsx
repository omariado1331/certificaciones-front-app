import React from 'react';
import '../../../styles/modals/VerificarDatosDescendenciaModal.css';

const VerificarDatosDescendenciaModal = ({ isOpen, onClose, onConfirm, data, onBack }) => {
  if (!isOpen) return null;

  return (
    <div className="verificar-modal-overlay" onClick={onBack}>
      <div className="verificar-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="verificar-modal-header">
          <h2>Verificar Datos del Certificado</h2>
          <button className="close-button" onClick={onBack}>×</button>
        </div>

        <div className="verificar-modal-body">
          
          {/* Datos del Solicitante */}
          <section className="data-section">
            <h3>Datos del Solicitante</h3>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">CI Solicitante:</span>
                <span className="data-value">{data.ci_solicitante || '-'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Nombres Solicitante:</span>
                <span className="data-value">{data.nombres_solicitante || '-'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Correlativo Formulario:</span>
                <span className="data-value">{data.correlativo_formulario || '-'}</span>
              </div>
              <div className="data-item full-width">
                <span className="data-label">Texto Adicional:</span>
                <span className="data-value">{data.texto_certificado || '-'}</span>
              </div>
            </div>
          </section>

          {/* Datos del Progenitor */}
          <section className="data-section">
            <h3>Datos del Progenitor</h3>
            <div className="data-grid">
              <div className="data-item">
                <span className="data-label">Nombres Completos:</span>
                <span className="data-value">{data.nombres_progenitor || '-'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Primer Apellido:</span>
                <span className="data-value">{data.primer_apellido_progenitor || '-'}</span>
              </div>
              <div className="data-item">
                <span className="data-label">Segundo Apellido:</span>
                <span className="data-value">{data.segundo_apellido_progenitor || '-'}</span>
              </div>
            </div>
          </section>

          {/* Descendientes */}
          <section className="data-section">
            <h3>Descendientes ({data.descendientes?.length || 0})</h3>
            
            {data.descendientes && data.descendientes.length > 0 ? (
              <div className="table-responsive">
                <table className="verificar-table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Sistema</th>
                      <th>Nombres</th>
                      <th>1er Apellido</th>
                      <th>2do Apellido</th>
                      <th>Oficialia</th>
                      <th>Libro</th>
                      <th>Partida</th>
                      <th>F. Inscripción</th>
                      <th>Sexo</th>
                      <th>F. Nacimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.descendientes.map((desc, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <span className={`sistema-badge ${desc.sistema === 'REGINA' ? 'sistema-regina' : 'sistema-rcbio'}`}>
                            {desc.sistema || '-'}
                          </span>
                        </td>
                        <td>{desc.nombres || '-'}</td>
                        <td>{desc.primer_apellido || '-'}</td>
                        <td>{desc.segundo_apellido || '-'}</td>
                        <td>{desc.oficialia || '-'}</td>
                        <td>{desc.libro || '-'}</td>
                        <td>{desc.partida || '-'}</td>
                        <td>{desc.fecha_inscripcion}</td>
                        <td>{desc.sexo || '-'}</td>
                        <td>{desc.fecha_nacimiento}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-data">No hay descendientes registrados</p>
            )}
          </section>
        </div>

        <div className="verificar-modal-footer">
          <button className="btn-secondary" onClick={onBack}>
            Volver
          </button>
          <button className="btn-primary" onClick={onConfirm}>
            Crear Certificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificarDatosDescendenciaModal;
