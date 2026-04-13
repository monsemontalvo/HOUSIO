import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, Loader, User } from 'lucide-react';
import { useVisitaStore } from '../store/useVisitaStore';
import { useAuthStore } from '../store/useAuthStore';

const MyVisitsPage = () => {
  const { authUser } = useAuthStore();
  const { 
    misVisitas, getMisVisitas, 
    visitasRecibidas, getVisitasAnfitrion, 
    actualizarEstadoVisita, isLoading 
  } = useVisitaStore();

  const isLandlord = authUser?.role === 'landlord';

  // Cargamos los datos correctos dependiendo del rol
  useEffect(() => {
    if (isLandlord) {
      getVisitasAnfitrion();
    } else {
      getMisVisitas();
    }
  }, [isLandlord, getVisitasAnfitrion, getMisVisitas]);

  // Decidimos qué lista pintar en la pantalla
  const displayVisits = isLandlord ? visitasRecibidas : misVisitas;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmada':
        return <div className="badge badge-success gap-2 text-white"><CheckCircle className="size-3" /> Confirmada</div>;
      case 'Pendiente':
        return <div className="badge badge-warning gap-2 text-white"><AlertCircle className="size-3" /> Pendiente</div>;
      case 'Cancelada':
        return <div className="badge badge-error gap-2 text-white"><XCircle className="size-3" /> Cancelada</div>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-950"><Loader className="size-12 animate-spin text-orange-600" /></div>;
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLandlord ? 'Solicitudes de Visita' : 'Mis Visitas'}
          </h1>
          <p className="text-gray-400">
            {isLandlord ? 'Gestiona las citas de los estudiantes interesados.' : 'Gestiona tus citas para ver propiedades.'}
          </p>
        </div>

        <div className="grid gap-6">
          {displayVisits.map((visit) => (
            <div key={visit._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-all group">
              
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative bg-black/50">
                <img 
                  src={visit.inmueble?.imagenes?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80'} 
                  alt="Propiedad" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white capitalize">{visit.inmueble?.nombre}</h3>
                  {getStatusBadge(visit.estado)}
                </div>
                
                <div className="flex flex-col gap-1 text-gray-300 text-sm mb-4">
                  {/* Si es dueño, le mostramos quién quiere ir a ver la casa */}
                  {isLandlord && (
                    <div className="flex items-center gap-2 text-blue-400 font-medium mb-1">
                      <User className="size-4" /> Interesado: <span className="capitalize text-white">{visit.inquilino?.fullName || 'Estudiante'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-orange-500" /> {visit.inmueble?.direccion}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-blue-400" /> {visit.fecha.split('T')[0]}
                    <span className="text-gray-600">|</span>
                    <Clock className="size-4 text-blue-400" /> {visit.hora}
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link to={`/product/${visit.inmueble?._id}`} className="btn btn-sm btn-ghost text-gray-300 hover:text-white hover:bg-white/10 border border-white/10">
                    Ver Propiedad
                  </Link>
                  
                  {/* BOTONES EXCLUSIVOS DEL ANFITRIÓN PARA ACEPTAR O RECHAZAR */}
                  {isLandlord && visit.estado === 'Pendiente' && (
                    <>
                      <button 
                        onClick={() => actualizarEstadoVisita(visit._id, 'Confirmada')} 
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-none"
                      >
                        <CheckCircle className="size-4" /> Aceptar
                      </button>
                      <button 
                        onClick={() => actualizarEstadoVisita(visit._id, 'Cancelada')} 
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none"
                      >
                        <XCircle className="size-4" /> Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {displayVisits.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <Calendar className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">
              {isLandlord ? 'No tienes solicitudes' : 'No tienes visitas programadas'}
            </h3>
            <p className="text-gray-400 mb-6">
              {isLandlord ? 'Aquí aparecerán las citas cuando un estudiante esté interesado.' : 'Explora las propiedades y agenda tu primera cita.'}
            </p>
            {!isLandlord && (
              <Link to="/dashboard" className="btn bg-white text-black hover:bg-gray-200 mt-4">
                Explorar Propiedades
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVisitsPage;