import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { demoStore } from "../../store/demoStore";
import { fetchUsers, setFilter, setSearch } from "../../store/demoUsersSlice";

// Inner component
function ReduxUserListForm() {
  const dispatch = useDispatch();
  const { loading, users, userCount, stats, filter, search, error } = useSelector(
    (state) => state.demoUsers
  );
  const { authenticated, user } = useSelector((state) => state.demoAuth);

  // Debug: log state
  useEffect(() => {
    console.log("ReduxUserListForm - authenticated:", authenticated);
    console.log("ReduxUserListForm - user:", user);
    console.log("ReduxUserListForm - full state:", { authenticated, user });
  }, [authenticated, user]);

  useEffect(() => {
    if (authenticated && user?.role === "admin") {
      console.log("Dispatching fetchUsers...");
      dispatch(fetchUsers());
    }
  }, [dispatch, authenticated, user]);

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchFilter = filter === "all" || u.role === filter;

    return matchSearch && matchFilter;
  });

  if (!authenticated || !user || user.role !== "admin") {
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
          <div style={{ marginBottom: "16px" }}>Bạn không có quyền truy cập.</div>
          <div
            style={{
              fontSize: "12px",
              padding: "12px",
              background: "#fff",
              borderRadius: "4px",
              marginTop: "12px",
              textAlign: "left",
              fontFamily: "monospace",
            }}
          >
            <div>Debug Info:</div>
            <div>authenticated: {String(authenticated)}</div>
            <div>user: {user ? JSON.stringify(user, null, 2) : "null"}</div>
            <div>user?.role: {user?.role || "undefined"}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div
        style={{
          background: "var(--accent)",
          color: "#fff",
          padding: "16px 20px",
          borderRadius: "8px",
          marginBottom: "24px",
          fontWeight: "600",
        }}
      >
        Redux Demo: Component này sử dụng Redux để quản lý state users
      </div>

      <h2>Redux User List Demo</h2>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px" }}>
            Tổng Users
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700", marginTop: "8px" }}>
            {stats.total}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px" }}>Admins</div>
          <div style={{ fontSize: "32px", fontWeight: "700", marginTop: "8px" }}>
            {stats.admins}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px" }}>
            Moderators
          </div>
          <div style={{ fontSize: "32px", fontWeight: "700", marginTop: "8px" }}>
            {stats.moderators}
          </div>
        </div>
        <div className="card">
          <div style={{ color: "var(--muted)", fontSize: "14px" }}>Users</div>
          <div style={{ fontSize: "32px", fontWeight: "700", marginTop: "8px" }}>
            {stats.users}
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #eef2f6",
          }}
        />
        <select
          value={filter}
          onChange={(e) => dispatch(setFilter(e.target.value))}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #eef2f6",
            minWidth: "150px",
          }}
        >
          <option value="all">Tất cả roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card">
        <table className="user-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: "center", padding: "40px" }}>
                  {loading ? "Đang tải..." : "Không có users nào"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u._id || u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background:
                          u.role === "admin"
                            ? "#fee"
                            : u.role === "moderator"
                            ? "#e3f2fd"
                            : "#f0f0f0",
                        color:
                          u.role === "admin"
                            ? "var(--danger)"
                            : u.role === "moderator"
                            ? "#1976d2"
                            : "var(--muted)",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Redux State Display */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "13px",
          fontFamily: "monospace",
        }}
      >
          <div style={{ fontWeight: "600", marginBottom: "8px", color: "#333" }}>
            Redux State:
          </div>
          <pre style={{ margin: 0, color: "var(--muted)" }}>
            {JSON.stringify(
              {
                loading,
                userCount,
                stats,
                filter,
              },
              null,
              2
            )}
          </pre>
      </div>
    </div>
  );
}

// Wrapper với Provider
export default function ReduxUserListDemo() {
  return (
    <Provider store={demoStore}>
      <div style={{ minHeight: "100vh" }}>
        <ReduxUserListForm />
      </div>
    </Provider>
  );
}

