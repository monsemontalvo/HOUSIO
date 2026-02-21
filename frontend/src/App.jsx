import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HelpPage from './pages/HelpPage';
import EditProfilePage from './pages/EditProfilePage';
import DetailsPage from './pages/DetailsPage';
import ScheduleVisitPage from './pages/ScheduleVisitPage'; // Página para AGENDAR (Calendario)
import ChatPage from './pages/ChatPage';
import MyVisitsPage from './pages/MyVisitsPage'; // <--- NUEVO NOMBRE (Lista de visitas)

import { useAuthStore } from './store/useAuthStore';

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        <Route path='/' element={!authUser ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path='/dashboard' element={authUser ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <EditProfilePage /> : <Navigate to="/" />} />
        <Route path='/help' element={<HelpPage />} />
        <Route path='/product/:id' element={authUser ? <DetailsPage /> : <Navigate to="/" />} />
        
        {/* Ruta para AGENDAR una nueva cita */}
        <Route path='/schedule/:id' element={authUser ? <ScheduleVisitPage /> : <Navigate to="/" />} />
        
        {/* Ruta para ver la LISTA DE VISITAS (Usamos el nuevo componente) */}
        <Route path='/visits' element={authUser ? <MyVisitsPage /> : <Navigate to="/" />} />
        
        <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to="/" />} />

        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App;