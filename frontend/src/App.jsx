import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import HelpPage from './pages/HelpPage'; // <--- Importamos la nueva página
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div className="font-sans bg-neutral-950 min-h-screen text-white">
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/help' element={<HelpPage />} /> 
      </Routes>
      <Toaster />
    </div>
  )
}

export default App