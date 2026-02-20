import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Search, MapPin, Home, Wifi, Car, DollarSign, 
  PawPrint, Zap, WashingMachine, Bus, 
  Plus, Building, User, Edit, Trash2 
} from 'lucide-react';

// ======================================================================
// 1. COMPONENTE DE ESTUDIANTE (DEFINIDO AFUERA)
// ======================================================================
const StudentDashboard = ({ authUser }) => {
  // Datos de ejemplo
  const properties = [
    { id: 1, title: 'Loft Moderno en San Nicolás', price: '$4,500', type: 'Departamento', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop', badges: ['Wifi', 'AC', 'Cocina'] },
    { id: 2, title: 'Habitación cerca de Mederos', price: '$3,200', type: 'Habitación', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2670&auto=format&fit=crop', badges: ['Cerca UANL', 'Amueblado'] },
    { id: 3, title: 'Casa Compartida Zona Tec', price: '$5,800', type: 'Casa Completa', image: 'https://images.unsplash.com/photo-1484154218962-a1c002085aac?q=80&w=2670&auto=format&fit=crop', badges: ['Estacionamiento', 'Gym', 'Seguridad'] },
    { id: 4, title: 'Depa Minimalista Centro', price: '$6,000', type: 'Departamento', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop', badges: ['Pet Friendly', 'Balcón'] },
    { id: 5, title: 'Cuarto para Estudiante', price: '$2,800', type: 'Habitación', image: 'https://images.unsplash.com/photo-1616594039964-40891a909d99?q=80&w=2670&auto=format&fit=crop', badges: ['Servicios Incluidos', 'Internet'] },
    { id: 6, title: 'Residencia Estudiantil VIP', price: '$7,500', type: 'Residencia', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop', badges: ['Alberca', 'Limpieza', 'Comidas'] }
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto space-y-10">
      
      {/* Encabezado */}
      <div className="flex flex-col items-center text-center space-y-8">
        <div className="text-white space-y-2">
          {/* Usamos la prop authUser aquí */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Hola, {authUser?.fullName?.split(' ')[0] || 'Estudiante'} 👋
          </h1>
          <p className="text-lg text-gray-400 font-light">
            Encuentra el espacio perfecto para tu vida universitaria
          </p>
        </div>
        
        {/* Barra de Filtros */}
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
              <select className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0">
                <option disabled selected>Tipo de Propiedad</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Habitación</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400 size-4 pointer-events-none" />
              <select className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0">
                <option disabled selected>Rango de Precio</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((prop) => (
          <div key={prop.id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 flex flex-col">
            <div className="relative h-64 overflow-hidden">
              <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white font-bold border border-white/10 shadow-lg">
                {prop.price}<span className="text-xs font-normal text-gray-300">/mes</span>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-medium border border-white/10">
                {prop.type}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-orange-400 transition-colors">{prop.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {prop.badges.map((badge, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/5 text-xs text-gray-400 border border-white/5">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-auto">
                <button className="w-full btn bg-white text-black hover:bg-gray-200 border-none rounded-xl font-bold shadow-md transition-all">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ======================================================================
// 2. COMPONENTE DE ARRENDADOR (DEFINIDO AFUERA)
// ======================================================================
const LandlordDashboard = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto space-y-10">
      
      {/* Encabezado Arrendador */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="text-white space-y-2">
          <h1 className="text-4xl font-bold">Panel de Anfitrión</h1>
          <p className="text-lg text-gray-400">Gestiona tus propiedades y solicitudes.</p>
        </div>
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all hover:scale-105">
          <Plus className="size-5" /> Publicar Propiedad
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400"><Building className="size-6" /></div>
            <span className="text-gray-400 font-medium">Propiedades Activas</span>
          </div>
          <span className="text-4xl font-bold text-white">3</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400"><User className="size-6" /></div>
            <span className="text-gray-400 font-medium">Interesados Nuevos</span>
          </div>
          <span className="text-4xl font-bold text-white">12</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-500/20 p-3 rounded-xl text-green-400"><DollarSign className="size-6" /></div>
            <span className="text-gray-400 font-medium">Ingresos este mes</span>
          </div>
          <span className="text-4xl font-bold text-white">$14,500</span>
        </div>
      </div>

      {/* Tabla de Propiedades */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden">
        <h2 className="text-2xl font-bold text-white mb-6">Mis Propiedades</h2>
        <div className="overflow-x-auto">
          <table className="table text-gray-300 w-full">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-left">
                <th className="py-4">Propiedad</th>
                <th className="py-4">Estado</th>
                <th className="py-4">Precio</th>
                <th className="py-4">Vistas</th>
                <th className="py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670" alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white">Loft San Nicolás</div>
                      <div className="text-sm opacity-50">Calle Universidad 123</div>
                    </div>
                  </div>
                </td>
                <td className="py-4"><div className="badge badge-success gap-2 badge-outline bg-green-500/10 border-green-500 text-green-400">Activo</div></td>
                <td className="py-4 font-bold text-white">$4,500</td>
                <td className="py-4">1,204</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-ghost btn-square btn-sm text-blue-400 hover:bg-blue-500/20"><Edit className="size-4" /></button>
                    <button className="btn btn-ghost btn-square btn-sm text-red-400 hover:bg-red-500/20"><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
               <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80" alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white">Cuarto en Mederos</div>
                      <div className="text-sm opacity-50">Lázaro Cárdenas 450</div>
                    </div>
                  </div>
                </td>
                <td className="py-4"><div className="badge badge-warning gap-2 badge-outline bg-yellow-500/10 border-yellow-500 text-yellow-400">Pendiente</div></td>
                <td className="py-4 font-bold text-white">$3,200</td>
                <td className="py-4">856</td>
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-ghost btn-square btn-sm text-blue-400 hover:bg-blue-500/20"><Edit className="size-4" /></button>
                    <button className="btn btn-ghost btn-square btn-sm text-red-400 hover:bg-red-500/20"><Trash2 className="size-4" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ======================================================================
// 3. COMPONENTE PRINCIPAL (DASHBOARD PAGE)
// ======================================================================
const DashboardPage = () => {
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">
      
      {/* Luces Ambientales */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* RENDERIZADO CONDICIONAL POR ROL */}
      {/* Pasamos authUser como prop al StudentDashboard */}
      {authUser?.role === 'landlord' ? <LandlordDashboard /> : <StudentDashboard authUser={authUser} />}
    </div>
  );
};

export default DashboardPage;