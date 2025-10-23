// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      const decoded = jwtDecode(t);
      return { id: decoded.id, role: decoded.role, token: t };
    } catch {
      return null;
    }
  });

  const login = async (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, role: decoded.role, token });
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/signup", { name, email, password });
    const token = res.data.token;
    if (token) await login(token);
    return res.data;
  };

  return <AuthContext.Provider value={{ user, login, logout, signup }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
