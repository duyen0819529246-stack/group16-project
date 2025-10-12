const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET: Lấy danh sách user
router.get("/", userController.getUsers);

// POST: Thêm user mới
router.post("/", userController.addUser);

module.exports = router;
