//GENERADOR DE TOKENS JWT PARA AUTENTICACIÓN
//seguridad de las sesiones de usuario

import jwt from 'jsonwebtoken';

//generateToken es una función que crea un token JWT (JSON Web Token) para un usuario autenticado
export const generateToken = (userId,res) => {

    const token= jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
        httpOnly: true, //para que no pueda ser robada por scripts maliciosos XSS
        sameSite: "strict", //para prevenir ataques CSRF falsificando peticiones
        secure: process.env.NODE_ENV !== "development", //Solo enviar cookies en conexiones seguras en producción (https)
    });

    return token;
}

//1. usa jwt.sign para empaquetar el ID del usuario (userId) junto con la clave (process.env.JWT_SECRET) 
//2. crea un token que expira en 7 días.
//3. envía este token al navegador del usuario guardándolo en una cookie llamada "jwt".

//XSS (Cross-Site Scripting): es cuando un atacante logra inyectar código js malicioso en la página
//CSRF (Cross-Site Request Forgery): es cuando un atacante engaña al usuario para que haga clic en un link malicioso

//Token:
//lleva escondido el ID de  usuario
//está sellado criptográficamente usando JWT_SECRET
//se autodestruye después de 7 días 