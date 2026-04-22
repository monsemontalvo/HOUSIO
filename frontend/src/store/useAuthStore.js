// Memoria central del front que recuerda qué usuario inició sesión y se comunica con el backend para gestionar todos sus accesos 

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"; 
import { toast } from "react-hot-toast";

// 1. IMPORTAMOS EL CLIENTE DE SOCKET.IO
import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:3000/" 
  : import.meta.env.VITE_API_URL?.replace("/api", "");

export const useAuthStore = create((set, get) => ({
  authUser: null,
  
  // NUEVO: Estado para guardar la antena de Socket.io
  socket: null, 
  
  // Estados de carga 
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, 

  // 1. VERIFICAR AUTENTICACIÓN 
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      // Si el check es exitoso, ¡conecta el socket!
      get().connectSocket(); 
    } catch (error) {
      console.log("Error en checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 2. REGISTRARSE
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("¡Cuenta creada exitosamente!");
      // Al registrarse, ¡conecta el socket!
      get().connectSocket(); 
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrarse");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 3. INICIAR SESIÓN
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      localStorage.setItem("housio_auth_change", Date.now());
      toast.success("¡Bienvenido de nuevo!");
      // Al loguearse, ¡conecta el socket!
      get().connectSocket(); 
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 4. CERRAR SESIÓN
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.setItem("housio_auth_change", Date.now());
      toast.success("Sesión cerrada correctamente");
      // Al cerrar sesión, ¡desconecta el socket!
      get().disconnectSocket(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cerrar sesión");
    }
  },

  // 5. ACTUALIZAR PERFIL (Foto)
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Información actualizada");
    } catch (error) {
      console.log("Error en update profile:", error);
      toast.error(error.response?.data?.message || "Error al actualizar");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ==========================================
  // FUNCIONES MAESTRAS DEL SOCKET
  // ==========================================
  connectSocket: () => {
    const { authUser } = get();
    // Si no hay usuario o si el socket ya está conectado, no hacemos nada
    if (!authUser || get().socket?.connected) return;

    // Creamos la conexión al backend, enviando el ID del usuario
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();

    // Guardamos el socket en el estado global para que el Navbar lo use
    set({ socket: socket });
  },

  disconnectSocket: () => {
    // Si hay un socket vivo, lo desconectamos
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },

}));