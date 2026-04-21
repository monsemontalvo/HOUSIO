import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "./useChatStore";

export const useNotificacionStore = create((set, get) => ({
  notificaciones: [],
  unreadCount: 0,

  getNotificaciones: async () => {
    try {
      const res = await axiosInstance.get("/notificaciones");
      set({ 
        notificaciones: res.data,
        unreadCount: res.data.filter(n => !n.leida).length
      });
    } catch (error) {
      console.log("Error al obtener notificaciones:", error);
    }
  },

  marcarComoLeida: async (id) => {
    try {
      await axiosInstance.put(`/notificaciones/${id}/leer`);
      const nuevasNotif = get().notificaciones.map(n => 
        n._id === id ? { ...n, leida: true } : n
      );
      set({ 
        notificaciones: nuevasNotif,
        unreadCount: nuevasNotif.filter(n => !n.leida).length
      });
    } catch (error) {
      console.log("Error al marcar como leída:", error);
    }
  },

  suscribirseNotificaciones: () => {
    const socket = useChatStore.getState().socket;
    if (!socket) return;

    socket.off("nueva_notificacion");

    socket.on("nueva_notificacion", (notificacion) => {
      console.log("¡BINGO! EL FRONTEND RECIBIÓ LA NOTIFICACIÓN:", notificacion);
      set((state) => ({
        notificaciones: [notificacion, ...state.notificaciones],
        unreadCount: state.unreadCount + 1,
      }));
    });
  },

  desuscribirseNotificaciones: () => {
    const socket = useChatStore.getState().socket;
    if (!socket) return;
    socket.off("nueva_notificacion");
  },
}));