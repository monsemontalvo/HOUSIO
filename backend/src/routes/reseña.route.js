import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { crearResena, obtenerResenasPorInmueble, actualizarResena } from "../controllers/reseña.controller.js";

const router = express.Router();

router.get("/:id", obtenerResenasPorInmueble); // Pública: todos pueden leer
router.post("/", protectRoute, crearResena);   // Privada: solo usuarios logueados comentan
router.put("/:id", protectRoute, actualizarResena)

export default router;

