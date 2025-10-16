import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  // Gọi API backend để lấy dữ liệu từ MongoDB
  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Danh sách người dùng từ MongoDB</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;