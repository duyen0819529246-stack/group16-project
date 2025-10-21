import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/user";

const ProfilePage = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  // 📥 Lấy thông tin khi load trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        setUser({ ...data, password: "" });
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin:", err);
      }
    };
    fetchData();
  }, []);

  // 🧾 Khi nhập form
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 💾 Khi nhấn Lưu thay đổi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user);
      setMessage("✅ Cập nhật thông tin thành công!");
    } catch (err) {
      setMessage("❌ Cập nhật thất bại!");
    }
  };

  return (
    <div className="profile-container">
      <h2>👤 Thông tin cá nhân</h2>
      <form onSubmit={handleSubmit}>
        <label>Họ tên:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />

        <label>Mật khẩu mới:</label>
        <input
          type="password"
          name="password"
          placeholder="(Để trống nếu không đổi)"
          onChange={handleChange}
        />

        <button type="submit">💾 Lưu thay đổi</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProfilePage;
