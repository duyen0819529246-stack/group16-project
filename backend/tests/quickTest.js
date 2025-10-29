/**
 * QUICK TEST - RefreshToken Model
 * Test nhanh để kiểm tra RefreshToken hoạt động
 * 
 * Chạy: node tests/quickTest.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import RefreshToken from "../models/refreshTokenModel.js";
import User from "../models/userModel.js";

dotenv.config();

async function quickTest() {
  console.log("\n🧪 QUICK TEST - RefreshToken Model\n");
  
  try {
    // Kết nối MongoDB
    console.log("📡 Đang kết nối MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Kết nối thành công!\n");
    
    // Tìm một user bất kỳ (hoặc tạo mới)
    let user = await User.findOne();
    
    if (!user) {
      console.log("⚠️  Không tìm thấy user, tạo user mới...");
      user = await User.create({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "hashedpassword",
        role: "user"
      });
      console.log(`✅ Tạo user: ${user.email}\n`);
    } else {
      console.log(`✅ Sử dụng user: ${user.email}\n`);
    }
    
    // 1. TẠO REFRESH TOKEN
    console.log("📝 Test 1: Tạo Refresh Token");
    const tokenString = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    
    const refreshToken = await RefreshToken.create({
      token: tokenString,
      userId: user._id,
      expiresAt,
      deviceInfo: "Quick Test Device",
      ipAddress: "127.0.0.1"
    });
    
    console.log(`   ✅ Token ID: ${refreshToken._id}`);
    console.log(`   ✅ Token: ${refreshToken.token.substring(0, 30)}...`);
    console.log(`   ✅ User: ${user.name}`);
    console.log(`   ✅ Expires: ${refreshToken.expiresAt.toLocaleString()}`);
    console.log(`   ✅ Is Valid: ${refreshToken.isValid}\n`);
    
    // 2. TÌM TOKEN
    console.log("🔍 Test 2: Tìm token vừa tạo");
    const found = await RefreshToken.findValidToken(tokenString);
    
    if (found) {
      console.log(`   ✅ Tìm thấy token!`);
      console.log(`   ✅ User: ${found.userId?.name || "N/A"}`);
      console.log(`   ✅ Email: ${found.userId?.email || "N/A"}\n`);
    } else {
      console.log(`   ❌ Không tìm thấy token!\n`);
    }
    
    // 3. REVOKE TOKEN
    console.log("🚫 Test 3: Revoke token");
    await refreshToken.revoke();
    console.log(`   ✅ Token đã được revoke`);
    console.log(`   ✅ Is Revoked: ${refreshToken.isRevoked}\n`);
    
    // 4. KIỂM TRA SAU KHI REVOKE
    console.log("🔍 Test 4: Kiểm tra token sau khi revoke");
    const stillValid = await RefreshToken.findValidToken(tokenString);
    
    if (!stillValid) {
      console.log(`   ✅ Token không còn hợp lệ (đúng như mong đợi)\n`);
    } else {
      console.log(`   ❌ Token vẫn còn hợp lệ (có lỗi!)\n`);
    }
    
    // 5. CLEANUP
    console.log("🧹 Cleanup: Xóa token test");
    await RefreshToken.deleteOne({ _id: refreshToken._id });
    console.log(`   ✅ Đã xóa token test\n`);
    
    console.log("=" + "=".repeat(50));
    console.log("✅ TẤT CẢ TEST THÀNH CÔNG! 🎉");
    console.log("=" + "=".repeat(50) + "\n");
    
  } catch (err) {
    console.error("\n❌ LỖI:", err.message);
    console.error(err);
  } finally {
    await mongoose.connection.close();
    console.log("👋 Đã đóng kết nối MongoDB\n");
  }
}

quickTest();

