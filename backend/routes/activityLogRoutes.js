import express from "express";
import {
  getAllLogs,
  getUserLogs,
  getActivityStats,
  getMyLogs,
} from "../controllers/activityLogController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes - require authentication
router.get("/my-logs", protect, getMyLogs);

// Admin only routes
router.get("/", protect, authorizeRoles("admin"), getAllLogs);
router.get("/stats", protect, authorizeRoles("admin"), getActivityStats);
router.get("/user/:userId", protect, authorizeRoles("admin"), getUserLogs);

export default router;


