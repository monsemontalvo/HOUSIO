import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Bell, User, HelpCircle, LogOut, MessageSquare, Calendar } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    // h-16 fija la altura, flex-nowrap evita que se bajen los iconos
    <div className="navbar fixed top-0 w-full z-50 px-2 sm:px-8 h-16 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 shadow-lg transition-all flex-nowrap">
      
      {/* --- LOGO --- */}
      <div className="flex-1 min-w-0">
        <Link to={authUser ? "/dashboard" : "/"} className="flex items-center gap-2 sm:gap-3 group text-nowrap">
          <div className="bg-white/10 p-2 rounded-xl border border-white/10 shadow-sm group-hover:bg-white/20 transition-all shrink-0">
            {/* Icono un poco más pequeño en móvil */}
            <Home className="size-5 sm:size-6 text-orange-500" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
            HOUSIO
          </span>
        </Link>
      </div>

      {/* --- ICONOS --- */}
      {/* gap-0.5 en móvil para que quepan todos apretaditos pero bien */}
      <div className="flex-none flex items-center gap-0.5 sm:gap-2 flex-nowrap">
        {authUser ? (
          <>
            {/* 1. CITAS */}
            <Link to="/visits" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <Calendar className="size-5" />
            </Link>

            {/* 2. MENSAJES */}
            <Link to="/chat" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <div className="indicator">
                <MessageSquare className="size-5" />
                <span className="badge badge-xs badge-primary indicator-item bg-blue-500 border-none scale-75 sm:scale-100"></span>
              </div>
            </Link>

            {/* 3. AYUDA */}
            <Link to="/help" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <HelpCircle className="size-5 sm:size-6" />
            </Link>

            {/* 4. NOTIFICACIONES */}
            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <div className="indicator">
                <Bell className="size-5 sm:size-6" />
                <span className="badge badge-xs badge-error indicator-item bg-orange-500 border-none scale-75 sm:scale-100"></span>
              </div>
            </button>

            {/* Separador Vertical */}
            <div className="h-6 w-px bg-white/10 mx-1 sm:mx-2 shrink-0"></div>

            {/* 5. MENÚ DE PERFIL */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar btn-sm sm:btn-md border border-white/10">
                <div className="w-8 sm:w-10 rounded-full">
                  <img alt="Perfil" src={authUser.profilePic || "/UserPlaceholder.png"} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral-900 border border-white/10 rounded-box w-52 text-gray-300">
                <li>
                  <Link to="/profile" className="hover:text-orange-400 hover:bg-white/5">
                    <User className="size-4" /> Editar Perfil
                  </Link>
                </li>
                <div className="divider my-1 border-white/10"></div>
                <li>
                  <button onClick={handleLogout} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <LogOut className="size-4" /> Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          null
        )}
      </div>
    </div>
  );
};

export default Navbar;