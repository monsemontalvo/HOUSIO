import mongoose from "mongoose";

const inmuebleSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dueno: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  metros2: { type: Number },
  direccion: { type: String, required: true },
  latitud: { type: Number },
  longitud: { type: Number },
  zona: { type: String },
  universidadCercana: { type: String },
  costo: { type: Number, required: true },
  tipo: { type: String, enum: ["Casa", "Departamento", "Habitacion"], required: true },
  detallesTecnicos: [{ titulo: { type: String }, descripcion: { type: String } }],
  descripcion: { type: String },
  imagenPrincipal: {type: String },
  imagenes: [{ type: String, default: [] }],
  servicios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Servicio" }],
  amenidades: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenidad" }],
  reglas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Regla" }]
}, { timestamps: true });

const Inmueble = mongoose.model("Inmueble", inmuebleSchema);
export default Inmueble;