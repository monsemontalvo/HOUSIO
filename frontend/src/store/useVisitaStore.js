import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useVisitaStore = create((set, get) => ({
  misVisitas: [],
  isLoading: false,

  visitasRecibidas: [], // Para el anfitrión

  getVisitasAnfitrion: async () => {
    try {
      const res = await axiosInstance.get("/visitas/anfitrion");
      set({ visitasRecibidas: res.data });
    } catch (error) {
      console.log(error);
    }
  },

  actualizarEstadoVisita: async (id, estado) => {
    try {
      await axiosInstance.put(`/visitas/${id}/estado`, { estado });
      toast.success(`Visita ${estado.toLowerCase()}`);
      get().getVisitasAnfitrion(); // Recargar lista del anfitrión
      get().getMisVisitas(); // Recargar lista del estudiante
    } catch (error) {
      toast.error("Error al actualizar la visita");
    }
  },
  agendarVisita: async (data) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post("/visitas", data);
      toast.success("¡Visita agendada con éxito!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al agendar");
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  getMisVisitas: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/visitas/inquilino");
      set({ misVisitas: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  }
}));