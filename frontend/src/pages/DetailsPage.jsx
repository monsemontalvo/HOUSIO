import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Shield, ArrowLeft, Loader, 
  CheckCircle, Home, AlertCircle, Zap 
} from 'lucide-react';
import { useInmuebleStore } from '../store/useInmuebleStore';
import { useAuthStore } from '../store/useAuthStore';
import { useResenaStore } from '../store/useResenaStore';
import { toast } from 'react-hot-toast';

const DetailsPage = () => {
  const { id } = useParams();
  const { currentInmueble, getInmuebleById, isLoading: loadingInmueble } = useInmuebleStore();
  const { authUser } = useAuthStore();
  const { resenas, getResenas, crearResena, isLoading: loadingResena } = useResenaStore();

  // ESTADOS PARA EL MODAL DE RESEÑAS
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5); // Por defecto 5 estrellas
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    getInmuebleById(id);
    getResenas(id);
  }, [id, getInmuebleById, getResenas]);

  // CALCULO DEL PROMEDIO
  const promedio = resenas?.length > 0 
    ? (resenas.reduce((acc, curr) => acc + curr.calificacion, 0) / resenas.length).toFixed(1) 
    : "0.0";
  const estrellasLlenas = Math.round(Number(promedio));

  // FUNCIÓN PARA GUARDAR LA RESEÑA
  const handleSubmitResena = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      return toast.error("Por favor escribe un comentario");
    }

    // Estos nombres coinciden exactamente con lo que espera tu Backend
    const success = await crearResena({
      inmuebleId: id,
      texto: comentario,
      calificacion: rating
    });

    if (success) {
      setIsReviewModalOpen(false); // Cerramos el modal
      setComentario(""); // Limpiamos el texto
      setRating(5); // Reiniciamos las estrellas
    }
  };

  if (loadingInmueble || !currentInmueble) {
    return (
      <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
        <Loader className="size-12 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="size-5" /> Regresar al Dashboard
        </Link>

        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 capitalize">{currentInmueble.nombre}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
              <MapPin className="size-4 text-orange-500" /> {currentInmueble.direccion}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold text-white">${currentInmueble.costo}<span className="text-lg font-normal text-gray-400">/mes</span></span>
          </div>
        </div>

        {/* Galería de Imágenes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[400px] md:h-[500px]">
          <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group relative bg-black/50">
            <img src={currentInmueble.imagenes?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670'} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-white/10 group relative hidden md:block bg-black/50">
            <img src={currentInmueble.imagenes?.[1] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580'} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border border-white/10 group relative hidden md:block bg-black/50">
            <img src={currentInmueble.imagenes?.[2] || 'https://images.unsplash.com/photo-1616594039964-40891a909d99?q=80&w=2670'} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>

        {/* Contenido Dividido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Sobre este lugar</h2>
              <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">{currentInmueble.descripcion}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-8">Lo que este lugar ofrece</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div>
                  <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2"><Zap className="size-5" /> Servicios</h3>
                  <ul className="space-y-3">
                    {currentInmueble.servicios?.length > 0 ? currentInmueble.servicios.map((s, i) => (
                      <li key={i} className="text-gray-300 flex items-center gap-2 capitalize"><CheckCircle className="size-4 text-orange-500" /> {s.nombre || s}</li>
                    )) : <li className="text-gray-500 text-sm">No especificado</li>}
                  </ul>
                </div>

                <div>
                  <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><Home className="size-5" /> Amenidades</h3>
                  <ul className="space-y-3">
                    {currentInmueble.amenidades?.length > 0 ? currentInmueble.amenidades.map((a, i) => (
                      <li key={i} className="text-gray-300 flex items-center gap-2 capitalize"><CheckCircle className="size-4 text-blue-500" /> {a.nombre || a}</li>
                    )) : <li className="text-gray-500 text-sm">No especificado</li>}
                  </ul>
                </div>

                <div>
                  <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2"><Shield className="size-5" /> Reglas</h3>
                  <ul className="space-y-3">
                    {currentInmueble.reglas?.length > 0 ? currentInmueble.reglas.map((r, i) => (
                      <li key={i} className="text-gray-300 flex items-center gap-2 capitalize"><AlertCircle className="size-4 text-pink-500" /> {r.nombre || r}</li>
                    )) : <li className="text-gray-500 text-sm">No especificado</li>}
                  </ul>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5 bg-black/50">
                      <img src={currentInmueble.dueno?.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Host" className="rounded-full object-cover" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">{currentInmueble.dueno?.fullName || "Anfitrión"}</h3>
                    <p className="text-sm text-gray-400">Anfitrión Verificado</p>
                  </div>
                </div>
                <Link to="/chat" className="btn w-full bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl text-lg h-12 shadow-lg shadow-orange-900/20 mb-3 flex items-center justify-center">
                  Contactar Anfitrión
                </Link>
                <Link to={`/schedule/${currentInmueble._id}`} className="btn w-full btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white rounded-xl text-lg h-12 flex items-center justify-center">
                  Agendar Visita
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE RESEÑAS */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Reseñas de la comunidad</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`size-5 ${i < estrellasLlenas ? 'fill-current' : ''}`} /> 
                  ))}
                </div>
                <span className="text-white font-bold text-lg">{promedio}</span>
                <span className="text-gray-500">(Basado en {resenas?.length || 0} opiniones)</span>
              </div>
            </div>
            
            {/* ESTE BOTÓN AHORA ABRE EL MODAL */}
            {authUser?.role === 'student' && (
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="btn bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl"
              >
                Escribir Reseña
              </button>
            )}
          </div>

          <div className="space-y-6">
            {resenas?.map((resena) => (
              <div key={resena._id} className="border-b border-white/5 pb-6 last:border-none">
                <div className="flex items-center gap-3 mb-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-black/50">
                     <img src={resena.autor?.profilePic && resena.autor.profilePic !== "" ? resena.autor.profilePic : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-white capitalize">{resena.autor?.fullName || "Usuario"}</h4>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-3 ${i < resena.calificacion ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed italic">"{resena.texto}"</p>
              </div>
            ))}
            
            {(!resenas || resenas.length === 0) && (
              <p className="text-center text-gray-500 py-10">Aún no hay reseñas. ¡Sé el primero en comentar!</p>
            )}
          </div>
        </div>

      </div>

      {/* MODAL PARA ESCRIBIR LA RESEÑA */}
      <div className={`modal ${isReviewModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-neutral-900 border border-white/10 text-white max-w-md">
          <h3 className="font-bold text-2xl mb-2">Tu opinión importa</h3>
          <p className="text-gray-400 text-sm mb-6">Califica tu experiencia en esta propiedad.</p>
          
          <form onSubmit={handleSubmitResena} className="space-y-6">
            
            {/* Estrellas interactivas (1 al 5) */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRating(num)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star className={`size-10 ${num <= rating ? 'fill-orange-500 text-orange-500' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>

            {/* Campo de texto */}
            <div>
              <textarea 
                className="textarea w-full bg-black/30 border-white/10 h-32 resize-none focus:border-orange-500 transition-colors" 
                placeholder="Ej. El anfitrión fue muy amable y el WiFi es excelente..." 
                value={comentario} 
                onChange={e => setComentario(e.target.value)} 
              ></textarea>
            </div>
            
            {/* Botones de acción */}
            <div className="modal-action">
              <button 
                type="button" 
                className="btn btn-ghost" 
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setComentario("");
                  setRating(5);
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn bg-orange-600 text-white border-none hover:bg-orange-700" 
                disabled={loadingResena}
              >
                {loadingResena ? <Loader className="animate-spin size-5" /> : 'Publicar Reseña'}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default DetailsPage;