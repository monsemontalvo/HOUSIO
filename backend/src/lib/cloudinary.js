//CONEXION CON CLOUDINARY PARA SUBIR IMAGENES

import {v2 as cloudinary} from 'cloudinary'; //Está como v2 porque es la versión más reciente de la API de Cloudinary
import {config} from 'dotenv';  //dotenv: librería que permite cargar variables de entorno desde un archivo .env
//Ya está en index.js pero se duplica por extra de seguridad para evitar errores
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

//se usa process.env para acceder a las variables de entorno que contienen las credenciales de Cloudinary.
//Esto es por seguridad, para no exponer las credenciales reales en el código fuente.

export default cloudinary;