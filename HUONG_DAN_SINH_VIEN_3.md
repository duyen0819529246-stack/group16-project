# 📚 HƯỚNG DẪN CHO SINH VIÊN 3 (SV3)

## 🎯 Nhiệm vụ
**Tạo schema RefreshToken, test lưu/truy xuất**

---

## ✅ ĐÃ HOÀN THÀNH

Tôi đã tạo sẵn các file sau cho bạn:

### 1. **RefreshToken Model** 
📁 `backend/models/refreshTokenModel.js`

### 2. **Test Script**
📁 `backend/tests/testRefreshToken.js`

---

## 📖 HƯỚNG DẪN SỬ DỤNG

### Bước 1: Kiểm tra file RefreshToken Model

Mở file `backend/models/refreshTokenModel.js` và xem qua cấu trúc:

```javascript
// Schema bao gồm các field:
- token          // String, unique - Refresh token
- userId         // ObjectId - Liên kết với User
- expiresAt      // Date - Thời gian hết hạn
- isRevoked      // Boolean - Đã thu hồi chưa
- deviceInfo     // String - Thông tin thiết bị
- ipAddress      // String - Địa chỉ IP
- timestamps     // createdAt, updatedAt (tự động)
```

**Các tính năng đặc biệt:**

✨ **TTL Index** - MongoDB tự động xóa token hết hạn
✨ **Virtual field** `isValid` - Kiểm tra token còn hiệu lực
✨ **Methods:**
  - `revoke()` - Thu hồi token
  
✨ **Static Methods:**
  - `findValidToken(tokenString)` - Tìm token hợp lệ
  - `revokeAllUserTokens(userId)` - Thu hồi tất cả token của user
  - `cleanupExpiredTokens()` - Dọn dẹp token hết hạn

---

### Bước 2: Chạy Test

#### 2.1. Đảm bảo MongoDB đang chạy

Kiểm tra file `.env` có config đúng:
```env
MONGO_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_secret_key
```

#### 2.2. Chạy file test

Mở terminal trong thư mục `backend`:

```bash
cd backend
node tests/testRefreshToken.js
```

#### 2.3. Kết quả mong đợi

Bạn sẽ thấy output như sau:

```
============================================================
   🧪 TEST REFRESH TOKEN MODEL - SINH VIÊN 3
============================================================

✓ Kết nối MongoDB thành công
✓ Tạo test user: test@refreshtoken.com

▶ TEST: 1. Tạo và lưu RefreshToken
✓ Tạo RefreshToken thành công
ℹ   - Token ID: 6abc...
ℹ   - Token: 7f3e2a9b1c4d5e...
ℹ   - User ID: 6xyz...
ℹ   - Expires At: ...
ℹ   - Is Revoked: false

▶ TEST: 2. Truy xuất RefreshToken theo token string
✓ Tìm thấy RefreshToken
...

▶ TEST: 7. Test token đã hết hạn
✓ Tạo expired token thành công
✓ findValidToken đúng cách bỏ qua token hết hạn

▶ TEST: Cleanup - Xóa dữ liệu test
✓ Xóa dữ liệu test thành công

============================================================
✓ TẤT CẢ TEST HOÀN THÀNH THÀNH CÔNG! 🎉
============================================================
```

---

## 📝 CÁC TEST CASE

File test bao gồm 7 test cases:

| Test | Mô tả | Mục đích |
|------|-------|----------|
| **Test 1** | Tạo và lưu RefreshToken | Kiểm tra create token |
| **Test 2** | Tìm token theo string | Kiểm tra query cơ bản |
| **Test 3** | Sử dụng findValidToken | Kiểm tra static method |
| **Test 4** | Revoke token | Kiểm tra thu hồi token |
| **Test 5** | Tạo nhiều token cho 1 user | Kiểm tra multiple tokens |
| **Test 6** | Revoke tất cả token của user | Kiểm tra batch revoke |
| **Test 7** | Test token hết hạn | Kiểm tra validation |

---

## 🧪 TEST THỦ CÔNG (OPTIONAL)

Nếu muốn test thủ công, bạn có thể dùng MongoDB Compass hoặc code:

### Tạo token mới

```javascript
import RefreshToken from "./models/refreshTokenModel.js";
import crypto from "crypto";

const token = crypto.randomBytes(64).toString("hex");
const refreshToken = await RefreshToken.create({
  token,
  userId: "user_id_here",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
  deviceInfo: "Chrome on Windows",
  ipAddress: "192.168.1.1"
});

console.log("Token created:", refreshToken);
```

### Tìm token hợp lệ

```javascript
const found = await RefreshToken.findValidToken("token_string_here");
console.log("Found:", found);
```

### Revoke token

```javascript
const token = await RefreshToken.findById("token_id");
await token.revoke();
console.log("Token revoked");
```

### Revoke tất cả token của user

```javascript
await RefreshToken.revokeAllUserTokens("user_id");
console.log("All user tokens revoked");
```

---

## 🔍 KIỂM TRA DATABASE

Sau khi chạy test, bạn có thể kiểm tra MongoDB:

### Sử dụng MongoDB Compass

1. Kết nối tới database
2. Mở collection `refreshtokens`
3. Xem các document đã tạo

### Sử dụng MongoDB Shell

```bash
mongosh
use your_database
db.refreshtokens.find().pretty()
```

### Kiểm tra Index

```javascript
db.refreshtokens.getIndexes()
```

Bạn sẽ thấy các index:
- `token_1` (unique)
- `userId_1`
- `expiresAt_1` (TTL)
- `isRevoked_1`
- `userId_1_isRevoked_1` (compound)

---

## 📊 SCHEMA DETAILS

### Fields

```javascript
{
  token: String,        // Unique refresh token
  userId: ObjectId,     // Reference to User
  expiresAt: Date,      // Expiration date
  isRevoked: Boolean,   // Is token revoked?
  deviceInfo: String,   // Device information (optional)
  ipAddress: String,    // IP address (optional)
  createdAt: Date,      // Auto-generated
  updatedAt: Date       // Auto-generated
}
```

### Indexes

```javascript
// Single indexes
{ token: 1 } unique
{ userId: 1 }
{ expiresAt: 1 } TTL
{ isRevoked: 1 }

// Compound index
{ userId: 1, isRevoked: 1 }
```

### Methods

```javascript
// Instance method
refreshToken.revoke()  // Revoke this token

// Static methods
RefreshToken.findValidToken(tokenString)
RefreshToken.revokeAllUserTokens(userId)
RefreshToken.cleanupExpiredTokens()
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. TTL Index
MongoDB sẽ **TỰ ĐỘNG XÓA** các document đã hết hạn. Không cần viết code cleanup thủ công.

```javascript
// TTL index này sẽ xóa document khi expiresAt < now
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### 2. Populate User
Khi dùng `findValidToken`, user info sẽ được tự động populate (trừ password).

```javascript
const token = await RefreshToken.findValidToken("token_string");
console.log(token.userId.name);   // "John Doe"
console.log(token.userId.email);  // "john@example.com"
```

### 3. Virtual Field
`isValid` là virtual field, không được lưu trong database:

```javascript
const token = await RefreshToken.findById(id);
console.log(token.isValid); // true/false
```

### 4. Revoke vs Delete
- **Revoke**: Đánh dấu `isRevoked = true` (giữ lại trong DB để audit)
- **Delete**: Xóa hẳn khỏi DB

Nên dùng **Revoke** để có thể theo dõi lịch sử.

---

## 🚀 TÍCH HỢP VỚI CONTROLLER (CHO SV1)

Model này sẽ được SV1 sử dụng trong controller:

```javascript
// SV1 sẽ dùng như sau:
import RefreshToken from "../models/refreshTokenModel.js";

// Tạo refresh token khi login
const token = crypto.randomBytes(64).toString("hex");
await RefreshToken.create({
  token,
  userId: user._id,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

// Verify refresh token
const validToken = await RefreshToken.findValidToken(tokenString);
if (!validToken) {
  return res.status(401).json({ message: "Invalid token" });
}

// Revoke khi logout
await RefreshToken.revokeAllUserTokens(user._id);
```

---

## 📋 CHECKLIST HOÀN THÀNH

- [x] Tạo RefreshToken Model
- [x] Thêm indexes (single + compound)
- [x] Thêm TTL index cho auto cleanup
- [x] Thêm instance method `revoke()`
- [x] Thêm static method `findValidToken()`
- [x] Thêm static method `revokeAllUserTokens()`
- [x] Thêm virtual field `isValid`
- [x] Tạo file test
- [x] Test tạo token
- [x] Test truy xuất token
- [x] Test revoke token
- [x] Test multiple tokens
- [x] Test expired token

---

## 🎓 KIẾN THỨC BỔ SUNG

### 1. Tại sao cần Refresh Token?

- **Access Token ngắn** (15m): Giảm rủi ro nếu bị đánh cắp
- **Refresh Token dài** (7d): Người dùng không phải login liên tục
- **Revoke**: Có thể thu hồi token khi cần (logout, suspicious activity)

### 2. TTL Index là gì?

TTL (Time To Live) Index tự động xóa document sau khi hết hạn:

```javascript
// Document sẽ bị xóa khi: expiresAt < currentTime
{ expiresAt: 1 }, { expireAfterSeconds: 0 }
```

MongoDB chạy background task mỗi 60 giây để cleanup.

### 3. Compound Index

Index kết hợp nhiều field để tối ưu query:

```javascript
// Tối ưu cho query:
db.refreshtokens.find({ userId: "xxx", isRevoked: false })
```

### 4. Mongoose Virtual

Virtual field không được lưu trong DB, chỉ tính toán runtime:

```javascript
refreshTokenSchema.virtual("isValid").get(function () {
  return !this.isRevoked && this.expiresAt > new Date();
});
```

---

## 🆘 TROUBLESHOOTING

### Lỗi: Cannot find module

```bash
# Đảm bảo đang ở thư mục backend
cd backend
node tests/testRefreshToken.js
```

### Lỗi: MongoDB connection failed

```bash
# Kiểm tra MongoDB đang chạy
# Windows: services.msc -> MongoDB
# Mac/Linux: sudo systemctl status mongod
```

### Lỗi: Duplicate key error

```bash
# Xóa collection cũ
mongosh
use your_database
db.refreshtokens.drop()
# Chạy lại test
```

---

## ✅ KẾT LUẬN

Bạn đã hoàn thành:

1. ✅ **Tạo RefreshToken Model** với đầy đủ tính năng
2. ✅ **Test lưu/truy xuất** qua 7 test cases
3. ✅ **Hiểu cách hoạt động** của Refresh Token

**Model này sẵn sàng để SV1 tích hợp vào API!** 🎉

---

## 📞 HỖ TRỢ

Nếu có vấn đề:
1. Kiểm tra MongoDB đang chạy
2. Kiểm tra file `.env` có đúng config
3. Xem log output của test
4. Kiểm tra database bằng MongoDB Compass

**Chúc bạn thành công!** 🚀

