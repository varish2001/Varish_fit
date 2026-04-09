import axios from "axios";

const fromEnv = import.meta.env.VITE_API_BASE_URL;
const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
const API_BASE = fromEnv || `http://${host}:5000/api`;

export const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fit_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
