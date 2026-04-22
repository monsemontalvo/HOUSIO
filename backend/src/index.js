//lo primero que se ejecuta al iniciar el servidor.
// aqui se configura el servidor Express, se conectan las rutas y se establece la conexión con la bd.
import notificacionRoutes from "./routes/notificacion.route.js";
import express from 'express';
import authRoutes from './routes/auth.route.js'; //importar rutas de autenticación
import dotenv from 'dotenv'; //dotenv: librería que permite cargar variables de entorno desde un archivo .env
import { connectDB } from './lib/db.js'; //conectar bd 
import cookieParser from 'cookie-parser'; //cookie-parser: middleware que permite manejar cookies en las solicitudes HTTP.
import inmuebleRoutes from "./routes/inmueble.route.js";
import contactoRoutes from "./routes/contacto.route.js";
import visitaRoutes from "./routes/visita.route.js";
import mensajeRoutes from "./routes/mensaje.route.js";
import resenaRoutes from "./routes/reseña.route.js";
import { app, server } from "./lib/socket.js";
import cors from "cors"; 

import path from "path";

dotenv.config(); //dotenv.config() carga las variables de entorno definidas en el archivo .env para que estén disponibles en process.env
//const app = express(); //app es la instancia del servidor Express que se va a configurar y ejecutar.

//PORT se obtiene de las variables de entorno para que el servidor pueda usar el puerto asignado por el entorno de producción 
const PORT = process.env.PORT;
const __dirname = path.resolve();

// Configuración de CORS
app.use(cors({
  origin: "http://localhost:5173", // La URL de tu frontend
  credentials: true // SÚPER IMPORTANTE: Permite que pasen las cookies con el JWT
}));

//Permite que el servidor entienda información enviada en formato JSON 
// El límite se aumentó a "10mb" específicamente para poder recibir imágenes de perfil pesadas en formato base64
// Aumente el límite a 80mb para que soporte todas las fotos y los detalles nuevos
app.use(express.json({ limit: "80mb" })); 
app.use(express.urlencoded({ limit: "80mb", extended: true })); //lo mismo pero para datos enviados en url

//cookieParser se usa para manejar cookies, que son esenciales para la autenticación basada en tokens (como JWT) que se almacenan en cookies.
app.use(cookieParser());
app.use("/api/auth", authRoutes); //las peticiones que empiecen con /api/auth sean manejadas por el archivo authRoutes
app.use("/api/inmuebles", inmuebleRoutes);
app.use("/api/visitas", visitaRoutes);
app.use("/api/mensajes", mensajeRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/contacto", contactoRoutes);
app.use("/api/notificaciones", notificacionRoutes);
//app.listen enciende el servidor-> llama a la función connectDB -> busca la bd de MongoDB Atlas y se conecta
/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
}); */

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});