
// User.js
import mongoose from 'mongoose';

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true, // tự động thêm createdAt và updatedAt
  }
);

// Tạo model User từ schema
const User = mongoose.model('User', userSchema);

// Xuất model để import ở các file khác
export default User;
