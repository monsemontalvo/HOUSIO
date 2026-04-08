import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Wifi, Car, PawPrint, Zap, Star, Shield, ArrowLeft, Loader } from 'lucide-react';
import { useInmuebleStore } from '../store/useInmuebleStore';

const DetailsPage = () => {
    const { id } = useParams();
    const { currentInmueble, getInmuebleById, isLoading } = useInmuebleStore();

    useEffect(() => {
        getInmuebleById(id);
    }, [id, getInmuebleById]);

    if (isLoading || !currentInmueble) {
        return (
            <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center">
                <Loader className="size-12 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-6xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="size-5" /> Regresar al Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{currentInmueble.nombre}</h1>
                        <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
                            <MapPin className="size-4 text-orange-500" /> {currentInmueble.direccion}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold text-white">${currentInmueble.costo}<span className="text-lg font-normal text-gray-400">/mes</span></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[400px] md:h-[500px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group relative">
                        <img src={currentInmueble.imagenes?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="rounded-3xl overflow-hidden shadow-xl border border-white/10 group relative hidden md:block">
                        <img src={currentInmueble.imagenes?.[1] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="rounded-3xl overflow-hidden shadow-xl border border-white/10 group relative hidden md:block">
                        <img src={currentInmueble.imagenes?.[2] || 'https://images.unsplash.com/photo-1616594039964-40891a909d99'} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Sobre este lugar</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">{currentInmueble.descripcion}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                <Link to="/chat" className="btn w-full bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl text-lg h-12 shadow-lg shadow-orange-900/20 mb-3">
                                    Contactar Anfitrión
                                </Link>
                                <Link to={`/schedule/${currentInmueble._id}`} className="btn w-full btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white rounded-xl text-lg h-12">
                                    Agendar Visita
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;