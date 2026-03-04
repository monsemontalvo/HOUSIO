//lo primero que se ejecuta al iniciar el servidor.
// aqui se configura el servidor Express, se conectan las rutas y se establece la conexión con la bd.

import express from 'express';
import authRoutes from './routes/auth.route.js'; //importar rutas de autenticación
import dotenv from 'dotenv'; //dotenv: librería que permite cargar variables de entorno desde un archivo .env
import { connectDB } from './lib/db.js'; //conectar bd 
import cookieParser from 'cookie-parser'; //cookie-parser: middleware que permite manejar cookies en las solicitudes HTTP.

dotenv.config(); //dotenv.config() carga las variables de entorno definidas en el archivo .env para que estén disponibles en process.env
const app = express(); //app es la instancia del servidor Express que se va a configurar y ejecutar.

//PORT se obtiene de las variables de entorno para que el servidor pueda usar el puerto asignado por el entorno de producción 
const PORT = process.env.PORT;

//Permite que el servidor entienda información enviada en formato JSON 
// El límite se aumentó a "10mb" específicamente para poder recibir imágenes de perfil pesadas en formato base64
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true })); //lo mismo pero para datos enviados en url

//cookieParser se usa para manejar cookies, que son esenciales para la autenticación basada en tokens (como JWT) que se almacenan en cookies.
app.use(cookieParser());
app.use("/api/auth", authRoutes); //las peticiones que empiecen con /api/auth sean manejadas por el archivo authRoutes


//app.listen enciende el servidor-> llama a la función connectDB -> busca la bd de MongoDB Atlas y se conecta
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});