import React, { useState } from 'react';
import '../styles/NuevoCertificadoAscendenciaModal.css';

const NuevoCertificadoAscendenciaModal = ({ isOpen, onClose, onSuccess }) => {
  const [textoProcesar, setTextoProcesar] = useState('');
  const [descendientes, setDescendientes] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleTextChange = (e) => {
    setTextoProcesar(e.target.value);
  };

  const procesarTextoRubio = (texto) => {
    try {
        const lineas = texto.split('\n')

        let datosProgenitor = {
            nombres: '',
            primer_apellido: '',
            segundo_apellido: ''
        };

        let descendientes = [];
        let sistemaActual = '';
        let descendienteActual = null;

        // Expresiones regulares para detectar patrones
        const regexSistemaRegina = /Registro Civil Histórico - Regina/i;
        const regexSistemaRCBIO = /Registro Civil - RC-BIO/i;
        const regexNuevoRegistro = /NAC (RCH|RC) \d+/i

        // Banderas para saber si estamos en la seccion de personas
        let enDatosPersona = false; 
        let contadorLineasDatosPersona = 0;

        for (let i = 0; i < lineas.length; i++) {

            const linea = lineas[i].trim();
            
            // Detectar inicio de datos del progenitor
            if (linea.includes('Llenar los campos de la persona que busca la Filiación')) {
                enDatosPersona = true;
                contadorLineasDatosPersona = 0;
                continue;
            }

            // Extraccion de los datos del progenitor
            if (enDatosPersona && contadorLineasDatosPersona < 10) {
                if (linea.includes('Nombres')) {
                datosProgenitor.nombres = lineas[i + 1]?.trim() || '';
                }
                if (linea.includes('1er Apellido')) {
                datosProgenitor.primer_apellido = lineas[i + 1]?.trim() || '';
                }
                if (linea.includes('2do Apellido')) {
                datosProgenitor.segundo_apellido = lineas[i + 1]?.trim() || '';
                enDatosPersona = false; // Terminamos de leer datos de la persona
                }
                contadorLineasDatosPersona++;
            }

            // Detectar sistema
            if (regexSistemaRegina.test(linea)) {
                sistemaActual = 'REGINA';
                continue;
            }
            if (regexSistemaRCBIO.test(linea)) {
                sistemaActual = 'RC-BIO';
                continue;
            }

            // detectar el nuevo registro de descendiente
            if (regexNuevoRegistro.test(linea)){
                if (descendienteActual && Object.keys(descendienteActual).length > 0){
                    descendientes.push(descendienteActual);
                }

                descendienteActual = {
                    sistema: sistemaActual,
                    oficialia: '',
                    libro: '',
                    partida: '',
                    fecha_inscripcion: '',
                    nombres: '',
                    primer_apellido: '',
                    segundo_apellido: '',
                    fecha_nacimiento: '',
                    sexo: '',
                    nombres_padre: '',
                    primer_apellido_padre: '',
                    segundo_apellido_padre: '',
                    ci_padre: '',
                    nombres_madre: '',
                    primer_apellido_madre: '',
                    segundo_apellido_madre: '',
                    ci_madre: ''
                };
                continue;
            }

            // si se tiene un descendiente en construccion, se extraen sus datos
            if (descendienteActual) {
                if (linea.includes('Oficialia:')) {
                    descendienteActual.oficialia = extraerValor(linea);
                }
                else if (linea.includes('Libro:')) {
                    descendienteActual.libro = extraerValor(linea);
                }
                else if (linea.includes('Partida:')) {
                    descendienteActual.partida = extraerValor(linea);
                }
                else if (linea.includes('Fecha Inscripción:')) {
                    descendienteActual.fecha_inscripcion = extraerValor(linea);
                }
                else if (linea.includes('Nombres Nacido:')) {
                    descendienteActual.nombres = extraerValor(linea);
                }
                else if (linea.includes('1° Apellido Nacido:')) {
                    descendienteActual.primer_apellido = extraerValor(linea);
                }
                else if (linea.includes('2° Apellido Nacido:')) {
                    descendienteActual.segundo_apellido = extraerValor(linea);
                }
                else if (linea.includes('Fecha Nac Nacido:')) {
                    descendienteActual.fecha_nacimiento = extraerValor(linea);
                }
                else if (linea.includes('Sexo Nacido:')) {
                    descendienteActual.sexo = extraerValor(linea);
                }
                else if (linea.includes('Nombres Padre:')) {
                    descendienteActual.nombres_padre = extraerValor(linea);
                }
                else if (linea.includes('1er Apellido Padre:')) {
                    descendienteActual.primer_apellido_padre = extraerValor(linea);
                }
                else if (linea.includes('2do Apellido Padre:')) {
                    descendienteActual.segundo_apellido_padre = extraerValor(linea);
                }
                else if (linea.includes('N° Documento Padre')) {
                    descendienteActual.ci_padre = extraerValor(linea);
                }
                else if (linea.includes('Nombres Madre:')) {
                    descendienteActual.nombres_madre = extraerValor(linea);
                }
                else if (linea.includes('1er Apellido Madre:')) {
                    descendienteActual.primer_apellido_madre = extraerValor(linea);
                }
                else if (linea.includes('2do Apellido Madre:')) {
                    descendienteActual.segundo_apellido_madre = extraerValor(linea);
                }
                else if (linea.includes('N° Documento Madre')) {
                    descendienteActual.ci_madre = extraerValor(linea);
                }
            }
        }

        // Guardar el último descendiente
        if (descendienteActual && Object.keys(descendienteActual).length > 0) {
            descendientes.push(descendienteActual);
        }

        // generar el resultado
        const resultado = {
            nombres_progenitor: datosProgenitor.nombres,
            primer_apellido_progenitor: datosProgenitor.primer_apellido,
            segundo_apellido_progenitor: datosProgenitor.segundo_apellido,
            descendientes: descendientes.map(d => ({
                nombres: d.nombres,
                primer_apellido: d.primer_apellido,
                segundo_apellido: d.segundo_apellido,
                oficialia: d.oficialia,
                libro: d.libro,
                partida: d.partida,
                fecha_inscripcion: d.fecha_inscripcion,
                sexo: d.sexo,
                fecha_nacimiento: d.fecha_nacimiento,
                nombres_padre: d.nombres_padre,
                primer_apellido_padre: d.primer_apellido_padre,
                segundo_apellido_padre: d.segundo_apellido_padre,
                ci_padre: d.ci_padre,
                nombres_madre: d.nombres_madre,
                primer_apellido_madre: d.primer_apellido_madre,
                segundo_apellido_madre: d.segundo_apellido_madre,
                ci_madre: d.ci_madre,
                sistema: d.sistema // Agregamos el sistema para identificar el origen
            }))
        };
        return resultado;
        
    } catch (err) {
        console.error('error al procesar el texto', err);
        return null;
    }
  };

  // funcion para extraer el valor
  const extraerValor = (linea) => {
    const partes = linea.split(":");
    if (partes.length > 1){
        return partes.slice(1).join(':').trim();
    }
    return '';
  }

  const handleProcesarTexto = () => {
    if (!textoProcesar.trim()) {
        alert('copie el texto a procesar')
        return;
    }

    const resultado = procesarTextoRubio(textoProcesar);

    if (resultado && resultado.descendientes.length > 0) {
        setDescendientes(resultado.descendientes);
    } else {
        alert( 'no se pudieron extraer los datos del texto')
    }
  }


  const handleSelectRow = (index) => {
    setSelectedRows(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.length === descendientes.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(descendientes.map((_, index) => index));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nuevo-certificado-overlay" onClick={onClose}>
      <div className="nuevo-certificado-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header del modal */}
        <div className="modal-header">
          <h2>Nuevo Certificado de Ascendencia</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Contenido del modal */}
        <div className="modal-content">
          
          {/* Fila de dos columnas: izquierda (inputs) y derecha (texto) */}
          <div className="two-columns">
            
            {/* Columna Izquierda - Inputs */}
            <div className="left-column">
              <h3>Datos del Solicitante</h3>
              
              <div className="form-group">
                <label htmlFor="ci_solicitante">CI SOLICITANTE</label>
                <input
                  type="text"
                  id="ci_solicitante"
                  name="ci_solicitante"
                  placeholder="Ingrese CI del solicitante"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombres_solicitante">NOMBRES SOLICITANTE</label>
                <input
                  type="text"
                  id="nombres_solicitante"
                  name="nombres_solicitante"
                  placeholder="Ingrese nombres completos"
                />
              </div>

              <div className="form-group">
                <label htmlFor="correlativo">CORRELATIVO FORMULARIO</label>
                <input
                  type="text"
                  id="correlativo"
                  name="correlativo"
                  placeholder="N° de formulario"
                />
              </div>

              <div className="form-group">
                <label htmlFor="texto_adicional">TEXTO ADICIONAL</label>
                <textarea
                  id="texto_adicional"
                  name="texto_adicional"
                  rows="4"
                  placeholder="Ingrese texto adicional si corresponde"
                />
              </div>
            </div>

            {/* Columna Derecha - Cuadro de texto y botón procesar */}
            <div className="right-column">
              <h3>Texto a Procesar</h3>
              
              <div className="form-group">
                <label htmlFor="texto_procesar">Copie aquí el texto para procesar</label>
                <textarea
                  id="texto_procesar"
                  className="texto-procesar-area"
                  value={textoProcesar}
                  onChange={handleTextChange}
                  rows="12"
                  placeholder="Pegue aquí el texto con los datos de los descendientes..."
                />
              </div>

              <button 
                className="btn-procesar"
                onClick={handleProcesarTexto}
              >
                <i className="fas fa-cog"></i>
                Procesar Texto
              </button>
            </div>
          </div>

          {/* Tabla de Descendientes (ocupa todo el ancho) */}
          <div className="tabla-descendientes-container">
            <div className="tabla-header">
              <h3>Descendientes</h3>
              <div className="tabla-actions">
                <button className="btn-seleccionar-todos" onClick={handleSelectAll}>
                  {selectedRows.length === descendientes.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="descendientes-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.length === descendientes.length && descendientes.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>N°</th>
                    <th>SISTEMA</th>
                    <th>OFICIALIA</th>
                    <th>LIBRO</th>
                    <th>PARTIDA</th>
                    <th>FECHA INSCRIPCION</th>
                    <th>NOMBRE</th>
                    <th>APELLIDO PATERNO</th>
                    <th>APELLIDO MATERNO</th>
                    <th>SEXO</th>
                    <th>NOMBRE PADRE</th>
                    <th>PRIMER APELLIDO PADRE</th>
                    <th>SEGUNDO APELLIDO PADRE</th>
                    <th>CI PADRE</th>
                    <th>NOMBRE MADRE</th>
                    <th>PRIMER APELLIDO MADRE</th>
                    <th>SEGUNDO APELLIDO MADRE</th>
                    <th>CI MADRE</th>
                  </tr>
                </thead>
                <tbody>
                  {descendientes.length > 0 ? (
                    descendientes.map((desc, index) => (
                      <tr key={index} className={selectedRows.includes(index) ? 'selected-row' : ''}>
                        <td>
                          <input 
                            type="checkbox"
                            checked={selectedRows.includes(index)}
                            onChange={() => handleSelectRow(index)}
                          />
                        </td>
                        <td>{index + 1}</td>
                        <td>
                            <span className={`sistema-badge ${desc.sistema === 'REGINA' ? 'sistema-regina' : 'sistema-rcbio'}`}>
                                {desc.sistema || '-'}
                            </span>
                        </td>
                        <td>{desc.oficialia || '-'}</td>
                        <td>{desc.libro || '-'}</td>
                        <td>{desc.partida || '-'}</td>
                        <td>{desc.fecha_inscripcion || '-'}</td>
                        <td>{desc.nombres || '-'}</td>
                        <td>{desc.primer_apellido || '-'}</td>
                        <td>{desc.segundo_apellido || '-'}</td>
                        <td>{desc.sexo || '-'}</td>
                        <td>{desc.nombres_padre || '-'}</td>
                        <td>{desc.primer_apellido_padre || '-'}</td>
                        <td>{desc.segundo_apellido_padre || '-'}</td>
                        <td>{desc.ci_padre || '-'}</td>
                        <td>{desc.nombres_madre || '-'}</td>
                        <td>{desc.primer_apellido_madre || '-'}</td>
                        <td>{desc.segundo_apellido_madre || '-'}</td>
                        <td>{desc.ci_madre || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="18" className="empty-table">
                        No hay descendientes. Procese un texto para cargar datos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer con botones de acción */}
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-primary">
              Crear Certificado
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NuevoCertificadoAscendenciaModal;