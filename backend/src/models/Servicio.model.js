import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

const Servicio = mongoose.model("Servicio", servicioSchema);
export default Servicio;