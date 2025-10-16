import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/users`, newUser);
      alert("Thêm user thành công!");
      setName("");
      setEmail("");
      onUserAdded();
    } catch (err) {
      console.error("Lỗi khi thêm user:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm User</h2>
      <input
        type="text"
        value={name}
        placeholder="Tên"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default AddUser;
