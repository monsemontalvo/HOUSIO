import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema({
  // ¿A quién le llega la notificación? (Dueño o Estudiante)
  receptor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // ¿Quién provocó la notificación?
  emisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  // qué tipo de aviso es
  tipo: { 
    type: String, 
    enum: ["mensaje", "visita", "resena", "sistema"], 
    required: true 
  },
  
  // El ID del documento original (El ID de la visita, del mensaje o de la casa)
  referenciaId: { type: mongoose.Schema.Types.ObjectId },
  
  // El texto corto que saldrá en la campanita
  texto: { type: String, required: true },
  
  // Para encender o apagar el puntito rojo
  leida: { type: Boolean, default: false }

}, { timestamps: true });

const Notificacion = mongoose.model("Notificacion", notificacionSchema);
export default Notificacion;