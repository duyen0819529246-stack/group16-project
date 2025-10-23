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
        {user?.role === "admin" && <Link to="/admin" className="nav-link">Admin</Link>}
        {user ? (
          <>
            <span className="nav-user">{user.role}</span>
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