import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        fullName: { type: String, required: true },
        profilePicture: { type: String, default: "" },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema); // Nombre del modelo y esquema. El nombre va en singular y Mongoose lo pluraliza automáticamente para crear la colección en MongoDB.

export default User;