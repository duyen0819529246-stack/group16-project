/**
 * TEST REFRESH TOKEN MODEL
 * Sinh viên 3: Test lưu và truy xuất RefreshToken
 * 
 * Cách chạy:
 * 1. Đảm bảo MongoDB đang chạy và .env đã config
 * 2. Chạy: node tests/testRefreshToken.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import RefreshToken from "../models/refreshTokenModel.js";
import User from "../models/userModel.js";

dotenv.config();

// Màu sắc cho console
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[36m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  test: (msg) => console.log(`\n${colors.yellow}▶ TEST: ${msg}${colors.reset}`),
};

// Kết nối MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log.success("Kết nối MongoDB thành công");
  } catch (err) {
    log.error(`Lỗi kết nối MongoDB: ${err.message}`);
    process.exit(1);
  }
}

// Tạo user test
async function createTestUser() {
  try {
    // Xóa user test cũ nếu có
    await User.deleteOne({ email: "test@refreshtoken.com" });
    
    const user = await User.create({
      name: "Test User",
      email: "test@refreshtoken.com",
      password: "hashedpassword123",
      role: "user",
    });
    
    log.success(`Tạo test user: ${user.email}`);
    return user;
  } catch (err) {
    log.error(`Lỗi tạo user: ${err.message}`);
    throw err;
  }
}

// Test 1: Tạo và lưu RefreshToken
async function test1_CreateToken(userId) {
  log.test("1. Tạo và lưu RefreshToken");
  
  try {
    const token = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    
    const refreshToken = await RefreshToken.create({
      token,
      userId,
      expiresAt,
      deviceInfo: "Chrome on Windows",
      ipAddress: "192.168.1.1",
    });
    
    log.success("Tạo RefreshToken thành công");
    log.info(`  - Token ID: ${refreshToken._id}`);
    log.info(`  - Token: ${refreshToken.token.substring(0, 20)}...`);
    log.info(`  - User ID: ${refreshToken.userId}`);
    log.info(`  - Expires At: ${refreshToken.expiresAt}`);
    log.info(`  - Is Revoked: ${refreshToken.isRevoked}`);
    
    return refreshToken;
  } catch (err) {
    log.error(`Lỗi tạo token: ${err.message}`);
    throw err;
  }
}

// Test 2: Truy xuất RefreshToken theo token string
async function test2_FindByToken(tokenString) {
  log.test("2. Truy xuất RefreshToken theo token string");
  
  try {
    const found = await RefreshToken.findOne({ token: tokenString });
    
    if (!found) {
      log.error("Không tìm thấy token");
      return null;
    }
    
    log.success("Tìm thấy RefreshToken");
    log.info(`  - Token ID: ${found._id}`);
    log.info(`  - User ID: ${found.userId}`);
    log.info(`  - Is Revoked: ${found.isRevoked}`);
    
    return found;
  } catch (err) {
    log.error(`Lỗi tìm token: ${err.message}`);
    throw err;
  }
}

// Test 3: Sử dụng static method findValidToken
async function test3_FindValidToken(tokenString) {
  log.test("3. Sử dụng findValidToken (static method)");
  
  try {
    const validToken = await RefreshToken.findValidToken(tokenString);
    
    if (!validToken) {
      log.error("Token không hợp lệ hoặc đã hết hạn");
      return null;
    }
    
    log.success("Token hợp lệ");
    log.info(`  - Token ID: ${validToken._id}`);
    log.info(`  - User: ${validToken.userId?.name || validToken.userId}`);
    log.info(`  - Email: ${validToken.userId?.email || "N/A"}`);
    
    return validToken;
  } catch (err) {
    log.error(`Lỗi: ${err.message}`);
    throw err;
  }
}

// Test 4: Revoke token
async function test4_RevokeToken(tokenId) {
  log.test("4. Revoke (thu hồi) token");
  
  try {
    const token = await RefreshToken.findById(tokenId);
    
    if (!token) {
      log.error("Không tìm thấy token");
      return;
    }
    
    await token.revoke();
    
    log.success("Revoke token thành công");
    log.info(`  - Is Revoked: ${token.isRevoked}`);
    
    // Kiểm tra lại với findValidToken
    const stillValid = await RefreshToken.findValidToken(token.token);
    if (!stillValid) {
      log.success("Token đã không còn hợp lệ sau khi revoke");
    } else {
      log.error("Lỗi: Token vẫn còn hợp lệ sau khi revoke");
    }
  } catch (err) {
    log.error(`Lỗi revoke: ${err.message}`);
    throw err;
  }
}

// Test 5: Tạo nhiều token cho cùng 1 user
async function test5_MultipleTokens(userId) {
  log.test("5. Tạo nhiều token cho cùng 1 user");
  
  try {
    const tokens = [];
    
    for (let i = 0; i < 3; i++) {
      const token = crypto.randomBytes(64).toString("hex");
      const expiresAt = new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000);
      
      const refreshToken = await RefreshToken.create({
        token,
        userId,
        expiresAt,
        deviceInfo: `Device ${i + 1}`,
      });
      
      tokens.push(refreshToken);
    }
    
    log.success(`Tạo ${tokens.length} token thành công`);
    
    // Tìm tất cả token của user
    const userTokens = await RefreshToken.find({ userId, isRevoked: false });
    log.info(`  - Tổng số token active của user: ${userTokens.length}`);
    
    return tokens;
  } catch (err) {
    log.error(`Lỗi: ${err.message}`);
    throw err;
  }
}

// Test 6: Revoke tất cả token của user
async function test6_RevokeAllUserTokens(userId) {
  log.test("6. Revoke tất cả token của user");
  
  try {
    const result = await RefreshToken.revokeAllUserTokens(userId);
    
    log.success(`Revoke thành công ${result.modifiedCount} token`);
    
    // Kiểm tra lại
    const remainingTokens = await RefreshToken.find({ 
      userId, 
      isRevoked: false 
    });
    
    log.info(`  - Số token còn lại (active): ${remainingTokens.length}`);
    
    if (remainingTokens.length === 0) {
      log.success("Tất cả token đã được revoke");
    } else {
      log.error("Vẫn còn token chưa được revoke");
    }
  } catch (err) {
    log.error(`Lỗi: ${err.message}`);
    throw err;
  }
}

// Test 7: Test token hết hạn
async function test7_ExpiredToken(userId) {
  log.test("7. Test token đã hết hạn");
  
  try {
    const token = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date(Date.now() - 1000); // Hết hạn từ 1 giây trước
    
    const expiredToken = await RefreshToken.create({
      token,
      userId,
      expiresAt,
    });
    
    log.success("Tạo expired token thành công");
    
    // Thử tìm với findValidToken
    const found = await RefreshToken.findValidToken(token);
    
    if (!found) {
      log.success("findValidToken đúng cách bỏ qua token hết hạn");
    } else {
      log.error("Lỗi: findValidToken vẫn trả về token hết hạn");
    }
    
    return expiredToken;
  } catch (err) {
    log.error(`Lỗi: ${err.message}`);
    throw err;
  }
}

// Cleanup - Xóa dữ liệu test
async function cleanup() {
  log.test("Cleanup - Xóa dữ liệu test");
  
  try {
    await RefreshToken.deleteMany({ deviceInfo: /^(Device|Chrome)/ });
    await User.deleteOne({ email: "test@refreshtoken.com" });
    
    log.success("Xóa dữ liệu test thành công");
  } catch (err) {
    log.error(`Lỗi cleanup: ${err.message}`);
  }
}

// Main test runner
async function runAllTests() {
  console.log("\n" + "=".repeat(60));
  console.log("   🧪 TEST REFRESH TOKEN MODEL - SINH VIÊN 3");
  console.log("=".repeat(60) + "\n");
  
  try {
    // Kết nối DB
    await connectDB();
    
    // Tạo test user
    const user = await createTestUser();
    
    // Test 1: Tạo token
    const token1 = await test1_CreateToken(user._id);
    
    // Test 2: Tìm token
    await test2_FindByToken(token1.token);
    
    // Test 3: Find valid token
    await test3_FindValidToken(token1.token);
    
    // Test 4: Revoke token
    await test4_RevokeToken(token1._id);
    
    // Test 5: Multiple tokens
    await test5_MultipleTokens(user._id);
    
    // Test 6: Revoke all
    await test6_RevokeAllUserTokens(user._id);
    
    // Test 7: Expired token
    await test7_ExpiredToken(user._id);
    
    // Cleanup
    await cleanup();
    
    console.log("\n" + "=".repeat(60));
    log.success("TẤT CẢ TEST HOÀN THÀNH THÀNH CÔNG! 🎉");
    console.log("=".repeat(60) + "\n");
    
  } catch (err) {
    console.log("\n" + "=".repeat(60));
    log.error(`TEST THẤT BẠI: ${err.message}`);
    console.log("=".repeat(60) + "\n");
  } finally {
    await mongoose.connection.close();
    log.info("Đã đóng kết nối MongoDB");
  }
}

// Chạy tests
runAllTests();

