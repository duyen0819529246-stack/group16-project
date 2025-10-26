import express from "express";
import { login, refreshToken, logout } from "../controllers/authController.js";

const router = express.Router();

// 🟢 Đăng nhập
router.post("/login", login);

// 🔁 Làm mới Access Token
router.post("/refresh", refreshToken);

// 🚪 Đăng xuất
router.post("/logout", logout);

export default router;
