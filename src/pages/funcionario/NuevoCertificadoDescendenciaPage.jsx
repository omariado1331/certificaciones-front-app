import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import VerificarDatosDescendenciaModal from "../../components/modals/funcionario/VerificarDatosDescendenciaModal";
import '../../styles/funcionario/NuevoCertificadoDescendenciaPage.css'
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const NuevoCertificadoDescendenciaPage = () => {
    const navigate = useNavigate();
    const user = useAuth();

    const [formData, setFormData] = useState({
        ci_solicitante: '',
        nombres_solicitante: '',
        correlativo: '',
        texto_adicional: ''
    });

    const [textoProcesar, setTextoProcesar] = useState('');
    const [descendientes, setDescendientes] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [procesando, setProcesando] = useState(false);

    // estados para el modal de previsualizacion
    const [verificarModalOpen, setVerificarModalOpen] = useState(false);
    const [datosVerificar, setDatosVertificar] = useState(null);

    const [datosProgenitor, setDatosProgenitor] = useState({
        nombres: '',
        primer_apellido: '',
        segundo_apellido: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTextChange = (e) => {
        setTextoProcesar(e.target.value);
    };
    
    // funcion para procesar el texto de la consulta al sistema Rubio
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
                datos_progenitor: {
                   nombres: datosProgenitor.nombres,
                    primer_apellido: datosProgenitor.primer_apellido,
                    segundo_apellido: datosProgenitor.segundo_apellido,  
                },
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

    // funcion para extraer el valor despues de los dos puntos
    const extraerValor = (linea) => {
        const partes = linea.split(':');
        if (partes.length > 1) {
            return partes.slice(1).join(':').trim();
        }
        return '';
    }

    const handleProcesarTexto = () => {
        if (!textoProcesar.trim()) {
            alert('copie el texto para procesar')
            return;
        } 

        setProcesando(true);

        const resultado = procesarTextoRubio(textoProcesar);

        if (resultado) {
            setDescendientes(resultado.descendientes);
            setDatosProgenitor(resultado.datos_progenitor);

        } else {
            alert('No se pudo procesar el texto');
        } 
        setProcesando(false);
    };

    // funcion para seleccionar los descendientes de la tabla
    const handleSelectedRows = (index) => {
        setSelectedRows(prev => 
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // funcion para seleccionar todos los descendientes
    const handleSelectedAll = () => {
        if (selectedRows.length == descendientes.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(descendientes.map((_, index) => index));
        }
    };

    // funcion para abrir el modal de verificacion de datos
    const handleVerificarDatos = () => {
        const ciSolicitante = document.getElementById('ci_solicitante')?.value;
        const nombresSolicitante = document.getElementById('nombres_solicitante')?.value;

        if (!(ciSolicitante && nombresSolicitante)){
            alert('LOS CAMPOS DE CARNET SOLICITANTE Y NOMBRES DE SOLICITANTE SON REQUERIDOS')
            return;
        }

        const certificadoData = makeDataCertificado();

        setDatosVertificar(certificadoData);
        setVerificarModalOpen(true);
    };

    const makeDataCertificado = () => {
        const ciSolicitante = document.getElementById('ci_solicitante')?.value || '';
        const nombresSolicitante = document.getElementById('nombres_solicitante')?.value || '';
        const correlativoFormulario = document.getElementById('correlativo')?.value || '';
        const textoAdicional = document.getElementById('texto_adicional')?.value || '';

        const descendientesSeleccionados = descendientes.filter((_, index) => 
            selectedRows.includes(index)
        );

        const data = {
            //datos del formulario
            ci_solicitante: ciSolicitante,
            nombres_solicitante: nombresSolicitante,
            correlativo_formulario: correlativoFormulario,
            texto_adicional: textoAdicional,

            // datos del progenitor
            nombres_progenitor: datosProgenitor.nombres,
            primer_apellido_progenitor: datosProgenitor.primer_apellido,
            segundo_apellido_progenitor: datosProgenitor.segundo_apellido,

            // descendientes 
            descendientes: descendientesSeleccionados.map( desc => ({
                nombres: desc.nombres,
                primer_apellido: desc.primer_apellido,
                segundo_apellido: desc.segundo_apellido,
                oficialia: desc.oficialia,
                libro: desc.libro,
                partida: desc.partida,
                fecha_inscripcion: desc.fecha_inscripcion,
                sexo: desc.sexo,
                fecha_nacimiento: desc.fecha_nacimiento,
                sistema: desc.sistema
            }))
        };
        return data;
    };

    const handleConfirmarCreacion = async () =>{
        try {
            // aqui peticion axios
            console.log(JSON.stringify(datosVerificar, null, 2));

            setVerificarModalOpen(false);

            // limpiar los datos del texto procesado
            setTextoProcesar('');
            setDescendientes([]);
            setSelectedRows([]);
            setDatosProgenitor(null);

            alert('CREADO EXITOSAMENTE');


        } catch (err) {
            console.error('ERROR AL CREAR CERTIFICADO', err);
            alert('error al crear el certificado')
        }
    };

    const handleVolver = () => {
        setVerificarModalOpen(false);
    };

    return(
        <div className="nuevo-certificado-page">
            <div className="page-header">
                <h2>Nuevo Certificado de Descendencia</h2>
                <button className="btn-volver" onClick={() => navigate('/funcionario/certificados')}>
                <i className="fas fa-arrow-left"></i>
                Volver
                </button>
            </div>

            <div className="page-content">

                {/* Dos columnas */}
                <div className="two-columns">

                    {/* Columna izquierda */}
                    <div className="left-column">
                        <h3>Datos del Solicitante</h3>

                        <div className="form-group">
                            <label>CI Solicitante</label>
                            <input 
                                type="text" 
                                name="ci_solicitante"
                                value={formData.ci_solicitante}
                                onChange={handleInputChange}
                                placeholder="Ingrese CI del Solicitante"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Nombres del Solicitante</label>
                            <input 
                                type="text"
                                name="nombres_solicitante"
                                value={formData.nombres_solicitante}
                                onChange={handleInputChange}
                                placeholder="Ingrese el nombre completo del solicitante" 
                            />
                        </div>

                        <div className="form-group">
                            <label>CORRELATIVO FORMULARIO</label>
                            <input
                                type="text"
                                name="correlativo"
                                value={formData.correlativo}
                                onChange={handleInputChange}
                                placeholder="N° de formulario"
                            />
                        </div>

                        <div className="form-group">
                            <label>TEXTO ADICIONAL</label>
                            <textarea
                                name="texto_adicional"
                                value={formData.texto_adicional}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Ingrese texto adicional si corresponde"
                            />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="right-column">
                        <h3>Procesar Texto (Sistema Rubio)</h3>
                        
                        <div className="form-group">
                            <label>Copie aquí el texto del Rubio</label>
                            <textarea
                                className="texto-procesar-area"
                                value={textoProcesar}
                                onChange={handleTextChange}
                                rows="16"
                                placeholder="Pegue aquí el texto con los datos de los descendientes..."
                            />
                        </div>

                        <button
                            className="btn-procesar"
                            onClick={handleProcesarTexto}
                            disabled={procesando}
                        >
                            <i className="fas fa-cog"></i>
                            {procesando ? 'Procesando...' : 'Procesar Texto'}
                        </button>

                        {datosProgenitor.nombres && (
                            <div className="progenitor-info">
                                <h4>Progenitor:</h4>
                                <p>{datosProgenitor.nombres} {datosProgenitor.primer_apellido} {datosProgenitor.segundo_apellido}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* TABLA DE DESCENDIENTES */}
                <div className="tabla-descendientes-container">
                    <div className="table-header">
                        <h3>Descendientes {descendientes.length > 0 && `(${descendientes.length})`}</h3>
                        { descendientes.length > 0 && (
                            <div className="table-actions">
                                <span className="selected-count">
                                    {selectedRows.length} seleccionados
                                </span>
                                <button className="btn-seleccionar-todos" onClick={handleSelectedAll}>
                                    {selectedRows.length === descendientes.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="descendientes-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedRows.length === descendientes.length && descendientes.length > 0} 
                                            onChange={handleSelectedRows}
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
                                    <th>FECHA NACIMIENTO</th>
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
                                {descendientes.length > 0 ?(
                                    descendientes.map((desc, index) => (
                                        <tr key={index} className={selectedRows.includes(index) ? 'selected-row' : ''}>
                                            <td>
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedRows.includes(index)}
                                                    onChange={() => handleSelectedRows(index)}
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
                                            <td>{desc.fecha_nacimiento || '-'}</td>
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
                                        <td colSpan="20" className="empty-table">
                                            No hay descendientes. Procese un texto para cargar datos.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* FOOTER CON BOTONES DE ACCION */}
                <div className="page-actions">
                    <button className="btn-secondary" onClick={() => navigate('/funcionario/certificados')}>
                        Cancelar
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleVerificarDatos}
                        disabled={!formData.ci_solicitante || !formData.nombres_solicitante}
                    >
                        Verificar Datos
                    </button>
                </div>                  
            </div>

            <VerificarDatosDescendenciaModal
                isOpen={verificarModalOpen}
                onClose={ () => setVerificarModalOpen(false) }
                onConfirm={handleConfirmarCreacion}
                onBack={ () => setVerificarModalOpen(false)}
                data={datosVerificar}
            />
        </div>
    );
};

export default NuevoCertificadoDescendenciaPage;