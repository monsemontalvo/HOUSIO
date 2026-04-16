import Mensaje from "../models/Mensaje.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// --- 1. OBTENER HISTORIAL DE CHAT CON UN USUARIO ---
export const obtenerMensajes = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // El ID del usuario con el que estamos platicando
    const myId = req.user._id; // Mi propio ID

    // Buscamos los mensajes donde yo soy remitente y él destinatario, o viceversa
    const mensajes = await Mensaje.find({
      $or: [
        { remitente: myId, destinatario: userToChatId },
        { remitente: userToChatId, destinatario: myId },
      ],
    }).sort({ createdAt: 1 }); // Ordenados del más viejo al más nuevo

    res.status(200).json(mensajes);
  } catch (error) {
    console.log("Error en el controlador obtenerMensajes:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 2. ENVIAR UN MENSAJE NUEVO ---
export const enviarMensaje = async (req, res) => {
  try {
    const { id: destinatarioId } = req.params;
    const { contenido, inmuebleId } = req.body; 
    const remitenteId = req.user._id;

    // Guardamos el mensaje en MongoDB
    const nuevoMensaje = new Mensaje({
      remitente: remitenteId,
      destinatario: destinatarioId,
      contenido,
      ...(inmuebleId && { inmueble: inmuebleId }),
    });

    await nuevoMensaje.save();

    // Buscamos si el destinatario está conectado ahorita mismo en la app
    const receiverSocketId = getReceiverSocketId(destinatarioId);
    
    if (receiverSocketId) {
      // Si sí está conectado, le disparamos el mensaje en tiempo real a su pantalla
      io.to(receiverSocketId).emit("nuevoMensaje", nuevoMensaje);
    }

    // Le respondemos al que envió el mensaje que todo salió bien
    res.status(201).json(nuevoMensaje);

  } catch (error) {
    console.log("Error en el controlador enviarMensaje:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 3. OBTENER CONTACTOS (Para la barra lateral del chat) ---
export const obtenerContactos = async (req, res) => {
  try {
    const myId = req.user._id;

    // 1. Obtener todos los IDs de los usuarios a los que les he enviado mensajes
    const destinatarios = await Mensaje.distinct("destinatario", { remitente: myId });
    
    // 2. Obtener todos los IDs de los usuarios que me han enviado mensajes
    const remitentes = await Mensaje.distinct("remitente", { destinatario: myId });

    // 3. Unir ambos arrays y eliminar duplicados usando un Set
    // Convertimos a string para evitar problemas de comparación con ObjectId
    const userIdsUnicos = [...new Set([...destinatarios, ...remitentes].map(id => id.toString()))];

    // 4. Buscar en la colección de Usuarios solo a aquellos cuyos IDs estén en nuestra lista
    const contactos = await User.find({ _id: { $in: userIdsUnicos } }).select("-password");
    
    res.status(200).json(contactos);
  } catch (error) {
    console.log("Error en el controlador obtenerContactos:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};