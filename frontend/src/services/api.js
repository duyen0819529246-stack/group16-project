import axios from "axios";
import { jwtDecode } from "jwt-decode";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

// Biến để theo dõi đang refresh hay không (tránh nhiều request refresh cùng lúc)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR - Gắn token vào mỗi request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Xử lý FormData - xóa Content-Type để axios tự thiết lập boundary
  if (config.data && typeof window !== "undefined" && config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
  }

  return config;
});

// RESPONSE INTERCEPTOR - Tự động refresh token khi hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đưa vào queue chờ
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        // Không có refresh token, redirect về login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh để lấy access token mới
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data;
        
        // Lưu access token mới vào localStorage
        localStorage.setItem("accessToken", accessToken);
        
        // Cập nhật header Authorization cho request ban đầu
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Xử lý các request đang đợi trong queue
        processQueue(null, accessToken);
        
        isRefreshing = false;
        
        // Retry request ban đầu với token mới
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token cũng hết hạn hoặc không hợp lệ -> logout
        processQueue(refreshError, null);
        isRefreshing = false;
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        
        return Promise.reject(refreshError);
      }
    }

    console.error("API error:", error?.response?.status, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;