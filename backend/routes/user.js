<<<<<<< HEAD
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
=======
const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.send('User route is working!');
});

module.exports = router;
>>>>>>> 3975f2a7ad13d8ca03c4aea696bc5bc3a554ee23
