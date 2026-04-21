import Notificacion from "../models/Notificacion.model.js";
import { getReceiverSocketId, io } from "./socket.js";

/**
 * Crea una notificación y la envía por Socket.io
 */
export const enviarNotificacion = async ({ receptor, emisor, tipo, referenciaId, texto }) => {
  try {
    // 1. Guardar en la Base de Datos
    const nuevaNotificacion = new Notificacion({
      receptor,
      emisor,
      tipo,
      referenciaId,
      texto
    });
    await nuevaNotificacion.save();

    // 2. Poblar datos para el frontend
    const notifPoblada = await nuevaNotificacion.populate("emisor", "fullName profilePic");

   // 3. Convertir ObjectId a String
    const receptorIdString = receptor.toString(); 
    const receptorSocketId = getReceiverSocketId(receptorIdString);

   
    console.log("=== INTENTO DE NOTIFICACIÓN ===");
    console.log("Buscando al Dueño con ID:", receptorIdString);
    console.log("Socket encontrado:", receptorSocketId);

    // 4. Si el usuario está conectado...
    if (receptorSocketId) {
      console.log("¡Dueño conectado! Disparando aviso...");
      io.to(receptorSocketId).emit("nueva_notificacion", notifPoblada);
    } else {
      console.log("El dueño no está conectado en este momento.");
    }

    return notifPoblada;
  } catch (error) {
    console.log("Error al enviar notificación:", error.message);
  }
};