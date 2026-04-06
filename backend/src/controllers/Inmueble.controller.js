import Inmueble from "../models/Inmueble.model.js";
import cloudinary from "../lib/cloudinary.js";

// --- CREAR UN NUEVO INMUEBLE ---
export const crearInmueble = async (req, res) => {
  try {
    // 1. Extraemos todos los datos que manda el frontend en el formulario
    const { 
      nombre, metros2, direccion, costo, tipo, descripcion, 
      imagenes, // Este será un arreglo de imágenes en formato base64
      servicios, amenidades, reglas 
    } = req.body;

    // 2. Obtenemos el ID del dueño desde el token (inyectado por protectRoute)
    const duenoId = req.user._id;

    // 3. Validaciones de campos obligatorios
    if (!nombre || !direccion || !costo || !tipo) {
      return res.status(400).json({ message: "Faltan campos obligatorios básicos" });
    }

    let imagenesUrls = [];

    // 4. Subir imágenes a Cloudinary (si el usuario adjuntó alguna)
    if (imagenes && imagenes.length > 0) {
      // Usamos Promise.all para subir todas las fotos al mismo tiempo y no hacer esperar al usuario
      const uploadPromises = imagenes.map((imgBase64) => 
        cloudinary.uploader.upload(imgBase64, { folder: "housio_inmuebles" })
      );
      
      const uploadResults = await Promise.all(uploadPromises);
      
      // Extraemos solo las URLs seguras que nos devuelve Cloudinary
      imagenesUrls = uploadResults.map((result) => result.secure_url);
    }

    // 5. Construimos el nuevo documento para la base de datos
    const nuevoInmueble = new Inmueble({
      nombre,
      dueno: duenoId,
      metros2,
      direccion: direccion, 
      costo,
      tipo,
      descripcion,
      imagenes: imagenesUrls,
      servicios,
      amenidades,
      reglas
    });

    // 6. Guardamos en MongoDB
    await nuevoInmueble.save();

    res.status(201).json(nuevoInmueble);

  } catch (error) {
    console.log("Error en el controlador crearInmueble:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// --- OBTENER TODOS LOS INMUEBLES (Para el feed del Inquilino) ---
export const obtenerInmuebles = async (req, res) => {
  try {
    // Usamos .populate("dueno") para que en lugar de solo darnos el ID del dueño,
    // nos traiga su nombre y foto de perfil para mostrarlos en la tarjeta del feed.
    const inmuebles = await Inmueble.find()
      .populate("dueno", "fullName profilePic")
      .sort({ createdAt: -1 }); // Los ordenamos para mostrar los más recientes primero

    res.status(200).json(inmuebles);
  } catch (error) {
    console.log("Error en el controlador obtenerInmuebles:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


// --- OBTENER LOS DETALLES DE UN SOLO INMUEBLE ---
export const obtenerInmueblePorId = async (req, res) => {
  try {
    // Sacamos el ID de la URL (ej: /api/inmuebles/123456789)
    const { id } = req.params;

    // Buscamos el inmueble y poblamos toda su información relacionada
    const inmueble = await Inmueble.findById(id)
      .populate("dueno", "fullName profilePic email") // Datos de contacto del arrendador
      .populate("servicios", "nombre")
      .populate("amenidades", "nombre")
      .populate("reglas", "nombre");

    if (!inmueble) {
      return res.status(404).json({ message: "Inmueble no encontrado" });
    }

    res.status(200).json(inmueble);
  } catch (error) {
    console.log("Error en el controlador obtenerInmueblePorId:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};