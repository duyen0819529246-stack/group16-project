import mongoose from "mongoose";

/**
 * Schema RefreshToken để quản lý Refresh Token
 * - Lưu trữ refresh token cho từng user
 * - Hỗ trợ revoke token khi logout
 * - Tự động xóa token hết hạn
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    // Token string (random, unique)
    token: {
      type: String,
      required: true,
      unique: true,
      index: true, // Tăng tốc độ tìm kiếm
    },
    
    // User ID - liên kết với User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Tăng tốc độ tìm kiếm theo user
    },
    
    // Thời gian hết hạn
    expiresAt: {
      type: Date,
      required: true,
      index: true, // Tăng tốc độ query theo thời gian
    },
    
    // Trạng thái revoke (bị thu hồi)
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    // Thông tin thiết bị (optional - để tracking)
    deviceInfo: {
      type: String,
      default: "",
    },
    
    // IP address (optional - để security)
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// TTL Index - Tự động xóa document sau khi hết hạn
// MongoDB sẽ tự động xóa các token đã hết hạn
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index để tối ưu query
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

// Virtual để kiểm tra token còn hiệu lực không
refreshTokenSchema.virtual("isValid").get(function () {
  return !this.isRevoked && this.expiresAt > new Date();
});

// Method để revoke token
refreshTokenSchema.methods.revoke = async function () {
  this.isRevoked = true;
  return await this.save();
};

// Static method để tìm token hợp lệ
refreshTokenSchema.statics.findValidToken = async function (tokenString) {
  return await this.findOne({
    token: tokenString,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).populate("userId", "-password"); // Populate user info, không lấy password
};

// Static method để revoke tất cả token của user
refreshTokenSchema.statics.revokeAllUserTokens = async function (userId) {
  return await this.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true }
  );
};

// Static method để cleanup token hết hạn (optional - MongoDB TTL sẽ tự làm)
refreshTokenSchema.statics.cleanupExpiredTokens = async function () {
  return await this.deleteMany({
    expiresAt: { $lt: new Date() },
  });
};

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;

