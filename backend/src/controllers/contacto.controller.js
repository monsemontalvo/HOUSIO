import nodemailer from "nodemailer";

export const enviarCorreoSoporte = async (req, res) => {
  const { correoUsuario, asunto, mensaje } = req.body;

  try {
    // 1. Configuramos el "transporte" (quién y cómo envía el correo)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 2. Definimos el contenido del correo
    const mailOptions = {
      from: process.env.EMAIL_USER, // Siempre sale de soporte.housio
      to: process.env.EMAIL_USER, // Te lo envías a ti mismo (tu bandeja de soporte)
      replyTo: correoUsuario, // Si le das "Responder" en Gmail, le llegará al usuario
      subject: `Nuevo mensaje de soporte: ${asunto}`,
      html: `
        <h3>Tienes un nuevo mensaje desde la página de Help de Housio</h3>
        <p><strong>Usuario:</strong> ${correoUsuario}</p>
        <p><strong>Asunto:</strong> ${asunto}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    };

    // 3. Enviamos el correo
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.log("Error enviando correo de soporte:", error.message);
    res.status(500).json({ message: "Hubo un error al enviar el mensaje" });
  }
};