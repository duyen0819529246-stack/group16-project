import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const toast = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]); // eslint-disable-line

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      toast.show(err?.response?.data?.message || "Không thể lấy danh sách users", "error");
    } finally {
      setLoading(false);
    }
  };

  // Tính toán stats
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    users: users.filter((u) => u.role === "user").length,
  };

  // Filter users theo role
  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role === roleFilter);

  // Thay đổi role của user
  const handleRoleChange = async (userId, newRole) => {
    if (!isAdmin) {
      toast.show("Bạn không có quyền thay đổi role", "error");
      return;
    }

    try {
      await api.put(`/users/${userId}`, { role: newRole });
      
      // Cập nhật state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
      
      toast.show("Cập nhật role thành công", "success");
    } catch (err) {
      toast.show(
        err?.response?.data?.message || "Không thể cập nhật role",
        "error"
      );
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <div
          style={{
            padding: "20px",
            background: "#fee",
            color: "var(--danger)",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: "600",
            marginTop: "20px",
          }}
        >
          Bạn không có quyền truy cập trang này.
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 1200, marginTop: 20 }}>
      <h2 style={{ marginBottom: 24 }}>Quản Lý Phân Quyền</h2>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px" }}>
            Tổng Users
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>
            {stats.total}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px" }}>
            Admin
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>
            {stats.admins}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px" }}>
            Moderator
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>
            {stats.moderators}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px" }}>
            User
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>
            {stats.users}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "8px" }}>
            Khác
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700" }}>
            {stats.total - stats.admins - stats.moderators - stats.users}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          borderBottom: "2px solid #eef2f6",
        }}
      >
        {[
          { value: "all", label: "Tất cả" },
          { value: "admin", label: "Admin" },
          { value: "moderator", label: "Moderator" },
          { value: "user", label: "User" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleFilter(tab.value)}
            style={{
              padding: "12px 20px",
              background: "none",
              border: "none",
              borderBottom: roleFilter === tab.value ? "3px solid var(--accent)" : "3px solid transparent",
              color: roleFilter === tab.value ? "var(--accent)" : "var(--muted)",
              fontWeight: roleFilter === tab.value ? "600" : "400",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="card">
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center" }}>Đang tải...</div>
        ) : (
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>TÊN</th>
                  <th style={{ width: "35%" }}>EMAIL</th>
                  <th style={{ width: "15%" }}>ROLE HIỆN TẠI</th>
                  <th style={{ width: "20%" }}>THAY ĐỔI ROLE</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                      Không có users nào
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="avatar-badge">
                            {(u.name || u.email || "U").slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-name">{u.name || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background:
                              u.role === "admin"
                                ? "#fee"
                                : u.role === "moderator"
                                ? "#e3f2fd"
                                : "#f0f0f0",
                            color:
                              u.role === "admin"
                                ? "var(--danger)"
                                : u.role === "moderator"
                                ? "#1976d2"
                                : "var(--muted)",
                          }}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td>
                        <select
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "4px",
                            border: "1px solid #eef2f6",
                            fontSize: "14px",
                            minWidth: "120px",
                            cursor: "pointer",
                          }}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

