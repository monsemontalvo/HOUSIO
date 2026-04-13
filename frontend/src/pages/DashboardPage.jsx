import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useInmuebleStore } from '../store/useInmuebleStore';
import { useVisitaStore } from '../store/useVisitaStore';
import { Link } from 'react-router-dom'; 
import {
  Search, MapPin, Home, Wifi, Car, DollarSign,
  PawPrint, Zap, WashingMachine, Bus,
  Plus, Building, User, Edit, Trash2, Loader,
  Droplets, CheckCircle
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
  return <CheckCircle className="size-4 text-gray-500" title={featureName} />;
};

// ======================================================================
// 1. COMPONENTE DE INQUILINO 
// ======================================================================
const StudentDashboard = ({ authUser }) => {
  const { inmuebles, getInmuebles, isLoading } = useInmuebleStore();

  // ESTADOS PARA LOS FILTROS
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [precioFiltro, setPrecioFiltro] = useState("Todos");
  const [filtroRapido, setFiltroRapido] = useState("");

  useEffect(() => {
    getInmuebles();
  }, [getInmuebles]);

  // EL MOTOR DE BÚSQUEDA
  const inmueblesFiltrados = inmuebles.filter((prop) => {
    const textoProp = (prop.nombre + " " + prop.direccion).toLowerCase();
    const coincideBusqueda = textoProp.includes(busqueda.toLowerCase());

    const coincideTipo = tipoFiltro === "Todos" || prop.tipo === tipoFiltro;

    let coincidePrecio = true;
    if (precioFiltro === "1000-3000") coincidePrecio = prop.costo >= 1000 && prop.costo <= 3000;
    if (precioFiltro === "3000-6000") coincidePrecio = prop.costo > 3000 && prop.costo <= 6000;
    if (precioFiltro === "6000+") coincidePrecio = prop.costo > 6000;

    let coincideRapido = true;
    if (filtroRapido) {
      const datosPropiedad = [
        prop.descripcion,
        ...(prop.servicios?.map(s => s.nombre || s) || []),
        ...(prop.amenidades?.map(a => a.nombre || a) || []),
        ...(prop.reglas?.map(r => r.nombre || r) || [])
      ].join(" ").toLowerCase();

      if (filtroRapido === 'wifi') coincideRapido = datosPropiedad.includes("internet") || datosPropiedad.includes("wifi");
      if (filtroRapido === 'estacionamiento') coincideRapido = datosPropiedad.includes("estacionamiento") || datosPropiedad.includes("cochera");
      if (filtroRapido === 'mascotas') coincideRapido = datosPropiedad.includes("pet friendly") || datosPropiedad.includes("mascota");
      if (filtroRapido === 'clima') coincideRapido = datosPropiedad.includes("aire acondicionado") || datosPropiedad.includes("clima");
      if (filtroRapido === 'amueblado') coincideRapido = datosPropiedad.includes("amueblado");
    }

    return coincideBusqueda && coincideTipo && coincidePrecio && coincideRapido;
  });

  const toggleFiltroRapido = (filtro) => {
    if (filtroRapido === filtro) setFiltroRapido(""); 
    else setFiltroRapido(filtro); 
  };

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
                onChange={(e) => setBusqueda(e.target.value)}
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
              <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)} className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0">
                <option value="Todos">Cualquier tipo</option>
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Habitacion">Habitación</option>
              </select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400 size-4 pointer-events-none" />
              <select value={precioFiltro} onChange={(e) => setPrecioFiltro(e.target.value)} className="select w-full pl-10 bg-black/20 border-white/5 text-gray-300 focus:bg-black/40 focus:border-orange-500/50 rounded-xl h-10 min-h-0">
                <option value="Todos">Cualquier precio</option>
                <option value="1000-3000">$1,000 - $3,000</option>
                <option value="3000-6000">$3,000 - $6,000</option>
                <option value="6000+">$6,000 o más</option>
              </select>
            </div>
            <div className="hidden md:block"></div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide mask-fade-sides">
            {[
              { id: 'wifi', icon: <Wifi className="size-4" />, text: 'Wifi' },
              { id: 'estacionamiento', icon: <Car className="size-4" />, text: 'Cochera' },
              { id: 'mascotas', icon: <PawPrint className="size-4" />, text: 'Mascotas' },
              { id: 'clima', icon: <Zap className="size-4" />, text: 'Clima' },
              { id: 'amueblado', icon: <Home className="size-4" />, text: 'Amueblado' },
            ].map(btn => (
              <button 
                key={btn.id}
                onClick={() => toggleFiltroRapido(btn.id)}
                className={`btn btn-sm font-normal rounded-lg gap-2 shrink-0 transition-colors border
                  ${filtroRapido === btn.id 
                    ? 'bg-orange-600 text-white border-orange-500' 
                    : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white' 
                  }`}
              >
                <span className={filtroRapido === btn.id ? "text-white" : "text-orange-400"}>{btn.icon}</span> 
                {btn.text}
              </button>
            ))}
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
          <button onClick={() => { setBusqueda(""); setTipoFiltro("Todos"); setPrecioFiltro("Todos"); setFiltroRapido(""); }} className="btn btn-outline text-orange-500 border-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:text-white mt-6">
            Limpiar Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inmueblesFiltrados.map((prop) => {
            // Unimos todos los features para sacar los primeros 5
            const todosLosFeatures = [
              ...(prop.servicios || []),
              ...(prop.amenidades || []),
              ...(prop.reglas || [])
            ];
            
            return (
              <div key={prop._id} className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_-5px_rgba(234,88,12,0.15)] transition-all duration-300 flex flex-col">
                <div className="relative h-64 overflow-hidden bg-black/50">
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
                    <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-orange-400 transition-colors">
                      {prop.nombre}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                      <MapPin className="size-4 text-orange-500" /> {prop.direccion}
                    </div>

                    {/* AQUI ESTÁN LOS ICONOS RESUMIDOS */}
                    {todosLosFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                        {todosLosFeatures.slice(0, 5).map((feature, idx) => (
                          <div key={idx} className="tooltip tooltip-top" data-tip={feature.nombre || feature}>
                            {renderFeatureIcon(feature.nombre || feature)}
                          </div>
                        ))}
                        {todosLosFeatures.length > 5 && (
                          <span className="text-xs text-gray-500 font-bold flex items-center ml-1">
                            +{todosLosFeatures.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4">
                    <Link to={`/product/${prop._id}`} className="w-full btn bg-white text-black hover:bg-gray-200 border-none rounded-xl font-bold shadow-md transition-all flex items-center justify-center">
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
    servicios: [], amenidades: [], reglas: []
  };
  
  const [formData, setFormData] = useState(estadoInicialForm);
  const [imagenesPreview, setImagenesPreview] = useState([]);

  useEffect(() => {
    getMisInmueblesAnfitrion();
    getVisitasAnfitrion();
    getCatalogos(); 
  }, [getMisInmueblesAnfitrion, getVisitasAnfitrion, getCatalogos]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImagenesPreview(prev => [...prev, reader.result]);
    });
  };
  const quitarImagen = (index) => setImagenesPreview(prev => prev.filter((_, i) => i !== index));

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
  };

  const abrirModalEditar = (inmueble) => {
    setIsEditing(true);
    setEditId(inmueble._id);
    setFormData({
      nombre: inmueble.nombre,
      direccion: inmueble.direccion,
      costo: inmueble.costo,
      tipo: inmueble.tipo,
      descripcion: inmueble.descripcion,
      servicios: inmueble.servicios.map(s => s._id || s),
      amenidades: inmueble.amenidades.map(a => a._id || a),
      reglas: inmueble.reglas.map(r => r._id || r)
    });
    setImagenesPreview(inmueble.imagenes || []);
    setIsModalOpen(true); 
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
                          {inmueble.imagenes?.length > 0 && <img src={inmueble.imagenes[0]} alt={inmueble.nombre} />}
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
            <div className="space-y-2 border border-dashed border-white/20 p-4 rounded-xl text-center">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <span className="text-sm text-gray-400">Sube fotos de tu propiedad (Max 3)</span>
                <input type="file" multiple accept="image/*" className="file-input file-input-bordered file-input-sm w-full max-w-xs bg-black/30 text-white border-white/10" onChange={handleImageChange} disabled={imagenesPreview.length >= 3} />
              </label>
              {imagenesPreview.length > 0 && (
                <div className="flex gap-2 justify-center mt-4 flex-wrap">
                  {imagenesPreview.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => quitarImagen(index)} className="absolute top-1 right-1 bg-red-600 rounded-full p-1 text-white"><Trash2 className="size-3" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Título" className="input w-full bg-black/30 border-white/10" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
              <input type="text" placeholder="Dirección completa" className="input w-full bg-black/30 border-white/10" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} required />
              <input type="number" placeholder="Costo mensual" className="input w-full bg-black/30 border-white/10" value={formData.costo} onChange={e => setFormData({...formData, costo: e.target.value})} required />
              <select className="select w-full bg-black/30 border-white/10" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Habitacion">Habitación</option>
              </select>
            </div>
            <textarea placeholder="Descripción detallada" className="textarea w-full bg-black/30 border-white/10 h-24" value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} required></textarea>

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