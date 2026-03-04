//CONEXION A LA BASE DE DATOS CON MONGOOSE

import mongoose from 'mongoose'; 
//Mongoose es la libreria que sirve como puente para que Node.js y MongoDB se puedan comunicar fácilmente.

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI); //mongoose.connect() es el comando que establece la conexión con la bd. 
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};

//connectDB es una función asíncrona (async) porque conectarse a una bd en la nube toma tiempo de respuesta por internet.

//process.env.MONGODB_URI: No hay URL de la bd directamente en el código por seguridad. 
//En su lugar, se usa una variable de entorno (.env). 
// Esa variable contiene las credenciales reales.

//Todo esto está envuelto en un try-catch. 
// Si la conexión es exitosa, imprime en consola MongoDB Connected. 
// Si falla, el catch atrapa el error y lo imprime sin que el servidor colapse.