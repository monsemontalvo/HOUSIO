import Visita from "../models/Visita.model.js";
import Inmueble from "../models/Inmueble.model.js";
import { enviarNotificacion } from "../lib/notificacion.utils.js";

// --- 1. AGENDAR UNA VISITA (Inquilino) ---
export const agendarVisita = async (req, res) => {
  try {
    const { inmuebleId, fecha, hora } = req.body;
    const inquilinoId = req.user._id; // Sacamos al usuario logueado del token

    if (!inmuebleId || !fecha || !hora) {
      return res.status(400).json({ message: "Faltan datos para agendar la visita" });
    }

    // Buscamos la casa para asegurarnos de que exista
    const inmueble = await Inmueble.findById(inmuebleId);
    if (!inmueble) {
      return res.status(404).json({ message: "Inmueble no encontrado" });
    }

    // Regla de negocio: Un dueño no puede agendar visita a su propia casa
    if (inmueble.dueno.toString() === inquilinoId.toString()) {
      return res.status(400).json({ message: "No puedes agendar una visita a tu propia propiedad" });
    }

    // Creamos la visita con estado "Pendiente" por defecto
    const nuevaVisita = new Visita({
      inquilino: inquilinoId,
      inmueble: inmuebleId,
      fecha,
      hora
    });

    await nuevaVisita.save();

    // --- NOTIFICACIÓN AL DUEÑO ---
    await enviarNotificacion({
      receptor: inmueble.dueno,
      emisor: inquilinoId,
      tipo: "visita",
      referenciaId: nuevaVisita._id,
      texto: `Nueva solicitud de visita para "${inmueble.nombre}" el ${fecha} a las ${hora}`
    });

    res.status(201).json(nuevaVisita);

  } catch (error) {
    console.log("Error en el controlador agendarVisita:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 2. VER MIS VISITAS AGENDADAS (Inquilino) ---
export const obtenerVisitasInquilino = async (req, res) => {
  try {
    const inquilinoId = req.user._id;

    // Buscamos las visitas y traemos los datos de la casa para la tarjeta visual
    const visitas = await Visita.find({ inquilino: inquilinoId })
      .populate("inmueble", "nombre direccion costo imagenes") 
      .sort({ fecha: 1 }); // Ordenamos de la más próxima a la más lejana

    res.status(200).json(visitas);
  } catch (error) {
    console.log("Error en obtenerVisitasInquilino:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 3. VER SOLICITUDES DE VISITA (Anfitrión) ---
export const obtenerVisitasAnfitrion = async (req, res) => {
  try {
    const anfitrionId = req.user._id;

    // Primero encontramos qué casas le pertenecen a este dueño
    const misInmuebles = await Inmueble.find({ dueno: anfitrionId }).select("_id");
    const misInmueblesIds = misInmuebles.map(inmueble => inmueble._id);

    // Luego buscamos las visitas que se hayan hecho a CUALQUIERA de esas casas
    const visitas = await Visita.find({ inmueble: { $in: misInmueblesIds } })
      .populate("inquilino", "fullName profilePic email") // Queremos saber quién viene
      .populate("inmueble", "nombre direccion") // Y a qué casa va
      .sort({ fecha: 1 });

    res.status(200).json(visitas);
  } catch (error) {
    console.log("Error en obtenerVisitasAnfitrion:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 4. ACTUALIZAR EL ESTADO (Anfitrión aprueba o rechaza) ---
export const actualizarEstadoVisita = async (req, res) => {
  try {
    const { id } = req.params; // ID de la visita en la URL
    const { estado } = req.body; // Deberá ser "Confirmada" o "Cancelada"

    // Validamos que envíen un estado válido
    if (!["Confirmada", "Cancelada"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const visitaActualizada = await Visita.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    ).populate("inmueble", "nombre");

    if (!visitaActualizada) {
      return res.status(404).json({ message: "Visita no encontrada" });
    }

    // --- NOTIFICACIÓN AL ESTUDIANTE ---
    await enviarNotificacion({
      receptor: visitaActualizada.inquilino,
      emisor: req.user._id, // El dueño actual
      tipo: "visita",
      referenciaId: visitaActualizada._id,
      texto: `Tu visita a "${visitaActualizada.inmueble.nombre}" ha sido ${estado.toLowerCase()}`
    });

    res.status(200).json(visitaActualizada);
  } catch (error) {
    console.log("Error en actualizarEstadoVisita:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};