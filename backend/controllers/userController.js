import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import sendEmail from "../utils/sendEmail.js";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

const signToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ========== AUTH ==========
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email đã tồn tại" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "user" });
    const token = signToken(user);
    res.status(201).json({ message: "Đăng ký thành công", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    const token = signToken(user);
    res.json({ message: "Đăng nhập thành công", token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const logout = async (req, res) => res.json({ message: "Đã đăng xuất" });

// ========== PROFILE ==========
export const getProfile = async (req, res) => {
  try {
    const u = req.user;
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role, avatar: u.avatar });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email && email !== user.email) {
      const ex = await User.findOne({ email });
      if (ex) return res.status(400).json({ message: "Email đã được sử dụng" });
      user.email = email;
    }
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: "Cập nhật thành công", user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// uploadAvatar (xác nhận)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Không có file" });
    // cloudinary đã config ở đầu file
    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
          if (result) resolve(result);
          else reject(error);
        });
        stream.end(buffer);
      });

    const result = await streamUpload(req.file.buffer);
    req.user.avatar = result.secure_url;
    await req.user.save();
    return res.json({ message: "Upload avatar thành công", avatar: result.secure_url });
  } catch (err) {
    console.error("uploadAvatar error:", err);
    return res.status(500).json({ message: "Lỗi upload", error: err.message });
  }
};

// ========== ADMIN / USERS ==========
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email đã tồn tại" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "user" });
    res.status(201).json({ message: "Tạo user thành công", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, password } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    if (email && email !== user.email) {
      if (await User.findOne({ email })) return res.status(400).json({ message: "Email đã được sử dụng" });
      user.email = email;
    }
    if (name) user.name = name;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.json({ message: "Cập nhật user thành công", user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.user.role !== "admin" && req.user._id.toString() !== id) {
      return res.status(403).json({ message: "Không có quyền xóa user" });
    }
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ========== PASSWORD RESET ==========
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Vui lòng cung cấp email" });

    const user = await User.findOne({ email });
    if (!user) {
      // reveal nothing about existence — but return 200
      return res.status(200).json({ message: "Nếu email tồn tại, đã gửi link" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + (process.env.RESET_PASSWORD_EXPIRE_MS ? Number(process.env.RESET_PASSWORD_EXPIRE_MS) : 3600000);
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL || `${req.protocol}://${req.get("host")}`}/reset-password/${resetToken}`;
    const message = `Vui lòng truy cập: ${resetURL}\nLink hết hạn 1 giờ.`;

    try {
      await sendEmail({ email: user.email, subject: "Reset mật khẩu", message });
      console.log(`forgotPassword: email sent to ${user.email}`);
    } catch (mailErr) {
      console.error("forgotPassword: sendEmail error:", mailErr?.message || mailErr);
    }

    // In development or if SMTP not configured, include token in response for testing
    if (process.env.NODE_ENV !== "production" || !process.env.SMTP_USER) {
      return res.json({ message: "Nếu email tồn tại, đã gửi link đặt lại mật khẩu.", resetToken });
    }

    res.json({ message: "Nếu email tồn tại, đã gửi link đặt lại mật khẩu." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashed, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// compatibility exports
export const signup = registerUser;
export const login = loginUser;
