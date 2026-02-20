import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  // 1. Recibimos los datos del formulario, INCLUYENDO EL ROL
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

    // 2. Crear el usuario con el ROL seleccionado (o 'student' por defecto)
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

      // 3. Responder con los datos del usuario (incluyendo role)
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

    // Verificar contraseña
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
      role: user.role, // Importante devolver el rol aquí también
    });
  } catch (error) {
    console.log("Error en login controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}; 3

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
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "La imagen de perfil es requerida" });
    }

    const uploadResult = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResult.secure_url }, { new: true });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error en updateProfile controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const checkAuth =  (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error en checkAuth controller", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};