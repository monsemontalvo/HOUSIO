//Es para proteger las rutas que requieren autenticación. 

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


//protectRoute: protege rutas privadas
export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if (!token) { // Verifica el token JWT en las cookies 
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){ // Si trae la cookie, la desencripta usando jwt.verify para obtener el ID del usuario.
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        //Busca a ese usuario en la base de datos por su ID (User.findById)
        //por seguridad, se quita la contraseña de los resultados usando .select("-password")
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = user; // Si todo es correcto, adjunta el usuario a la solicitud (req.user) y permite que la solicitud continúe. 

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(401).json({ message: "Internal server error" });
    }
};