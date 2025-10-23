import express from "express";
import { loginUser, registerUser, getProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// ✅ Đăng ký tài khoản
router.post("/register", registerUser);

// ✅ Đăng nhập
router.post("/login", loginUser);

// ✅ Lấy thông tin user đang đăng nhập (bảo vệ bằng token)
router.get("/profile", authMiddleware, getProfile);

export default router;
