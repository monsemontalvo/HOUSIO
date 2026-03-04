# HOUSIO
A web application designed to help students relocating to a new city find the perfect home. This project is developed for the Web Programming II course at FCFM, UANL.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Para iniciar-> cd backend-> npm run dev 
            -> cd frontend-> npm run dev 
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

NOTAS.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Tutorial: https://www.youtube.com/watch?v=ntKkVrQqBYY&list=LL&index=17&t=15345s
Hostear en Vercel: https://www.youtube.com/watch?v=6CCikS4eXuM&t=148s 

Frontend:
-React
-Tailwind
-Zustand
-Daisyui

Instalado-> npm create vite@latest . (React, JavaScript)-> npm i react-router-dom react-hot-toast -> npm install tailwindcss @tailwindcss/vite (Seguir la info de la pagina tailwind: https://tailwindcss.com/docs/installation/using-vite) -> *ELIMINAR APP.CSS* -> npm i -D daisyui@latest (https://daisyui.com/docs/install/) -> npm i axios zustand -> npm i lucide-react -> npm i socket.io-client

axios: Es el mensajero. Mientras Express recibe las peticiones en el backend, axios es la herramienta que envía esas peticiones desde el frontend hacia las rutas.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Backend:
-NodeJS
-Express
-MongoDB
-Express
-SocketIO

Instalado-> npm init -y -> npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io -> npm i nodemon -D (DevDependencie)

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
bcrypJS: hash password
Autenticación: JWT

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

INFO DE CARPETAS:
Controllers-> Funciones que contienen la lógica matemática. Reciben la petición, procesarla (encriptar contraseñas, validar datos) y devolver una respuesta.
Lib-> Guarda configuraciones y herramientas que se usan en varias partes del proyecto. (conexion a la bd, conexion a la nube de imagenes y tokens)
Middleware-> Funciones que se ponen en medio de una petición para revisarla antes de que llegue al controlador
Models->Es para guardar la info de la BD
Routes-> URLs del servidor

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*El Frontend no tiene acceso directo a la base de datos. Para obtener información, le pide permiso al Backend a través de una API (usando axios). El Backend procesa la petición y le responde solo con los datos (en formato JSON).*
