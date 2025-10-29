import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js";
dotenv.config();

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "Không có token, vui lòng đăng nhập." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User không tồn tại." });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn." });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Không có quyền truy cập." });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Bạn không có quyền." });
    next();
  };
};

// Advanced RBAC - Middleware checkRole
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Không có quyền truy cập. Vui lòng đăng nhập." 
      });
    }

    const userRole = req.user.role;
    
    // Check if user role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false,
        message: `Chỉ ${allowedRoles.join(", ")} mới có quyền truy cập.`,
        userRole: userRole,
        requiredRoles: allowedRoles
      });
    }

    next();
  };
};

// Check if user is Admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: "Chỉ Admin mới có quyền truy cập." 
    });
  }
};

// Check if user is Moderator or Admin
export const isModeratorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "moderator")) {
    next();
  } else {
    res.status(403).json({ 
      success: false,
      message: "Chỉ Admin hoặc Moderator mới có quyền truy cập." 
    });
  }
};
