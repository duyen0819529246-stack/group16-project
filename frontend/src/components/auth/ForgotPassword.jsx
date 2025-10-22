import React, { useState } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/forgot-password", { email });
      toast.show("Nếu email tồn tại, link đặt lại sẽ được gửi.", "success");
      navigate("/login");
    } catch (err) {
      toast.show(err?.response?.data?.message || "Lỗi gửi email", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit} className="form">
          <input type="email" placeholder="Nhập email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit" className="btn-primary">Gửi link đặt lại</button>
        </form>
      </div>
    </div>
  );
}