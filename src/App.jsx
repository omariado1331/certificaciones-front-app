import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/login';

// Layout de la pagina donde se renderiza el contenido
import DashboardLayout from './layouts/DashboardLayout'

// paginas del funcionario
import CertificadosPage from './pages/funcionario/CertificadosPage';
import InformacionPage from './pages/funcionario/InformacionPage';
import OficinasPage from './pages/funcionario/OficinasPage';
import NuevoCertificadoDesdendenciaPage from './pages/funcionario/NuevoCertificadoDescendenciaPage'

// paginas de administrador

// componente para rutas protegidas
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.rol !== allowedRole) {
    return <Navigate to={`/${user.rol}`} />;
  }

  return children;

}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rutas para el funcionario */}
      <Route path='/funcionario' element={
        <ProtectedRoute>
          <DashboardLayout/>
        </ProtectedRoute>
      }>
        {/* Rutas para el funcionario */}
        <Route index element={< Navigate to="informacion" />}/>
        <Route path='informacion' element={< InformacionPage />}/>
        <Route path='certificados' element={< CertificadosPage />}/>
        <Route path='oficinas' element={< OficinasPage />}/>
        <Route path='certificados/nuevo' element={ <NuevoCertificadoDesdendenciaPage /> }/>

      </Route>
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
