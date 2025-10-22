import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      const token = res?.data?.token;
      if (!token) throw new Error("Server không trả token");
      await login(token);
      toast.show("Đăng nhập thành công", "success");
      const decoded = jwtDecode(token);
      if (decoded?.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Sai email hoặc mật khẩu.";
      toast.show(msg, "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="form">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="btn-primary">Đăng nhập</button>
        </form>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
          <div className="muted">Demo: admin@gmail.com / 123456</div>
          <a href="/forgot-password" style={{color:"var(--accent)",textDecoration:"none"}}>Quên mật khẩu?</a>
        </div>
      </div>
    </div>
  );
}
