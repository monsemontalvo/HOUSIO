import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInmuebleStore } from '../store/useInmuebleStore'; // <-- Importamos el nuevo store
import {
  Search, MapPin, Home, Wifi, Car, DollarSign,
  PawPrint, Zap, WashingMachine, Bus,
  Plus, Building, User, Edit, Trash2, Loader
} from 'lucide-react';
import { Link } from 'react-router-dom'; 
import { useVisitaStore } from '../store/useVisitaStore'
// ======================================================================
// 1. COMPONENTE DE INQUILINO 
// ======================================================================
const StudentDashboard = ({ authUser }) => {
  const { inmuebles, getInmuebles, isLoading } = useInmuebleStore();

  // Ejecutamos la petición al backend cuando se abre la pantalla
  useEffect(() => {
    getInmuebles();
  }, [getInmuebles]);

  return (
    <div className="relative z-10 max-w-7xl mx-auto space-y-10">

      {/* Encabezado */}
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="text-white space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Hola, {authUser?.fullName?.split(' ')[0] || 'Estudiante'}
          </h1>
          <p className="text-lg text-gray-400 font-light">
            Encuentra el espacio perfecto para tu vida universitaria
          </p>
        </div>

        {/* Barra de Filtros (Visual por ahora) */}
        <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all hover:bg-white/10">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-3.5 text-gray-400 size-5 group-focus-within:text-orange-500 transition-colors" />
              <input type="text" placeholder="¿Cerca de qué facultad buscas?" className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:bg-black/40 focus:border-orange-500/50 transition-all" />
            </div>
            <button className="btn bg-orange-600 hover:bg-orange-700 text-white border-none px-8 rounded-xl font-bold text-lg shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all hover:scale-105">
              <Search className="size-5" /> Buscar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
            <div className="relative">
              <Home className="absolute left-3 top-2.5 text-gray-400 size-4 pointer-events-none" />
              <select defaultValue="Tipo de Propiedad" className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0">
                <option disabled>Tipo de Propiedad</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Habitación</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400 size-4 pointer-events-none" />
              <select defaultValue="Rango de Precio" className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0">
                <option disabled>Rango de Precio</option>
                <option>$1,000 - $3,000</option>
                <option>$3,000 - $6,000</option>
                <option>$6,000+</option>
              </select>
            </div>
            <div className="hidden md:block"></div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide mask-fade-sides">
            <button className="btn btn-sm bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white font-normal rounded-lg gap-2 shrink-0"><Wifi className="size-4 text-orange-400" /> Wifi</button>
            <button className="btn btn-sm bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white font-normal rounded-lg gap-2 shrink-0"><Car className="size-4 text-blue-400" /> Cochera</button>
            <button className="btn btn-sm bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white font-normal rounded-lg gap-2 shrink-0"><PawPrint className="size-4 text-pink-400" /> Mascotas</button>
            <button className="btn btn-sm bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white font-normal rounded-lg gap-2 shrink-0"><Zap className="size-4 text-yellow-400" /> Servicios</button>
            <button className="btn btn-sm bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white font-normal rounded-lg gap-2 shrink-0"><WashingMachine className="size-4 text-cyan-400" /> Lavandería</button>
            <button className="btn btn-sm bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white font-normal rounded-lg gap-2 shrink-0"><Bus className="size-4 text-green-400" /> Rutas</button>
          </div>
        </div>
      </div>

      {/* Grid Resultados */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader className="size-12 animate-spin text-orange-600" />
        </div>
      ) : inmuebles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Home className="size-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">Aún no hay propiedades publicadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inmuebles.map((prop) => (
            <div key={prop._id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 flex flex-col">
              <div className="relative h-64 overflow-hidden bg-black/50">
                {/* Mostramos la primera imagen si existe, si no un placeholder */}
                <img 
                  src={prop.imagenes?.length > 0 ? prop.imagenes[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670"} 
                  alt={prop.nombre} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-bold border border-white/10 shadow-lg">
                  ${prop.costo}<span className="text-xs font-normal text-gray-300">/mes</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-medium border border-white/10 capitalize">
                  {prop.tipo}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-orange-400 transition-colors">{prop.nombre}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                    <MapPin className="size-4 inline text-orange-500" /> {prop.direccion}
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <Link to={`/product/${prop._id}`} className="w-full btn bg-white text-black hover:bg-gray-200 border-none rounded-xl font-bold shadow-md transition-all flex items-center justify-center">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ======================================================================
// 2. COMPONENTE DE RENTERO (Sin cambios en lógica por ahora)
// ======================================================================
const LandlordDashboard = () => {
  const { misInmuebles, getMisInmueblesAnfitrion, crearInmueble, isLoading } = useInmuebleStore();
  const { visitasRecibidas, getVisitasAnfitrion, actualizarEstadoVisita } = useVisitaStore();
  
  const [formData, setFormData] = useState({
    nombre: "", direccion: "", costo: "", tipo: "Departamento", descripcion: ""
  });

  useEffect(() => {
    getMisInmueblesAnfitrion();
    getVisitasAnfitrion();
  }, [getMisInmueblesAnfitrion, getVisitasAnfitrion]);

  const handleCrear = async (e) => {
    e.preventDefault();
    const success = await crearInmueble(formData);
    if(success) {
      document.getElementById('modal_crear_inmueble').close();
      setFormData({nombre: "", direccion: "", costo: "", tipo: "Departamento", descripcion: ""});
    }
  };

  const visitasPendientes = visitasRecibidas.filter(v => v.estado === 'Pendiente').length;

  return (
    <div className="relative z-10 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="text-white space-y-2">
          <h1 className="text-4xl font-bold">Panel de Anfitrión</h1>
          <p className="text-lg text-gray-400">Gestiona tus propiedades y solicitudes.</p>
        </div>
        <button 
          onClick={() => document.getElementById('modal_crear_inmueble').showModal()}
          className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2"
        >
          <Plus className="size-5" /> Publicar Propiedad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400"><Building className="size-6" /></div>
            <span className="text-gray-400 font-medium">Propiedades Activas</span>
          </div>
          <span className="text-4xl font-bold text-white">{misInmuebles.length}</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400"><User className="size-6" /></div>
            <span className="text-gray-400 font-medium">Citas Pendientes</span>
          </div>
          <span className="text-4xl font-bold text-white">{visitasPendientes}</span>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-6">Mis Propiedades</h2>
        <div className="overflow-x-auto">
          <table className="table text-gray-300 w-full">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-left">
                <th className="py-4">Propiedad</th>
                <th className="py-4">Precio</th>
                <th className="py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {misInmuebles.map((inmueble) => (
                <tr key={inmueble._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-white capitalize">{inmueble.nombre}</div>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-white">${inmueble.costo}</td>
                  <td className="py-4 text-right">
                    <button className="btn btn-ghost btn-square btn-sm text-red-400"><Trash2 className="size-4" /></button>
                  </td>
                </tr>
              ))}
              {misInmuebles.length === 0 && (
                <tr><td colSpan="3" className="text-center py-4 opacity-50">No tienes propiedades publicadas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PARA CREAR PROPIEDAD */}
      <dialog id="modal_crear_inmueble" className="modal">
        <div className="modal-box bg-neutral-900 border border-white/10 text-white max-w-2xl">
          <h3 className="font-bold text-2xl mb-6">Nueva Propiedad</h3>
          <form onSubmit={handleCrear} className="space-y-4">
            <input type="text" placeholder="Título (Ej. Loft Moderno)" className="input w-full bg-black/30 border-white/10" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
            <input type="text" placeholder="Dirección completa" className="input w-full bg-black/30 border-white/10" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required />
            <div className="flex gap-4">
              <input type="number" placeholder="Costo mensual" className="input w-full bg-black/30 border-white/10" value={formData.costo} onChange={e => setFormData({...formData, costo: e.target.value})} required />
              <select className="select w-full bg-black/30 border-white/10" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option>Casa</option><option>Departamento</option><option>Cuarto</option>
              </select>
            </div>
            <textarea placeholder="Descripción detallada" className="textarea w-full bg-black/30 border-white/10 h-32" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required></textarea>
            
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={() => document.getElementById('modal_crear_inmueble').close()}>Cancelar</button>
              <button type="submit" className="btn bg-blue-600 text-white border-none hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

// ======================================================================
// 3. COMPONENTE PRINCIPAL 
// ======================================================================
const DashboardPage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">

      {/* Luces Ambientales */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* RENDERIZADO CONDICIONAL POR ROL */}
      {authUser?.role === 'landlord' ? <LandlordDashboard /> : <StudentDashboard authUser={authUser} />}
    </div>
  );
};

export default DashboardPage;