import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, ArrowRight } from 'lucide-react';

const MyVisitsPage = () => {
  // Datos MOCK
  const visits = [
    {
      id: 1,
      property: 'Loft Moderno en San Nicolás',
      address: 'Av. Universidad 123',
      date: '15 Oct 2025',
      time: '04:30 PM',
      status: 'confirmed',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 2,
      property: 'Cuarto en Mederos',
      address: 'Lázaro Cárdenas 450',
      date: '18 Oct 2025',
      time: '10:00 AM',
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2670&auto=format&fit=crop'
    },
    {
      id: 3,
      property: 'Depa Minimalista Centro',
      address: 'Calle Morelos 880',
      date: '10 Oct 2025',
      time: '01:00 PM',
      status: 'cancelled',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop'
    }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed':
        return <div className="badge badge-success gap-2 text-white"><CheckCircle className="size-3" /> Confirmada</div>;
      case 'pending':
        return <div className="badge badge-warning gap-2 text-white"><AlertCircle className="size-3" /> Pendiente</div>;
      case 'cancelled':
        return <div className="badge badge-error gap-2 text-white"><XCircle className="size-3" /> Cancelada</div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">
      
      {/* Luces Ambientales */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mis Visitas</h1>
          <p className="text-gray-400">Gestiona tus citas para ver propiedades.</p>
        </div>

        <div className="grid gap-6">
          {visits.map((visit) => (
            <div key={visit.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-all group">
              
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0 relative">
                <img src={visit.image} alt="Propiedad" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">{visit.property}</h3>
                  {getStatusBadge(visit.status)}
                </div>
                
                <div className="flex flex-col gap-1 text-gray-300 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-orange-500" /> {visit.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-blue-400" /> {visit.date}
                    <span className="text-gray-600">|</span>
                    <Clock className="size-4 text-blue-400" /> {visit.time}
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link to={`/product/${visit.id}`} className="btn btn-sm btn-ghost text-gray-300 hover:text-white hover:bg-white/10 border border-white/10">
                    Ver Propiedad
                  </Link>
                  {visit.status !== 'cancelled' && (
                    <Link to="/chat" className="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-none">
                      Enviar Mensaje <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>

        {visits.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
            <Calendar className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No tienes visitas programadas</h3>
            <p className="text-gray-400 mb-6">Explora las propiedades y agenda tu primera cita.</p>
            <Link to="/dashboard" className="btn bg-white text-black hover:bg-gray-200">
              Explorar Propiedades
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyVisitsPage;