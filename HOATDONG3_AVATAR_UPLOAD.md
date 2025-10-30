# Hoạt động 3 - Upload Ảnh Nâng Cao (Avatar)

## 📋 Tổng Quan
Tính năng upload ảnh đại diện với xử lý resize tự động và lưu trữ trên Cloudinary.

**Công nghệ sử dụng:**
- **Multer**: Xử lý multipart/form-data upload
- **Sharp**: Resize và tối ưu ảnh
- **Cloudinary**: Lưu trữ ảnh trên cloud
- **JWT**: Xác thực người dùng

---

## 🎯 SV3: Cấu Hình Cloudinary

### Bước 1: Tạo Tài Khoản Cloudinary

1. Truy cập: https://cloudinary.com/
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng nhập, vào Dashboard

### Bước 2: Lấy Thông Tin Cấu Hình

Trong Dashboard, bạn sẽ thấy:
```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

### Bước 3: Cấu Hình Backend

Thêm vào file `backend/.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️ **LƯU Ý**: 
- Thay `your_cloud_name`, `your_api_key`, `your_api_secret` bằng giá trị thực từ Cloudinary Dashboard
- Không commit file `.env` lên Git (đã được thêm vào `.gitignore`)

### Bước 4: Kiểm Tra Cấu Hình

Cloudinary đã được cấu hình trong `backend/controllers/userController.js`:

```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
```

---

## 🔧 SV1: Triển Khai Backend API

### Các Package Đã Cài Đặt

```bash
npm install sharp
# multer và cloudinary đã có sẵn
```

### API Endpoint

**POST** `/api/users/profile/avatar`

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
```
avatar: [file] (image file - jpg, png, jpeg)
```

**Response Success (200):**
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

**Response Error (400):**
```json
{
  "message": "Không có file"
}
```

### Quy Trình Xử Lý

1. **Nhận file** từ client qua Multer (memory storage)
2. **Resize** bằng Sharp:
   - Kích thước: 400x400px (vuông)
   - Fit: cover (cắt để vừa khung)
   - Position: center
   - Format: JPEG, quality 90%
3. **Upload** lên Cloudinary vào folder "avatars"
4. **Lưu URL** vào MongoDB (User.avatar)
5. **Trả về** URL và thông tin ảnh

### Bảo Mật

- ✅ JWT authentication middleware (`protect`)
- ✅ File size limit: 5MB
- ✅ File type filter: chỉ ảnh (image/*)
- ✅ Chỉ user đăng nhập mới upload được

---

## 🧪 SV3: Test Upload & Lấy URL

### Test với Postman

#### 1. Đăng Nhập

**POST** `http://localhost:5000/api/users/login`

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Lấy** `accessToken` từ response

#### 2. Upload Avatar

**POST** `http://localhost:5000/api/users/profile/avatar`

**Headers:**
```
Authorization: Bearer <accessToken từ bước 1>
```

**Body:** 
- Chọn "form-data"
- Key: `avatar` (type: File)
- Value: Chọn file ảnh từ máy

**Kết quả mong đợi:**
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

#### 3. Kiểm Tra Avatar Trong Profile

**GET** `http://localhost:5000/api/users/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "avatar": "https://res.cloudinary.com/..."
}
```

### Test với cURL

```bash
# 1. Đăng nhập
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Lấy token từ response

# 2. Upload avatar
curl -X POST http://localhost:5000/api/users/profile/avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/your/image.jpg"
```

### Kiểm Tra Trên Cloudinary Dashboard

1. Đăng nhập vào Cloudinary
2. Vào **Media Library**
3. Tìm folder **avatars**
4. Xem ảnh đã upload (400x400px)

---

## 🎨 SV2: Triển Khai Frontend

### Component AvatarUpload

File: `frontend/src/components/profile/AvatarUpload.jsx`

**Features:**
- Preview ảnh trước khi upload
- Upload ảnh lên server
- Hiển thị trạng thái loading
- Xử lý lỗi
- Hiển thị avatar hiện tại

### Component ProfilePage

File: `frontend/src/components/profile/ProfilePage.jsx`

**Tích hợp:**
- Hiển thị avatar từ server
- Sử dụng AvatarUpload component
- Cập nhật avatar sau khi upload thành công
- Fallback avatar nếu chưa có

---

## 📝 Kịch Bản Test Đầy Đủ

### Test Case 1: Upload Thành Công
1. Đăng nhập vào hệ thống
2. Vào trang Profile
3. Chọn file ảnh (jpg/png, < 5MB)
4. Click Upload
5. **Kết quả:** 
   - Ảnh hiển thị ngay lập tức
   - URL được lưu vào MongoDB
   - Ảnh xuất hiện trên Cloudinary

### Test Case 2: Upload File Quá Lớn
1. Chọn file > 5MB
2. Click Upload
3. **Kết quả:** Hiển thị lỗi "File quá lớn"

### Test Case 3: Upload File Không Phải Ảnh
1. Chọn file .pdf hoặc .txt
2. Click Upload
3. **Kết quả:** Hiển thị lỗi "Chỉ chấp nhận file ảnh"

### Test Case 4: Upload Không Token
1. Logout
2. Thử gọi API upload
3. **Kết quả:** 401 Unauthorized

### Test Case 5: Kiểm Tra Resize
1. Upload ảnh kích thước lớn (vd: 2000x3000px)
2. Kiểm tra ảnh trên Cloudinary
3. **Kết quả:** Ảnh đã được resize về 400x400px

---

## 🔍 Cấu Trúc File

```
backend/
├── controllers/
│   └── userController.js          # uploadAvatar function với Sharp
├── middleware/
│   ├── authMiddleware.js          # JWT protect
│   └── uploadMiddleware.js        # Multer config với memory storage
├── models/
│   └── userModel.js               # User schema với avatar field
├── routes/
│   └── userRoutes.js              # Route: POST /profile/avatar
└── .env                           # Cloudinary credentials

frontend/
├── src/
│   ├── components/
│   │   └── profile/
│   │       ├── AvatarUpload.jsx   # Component upload avatar
│   │       └── ProfilePage.jsx    # Trang profile với avatar
│   └── services/
│       └── api.js                 # API calls
```

---

## 🚀 Tính Năng Đã Triển Khai

### Backend ✅
- [x] Multer middleware với memory storage
- [x] Sharp resize ảnh 400x400px
- [x] Upload lên Cloudinary folder "avatars"
- [x] JWT authentication
- [x] File validation (type, size)
- [x] Lưu URL vào MongoDB
- [x] API endpoint `/api/users/profile/avatar`

### Cloudinary ✅
- [x] Account setup guide
- [x] Configuration instructions
- [x] Environment variables
- [x] Test procedures

### Frontend ✅
- [x] AvatarUpload component
- [x] ProfilePage integration
- [x] Image preview
- [x] Upload progress
- [x] Error handling
- [x] Avatar display

---

## 🔒 Bảo Mật

1. **Authentication:** JWT required cho mọi request
2. **File Validation:** 
   - Chỉ chấp nhận image/*
   - Max size: 5MB
3. **User Isolation:** Mỗi user chỉ upload avatar của chính mình
4. **Cloudinary:** API keys được bảo vệ trong .env

---

## 📚 Tài Liệu Tham Khảo

- [Multer Documentation](https://github.com/expressjs/multer)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js Streams](https://nodejs.org/api/stream.html)

---

## ❓ Troubleshooting

### Lỗi "Module not found: sharp"
```bash
cd backend
npm install sharp
```

### Lỗi "Invalid Cloudinary credentials"
- Kiểm tra file `.env`
- Verify credentials trên Cloudinary Dashboard
- Restart server sau khi thay đổi .env

### Ảnh không hiển thị trên frontend
- Kiểm tra CORS settings
- Verify URL trong MongoDB
- Check network tab trong DevTools

### Upload chậm
- Giảm quality trong Sharp (từ 90 xuống 80)
- Giảm kích thước resize (từ 400 xuống 300)
- Kiểm tra kết nối internet

---

## 📊 Kết Quả Mong Đợi

### SV1: Backend API
- API endpoint hoạt động với JWT
- Resize ảnh chính xác 400x400px
- Upload thành công lên Cloudinary

### SV2: Frontend UI
- Upload form đẹp, dễ sử dụng
- Preview ảnh trước khi upload
- Hiển thị avatar sau upload

### SV3: Cloudinary Setup
- Account đã tạo và cấu hình
- Test upload thành công
- URL được lưu vào MongoDB
- Ảnh hiển thị trên Cloudinary Dashboard

---

**Hoàn thành:** ✅ Backend API, ✅ Documentation, ⏳ Frontend (đang triển khai)

