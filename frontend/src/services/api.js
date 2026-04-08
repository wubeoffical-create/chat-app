import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5678/api",
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMessages = () => API.get("/messages");
export const sendMessage = (data) => API.post("/messages", data);

// Auth APIs
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
