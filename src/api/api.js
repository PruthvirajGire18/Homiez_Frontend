import axios from "axios"

const api = axios.create({
  baseURL: "https://homiez-backend.vercel.app/api",
  withCredentials: true, // 🔥 MUST for cookies
})

export default api