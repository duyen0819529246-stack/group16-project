import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  // không đặt global Content-Type ở đây
});

// thêm interceptor để chỉ set JSON header khi body không phải FormData
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // nếu data tồn tại và là FormData -> xoá header Content-Type để axios tự thiết lập boundary
  if (config.data && typeof window !== "undefined" && config.data instanceof FormData) {
    // đảm bảo không có Content-Type cứng
    delete config.headers["Content-Type"];
  } else {
    // với request JSON thông thường, đặt rõ
    config.headers["Content-Type"] = config.headers["Content-Type"] || "application/json";
  }

  return config;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);

export default api;