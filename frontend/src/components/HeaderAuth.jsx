import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function HeaderAuth() {
  const { user, logout } = useAuth();
  return (
    <header className="app-header">
      <div className="brand"><Link to="/" className="brand-link">MyApp</Link></div>
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        
        {/* Admin Menu */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin" className="nav-link">Quản lý Users</Link>
            <Link to="/admin/roles" className="nav-link">Phân quyền</Link>
          </>
        )}
        
        {/* Moderator Menu */}
        {user?.role === "moderator" && (
          <Link to="/admin" className="nav-link">Moderator</Link>
        )}
        
        {/* Permissions for all logged-in users */}
        {user && <Link to="/permissions" className="nav-link">Quyền hạn</Link>}
        
        {user ? (
          <>
            <span className="nav-user" style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: 
                user.role === "admin" ? "#ef4444" : 
                user.role === "moderator" ? "#3b82f6" : 
                "#10b981",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold"
            }}>
              {user.role.toUpperCase()}
            </span>
            <button className="btn-ghost" onClick={logout}>Đăng xuất</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Đăng nhập</Link>
            <Link to="/signup" className="nav-link">Đăng ký</Link>
          </>
        )}
      </nav>
    </header>
  );
}