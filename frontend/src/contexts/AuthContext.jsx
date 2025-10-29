// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return null;
    try {
      const decoded = jwtDecode(accessToken);
      // Kiểm tra xem token có hết hạn chưa
      if (decoded.exp * 1000 < Date.now()) {
        return null;
      }
      return { id: decoded.id, role: decoded.role };
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (accessToken, refreshToken) => {
    // Lưu cả 2 token vào localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    
    try {
      const decoded = jwtDecode(accessToken);
      setUser({ id: decoded.id, role: decoded.role });
    } catch {
      setUser(null);
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    
    try {
      // Gọi API logout để revoke refresh token
      await api.post("/auth/logout", { refreshToken });
    } catch (err) {
      console.error("Logout error:", err);
    }
    
    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    window.location.href = "/login";
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { accessToken, refreshToken } = res.data;
    if (accessToken && refreshToken) {
      await login(accessToken, refreshToken);
    }
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
