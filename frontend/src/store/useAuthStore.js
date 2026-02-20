import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,

  // Función para REGISTRARSE
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/api/auth/signup", data);
      set({ authUser: res.data });
      toast.success("¡Cuenta creada exitosamente!");
      return true; // Retorna true para saber que todo salió bien
    } catch (error) {
      toast.error(error.response.data.message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  // Función para INICIAR SESIÓN
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

  // Función para CERRAR SESIÓN
  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));