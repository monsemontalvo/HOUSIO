import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInmuebleStore } from '../store/useInmuebleStore';
import { useVisitaStore } from '../store/useVisitaStore';
import { Link } from 'react-router-dom';
import {
  Search, MapPin, Home, Wifi, Car, DollarSign,
  PawPrint, Zap, WashingMachine, Bus,
  Plus, Building, User, Edit, Trash2, Loader,
  Droplets, CheckCircle, Flame, Building2, BellOff,
  Cigarette, Clock, Funnel, FunnelPlus,
  University, Dumbbell, BookOpen, ShieldCheck, ChefHat
} from 'lucide-react';

// ======================================================================
// FUNCIÓN AUXILIAR PARA RENDERIZAR ICONOS
// ======================================================================
const renderFeatureIcon = (featureName) => {
  if (!featureName) return null;
  const name = featureName.toLowerCase();
  if (name.includes('internet') || name.includes('wifi')) return <Wifi className="size-4 text-orange-400" title={featureName} />;
  if (name.includes('estacionamiento') || name.includes('cochera')) return <Car className="size-4 text-blue-400" title={featureName} />;
  if (name.includes('aire') || name.includes('clima')) return <Zap className="size-4 text-yellow-400" title={featureName} />;
  if (name.includes('pet') || name.includes('mascota')) return <PawPrint className="size-4 text-pink-400" title={featureName} />;
  if (name.includes('amueblado')) return <Home className="size-4 text-green-400" title={featureName} />;
  if (name.includes('agua')) return <Droplets className="size-4 text-cyan-400" title={featureName} />;
  if (name.includes('luz')) return <Zap className="size-4 text-yellow-500" title={featureName} />;
  if (name.includes('gas')) return <Flame className="size-4 text-orange-600" title={featureName} />;
  if (name.includes('comunes')) return <Building2 className="size-4 text-purple-400" title={featureName} />;
  if (name.includes('fiesta')) return <BellOff className="size-4 text-red-400" title={featureName} />;
  if (name.includes('fumar')) return <Cigarette className="size-4 text-red-500" title={featureName} />;
  if (name.includes('Visitas hasta las 10 PM')) return <Clock className="size-4 text-green-500" title={featureName} />;
  if (name.includes('piscina') || name.includes('alberca')) return <Droplets className="size-4 text-blue-500" title={featureName} />;
  if (name.includes('gym') || name.includes('gimnasio')) return <Dumbbell className="size-4 text-slate-400" title={featureName} />;
  if (name.includes('estudio') || name.includes('coworking')) return <BookOpen className="size-4 text-indigo-400" title={featureName} />;
  if (name.includes('seguridad') || name.includes('vigilancia')) return <ShieldCheck className="size-4 text-red-400" title={featureName} />;
  if (name.includes('lavandería') || name.includes('lavadora')) return <WashingMachine className="size-4 text-blue-300" title={featureName} />;
  if (name.includes('Cocina Equipada')) return <ChefHat className="size-4 text-orange-300" title={featureName} />;
  if (name.includes('limpieza')) return <Droplets className="size-4 text-cyan-400" title={featureName} />;
  if (name.includes('visitas')) return <Clock className="size-4 text-green-500" title={featureName} />;
  if (name.includes('cocina')) return <ChefHat className="size-4 text-orange-300" title={featureName} />;
  return <CheckCircle className="size-4 text-gray-500" title={featureName} />;
};

const FilterItem = ({ item, active, toggle }) => (
  <button
    onClick={() => toggle(item.id)}
    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all
      ${active
        ? 'bg-orange-600/10 border-orange-500 text-white'
        : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'
      }`}
  >
    <div className={active ? 'text-orange-500' : 'text-gray-500'}>
      {item.icon}
    </div>
    <span className="text-xs font-medium">{item.text}</span>
    {active && <CheckCircle className="size-3 text-orange-500 ml-auto" />}
  </button>
);

const ZONAS_ESTRATEGICAS_NL = [
  "Monterrey, Centro Monterrey", "Monterrey, Mitras Centro", "Santa Catarina, Valle Poniente",
  "Monterrey, Tecnológico", "Santa Catarina, Valle Poniente"
];

const UNIVERSIDADES_NL = [
  "UANL - Universidad Autónoma de Nuevo León",
  "ITESM - Instituto Tecnológico y de Estudios Superiores de Monterrey",
  "UDEM - Universidad de Monterrey",
  "UR - Universidad Regiomontana",
  "UVM - Universidad del Valle de México",
  "TecMilenio - Universidad TecMilenio",
  "UPAEP - Universidad Popular Autónoma del Estado de Puebla (Mty)"
];

// ======================================================================
// 1. COMPONENTE DE INQUILINO 
// ======================================================================
const StudentDashboard = ({ authUser }) => {
  const { inmuebles, getInmuebles, isLoading } = useInmuebleStore();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // ESTADOS PARA LOS FILTROS
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [precioFiltro, setPrecioFiltro] = useState("Todos");
  
  // NUEVOS ESTADOS PARA PRECIO PERSONALIZADO
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  
  const [filtrosActivos, setFiltrosActivos] = useState([]);

  const [paginaActual, setPaginaActual] = useState(1);
  const inmueblesPorPagina = 12;//Cantidad maxima de inmuebles por pagina

  useEffect(() => {
    getInmuebles();
  }, [getInmuebles]);

  const toggleFiltro = (id) => {
    setFiltrosActivos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
    setPaginaActual(1); // Reiniciar paginación al cambiar filtros
  };

  // EL MOTOR DE BÚSQUEDA
  const inmueblesFiltrados = inmuebles.filter((prop) => {
    const textoParaFiltrar = `
    ${prop.nombre} 
    ${prop.zona} 
    ${prop.universidadCercana}
  `.toLowerCase();
    const coincideBusqueda = textoParaFiltrar.includes(busqueda.toLowerCase());

    const coincideTipo = tipoFiltro === "Todos" || prop.tipo === tipoFiltro;

    // LOGICA ACTUALIZADA DE PRECIOS
    let coincidePrecio = true;
    const costoNum = Number(prop.costo);

    if (precioFiltro === "1000-3000") {
      coincidePrecio = costoNum >= 1000 && costoNum <= 3000;
    } else if (precioFiltro === "3000-6000") {
      coincidePrecio = costoNum > 3000 && costoNum <= 6000;
    } else if (precioFiltro === "6000+") {
      coincidePrecio = costoNum > 6000;
    } else if (precioFiltro === "Personalizado") {
      const min = precioMin === "" ? 0 : Number(precioMin);
      const max = precioMax === "" ? Infinity : Number(precioMax);
      coincidePrecio = costoNum >= min && costoNum <= max;
    }

    let coincideRapido = true;
    if (filtrosActivos.length > 0) {
      const datosPropiedad = [
        prop.descripcion,
        ...(prop.servicios?.map(s => s.nombre || s) || []),
        ...(prop.amenidades?.map(a => a.nombre || a) || []),
        ...(prop.reglas?.map(r => r.nombre || r) || [])
      ].join(" ").toLowerCase();

      coincideRapido = filtrosActivos.every(filtroId => {
        const diccionarioKeywords = {
          wifi: 'internet',
          cochera: 'estacionamiento',
          mascotas: 'pet friendly',
          clima: 'aire acondicionado',
          amueblado: 'amueblado',
          agua: 'agua',
          luz: 'luz',
          gas: 'gas',
          comunes: 'áreas comunes',
          fiestas: 'no fiestas',
          fumar: 'no fumar',
          limpieza: 'limpieza',
          lavanderia: 'lavandería',
          seguridad: 'seguridad',
          gym: 'gimnasio',
          estudio: 'estudio',
          piscina: 'alberca',
          'Cocina Equipada': 'cocina equipada',
          'Visitas hasta las 10 PM': 'visitas hasta las 10 pm'
        };

        const terminoBusqueda = diccionarioKeywords[filtroId] || filtroId.toLowerCase();
        return datosPropiedad.includes(terminoBusqueda);
      });
    }

    return coincideBusqueda && coincideTipo && coincidePrecio && coincideRapido;
  });

  // Cálculos de paginacion
  const indiceUltimoInmueble = paginaActual * inmueblesPorPagina;
  const indicePrimerInmueble = indiceUltimoInmueble - inmueblesPorPagina;
  const inmueblesPaginados = inmueblesFiltrados.slice(indicePrimerInmueble, indiceUltimoInmueble);
  const totalPaginas = Math.ceil(inmueblesFiltrados.length / inmueblesPorPagina);

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

        {/* Barra de Filtros */}
        <div className="w-full max-w-5xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl transition-all hover:bg-white/10">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-3.5 text-gray-400 size-5 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="text"
                placeholder="¿Cerca de qué facultad buscas o cómo se llama la zona?"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
                className="w-full bg-black/20 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none focus:bg-black/40 focus:border-orange-500/50 transition-all"
              />
            </div>
            <button className="btn bg-orange-600 hover:bg-orange-700 text-white border-none px-8 rounded-xl font-bold text-lg shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all hover:scale-105">
              <Search className="size-5" /> Buscar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
            <div className="relative">
              <Home className="absolute left-3 top-2.5 text-gray-400 size-4 pointer-events-none" />
              <select
                value={tipoFiltro}
                onChange={(e) => {
                  setTipoFiltro(e.target.value);
                  setPaginaActual(1);
                }}
                className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0"
              >
                <option className="bg-neutral-900 text-white" value="Todos">Cualquier tipo</option>
                <option className="bg-neutral-900 text-white" value="Casa">Casa</option>
                <option className="bg-neutral-900 text-white" value="Departamento">Departamento</option>
                <option className="bg-neutral-900 text-white" value="Habitacion">Habitación</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400 size-4 pointer-events-none" />
              <select
                value={precioFiltro}
                onChange={(e) => {
                  setPrecioFiltro(e.target.value);
                  setPaginaActual(1);
                  if(e.target.value !== "Personalizado") {
                    setPrecioMin("");
                    setPrecioMax("");
                  }
                }}
                className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0"
              >
                <option className="bg-neutral-900 text-white" value="Todos">Cualquier precio</option>
                <option className="bg-neutral-900 text-white" value="1000-3000">$1,000 - $3,000</option>
                <option className="bg-neutral-900 text-white" value="3000-6000">$3,000 - $6,000</option>
                <option className="bg-neutral-900 text-white" value="6000+">$6,000 o más</option>
                <option className="bg-neutral-900 text-white" value="Personalizado">Personalizado...</option>
              </select>
            </div>
            
            {/* INPUTS MIN/MAX DE PRECIO PERSONALIZADO */}
            <div className="w-full">
              {precioFiltro === "Personalizado" ? (
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold size-4 pointer-events-none text-sm">Min</span>
                    <input
                      type="number"
                      placeholder="$0"
                      value={precioMin}
                      onChange={(e) => { setPrecioMin(e.target.value); setPaginaActual(1); }}
                      className="input w-full pl-10 bg-black/20 border border-white/5 text-white placeholder-gray-500 outline-none focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <span className="text-gray-500 font-bold">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400 font-bold size-4 pointer-events-none text-sm">Max</span>
                    <input
                      type="number"
                      placeholder="$∞"
                      value={precioMax}
                      onChange={(e) => { setPrecioMax(e.target.value); setPaginaActual(1); }}
                      className="input w-full pl-11 bg-black/20 border border-white/5 text-white placeholder-gray-500 outline-none focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="hidden md:block"></div>
              )}
            </div>

            {/* Barra de Filtros */}
            <div className="flex justify-start mt-4">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all
    ${filtrosActivos.length > 0
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
              >
                {filtrosActivos.length > 0 ? (
                  <FunnelPlus className="size-4" />
                ) : (
                  <Funnel className="size-4" />
                )}

                <span className="font-bold text-sm">
                  {filtrosActivos.length > 0 ? `Filtros (${filtrosActivos.length})` : 'Filtros'}
                </span>
              </button>

              {filtrosActivos.length > 0 && (
                <button
                  onClick={() => {
                    setFiltrosActivos([]);
                    setPaginaActual(1);
                  }}
                  className="ml-4 text-xs text-gray-500 hover:text-orange-500 underline"
                >
                  Limpiar todo
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Grid Resultados Filtrados */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader className="size-12 animate-spin text-orange-600" />
        </div>
      ) : inmueblesFiltrados.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl max-w-2xl mx-auto">
          <Search className="size-16 mx-auto mb-4 text-orange-600/50" />
          <h3 className="text-2xl font-bold text-white mb-2">Sin resultados</h3>
          <p className="text-gray-400">No encontramos propiedades que coincidan con tus filtros.</p>
          <button
            onClick={() => {
              setBusqueda("");
              setTipoFiltro("Todos");
              setPrecioFiltro("Todos");
              setPrecioMin("");
              setPrecioMax("");
              setFiltrosActivos([]);
              setPaginaActual(1);
            }}
            className="btn btn-outline text-orange-500 border-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white mt-6"
          >
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inmueblesPaginados.map((prop) => {
            const todosLosFeatures = [
              ...(prop.servicios || []),
              ...(prop.amenidades || []),
              ...(prop.reglas || [])
            ];

            return (
              <Link
                key={prop._id}
                to={`/product/${prop._id}`}
                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Contenedor de la Imagen */}
                <div className="relative h-64 overflow-hidden bg-black/50">
                  <img
                    src={prop.imagenPrincipal || (prop.imagenes?.length > 0 ? prop.imagenes[0] : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670")}
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

                {/* Contenido de la Card */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-orange-400 transition-colors">
                      {prop.nombre}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <MapPin className="size-4 text-orange-500" /> {prop.zona}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <University className="size-4 text-orange-500" /> {prop.universidadCercana}
                    </div>

                    {todosLosFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                        {todosLosFeatures.slice(0, 11).map((feature, idx) => (
                          <div key={idx} className="tooltip tooltip-top" data-tip={feature.nombre || feature}>
                            {renderFeatureIcon(feature.nombre || feature)}
                          </div>
                        ))}
                        {todosLosFeatures.length > 11 && (
                          <span className="text-xs text-gray-500 font-bold flex items-center ml-1">
                            +{todosLosFeatures.length - 11}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 text-center text-orange-500 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Haz clic para ver más →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>



      )}
      {/* MODAL DE FILTROS */}
      <div className={`modal ${isFilterModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-neutral-900 border border-white/10 max-w-2xl text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-2xl">Filtros</h3>
          </div>

          <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">

            {/* SECCION: SERVICIOS */}
            <section>
              <h4 className="flex items-center gap-2 text-orange-500 font-bold mb-4">
                <Zap className="size-4" /> Servicios
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'luz', text: 'Luz', icon: <Zap className="size-4" /> },
                  { id: 'agua', text: 'Agua', icon: <Droplets className="size-4" /> },
                  { id: 'wifi', text: 'Internet Alta Velocidad', icon: <Wifi className="size-4" /> },
                  { id: 'gas', text: 'Gas', icon: <Flame className="size-4" /> },
                  { id: 'limpieza', text: 'Servicio de Limpieza', icon: <Droplets className="size-4" /> },
                  { id: 'lavanderia', text: 'Lavandería Interna', icon: <WashingMachine className="size-4" /> },
                  { id: 'seguridad', text: 'Seguridad 24/7', icon: <ShieldCheck className="size-4" /> },
                ].map(item => (
                  <FilterItem key={item.id} item={item} active={filtrosActivos.includes(item.id)} toggle={toggleFiltro} />
                ))}
              </div>
            </section>

            {/* SECCION: AMENIDADES */}
            <section>
              <h4 className="flex items-center gap-2 text-blue-500 font-bold mb-4">
                <Home className="size-4" /> Amenidades
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cochera', text: 'Estacionamiento Techado', icon: <Car className="size-4" /> },
                  { id: 'amueblado', text: 'Amueblado', icon: <Home className="size-4" /> },
                  { id: 'comunes', text: 'Áreas Comunes', icon: <Building2 className="size-4" /> },
                  { id: 'clima', text: 'Aire Acondicionado', icon: <Zap className="size-4" /> },
                  { id: 'gym', text: 'Gimnasio', icon: <Dumbbell className="size-4" /> },
                  { id: 'estudio', text: 'Sala de Estudio', icon: <BookOpen className="size-4" /> },
                  { id: 'piscina', text: 'Alberca / Piscina', icon: <Droplets className="size-4" /> },
                  { id: 'Cocina Equipada', text: 'Cocina Equipada', icon: <ChefHat className="size-4" /> },
                ].map(item => (
                  <FilterItem key={item.id} item={item} active={filtrosActivos.includes(item.id)} toggle={toggleFiltro} />
                ))}
              </div>
            </section>

            {/* SECCION: REGLAS */}
            <section>
              <h4 className="flex items-center gap-2 text-pink-500 font-bold mb-4">
                <BellOff className="size-4" /> Reglas
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Visitas hasta las 10 PM', text: 'Visitas hasta las 10 PM', icon: <Clock className="size-4" /> },
                  { id: 'fiestas', text: 'No Fiestas', icon: <BellOff className="size-4" /> },
                  { id: 'mascotas', text: 'Pet Friendly', icon: <PawPrint className="size-4" /> },
                  { id: 'fumar', text: 'No Fumar', icon: <Cigarette className="size-4" /> },
                ].map(item => (
                  <FilterItem key={item.id} item={item} active={filtrosActivos.includes(item.id)} toggle={toggleFiltro} />
                ))}
              </div>
            </section>
          </div>

          <div className="modal-action border-t border-white/10 pt-4 mt-6">
            <button
              onClick={() => {
                setFiltrosActivos([]);
                setPaginaActual(1);
              }}
              className="btn btn-ghost text-gray-400"
            >
              Borrar todo
            </button>
            <button onClick={() => setIsFilterModalOpen(false)} className="btn bg-orange-600 hover:bg-orange-700 text-white border-none px-8">
              Mostrar resultados
            </button>
          </div>
        </div>
      </div>

      {/* CONTROLES DE PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-2 pb-10">
          <button
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(prev => prev - 1)}
            className="btn btn-sm bg-white/5 border-white/10 text-white hover:bg-orange-600 disabled:opacity-30 transition-all"
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {[...Array(totalPaginas)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPaginaActual(i + 1)}
                className={`btn btn-sm btn-square transition-all ${paginaActual === i + 1 ? 'bg-orange-600 border-orange-500 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(prev => prev + 1)}
            className="btn btn-sm bg-white/5 border-white/10 text-white hover:bg-orange-600 disabled:opacity-30 transition-all"
          >
            Siguiente
          </button>
        </div>
      )}

    </div>


  );
};

// ======================================================================
// 2. COMPONENTE DE RENTERO
// ======================================================================
const LandlordDashboard = () => {
  const {
    misInmuebles, getMisInmueblesAnfitrion, crearInmueble, eliminarInmueble,
    actualizarInmueble, catalogos, getCatalogos, isLoading
  } = useInmuebleStore();
  const { visitasRecibidas, getVisitasAnfitrion } = useVisitaStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

const estadoInicialForm = {
    nombre: "", direccion: "", costo: "", tipo: "Departamento", descripcion: "",
    servicios: [], amenidades: [], reglas: [], imagenPrincipal: "", detallesTecnicos: [],
    latitud: "", longitud: "", zona: "", universidadCercana: "",
    horariosVisita: []
  };

  const [formData, setFormData] = useState(estadoInicialForm);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [previewPrincipal, setPreviewPrincipal] = useState(null);

  const [itemTitulo, setItemTitulo] = useState("");
  const [itemDesc, setItemDesc] = useState("");

  useEffect(() => {
    getMisInmueblesAnfitrion();
    getVisitasAnfitrion();
    getCatalogos();
  }, [getMisInmueblesAnfitrion, getVisitasAnfitrion, getCatalogos]);

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewPrincipal(reader.result);
      setFormData(prev => ({ ...prev, imagenPrincipal: reader.result }));
    };
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const limiteMaximo = 18;

    if (imagenesPreview.length + files.length > limiteMaximo) {
      alert(`Solo puedes subir un máximo de ${limiteMaximo} fotos`);
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImagenesPreview(prev => [...prev, reader.result]);
    });
  };
  const quitarImagen = (index) => setImagenesPreview(prev => prev.filter((_, i) => i !== index));

  const agregarDetalle = () => {
    if (!itemTitulo || !itemDesc) return;

    const nuevoDetalle = { titulo: itemTitulo, descripcion: itemDesc };

    setFormData({
      ...formData,
      detallesTecnicos: [...formData.detallesTecnicos, nuevoDetalle]
    });

    setItemTitulo("");
    setItemDesc("");
  };

  const eliminarDetalle = (indexAEliminar) => {
    setFormData({
      ...formData,
      detallesTecnicos: formData.detallesTecnicos.filter((_, index) => index !== indexAEliminar)
    });
  };

  const handleCheckboxChange = (e, categoria) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [categoria]: checked
        ? [...prev[categoria], value]
        : prev[categoria].filter(id => id !== value)
    }));
  };

  const abrirModalCrear = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(estadoInicialForm);
    setImagenesPreview([]);
    setIsModalOpen(true);
    setPreviewPrincipal(null);
  };

  const abrirModalEditar = (inmueble) => {
    setIsEditing(true);
    setEditId(inmueble._id);
    setFormData({
      nombre: inmueble.nombre,
      direccion: inmueble.direccion,
      zona: inmueble.zona || '',
      universidadCercana: inmueble.universidadCercana || '',
      latitud: inmueble.latitud || '',
      longitud: inmueble.longitud || '',
      costo: inmueble.costo,
      tipo: inmueble.tipo,
      descripcion: inmueble.descripcion,
      servicios: inmueble.servicios.map(s => s._id || s),
      amenidades: inmueble.amenidades.map(a => a._id || a),
      reglas: inmueble.reglas.map(r => r._id || r),
      detallesTecnicos: inmueble.detallesTecnicos || [],
      horariosVisita: inmueble.horariosVisita || []
    });
    setImagenesPreview(inmueble.imagenes || []);
    setIsModalOpen(true);
    setPreviewPrincipal(inmueble.imagenPrincipal || null);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, imagenes: imagenesPreview };

    let success = false;

    if (isEditing) {
      success = await actualizarInmueble(editId, dataToSend);
    } else {
      success = await crearInmueble(dataToSend);
    }

    if (success) {
      setIsModalOpen(false);
      setFormData(estadoInicialForm);
      setImagenesPreview([]);
      setIsEditing(false);
      setEditId(null);
      setPreviewPrincipal(null);
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
        <button onClick={abrirModalCrear} className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center gap-2">
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
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 bg-black/50">
                          {(inmueble.imagenPrincipal || inmueble.imagenes?.length > 0) && (
                            <img
                              src={inmueble.imagenPrincipal || inmueble.imagenes[0]}
                              alt={inmueble.nombre}
                            />
                          )}
                        </div>
                      </div>
                      <div className="font-bold text-white capitalize">{inmueble.nombre}</div>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-white">${inmueble.costo}</td>
                  <td className="py-4 text-right">
                    <button onClick={() => abrirModalEditar(inmueble)} className="btn btn-ghost btn-square btn-sm text-blue-400 mr-2"><Edit className="size-4" /></button>
                    <button onClick={() => eliminarInmueble(inmueble._id)} className="btn btn-ghost btn-square btn-sm text-red-400"><Trash2 className="size-4" /></button>
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

      <div className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-neutral-900 border border-white/10 text-white max-w-3xl">
          <h3 className="font-bold text-2xl mb-6">{isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}</h3>

          <form onSubmit={handleGuardar} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-dashed border-white/20 p-4 rounded-xl">
              <div className="space-y-2 text-center border-r border-white/10 pr-2">
                <label className="text-xs text-orange-400 font-bold uppercase">Foto de Portada</label>
                <div className="relative w-full h-32 bg-black/30 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center">
                  {previewPrincipal ? (
                    <>
                      <img src={previewPrincipal} alt="Portada" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setPreviewPrincipal(null); setFormData({ ...formData, imagenPrincipal: "" }) }}
                        className="absolute top-1 right-1 bg-red-600 rounded-full p-1"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center">
                      <Plus className="size-6 text-gray-500" />
                      <span className="text-[10px] text-gray-400">Subir Portada</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
                    </label>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-center">
                <label className="text-xs text-blue-400 font-bold uppercase">Galería ({imagenesPreview.length}/18)</label>
                <label className="cursor-pointer flex flex-col items-center justify-center h-32 bg-black/30 rounded-lg border border-white/10">
                  <Plus className="size-6 text-gray-500" />
                  <span className="text-[10px] text-gray-400">Añadir Fotos</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={imagenesPreview.length >= 18}
                  />
                </label>
              </div>
            </div>

            {imagenesPreview.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {imagenesPreview.map((img, index) => (
                  <div key={index} className="relative min-w-[60px] h-16 rounded-md overflow-hidden border border-white/5">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => quitarImagen(index)} className="absolute top-0 right-0 bg-red-600 p-0.5 text-white"><Trash2 className="size-2" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Título */}
              <input
                type="text"
                placeholder="Título (Ej: Departamento cerca de Facultad de Medicina)"
                className="input w-full bg-black/30 border-white/10 focus:border-orange-500"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                required
              />

              {/* Direccion */}
              <input
                type="text"
                placeholder="Dirección exacta (Calle y #)"
                className="input w-full bg-black/30 border-white/10 focus:border-orange-500"
                value={formData.direccion}
                onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                required
              />

              {/* Zona */}
              <div className="w-full">
                <input
                  list="zonas-list"
                  placeholder="Zona o Colonia"
                  className="input w-full bg-black/30 border-white/10 focus:border-orange-500"
                  value={formData.zona}
                  onChange={e => setFormData({ ...formData, zona: e.target.value })}
                  required
                />
                <datalist id="zonas-list">
                  {ZONAS_ESTRATEGICAS_NL.map(z => <option key={z} value={z} />)}
                </datalist>
              </div>

              {/* Selector de Universidad Cercana */}
              <div className="w-full">
                <input
                  list="universidades-list"
                  placeholder="Universidad más cercana"
                  className="input w-full bg-black/30 border-white/10 focus:border-orange-500"
                  value={formData.universidadCercana}
                  onChange={e => setFormData({ ...formData, universidadCercana: e.target.value })}
                  required
                />
                <datalist id="universidades-list">
                  {UNIVERSIDADES_NL.map(u => <option key={u} value={u} />)}
                </datalist>
              </div>

              {/* Costo mensual */}
              <input
                type="number"
                placeholder="Costo mensual ($MXN)"
                className="input w-full bg-black/30 border-white/10 focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={formData.costo}
                onChange={e => setFormData({ ...formData, costo: e.target.value })}
                required
              />

              {/* Tipo de propiedad */}
              <select
                className="select w-full bg-black/30 border-white/10 focus:border-orange-500"
                value={formData.tipo}
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
              >
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Habitacion">Habitación</option>
              </select>
            </div>

            {/* Cordenadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 ml-2 uppercase font-bold">Latitud</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: 25.6866"
                  className="input w-full bg-black/30 border-white/10 focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={formData.latitud}
                  onChange={e => setFormData({ ...formData, latitud: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 ml-2 uppercase font-bold">Longitud</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ej: -100.3161"
                  className="input w-full bg-black/30 border-white/10 focus:border-orange-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={formData.longitud}
                  onChange={e => setFormData({ ...formData, longitud: e.target.value })}
                />
              </div>
            </div>

            {/* PANEL DE DETALLES */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <label className="text-sm font-bold text-orange-500 uppercase">Detalles Personalizados</label>
              <div className="flex flex-col md:flex-row gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <input
                  type="text"
                  placeholder="Ej: Baños"
                  className="input input-sm flex-1 bg-black/20 border-white/10 text-white"
                  value={itemTitulo}
                  onChange={(e) => setItemTitulo(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Ej: 2.5"
                  className="input input-sm flex-1 bg-black/20 border-white/10 text-white"
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                />
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="btn btn-sm bg-orange-600 hover:bg-orange-700 border-none text-white px-4"
                >
                  <Plus className="size-4 mr-1" /> Agregar
                </button>
              </div>

              {/* Lista de lo que se va agregando */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formData.detallesTecnicos.map((detalle, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5 group hover:border-orange-500/30 transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">{detalle.titulo}</span>
                      <span className="text-sm text-white">{detalle.descripcion}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarDetalle(index)}
                      className="btn btn-ghost btn-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <textarea placeholder="Descripción detallada" className="textarea w-full bg-black/30 border-white/10 h-24" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} required></textarea>
            {/* HORARIOS DE VISITA */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <h4 className="font-bold text-sm text-green-400 mb-1 flex items-center gap-2">
                  <Clock className="size-4" /> Horarios de Visita Disponibles
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Selecciona a qué horas los estudiantes pueden agendar para ver tu propiedad.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
                    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
                    "05:00 PM", "06:00 PM", "07:00 PM"
                  ].map((hora) => {
                    const isSelected = formData.horariosVisita.includes(hora);
                    return (
                      <button
                        type="button"
                        key={hora}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            horariosVisita: isSelected 
                              ? prev.horariosVisita.filter(h => h !== hora)
                              : [...prev.horariosVisita, hora].sort()
                          }));
                        }}
                        className={`badge badge-lg border-none cursor-pointer transition-all hover:scale-105 ${
                          isSelected 
                            ? "bg-green-500 text-black font-bold shadow-lg shadow-green-900/20" 
                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div>
                <h4 className="font-bold text-sm text-gray-400 mb-3">Servicios Incluidos</h4>
                {catalogos.servicios.map(serv => (
                  <label key={serv._id} className="label cursor-pointer justify-start gap-3 py-1">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-warning border-white/20" value={serv._id} checked={formData.servicios.includes(serv._id)} onChange={e => handleCheckboxChange(e, 'servicios')} />
                    <span className="label-text text-gray-300">{serv.nombre}</span>
                  </label>
                ))}
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-400 mb-3">Amenidades</h4>
                {catalogos.amenidades.map(amen => (
                  <label key={amen._id} className="label cursor-pointer justify-start gap-3 py-1">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-info border-white/20" value={amen._id} checked={formData.amenidades.includes(amen._id)} onChange={e => handleCheckboxChange(e, 'amenidades')} />
                    <span className="label-text text-gray-300">{amen.nombre}</span>
                  </label>
                ))}
              </div>

              <div>
                <h4 className="font-bold text-sm text-gray-400 mb-3">Reglas</h4>
                {catalogos.reglas.map(regla => (
                  <label key={regla._id} className="label cursor-pointer justify-start gap-3 py-1">
                    <input type="checkbox" className="checkbox checkbox-sm checkbox-error border-white/20" value={regla._id} checked={formData.reglas.includes(regla._id)} onChange={e => handleCheckboxChange(e, 'reglas')} />
                    <span className="label-text text-gray-300">{regla.nombre}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setIsModalOpen(false);
                  setFormData(estadoInicialForm);
                  setImagenesPreview([]);
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn bg-blue-600 text-white border-none hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Publicar')}
              </button>
            </div>
          </form>
        </div>
      </div>
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
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      {authUser?.role === 'landlord' ? <LandlordDashboard /> : <StudentDashboard authUser={authUser} />}
    </div>
  );
};

export default DashboardPage;