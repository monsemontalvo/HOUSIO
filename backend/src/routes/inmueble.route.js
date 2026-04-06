import express from "express";
import { crearInmueble, obtenerInmuebles, obtenerInmueblePorId } from "../controllers/Inmueble.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Ruta pública: Cualquiera puede ver el catálogo de inmuebles
router.get("/", obtenerInmuebles);
router.get("/:id", obtenerInmueblePorId);

// Ruta privada: Solo usuarios logueados (anfitriones) pueden publicar
router.post("/", protectRoute,crearInmueble);

export default router;