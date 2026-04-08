import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, ArrowRight, Loader } from 'lucide-react';
import { useVisitaStore } from '../store/useVisitaStore';

const MyVisitsPage = () => {
  const { misVisitas, getMisVisitas, isLoading } = useVisitaStore();

  useEffect(() => {
      getMisVisitas();
  }, [getMisVisitas]);

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
          <h1 className="text-3xl font-bold text-white mb-2">Mis Visitas</h1>
          <p className="text-gray-400">Gestiona tus citas para ver propiedades.</p>
        </div>

        <div className="grid gap-6">
          {misVisitas.map((visit) => (
            <div key={visit._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-all group">
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative">
                <img src={visit.inmueble?.imagenes?.[0] || 'https://images.unsplash.com/photo-1522708323590'} alt="Propiedad" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{visit.inmueble?.nombre}</h3>
                  {getStatusBadge(visit.estado)}
                </div>
                
                <div className="flex flex-col gap-1 text-gray-300 text-sm mb-4">
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
                  <Link to={`/product/${visit.inmueble?._id}`} className="btn btn-sm btn-ghost text-gray-300 hover:text-white hover:bg-white/10 border border-white/10">Ver Propiedad</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {misVisitas.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <Calendar className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No tienes visitas programadas</h3>
            <Link to="/dashboard" className="btn bg-white text-black hover:bg-gray-200 mt-4">Explorar Propiedades</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVisitsPage;