import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const Navbar = () => {
  return (
    // Navbar completamente transparente con efecto blur
    <div className="navbar fixed top-0 w-full z-50 px-4 sm:px-8 py-4 bg-black/10 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-3 group">
          {/* Logo en cristal */}
          <div className="bg-white/10 p-2 rounded-xl border border-white/20 group-hover:bg-white/20 transition-all backdrop-blur-sm">
            <Home className="size-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide drop-shadow-sm">
            HOUSIO
          </span>
        </Link>
      </div>
      
      {/* Botón opcional de ayuda */}
      <div className="flex-none">
        <button className="btn btn-ghost btn-sm text-white/80 hover:text-white hover:bg-white/10">
          Ayuda
        </button>
      </div>
    </div>
  );
};

export default Navbar;