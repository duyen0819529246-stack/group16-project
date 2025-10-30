# 🏗️ KIẾN TRÚC HỆ THỐNG - Refresh Token

## 📊 TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────────┐
│                    REFRESH TOKEN SYSTEM                          │
│                                                                  │
│  Frontend (SV2)  ←→  Backend API (SV1)  ←→  Database (SV3)    │
│                                                                  │
│  - Auto-refresh      - /auth/refresh        - RefreshToken      │
│  - localStorage      - /auth/logout         - TTL Index         │
│  - Interceptors      - Token logic          - Methods           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 LUỒNG HOẠT ĐỘNG CHI TIẾT

### 1. ĐĂNG NHẬP (Login Flow)

```
┌──────────┐
│  User    │
│  clicks  │
│  Login   │
└────┬─────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Frontend (LoginForm.jsx)                │
│  - Thu thập email, password              │
│  - Gọi: POST /api/auth/login            │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Backend (userController.js)             │
│  1. Kiểm tra email, password             │
│  2. Tạo accessToken (15m)                │
│  3. Tạo refreshToken (7d)                │
│  4. Lưu refreshToken vào MongoDB         │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Response trả về Frontend:               │
│  {                                       │
│    "accessToken": "eyJhbG...",          │
│    "refreshToken": "7f3e2a..."          │
│  }                                       │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Frontend (AuthContext.jsx)              │
│  - Lưu accessToken → localStorage        │
│  - Lưu refreshToken → localStorage       │
│  - Decode token → Lấy user info          │
│  - Redirect → Homepage                   │
└──────────────────────────────────────────┘
```

---

### 2. GỌI API BẢO MẬT (Protected API Call)

```
┌──────────┐
│  User    │
│  action  │
└────┬─────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Frontend (api.js - Request Interceptor) │
│  - Lấy accessToken từ localStorage       │
│  - Thêm: Authorization: Bearer {token}   │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Backend (authMiddleware.js)             │
│  - Verify JWT token                      │
│  - Decode → req.user                     │
└────┬─────────────────────────────────────┘
     │
     ├─── ✅ Token hợp lệ
     │    │
     │    ▼
     │    ┌──────────────────────────┐
     │    │  Controller xử lý        │
     │    │  Trả về data             │
     │    └──────────────────────────┘
     │
     └─── ❌ Token hết hạn (401)
          │
          ▼
          [Chuyển sang Flow 3: Auto-Refresh]
```

---

### 3. TỰ ĐỘNG REFRESH TOKEN (Auto-Refresh Flow)

```
┌──────────────────────────────────────────┐
│  Nhận lỗi 401 từ backend                 │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Response Interceptor (api.js)           │
│  - Phát hiện: error.response.status=401  │
│  - Kiểm tra: Đang refresh? → Queue       │
│  - Không → Bắt đầu refresh               │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Lấy refreshToken từ localStorage        │
│  Gọi: POST /api/auth/refresh             │
│  Body: { refreshToken: "..." }           │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Backend (refreshAccessToken)            │
│  1. Tìm token trong DB                   │
│  2. Kiểm tra isRevoked = false           │
│  3. Kiểm tra expiresAt > now             │
│  4. Lấy user từ userId                   │
│  5. Tạo accessToken mới                  │
└────┬─────────────────────────────────────┘
     │
     ├─── ✅ Refresh thành công
     │    │
     │    ▼
     │    ┌──────────────────────────────┐
     │    │  Response:                   │
     │    │  { accessToken: "new..." }   │
     │    └───┬──────────────────────────┘
     │        │
     │        ▼
     │    ┌──────────────────────────────┐
     │    │  Interceptor:                │
     │    │  - Lưu token mới             │
     │    │  - Xử lý queue               │
     │    │  - Retry request ban đầu    │
     │    └──────────────────────────────┘
     │
     └─── ❌ Refresh thất bại (401)
          │
          ▼
          ┌──────────────────────────────┐
          │  Logout tự động:             │
          │  - Xóa tokens                │
          │  - Redirect → /login         │
          └──────────────────────────────┘
```

---

### 4. ĐĂNG XUẤT (Logout Flow)

```
┌──────────┐
│  User    │
│  clicks  │
│  Logout  │
└────┬─────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Frontend (AuthContext.jsx)              │
│  - Lấy refreshToken từ localStorage      │
│  - Gọi: POST /api/auth/logout            │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Backend (logout)                        │
│  - Tìm refreshToken trong DB             │
│  - Set isRevoked = true                  │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Response: { message: "Đã đăng xuất" }   │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Frontend:                               │
│  - Xóa accessToken từ localStorage       │
│  - Xóa refreshToken từ localStorage      │
│  - Clear user state                      │
│  - Redirect → /login                     │
└──────────────────────────────────────────┘
```

---

## 🗄️ CẤU TRÚC DATABASE

### RefreshToken Collection

```javascript
{
  _id: ObjectId("6abc123..."),
  
  // Token string (random 128 chars)
  token: "7f3e2a9b1c4d5e6f8a0b1c2d3e4f5a6b...",
  
  // Reference to User
  userId: ObjectId("user_id_here"),
  
  // Expiration date
  expiresAt: ISODate("2025-11-05T10:30:00.000Z"),
  
  // Revoked status
  isRevoked: false,
  
  // Optional metadata
  deviceInfo: "Chrome on Windows",
  ipAddress: "192.168.1.1",
  
  // Auto timestamps
  createdAt: ISODate("2025-10-29T10:30:00.000Z"),
  updatedAt: ISODate("2025-10-29T10:30:00.000Z")
}
```

### Indexes

```javascript
// Single indexes
{ token: 1 }          // unique, fast lookup
{ userId: 1 }         // find by user
{ isRevoked: 1 }      // filter active tokens
{ expiresAt: 1 }      // TTL index (auto cleanup)

// Compound index
{ userId: 1, isRevoked: 1 }  // find active tokens of user
```

---

## 🎯 CÁC THÀNH PHẦN CHÍNH

### Frontend Components

```
frontend/src/
│
├── contexts/
│   └── AuthContext.jsx
│       ├── login(accessToken, refreshToken)
│       ├── logout()
│       └── signup(name, email, password)
│
├── services/
│   └── api.js
│       ├── Request Interceptor
│       │   └── Gắn Authorization header
│       │
│       └── Response Interceptor
│           ├── Xử lý 401 error
│           ├── Auto-refresh logic
│           └── Queue management
│
└── components/auth/
    └── LoginForm.jsx
        └── Xử lý login response (2 tokens)
```

### Backend Components

```
backend/
│
├── models/
│   └── refreshTokenModel.js
│       ├── Schema definition
│       ├── TTL Index
│       ├── Methods: revoke()
│       └── Statics: findValidToken()
│
├── controllers/
│   └── userController.js
│       ├── signAccessToken()         // Tạo access token
│       ├── generateRefreshToken()    // Tạo refresh token
│       ├── loginUser()               // Login + 2 tokens
│       ├── registerUser()            // Register + 2 tokens
│       ├── refreshAccessToken()      // ⭐ Refresh API
│       └── logout()                  // ⭐ Revoke token
│
├── middleware/
│   └── authMiddleware.js
│       └── protect()                 // Verify JWT
│
└── routes/
    └── authRoutes.js
        ├── POST /register
        ├── POST /login
        ├── POST /refresh    ⭐
        ├── POST /logout     ⭐
        └── GET  /profile
```

---

## 🔐 BẢO MẬT

### 1. Token Security

```
Access Token:
├── Thời gian ngắn (15m)
├── Giảm thiểu rủi ro nếu bị đánh cắp
└── Chỉ có thể dùng tối đa 15 phút

Refresh Token:
├── Lưu trong database
├── Có thể revoke bất kỳ lúc nào
├── Kiểm tra isRevoked trước khi dùng
└── TTL auto cleanup
```

### 2. Validation Layers

```
Frontend:
├── Kiểm tra token hết hạn khi khởi tạo
└── Auto-refresh khi nhận 401

Backend:
├── Middleware verify JWT
├── Check token trong DB
├── Validate expiresAt
└── Check isRevoked = false
```

---

## ⚡ PERFORMANCE

### 1. Database Optimization

```javascript
// TTL Index - Auto cleanup
{ expiresAt: 1 }, { expireAfterSeconds: 0 }
→ MongoDB tự động xóa token hết hạn mỗi 60s

// Compound Index
{ userId: 1, isRevoked: 1 }
→ Query nhanh: "Lấy tất cả token active của user"

// Unique Index
{ token: 1 } unique
→ Tìm token cực nhanh (O(1))
```

### 2. Frontend Optimization

```javascript
// Queue Management
- Chỉ gọi refresh 1 lần
- Các request khác đợi trong queue
- Retry tất cả sau khi có token mới
→ Tránh spam refresh API
```

---

## 📊 MONITORING

### Logs cần theo dõi:

```javascript
// Backend
✅ RefreshToken created: { userId, expiresAt }
✅ Token refreshed: { userId, oldToken }
✅ Token revoked: { userId, token }
❌ Invalid refresh token: { token }
❌ Expired refresh token: { token, expiresAt }

// Frontend
✅ Tokens saved to localStorage
✅ Auto-refresh triggered
✅ New access token received
❌ Refresh failed → Logout
```

---

## 🎓 BEST PRACTICES

### ✅ DO

- Dùng Access Token ngắn (5-15m)
- Dùng Refresh Token dài (7-30d)
- Lưu Refresh Token trong database
- Revoke token khi logout
- Auto-refresh khi 401
- Queue management
- TTL Index cho cleanup

### ❌ DON'T

- Không lưu token trong cookies (CSRF risk)
- Không dùng Access Token quá dài (>1h)
- Không quên revoke khi logout
- Không dùng lại token đã revoke
- Không skip validation

---

## 🚀 SCALE & EXTEND

### Có thể mở rộng:

```
1. Multiple Devices
   └── Lưu deviceInfo, track all sessions

2. IP Whitelisting
   └── Chỉ cho phép IP cụ thể

3. Rate Limiting
   └── Giới hạn số lần refresh/phút

4. Email Notifications
   └── Thông báo khi login mới

5. Admin Dashboard
   └── Quản lý tất cả sessions
   └── Revoke token từ xa
```

---

## ✅ CHECKLIST

- [x] Access Token 15 phút
- [x] Refresh Token 7 ngày
- [x] Auto-refresh khi 401
- [x] Revoke khi logout
- [x] TTL Index cleanup
- [x] Queue management
- [x] Error handling
- [x] Tests đầy đủ
- [x] Documentation

---

**Kiến trúc hoàn chỉnh và sẵn sàng production!** 🎉


