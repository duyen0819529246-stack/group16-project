import React from "react";
import { useAuth } from "../contexts/AuthContext";

// Định nghĩa permissions cho từng role
const rolePermissions = {
  admin: {
    name: "Admin",
    color: "#f44336",
    description: "Admin: Bạn có toàn quyền quản lý hệ thống, bao gồm quản lý users, roles và tất cả các tính năng.",
    permissions: {
      "Có thể xem hồ sơ của mình": true,
      "Có thể chỉnh sửa hồ sơ của mình": true,
      "Có thể xóa tài khoản của mình": true,
      "Có thể xem tất cả người dùng": true,
      "Có thể chỉnh sửa người dùng khác": true,
      "Có thể xóa người dùng khác": true,
      "Có thể quản lý vai trò": true,
      "Có thể truy cập bảng điều khiển quản trị": true,
      "Có thể quản lý tất cả nội dung": true,
    },
  },
  moderator: {
    name: "Moderator",
    color: "#1976d2",
    description: "Moderator: Bạn có quyền xem và chỉnh sửa thông tin của users khác, nhưng không thể xóa hoặc thay đổi role.",
    permissions: {
      "Có thể xem hồ sơ của mình": true,
      "Có thể chỉnh sửa hồ sơ của mình": true,
      "Có thể xóa tài khoản của mình": true,
      "Có thể xem tất cả người dùng": true,
      "Có thể chỉnh sửa người dùng khác": true,
      "Có thể xóa người dùng khác": false,
      "Có thể quản lý vai trò": false,
      "Có thể truy cập bảng điều khiển quản trị": false,
      "Có thể quản lý tất cả nội dung": false,
    },
  },
  user: {
    name: "Người dùng",
    color: "#666",
    description: "Người dùng: Bạn chỉ có quyền quản lý thông tin cá nhân của chính mình.",
    permissions: {
      "Có thể xem hồ sơ của mình": true,
      "Có thể chỉnh sửa hồ sơ của mình": true,
      "Có thể xóa tài khoản của mình": true,
      "Có thể xem tất cả người dùng": false,
      "Có thể chỉnh sửa người dùng khác": false,
      "Có thể xóa người dùng khác": false,
      "Có thể quản lý vai trò": false,
      "Có thể truy cập bảng điều khiển quản trị": false,
      "Có thể quản lý tất cả nội dung": false,
    },
  },
};

export default function Permissions() {
  const { user } = useAuth();

  if (!user) {
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
          Vui lòng đăng nhập để xem quyền hạn của bạn.
        </div>
      </div>
    );
  }

  const currentRole = user.role || "user";
  const roleInfo = rolePermissions[currentRole] || rolePermissions.user;

  return (
    <div className="container" style={{ maxWidth: 800, marginTop: 20 }}>
      <h2 style={{ marginBottom: 24 }}>Quyền Hạn Của Bạn</h2>

      {/* Current Role Display */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12, fontSize: "16px", fontWeight: "500", color: "var(--muted)" }}>
          Vai trò hiện tại:
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "8px 20px",
            borderRadius: "20px",
            background: roleInfo.color,
            color: "#fff",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {roleInfo.name}
        </div>
      </div>

      {/* Permission Details */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Chi tiết quyền:</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {Object.entries(roleInfo.permissions).map(([permission, hasPermission]) => (
            <div
              key={permission}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: hasPermission ? "#f0f9ff" : "#fff",
                borderRadius: "8px",
                border: hasPermission ? "1px solid #b3e5fc" : "1px solid #eef2f6",
              }}
            >
              <span style={{ fontSize: "15px", fontWeight: "500" }}>{permission}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {hasPermission ? (
                  <>
                    <span style={{ color: "#4caf50", fontSize: "18px" }}>✓</span>
                    <span style={{ color: "#4caf50", fontWeight: "600", fontSize: "14px" }}>Có</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#f44336", fontSize: "18px" }}>✗</span>
                    <span style={{ color: "#f44336", fontWeight: "600", fontSize: "14px" }}>Không</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role Description */}
      <div
        style={{
          padding: "16px 20px",
          background: "#e3f2fd",
          borderRadius: "8px",
          borderLeft: "4px solid" + roleInfo.color,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: roleInfo.color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            flexShrink: 0,
            fontSize: "14px",
          }}
        >
          i
        </div>
        <div style={{ color: "#1976d2", fontSize: "14px", lineHeight: "1.6" }}>
          {roleInfo.description}
        </div>
      </div>
    </div>
  );
}

