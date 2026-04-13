import express from "express";
import { crearInmueble, obtenerInmuebles, obtenerInmueblePorId,eliminarInmueble,actualizarInmueble,obtenerCatalogos } from "../controllers/Inmueble.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/catalogos/todos", obtenerCatalogos);

// Ruta pública: Cualquiera puede ver el catálogo de inmuebles
router.get("/", obtenerInmuebles);
router.get("/:id", obtenerInmueblePorId);

// Ruta privada: Solo usuarios logueados (anfitriones) pueden publicar
router.post("/", protectRoute,crearInmueble);
router.put("/:id", protectRoute, actualizarInmueble);
router.delete("/:id", protectRoute, eliminarInmueble);

export default router;