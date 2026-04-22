import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore.js";

// frontend/src/store/useChatStore.js
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useChatStore = create((set, get) => ({
  mensajes: [],
  contactos: [],
  selectedUser: null,
  isMessagesLoading: false,
  socket: null,

  connectSocket: () => {
    const { authUser } = useAuthStore.getState();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    
    socket.connect();
    set({ socket });

    socket.on("nuevoMensaje", (nuevoMensaje) => {
      const { selectedUser } = get();
      // Si el mensaje es de la persona con la que estoy hablando, lo pinto en pantalla
      if (selectedUser && nuevoMensaje.remitente === selectedUser._id) {
        set({ mensajes: [...get().mensajes, nuevoMensaje] });
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null });
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  getContactos: async () => {
    try {
      const res = await axiosInstance.get("/mensajes/contactos");
      set({ contactos: res.data });
    } catch (error) {
      console.log("Error en getContactos", error);
    }
  },

  getMensajes: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/mensajes/${userId}`);
      set({ mensajes: res.data });
    } catch (error) {
      console.log("Error en getMensajes", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  enviarMensaje: async (texto) => {
    const { selectedUser, mensajes } = get();
    if (!selectedUser || !texto.trim()) return;

    try {
      const res = await axiosInstance.post(`/mensajes/send/${selectedUser._id}`, { contenido: texto });
      set({ mensajes: [...mensajes, res.data] });
    } catch  { 
      toast.error("Error al enviar el mensaje");
    }
  },
}));