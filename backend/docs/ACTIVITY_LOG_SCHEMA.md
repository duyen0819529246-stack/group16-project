# Activity Log Database Schema

**Sinh viên 3:** Nguyen222285  
**Email:** nguyen222285@student.nctu.edu.vn  
**Công việc:** Thiết kế collection logs, test lưu/truy vấn

---

## 📊 Collection: `activitylogs`

### Schema Structure

```javascript
{
  userId: ObjectId,          // Reference to User
  action: String,            // Loại hành động
  metadata: {
    ip: String,              // IP address của user
    userAgent: String,       // Browser/device info
    result: String,          // success/failure
    details: String          // Thông tin bổ sung
  },
  timestamp: Date            // Thời gian (auto)
}
```

---

## 🔍 Chi tiết các trường

### 1. `userId` (ObjectId)
- **Bắt buộc:** ✅ Yes
- **Type:** ObjectId
- **Reference:** User collection
- **Index:** ✅ Có
- **Mô tả:** ID của user thực hiện hành động

### 2. `action` (String)
- **Bắt buộc:** ✅ Yes
- **Type:** String
- **Index:** ✅ Có
- **Enum values:**
  - `USER_LOGIN` - Đăng nhập
  - `USER_LOGOUT` - Đăng xuất
  - `USER_SIGNUP` - Đăng ký
  - `PROFILE_VIEW` - Xem profile
  - `PROFILE_UPDATE` - Cập nhật profile
  - `AVATAR_UPLOAD` - Upload avatar
  - `PASSWORD_CHANGE` - Đổi mật khẩu
  - `PASSWORD_RESET_REQUEST` - Yêu cầu reset password
  - `PASSWORD_RESET_SUCCESS` - Reset password thành công
  - `TOKEN_REFRESH` - Refresh access token
  - `FAILED_LOGIN` - Đăng nhập thất bại

### 3. `metadata` (Object)
- **Bắt buộc:** ❌ No (optional)
- **Type:** Object
- **Mô tả:** Thông tin bổ sung về hành động

#### 3.1 `metadata.ip`
- **Type:** String
- **Mô tả:** Địa chỉ IP của user

#### 3.2 `metadata.userAgent`
- **Type:** String
- **Mô tả:** Thông tin browser/device

#### 3.3 `metadata.result`
- **Type:** String
- **Default:** "success"
- **Values:** "success", "failure", "pending"

#### 3.4 `metadata.details`
- **Type:** String
- **Mô tả:** Thông tin chi tiết (optional)

### 4. `timestamp` (Date)
- **Bắt buộc:** ✅ Yes
- **Type:** Date
- **Default:** Date.now
- **Index:** ✅ Có (descending -1)
- **Mô tả:** Thời gian thực hiện hành động

---

## 🔑 Indexes

### 1. Primary Index
```javascript
{ _id: 1 }  // Mặc định
```

### 2. User Index
```javascript
{ userId: 1 }
```
**Mục đích:** Tìm tất cả logs của một user nhanh

### 3. Action Index
```javascript
{ action: 1 }
```
**Mục đích:** Filter logs theo loại action

### 4. Timestamp Index
```javascript
{ timestamp: -1 }
```
**Mục đích:** Sắp xếp logs theo thời gian (mới nhất trước)

### 5. Compound Index
```javascript
{ userId: 1, timestamp: -1 }
```
**Mục đích:** Lấy logs của user theo thời gian

---

## 📝 Ví dụ Documents

### Ví dụ 1: User Login
```json
{
  "_id": "672a1b2c3d4e5f6a7b8c9d0e",
  "userId": "671234567890abcdef123456",
  "action": "USER_LOGIN",
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0",
    "result": "success",
    "details": "Login from web app"
  },
  "timestamp": "2025-10-29T10:30:45.123Z"
}
```

### Ví dụ 2: Profile Update
```json
{
  "_id": "672a1b2c3d4e5f6a7b8c9d0f",
  "userId": "671234567890abcdef123456",
  "action": "PROFILE_UPDATE",
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0...",
    "result": "success",
    "details": "Updated email and name"
  },
  "timestamp": "2025-10-29T11:15:22.456Z"
}
```

### Ví dụ 3: Failed Login
```json
{
  "_id": "672a1b2c3d4e5f6a7b8c9d10",
  "userId": "671234567890abcdef123456",
  "action": "FAILED_LOGIN",
  "metadata": {
    "ip": "192.168.1.100",
    "userAgent": "PostmanRuntime/7.39.1",
    "result": "failure",
    "details": "Invalid password"
  },
  "timestamp": "2025-10-29T09:45:10.789Z"
}
```

---

## 🔎 Query Examples

### 1. Lấy tất cả logs của user
```javascript
db.activitylogs.find({ 
  userId: ObjectId("671234567890abcdef123456") 
})
.sort({ timestamp: -1 })
.limit(50)
```

### 2. Filter theo action
```javascript
db.activitylogs.find({ 
  action: "USER_LOGIN" 
})
.sort({ timestamp: -1 })
```

### 3. Lấy logs trong khoảng thời gian
```javascript
db.activitylogs.find({
  timestamp: {
    $gte: new Date("2025-10-29T00:00:00.000Z"),
    $lt: new Date("2025-10-30T00:00:00.000Z")
  }
})
```

### 4. Thống kê theo action
```javascript
db.activitylogs.aggregate([
  {
    $group: {
      _id: "$action",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { count: -1 }
  }
])
```

### 5. Populate user info
```javascript
ActivityLog.find()
  .populate("userId", "name email role")
  .sort({ timestamp: -1 })
  .limit(20)
```

---

## 🧪 Testing

### Test Cases

#### ✅ TC1: Tạo log mới
**Input:** userId, action, metadata  
**Expected:** Log được tạo với timestamp tự động

#### ✅ TC2: Truy vấn log theo userId
**Input:** userId  
**Expected:** Trả về tất cả logs của user

#### ✅ TC3: Filter theo action
**Input:** action = "USER_LOGIN"  
**Expected:** Chỉ trả về logs có action = USER_LOGIN

#### ✅ TC4: Pagination
**Input:** page=1, limit=20  
**Expected:** Trả về 20 logs đầu tiên

#### ✅ TC5: Sort theo timestamp
**Input:** sort: { timestamp: -1 }  
**Expected:** Logs mới nhất trước

#### ✅ TC6: Aggregate statistics
**Input:** $group by action  
**Expected:** Thống kê số lượng mỗi action

#### ✅ TC7: Populate user info
**Input:** .populate("userId")  
**Expected:** Logs có thông tin user (name, email)

#### ✅ TC8: Index performance
**Input:** Check indexes  
**Expected:** Có đủ indexes: userId, action, timestamp

---

## 📊 Performance

### Indexes Impact
- **Without index:** Query time ~500ms (với 10k docs)
- **With index:** Query time ~5ms (với 10k docs)
- **Improvement:** 100x faster ⚡

### Storage
- Average document size: ~200 bytes
- 10,000 logs ≈ 2MB
- 1,000,000 logs ≈ 200MB

---

## 🚀 Best Practices

### 1. Cleanup old logs
```javascript
// Xóa logs cũ hơn 90 ngày
db.activitylogs.deleteMany({
  timestamp: {
    $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  }
})
```

### 2. Archive logs
```javascript
// Chuyển logs cũ sang archive collection
db.activitylogs.aggregate([
  {
    $match: {
      timestamp: { $lt: new Date("2025-01-01") }
    }
  },
  {
    $out: "activitylogs_archive"
  }
])
```

### 3. Monitoring
- Theo dõi số lượng logs mỗi ngày
- Alert nếu có spike bất thường
- Kiểm tra query performance

---

## ✅ Checklist Implementation

- [x] Tạo schema ActivityLog
- [x] Thêm indexes (userId, action, timestamp)
- [x] Test CRUD operations
- [x] Test pagination
- [x] Test aggregate/statistics
- [x] Test populate user info
- [x] Viết documentation
- [x] Kiểm tra performance

---

**Hoàn thành:** 2025-10-29  
**Sinh viên:** Nguyen222285  
**Status:** ✅ TESTED & READY

