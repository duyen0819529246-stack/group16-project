import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// ======================= XÁC THỰC TOKEN =======================
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy thông tin user, bỏ password
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn", error: error.message });
  }
};

// ======================= Tạo alias protect =======================
export const protect = verifyToken;

// ======================= CHỈ ADMIN MỚI TRUY CẬP =======================
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Bạn không có quyền truy cập (Admin only)" });
  }
};
