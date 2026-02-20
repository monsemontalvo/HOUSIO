import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Bell, User, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar fixed top-0 w-full z-50 px-4 sm:px-8 py-3 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 shadow-lg transition-all">
      <div className="flex-1">
        <Link to={authUser ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 shadow-sm group-hover:bg-white/20 transition-all">
            <Home className="size-6 text-orange-500" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            HOUSIO
          </span>
        </Link>
      </div>

      <div className="flex-none gap-2">
        {authUser ? (
          <>
            {/* Botón de Ayuda (Acceso rápido en la barra) */}
            <Link to="/help" className="btn btn-ghost btn-circle text-gray-400 hover:text-white hover:bg-white/10 tooltip tooltip-bottom" data-tip="Ayuda">
              <HelpCircle className="size-6" />
            </Link>

            {/* Notificaciones */}
            <button className="btn btn-ghost btn-circle text-gray-400 hover:text-white hover:bg-white/10 tooltip tooltip-bottom" data-tip="Notificaciones">
              <div className="indicator">
                <Bell className="size-6" />
                <span className="badge badge-xs badge-error indicator-item bg-orange-500 border-none"></span>
              </div>
            </button>

            {/* Menú de Perfil (Dropdown) - YA SIN LA OPCIÓN DE AYUDA */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-white/10">
                <div className="w-10 rounded-full">
                  <img alt="Perfil" src={authUser.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-neutral-900 border border-white/10 rounded-box w-52 text-gray-300">
                <li>
                  <a className="hover:text-orange-400 hover:bg-white/5">
                    <User className="size-4" /> Editar Perfil
                  </a>
                </li>
                {/* Aquí eliminé la opción de Ayuda que estaba antes */}
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