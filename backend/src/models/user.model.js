import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    // --- NUEVO CAMPO: ROL ---
    role: {
      type: String,
      enum: ["student", "landlord"], // Solo permite estos dos valores
      default: "student", // Por defecto es estudiante
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;