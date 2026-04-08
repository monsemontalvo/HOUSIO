import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useInmuebleStore = create((set) => ({
  inmuebles: [],
  currentInmueble: null, // Para guardar la casa seleccionada
  isLoading: false,
  misInmuebles: [], // Para guardar solo los del dueño
  
  getMisInmueblesAnfitrion: async () => {
  set({ isLoading: true });
  try {
    const { authUser } = useAuthStore.getState();
    if (!authUser) return; // Seguridad por si no hay sesión

    const res = await axiosInstance.get("/inmuebles");
    
    // Filtramos asegurando que ambos sean Strings
    const misPropiedades = res.data.filter(inmueble => {
      const duenoId = inmueble.dueno?._id || inmueble.dueno;
      return duenoId?.toString() === authUser._id?.toString();
    });

    set({ misInmuebles: misPropiedades });
  } catch (error) {
    console.log("Error en getMisInmueblesAnfitrion:", error);
  } finally {
    set({ isLoading: false });
  }
},

  crearInmueble: async (data) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/inmuebles", data);
      toast.success("¡Propiedad publicada exitosamente!");
      get().getMisInmueblesAnfitrion(); // Recargamos la lista
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al publicar");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getInmuebles: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/inmuebles");
      set({ inmuebles: res.data });
    } catch (error) {
      toast.error("Error al cargar las propiedades");
    } finally {
      set({ isLoading: false });
    }
  },

  getInmuebleById: async (id) => {
    set({ isLoading: true });
    try {
      // Obtenemos todas y filtramos para no modificar tu backend actual
      const res = await axiosInstance.get("/inmuebles");
      const found = res.data.find(i => i._id === id);
      set({ currentInmueble: found });
    } catch (error) {
      toast.error("Error al cargar detalles de la propiedad");
    } finally {
      set({ isLoading: false });
    }
  }
  
}));