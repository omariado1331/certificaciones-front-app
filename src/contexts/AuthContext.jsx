import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userData = localStorage.getItem('user');
    
    if (accessToken && refreshToken && userData) {
      setTokens({
        access: accessToken,
        refresh: refreshToken
      });
      setUser(JSON.parse(userData));
      
      // Configurar axios para usar el token en todas las peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
    setLoading(false);
  }, []);

  const login = (tokens, userData) => {
    console.log('Guardando tokens:', tokens);
    console.log('Guardando usuario:', userData);
    
    // Guardar tokens
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(userData));

    setTokens(tokens);
    setUser(userData);
    
    // Redireccionar según el rol
    if (userData.rol === 'administrador') {
      navigate('/administrador');
    } else {
      navigate('/funcionario');
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    delete axios.defaults.headers.common['Authorization'];
    
    setTokens(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    tokens,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};