import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import RefreshToken from "../models/refreshTokenModel.js";

// ====================== LOGIN ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Kiểm tra user có tồn tại không
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // 3️⃣ Tạo Access Token + Refresh Token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // 15 phút
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // 7 ngày
    );

    // 4️⃣ Lưu refresh token vào DB
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // 5️⃣ Trả về dữ liệu
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== REFRESH TOKEN ======================
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    // 1️⃣ Kiểm tra token có trong DB không
    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (!stored) return res.status(403).json({ message: "Invalid refresh token" });

    // 2️⃣ Xác minh token hợp lệ
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired refresh token" });

      // 3️⃣ Tạo access token mới
      const newAccessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ====================== LOGOUT ======================
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "No refresh token provided" });

    // 1️⃣ Xóa refresh token khỏi DB (revoke session)
    await RefreshToken.deleteOne({ token: refreshToken });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
