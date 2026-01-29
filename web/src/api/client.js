import axios from "axios";

const api = axios.create({
  // ✅ Use environment variable if available (Vercel / production)
  // ✅ Fallback to localhost for development
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/",
});

// ================= TOKEN INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
