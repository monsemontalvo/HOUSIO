//DEFINICION DE URL
//Conecta las URL a las que hace petición el front con las funciones controladoras 
import express from 'express';
import { checkAuth, signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

//middleware protectRoute en medio
//si un intruso intenta actualizar un perfil o verificar la sesión
// express primero ejecuta protectRoute y si no hay token válido, le bloquea el paso antes de llegar al controlador
router.get("/check",protectRoute, checkAuth);

export default router;
