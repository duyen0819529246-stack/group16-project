// src/api/axiosConfig.js
import axios from "axios";

// ✅ Tạo instance axios để gọi API backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // ⚙️ Đổi URL này cho khớp backend của bạn
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Nếu có token trong localStorage thì tự động thêm vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
