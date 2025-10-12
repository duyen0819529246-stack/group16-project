let users = [
  { id: 1, name: "Duyên", email: "duyen@gmail.com" },
  { id: 2, name: "Huy", email: "Huy@gmail.com" }
];

// Lấy danh sách user
exports.getUsers = (req, res) => {
  res.json(users);
};

// Thêm user mới
exports.createUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

// Cập nhật user (PUT)
exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = { ...users[index], ...req.body };
  res.json(users[index]);
};

// Xóa user (DELETE)
exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.json({ message: "User deleted" });
};
