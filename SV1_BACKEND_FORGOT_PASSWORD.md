# SV1: Backend API Forgot Password & Reset Password

**Thực hiện bởi:** duyen0819529246-stack

## Công việc đã hoàn thành:

### 1. API Forgot Password
- **Route:** `POST /users/forgot-password`
- **File:** `backend/controllers/userController.js` (dòng 305-341)
- **Chức năng:**
  - Nhận email từ request
  - Sinh token ngẫu nhiên (32 bytes)
  - Hash token bằng SHA256
  - Lưu hash token vào DB với thời gian expire (1 giờ)
  - Gửi email có link reset password

### 2. API Reset Password
- **Route:** `POST /users/reset-password/:token`
- **File:** `backend/controllers/userController.js` (dòng 343-377)
- **Chức năng:**
  - Nhận token từ URL và password mới
  - Hash token và tìm user trong DB
  - Kiểm tra token còn hiệu lực
  - Hash password mới
  - Cập nhật password và xóa token
  - Trả về thông báo thành công

### 3. User Model
- **File:** `backend/models/userModel.js`
- **Đã có sẵn fields:**
  - `passwordResetToken`: String
  - `passwordResetExpires`: Date

### 4. Routes
- **File:** `backend/routes/userRoutes.js`
- **Đã config:**
  - `POST /users/forgot-password`
  - `POST /users/reset-password/:token`

---

**Status:** ✅ Backend API hoàn thành
**Date:** 2025-10-29

