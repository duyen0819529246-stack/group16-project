import express from "express";
import { 
  loginUser, 
  registerUser, 
  getProfile,
  refreshAccessToken,
  logout
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// ✅ Đăng ký tài khoản
router.post("/register", registerUser);

// ✅ Đăng nhập (với rate limiter)
router.post("/login", loginRateLimiter, loginUser);

// ⭐ Refresh Access Token (MỚI)
router.post("/refresh", refreshAccessToken);

// ⭐ Đăng xuất và revoke token (CẬP NHẬT)
router.post("/logout", logout);

// ✅ Lấy thông tin user đang đăng nhập (bảo vệ bằng token)
router.get("/profile", protect, getProfile);

export default router;
