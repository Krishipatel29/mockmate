import axios from "axios";

// Backend se baat karne ke liye ek hi axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Har request ke saath login token apne aap jud jata hai
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token expire ho gaya (401) to logout karke login page par bhejo
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCall = error.config?.url?.startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("mm_token");
      localStorage.removeItem("mm_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Error se user ko dikhane laayak message nikaalo
export function errorMessage(error) {
  if (!error.response) return "Cannot reach the server. Is the backend running?";
  return error.response.data?.message || "Something went wrong. Please try again.";
}

export default api;
