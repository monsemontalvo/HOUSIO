import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Shield, ArrowLeft, Loader,
  CheckCircle, Home, AlertCircle, Zap,
  X, Clock, Bus, BusFront, Footprints,
  University, Pencil 
} from 'lucide-react';
import { useInmuebleStore } from '../store/useInmuebleStore';
import { useAuthStore } from '../store/useAuthStore';
import { useResenaStore } from '../store/useResenaStore';
import { useChatStore } from '../store/useChatStore';
import { toast } from 'react-hot-toast';
import { GoogleMap, useJsApiLoader, Circle, Polyline } from '@react-google-maps/api';
import { DirectionsRenderer } from '@react-google-maps/api';
import { lineasMetro } from '../data/metro/index';


const DetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentInmueble, getInmuebleById, isLoading: loadingInmueble } = useInmuebleStore();
  const { authUser } = useAuthStore();
  // <-- Se agregó actualizarResena
  const { resenas, getResenas, crearResena, actualizarResena, isLoading: loadingResena } = useResenaStore();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const center = {
    lat: Number(currentInmueble?.latitud) || 25.6866,
    lng: Number(currentInmueble?.longitud) || -100.3161
  };

  const { setSelectedUser, enviarMensaje } = useChatStore();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingResenaId, setEditingResenaId] = useState(null); // <-- Estado para saber si editamos
  const [rating, setRating] = useState(5);
  const [comentario, setComentario] = useState("");

  const [selectedImgIndex, setSelectedImgIndex] = useState(null);

  const todasLasImagenes = currentInmueble
    ? [currentInmueble.imagenPrincipal, ...(currentInmueble.imagenes || [])].filter(Boolean)
    : [];

  const proximaImagen = () => setSelectedImgIndex((prev) => (prev + 1) % todasLasImagenes.length);
  const anteriorImagen = () => setSelectedImgIndex((prev) => (prev - 1 + todasLasImagenes.length) % todasLasImagenes.length);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const { inmuebles } = useInmuebleStore();

  const inmueblesDelDueno = inmuebles.filter(
    (inm) => {
      const duenoId = currentInmueble?.dueno?._id || currentInmueble?.dueno;
      const inmDuenoId = inm?.dueno?._id || inm?.dueno;
      return duenoId && inmDuenoId && duenoId === inmDuenoId;
    }
  );
  const [showMetroLines, setShowMetroLines] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [destination, setDestination] = useState('');
  const [directions, setDirections] = useState(null);
  const [steps, setSteps] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  useEffect(() => {
    getInmuebleById(id);
    getResenas(id);
  }, [id, getInmuebleById, getResenas]);

  const handleContactar = async () => {
    if (!authUser) {
      return toast.error("Inicia sesión para poder enviar mensajes");
    }

    // Configurar el chat con el dueño y enviar mensaje de apertura
    setSelectedUser(currentInmueble.dueno);
    await enviarMensaje(`Hola, me interesa "${currentInmueble.nombre}". ¿Aún está disponible?`);

    // Redirigir a la página de chat
    navigate('/chat');
  };

  const getPlaceFromText = (input) => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'mx' }, // opcional
        },
        (predictions, status) => {
          if (
            status !== window.google.maps.places.PlacesServiceStatus.OK ||
            !predictions ||
            predictions.length === 0
          ) {
            return reject("No se encontró lugar");
          }

          const placeId = predictions[0].place_id;

          const placesService = new window.google.maps.places.PlacesService(
            document.createElement('div')
          );

          placesService.getDetails(
            {
              placeId,
              fields: ['formatted_address', 'geometry'],
            },
            (place, status) => {
              if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                return reject("Error al obtener detalles");
              }

              resolve(place);
            }
          );
        }
      );
    });
  };

  const handleSearchRoutes = async () => {
    if (!destination) {
      toast.error("Escribe un destino");
      return;
    }

    try {
      const place = await getPlaceFromText(destination);

      setDestination(place.formatted_address);

      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: center,
          destination: place.geometry.location,
          travelMode: window.google.maps.TravelMode.TRANSIT,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          if (status === 'OK') {
            const routes = result.routes;

            const routeDurationInSeconds = (route) =>
              route.legs[0].duration.value;

            const sortedRoutes = routes.sort((a, b) =>
              routeDurationInSeconds(a) - routeDurationInSeconds(b)
            );

            const bestRoutes = sortedRoutes.slice(0, 20);

            setDirections({
              ...result,
              routes: bestRoutes
            });

            setSelectedRouteIndex(0);
            setSteps(bestRoutes[0].legs[0].steps);
          } else {
            setDirections(null);
            setSteps([]);
            toast.error("No se encontraron rutas 😢");
          }
        }
      );
    } catch  {
      toast.error("No se encontró el destino");
    }
  };

 useEffect(() => {
    const initSearch = async () => {
      if (showRoutes && destination) {
        await handleSearchRoutes();
      }
    };

    initSearch();
  }, [showRoutes]);


  const promedio = resenas?.length > 0
    ? (resenas.reduce((acc, curr) => acc + curr.calificacion, 0) / resenas.length).toFixed(1)
    : "0.0";
  const estrellasLlenas = Math.round(Number(promedio));

  // <-- Modificado para soportar tanto creación como edición
  const handleSubmitResena = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      return toast.error("Por favor escribe un comentario");
    }

    let success;
    if (editingResenaId) {
      success = await actualizarResena(editingResenaId, {
        texto: comentario,
        calificacion: rating
      });
    } else {
      success = await crearResena({
        inmuebleId: id,
        texto: comentario,
        calificacion: rating
      });
    }

    if (success) {
      setIsReviewModalOpen(false);
      setEditingResenaId(null);
      setComentario("");
      setRating(5);
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 capitalize">{currentInmueble.nombre}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
              <MapPin className="size-4 text-orange-500" /> {currentInmueble.zona}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
              <University className="size-4 text-orange-500" /> {currentInmueble.universidadCercana}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl font-bold text-white">${currentInmueble.costo}<span className="text-lg font-normal text-gray-400">/mes</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 h-[300px] md:h-[500px] gap-2 rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10">

          {/* Imagen Principal - Ocupa 2 de las 4 columnas y todo el alto */}
          <div className="md:col-span-2 relative group cursor-pointer" onClick={() => setSelectedImgIndex(0)}>
            <img
              src={currentInmueble.imagenPrincipal}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Principal"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
          </div>

          {/* SUB-GRID DERECHO: Forzamos 2 columnas y 2 filas con altura completa */}
          <div className="hidden md:grid md:col-span-2 grid-cols-2 grid-rows-2 gap-2 h-full">
            {currentInmueble.imagenes?.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer overflow-hidden h-full w-full"
                onClick={() => setSelectedImgIndex(idx + 1)}
              >
                <img
                  src={img}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={`Vista ${idx + 1}`}
                />

                {/* Overlay para más imágenes */}
                {idx === 3 && currentInmueble.imagenes.length > 4 && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center border-2 border-orange-500/50 z-10">
                    <span className="text-white text-3xl font-bold">+{currentInmueble.imagenes.length - 3}</span>
                    <span className="text-orange-400 text-xs font-semibold uppercase tracking-wider">Ver todas</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-white mb-6">Detalles de la propiedad</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">

                {currentInmueble.metros2 && (
                  <div className="flex flex-col border-b border-white/5 pb-2">
                    <span className="text-gray-400 text-sm font-medium">Terreno M2:</span>
                    <span className="text-white text-lg">{currentInmueble.metros2} m²</span>
                  </div>
                )}

                {currentInmueble.detallesTecnicos?.map((detalle, index) => (
                  <div key={index} className="flex flex-col border-b border-white/5 pb-2">
                    <span className="text-gray-400 text-sm font-medium capitalize">
                      {detalle.titulo}:
                    </span>
                    <span className="text-white text-lg">
                      {detalle.descripcion}
                    </span>
                  </div>
                ))}

                {(!currentInmueble.detallesTecnicos || currentInmueble.detallesTecnicos.length === 0) && !currentInmueble.metros2 && (
                  <p className="text-gray-500 italic">No hay detalles técnicos disponibles.</p>
                )}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
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
            <div className="sticky top-28 flex flex-col gap-6">

              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>

                <div
                  onClick={() => setIsUserModalOpen(true)}
                  className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-2xl transition-all mb-6"
                >
                  <div className="avatar">
                    <div className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5 bg-black/50">
                      <img
                        src={currentInmueble.dueno?.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                        alt="Host"
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">
                      {currentInmueble.dueno?.fullName || "Anfitrión"}
                    </h3>
                    <p className="text-sm text-gray-400">Anfitrión Verificado</p>
                  </div>
                </div>

                <button
                  onClick={handleContactar}
                  className="btn w-full bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl text-lg h-12 shadow-lg shadow-orange-900/20 mb-3 flex items-center justify-center transition-all hover:scale-[1.02]"
                >
                  Contactar Anfitrión
                </button>

                <Link
                  to={`/schedule/${currentInmueble._id}`}
                  className="btn w-full btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white rounded-xl text-lg h-12 flex items-center justify-center transition-all"
                >
                  Agendar Visita
                </Link>
              </div>

              {/* MAPA Google Maps*/}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-2xl overflow-hidden h-[450px] flex flex-col">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2 px-1 text-sm md:text-base">
                  <MapPin className="size-4 text-orange-500" />
                  <span className="truncate">{currentInmueble.direccion}</span>
                </h3>

                <div className="flex-1 rounded-2xl overflow-hidden border border-white/5 relative group">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ width: '100%', height: '100%' }}
                      center={center}
                      zoom={16}
                      options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        isFractionalZoomEnabled: true,
                      }}
                    >
                      <Circle
                        center={center}
                        radius={150}
                        options={{
                          strokeColor: '#3b82f6',
                          strokeOpacity: 0.8,
                          strokeWeight: 2,
                          fillColor: '#3b82f6',
                          fillOpacity: 0.35,
                        }}
                      />
                    </GoogleMap>
                  ) : (
                    <div className="w-full h-full bg-black/20 animate-pulse flex items-center justify-center">
                      <Loader className="animate-spin text-gray-500" />
                    </div>
                  )}
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentInmueble.direccion)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-orange-500 hover:text-orange-400 font-bold text-sm transition-colors p-2 bg-orange-500/10 rounded-xl border border-orange-500/20"
                >
                  <MapPin className="size-4" />
                  Abrir en Google Maps
                </a>
                <button
                  onClick={() => setShowRoutes(true)}
                  className="mt-3 w-full flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 cursor-pointer"
                >
                  <BusFront className="size-4" />
                  Ver rutas de transporte
                </button>

              </div>

            </div>
          </div>

        </div>

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
                {/* <-- Modificado para agregar el botón de Editar con diseño flex justify-between --> */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full bg-black/50">
                        <img src={resena.autor?.profilePic || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
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

                  {/* <-- Lógica para que solo el autor vea el botón de Editar --> */}
                  {(resena.autor?._id === authUser?._id || resena.autor === authUser?._id) && (
                    <button 
                      onClick={() => {
                        setEditingResenaId(resena._id);
                        setComentario(resena.texto);
                        setRating(resena.calificacion);
                        setIsReviewModalOpen(true);
                      }}
                      className="text-gray-500 hover:text-orange-500 transition-colors p-2"
                      title="Editar mi reseña"
                    >
                      <Pencil className="size-4" />
                    </button>
                  )}
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

      <div className={`modal ${isReviewModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-neutral-900 border border-white/10 text-white max-w-md">
          {/* <-- Título dinámico --> */}
          <h3 className="font-bold text-2xl mb-2">{editingResenaId ? "Editar tu reseña" : "Tu opinión importa"}</h3>
          <p className="text-gray-400 text-sm mb-6">Califica tu experiencia en esta propiedad.</p>

          <form onSubmit={handleSubmitResena} className="space-y-6">
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

            <div>
              <textarea
                className="textarea w-full bg-black/30 border-white/10 h-32 resize-none focus:border-orange-500 transition-colors"
                placeholder="Ej. El anfitrión fue muy amable y el WiFi es excelente..."
                value={comentario}
                onChange={e => setComentario(e.target.value)}
              ></textarea>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setEditingResenaId(null); // <-- Limpiamos el estado
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
                {/* <-- Texto del botón dinámico --> */}
                {loadingResena ? <Loader className="animate-spin size-5" /> : (editingResenaId ? 'Actualizar Reseña' : 'Publicar Reseña')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* AQUI ESTA EL MODAL DE NAVEGACION DE IMAGENES AHI LO HACEN MAS BONITO xd */}
      {selectedImgIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setSelectedImgIndex(null)}
            className="absolute top-8 right-8 text-white hover:text-orange-500 transition-colors"
          >
            <X className="size-10" />
          </button>

          <button onClick={anteriorImagen} className="absolute left-4 p-2 bg-white/10 hover:bg-orange-600 rounded-full text-white transition-all">
            <ArrowLeft className="size-8" />
          </button>

          <div className="max-w-5xl max-h-[80vh] flex flex-col items-center">
            <img
              src={todasLasImagenes[selectedImgIndex]}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              alt="Visualización"
            />
            <p className="text-white/60 mt-4 font-mono">
              {selectedImgIndex + 1} / {todasLasImagenes.length}
            </p>
          </div>

          <button onClick={proximaImagen} className="absolute right-4 p-2 bg-white/10 hover:bg-orange-600 rounded-full text-white transition-all">
            <ArrowLeft className="size-8 rotate-180" />
          </button>
        </div>
      )}

      {/* Tarjeta de presentacion porque si */}
      {isUserModalOpen && currentInmueble.dueno && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">

            <div className="relative p-8 bg-gradient-to-br from-orange-600/20 to-transparent flex flex-col md:flex-row-reverse items-center gap-8 border-b border-white/10">
              <div className="relative">
                <img
                  src={currentInmueble.dueno.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 md:size-40 rounded-full object-cover border-4 border-orange-500 shadow-lg shadow-orange-500/20"
                />
              </div>

              <button
                onClick={() => setIsUserModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                <X className="size-6" />
              </button>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">{currentInmueble.dueno.fullName}</h2>
                <p className="text-orange-400 font-medium mb-4">{currentInmueble.dueno.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm">
                  <Clock className="size-4" />
                  <span>
                    Miembro desde: {
                      currentInmueble?.dueno?.createdAt
                        ? new Date(currentInmueble.dueno.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : "Fecha no disponible"
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Home className="size-5 text-orange-500" />
                Propiedades publicadas
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {inmueblesDelDueno.map((inm) => (
                  <Link
                    key={inm._id}
                    to={`/product/${inm._id}`}
                    onClick={() => setIsUserModalOpen(false)}
                    className="group bg-white/5 border border-white/10 p-3 rounded-xl flex items-center gap-4 hover:bg-orange-600/10 hover:border-orange-500/50 transition-all"
                  >
                    <img
                      src={inm.imagenPrincipal || "/placeholder-house.png"}
                      className="size-16 rounded-lg object-cover"
                      alt={inm.nombre}
                    />
                    <div className="overflow-hidden">
                      <p className="text-white font-medium truncate group-hover:text-orange-400">
                        {inm.nombre}
                      </p>
                      <p className="text-gray-500 text-sm">
                        ${inm.costo?.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showRoutes && (
        <div className="fixed inset-0 z-[120] bg-black flex">

          <button
            onClick={() => {
              setShowRoutes(false);
              setDirections(null);
              setSteps([]);
              setDestination("");
              setShowMetroLines(false);
              setSelectedRouteIndex(0);
            }}
            className="absolute top-4 right-4 z-[130] p-2 bg-red/10 hover:bg-red-500 text-black rounded-full transition-all backdrop-blur-md border border-white/20"
            title="Cerrar mapa"
          >
            <X className="size-6" />
          </button>

          <div className="flex h-full">
            <div className="w-[300px] bg-neutral-900 border-r border-white/10 flex flex-col">

              <div className="p-4 border-b border-white/10">
                <input
                  type="text"
                  placeholder="¿A dónde quieres ir?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white mb-3"
                />

                <button
                  onClick={handleSearchRoutes}
                  className="w-full bg-orange-600 py-2 rounded-xl text-white font-bold"
                >
                  Buscar ruta
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {directions?.routes?.map((route, i) => {
                  const duration = route.legs[0].duration.text;
                  const distance = route.legs[0].distance.text;
                  const transfers = route.legs[0].steps.filter(s => s.travel_mode === "TRANSIT").length;

                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedRouteIndex(i);
                        setSteps(route.legs[0].steps);
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition ${selectedRouteIndex === i ? "bg-white/12" : "bg-white/4"
                        }`}
                    >
                      <p className="font-bold text-white">
                        Ruta {i + 1}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                          <Clock className="size-3.5 text-orange-500" />
                          <span className="text-xs font-bold text-orange-400">
                            {duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <MapPin className="size-3.5 text-blue-500" />
                          <span className="text-xs font-bold text-blue-400">
                            {distance}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Bus className="size-3.5 text-orange-500" />
                        <p className="text-xs text-gray-400 font-medium">
                          {transfers === 0 ? "Sin transbordos" : `${transfers} ${transfers === 1 ? 'transporte' : 'transportes'}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-[300px] bg-black/80 border-r border-white/10 flex flex-col">

              <div className="p-4 border-b border-white/10 text-white font-bold">
                Detalles de la ruta
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {steps.length > 0 ? (
                  steps.map((step, index) => {
                    const isTransit = step.travel_mode === "TRANSIT";

                    return (
                      <div key={index} className="bg-white/5 p-3 rounded-xl text-sm text-white">
                        <p className="flex items-center gap-2 font-bold text-sm mb-2">
                          {isTransit ? (
                            <>
                              <BusFront className="size-4 text-orange-500" />
                              <span className="text-white">Transporte</span>
                            </>
                          ) : (
                            <>
                              <Footprints className="size-4 text-blue-400" />
                              <span className="text-white">Caminar</span>
                            </>
                          )}
                        </p>

                        <p dangerouslySetInnerHTML={{ __html: step.instructions }} />

                        {isTransit && step.transit && (
                          <div className="text-xs text-gray-400 mt-1">
                            Línea: {step.transit.line.short_name || step.transit.line.name}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 text-center mt-10">
                    Selecciona una ruta
                  </p>
                )}
              </div>
            </div>

          </div>

          <div className="flex-1 relative">
            <button
              onClick={() => setShowMetroLines(!showMetroLines)}
              className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-md transition-all ${showMetroLines
                ? "bg-orange-600 text-white"
                : "bg-black/70 text-white hover:bg-orange-600/50"
                }`}
            >
              {showMetroLines ? "Ocultar líneas del metro" : "Ver líneas del metro"}
            </button>
            {isLoaded && (

              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={14}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  gestureHandling: "greedy",

                  styles: [
                    {
                      featureType: "poi",
                      stylers: [{ visibility: "off" }]
                    },
                    {
                      featureType: "transit",
                      stylers: [{ visibility: "on" }]
                    }
                  ]
                }}
              >
                {lineasMetro.map((linea, index) => (
                  <Polyline
                    key={index}
                    path={linea.ruta}
                    options={{
                      strokeColor: linea.color,
                      strokeOpacity: showMetroLines ? 0.8 : 0,
                      strokeWeight: 5,
                      visible: showMetroLines,
                    }}
                  />
                ))}
                <Circle
                  center={center}
                  radius={80}
                  options={{
                    strokeColor: '#f97316',
                    fillColor: '#f97316',
                    fillOpacity: 0.6,
                  }}
                />

                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    routeIndex={selectedRouteIndex}
                  />
                )}
              </GoogleMap>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default DetailsPage;