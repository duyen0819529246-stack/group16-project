import React, { useEffect, useState } from "react";
import { loginUser, getProfile, registerUser, updateProfile, uploadAvatar } from "../../api";
import api from "../services/api";

import { useAuth } from "../../contexts/AuthContext";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const { userId } = useAuth(); // lấy id từ context nếu có

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin user", err);
      }
    };
    if (userId) fetchProfile();
  }, [userId]);

  return (
    <div>
      <h1>Home</h1>
      {user ? <p>Xin chào, {user.name}</p> : <p>Đang tải...</p>}
    </div>
  );
}
