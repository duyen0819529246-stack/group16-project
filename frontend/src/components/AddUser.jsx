import React, { useState } from "react";
import axios from "axios";

function AddUser({ fetchUsers }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    // ✅ Gửi dữ liệu lên backend
    try {
      await axios.post("http://localhost:3000/users", { name, email });
      alert("Thêm user thành công!");
      setName("");
      setEmail("");
      fetchUsers(); // cập nhật lại danh sách user
    } catch (error) {
      alert("Lỗi khi thêm user!");
      console.error(error);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Thêm người dùng</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên người dùng"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;
