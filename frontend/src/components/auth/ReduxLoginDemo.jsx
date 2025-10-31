import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { demoStore } from "../../store/demoStore";
import { demoLogin, demoLogout } from "../../store/demoAuthSlice";

// Inner component để dùng hooks
function ReduxLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, authenticated } = useSelector((state) => state.demoAuth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(demoLogin({ email, password }));
    
    // Không cần redirect tự động, để user thấy success message
  };

  const handleLogout = () => {
    dispatch(demoLogout());
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "32px" }}>🔒</span>
          <h2 style={{ margin: 0 }}>Redux Login Demo</h2>
        </div>
        
        <p style={{ color: "var(--muted)", marginBottom: "24px", fontSize: "14px" }}>
          This is a demo component using Redux for state management
        </p>

        {!authenticated ? (
          <form onSubmit={handleSubmit} className="form">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập với Redux"}
            </button>
          </form>
        ) : null}

        {authenticated && (
          <div style={{ 
            marginTop: "16px", 
            padding: "20px", 
            background: "linear-gradient(135deg, #2ecc71, #27ae60)", 
            color: "#fff", 
            borderRadius: "12px",
            fontSize: "15px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(46, 204, 113, 0.3)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✓</div>
            <div style={{ fontWeight: "600", marginBottom: "8px" }}>
              Đăng nhập thành công!
            </div>
            <div style={{ fontSize: "13px", opacity: 0.95 }}>
              Redux state đã được update. Check Redux DevTools để xem!
            </div>
          </div>
        )}

        {authenticated && (
          <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/")}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              Test Protected Route
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              Logout & Test Again
            </button>
          </div>
        )}

        {error && !authenticated && (
          <div style={{ 
            marginTop: "12px", 
            padding: "10px", 
            background: "#fee", 
            color: "var(--danger)", 
            borderRadius: "8px",
            fontSize: "14px"
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "#f8f9fa", 
          borderRadius: "8px",
          fontSize: "13px",
          fontFamily: "monospace"
        }}>
          <div style={{ fontWeight: "600", marginBottom: "8px", color: "#333" }}>
            Redux State:
          </div>
          <div style={{ color: "var(--muted)" }}>
            Loading: <span style={{ color: loading ? "orange" : "#2ecc71" }}>{loading.toString()}</span>
          </div>
          <div style={{ color: "var(--muted)" }}>
            Error: <span style={{ color: error ? "var(--danger)" : "#2ecc71" }}>
              {error ? `"${error}"` : "null"}
            </span>
          </div>
          <div style={{ color: "var(--muted)" }}>
            Authenticated: <span style={{ color: authenticated ? "#2ecc71" : "#e74c3c" }}>
              {authenticated.toString()}
            </span>
          </div>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Link 
            to="/login" 
            style={{ 
              color: "var(--accent)", 
              textDecoration: "none",
              fontSize: "14px"
            }}
          >
            ← Quay lại Login thông thường
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrapper với Provider
export default function ReduxLoginDemo() {
  return (
    <Provider store={demoStore}>
      <ReduxLoginForm />
    </Provider>
  );
}
