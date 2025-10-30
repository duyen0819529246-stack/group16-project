# 🧪 HƯỚNG DẪN TEST BACKEND - SINH VIÊN 1

## ✅ ĐÃ CẬP NHẬT

Tất cả code cho SV1 đã được cập nhật tự động:

### Files đã cập nhật:
1. ✅ `backend/controllers/userController.js`
   - Import RefreshToken model
   - Thêm `signAccessToken()` (15 phút)
   - Thêm `generateRefreshToken()` (7 ngày)
   - Cập nhật `loginUser()` trả về 2 token
   - Cập nhật `registerUser()` trả về 2 token
   - Cập nhật `logout()` để revoke token
   - Thêm `refreshAccessToken()` API mới

2. ✅ `backend/routes/authRoutes.js`
   - Thêm route `POST /auth/refresh`
   - Thêm route `POST /auth/logout`
   - Import các function mới

3. ✅ `backend/server.js`
   - Thêm import authRoutes
   - Thêm route `/api/auth`

---

## 🚀 CÁCH CHẠY TEST

### Bước 1: Khởi động Backend

```bash
cd backend
npm start
```

**Kết quả mong đợi:**
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

---

## 📮 TEST VỚI POSTMAN (hoặc Thunder Client)

### Test 1: REGISTER - Đăng ký tài khoản mới

**Request:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "123456"
}
```

**Response mong đợi:**
```json
{
  "message": "Đăng ký thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "7f3e2a9b1c4d5e6f8a0b1c2d3e4f5a6b...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Kiểm tra:**
- Response có 3 token (accessToken, refreshToken, token)
- accessToken và token giống nhau (backward compatibility)
- refreshToken là string dài (128 ký tự)

---

### Test 2: LOGIN - Đăng nhập

**Request:**
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
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Lưu lại:**
- Copy `accessToken` để dùng cho các test tiếp theo
- Copy `refreshToken` để test refresh API

---

### Test 3: GET PROFILE - Lấy thông tin user

**Request:**
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <accessToken_từ_login>
```

**Response mong đợi:**
```json
{
  "id": "6abc123...",
  "name": "Admin",
  "email": "admin@gmail.com",
  "role": "admin",
  "avatar": ""
}
```

✅ **Kiểm tra:**
- Access token hoạt động đúng
- Middleware protect hoạt động

---

### Test 4: REFRESH TOKEN - Lấy Access Token mới ⭐

**Request:**
```http
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken_từ_login>"
}
```

**Response mong đợi:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (token mới)"
}
```

✅ **Kiểm tra:**
- Nhận được accessToken mới
- Token mới khác với token cũ
- Có thể dùng token mới để gọi API

**Test token mới:**
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <accessToken_mới>
```

Phải thành công!

---

### Test 5: LOGOUT - Đăng xuất và revoke token ⭐

**Request:**
```http
POST http://localhost:5000/api/auth/logout
Content-Type: application/json

{
  "refreshToken": "<refreshToken_đã_dùng>"
}
```

**Response mong đợi:**
```json
{
  "message": "Đã đăng xuất"
}
```

✅ **Kiểm tra token đã bị revoke:**

Thử gọi lại `/auth/refresh` với cùng refreshToken:

```http
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refreshToken_đã_logout>"
}
```

**Phải nhận lỗi:**
```json
{
  "message": "Refresh token không hợp lệ hoặc đã hết hạn"
}
```

---

### Test 6: KIỂM TRA DATABASE

Dùng MongoDB Compass hoặc mongosh:

```bash
mongosh
use your_database
db.refreshtokens.find().pretty()
```

**Kết quả mong đợi:**

```javascript
{
  _id: ObjectId("..."),
  token: "a1b2c3d4e5f6...",
  userId: ObjectId("..."),
  expiresAt: ISODate("2025-11-05T..."),
  isRevoked: false,  // hoặc true nếu đã logout
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 🎯 TEST CASE CHI TIẾT

### Test Case 1: Token Hết Hạn (Expired Token)

**Mục đích:** Test access token tự động hết hạn sau 15 phút

**Cách test:**

1. Tạm thời sửa expire time trong `userController.js`:
```javascript
const signAccessToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "10s" }  // Đổi thành 10 giây để test
  );
```

2. Login và lấy accessToken
3. Đợi 15 giây
4. Gọi `/auth/profile` với token cũ
5. Phải nhận lỗi 401

**Response mong đợi:**
```json
{
  "message": "Token không hợp lệ hoặc hết hạn."
}
```

6. Gọi `/auth/refresh` để lấy token mới
7. Dùng token mới → Thành công

**⚠️ Nhớ đổi lại `expiresIn: "15m"` sau khi test!**

---

### Test Case 2: Refresh Token Đã Revoke

**Mục đích:** Token đã logout không thể dùng lại

1. Login → Lấy refreshToken
2. Logout với refreshToken đó
3. Thử refresh lại → Phải bị từ chối

---

### Test Case 3: Refresh Token Hết Hạn

**Mục đích:** Refresh token hết hạn sau 7 ngày

**Cách test:** (Tùy chọn - cần sửa code tạm thời)

Sửa tạm trong `userController.js`:
```javascript
const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 1000); // 10 giây
  // ... rest of code
};
```

1. Login
2. Đợi 15 giây
3. Gọi `/auth/refresh` → Phải bị từ chối

---

### Test Case 4: Invalid Refresh Token

**Request:**
```http
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "invalid_token_123"
}
```

**Response mong đợi:**
```json
{
  "message": "Refresh token không hợp lệ hoặc đã hết hạn"
}
```

---

### Test Case 5: Không Gửi Refresh Token

**Request:**
```http
POST http://localhost:5000/api/auth/refresh
Content-Type: application/json

{
}
```

**Response mong đợi:**
```json
{
  "message": "Không có refresh token"
}
```

---

## 📊 CHECKLIST TEST

- [ ] Register trả về 2 token
- [ ] Login trả về 2 token  
- [ ] Access token hoạt động với protected routes
- [ ] Refresh token lấy được access token mới
- [ ] Logout revoke refresh token
- [ ] Token đã revoke không thể dùng lại
- [ ] Invalid refresh token bị từ chối
- [ ] RefreshToken được lưu vào database
- [ ] Kiểm tra TTL index hoạt động (optional)

---

## 🔍 KIỂM TRA TRONG CODE

### 1. Kiểm tra RefreshToken trong Database

```javascript
// Thêm vào cuối hàm generateRefreshToken() để debug
console.log("✅ RefreshToken created:", {
  userId,
  token: token.substring(0, 20) + "...",
  expiresAt
});
```

### 2. Kiểm tra Revoke hoạt động

```javascript
// Thêm vào hàm logout() để debug
console.log("✅ Revoked token:", refreshToken.substring(0, 20));
```

---

## 🆘 TROUBLESHOOTING

### Lỗi: "Cannot find module RefreshToken"

**Nguyên nhân:** Chưa tạo RefreshToken model

**Giải pháp:** Kiểm tra file `backend/models/refreshTokenModel.js` có tồn tại

---

### Lỗi: "accessToken is not defined"

**Nguyên nhân:** Lỗi typo trong code

**Giải pháp:** Kiểm tra lại code trong `userController.js`

---

### Lỗi: "Cannot POST /api/auth/refresh"

**Nguyên nhân:** Route chưa được đăng ký

**Giải pháp:** Kiểm tra:
1. `authRoutes.js` có export `refreshAccessToken`
2. `server.js` có `app.use("/api/auth", authRoutes)`

---

### Refresh Token không được lưu vào DB

**Kiểm tra:**
```bash
mongosh
use your_database
db.refreshtokens.find()
```

Nếu empty → Kiểm tra hàm `generateRefreshToken()` có được gọi không

---

## 📈 PERFORMANCE TEST (Optional)

### Test Multiple Tokens

Tạo nhiều refresh token cho cùng 1 user:

1. Login 3 lần → 3 refresh tokens
2. Kiểm tra database có 3 tokens
3. Logout 1 token → Kiểm tra chỉ token đó bị revoke
4. 2 token còn lại vẫn hoạt động

---

## 🎓 KIẾN THỨC BỔ SUNG

### Tại sao Access Token ngắn?

- Giảm thiểu rủi ro nếu token bị đánh cắp
- Hacker chỉ dùng được 15 phút
- Sau đó token tự động hết hạn

### Tại sao Refresh Token dài?

- User không phải login lại liên tục
- Trải nghiệm người dùng tốt hơn
- Vẫn có thể revoke khi cần (logout, suspicious activity)

### Luồng hoạt động:

```
Login → accessToken (15m) + refreshToken (7d)
       ↓
API Request với accessToken
       ↓
Token hết hạn (401)
       ↓
Frontend tự động gọi /auth/refresh
       ↓
Nhận accessToken mới
       ↓
Retry request ban đầu
```

---

## ✅ KẾT LUẬN

Sau khi test xong tất cả:

1. ✅ Backend API hoạt động đúng
2. ✅ Refresh token được lưu vào database
3. ✅ Revoke token khi logout
4. ✅ Auto-refresh hoạt động (khi tích hợp Frontend)

**HOÀN THÀNH 100% PHẦN SINH VIÊN 1!** 🎉

---

## 📞 HỖ TRỢ

Nếu có lỗi:
1. Kiểm tra MongoDB đang chạy
2. Kiểm tra `.env` có JWT_SECRET và MONGO_URI
3. Xem log trong terminal
4. Kiểm tra response status code

**Chúc bạn test thành công!** 🚀

