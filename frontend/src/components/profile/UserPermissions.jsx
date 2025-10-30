import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const UserPermissions = () => {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("/users/permissions");
      setPermissions(res.data);
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
    setLoading(false);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white";
      case "moderator":
        return "bg-blue-500 text-white";
      case "user":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  if (!permissions) {
    return <div className="text-center py-4">Không thể tải thông tin quyền</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Quyền Hạn Của Bạn</h2>
      
      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#6b7280', marginBottom: '8px' }}>Role hiện tại:</p>
        <span style={{
          padding: '8px 16px',
          borderRadius: '20px',
          fontWeight: '600',
          textTransform: 'capitalize',
          display: 'inline-block',
          background: permissions.role === 'admin' ? '#ef4444' : permissions.role === 'moderator' ? '#3b82f6' : '#10b981',
          color: '#fff'
        }}>
          {permissions.role}
        </span>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px' }}>Chi tiết quyền:</h3>
        {Object.entries(permissions.permissions).map(([key, value]) => (
          <div
            key={key}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              background: '#f9fafb',
              borderRadius: '6px',
              marginBottom: '8px'
            }}
          >
            <span style={{ color: '#374151' }}>
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
            <span style={{
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '600',
              background: value ? '#d1fae5' : '#fee2e2',
              color: value ? '#065f46' : '#991b1b'
            }}>
              {value ? "✓ Có" : "✗ Không"}
            </span>
          </div>
        ))}
      </div>

      {permissions.role === "user" && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            💡 <strong>Ghi chú:</strong> Bạn có quyền quản lý profile cá nhân. Để có
            thêm quyền hạn, vui lòng liên hệ Admin.
          </p>
        </div>
      )}

      {permissions.role === "moderator" && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
            💡 <strong>Moderator:</strong> Bạn có quyền xem và chỉnh sửa thông tin
            của users khác, nhưng không thể xóa hoặc thay đổi role.
          </p>
        </div>
      )}

      {permissions.role === "admin" && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '8px' }}>
          <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>
            🔐 <strong>Admin:</strong> Bạn có toàn quyền quản lý hệ thống, bao gồm
            quản lý users và phân quyền.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPermissions;

