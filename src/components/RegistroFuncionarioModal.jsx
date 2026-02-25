import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RegistroFuncionarioModal.css';

const apiUrl = import.meta.env.VITE_API_URL;

const RegistroFuncionarioModal = ({ isOpen, onClose, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    ci: '',
    telefono: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`${apiUrl}/funcionario/me`, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Completa tus datos</h2>
          <p>Por favor, completa tu información personal para continuar</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombres">Nombres *</label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              placeholder="Ingresa tus nombres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido_paterno">Apellido Paterno *</label>
            <input
              type="text"
              id="apellido_paterno"
              name="apellido_paterno"
              value={formData.apellido_paterno}
              onChange={handleChange}
              required
              placeholder="Ingresa tu apellido paterno"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido_materno">Apellido Materno *</label>
            <input
              type="text"
              id="apellido_materno"
              name="apellido_materno"
              value={formData.apellido_materno}
              onChange={handleChange}
              required
              placeholder="Ingresa tu apellido materno"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ci">CI *</label>
            <input
              type="text"
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              required
              placeholder="Ingresa tu número de CI"
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Celular *</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="Ingresa tu número de celular"
            />
          </div>

          <div className="modal-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Datos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistroFuncionarioModal;