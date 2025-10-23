import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const toast = useToast();

  useEffect(() => { fetchUsers(); }, []); // eslint-disable-line

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      toast.show(err?.response?.data?.message || "Không thể lấy danh sách user", "error");
    }
  };

  const filtered = users.filter(u =>
    `${u.name} ${u.email}`.toLowerCase().includes(q.trim().toLowerCase())
  );

  const openCreate = () => { setEditUser(null); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setShowModal(true); };

  const handleDelete = async (id) => {
    if (!isAdmin && user?.id !== id) return toast.show("Bạn không có quyền.", "error");
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(x => x._id !== id));
      toast.show("Xóa thành công", "success");
    } catch (err) {
      toast.show(err?.response?.data?.message || "Xóa thất bại", "error");
    }
  };

  const handleSaveUser = async (payload) => {
    try {
      if (editUser) {
        await api.put(`/users/${editUser._id}`, payload);
        toast.show("Cập nhật user thành công", "success");
      } else {
        await api.post("/users", payload);
        toast.show("Tạo user thành công", "success");
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.show(err?.response?.data?.message || "Lỗi lưu user", "error");
    }
  };

  // simple modal + form inline
  const UserModal = ({ visible, onClose, onSave, initial }) => {
    const [name,setName] = useState(initial?.name||"");
    const [email,setEmail] = useState(initial?.email||"");
    const [role,setRole] = useState(initial?.role||"user");
    const [password,setPassword] = useState("");
    useEffect(()=>{ setName(initial?.name||""); setEmail(initial?.email||""); setRole(initial?.role||"user"); setPassword(""); }, [initial]);
    if(!visible) return null;
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>{initial ? "Sửa user" : "Thêm user"}</h3>
          <div className="field"><label>Tên</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="field"><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div className="field"><label>Vai trò</label>
            <select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="field"><label>Mật khẩu {initial ? "(để trống nếu không đổi)" : "(bắt buộc)"}</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button className="btn-primary" onClick={()=>onSave({ name, email, role, password: password || undefined })}>Lưu</button>
            <button className="btn-ghost" onClick={onClose}>Hủy</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ maxWidth: 1000, marginTop: 20 }}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2>Trang quản trị</h2>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <input className="search" placeholder="Tìm theo tên hoặc email" value={q} onChange={e=>setQ(e.target.value)} />
          {isAdmin && <button className="btn-primary" onClick={openCreate}>+ Thêm user</button>}
        </div>
      </div>

      <div className="card">
        <h3>Danh sách người dùng</h3>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th style={{width:160}}>ID</th>
                <th style={{width:260}}>Tên</th>
                <th>Email</th>
                <th style={{width:140}}>Vai trò</th>
                {isAdmin && <th style={{width:140}}>Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isAdmin?5:4}>Không tìm thấy</td></tr>
              ) : filtered.map((u,i)=>(
                <tr key={u._id}>
                  <td className="mono">{u._id}</td>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div className="avatar-badge">{(u.name||u.email||"U").slice(0,1).toUpperCase()}</div>
                      <div>
                        <div className="user-name">{u.name}</div>
                        <div className="muted small">{u.role}</div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  {isAdmin && <td>
                    <button className="btn-ghost" onClick={()=>openEdit(u)}>Sửa</button>
                    <button className="btn-danger" onClick={()=>handleDelete(u._id)} style={{marginLeft:8}}>Xóa</button>
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal visible={showModal} onClose={()=>setShowModal(false)} onSave={handleSaveUser} initial={editUser} />
    </div>
  );
}
