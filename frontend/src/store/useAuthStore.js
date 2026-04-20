// Memoria central del front que recuerda qué usuario inició sesión y se comunica con el backend para gestionar todos sus accesos 

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"; // <-- ¡Aquí importamos TU instancia configurada!
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  
  // Estados de carga 
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, 

  // 1. VERIFICAR AUTENTICACIÓN 
  checkAuth: async () => {
    try {
      // Como axiosInstance ya apunta a ".../api", solo ponemos el resto de la ruta
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
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
      toast.success("Foto de perfil actualizada");
    } catch (error) {
      console.log("Error en update profile:", error);
      toast.error(error.response?.data?.message || "Error al actualizar");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));