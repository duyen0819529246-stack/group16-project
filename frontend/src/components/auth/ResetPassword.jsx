import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.show("Mật khẩu không khớp", "error");
    try {
      await api.post(`/reset-password/${token}`, { newPassword: password });
      toast.show("Đổi mật khẩu thành công", "success");
      navigate("/login");
    } catch (err) {
      toast.show(err?.response?.data?.message || "Lỗi đổi mật khẩu", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit} className="form">
          <input type="password" placeholder="Mật khẩu mới" value={password} onChange={e=>setPassword(e.target.value)} required />
          <input type="password" placeholder="Nhập lại mật khẩu" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
          <button type="submit" className="btn-primary">Đặt lại mật khẩu</button>
        </form>
      </div>
    </div>
  );
}