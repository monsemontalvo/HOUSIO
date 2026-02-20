import React, { useState } from 'react';
import { User, Mail, Lock, Home, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    // 1. FONDO: Imagen de casa moderna con superposición oscura para que resalte el cristal
    <div className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center pt-16 px-4 relative">

      {/* Capa oscura (Overlay) para mejorar la lectura */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* 2. TARJETA DE CRISTAL (Glassmorphism) */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl h-[650px] lg:h-[700px] rounded-[30px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 bg-black/20 backdrop-blur-xl">

        {/* LADO IZQUIERDO: Bienvenida (Cristal más oscuro) */}
        <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-center items-center text-center p-12 border-r border-white/10 bg-black/20">
          <div className="bg-white/10 p-6 rounded-[2rem] mb-8 shadow-inner border border-white/20 backdrop-blur-md">
            <Home className="size-20 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold mb-6 text-white tracking-wide drop-shadow-md">
            Bienvenido a <br /> HOUSIO
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-xs mx-auto font-light">
            La plataforma diseñada por estudiantes para estudiantes.
          </p>
        </div>

        {/* LADO DERECHO: Formulario (Cristal más claro) */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 relative bg-white/10">

          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-gray-300 font-light">
                {isLogin ? 'Accede a tu cuenta' : 'Únete a nuestra comunidad'}
              </p>
            </div>

            <form className="space-y-5">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="size-5 text-gray-400 group-focus-within:text-white transition-colors" />
                  </div>
                  {/* Input estilo cristal oscuro */}
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 px-12 text-white placeholder-gray-400 outline-none focus:bg-black/50 focus:border-white/30 transition-all backdrop-blur-md" placeholder="Nombre Completo" />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input type="email" className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 px-12 text-white placeholder-gray-400 outline-none focus:bg-black/50 focus:border-white/30 transition-all backdrop-blur-md" placeholder="Correo" />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input type="password" className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 px-12 text-white placeholder-gray-400 outline-none focus:bg-black/50 focus:border-white/30 transition-all backdrop-blur-md" placeholder="Contraseña" />
              </div>

              {/* Botón Blanco Brillante (Estilo Apple) */}
              <button className="w-full bg-white text-gray-900 font-bold text-lg py-3.5 rounded-2xl shadow-lg hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
                {isLogin ? 'Entrar' : 'Registrarme'} <ArrowRight className="size-5" />
              </button>
            </form>

            <div className="mt-8 text-center text-gray-400 text-sm">
              <p>
                {isLogin ? '¿Nuevo por aquí? ' : '¿Ya tienes cuenta? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold text-white hover:underline focus:outline-none ml-1 transition-colors"
                >
                  {isLogin ? 'Crea una cuenta' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;