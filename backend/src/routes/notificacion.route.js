import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { obtenerNotificaciones, marcarComoLeida } from "../controllers/notificacion.controller.js";

const router = express.Router();

router.get("/", protectRoute, obtenerNotificaciones);
router.put("/:id/leer", protectRoute, marcarComoLeida);

export default router;