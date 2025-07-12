import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.BACKEND_BASE_URL || "http://localhost:5173",
  withCredentials: true,
});