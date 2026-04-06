import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  remitente: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inmueble: { type: mongoose.Schema.Types.ObjectId, ref: "Inmueble", required: true },
  contenido: { type: String, required: true },
  leido: { type: Boolean, default: false }
}, { timestamps: true });

const Mensaje = mongoose.model("Mensaje", mensajeSchema);
export default Mensaje;