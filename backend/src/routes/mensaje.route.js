import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { enviarMensaje, obtenerMensajes, obtenerContactos } from "../controllers/mensaje.controller.js";

const router = express.Router();

// Todas las rutas de chat son privadas
router.get("/contactos", protectRoute, obtenerContactos);
router.get("/:id", protectRoute, obtenerMensajes);
router.post("/send/:id", protectRoute, enviarMensaje);

export default router;