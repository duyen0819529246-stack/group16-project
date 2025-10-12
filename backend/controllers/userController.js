let users = [
  { id: 1, name: "Duyen", email: "Duyen@gmail.com" },
  { id: 2, name: "Huy", email: "Huy@gmail.com" }
];

// Lấy danh sách user
const getUsers = (req, res) => {
  res.json(users);
};

// Thêm user mới
const addUser = (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.status(201).json({
    message: "User added successfully ✅",
    user: newUser
  });
};

module.exports = { getUsers, addUser };
