import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  
  // Estados de carga (Loading States)
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true, // <--- IMPORTANTE: Empieza en true para verificar al cargar

  // 1. VERIFICAR AUTENTICACIÓN (Esta es la que faltaba)
  checkAuth: async () => {
    try {
      const res = await axios.get("/api/auth/check");
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
      const res = await axios.post("/api/auth/signup", data);
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
      const res = await axios.post("/api/auth/login", data);
      set({ authUser: res.data });
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
      await axios.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al cerrar sesión");
    }
  },

  // 5. ACTUALIZAR PERFIL (Foto)
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/api/auth/update-profile", data);
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