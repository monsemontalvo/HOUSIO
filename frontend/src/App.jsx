import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

// Imports de Componentes y Páginas
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HelpPage from './pages/HelpPage';
import EditProfilePage from './pages/EditProfilePage'; // <--- Importamos la nueva página

import { useAuthStore } from './store/useAuthStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  // 1. VERIFICAR SESIÓN (Vital para no desconectarse al recargar)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 2. PANTALLA DE CARGA (Evita parpadeos feos)
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <Loader className="size-10 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="font-sans bg-neutral-950 min-h-screen text-white">
      <Navbar />
      
      <Routes>
        {/* HOME: Si ya estás logueado, te manda directo al Dashboard */}
        <Route path='/' element={!authUser ? <HomePage /> : <Navigate to="/dashboard" />} />
        
        {/* DASHBOARD (Protegido): Si NO estás logueado, te manda al Home */}
        <Route path='/dashboard' element={authUser ? <DashboardPage /> : <Navigate to="/" />} />
        
        {/* PERFIL (Protegido): Ojo, la ruta es '/profile' para coincidir con el Navbar */}
        <Route path='/profile' element={authUser ? <EditProfilePage /> : <Navigate to="/" />} />
        
        {/* AYUDA (Pública): Cualquiera puede entrar */}
        <Route path='/help' element={<HelpPage />} /> 

        {/* Cualquier ruta desconocida te manda al inicio */}
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App;