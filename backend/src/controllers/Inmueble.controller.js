import Inmueble from "../models/Inmueble.model.js";
import cloudinary from "../lib/cloudinary.js";
import Servicio from "../models/Servicio.model.js";
import Amenidad from "../models/Amenidad.model.js";
import Regla from "../models/Regla.model.js";

// --- 1. CREAR UN NUEVO INMUEBLE ---
export const crearInmueble = async (req, res) => {
  try {
    const {
    nombre, metros2, direccion, costo, tipo, descripcion,
    imagenes, servicios, amenidades, reglas, imagenPrincipal, detallesTecnicos,
    latitud, longitud, zona, universidadCercana,
    horariosVisita
  } = req.body;

    const duenoId = req.user._id;

    if (!nombre || !direccion || !costo || !tipo) {
      return res.status(400).json({ message: "Faltan campos obligatorios básicos" });
    }

    const uploadMain = await cloudinary.uploader.upload(imagenPrincipal, { folder: "housio_inmuebles" });
    const urlImagenPrincipal = uploadMain.secure_url;

    let imagenesUrls = [];

    if (imagenes && imagenes.length > 0) {
      const uploadPromises = imagenes.map((imgBase64) =>
        cloudinary.uploader.upload(imgBase64, { folder: "housio_inmuebles" })
      );
      const uploadResults = await Promise.all(uploadPromises);
      imagenesUrls = uploadResults.map((result) => result.secure_url);
    }

    const nuevoInmueble = new Inmueble({
      nombre,
      dueno: duenoId,
      metros2,
      direccion,
      latitud,
      longitud,
      zona,
      universidadCercana,
      costo,
      tipo,
      detallesTecnicos,
      descripcion,
      horariosVisita,
      imagenPrincipal: urlImagenPrincipal,
      imagenes: imagenesUrls,
      servicios,
      amenidades,
      reglas
    });

    await nuevoInmueble.save();

    // Importante: Poblamos antes de responder para que el frontend reciba nombres, no IDs
    const inmueblePoblado = await Inmueble.findById(nuevoInmueble._id)
      .populate("servicios")
      .populate("amenidades")
      .populate("reglas");

    res.status(201).json(inmueblePoblado);

  } catch (error) {
    console.log("Error en crearInmueble:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 2. OBTENER TODOS LOS INMUEBLES ---
export const obtenerInmuebles = async (req, res) => {
  try {
    const inmuebles = await Inmueble.find()
      .populate("dueno", "fullName profilePic email createdAt")
      .populate("servicios")
      .populate("amenidades")
      .populate("reglas");

    res.status(200).json(inmuebles);
  } catch (error) {
    console.log("Error en obtenerInmuebles:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 3. OBTENER DETALLES DE UN SOLO INMUEBLE ---
export const obtenerInmueblePorId = async (req, res) => {
  try {
    const { id } = req.params;

    const inmueble = await Inmueble.findById(id)
      .populate("dueno", "fullName profilePic email createdAt")
      .populate("servicios")
      .populate("amenidades")
      .populate("reglas");

    if (!inmueble) {
      return res.status(404).json({ message: "Inmueble no encontrado" });
    }

    res.status(200).json(inmueble);
  } catch (error) {
    console.log("Error en obtenerInmueblePorId:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 4. ACTUALIZAR INMUEBLE ---
export const actualizarInmueble = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };
    const inmueble = await Inmueble.findById(id);

    if (!inmueble) return res.status(404).json({ message: "Inmueble no encontrado" });

    if (inmueble.dueno.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // 1. Procesar Imagen Principal si es nueva (Base64)
    if (updateData.imagenPrincipal && updateData.imagenPrincipal.startsWith("data:image")) {
      const uploadRes = await cloudinary.uploader.upload(updateData.imagenPrincipal, { folder: "housio_inmuebles" });
      updateData.imagenPrincipal = uploadRes.secure_url;
    }

    // 2. Procesar Galería de imágenes (NUEVO: Verifica si hay Base64 nuevos en el array)
    if (updateData.imagenes && updateData.imagenes.length > 0) {
      const uploadPromises = updateData.imagenes.map(async (img) => {
        if (img.startsWith("data:image")) {
          const res = await cloudinary.uploader.upload(img, { folder: "housio_inmuebles" });
          return res.secure_url;
        }
        return img;
      });
      updateData.imagenes = await Promise.all(uploadPromises);
    }

    const inmuebleActualizado = await Inmueble.findByIdAndUpdate(id, updateData, { new: true })
      .populate("servicios")
      .populate("amenidades")
      .populate("reglas");

    res.status(200).json(inmuebleActualizado);
  } catch (error) {
    console.log("Error en actualizarInmueble:", error.message);
    res.status(500).json({ message: "Error interno al actualizar la propiedad" });
  }
};

// --- 5. ELIMINAR INMUEBLE ---
export const eliminarInmueble = async (req, res) => {
  try {
    const { id } = req.params;
    const inmueble = await Inmueble.findById(id);

    if (!inmueble) return res.status(404).json({ message: "Inmueble no encontrado" });

    if (inmueble.dueno.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esto" });
    }

    await Inmueble.findByIdAndDelete(id);
    res.status(200).json({ message: "Inmueble eliminado correctamente" });
  } catch (error) {
    console.log("Error en eliminarInmueble:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 6. OBTENER CATÁLOGOS ---
export const obtenerCatalogos = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    const amenidades = await Amenidad.find();
    const reglas = await Regla.find();

    res.status(200).json({ servicios, amenidades, reglas });
  } catch (error) {
    console.log("Error en obtenerCatalogos:", error.message);
    res.status(500).json({ message: "Error al obtener catálogos" });
  }
};