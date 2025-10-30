import { useState, useEffect } from "react";
import api from "../../services/api";
import { useToast } from "../../contexts/ToastContext";
import RoleBasedComponent from "../shared/RoleBasedComponent";

const RoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("all");
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedRole === "all") {
        res = await api.get("/users");
      } else {
        res = await api.get(`/users/role/${selectedRole}`);
      }
      setUsers(res.data.data || res.data);
    } catch (err) {
      toast.show(err.response?.data?.message || "Lỗi tải danh sách user", "error");
    }
    setLoading(false);
  };

  const fetchStatistics = async () => {
    try {
      const res = await api.get("/users/statistics/roles");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      toast.show(`Cập nhật role thành công!`, "success");
      fetchUsers();
      fetchStatistics();
    } catch (err) {
      toast.show(err.response?.data?.message || "Lỗi cập nhật role", "error");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "user":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RoleBasedComponent allowedRoles={["admin"]}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>
          Quản Lý Phân Quyền
        </h1>

        {/* Statistics */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Tổng Users</h3>
              <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stats.total}</p>
            </div>
            {stats.statistics?.map((stat) => (
              <div key={stat._id} style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '8px', textTransform: 'capitalize' }}>{stat._id}</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>{stat.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedRole("all")}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              background: selectedRole === "all" ? "#3b82f6" : "#e5e7eb",
              color: selectedRole === "all" ? "white" : "#374151"
            }}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedRole("admin")}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              background: selectedRole === "admin" ? "#ef4444" : "#e5e7eb",
              color: selectedRole === "admin" ? "white" : "#374151"
            }}
          >
            Admin
          </button>
          <button
            onClick={() => setSelectedRole("moderator")}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              background: selectedRole === "moderator" ? "#3b82f6" : "#e5e7eb",
              color: selectedRole === "moderator" ? "white" : "#374151"
            }}
          >
            Moderator
          </button>
          <button
            onClick={() => setSelectedRole("user")}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
              background: selectedRole === "user" ? "#10b981" : "#e5e7eb",
              color: selectedRole === "user" ? "white" : "#374151"
            }}
          >
            User
          </button>
        </div>

        {/* User List */}
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải...</p>
        ) : (
          <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Tên
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Email
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Role hiện tại
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Thay đổi Role
                  </th>
                </tr>
              </thead>
              <tbody style={{ background: '#fff' }}>
                {users.map((user, index) => (
                  <tr key={user._id} style={{ borderBottom: index !== users.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: '500', color: '#111827' }}>{user.name}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        borderRadius: '12px',
                        display: 'inline-block',
                        background: user.role === 'admin' ? '#fee2e2' : user.role === 'moderator' ? '#dbeafe' : '#d1fae5',
                        color: user.role === 'admin' ? '#991b1b' : user.role === 'moderator' ? '#1e40af' : '#065f46'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          background: '#fff'
                        }}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleBasedComponent>
  );
};

export default RoleManagement;

