import React, { useState } from "react";
import api from "../../services/api";

export default function AvatarUpload({ currentAvatar, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Xử lý khi chọn file
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    // Reset messages
    setError("");
    setSuccess("");
    
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file ảnh!");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File quá lớn! Tối đa 5MB.");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Xử lý upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Vui lòng chọn file!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      const response = await api.post("/users/profile/avatar", formData);

      setSuccess("Upload avatar thành công!");
      setSelectedFile(null);
      setPreviewUrl(null);

      // Notify parent component
      if (onUploadSuccess && response.data.avatar) {
        onUploadSuccess(response.data.avatar);
      }

      // Reset file input
      const fileInput = document.getElementById("avatar-input");
      if (fileInput) fileInput.value = "";

    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || 
        "Lỗi upload avatar. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cancel selection
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    setSuccess("");
    
    const fileInput = document.getElementById("avatar-input");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Ảnh Đại Diện</h3>

      {/* Current Avatar */}
      <div style={styles.avatarContainer}>
        <img
          src={previewUrl || currentAvatar || "https://via.placeholder.com/150?text=No+Avatar"}
          alt="Avatar"
          style={styles.avatar}
        />
      </div>

      {/* File Input */}
      <div style={styles.inputGroup}>
        <label htmlFor="avatar-input" style={styles.label}>
          Chọn ảnh mới:
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={loading}
          style={styles.fileInput}
        />
      </div>

      {/* File Info */}
      {selectedFile && (
        <div style={styles.fileInfo}>
          <p style={styles.fileName}>📁 {selectedFile.name}</p>
          <p style={styles.fileSize}>
            📊 {(selectedFile.size / 1024).toFixed(2)} KB
          </p>
        </div>
      )}

      {/* Messages */}
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          style={{
            ...styles.button,
            ...styles.uploadButton,
            ...((!selectedFile || loading) && styles.buttonDisabled),
          }}
        >
          {loading ? "Đang upload..." : "Upload Avatar"}
        </button>

        {selectedFile && !loading && (
          <button
            onClick={handleCancel}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            Hủy
          </button>
        )}
      </div>

      {/* Info */}
      <div style={styles.info}>
        <p>ℹ️ Ảnh sẽ được tự động resize về 400x400px</p>
        <p>📏 Kích thước tối đa: 5MB</p>
        <p>🖼️ Định dạng: JPG, PNG, JPEG</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "25px",
  },
  avatar: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #4CAF50",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#555",
  },
  fileInput: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "2px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
  },
  fileInfo: {
    backgroundColor: "#f5f5f5",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
  fileName: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    color: "#333",
  },
  fileSize: {
    margin: "0",
    fontSize: "12px",
    color: "#666",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
    border: "1px solid #ef5350",
  },
  success: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "14px",
    border: "1px solid #66bb6a",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    flex: 1,
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "#f44336",
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  info: {
    backgroundColor: "#e3f2fd",
    padding: "15px",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#1565c0",
  },
};

