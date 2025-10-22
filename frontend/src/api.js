import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users", // ✅ trỏ đúng /api/users
});

// interceptor để tự động gửi token nếu có
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ✅ Auth
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (err) {
    console.error("API error:", err.response || err);
    throw err;
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/signup", data);
    return res.data;
  } catch (err) {
    console.error("API error:", err.response || err);
    throw err;
  }
};

// ✅ Profile
export const getProfile = async () => {
  try {
    const res = await API.get("/profile");
    return res.data;
  } catch (err) {
    console.error("API error:", err.response || err);
    throw err;
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await API.put("/profile", data);
    return res.data;
  } catch (err) {
    console.error("API error:", err.response || err);
    throw err;
  }
};

// ✅ Avatar upload
export const uploadAvatar = async (formData) => {
  try {
    const res = await API.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("API error:", err.response || err);
    throw err;
  }
};
export default API;