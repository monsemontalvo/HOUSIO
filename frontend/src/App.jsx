import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className="font-sans"> {/* Agregamos font-sans para asegurar tipografía limpia */}
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App