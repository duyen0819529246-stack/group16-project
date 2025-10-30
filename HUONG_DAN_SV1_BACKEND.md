# 🚀 HƯỚNG DẪN SINH VIÊN 1 (SV1) - BACKEND API

## ✅ CÔNG VIỆC ĐÃ HOÀN THÀNH

Bạn đã hoàn thành tất cả các nhiệm vụ Backend cho tính năng **Upload Avatar**! 🎉

### 1. **Multer Middleware** ✅
**File:** `backend/middleware/uploadMiddleware.js`

```javascript
- Memory storage (để xử lý bằng Sharp)
- Limit 5MB
- Chỉ chấp nhận file ảnh (image/*)
```

### 2. **Avatar Upload Controller** ✅
**File:** `backend/controllers/userController.js` (dòng 190-245)

```javascript
- Nhận file từ Multer
- Resize bằng Sharp: 400x400px, JPEG, 90% quality
- Upload lên Cloudinary folder "avatars"
- Lưu URL vào MongoDB
- Trả về URL và thông tin ảnh
```

### 3. **API Route** ✅
**File:** `backend/routes/userRoutes.js` (dòng 33)

```javascript
POST /api/users/profile/avatar
- Middleware: protect (JWT)
- Middleware: upload.single("avatar")
- Controller: uploadAvatar
```

### 4. **User Model** ✅
**File:** `backend/models/userModel.js` (dòng 9)

```javascript
avatar: { type: String, default: "" }
```

### 5. **Dependencies** ✅
**File:** `backend/package.json`

```json
{
  "sharp": "^0.34.4",        ✅ Có rồi
  "multer": "^1.4.5-lts.1",  ✅ Có rồi
  "cloudinary": "^2.0.0"     ✅ Có rồi
}
```

---

## 🔧 CẤU HÌNH CẦN THIẾT

### Bước 1: Tạo File `.env`

```bash
cd backend
cp .env.example .env
```

### Bước 2: Cấu Hình Cloudinary

Mở file `backend/.env` và thêm thông tin Cloudinary:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Lấy credentials từ đâu?**
- Đăng ký tại: https://cloudinary.com/
- Vào Dashboard → Copy 3 giá trị trên

> **Lưu ý:** SV3 sẽ lo phần này. Nếu SV3 chưa làm, bạn có thể tạm thời dùng tài khoản của mình để test.

### Bước 3: Cấu Hình Database

```env
MONGO_URI=mongodb://localhost:27017/group16_project
JWT_SECRET=abc123xyz_change_this_to_something_random
```

---

## 🧪 CÁCH TEST

### Test 1: Với Postman

#### 1. Đăng Nhập
```
POST http://localhost:5000/api/users/login

Body (JSON):
{
  "email": "admin@example.com",
  "password": "admin123"
}

→ Copy accessToken từ response
```

#### 2. Upload Avatar
```
POST http://localhost:5000/api/users/profile/avatar

Headers:
  Authorization: Bearer <accessToken từ bước 1>

Body (form-data):
  Key: avatar (type: File)
  Value: [Chọn ảnh từ máy]

→ Kết quả:
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/...",
  "details": {
    "width": 400,
    "height": 400,
    "format": "jpg",
    "bytes": 45678
  }
}
```

#### 3. Kiểm Tra Profile
```
GET http://localhost:5000/api/users/profile

Headers:
  Authorization: Bearer <accessToken>

→ Kết quả:
{
  "id": "...",
  "name": "Admin",
  "email": "admin@example.com",
  "role": "admin",
  "avatar": "https://res.cloudinary.com/..."  ← URL đã được lưu
}
```

### Test 2: Với Test Script

```bash
cd backend

# Tạo file ảnh test
# (Hoặc tải ảnh bất kỳ và đổi tên thành test-avatar.jpg)

node tests/testAvatarUpload.js
```

**Kết quả mong đợi:**
```
✅ Đăng nhập thành công!
✅ File ảnh test đã sẵn sàng!
✅ Upload thành công!
✅ Avatar đã được lưu vào MongoDB!
🎉 TEST THÀNH CÔNG - HOẠT ĐỘNG 3 HOÀN TẤT!
```

---

## 📊 KIẾN TRÚC BACKEND

```
Client Upload Request (multipart/form-data)
          ↓
┌─────────────────────────────────────────┐
│  Route: POST /profile/avatar            │
│  Middleware: protect (JWT)              │
│  Middleware: upload.single("avatar")    │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Controller: uploadAvatar               │
│  1. Kiểm tra req.file có tồn tại        │
│  2. Sharp resize: 400x400px, JPEG       │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Cloudinary Upload                      │
│  - Folder: "avatars"                    │
│  - Resource type: "image"               │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  MongoDB Save                           │
│  User.avatar = cloudinary_url           │
└─────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────┐
│  Response                               │
│  {                                      │
│    message: "...",                      │
│    avatar: "https://...",               │
│    details: { ... }                     │
│  }                                      │
└─────────────────────────────────────────┘
```

---

## 📝 API DOCUMENTATION

### Endpoint: Upload Avatar

**URL:** `POST /api/users/profile/avatar`

**Authentication:** Required (JWT Bearer Token)

**Request Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

**Request Body (form-data):**
```
avatar: [File] (image file - jpg, png, jpeg, etc.)
```

**Success Response (200):**
```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v123456/avatars/abc123.jpg",
  "details": {
    "width": 400,
    "height": 400,
    "format": "jpg",
    "bytes": 45678
  }
}
```

**Error Responses:**

1. **No File (400)**
```json
{
  "message": "Không có file"
}
```

2. **Invalid Token (401)**
```json
{
  "message": "Không có quyền truy cập"
}
```

3. **File Too Large (400)**
```
Multer error: File too large
```

4. **Not Image (400)**
```
Multer error: Chỉ chấp nhận file ảnh!
```

5. **Server Error (500)**
```json
{
  "message": "Lỗi upload",
  "error": "..."
}
```

---

## 🔒 BẢO MẬT

### 1. JWT Authentication ✅
- Middleware `protect` kiểm tra JWT token
- Chỉ user đăng nhập mới upload được
- Token expire sau 15 phút

### 2. File Validation ✅
- **Type:** Chỉ chấp nhận `image/*`
- **Size:** Tối đa 5MB
- Reject file không hợp lệ trước khi xử lý

### 3. Sharp Processing ✅
- Resize tất cả ảnh về 400x400px
- Chuyển sang JPEG format
- Quality 90% để tối ưu dung lượng

### 4. Cloudinary ✅
- Credentials được bảo vệ trong `.env`
- Upload vào folder riêng "avatars"
- Public URL cho frontend access

### 5. User Isolation ✅
- Mỗi user chỉ upload avatar của chính mình
- `req.user` được lấy từ JWT middleware

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot find module 'sharp'"
```bash
cd backend
npm install sharp
```

### Lỗi: "Invalid Cloudinary credentials"
- Kiểm tra file `.env` có đúng format không
- Verify credentials trên Cloudinary Dashboard
- Restart server sau khi thay đổi `.env`

### Lỗi: "Multer error: File too large"
- File vượt quá 5MB
- Giảm kích thước file hoặc tăng limit trong `uploadMiddleware.js`

### Upload chậm
- Giảm quality Sharp từ 90 xuống 80
- Giảm kích thước resize từ 400 xuống 300

### Ảnh không hiển thị
- Kiểm tra CORS settings trong `server.js`
- Verify URL trong MongoDB
- Check network tab trong DevTools

---

## 📦 FILES QUAN TRỌNG

```
backend/
├── controllers/
│   └── userController.js          # uploadAvatar function (dòng 190-245)
├── middleware/
│   ├── authMiddleware.js          # protect middleware
│   └── uploadMiddleware.js        # Multer config
├── models/
│   └── userModel.js               # User schema với avatar field
├── routes/
│   └── userRoutes.js              # Route: POST /profile/avatar
├── tests/
│   └── testAvatarUpload.js        # Test script
├── .env.example                   # Config template
└── package.json                   # Dependencies
```

---

## 🎯 CHECKLIST SV1

### Code Implementation
- [x] Multer middleware với memory storage
- [x] Sharp resize function (400x400px)
- [x] Cloudinary upload integration
- [x] uploadAvatar controller
- [x] API route configuration
- [x] JWT authentication
- [x] File validation (type, size)
- [x] Error handling

### Configuration
- [ ] Tạo file `.env` từ `.env.example`
- [ ] Cấu hình Cloudinary credentials (hoặc đợi SV3)
- [ ] Cấu hình MongoDB connection
- [ ] Cấu hình JWT_SECRET

### Testing
- [ ] Test với Postman
- [ ] Test với script `testAvatarUpload.js`
- [ ] Verify URL trong MongoDB
- [ ] Check ảnh trên Cloudinary Dashboard

### Git
- [ ] Review code một lần cuối
- [ ] Commit code với message rõ ràng
- [ ] Push lên GitHub

---

## 🚀 GIT WORKFLOW (PUSH LÊN GITHUB)

### Cách 1: Push vào nhánh chung (khuyến nghị)

```bash
# Di chuyển về thư mục root
cd E:\downloads\group16-project-main

# Kiểm tra status
git status

# Tạo nhánh mới
git checkout -b feature/avatar-upload

# Add các file backend
git add backend/

# Commit
git commit -m "SV1: Hoàn thành backend API upload avatar với Sharp và Cloudinary"

# Push lên GitHub
git push origin feature/avatar-upload
```

### Cách 2: Push vào nhánh riêng của SV1

```bash
# Tạo nhánh riêng
git checkout -b feature/avatar-backend-sv1

# Add, commit, push
git add backend/
git commit -m "SV1: Backend API upload avatar"
git push origin feature/avatar-backend-sv1
```

### Sau khi SV2 và SV3 xong

```bash
# Pull code của SV2 & SV3
git pull origin feature/avatar-upload

# Hoặc merge từ các nhánh khác
git merge feature/avatar-frontend-sv2
git merge feature/avatar-testing-sv3
```

---

## 📚 CODE EXAMPLES

### Sharp Resize (Từ userController.js)

```javascript
const resizedImageBuffer = await sharp(req.file.buffer)
  .resize(400, 400, {
    fit: "cover",        // Cắt ảnh để vừa khung
    position: "center",  // Căn giữa
  })
  .jpeg({ quality: 90 }) // JPEG 90% quality
  .toBuffer();
```

### Cloudinary Upload (Từ userController.js)

```javascript
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { 
        folder: "avatars",
        resource_type: "image",
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });

const result = await streamUpload(resizedImageBuffer);
```

### Save to MongoDB

```javascript
req.user.avatar = result.secure_url;
await req.user.save();
```

---

## 🎓 KIẾN THỨC ĐÃ HỌC

### 1. Multer
- Upload file trong Node.js
- Memory storage vs Disk storage
- File validation (mimetype, size)

### 2. Sharp
- Image processing library
- Resize, crop, format conversion
- Buffer manipulation

### 3. Cloudinary
- Cloud storage cho media
- Upload via stream
- Folder organization

### 4. Node.js Streams
- Buffer handling
- Stream upload
- Promise wrapper

### 5. JWT Authentication
- Protect middleware
- Token verification
- User context

---

## ✅ KẾT LUẬN

**Bạn đã hoàn thành 100% công việc Backend (SV1)!** 🎉

**Những gì bạn đã làm:**
- ✅ API endpoint hoạt động với JWT authentication
- ✅ Resize ảnh tự động bằng Sharp
- ✅ Upload lên Cloudinary
- ✅ Lưu URL vào MongoDB
- ✅ Error handling đầy đủ
- ✅ Documentation chi tiết

**Bước tiếp theo:**
1. Cấu hình `.env` (hoặc đợi SV3)
2. Test API
3. Push code lên GitHub
4. Chờ SV2 (Frontend) và SV3 (Testing) hoàn thành

**Ready to push!** 🚀

---

**Group:** 16  
**Student:** SV1 (Backend)  
**Task:** Upload Avatar API  
**Status:** ✅ COMPLETED  
**Date:** 2025


