import axios from "axios";

// 🔴 DEMO TOKEN (same token you use in Desktop app)
const DEMO_TOKEN = "98191dceeb7e43e6812ee7689cc017e0d1a43855";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api/",
});

// ================= TOKEN INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    // Priority:
    // 1️⃣ Logged-in user token
    // 2️⃣ Demo token (guest mode)
    const token =
      localStorage.getItem("auth_token") || DEMO_TOKEN;

    config.headers.Authorization = `Token ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
