import React, { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/signup", {
        email,
        password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đăng ký!");
    }
  };

  return (
    <div style={{ border: "2px solid #ccc", padding: 20, borderRadius: 10, width: 400, margin: "20px auto" }}>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Nhập email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          required
        />
        <br /><br />
        <button type="submit" style={{ padding: "8px 20px" }}>Đăng ký</button>
      </form>
      {message && (
        <p style={{ color: message.includes("thành công") ? "green" : "red" }}>{message}</p>
      )}
    </div>
  );
}
