# 🔐 Hoạt động 1 - Refresh Token & Session Management

## 🎯 MỤC TIÊU
Tạo cơ chế JWT Access Token + Refresh Token, duy trì session an toàn, revoke token khi logout.

---

## 📊 PHÂN CÔNG CÔNG VIỆC

| Sinh viên | Nhiệm vụ | Trạng thái |
|-----------|----------|-----------|
| **SV1** | API `/auth/refresh`, middleware xác thực Access Token, lưu Refresh Token | ⏳ Pending |
| **SV2** | Frontend gọi API, lưu token trong localStorage, tự động refresh | ✅ Hoàn thành |
| **SV3** | Tạo schema RefreshToken, test lưu/truy xuất | ✅ Hoàn thành |

---

## ✅ ĐÃ HOÀN THÀNH

### 🎨 Frontend (SV2) - ✅ 100%

#### Files đã cập nhật:

1. **`frontend/src/contexts/AuthContext.jsx`**
   - Quản lý `accessToken` và `refreshToken`
   - Lưu 2 token vào localStorage
   - Logout gọi API revoke token

2. **`frontend/src/services/api.js`**
   - Request interceptor: Tự động gắn accessToken
   - Response interceptor: **Tự động refresh token** khi 401
   - Queue management: Xử lý nhiều request đồng thời

3. **`frontend/src/components/auth/LoginForm.jsx`**
   - Gọi `/auth/login` và nhận cả 2 token
   - Hỗ trợ backward compatibility

### 🗄️ Database (SV3) - ✅ 100%

#### Files đã tạo:

1. **`backend/models/refreshTokenModel.js`**
   - Schema đầy đủ với indexes
   - TTL index tự động xóa token hết hạn
   - Methods: `revoke()`, `findValidToken()`, etc.

2. **`backend/tests/testRefreshToken.js`**
   - 7 test cases đầy đủ
   - Test tạo, tìm, revoke, expired token

3. **`backend/tests/quickTest.js`**
   - Quick test script đơn giản
   - Chạy nhanh để verify

#### Tài liệu:
- **`HUONG_DAN_SINH_VIEN_3.md`** - Hướng dẫn chi tiết cho SV3

---

## ⏳ CẦN HOÀN THÀNH

### ⚙️ Backend API (SV1) - ⏳ Pending

Cần tạo/cập nhật:

1. **Cập nhật `backend/controllers/userController.js`**
   - Import RefreshToken model
   - Tạo hàm `signAccessToken()` (15 phút)
   - Tạo hàm `generateRefreshToken()` (7 ngày)
   - Cập nhật `loginUser()` trả về 2 token
   - Cập nhật `registerUser()` trả về 2 token
   - Tạo `refreshAccessToken()` API mới
   - Cập nhật `logout()` để revoke token

2. **Cập nhật `backend/routes/authRoutes.js`**
   - Thêm route `POST /auth/refresh`
   - Thêm route `POST /auth/logout`

3. **Cập nhật `backend/server.js`**
   - Đảm bảo có route `/api/auth`

👉 **Xem file `REFRESH_TOKEN_IMPLEMENTATION.md` để biết code chi tiết**

---

## 📁 CẤU TRÚC FILE

```
group16-project-main/
├── frontend/                          ✅ HOÀN THÀNH
│   ├── src/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       ✅ Đã cập nhật
│   │   ├── services/
│   │   │   └── api.js                ✅ Đã cập nhật (auto-refresh)
│   │   └── components/
│   │       └── auth/
│   │           └── LoginForm.jsx     ✅ Đã cập nhật
│   └── ...
│
├── backend/
│   ├── models/
│   │   ├── userModel.js
│   │   └── refreshTokenModel.js      ✅ MỚI (SV3)
│   │
│   ├── controllers/
│   │   └── userController.js         ⏳ CẦN CẬP NHẬT (SV1)
│   │
│   ├── routes/
│   │   └── authRoutes.js             ⏳ CẦN CẬP NHẬT (SV1)
│   │
│   ├── tests/                         ✅ MỚI (SV3)
│   │   ├── testRefreshToken.js       ✅ Full test suite
│   │   └── quickTest.js              ✅ Quick test
│   │
│   └── server.js                      ⏳ CẦN KIỂM TRA (SV1)
│
├── REFRESH_TOKEN_IMPLEMENTATION.md    ✅ Hướng dẫn chung
├── HUONG_DAN_SINH_VIEN_3.md          ✅ Hướng dẫn SV3
└── REFRESH_TOKEN_HOATDONG1.md        ✅ File này
```

---

## 🧪 HƯỚNG DẪN TEST

### Test cho SV3 (Database)

```bash
cd backend

# Test đầy đủ (7 test cases)
node tests/testRefreshToken.js

# Test nhanh
node tests/quickTest.js
```

**Kết quả mong đợi:**
```
✅ Kết nối MongoDB thành công
✅ Tạo RefreshToken thành công
✅ Tìm thấy RefreshToken
✅ Token hợp lệ
✅ Revoke token thành công
✅ TẤT CẢ TEST HOÀN THÀNH THÀNH CÔNG! 🎉
```

### Test cho SV1 (Backend API)

Sau khi SV1 hoàn thành, test bằng Postman:

#### 1. Register/Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

**Response mong đợi:**
```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGci...",
  "refreshToken": "7f3e2a9b1c4d5e6f..."
}
```

#### 2. Refresh Token
```http
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "7f3e2a9b1c4d5e6f..."
}
```

**Response mong đợi:**
```json
{
  "accessToken": "eyJhbGci... (token mới)"
}
```

#### 3. Logout
```http
POST http://localhost:5000/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "7f3e2a9b1c4d5e6f..."
}
```

**Response mong đợi:**
```json
{
  "message": "Đã đăng xuất"
}
```

### Test cho SV2 (Frontend)

```bash
cd frontend
npm start
```

**Test flow:**
1. ✅ Đăng nhập → Mở DevTools → Application → LocalStorage
   - Kiểm tra có `accessToken` và `refreshToken`

2. ✅ Đợi token hết hạn (hoặc set expire = 1m để test)
   - Gọi bất kỳ API nào
   - Tự động refresh và request tiếp tục

3. ✅ Logout
   - Token bị xóa khỏi localStorage
   - Token bị revoke trong database

---

## 🔄 LUỒNG HOẠT ĐỘNG

### 1. Login Flow
```
User Login
    ↓
Server tạo accessToken (15m) + refreshToken (7d)
    ↓
Lưu refreshToken vào MongoDB
    ↓
Trả về cả 2 token cho Frontend
    ↓
Frontend lưu vào localStorage
```

### 2. API Request Flow
```
Frontend gọi API với accessToken
    ↓
Backend verify accessToken
    ↓
├─ OK → Trả về data
│
└─ 401 (Token hết hạn)
       ↓
   Frontend tự động gọi /auth/refresh
       ↓
   Backend verify refreshToken
       ↓
   ├─ OK → Trả về accessToken mới
   │       ↓
   │   Frontend retry request ban đầu
   │
   └─ 401 → Logout → Redirect /login
```

### 3. Logout Flow
```
User Logout
    ↓
Frontend gọi /auth/logout với refreshToken
    ↓
Backend đánh dấu refreshToken.isRevoked = true
    ↓
Frontend xóa token khỏi localStorage
    ↓
Redirect về /login
```

---

## 📚 TÀI LIỆU THAM KHẢO

### Cho từng sinh viên:

| Sinh viên | File tài liệu |
|-----------|---------------|
| **SV1** | `REFRESH_TOKEN_IMPLEMENTATION.md` - Phần "SV1: Cập nhật UserController" |
| **SV2** | `REFRESH_TOKEN_IMPLEMENTATION.md` - Phần "SV2: Frontend" |
| **SV3** | `HUONG_DAN_SINH_VIEN_3.md` |

### Files đã tạo sẵn:

✅ **Frontend (SV2)**
- `frontend/src/contexts/AuthContext.jsx` (đã cập nhật)
- `frontend/src/services/api.js` (đã cập nhật)
- `frontend/src/components/auth/LoginForm.jsx` (đã cập nhật)

✅ **Backend Model (SV3)**
- `backend/models/refreshTokenModel.js` (mới)
- `backend/tests/testRefreshToken.js` (mới)
- `backend/tests/quickTest.js` (mới)

⏳ **Backend API (SV1)** - Cần làm
- Xem code mẫu trong `REFRESH_TOKEN_IMPLEMENTATION.md`

---

## 🎓 KIẾN THỨC CẦN NẮM

### Access Token vs Refresh Token

| Đặc điểm | Access Token | Refresh Token |
|----------|--------------|---------------|
| **Thời gian sống** | Ngắn (15m) | Dài (7 ngày) |
| **Dùng để** | Xác thực API requests | Lấy access token mới |
| **Lưu ở đâu** | localStorage | localStorage + Database |
| **Có thể revoke?** | Không | Có (database) |
| **Gửi kèm request?** | Mọi request | Chỉ khi refresh |

### Tại sao cần 2 token?

1. **Bảo mật**: Access token ngắn → giảm thiểu rủi ro nếu bị đánh cắp
2. **UX tốt**: Refresh token dài → user không phải login lại liên tục
3. **Kiểm soát**: Có thể revoke refresh token khi cần (logout, suspicious activity)

### TTL Index là gì?

```javascript
// MongoDB tự động xóa document khi expiresAt < now
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

MongoDB chạy background task mỗi 60s để cleanup.

---

## ✅ CHECKLIST TỔNG QUAN

### SV3 (Database) - ✅ 100%
- [x] Tạo RefreshToken Model
- [x] Thêm indexes (TTL, compound)
- [x] Thêm methods (revoke, findValidToken)
- [x] Tạo file test
- [x] Test create, find, revoke
- [x] Tạo tài liệu hướng dẫn

### SV2 (Frontend) - ✅ 100%
- [x] Cập nhật AuthContext
- [x] Thêm auto-refresh interceptor
- [x] Cập nhật LoginForm
- [x] Hỗ trợ backward compatibility
- [x] Queue management

### SV1 (Backend API) - ⏳ 0%
- [ ] Import RefreshToken model
- [ ] Tạo signAccessToken() (15m)
- [ ] Tạo generateRefreshToken() (7d)
- [ ] Cập nhật loginUser() trả 2 token
- [ ] Cập nhật registerUser() trả 2 token
- [ ] Tạo refreshAccessToken() API
- [ ] Cập nhật logout() revoke token
- [ ] Thêm routes /auth/refresh, /auth/logout
- [ ] Test với Postman

---

## 🚀 BƯỚC TIẾP THEO

### Cho SV1:
1. Đọc `REFRESH_TOKEN_IMPLEMENTATION.md`
2. Import RefreshToken model
3. Copy code mẫu vào controller
4. Cập nhật routes
5. Test với Postman
6. Tích hợp với Frontend

### Cho SV2 & SV3:
✅ **Đã hoàn thành!** Có thể:
- Review code
- Test lại các tính năng
- Chuẩn bị demo
- Hỗ trợ SV1 nếu cần

---

## 📞 HỖ TRỢ & DEBUG

### Lỗi thường gặp:

**1. MongoDB connection error**
```bash
# Kiểm tra MongoDB đang chạy
# Windows: services.msc → MongoDB
# Mac/Linux: sudo systemctl status mongod
```

**2. Token không tự động refresh**
- Kiểm tra backend đã có API `/auth/refresh`
- Kiểm tra interceptor trong `api.js`
- Mở DevTools → Network → Xem request

**3. Lỗi 401 liên tục**
- Kiểm tra accessToken có trong localStorage
- Kiểm tra backend verify token đúng
- Kiểm tra JWT_SECRET trong `.env`

---

## 🎉 KẾT LUẬN

**Tiến độ hiện tại: 66% (2/3 hoàn thành)**

- ✅ SV2: Frontend hoàn thành
- ✅ SV3: Database hoàn thành
- ⏳ SV1: Backend API đang chờ

**Khi SV1 hoàn thành → Hệ thống sẽ có:**
- ✅ Cơ chế Refresh Token hoàn chỉnh
- ✅ Session management an toàn
- ✅ Auto-refresh khi token hết hạn
- ✅ Revoke token khi logout
- ✅ Hỗ trợ multiple devices

**Chúc các bạn thành công!** 🚀

---

**Last Updated:** $(date)
**Version:** 1.0
**Contributors:** SV1, SV2, SV3

