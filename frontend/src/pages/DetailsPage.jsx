import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Wifi, Car, PawPrint, Zap, Star, User, Shield, ArrowLeft } from 'lucide-react';

const DetailsPage = () => {
    const { id } = useParams();

    // INFO PROVISIONAL (Mock Data)
    const property = {
        id: id,
        title: 'Loft Moderno en San Nicolás',
        price: '$4,500',
        address: 'Av. Universidad 123, Anáhuac, San Nicolás de los Garza',
        description: 'Increíble loft diseñado para estudiantes. Cuenta con espacios abiertos, mucha luz natural y está a solo 5 minutos caminando de la entrada principal de la UANL. El edificio tiene seguridad 24/7 y áreas comunes de estudio.',
        rating: 4.8,
        reviews: 124,
        host: {
            name: 'Roberto Gómez',
            joined: 'Mayo 2024',
            image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
            isSuperhost: true
        },
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1616594039964-40891a909d99?q=80&w=2670&auto=format&fit=crop'
        ],
        amenities: [
            { icon: <Wifi className="size-5" />, name: 'Wifi de Alta Velocidad' },
            { icon: <Car className="size-5" />, name: 'Estacionamiento Techado' },
            { icon: <Zap className="size-5" />, name: 'Servicios Incluidos' },
            { icon: <PawPrint className="size-5" />, name: 'Pet Friendly' },
            { icon: <Shield className="size-5" />, name: 'Seguridad 24/7' },
        ]
    };

    return (
        <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden">

            {/* Luces Ambientales */}
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto">

                {/* Botón Regresar */}
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="size-5" /> Regresar al Dashboard
                </Link>

                {/* Encabezado Principal */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{property.title}</h1>
                        <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
                            <MapPin className="size-4 text-orange-500" />
                            {property.address}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-3xl font-bold text-white">{property.price}<span className="text-lg font-normal text-gray-400">/mes</span></span>
                        <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                            <Star className="size-4 fill-yellow-400" />
                            <span className="font-bold">{property.rating}</span>
                            <span className="text-gray-500 underline decoration-gray-500 ml-1">({property.reviews} reseñas)</span>
                        </div>
                    </div>
                </div>

                {/* Galería de Imágenes (Grid Bento) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[400px] md:h-[500px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group relative">
                        <img src={property.images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                    </div>
                    <div className="rounded-3xl overflow-hidden shadow-xl border border-white/10 group relative hidden md:block">
                        <img src={property.images[1]} alt="Sub 1" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="rounded-3xl overflow-hidden shadow-xl border border-white/10 group relative hidden md:block">
                        <img src={property.images[2]} alt="Sub 2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        {/* Overlay para "Ver más fotos" */}
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white font-bold border border-white px-4 py-2 rounded-xl backdrop-blur-sm">Ver todas</span>
                        </div>
                    </div>
                </div>

                {/* Contenido Dividido: Info vs Card Flotante */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* COLUMNA IZQUIERDA: Detalles */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Descripción */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">Sobre este lugar</h2>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenidades */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Lo que ofrece</h2>
                            <div className="grid grid-cols-2 gap-y-4">
                                {property.amenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-gray-300">
                                        <div className="p-2 bg-white/10 rounded-lg text-orange-400">{item.icon}</div>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* MAPA (Placeholder) */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 overflow-hidden h-[300px] relative group">
                            {/* Imagen de fondo simulando mapa (puedes cambiarla por una captura de Google Maps real de la zona) */}
                            <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-100.31,25.72,13,0/800x400?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 backdrop-blur-[2px]">
                                <MapPin className="size-10 text-orange-500 mb-2 animate-bounce" />
                                <h3 className="text-xl font-bold text-white">Ubicación Exacta</h3>
                                <p className="text-gray-400 text-sm">Se mostrará al confirmar la visita</p>
                                {/* Nota para ti */}
                                <span className="badge badge-warning gap-2 mt-4 opacity-80">Aquí irá Google Maps API</span>
                            </div>
                        </div>

                    </div>

                    {/* COLUMNA DERECHA: Card de Anfitrión/Contacto (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">

                            {/* Card del Anfitrión */}
                            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>

                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="avatar">
                                        <div className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5">
                                            <img src={property.host.image} alt={property.host.name} className="rounded-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{property.host.name}</h3>
                                        <p className="text-sm text-gray-400">Anfitrión desde {property.host.joined}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 relative z-10">
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Shield className="size-4 text-green-400" /> Identidad verificada
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                                        <Star className="size-4 text-yellow-400" /> Superanfitrión
                                    </div>
                                </div>

                                <Link to="/chat" className="btn w-full bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl text-lg h-12 shadow-lg shadow-orange-900/20 flex items-center justify-center">
                                    Contactar Anfitrión
                                </Link>

                                <Link to={`/schedule/${property.id}`} className="btn w-full btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white rounded-xl text-lg h-12 mt-3 flex items-center justify-center">
                                    Agendar Visita
                                </Link>
                            </div>

                            {/* Card de Seguridad */}
                            <div className="bg-white/5 backdrop-blur-lg border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                                <Shield className="size-6 text-green-500 shrink-0 mt-1" />
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Para proteger tu pago, nunca transfieras dinero ni te comuniques fuera de la página o la aplicación de HOUSIO.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DetailsPage;