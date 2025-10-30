# 🚀 Quick Start - Hoạt Động 3: Avatar Upload

## ✅ Đã Hoàn Thành

Tất cả tính năng upload avatar với Multer + Sharp + Cloudinary đã được triển khai đầy đủ cho SV1, SV2, và SV3!

---

## 📁 Files Đã Thay Đổi/Tạo Mới

### Backend (SV1)
```
✅ backend/package.json                     - Added sharp package
✅ backend/middleware/uploadMiddleware.js   - Updated for memory storage
✅ backend/controllers/userController.js    - Added Sharp resize + Cloudinary upload
✅ backend/routes/userRoutes.js             - Route already exists
✅ backend/models/userModel.js              - Avatar field already exists
```

### Frontend (SV2)
```
✅ frontend/src/components/profile/AvatarUpload.jsx   - Complete upload component
✅ frontend/src/components/profile/ProfilePage.jsx    - Updated with avatar display
```

### Documentation (SV3)
```
✅ HOATDONG3_AVATAR_UPLOAD.md       - Tài liệu đầy đủ cho cả 3 sinh viên
✅ TESTING_AVATAR_UPLOAD.md         - Hướng dẫn test chi tiết
✅ HOATDONG3_SUMMARY.md             - Tóm tắt dự án
✅ QUICK_START_HOATDONG3.md         - File này
✅ backend/tests/testAvatarUpload.js - Test script tự động
```

---

## ⚡ Bắt Đầu Ngay (5 bước)

### Bước 1: Cấu Hình Cloudinary (SV3)

1. Đăng ký tài khoản miễn phí: https://cloudinary.com/
2. Lấy credentials từ Dashboard:
   - Cloud Name
   - API Key
   - API Secret

3. Tạo file `backend/.env` (nếu chưa có):
```bash
cd backend
cp .env.example .env
```

4. Thêm vào `backend/.env`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

⚠️ **Thay thế giá trị bằng credentials thật từ Cloudinary!**

---

### Bước 2: Cài Đặt Dependencies

```bash
# Backend (đã cài Sharp rồi, nhưng nếu cần)
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Bước 3: Khởi Động Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Đợi thấy: `Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Trình duyệt sẽ mở tự động: `http://localhost:3000`

---

### Bước 4: Test Upload (Chọn 1 trong 3 cách)

#### Cách 1: Test qua Frontend (Dễ nhất) ✨

1. Mở browser: http://localhost:3000
2. Đăng nhập (hoặc đăng ký tài khoản mới)
3. Vào trang Profile
4. Trong phần "Ảnh Đại Diện":
   - Click "Chọn ảnh mới"
   - Chọn file ảnh (jpg/png, < 5MB)
   - Xem preview
   - Click "Upload Avatar"
   - Đợi thành công!

**Kết quả:** Avatar mới hiển thị ngay lập tức

---

#### Cách 2: Test với Postman (SV3)

**Step 1: Đăng nhập**
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Lấy `accessToken` từ response**

**Step 2: Upload Avatar**
```
POST http://localhost:5000/api/users/profile/avatar
Authorization: Bearer <accessToken từ step 1>
Content-Type: multipart/form-data

Body (form-data):
  Key: avatar (type: File)
  Value: [Chọn file ảnh]
```

**Expected Response:**
```json
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

#### Cách 3: Test Script Tự Động

```bash
cd backend

# Tạo file ảnh test: backend/tests/test-avatar.jpg
# (hoặc sửa path trong script)

node tests/testAvatarUpload.js
```

---

### Bước 5: Kiểm Tra Cloudinary

1. Đăng nhập vào https://cloudinary.com/
2. Vào **Media Library** → **avatars** folder
3. Xem ảnh đã upload:
   - Kích thước: 400x400px
   - Format: jpg
   - URL public

✅ **Nếu thấy ảnh ở đây = Hoàn thành!**

---

## 🎯 API Endpoint

### Upload Avatar

```http
POST /api/users/profile/avatar
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data

Body:
  avatar: [image file]
```

**Request:**
- Headers: `Authorization: Bearer <token>`
- Body: Form-data với key `avatar`
- File: jpg/png/jpeg, max 5MB

**Response Success (200):**
```json
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

**Response Error (400):**
```json
{
  "message": "Không có file"
}
```

---

## 🔧 Tính Năng Chính

### Backend (SV1) ✅

✅ **Multer** - Upload file handling
- Memory storage (không lưu file local)
- Validation: chỉ ảnh, max 5MB

✅ **Sharp** - Image processing
- Resize: 400x400px (vuông)
- Fit: cover (cắt để vừa khung)
- Position: center
- Format: JPEG, quality 90%

✅ **Cloudinary** - Cloud storage
- Upload lên folder "avatars"
- Trả về public URL
- Auto-optimize

✅ **MongoDB** - Database
- Lưu avatar URL vào User.avatar
- Persistent storage

✅ **JWT** - Security
- Middleware `protect`
- Chỉ user đăng nhập mới upload được

---

### Frontend (SV2) ✅

✅ **AvatarUpload Component**
- File selector với preview
- Validation (type, size)
- Upload progress
- Error/Success messages
- Beautiful UI

✅ **ProfilePage**
- Display user info
- Show current avatar
- Integrate upload component
- Real-time update

---

### Documentation (SV3) ✅

✅ **Setup Guide**
- Cloudinary registration
- Configuration steps
- Environment variables

✅ **Testing Guide**
- Postman instructions
- cURL examples
- Frontend testing
- Test script

✅ **API Documentation**
- Endpoint details
- Request/Response formats
- Error codes

---

## 📊 Test Checklist (SV3)

### Bắt buộc
- [ ] Cloudinary account đã tạo
- [ ] `.env` đã cấu hình đúng
- [ ] Server backend chạy được
- [ ] Upload ảnh thành công
- [ ] Ảnh hiển thị trên Cloudinary
- [ ] URL lưu vào MongoDB
- [ ] Avatar hiển thị trên frontend

### Nâng cao
- [ ] Upload file không phải ảnh → lỗi
- [ ] Upload file > 5MB → lỗi
- [ ] Upload không token → 401 error
- [ ] Ảnh resize đúng 400x400px
- [ ] Upload nhiều lần → avatar update

---

## 🐛 Troubleshooting

### Lỗi: "Invalid Cloudinary credentials"

**Nguyên nhân:** Chưa cấu hình hoặc sai credentials

**Giải pháp:**
1. Check file `backend/.env` có tồn tại không
2. Verify credentials trên Cloudinary Dashboard
3. Restart server sau khi sửa `.env`

```bash
cd backend
# Sửa .env
npm run dev  # Restart
```

---

### Lỗi: "Module not found: sharp"

**Nguyên nhân:** Chưa cài Sharp hoặc cài lỗi

**Giải pháp:**
```bash
cd backend
npm install sharp
```

---

### Upload chậm hoặc timeout

**Nguyên nhân:** File quá lớn hoặc internet chậm

**Giải pháp:**
- Chọn file nhỏ hơn (< 1MB)
- Check kết nối internet
- Cloudinary server có thể chậm (thử lại)

---

### Ảnh không hiển thị trên frontend

**Nguyên nhân:** CORS hoặc URL không đúng

**Giải pháp:**
1. Mở Network tab trong DevTools
2. Check request có lỗi không
3. Copy avatar URL vào browser xem có mở được không
4. Verify URL trong MongoDB

---

### Frontend không connect được backend

**Nguyên nhân:** Backend chưa chạy hoặc sai port

**Giải pháp:**
```bash
# Check backend đang chạy
cd backend
npm run dev

# Check port 5000
# Nếu dùng port khác, sửa trong frontend/.env
```

---

## 📚 Tài Liệu Chi Tiết

Để biết thêm thông tin:

1. **HOATDONG3_AVATAR_UPLOAD.md** - Tài liệu đầy đủ
2. **TESTING_AVATAR_UPLOAD.md** - Hướng dẫn test
3. **HOATDONG3_SUMMARY.md** - Tóm tắt dự án

---

## 🎓 Kiến Thức Học Được

### SV1 (Backend Developer)
- Multer multipart/form-data
- Sharp image processing
- Cloudinary SDK
- Node.js Streams & Buffers
- JWT authentication

### SV2 (Frontend Developer)
- React file upload
- FileReader API
- FormData API
- Image preview
- Error handling

### SV3 (DevOps/QA)
- Cloudinary platform
- API testing (Postman)
- Environment configuration
- Documentation
- Test automation

---

## ✅ Hoàn Thành

Chúc mừng! Bạn đã hoàn thành **Hoạt Động 3 - Upload Ảnh Nâng Cao (Avatar)**!

**Checklist cuối:**
- ✅ Backend API hoạt động
- ✅ Frontend UI đẹp và dễ dùng
- ✅ Cloudinary đã setup
- ✅ Upload + resize + save thành công
- ✅ Documentation đầy đủ

**Sẵn sàng demo và nộp bài!** 🎉

---

## 🚀 Next Steps

### Nếu muốn mở rộng:

1. **Crop Avatar**
   - Thêm frontend crop tool
   - User chọn vùng cắt

2. **Multiple Images**
   - Upload nhiều ảnh
   - Gallery system

3. **Image Filters**
   - Sharp effects
   - Brightness/Contrast

4. **Progress Bar**
   - Upload progress indicator
   - Cancel upload

5. **Auto Delete Old Avatar**
   - Xóa ảnh cũ khi upload mới
   - Tiết kiệm storage

---

**Group:** 16  
**Activity:** 3 - Avatar Upload  
**Status:** ✅ COMPLETED  
**Tech Stack:** Multer + Sharp + Cloudinary + React

