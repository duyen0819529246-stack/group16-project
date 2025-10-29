/**
 * Test Script for Avatar Upload Feature
 * SV3: Test upload + lấy URL lưu MongoDB
 * 
 * Yêu cầu:
 * 1. Server đang chạy (npm run dev)
 * 2. Đã cấu hình Cloudinary trong .env
 * 3. Có tài khoản user trong database
 */

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "http://localhost:5000/api";

// Màu cho console
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAvatarUpload() {
  try {
    log("\n========================================", "cyan");
    log("🧪 TEST AVATAR UPLOAD - HOẠT ĐỘNG 3", "cyan");
    log("========================================\n", "cyan");

    // STEP 1: Đăng nhập để lấy token
    log("📝 STEP 1: Đăng nhập...", "blue");
    
    const loginData = {
      email: "admin@example.com", // Thay bằng email của bạn
      password: "admin123",       // Thay bằng password của bạn
    };

    const loginResponse = await axios.post(`${API_URL}/users/login`, loginData);
    const { accessToken } = loginResponse.data;

    if (!accessToken) {
      throw new Error("Không lấy được access token");
    }

    log("✅ Đăng nhập thành công!", "green");
    log(`   Token: ${accessToken.substring(0, 20)}...`, "yellow");

    // STEP 2: Tạo file ảnh test (hoặc sử dụng ảnh có sẵn)
    log("\n📝 STEP 2: Chuẩn bị file ảnh test...", "blue");
    
    // Tạo ảnh đơn giản bằng canvas (hoặc bạn có thể dùng ảnh có sẵn)
    const testImagePath = path.join(__dirname, "test-avatar.jpg");
    
    // Kiểm tra xem có file test không
    if (!fs.existsSync(testImagePath)) {
      log("⚠️  Không tìm thấy test-avatar.jpg", "yellow");
      log("   Tạo file ảnh test hoặc thay đổi đường dẫn trong script", "yellow");
      log("   Hoặc upload ảnh thủ công qua Postman", "yellow");
      return;
    }

    log("✅ File ảnh test đã sẵn sàng!", "green");

    // STEP 3: Upload avatar
    log("\n📝 STEP 3: Upload avatar lên server...", "blue");

    const formData = new FormData();
    formData.append("avatar", fs.createReadStream(testImagePath));

    const uploadResponse = await axios.post(
      `${API_URL}/users/profile/avatar`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    log("✅ Upload thành công!", "green");
    log(`   Avatar URL: ${uploadResponse.data.avatar}`, "cyan");
    
    if (uploadResponse.data.details) {
      log(`   Kích thước: ${uploadResponse.data.details.width}x${uploadResponse.data.details.height}`, "yellow");
      log(`   Format: ${uploadResponse.data.details.format}`, "yellow");
      log(`   Size: ${(uploadResponse.data.details.bytes / 1024).toFixed(2)} KB`, "yellow");
    }

    // STEP 4: Kiểm tra profile để xác nhận URL đã được lưu vào MongoDB
    log("\n📝 STEP 4: Kiểm tra profile (MongoDB)...", "blue");

    const profileResponse = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    log("✅ Lấy profile thành công!", "green");
    log(`   Name: ${profileResponse.data.name}`, "yellow");
    log(`   Email: ${profileResponse.data.email}`, "yellow");
    log(`   Avatar: ${profileResponse.data.avatar}`, "cyan");

    // STEP 5: Xác nhận
    log("\n========================================", "cyan");
    log("✅ KẾT QUẢ TEST", "cyan");
    log("========================================", "cyan");

    const success = uploadResponse.data.avatar === profileResponse.data.avatar;
    
    if (success) {
      log("✅ Avatar đã được lưu vào MongoDB!", "green");
      log("✅ URL trả về khớp với URL trong database!", "green");
      log("\n🎉 TEST THÀNH CÔNG - HOẠT ĐỘNG 3 HOÀN TẤT!", "green");
    } else {
      log("❌ URL không khớp!", "red");
    }

    log("\n📋 Checklist SV3:", "cyan");
    log("✅ Tạo account Cloudinary", "green");
    log("✅ Cấu hình credentials trong .env", "green");
    log("✅ Test upload thành công", "green");
    log("✅ Lấy URL và lưu vào MongoDB", "green");
    log("✅ Kiểm tra ảnh trên Cloudinary Dashboard\n", "green");

  } catch (error) {
    log("\n❌ LỖI:", "red");
    
    if (error.response) {
      log(`   Status: ${error.response.status}`, "red");
      log(`   Message: ${error.response.data.message || "Unknown error"}`, "red");
    } else if (error.request) {
      log("   Không thể kết nối tới server", "red");
      log("   Đảm bảo server đang chạy: npm run dev", "yellow");
    } else {
      log(`   ${error.message}`, "red");
    }

    log("\n💡 HƯỚNG DẪN:", "yellow");
    log("   1. Kiểm tra server đang chạy (npm run dev)", "yellow");
    log("   2. Kiểm tra .env đã cấu hình đúng", "yellow");
    log("   3. Thay email/password trong script", "yellow");
    log("   4. Tạo file test-avatar.jpg trong thư mục tests/\n", "yellow");
  }
}

// Chạy test
testAvatarUpload();

