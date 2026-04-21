import Notificacion from "../models/Notificacion.model.js";

export const obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user._id;
    const notificaciones = await Notificacion.find({ receptor: userId })
      .populate("emisor", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(notificaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

export const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    await Notificacion.findByIdAndUpdate(id, { leida: true });
    res.status(200).json({ message: "Notificación leída" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
};