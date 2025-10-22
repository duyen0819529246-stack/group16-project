import express from "express";
import {
  signup,
  login,
  logout,
  getAllUsers,
  deleteUser,
  forgotPassword,
  resetPassword,
  uploadAvatar,
} from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// Admin
router.get("/", protect, adminOnly, getAllUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

// Forgot / Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Upload Avatar
router.post("/upload-avatar", protect, (req, res, next) => {
  console.log("📩 Đã nhận request upload-avatar");
  next();
}, upload.single("avatar"), uploadAvatar);


export default router;
