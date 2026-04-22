import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Esto hace la magia para que el backend reconozca al usuario
});