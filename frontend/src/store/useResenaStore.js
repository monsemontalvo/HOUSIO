import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useResenaStore = create((set, get) => ({
  resenas: [],
  isLoading: false,

  getResenas: async (inmuebleId) => {
    set({ isLoading: true });
    try {
      // Ojo aquí: asegúrate de que esta ruta coincida con tu resena.route.js
      const res = await axiosInstance.get(`/resenas/${inmuebleId}`); 
      set({ resenas: res.data });
    } catch (error) {
      console.log("Error en getResenas:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  crearResena: async (resenaData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/resenas", resenaData);
      // Agregamos la reseña nueva hasta arriba de la lista sin recargar la página
      set({ resenas: [res.data, ...get().resenas] });
      toast.success("¡Reseña publicada con éxito!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al publicar la reseña");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));