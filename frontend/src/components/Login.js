// src/components/Login.js
import React, { useState } from "react";
import api from "../api/axiosConfig";
import { jwtDecode } from "jwt-decode"; // ✅ cập nhật import đúng chuẩn mới

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const saved = localStorage.getItem("token") || "";

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });

      // ✅ chấp nhận cả 2 kiểu trả về: { token } hoặc { accessToken }
      const token = res.data?.token || res.data?.accessToken;
      if (!token) throw new Error("Server không trả token.");

      // ✅ Lưu token vào localStorage
      localStorage.setItem("token", token);

      // ✅ Giải mã token (tùy chọn)
      let user = null;
      try {
        user = jwtDecode(token);
      } catch (err) {
        console.error("Lỗi giải mã token:", err);
      }

      if (onLogin) onLogin({ token, user });
      setMessage({ type: "success", text: "Đăng nhập thành công!" });
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Đăng nhập thất bại!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Đăng nhập</h3>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>

      {message && (
        <p className={message.type === "success" ? "success" : "error"}>
          {message.text}
        </p>
      )}

      {/* Hiển thị token hiện tại */}
      {saved && (
        <div style={{ marginTop: 12 }}>
          <h4>JWT Token hiện có (localStorage)</h4>
          <textarea readOnly value={saved} rows={4} cols={50} />
        </div>
      )}
    </div>
  );
}
