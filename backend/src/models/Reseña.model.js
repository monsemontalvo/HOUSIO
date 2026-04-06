import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
  autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  inmueble: { type: mongoose.Schema.Types.ObjectId, ref: "Inmueble", required: true },
  texto: { type: String, required: true },
  calificacion: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

const Resena = mongoose.model("Resena", resenaSchema);
export default Resena;