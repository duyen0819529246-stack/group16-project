import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [newUser, setNewUser] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/users", newUser)
      .then(res => {
        onUserAdded(res.data);
        setNewUser({ name: "", email: "" });
      })
      .catch(err => console.error("Error adding user:", err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm User mới</h2>
      <input
        type="text"
        name="name"
        placeholder="Tên"
        value={newUser.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={newUser.email}
        onChange={handleChange}
        required
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default AddUser;
