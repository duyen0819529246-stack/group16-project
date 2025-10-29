import express from "express";
import multer from "multer";
import {
  signup,
  login,
  logout,
  getProfile,
  updateProfile,
  uploadAvatar,
  getUsers,
  createUser,
  updateUserByAdmin,
  deleteUser,
  forgotPassword,
  resetPassword,
  getUsersByRole,
  updateUserRole,
  getRoleStatistics,
  getMyPermissions,
} from "../controllers/userController.js";
import { protect, authorizeRoles, checkRole, isAdmin, isModeratorOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/profile/avatar", protect, upload.single("avatar"), uploadAvatar);

// admin actions for users
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.post("/", protect, authorizeRoles("admin"), createUser);
router.put("/:id", protect, authorizeRoles("admin"), updateUserByAdmin);
router.delete("/:id", protect, deleteUser);

// password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ========== RBAC ROUTES ==========
// Get current user's permissions (All authenticated users)
router.get("/permissions", protect, getMyPermissions);

// Get users by role (Admin & Moderator only)
router.get("/role/:role", protect, checkRole(["admin", "moderator"]), getUsersByRole);

// Get role statistics (Admin only)
router.get("/statistics/roles", protect, isAdmin, getRoleStatistics);

// Update user role (Admin only)
router.put("/:id/role", protect, isAdmin, updateUserRole);

export default router;
