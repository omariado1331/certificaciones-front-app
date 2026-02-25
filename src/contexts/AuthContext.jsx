import React, { createContext, useState, useContext, useEffect, Children } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context){
    throw new Error('useAuth debe estar dentro de AuthProvider')
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // verificacion de sesion al cargar la aplicacion
  useEffect (() => {
    const checkSesion = () => {
      // primero sse verifica la sesion activa en la pestana
      const sessionData = sessionStorage.getItem('session');

      if (sessionData) {
        // hay una sesion activa en la pestana
        const { tokens: sessionTokens, user: sessionUser } = JSON.parse(sessionData);
        setTokens(sessionTokens);
        setUser(sessionUser);
        axios.defaults.headers.common['Authorization'] =  `Bearer ${sessionTokens.access}`;
      } else {
        // si no existe el SessionStorage , verificar en LocalStorage (rememberMe)
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('user');
        const rememberMe = localStorage.getItem('rememberMe') === true;

        if (accessToken && refreshToken && userData && rememberMe) {
          // se restaura la sesion desde localstorage
          const parsedUser = JSON.parse(userData);
          const tokensData = {
            access: accessToken,
            refresh: refreshToken
          };

          setTokens(tokensData);
          setUser(parsedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          // crear la nueva session en sessionStorage para esa pestana
          sessionStorage.setItem('session', JSON.stringify({
            tokens: tokensData,
            user: parsedUser
          }));
        }
      }
      setLoading(false);
    };
    checkSesion();
  }, []);
  
  // definimos el login
  const login = (tokens, userData, rememberMe=false) => {
    console.log('Guardando tokens:', tokens);
    console.log('Guardando usuario:', userData);
    console.log('Recordar sesión:', rememberMe);

    // SIEMPRE guardar en sessionStorage (sesión de la pestaña actual)
    sessionStorage.setItem('session', JSON.stringify({
      tokens: tokens,
      user: userData
    }));

    if (rememberMe) {
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('rememberMe', 'true');
    } else {
      // Asegurarse de limpiar localStorage si no quiere recordar sesión
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    }

    setTokens(tokens);
    setUser(userData);

    // configuracion de axios para incluir el token en todas las peticiones
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

    // redireccionar segun el rol
    if (userData.rol === 'adminstrador') {
      navigate('/administrador');
    } else {
      navigate('/funcionario');
    }
  };

  const logout = () => {
    // limpiar el sessionStorage
    sessionStorage.removeItem('session');

    // limpiar el localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');

    // limpiar los header de axios
    delete axios.defaults.headers.common['Authorization'];

    setTokens(null);
    setUser(null);
    navigate('/login');
  };

  const setRememberMe = (remember) => {
    if (remember && tokens && user) {
      localStorage.setItem('accessToken', tokens.access);
      localStorage.setItem('refreshToken', tokens.refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    }
  };

  const value = {
    user,
    tokens,
    login,
    logout,
    setRememberMe,
    loading
  }; 

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};
