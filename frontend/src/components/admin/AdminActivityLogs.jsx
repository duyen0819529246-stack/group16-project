import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState("");

  const actions = [
    "login",
    "logout",
    "signup",
    "token_refresh",
    "password_change",
    "password_reset_request",
    "password_reset_success",
    "avatar_upload",
    "profile_view",
    "profile_update",
    "failed_login",
  ];

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [page, filterAction]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (filterAction) params.action = filterAction;

      const response = await api.get("/activity-logs", { params });
      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải logs");
      console.error("Fetch logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/activity-logs/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getActionColor = (action) => {
    const colors = {
      login: "#4CAF50",
      logout: "#9E9E9E",
      signup: "#2196F3",
      failed_login: "#F44336",
      password_change: "#FF9800",
      password_reset_request: "#FFC107",
      password_reset_success: "#8BC34A",
      avatar_upload: "#00BCD4",
      profile_update: "#9C27B0",
      token_refresh: "#607D8B",
    };
    return colors[action] || "#000";
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Activity Logs - Admin Dashboard</h1>

      {/* Stats Section */}
      {stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3>Total Logs</h3>
            <p style={styles.statNumber}>{stats.totalLogs}</p>
          </div>
          <div style={styles.statCard}>
            <h3>Activity Types</h3>
            <p style={styles.statNumber}>{stats.stats.length}</p>
          </div>
        </div>
      )}

      {/* Activity Type Stats */}
      {stats && stats.stats.length > 0 && (
        <div style={styles.actionStatsContainer}>
          <h3>Activity Breakdown</h3>
          <div style={styles.actionStatsGrid}>
            {stats.stats.map((stat) => (
              <div key={stat._id} style={styles.actionStatCard}>
                <span
                  style={{
                    ...styles.actionBadge,
                    backgroundColor: getActionColor(stat._id),
                  }}
                >
                  {stat._id}
                </span>
                <span style={styles.actionCount}>{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filterContainer}>
        <label style={styles.label}>
          Filter by Action:
          <select
            value={filterAction}
            onChange={(e) => {
              setFilterAction(e.target.value);
              setPage(1);
            }}
            style={styles.select}
          >
            <option value="">All Actions</option>
            {actions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Loading */}
      {loading && <div style={styles.loading}>Loading logs...</div>}

      {/* Logs Table */}
      {!loading && logs.length > 0 && (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Timestamp</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Action</th>
                <th style={styles.th}>IP Address</th>
                <th style={styles.th}>Result</th>
                <th style={styles.th}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id} style={styles.tr}>
                  <td style={styles.td}>{formatDate(log.timestamp)}</td>
                  <td style={styles.td}>
                    {log.userId ? (
                      <div>
                        <div style={styles.userName}>{log.userId.name}</div>
                        <div style={styles.userEmail}>{log.userId.email}</div>
                        <span
                          style={{
                            ...styles.roleBadge,
                            backgroundColor:
                              log.userId.role === "admin"
                                ? "#F44336"
                                : "#4CAF50",
                          }}
                        >
                          {log.userId.role}
                        </span>
                      </div>
                    ) : (
                      <span style={styles.nullUser}>Unknown User</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.actionBadge,
                        backgroundColor: getActionColor(log.action),
                      }}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {log.metadata?.ip || "N/A"}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.resultBadge,
                        backgroundColor:
                          log.metadata?.result === "success"
                            ? "#4CAF50"
                            : "#F44336",
                      }}
                    >
                      {log.metadata?.result || "unknown"}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {log.metadata?.details || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              ...styles.paginationButton,
              ...(page === 1 ? styles.paginationButtonDisabled : {}),
            }}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              ...styles.paginationButton,
              ...(page === totalPages ? styles.paginationButtonDisabled : {}),
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* No Logs */}
      {!loading && logs.length === 0 && (
        <div style={styles.noLogs}>No activity logs found</div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#333",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "#f5f5f5",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2196F3",
    margin: "10px 0 0 0",
  },
  actionStatsContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  actionStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "10px",
    marginTop: "15px",
  },
  actionStatCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
  },
  actionCount: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  filterContainer: {
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  select: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#666",
  },
  tableContainer: {
    overflowX: "auto",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#2196F3",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
  },
  tr: {
    borderBottom: "1px solid #e0e0e0",
  },
  td: {
    padding: "12px",
  },
  userName: {
    fontWeight: "bold",
    marginBottom: "2px",
  },
  userEmail: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "4px",
  },
  nullUser: {
    color: "#999",
    fontStyle: "italic",
  },
  roleBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    color: "#fff",
    fontWeight: "bold",
  },
  actionBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#fff",
    fontWeight: "bold",
  },
  resultBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    color: "#fff",
    fontWeight: "bold",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "30px",
  },
  paginationButton: {
    padding: "10px 20px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  paginationButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  noLogs: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#999",
  },
};

export default AdminActivityLogs;


