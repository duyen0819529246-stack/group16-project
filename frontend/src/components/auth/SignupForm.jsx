import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.show("Mật khẩu không khớp", "error");
    try {
      await signup(name, email, password);
      toast.show("Đăng ký thành công", "success");
      navigate("/");
    } catch (err) {
      toast.show(err?.response?.data?.message || err.message || "Lỗi đăng ký", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit} className="form">
          <input placeholder="Tên" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="Nhập lại mật khẩu" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button type="submit" className="btn-primary">Đăng ký</button>
        </form>
      </div>
    </div>
  );
}