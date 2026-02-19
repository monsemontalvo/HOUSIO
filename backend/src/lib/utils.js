import jwt from 'jsonwebtoken';

export const generateToken = (userId,res) => {

    const token= jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
        httpOnly: true, //Prevenir ataques XSS cross-site scripting 
        sameSite: "strict", //Prevenir ataques CSRF cross-site request forgery
        secure: process.env.NODE_ENV !== "development", //Solo enviar cookies en conexiones seguras en producción
    });

    return token;
}