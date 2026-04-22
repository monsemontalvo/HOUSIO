import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useInmuebleStore = create((set, get) => ({
  inmuebles: [],
  currentInmueble: null, // Para guardar la casa seleccionada
  isLoading: false,
  misInmuebles: [], // Para guardar solo los del dueño
  catalogos: { servicios: [], amenidades: [], reglas: [] },

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

  eliminarInmueble: async (id) => {
    try {
      await axiosInstance.delete(`/inmuebles/${id}`);
      set((state) => ({
        misInmuebles: state.misInmuebles.filter((inmueble) => inmueble._id !== id),
        inmuebles: state.inmuebles.filter((inmueble) => inmueble._id !== id),
      }));
      toast.success("Propiedad eliminada correctamente");
    } catch (error) {
      toast.error("Error al eliminar la propiedad");
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

  getCatalogos: async () => {
    try {
      const res = await axiosInstance.get("/inmuebles/catalogos/todos");
      set({ catalogos: res.data });
    } catch (error) {
      console.log("Error catálogos", error);
    }
  },

  getInmuebleById: async (id) => {
    set({ isLoading: true });
    try {
      // ESTE CAMBIO ES VITAL: Llamamos directamente al ID de la propiedad
      const res = await axiosInstance.get(`/inmuebles/${id}`); 
      set({ currentInmueble: res.data });
    } catch (error) {
      toast.error("Error al cargar detalles de la propiedad");
    } finally {
      set({ isLoading: false });
    }
  },

  actualizarInmueble: async (id, data) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(`/inmuebles/${id}`, data);
      toast.success("¡Propiedad actualizada exitosamente!");
      get().getMisInmueblesAnfitrion(); // Recargamos la lista
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar");
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
  
}));