import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';
import logo from '../assets/sereci.png';
import '@fortawesome/fontawesome-free/css/all.min.css';

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rol: 'funcionario', // por defecto
    rememberMe: false
  });
  const[showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      
      const response = await axios.post(`${apiUrl}/login/`, {
        username: formData.username,
        password: formData.password,
      });
      
      const { access, refresh } = response.data;
      
     // Decodificar el token ACCESS para obtener los claims
      const tokenData = JSON.parse(atob(access.split('.')[1]));
      console.log('Token decodificado:', tokenData); // Para verificar la estructura
      
      // Determinar el rol basado en los claims
      let userRol = '';
      let userId = '';
      let oficinaId = '';
      
      if (tokenData.funcionario_id) {
        userRol = 'funcionario';
        userId = tokenData.funcionario_id;
        oficinaId = tokenData.oficina_id;
      } else if (tokenData.administrador_id) {
        userRol = 'administrador';
        userId = tokenData.administrador_id;
      }
      console.log('Rol determinado:', userRol);
      console.log('ID de usuario:', userId);
      console.log('ID de oficina:', oficinaId);
      console.log('Recordar sesión:', formData.rememberMe);

      login({ access, refresh }, { 
        rol: userRol, 
        id: userId, 
        username: formData.username,
        oficinaId: oficinaId || null
      }, formData.rememberMe);
      
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.detail || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h2>Bienvenido</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              type="username"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group password-field">
            <label htmlFor="password">Contraseña</label>
            <div className='password-input-wrapper'>
              <input 
                type={showPassword ? "text" : "password"}
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                placeholder='***********' 
              />
              
              <button
                type='button'
                className='toggle-password'
                onClick={ () => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>

            </div>
          </div>

          <div className="form-group">
            <label>Selecciona tu Rol</label>
            <div className="rol-selector">
              <label className="rol-option">
                <input
                  type="radio"
                  name="rol"
                  value="funcionario"
                  checked={formData.rol === 'funcionario'}
                  onChange={handleChange}
                />
                <span className="rol-label">Funcionario</span>
              </label>
              
              <label className="rol-option">
                <input
                  type="radio"
                  name="rol"
                  value="administrador"
                  checked={formData.rol === 'administrador'}
                  onChange={handleChange}
                />
                <span className="rol-label">Administrador</span>
              </label>
            </div>
          </div>

          <div className='form-group remember-me'>
            <label className='checkbox-label'>
              <input 
               type="checkbox"
               name='rememberMe'
               checked={formData.rememberMe}
               onChange={handleChange} 
              />
              <span> Recordar Sesion ?</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;