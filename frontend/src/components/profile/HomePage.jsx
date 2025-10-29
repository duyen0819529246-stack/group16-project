import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/profile");
      setProfile(res.data);
      setName(res.data.name || "");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        logout();
        navigate("/login");
      } else toast.show("Không thể lấy profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []); // eslint-disable-line

  const handleSave = async () => {
    if (password && password !== confirm) return toast.show("Mật khẩu không khớp", "error");
    try {
      await api.put("/profile", { name, password: password || undefined });
      setPassword("");
      setConfirm("");
      fetchProfile();
      toast.show("Cập nhật thành công", "success");
    } catch (err) {
      toast.show(err?.response?.data?.message || "Lỗi cập nhật", "error");
    }
  };

  const handleUpload = async () => {
    if (!avatarFile) return toast.show("Chọn file trước", "error");
    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);
      await api.post("/users/profile/avatar", fd);
      toast.show("Upload avatar thành công", "success");
      fetchProfile();
    } catch (err) {
      toast.show(err?.response?.data?.message || "Lỗi upload", "error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Bạn có muốn xóa tài khoản này? Hành động không thể hoàn tác.")) return;
    try {
      // owner can call deleteUser endpoint with own id
      await api.delete(`/users/${user.id}`);
      toast.show("Tài khoản đã bị xóa", "success");
      logout();
    } catch (err) {
      toast.show(err?.response?.data?.message || "Xóa thất bại", "error");
    }
  };

  if (loading) return <div className="container card">Đang tải thông tin...</div>;
  if (!profile) return <div className="container card">Không có thông tin người dùng.</div>;

  return (
    <div className="container" style={{ maxWidth: 900, marginTop: 20 }}>
      <div className="card profile-card">
        <h2>Thông tin cá nhân</h2>
        <div className="profile-row">
          <div style={{ width: 220 }}>
            <div className="avatar-wrap">
              <img src={profile.avatar || "/placeholder-avatar.png"} alt="avatar" className="profile-avatar" />
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <label className="btn-secondary file-label">
                Chọn ảnh
                <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files?.[0])} hidden />
              </label>
              <button className="btn-primary" onClick={handleUpload}>Upload</button>
            </div>
            <div style={{ marginTop: 10, color: "var(--muted)" }}>Kích thước tối ưu: 300x300 px</div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="field">
              <label>Họ và tên</label>
              <input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="field">
              <label>Email</label>
              <input value={profile.email} disabled />
            </div>

            <div className="field">
              <label>Mật khẩu mới (tùy chọn)</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Nhập mật khẩu mới" />
            </div>

            <div className="field">
              <label>Xác nhận mật khẩu mới</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Nhập lại mật khẩu" />
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
              <button className="btn-primary" onClick={handleSave}>Lưu thay đổi</button>
              <button className="btn-danger" onClick={handleDeleteAccount}>Xóa tài khoản</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
