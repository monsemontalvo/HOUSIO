import express from "express";
import { enviarCorreoSoporte } from "../controllers/contacto.controller.js";

const router = express.Router();

router.post("/enviar", enviarCorreoSoporte);

export default router;