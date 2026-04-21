//LOGICA DE AUTENTICACION 

import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  // Recibe los datos del formulario, INCLUYENDO EL ROL
  const { fullName, email, password, role } = req.body;

  try {
    // Validaciones básicas
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar si el usuario ya existe
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "El correo electrónico ya está registrado" });

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Crear el usuario con el ROL seleccionado (o 'student' por defecto)
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    if (newUser) {
      // Generar token JWT y guardarlo en cookie
      generateToken(newUser._id, res);
      await newUser.save();

      // Responder con los datos del usuario (incluyendo rol)
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    console.log("Error en signup controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // bcrypt.compare para ver si la contraseña escrita coincide con la encriptada.
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar token
    generateToken(user._id, res);

    // Responder con datos del usuario
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      role: user.role, 
    });
  } catch (error) {
    console.log("Error en login controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}; 3


//sobrescribe la cookie jwt por un valor vacío y le pone un tiempo de vida de 0
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); // Borrar cookie
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.log("Error en logout controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Ahora recibimos todo lo que el usuario quiera cambiar
    const { profilePic, fullName, email } = req.body;
    const userId = req.user._id;

    // Objeto vacío donde guardaremos solo lo que realmente cambió
    let dataToUpdate = {};

    if (fullName) dataToUpdate.fullName = fullName;

    // Si intenta cambiar el correo, verificamos que no esté usado por alguien más
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Este correo ya está en uso por otra cuenta" });
      }
      dataToUpdate.email = email;
    }

    // Si mandó una foto nueva, la subimos a Cloudinary
    if (profilePic) {
      const uploadResult = await cloudinary.uploader.upload(profilePic, { folder: "housio_avatars" });
      dataToUpdate.profilePic = uploadResult.secure_url;
    }

    // Si el objeto está vacío, significa que no cambió nada
    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: "No se enviaron datos para actualizar" });
    }

    // Actualizamos al usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error en updateProfile controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//revisar autenticación del usuario, si el token es válido, devuelve los datos del usuario
export const checkAuth =  (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error en checkAuth controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};