import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AvatarUpload from "./AvatarUpload";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/profile");
      setUser(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Không thể tải thông tin profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload success
  const handleAvatarUploadSuccess = (newAvatarUrl) => {
    setUser((prevUser) => ({
      ...prevUser,
      avatar: newAvatarUrl,
    }));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Trang Cá Nhân</h1>
      </div>

      {user && (
        <>
          {/* User Info Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Thông Tin Cá Nhân</h2>
            
            <div style={styles.infoRow}>
              <span style={styles.label}>Tên:</span>
              <span style={styles.value}>{user.name}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{user.email}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>Vai trò:</span>
              <span style={{
                ...styles.value,
                ...styles.roleBadge,
                backgroundColor: getRoleColor(user.role),
              }}>
                {getRoleLabel(user.role)}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>ID:</span>
              <span style={styles.valueSmall}>{user.id}</span>
            </div>
          </div>

          {/* Avatar Upload Component */}
          <AvatarUpload
            currentAvatar={user.avatar}
            onUploadSuccess={handleAvatarUploadSuccess}
          />
        </>
      )}
    </div>
  );
}

// Helper functions
const getRoleLabel = (role) => {
  const labels = {
    admin: "Quản trị viên",
    moderator: "Điều hành viên",
    user: "Người dùng",
  };
  return labels[role] || role;
};

const getRoleColor = (role) => {
  const colors = {
    admin: "#f44336",
    moderator: "#ff9800",
    user: "#4CAF50",
  };
  return colors[role] || "#757575";
};

// Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#333",
    margin: "0",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #4CAF50",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  label: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: "16px",
    color: "#333",
  },
  valueSmall: {
    fontSize: "12px",
    color: "#999",
    fontFamily: "monospace",
  },
  roleBadge: {
    padding: "6px 16px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#666",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "16px",
  },
};