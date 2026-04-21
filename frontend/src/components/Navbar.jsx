import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Bell, User, HelpCircle, LogOut, MessageSquare, Calendar, Star } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificacionStore } from '../store/useNotificacionStore';
import { useChatStore } from '../store/useChatStore'; 

const Navbar = () => {
  const { authUser, logout } = useAuthStore(); 
  const { socket, connectSocket, disconnectSocket } = useChatStore();
  const navigate = useNavigate();

  const { 
    notificaciones, 
    unreadCount, 
    getNotificaciones, 
    marcarComoLeida, 
    suscribirseNotificaciones, 
    desuscribirseNotificaciones 
  } = useNotificacionStore();

  // 1. Cuando el usuario inicia sesión: descarga notificaciones y enciende el socket
  useEffect(() => {
    if (authUser) {
      getNotificaciones();
      connectSocket(); 
    } else {
      disconnectSocket();
    }
  }, [authUser, getNotificaciones, connectSocket, disconnectSocket]);

  // 2. Cuando el socket por fin enciende: nos ponemos a escuchar
  useEffect(() => {
    if (socket) {
      suscribirseNotificaciones();
    }
    return () => {
      if (socket) desuscribirseNotificaciones();
    };
  }, [socket, suscribirseNotificaciones, desuscribirseNotificaciones]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="navbar fixed top-0 w-full z-50 px-2 sm:px-8 h-16 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 shadow-lg transition-all flex-nowrap">
      <div className="flex-1 min-w-0">
        <Link to={authUser ? "/dashboard" : "/"} className="flex items-center gap-2 sm:gap-3 group text-nowrap">
          <div className="bg-white/10 p-2 rounded-xl border border-white/10 shadow-sm group-hover:bg-white/20 transition-all shrink-0">
            <Home className="size-5 sm:size-6 text-orange-500" />
          </div>
          <span className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
            HOUSIO
          </span>
        </Link>
      </div>

      <div className="flex-none flex items-center gap-0.5 sm:gap-2 flex-nowrap">
        {authUser ? (
          <>
            <Link to="/visits" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <Calendar className="size-5" />
            </Link>

            <Link to="/chat" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <div className="indicator">
                <MessageSquare className="size-5" />
                <span className="badge badge-xs badge-primary indicator-item bg-blue-500 border-none scale-75 sm:scale-100"></span>
              </div>
            </Link>

            <Link to="/help" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
              <HelpCircle className="size-5 sm:size-6" />
            </Link>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm sm:btn-md text-gray-400 hover:text-white hover:bg-white/10">
                <div className="indicator">
                  <Bell className="size-5 sm:size-6" />
                  {unreadCount > 0 && (
                    <span className="badge badge-xs badge-error indicator-item bg-orange-500 border-none scale-75 sm:scale-100"></span>
                  )}
                </div>
              </div>
              
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-2xl bg-neutral-900 border border-white/10 rounded-2xl w-80 mt-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                <li className="menu-title text-white font-bold text-sm pb-2 mb-2 border-b border-white/10">
                  Notificaciones ({unreadCount} nuevas)
                </li>
                
                {notificaciones.map((notif) => (
                  <li key={notif._id}>
                    <a onClick={() => marcarComoLeida(notif._id)} className="flex items-start gap-3 hover:bg-white/5 py-3 px-2 rounded-xl transition-colors cursor-pointer">
                      <div className={`p-2 rounded-full shrink-0 mt-0.5
                        ${notif.tipo === 'resena' ? 'bg-yellow-500/20 text-yellow-500' : ''}
                        ${notif.tipo === 'visita' ? 'bg-green-500/20 text-green-500' : ''}
                        ${notif.tipo === 'mensaje' ? 'bg-blue-500/20 text-blue-500' : ''}
                      `}>
                        {notif.tipo === 'resena' && <Star size={16} />}
                        {notif.tipo === 'visita' && <Calendar size={16} />}
                        {notif.tipo === 'mensaje' && <MessageSquare size={16} />}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className={`text-sm leading-tight ${notif.leida ? 'text-gray-400 font-normal' : 'text-white font-bold'}`}>
                          {notif.texto}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
                
                {notificaciones.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No tienes notificaciones
                  </div>
                )}
              </ul>
            </div>

            <div className="h-6 w-px bg-white/10 mx-1 sm:mx-2 shrink-0"></div>

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
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;