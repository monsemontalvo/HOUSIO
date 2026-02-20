import React, { useState } from 'react';
import { User, Mail, Lock, Home, ArrowRight, Loader, Key } from 'lucide-react'; // Agregamos Key icon
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login, signup, isLoggingIn, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student", // Estado inicial del rol
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login({ email: formData.email, password: formData.password });
      if (success) navigate("/dashboard");
    } else {
      const success = await signup(formData); // Enviamos todo el formData (incluido el role)
      if (success) navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center pt-16 px-4 relative">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-5xl h-auto min-h-[650px] lg:h-[700px] rounded-[30px] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 bg-black/20 backdrop-blur-xl">
        
        {/* LADO IZQUIERDO */}
        <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-center items-center text-center p-12 border-r border-white/10 bg-black/20">
          <div className="bg-white/10 p-6 rounded-[2rem] mb-8 shadow-inner border border-white/20 backdrop-blur-md">
            <Home className="size-20 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold mb-6 text-white tracking-wide drop-shadow-md">
            Bienvenido a <br/> HOUSIO
          </h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-xs mx-auto font-light">
            La plataforma segura para tu vida universitaria.
          </p>
        </div>

        {/* LADO DERECHO (Formulario) */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 relative bg-white/10 overflow-y-auto">
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </h2>
              <p className="text-gray-300 font-light">
                {isLogin ? 'Accede a tu cuenta' : 'Elige cómo quieres usar Housio'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* --- SELECTOR DE ROL (Solo en Registro) --- */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Opción Estudiante */}
                  <div 
                    onClick={() => setFormData({...formData, role: "student"})}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      formData.role === "student" 
                        ? "bg-orange-600 border-orange-500 shadow-lg shadow-orange-900/40" 
                        : "bg-black/20 border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <User className={`size-6 ${formData.role === "student" ? "text-white" : "text-gray-400"}`} />
                    <span className={`text-sm font-medium ${formData.role === "student" ? "text-white" : "text-gray-400"}`}>Busco Depa</span>
                  </div>

                  {/* Opción Arrendador */}
                  <div 
                    onClick={() => setFormData({...formData, role: "landlord"})}
                    className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                      formData.role === "landlord" 
                        ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/40" 
                        : "bg-black/20 border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <Key className={`size-6 ${formData.role === "landlord" ? "text-white" : "text-gray-400"}`} />
                    <span className={`text-sm font-medium ${formData.role === "landlord" ? "text-white" : "text-gray-400"}`}>Rento Depa</span>
                  </div>
                </div>
              )}

              {/* Campo Nombre (Solo Registro) */}
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="size-5 text-gray-400 group-focus-within:text-white transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nombre Completo"
                    className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 px-12 text-white placeholder-gray-400 outline-none focus:bg-black/50 focus:border-white/30 transition-all backdrop-blur-md"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              )}

              {/* Campo Email */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="size-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder={formData.role === 'student' ? "Correo Universitario" : "Correo Personal"}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 px-12 text-white placeholder-gray-400 outline-none focus:bg-black/50 focus:border-white/30 transition-all backdrop-blur-md"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              {/* Campo Contraseña */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="size-5 text-gray-400 group-focus-within:text-white transition-colors" />
                </div>
                <input 
                  type="password" 
                  placeholder="Contraseña"
                  className="w-full bg-black/30 border border-white/10 rounded-2xl py-3.5 px-12 text-white placeholder-gray-400 outline-none focus:bg-black/50 focus:border-white/30 transition-all backdrop-blur-md"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn || isSigningUp}
                className={`w-full font-bold text-lg py-3.5 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 text-white
                  ${formData.role === 'landlord' && !isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'} 
                  ${isLogin ? 'bg-white !text-black hover:bg-gray-200' : ''}`}
              >
                {(isLoggingIn || isSigningUp) ? (
                  <>
                    <Loader className="size-5 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Entrar' : (formData.role === 'landlord' ? 'Registrar como Anfitrión' : 'Registrar como Estudiante')} 
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-400 text-sm">
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