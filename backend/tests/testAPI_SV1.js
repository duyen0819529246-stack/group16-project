/**
 * TEST API CHO SINH VIÊN 1 (Duyên)
 * File này dùng để test các API authentication và protected routes
 * 
 * Chạy: node tests/testAPI_SV1.js
 * Hoặc: npm run test:api (nếu đã thêm script vào package.json)
 */

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

// Màu sắc cho console
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m"
};

// Biến lưu token
let accessToken = "";
let refreshToken = "";
let userId = "";

// Helper functions
const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`\n${colors.cyan}🧪 ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.yellow}${"=".repeat(60)}\n📋 ${msg}\n${"=".repeat(60)}${colors.reset}\n`)
};

// Test functions
async function testRegister() {
  log.test("Test 1: API Register");
  
  try {
    const randomEmail = `test${Date.now()}@example.com`;
    const response = await axios.post(`${API_URL}/users/register`, {
      name: "Test User",
      email: randomEmail,
      password: "123456",
      role: "user"
    });
    
    if (response.data.accessToken && response.data.refreshToken && response.data.user) {
      accessToken = response.data.accessToken;
      refreshToken = response.data.refreshToken;
      userId = response.data.user.id;
      
      log.success(`Đăng ký thành công!`);
      log.info(`Email: ${randomEmail}`);
      log.info(`User ID: ${userId}`);
      log.info(`Access Token: ${accessToken.substring(0, 30)}...`);
      log.info(`Refresh Token: ${refreshToken.substring(0, 30)}...`);
      
      // Kiểm tra user object
      if (response.data.user.id && response.data.user.name && response.data.user.email && response.data.user.role) {
        log.success("User object có đầy đủ thông tin!");
        return true;
      } else {
        log.error("User object thiếu thông tin!");
        return false;
      }
    } else {
      log.error("Response thiếu accessToken, refreshToken hoặc user object!");
      console.log("Response:", response.data);
      return false;
    }
  } catch (err) {
    log.error(`Lỗi đăng ký: ${err.response?.data?.message || err.message}`);
    return false;
  }
}

async function testLogin() {
  log.test("Test 2: API Login");
  
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email: "admin@gmail.com",
      password: "123456"
    });
    
    if (response.data.accessToken && response.data.refreshToken && response.data.user) {
      accessToken = response.data.accessToken;
      refreshToken = response.data.refreshToken;
      userId = response.data.user.id;
      
      log.success(`Đăng nhập thành công!`);
      log.info(`User ID: ${userId}`);
      log.info(`Role: ${response.data.user.role}`);
      log.info(`Name: ${response.data.user.name}`);
      log.info(`Email: ${response.data.user.email}`);
      log.info(`Access Token: ${accessToken.substring(0, 30)}...`);
      
      // Kiểm tra user object
      if (response.data.user.id && response.data.user.name && response.data.user.email && response.data.user.role) {
        log.success("User object có đầy đủ thông tin!");
        return true;
      } else {
        log.error("User object thiếu thông tin!");
        return false;
      }
    } else {
      log.error("Response thiếu accessToken, refreshToken hoặc user object!");
      console.log("Response:", response.data);
      return false;
    }
  } catch (err) {
    log.error(`Lỗi đăng nhập: ${err.response?.data?.message || err.message}`);
    log.info("⚠️  Lưu ý: Bạn cần có user 'admin@gmail.com' với password '123456' trong database");
    return false;
  }
}

async function testGetProfile() {
  log.test("Test 3: API Get Profile (Protected Route)");
  
  if (!accessToken) {
    log.error("Không có token, bỏ qua test này");
    return false;
  }
  
  try {
    const response = await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (response.data.id && response.data.email) {
      log.success(`Lấy profile thành công!`);
      log.info(`User ID: ${response.data.id}`);
      log.info(`Name: ${response.data.name}`);
      log.info(`Email: ${response.data.email}`);
      log.info(`Role: ${response.data.role}`);
      return true;
    } else {
      log.error("Response profile thiếu thông tin!");
      return false;
    }
  } catch (err) {
    log.error(`Lỗi lấy profile: ${err.response?.data?.message || err.message}`);
    return false;
  }
}

async function testGetProfileWithoutToken() {
  log.test("Test 4: API Get Profile (Không có token - phải bị reject)");
  
  try {
    await axios.get(`${API_URL}/users/profile`);
    log.error("❌ API không được bảo vệ! Cho phép truy cập không có token!");
    return false;
  } catch (err) {
    if (err.response?.status === 401) {
      log.success("✅ API được bảo vệ đúng! Từ chối truy cập không có token");
      return true;
    } else {
      log.error(`❌ Lỗi không mong đợi: ${err.response?.data?.message || err.message}`);
      return false;
    }
  }
}

async function testGetUsersAsAdmin() {
  log.test("Test 5: API Get Users (Admin only - Protected Route)");
  
  if (!accessToken) {
    log.error("Không có token, bỏ qua test này");
    return false;
  }
  
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    if (Array.isArray(response.data)) {
      log.success(`Lấy danh sách users thành công!`);
      log.info(`Số lượng users: ${response.data.length}`);
      return true;
    } else {
      log.error("Response không phải array!");
      return false;
    }
  } catch (err) {
    if (err.response?.status === 403) {
      log.info("⚠️  User không có quyền admin (đúng như mong đợi)");
      return true; // Không phải lỗi, chỉ là không có quyền
    } else {
      log.error(`Lỗi lấy users: ${err.response?.data?.message || err.message}`);
      return false;
    }
  }
}

async function testRefreshToken() {
  log.test("Test 6: API Refresh Access Token");
  
  if (!refreshToken) {
    log.error("Không có refresh token, bỏ qua test này");
    return false;
  }
  
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    
    if (response.data.accessToken) {
      const oldToken = accessToken;
      accessToken = response.data.accessToken;
      
      log.success(`Refresh token thành công!`);
      log.info(`Old Token: ${oldToken.substring(0, 30)}...`);
      log.info(`New Token: ${accessToken.substring(0, 30)}...`);
      return true;
    } else {
      log.error("Response thiếu accessToken!");
      return false;
    }
  } catch (err) {
    log.error(`Lỗi refresh token: ${err.response?.data?.message || err.message}`);
    return false;
  }
}

async function testInvalidToken() {
  log.test("Test 7: API với token không hợp lệ");
  
  try {
    await axios.get(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer invalid_token_12345`
      }
    });
    log.error("❌ API không kiểm tra token hợp lệ!");
    return false;
  } catch (err) {
    if (err.response?.status === 401) {
      log.success("✅ API từ chối token không hợp lệ đúng cách!");
      return true;
    } else {
      log.error(`❌ Lỗi không mong đợi: ${err.response?.data?.message || err.message}`);
      return false;
    }
  }
}

// Main test runner
async function runAllTests() {
  log.section("BẮT ĐẦU TEST API CHO SINH VIÊN 1");
  
  log.info(`Base URL: ${BASE_URL}`);
  log.info(`API URL: ${API_URL}\n`);
  
  // Kiểm tra server có chạy không
  try {
    await axios.get(`${BASE_URL}/`);
    log.success("✅ Server đang chạy!");
  } catch (err) {
    log.error(`❌ Server không chạy hoặc không thể kết nối!`);
    log.info(`⚠️  Hãy đảm bảo backend server đang chạy tại ${BASE_URL}`);
    log.info(`   Chạy: cd backend && npm run dev`);
    process.exit(1);
  }
  
  const results = [];
  
  // Chạy các tests
  results.push(await testRegister());
  results.push(await testLogin());
  results.push(await testGetProfile());
  results.push(await testGetProfileWithoutToken());
  results.push(await testGetUsersAsAdmin());
  results.push(await testRefreshToken());
  results.push(await testInvalidToken());
  
  // Tổng kết
  log.section("KẾT QUẢ TEST");
  
  const passed = results.filter(r => r === true).length;
  const total = results.length;
  
  log.info(`✅ Passed: ${passed}/${total}`);
  log.info(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    log.success("\n🎉 TẤT CẢ TEST ĐỀU PASS! API hoạt động tốt!");
  } else {
    log.error("\n⚠️  MỘT SỐ TEST BỊ FAIL! Hãy kiểm tra lại.");
  }
  
  console.log("\n");
}

// Chạy tests
runAllTests().catch(err => {
  log.error(`Lỗi khi chạy tests: ${err.message}`);
  process.exit(1);
});

