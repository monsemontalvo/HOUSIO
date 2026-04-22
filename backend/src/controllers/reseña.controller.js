import Resena from "../models/Reseña.model.js";
import Inmueble from "../models/Inmueble.model.js";
import { enviarNotificacion } from "../lib/notificacion.utils.js";

// --- CREAR UNA RESEÑA ---
export const crearResena = async (req, res) => {
  try {
    const { inmuebleId, texto, calificacion } = req.body;
    const autorId = req.user._id;

    if (!inmuebleId || !texto || !calificacion) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const nuevaResena = new Resena({
      autor: autorId,
      inmueble: inmuebleId,
      texto,
      calificacion
    });

    await nuevaResena.save();
    const resenaPoblada = await nuevaResena.populate("autor", "fullName profilePic");

    // --- NOTIFICACIÓN AL DUEÑO ---
    const inmuebleInfo = await Inmueble.findById(inmuebleId).select("dueno nombre");
    if (inmuebleInfo && inmuebleInfo.dueno.toString() !== autorId.toString()) {
      await enviarNotificacion({
        receptor: inmuebleInfo.dueno,
        emisor: autorId,
        tipo: "resena",
        referenciaId: nuevaResena._id,
        texto: `Han dejado una reseña de ${calificacion} estrellas en "${inmuebleInfo.nombre}"`
      });
    }

    res.status(201).json(resenaPoblada);
  } catch (error) {
    console.log("Error en crearResena:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- OBTENER RESEÑAS DE UN INMUEBLE ---
export const obtenerResenasPorInmueble = async (req, res) => {
  try {
    const { id: inmuebleId } = req.params;

    const resenas = await Resena.find({ inmueble: inmuebleId })
      .populate("autor", "fullName profilePic") // Para mostrar la foto y nombre del que comenta
      .sort({ createdAt: -1 });

    res.status(200).json(resenas);
  } catch (error) {
    console.log("Error en obtenerResenasPorInmueble:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- ACTUALIZAR UNA RESEÑA ---
export const actualizarResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, calificacion } = req.body;
    const autorId = req.user._id;

    const resena = await Resena.findById(id);

    if (!resena) return res.status(404).json({ message: "Reseña no encontrada" });

    // Validar que el autor sea el mismo que intenta editar
    if (resena.autor.toString() !== autorId.toString()) {
      return res.status(403).json({ message: "No autorizado para editar esta reseña" });
    }

    resena.texto = texto || resena.texto;
    resena.calificacion = calificacion || resena.calificacion;

    await resena.save();
    
    // Devolvemos la reseña poblada para actualizar el estado del frontend
    const resenaActualizada = await Resena.findById(id).populate("autor", "fullName profilePic");

    res.status(200).json(resenaActualizada);
  } catch (error) {
    console.log("Error en actualizarResena:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};