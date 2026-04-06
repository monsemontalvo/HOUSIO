import mongoose from "mongoose";
import dotenv from "dotenv";
import Servicio from "./src/models/Servicio.model.js";
import Amenidad from "./src/models/Amenidad.model.js";
import Regla from "./src/models/Regla.model.js";

dotenv.config();

const cargarDatos = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a la BD para seeding...");

    // Limpiamos los catálogos anteriores por si las dudas
    await Servicio.deleteMany();
    await Amenidad.deleteMany();
    await Regla.deleteMany();

    // Insertamos los nuevos datos
    await Servicio.insertMany([
      { nombre: "Agua" }, { nombre: "Luz" }, { nombre: "Gas" }, { nombre: "Internet de Alta Velocidad" }
    ]);
    
    await Amenidad.insertMany([
      { nombre: "Estacionamiento Techado" }, { nombre: "Amueblado" }, { nombre: "Aire Acondicionado" }, { nombre: "Áreas Comunes" }
    ]);

    await Regla.insertMany([
      { nombre: "No Fiestas" }, { nombre: "Pet Friendly" }, { nombre: "No Fumar" }, { nombre: "Visitas hasta las 10 PM" }
    ]);

    console.log("¡Datos cargados exitosamente!");
    process.exit();
  } catch (error) {
    console.log("Error:", error);
    process.exit(1);
  }
};

cargarDatos();