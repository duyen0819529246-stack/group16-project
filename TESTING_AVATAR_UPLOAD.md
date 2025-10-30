# Hướng Dẫn Test Avatar Upload

## 🎯 Mục Đích
Test chức năng upload avatar với Multer + Sharp + Cloudinary để đảm bảo:
- Upload ảnh thành công
- Resize đúng kích thước (400x400px)
- Lưu URL vào MongoDB
- Hiển thị avatar trên frontend

---

## 📋 Chuẩn Bị

### 1. Cấu Hình Backend

Tạo file `backend/.env` (copy từ `.env.example`):

```env
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Khởi Động Server

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm start
```

### 3. Tạo Tài Khoản Test

Nếu chưa có user, tạo bằng API hoặc seeder:

```bash
cd backend
node seedUsers.js
```

---

## 🧪 Phương Pháp Test

### A. Test bằng Postman (Khuyến nghị cho SV3)

#### Bước 1: Đăng Nhập

**Request:**
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "abc123..."
}
```

**📝 Copy `accessToken`** để dùng cho các request tiếp theo.

---

#### Bước 2: Upload Avatar

**Request:**
```
POST http://localhost:5000/api/users/profile/avatar
Authorization: Bearer <accessToken từ bước 1>
Content-Type: multipart/form-data

Body (form-data):
  avatar: [Chọn file ảnh - jpg/png/jpeg, < 5MB]
```

**Cách thực hiện trong Postman:**
1. Chọn method: **POST**
2. URL: `http://localhost:5000/api/users/profile/avatar`
3. Tab **Headers**:
   - Key: `Authorization`
   - Value: `Bearer eyJhbGciOiJI...` (paste token)
4. Tab **Body**:
   - Chọn **form-data**
   - Key: `avatar` (type: **File**)
   - Value: Click "Select Files" → chọn ảnh từ máy

**Response Success:**
```json
{
  "message": "Upload avatar thành công",
  "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v1234567/avatars/xyz.jpg",
  "details": {
    "width": 400,
    "height": 400,
    "format": "jpg",
    "bytes": 45678
  }
}
```

---

#### Bước 3: Kiểm Tra Profile

**Request:**
```
GET http://localhost:5000/api/users/profile
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "6123abc...",
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "admin",
  "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v1234567/avatars/xyz.jpg"
}
```

**✅ Xác nhận:** URL `avatar` giống với URL từ bước 2

---

#### Bước 4: Kiểm Tra Cloudinary

1. Đăng nhập vào https://cloudinary.com/
2. Vào **Media Library**
3. Tìm folder **avatars**
4. Xem ảnh đã upload:
   - Kích thước: 400x400px
   - Format: jpg
   - URL khớp với response

---

### B. Test bằng cURL

```bash
# 1. Đăng nhập
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Copy accessToken từ response

# 2. Upload avatar
curl -X POST http://localhost:5000/api/users/profile/avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/your/image.jpg"

# 3. Kiểm tra profile
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### C. Test bằng Frontend

#### Bước 1: Đăng Nhập

1. Mở trình duyệt: http://localhost:3000
2. Đăng nhập với tài khoản test
3. Navigate đến trang Profile

#### Bước 2: Upload Avatar

1. Trong trang Profile, tìm component "Ảnh Đại Diện"
2. Click "Chọn ảnh mới" → chọn file
3. Xem preview ảnh
4. Click "Upload Avatar"
5. Đợi upload hoàn tất

**Kết quả mong đợi:**
- Hiển thị message "Upload avatar thành công!"
- Avatar mới hiển thị ngay lập tức
- Preview được reset

#### Bước 3: Refresh Trang

1. Refresh trang (F5)
2. Avatar vẫn hiển thị đúng
3. URL được lưu trong MongoDB

---

### D. Test bằng Script Tự Động

```bash
cd backend
node tests/testAvatarUpload.js
```

**Lưu ý:** Cần tạo file `backend/tests/test-avatar.jpg` trước

---

## ✅ Checklist Test Đầy Đủ

### Backend API

- [ ] POST `/api/users/profile/avatar` trả về status 200
- [ ] Response chứa `avatar` URL từ Cloudinary
- [ ] Response chứa `details` (width, height, format, bytes)
- [ ] Ảnh được resize về 400x400px
- [ ] Format được convert sang JPEG
- [ ] URL được lưu vào MongoDB (kiểm tra qua GET `/profile`)

### Authentication

- [ ] Request không có token → 401 Unauthorized
- [ ] Request có token hợp lệ → 200 OK
- [ ] Token hết hạn → tự động refresh (nếu có refresh token)

### Validation

- [ ] Upload file không phải ảnh → 400 Bad Request
- [ ] Upload file > 5MB → 413 Payload Too Large hoặc 400
- [ ] Không chọn file → 400 "Không có file"

### Cloudinary

- [ ] Ảnh xuất hiện trong Media Library
- [ ] Ảnh trong folder "avatars"
- [ ] Kích thước chính xác 400x400px
- [ ] URL có thể truy cập công khai

### Frontend

- [ ] Preview ảnh trước khi upload
- [ ] Hiển thị loading state khi đang upload
- [ ] Hiển thị success message sau upload
- [ ] Hiển thị error message nếu lỗi
- [ ] Avatar cập nhật ngay lập tức
- [ ] Avatar hiển thị sau refresh

---

## 🔍 Test Cases Chi Tiết

### Test Case 1: Upload Thành Công

**Precondition:** User đã đăng nhập

**Steps:**
1. Chọn file ảnh hợp lệ (jpg, < 5MB)
2. Click Upload

**Expected:**
- Status 200
- Response có avatar URL
- Avatar hiển thị trên frontend
- Ảnh có trong Cloudinary
- URL trong MongoDB

---

### Test Case 2: Upload File Quá Lớn

**Steps:**
1. Chọn file > 5MB
2. Click Upload

**Expected:**
- Status 400 hoặc 413
- Message: "File quá lớn"
- Không upload lên Cloudinary

---

### Test Case 3: Upload File Không Phải Ảnh

**Steps:**
1. Chọn file .pdf hoặc .txt
2. Click Upload

**Expected:**
- Error ngay khi chọn file (frontend validation)
- Hoặc Status 400 (backend validation)
- Message: "Chỉ chấp nhận file ảnh"

---

### Test Case 4: Upload Không Token

**Steps:**
1. Logout
2. Gọi API upload trực tiếp

**Expected:**
- Status 401
- Message: "Unauthorized" hoặc "Token không hợp lệ"

---

### Test Case 5: Upload Ảnh Lớn (Test Resize)

**Steps:**
1. Chọn ảnh 2000x3000px
2. Upload

**Expected:**
- Upload thành công
- Ảnh trên Cloudinary: 400x400px
- Ảnh được crop từ center

---

### Test Case 6: Upload Nhiều Lần

**Steps:**
1. Upload avatar lần 1
2. Upload avatar lần 2 (ảnh khác)

**Expected:**
- Avatar cũ bị thay thế
- URL mới trong database
- Cả 2 ảnh đều có trên Cloudinary (không tự xóa)

---

## 🐛 Troubleshooting

### Lỗi: "Invalid Cloudinary credentials"

**Nguyên nhân:** Chưa cấu hình hoặc sai thông tin Cloudinary

**Giải pháp:**
1. Kiểm tra file `.env`
2. Verify credentials trên Cloudinary Dashboard
3. Restart server sau khi thay đổi

---

### Lỗi: "Module not found: sharp"

**Nguyên nhân:** Chưa cài Sharp

**Giải pháp:**
```bash
cd backend
npm install sharp
```

---

### Lỗi: "Request Entity Too Large"

**Nguyên nhân:** File quá lớn

**Giải pháp:**
- Chọn file < 5MB
- Hoặc tăng limit trong `uploadMiddleware.js`

---

### Lỗi: "File is not an image"

**Nguyên nhân:** Upload file không phải ảnh

**Giải pháp:**
- Chỉ chọn jpg, png, jpeg
- Kiểm tra MIME type

---

### Ảnh Không Hiển Thị Trên Frontend

**Nguyên nhân:** CORS hoặc URL không đúng

**Giải pháp:**
1. Check URL trong MongoDB
2. Copy URL vào trình duyệt xem có mở được không
3. Kiểm tra CORS settings
4. Check Network tab trong DevTools

---

## 📊 Kết Quả Mong Đợi

### SV1 (Backend)
✅ API endpoint hoạt động  
✅ Sharp resize chính xác  
✅ Upload lên Cloudinary thành công  
✅ Lưu URL vào MongoDB  

### SV2 (Frontend)
✅ Component upload đẹp và dễ dùng  
✅ Preview ảnh trước upload  
✅ Hiển thị avatar sau upload  
✅ Xử lý lỗi tốt  

### SV3 (Testing & Documentation)
✅ Cloudinary account đã tạo  
✅ Test upload thành công qua Postman  
✅ URL được lưu vào MongoDB  
✅ Ảnh hiển thị trên Cloudinary Dashboard  
✅ Tài liệu test đầy đủ  

---

## 📸 Screenshots Mẫu

### Postman Test Success
```
Status: 200 OK
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

### Frontend Success
- Avatar hiển thị trong khung tròn 150x150px
- Message: "Upload avatar thành công!"
- Thông tin: "Ảnh sẽ được tự động resize về 400x400px"

### Cloudinary Dashboard
- Folder: avatars
- Image: xyz.jpg (400x400, ~45KB)
- URL: https://res.cloudinary.com/...

---

**Tác giả:** Group 16  
**Hoạt động:** 3 - Upload Ảnh Nâng Cao (Avatar)  
**Ngày:** 2025

