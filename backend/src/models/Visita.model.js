import mongoose from "mongoose";

const visitaSchema = new mongoose.Schema({
  inquilino: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  inmueble: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Inmueble", 
    required: true 
  },
  fecha: { 
    type: String, // Guardamos la fecha en formato YYYY-MM-DD
    required: true 
  },
  hora: { 
    type: String, // Ej: "10:00 AM" o "04:30 PM"
    required: true 
  },
  estado: { 
    type: String, 
    enum: ["Pendiente", "Confirmada", "Cancelada"], 
    default: "Pendiente" 
  }
}, { timestamps: true });

const Visita = mongoose.model("Visita", visitaSchema);
export default Visita;