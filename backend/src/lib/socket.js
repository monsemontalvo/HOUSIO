import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// Creamos un servidor HTTP normal de Node usando nuestra app de Express
const server = http.createServer(app);

// Inicializamos Socket.io sobre ese servidor HTTP
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // El puerto de tu frontend en Vite
  },
});

// Este objeto nos servirá para saber qué usuarios están en línea.
// Guardará la relación: { id_del_usuario_en_bd : id_del_socket }
const userSocketMap = {};

// Función que usaremos en el controlador para encontrar el socket de destino
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// Escuchamos las conexiones entrantes
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado:", socket.id);

  // El frontend nos debe mandar el ID del usuario cuando se conecte
  const userId = socket.handshake.query.userId;
  
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Emitimos a TODOS los clientes conectados la lista de usuarios en línea
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Escuchamos cuando el usuario cierra la pestaña o la app
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      // Actualizamos la lista de conectados
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };