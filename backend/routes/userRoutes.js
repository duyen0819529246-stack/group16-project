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
} from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

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
router.get("/users", protect, authorizeRoles("admin"), getUsers);
router.post("/users", protect, authorizeRoles("admin"), createUser);
router.put("/users/:id", protect, authorizeRoles("admin"), updateUserByAdmin);
router.delete("/users/:id", protect, deleteUser);

// password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
