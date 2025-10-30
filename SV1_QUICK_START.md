# ⚡ QUICK START - SINH VIÊN 1 (Backend)

## ✅ TRẠ STATUS

**Code Backend: HOÀN THÀNH 100%** 🎉

Tất cả code đã sẵn sàng, chỉ cần:
1. Cấu hình `.env` 
2. Test API
3. Push lên GitHub

---

## 🚀 3 BƯỚC PUSH LÊN GITHUB

### Bước 1: Kiểm tra code

```bash
cd E:\downloads\group16-project-main

# Xem các file đã thay đổi
git status
```

### Bước 2: Tạo nhánh và commit

```bash
# Tạo nhánh mới
git checkout -b feature/avatar-upload

# Add các file backend
git add backend/
git add *.md

# Commit
git commit -m "SV1: Hoàn thành backend API upload avatar với Sharp và Cloudinary"
```

### Bước 3: Push

```bash
# Push lên GitHub
git push origin feature/avatar-upload
```

**XOng! Đã push thành công!** ✅

---

## 🧪 TEST TRƯỚC KHI PUSH (Optional)

### Với Postman:

1. **Login:**
```
POST http://localhost:5000/api/users/login
Body: {"email": "admin@example.com", "password": "admin123"}
→ Copy accessToken
```

2. **Upload Avatar:**
```
POST http://localhost:5000/api/users/profile/avatar
Headers: Authorization: Bearer <token>
Body (form-data): avatar = [chọn ảnh]
→ Nhận được URL Cloudinary
```

3. **Check Profile:**
```
GET http://localhost:5000/api/users/profile
Headers: Authorization: Bearer <token>
→ Thấy avatar URL đã được lưu
```

---

## 📋 CODE ĐÃ HOÀN THÀNH

### ✅ Files Backend

| File | Status | Mô tả |
|------|--------|-------|
| `backend/controllers/userController.js` | ✅ | uploadAvatar function (dòng 190-245) |
| `backend/middleware/uploadMiddleware.js` | ✅ | Multer config |
| `backend/routes/userRoutes.js` | ✅ | Route POST /profile/avatar |
| `backend/models/userModel.js` | ✅ | User schema với avatar field |
| `backend/tests/testAvatarUpload.js` | ✅ | Test script |
| `backend/package.json` | ✅ | Dependencies (sharp, multer, cloudinary) |

### ✅ Features Đã Triển Khai

- [x] Multer middleware (memory storage)
- [x] Sharp resize (400x400px, JPEG, 90%)
- [x] Cloudinary upload (folder: avatars)
- [x] JWT authentication
- [x] File validation (type, size)
- [x] Error handling
- [x] MongoDB save URL
- [x] API endpoint `/api/users/profile/avatar`

---

## 📝 API ENDPOINT

```
POST /api/users/profile/avatar

Headers:
  Authorization: Bearer <accessToken>
  Content-Type: multipart/form-data

Body (form-data):
  avatar: [image file]

Response:
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

---

## 🔧 CẤU HÌNH (Nếu muốn test)

### Tạo file `.env`

```bash
cd backend
```

Tạo file `.env` với nội dung:

```env
# Database
MONGO_URI=mongodb://localhost:27017/group16_project
JWT_SECRET=your_secret_key

# Cloudinary (lấy từ https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Lưu ý:** SV3 sẽ lo phần Cloudinary config. Bạn có thể đợi SV3 hoặc tự tạo account để test.

---

## 📚 DOCUMENTATION

Chi tiết xem:
- **HUONG_DAN_SV1_BACKEND.md** - Hướng dẫn đầy đủ
- **GIT_COMMANDS_SV1.md** - Git commands chi tiết
- **HOATDONG3_AVATAR_UPLOAD.md** - Tổng quan dự án

---

## 🎯 NHIỆM VỤ TIẾP THEO

### Cho SV1 (Bạn):
1. ✅ Code backend - **XONG**
2. [ ] Push lên GitHub - **LÀM NGAY**
3. [ ] Test với Postman (optional)
4. [ ] Báo team đã push xong

### Cho SV2 (Frontend):
- Làm UI upload avatar
- Tích hợp với API của bạn

### Cho SV3 (Testing):
- Setup Cloudinary
- Test và viết docs

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **KHÔNG commit file `.env`** (đã có trong .gitignore)
2. **Push vào nhánh `feature/avatar-upload`** (không phải main)
3. **Pull trước khi push** nếu có người khác đã push
4. **Commit message rõ ràng**

---

## 🔄 WORKFLOW 3 SINH VIÊN (1 NHÁNH)

```bash
# SV1 (Backend) - BẠN
git checkout -b feature/avatar-upload
git add backend/
git commit -m "SV1: Backend API"
git push origin feature/avatar-upload
✅ XONG → Báo SV2

# SV2 (Frontend)
git checkout feature/avatar-upload
git pull origin feature/avatar-upload
# ... code frontend ...
git add frontend/
git commit -m "SV2: Frontend UI"
git push origin feature/avatar-upload
✅ XONG → Báo SV3

# SV3 (Testing)
git checkout feature/avatar-upload
git pull origin feature/avatar-upload
# ... test ...
git add .
git commit -m "SV3: Testing & Docs"
git push origin feature/avatar-upload
✅ XONG → Tạo Pull Request
```

---

## 🎉 KẾT LUẬN

**Bạn đã hoàn thành:**
- ✅ Backend API với Multer + Sharp + Cloudinary
- ✅ JWT authentication
- ✅ File validation
- ✅ Error handling
- ✅ Test script
- ✅ Documentation

**Chỉ cần push lên GitHub là xong!** 🚀

```bash
git checkout -b feature/avatar-upload
git add .
git commit -m "SV1: Backend API upload avatar"
git push origin feature/avatar-upload
```

**Done! Báo cho SV2 & SV3 biết nhé!** ✅

---

## 📞 Hỗ Trợ

Xem thêm chi tiết:
- `HUONG_DAN_SV1_BACKEND.md` - Documentation đầy đủ
- `GIT_COMMANDS_SV1.md` - Git commands chi tiết

Có vấn đề? Hỏi trong group hoặc check troubleshooting trong docs.

---

**Repo:** https://github.com/duyen0819529246-stack/group16-project.git  
**Task:** Backend API Upload Avatar  
**Status:** ✅ READY TO PUSH


