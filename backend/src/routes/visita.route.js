import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  agendarVisita, 
  obtenerVisitasInquilino, 
  obtenerVisitasAnfitrion, 
  actualizarEstadoVisita 
} from "../controllers/visita.controller.js";

const router = express.Router();

// Rutas protegidas para la gestión de citas
router.post("/", protectRoute, agendarVisita);
router.get("/inquilino", protectRoute, obtenerVisitasInquilino);
router.get("/anfitrion", protectRoute, obtenerVisitasAnfitrion);
router.put("/:id/estado", protectRoute, actualizarEstadoVisita);

export default router;