import axios from "axios"

const api = axios.create({
  baseURL: "https://homiez-backend.vercel.app/api",
  withCredentials: true, // 🔥 MUST for cookies
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api