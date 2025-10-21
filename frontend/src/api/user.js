import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// 🧾 Lấy thông tin cá nhân (GET /profile)
export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✏️ Cập nhật thông tin cá nhân (PUT /profile)
export const updateProfile = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
