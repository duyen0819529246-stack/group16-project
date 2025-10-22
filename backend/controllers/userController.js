import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ====================== ĐĂNG KÝ ======================
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== ĐĂNG NHẬP ======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Đăng nhập thành công", token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== ĐĂNG XUẤT ======================
export const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== CẬP NHẬT THÔNG TIN NGƯỜI DÙNG ======================
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    const updatedUser = await user.save();
    res.status(200).json({
      message: "Cập nhật thành công",
      user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== LẤY THÔNG TIN NGƯỜI DÙNG ======================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== ADMIN - XEM DANH SÁCH NGƯỜI DÙNG ======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== ADMIN - XOÁ NGƯỜI DÙNG ======================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    await user.deleteOne();
    res.status(200).json({ message: "Đã xóa user thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== QUÊN MẬT KHẨU ======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    res.status(200).json({ message: "Đã tạo token reset mật khẩu", token: resetToken });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== ĐẶT LẠI MẬT KHẨU ======================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc hết hạn" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ====================== UPLOAD AVATAR (Cloudinary + MulterStorage) ======================
export const uploadAvatar = async (req, res) => {
  try {
    console.log("📥 Bắt đầu upload avatar...");
    console.log("👤 User:", req.user);
    console.log("📁 File:", req.file);

    // Kiểm tra có file gửi lên không
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên" });
    }

    // Kiểm tra user tồn tại (phải có middleware protect)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // Lưu link Cloudinary vào user.avatar
    user.avatar = req.file.path; // multer-storage-cloudinary sẽ trả về URL
    await user.save();

    res.status(200).json({
      message: "✅ Upload avatar thành công",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("❌ Lỗi khi upload avatar:", error);
    res.status(500).json({
      message: "Lỗi server khi upload avatar",
      error: error.message,
    });
  }
};
