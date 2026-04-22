import Inmueble from "../models/Inmueble.model.js";
import cloudinary from "../lib/cloudinary.js";
import Servicio from "../models/Servicio.model.js";
import Amenidad from "../models/Amenidad.model.js";
import Regla from "../models/Regla.model.js";
import Visita from "../models/Visita.model.js";
import Resena from "../models/Reseña.model.js"; 
import Mensaje from "../models/Mensaje.model.js";
import { enviarNotificacion } from "../lib/notificacion.utils.js";

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
    // Usamos .lean() para que Mongoose nos devuelva objetos JS simples y podamos agregarles campos
    const inmuebles = await Inmueble.find()
      .populate("dueno", "fullName profilePic email createdAt esSuperAnfitrion calificacionPromedio")
      .populate("servicios")
      .populate("amenidades")
      .populate("reglas")
      .lean();

    // Traemos las visitas que ya estén confirmadas para hacer el conteo real
    const visitasConfirmadas = await Visita.find({ estado: "Confirmada" });

    // Creamos un mapa de conteo: { "id_inmueble": cantidad }
    const conteoVisitas = {};
    visitasConfirmadas.forEach(v => {
      const id = v.inmueble.toString();
      conteoVisitas[id] = (conteoVisitas[id] || 0) + 1;
    });

    // Mapeamos los inmuebles para inyectar el valor de "esMasAgendado"
    const inmueblesProcesados = inmuebles.map(inm => ({
      ...inm,
      // Validación: Si tiene 2 o más visitas confirmadas, sale la insignia
      esMasAgendado: (conteoVisitas[inm._id.toString()] || 0) >= 2 
    }));

    res.status(200).json(inmueblesProcesados);
  } catch (error) {
    console.log("Error en obtenerInmuebles:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- 3. OBTENER DETALLES DE UN SOLO INMUEBLE ---
export const obtenerInmueblePorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("--> Alguien entró a ver el inmueble:", id); // AGREGA ESTO

    // findById solo busca. Para aumentar los clicks necesitamos findByIdAndUpdate.
    const inmueble = await Inmueble.findByIdAndUpdate(
      id,
      { $inc: { clicks: 1 } }, // Esto le suma 1 al campo 'clicks' automáticamente
      { new: true } // Esto le dice a Mongoose que nos devuelva el objeto ya actualizado
    )
      .populate("dueno", "fullName profilePic email createdAt esSuperAnfitrion calificacionPromedio")
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

// --- 5. ELIMINAR INMUEBLE Y NOTIFICAR ESTUDIANTES ---
export const eliminarInmueble = async (req, res) => {
  try {
    const { id } = req.params;
    const inmueble = await Inmueble.findById(id);

    if (!inmueble) return res.status(404).json({ message: "Inmueble no encontrado" });

    if (inmueble.dueno.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esto" });
    }

    // 1. Buscar estudiantes con visitas "Pendientes" o "Confirmadas"
    const visitasActivas = await Visita.find({
      inmueble: id,
      estado: { $in: ["Pendiente", "Confirmada"] }
    });

    // 2. Enviar notificación a cada estudiante afectado
    // Usamos un for...of para poder usar await dentro del ciclo
    for (const visita of visitasActivas) {
      await enviarNotificacion({
        receptor: visita.inquilino,
        emisor: req.user._id, // El dueño
        tipo: "sistema", // Usamos "sistema" porque la casa ya no existirá para darle clic
        referenciaId: null, 
        texto: `La propiedad "${inmueble.nombre}" a la que tenías una visita agendada ya no está disponible o se rentó. Lo sentimos mucho. Por favor, revisa otras opciones disponibles.`,
      });
    }

    // 3. LIMPIEZA EN CASCADA (Borrar la basura de la Base de Datos)
    await Visita.deleteMany({ inmueble: id });
    await Resena.deleteMany({ inmueble: id });
    await Mensaje.deleteMany({ inmueble: id });

    // 5. Destrucción final del inmueble
    await Inmueble.findByIdAndDelete(id);

    res.status(200).json({ message: "Inmueble eliminado, estudiantes notificados y registros limpiados correctamente" });
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