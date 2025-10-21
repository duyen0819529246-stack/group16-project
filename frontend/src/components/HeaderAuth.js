// src/components/HeaderAuth.js
import React from "react";
import { jwtDecode } from "jwt-decode"; // ✅ import mới

export default function HeaderAuth({ onLogout }) {
  const token = localStorage.getItem("token");

  const user = token
    ? (() => {
        try {
          return jwtDecode(token);
        } catch (e) {
          console.error("Lỗi giải mã token:", e);
          return null;
        }
      })()
    : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    alert("Đã đăng xuất");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f3f4f6",
        padding: "8px 16px",
        borderRadius: "8px",
      }}
    >
      {user ? (
        <div>
          👤 <strong>{user.email || user.sub || "Người dùng"}</strong>
        </div>
      ) : (
        <div>Chưa đăng nhập</div>
      )}
      {user && (
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e53935",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Đăng xuất
        </button>
      )}
    </div>
  );
}
