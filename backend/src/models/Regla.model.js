import mongoose from "mongoose";

const reglaSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

const Regla = mongoose.model("Regla", reglaSchema);
export default Regla;