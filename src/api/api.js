import axios from "axios"

const api = axios.create({
  baseURL: "https://homiez18.netlify.app/api",
  withCredentials: true, // 🔥 MUST for cookies
})

export default api