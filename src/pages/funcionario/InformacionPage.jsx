import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import RegistroFuncionarioModal from "../../components/modals/funcionario/RegistroFuncionarioModal";
import '../../styles/funcionario/InformacionPage.css'

const apiUrl = import.meta.env.VITE_API_URL;

const InformacionPage = () => {
    const { user } = useAuth();
    const [ funcionarioData, setFuncionarioData] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ showModal, setShowModal ] = useState(false);
    const [ error, setError ] = useState('');

    const checkIfDataComplete = (data) => {
        if (!data) return false;
        return !(
        data.nombres === null && data.ci === null && 
        (data.apellido_paterno === null || data.apellido_materno === null)
        );
    };

    useEffect (() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiUrl}/funcionario/me/informacion/`)
                setFuncionarioData(response.data);

                if (!checkIfDataComplete(response.data)) {
                    setShowModal(true);
                }
            } catch (err) {
                setError('ERROR AL CARGAR LOS DATOS');
                console.error('error', err)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    const handleDataSuccess = async () => {
        setShowModal(false);
        const response = axios.get(`${apiUrl}/funcionario/me/informacion/`);
        setFuncionarioData(response.data);
    };


    if (loading) {
        return <div className="loading-section">Cargando...</div>
    }

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

        <RegistroFuncionarioModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={handleDataSuccess}
            user={user}
        />
        </div>
    );
};

export default InformacionPage;