import mongoose from "mongoose";

const amenidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

const Amenidad = mongoose.model("Amenidad", amenidadSchema);
export default Amenidad;