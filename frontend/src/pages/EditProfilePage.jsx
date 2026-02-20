import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Calendar, Camera, Save, Loader } from 'lucide-react';

const EditProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setSelectedImg(reader.result);
    };
  };

  const handleUpdateProfile = async () => {
    if (!selectedImg) return;
    await updateProfile({ profilePic: selectedImg });
    setSelectedImg(null); // Limpiar preview tras subir
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 relative pt-24 px-4 pb-12 overflow-hidden flex items-center justify-center">
      
      {/* Luces Ambientales (Estilo Housio) */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Contenedor de Cristal */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tu Perfil</h1>
          <p className="text-gray-400">Gestiona tu imagen y visualiza tus datos</p>
        </div>

        {/* --- SECCIÓN DE FOTO DE PERFIL --- */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 shadow-xl relative">
              <img
                src={selectedImg || authUser.profilePic || "/UserPlaceholder.png"}
                alt="Profile"
                className="w-full h-full object-cover object-center"
              />
              {/* Overlay oscuro al hacer hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Botón Flotante para subir foto */}
            <label 
              htmlFor="avatar-upload" 
              className={`absolute bottom-0 right-0 p-2.5 rounded-full cursor-pointer transition-all shadow-lg border border-neutral-800
                ${isUpdatingProfile ? "bg-gray-600 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700 text-white"}
              `}
            >
              {isUpdatingProfile ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>

          <p className="text-sm text-gray-500">
            {isUpdatingProfile ? "Subiendo..." : "Haz clic en la cámara para cambiar tu foto"}
          </p>
        </div>

        {/* --- DATOS DEL USUARIO (SOLO LECTURA) --- */}
        <div className="space-y-6">
          
          {/* Nombre Completo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" /> Nombre Completo
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-gray-300 cursor-not-allowed select-none">
              {authUser?.fullName}
            </div>
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" /> Correo Electrónico
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-gray-300 cursor-not-allowed select-none">
              {authUser?.email}
            </div>
          </div>

          {/* Miembro Desde */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" /> Miembro Desde
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-gray-300 cursor-not-allowed select-none">
              {authUser?.createdAt?.split("T")[0] || "Fecha no disponible"}
            </div>
          </div>

        </div>

        {/* --- BOTÓN DE GUARDAR (Solo aparece si seleccionaste una imagen) --- */}
        {selectedImg && (
          <div className="mt-8 animate-fade-in-up">
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdatingProfile}
              className="w-full btn bg-orange-600 hover:bg-orange-700 text-white border-none rounded-xl h-12 text-lg shadow-lg shadow-orange-900/20 gap-2"
            >
              {isUpdatingProfile ? (
                <>
                  <Loader className="size-5 animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="size-5" /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default EditProfilePage;