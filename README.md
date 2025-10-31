# Group 16 Project - Authentication & User Management System

Hệ thống quản lý người dùng full-stack với authentication, phân quyền theo role, upload avatar và reset password.

**Repository:** https://github.com/duyen0819529246-stack/group16-project

---

## 📋 Mô tả

Ứng dụng web full-stack với các tính năng:

- ✅ **Đăng ký / Đăng nhập / Đăng xuất** với JWT authentication
- ✅ **Refresh Token & Session Management** - Auto-refresh khi token hết hạn
- ✅ **Upload Avatar** - Upload và resize ảnh đại diện với Cloudinary
- ✅ **Reset Password** - Quên mật khẩu và đặt lại qua email
- ✅ **Phân quyền theo Role** - Admin, Moderator, User với các quyền khác nhau
- ✅ **Quản lý Users** - Admin và Moderator có thể xem/chỉnh sửa users

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Web framework
- **MongoDB** + **Mongoose** - Database
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage & CDN
- **Multer** + **Sharp** - File upload & image processing
- **Nodemailer** - Email service
- **dotenv** - Environment variables

### Frontend
- **React 19** - UI framework
- **React Router** - Routing
- **Axios** - HTTP client với auto-refresh token
- **Context API** - State management
- **jwt-decode** - Decode JWT tokens

---

## 📦 Yêu cầu

- **Node.js** 18+
- **npm** hoặc **yarn**
- **MongoDB Atlas** (hoặc MongoDB Local)
- **Cloudinary account** (optional - cho upload avatar)
- **Gmail account** (optional - cho email service)

---

## 🚀 Hướng dẫn Cài đặt và Chạy

### Bước 1: Clone Repository

```bash
git clone https://github.com/duyen0819529246-stack/group16-project.git
cd group16-project
```

### Bước 2: Setup Backend

```bash
cd backend
npm install
```

### Bước 3: Cấu hình Backend (.env)

Tạo file `.env` trong thư mục `backend/`:

```env
# Database (BẮT BUỘC)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/groupDB?retryWrites=true&w=majority

# JWT Secret (BẮT BUỘC)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Port
PORT=5000

# Cloudinary (OPTIONAL - cho upload avatar)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (OPTIONAL - cho reset password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=your_email@gmail.com

# Frontend URL (cho reset password link)
FRONTEND_URL=http://localhost:3000

# Reset Password Token Expire (milliseconds, default: 1 hour)
RESET_PASSWORD_EXPIRE_MS=3600000

# Environment
NODE_ENV=development
```

**Lưu ý quan trọng:**
- File `.env` phải được lưu dưới encoding **UTF-8** (không có BOM)
- Nếu file được lưu bằng UTF-16, `dotenv` sẽ không đọc được
- **KHÔNG** commit file `.env` lên Git (đã có trong `.gitignore`)

**Hướng dẫn lấy MongoDB URI:**
1. Đăng nhập MongoDB Atlas: https://cloud.mongodb.com
2. Tạo cluster mới (Free tier)
3. Click "Connect" → "Connect your application"
4. Copy connection string
5. Thay `<password>` bằng password MongoDB của bạn
6. Thêm database name vào URI (ví dụ: `/groupDB`)

**Hướng dẫn lấy Cloudinary credentials:**
1. Đăng ký tại: https://cloudinary.com (free tier)
2. Vào Dashboard
3. Copy: Cloud Name, API Key, API Secret

**Hướng dẫn lấy Gmail App Password:**
1. Vào Google Account → Security
2. Bật 2-Step Verification
3. Tạo App Password
4. Copy password và dùng làm `SMTP_PASS`

### Bước 4: Chạy Backend

```bash
cd backend
npm start
```

Hoặc development mode (với auto-reload):

```bash
npm run dev
```

**Kết quả mong đợi:**
```
✅ MongoDB connected successfully
✅ Server running on port 5000
```

Backend chạy tại: **http://localhost:5000**

### Bước 5: Setup Frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

### Bước 6: Chạy Frontend

```bash
npm start
```

**Kết quả mong đợi:**
```
Compiled successfully!

You can now view frontend in the browser.
  Local:            http://localhost:3000
```

Frontend chạy tại: **http://localhost:3000**

---

## 📚 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication (`/api/auth`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/auth/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/auth/login` | Đăng nhập (trả về accessToken + refreshToken) | ❌ |
| POST | `/auth/refresh` | Refresh access token | ❌ |
| POST | `/auth/logout` | Đăng xuất và revoke refresh token | ✅ |
| GET | `/auth/profile` | Lấy thông tin user hiện tại | ✅ |

### User Profile (`/api/users`)

| Method | Endpoint | Mô tả | Auth Required | Role |
|--------|----------|-------|---------------|------|
| POST | `/users/signup` | Đăng ký (alias của `/auth/register`) | ❌ | - |
| POST | `/users/login` | Đăng nhập (alias của `/auth/login`) | ❌ | - |
| POST | `/users/logout` | Đăng xuất | ✅ | User |
| GET | `/users/profile` | Lấy profile | ✅ | User |
| PUT | `/users/profile` | Cập nhật profile | ✅ | User |
| POST | `/users/profile/avatar` | Upload avatar | ✅ | User |

### Password Reset (`/api/users`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/users/forgot-password` | Gửi email reset password | ❌ |
| POST | `/users/reset-password/:token` | Đặt lại mật khẩu | ❌ |

### Admin/Moderator Routes (`/api/users`)

| Method | Endpoint | Mô tả | Auth Required | Role |
|--------|----------|-------|---------------|------|
| GET | `/users` | Danh sách tất cả users | ✅ | Admin, Moderator |
| POST | `/users` | Tạo user mới | ✅ | Admin |
| PUT | `/users/:id` | Cập nhật user | ✅ | Admin, Moderator* |
| DELETE | `/users/:id` | Xóa user | ✅ | Admin |

*Moderator có thể cập nhật nhưng không được thay đổi role

---

## 👥 User Roles & Permissions

### 🔴 Admin
**Quyền hạn:**
- ✅ Quản lý tất cả users (xem, sửa, xóa, tạo mới)
- ✅ Thay đổi role của users (User ↔ Moderator ↔ Admin)
- ✅ Truy cập Admin Panel (`/admin`)
- ✅ Quản lý phân quyền (`/role-management`)
- ✅ Upload avatar
- ✅ Reset password
- ✅ Xem và chỉnh sửa profile của chính mình

### 🔵 Moderator
**Quyền hạn:**
- ✅ Xem danh sách users (`/admin`)
- ✅ Chỉnh sửa thông tin users (tên, email, password)
- ❌ **KHÔNG** thể thay đổi role
- ❌ **KHÔNG** thể xóa users
- ❌ **KHÔNG** thể tạo user mới
- ✅ Upload avatar
- ✅ Reset password
- ✅ Xem và chỉnh sửa profile của chính mình

### ⚪ User
**Quyền hạn:**
- ✅ Xem và chỉnh sửa profile của chính mình
- ✅ Upload avatar
- ✅ Reset password
- ❌ **KHÔNG** thể xem danh sách users khác
- ❌ **KHÔNG** thể truy cập Admin Panel

---

## 🔐 Authentication Flow

1. **Đăng nhập** → Nhận `accessToken` (15 phút) + `refreshToken` (7 ngày)
2. **Gọi API** → Dùng `accessToken` trong header: `Authorization: Bearer <token>`
3. **Token hết hạn (401)** → Frontend tự động gọi `/api/auth/refresh`
4. **Nhận token mới** → Retry request ban đầu với token mới
5. **Logout** → Revoke `refreshToken` trong database

### Frontend Auto-Refresh
- Axios interceptor tự động xử lý refresh token
- Queue các requests đang pending khi refresh
- Retry tất cả requests sau khi có token mới

---

## 📁 Cấu trúc Project

```
group16-project/
├── backend/
│   ├── controllers/
│   │   └── userController.js         # Business logic (auth, profile, admin)
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT protection & role authorization
│   │   └── uploadMiddleware.js       # File upload handling
│   ├── models/
│   │   ├── userModel.js              # User schema
│   │   └── refreshTokenModel.js      # Refresh token schema
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth routes
│   │   └── userRoutes.js             # /api/users routes
│   ├── utils/
│   │   ├── generateToken.js          # JWT token generation
│   │   └── sendEmail.js              # Email service
│   ├── tests/                        # Test scripts
│   ├── server.js                     # Entry point
│   ├── package.json
│   └── .env                          # Environment variables (không commit)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/                 # Login, Signup, ForgotPassword, ResetPassword
    │   │   ├── profile/              # ProfilePage, AvatarUpload, HomePage
    │   │   ├── shared/               # ProtectedRoute, AdminRoute, ModeratorRoute
    │   │   ├── UserList.jsx          # Admin/Moderator user management
    │   │   ├── RoleManagement.jsx    # Admin role management
    │   │   └── Permissions.jsx       # View user permissions
    │   ├── contexts/
    │   │   ├── AuthContext.jsx       # Authentication context
    │   │   └── ToastContext.jsx      # Toast notifications
    │   ├── services/
    │   │   └── api.js                # Axios instance với auto-refresh
    │   ├── App.jsx                   # Main app component với routes
    │   └── index.js                  # Entry point
    ├── package.json
    └── public/
```

---

## 🧪 Testing

### Test với Postman

1. Import collection: `backend/postman_collection.json`
2. Set environment: `backend/postman_environment.json`
3. Chạy các requests theo thứ tự

### Test Flow Cơ bản

#### 1. Đăng ký
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

#### 2. Đăng nhập
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

Response:
```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "eyJhbGci...",
  "refreshToken": "a1b2c3d4e5f6...",
  "token": "eyJhbGci..."
}
```

#### 3. Lấy Profile
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <accessToken>
```

#### 4. Upload Avatar
```http
POST http://localhost:5000/api/users/profile/avatar
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Body (form-data):
  avatar: [chọn file ảnh]
```

#### 5. Reset Password

**Step 1: Forgot Password**
```http
POST http://localhost:5000/api/users/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

Response (development mode):
```json
{
  "message": "Nếu email tồn tại, đã gửi link đặt lại mật khẩu.",
  "resetToken": "abc123xyz456..."
}
```

**Step 2: Reset Password**
```http
POST http://localhost:5000/api/users/reset-password/<resetToken>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

---

## 🐛 Troubleshooting

### Lỗi: "Missing MONGO_URI in .env file"
- **Nguyên nhân:** File `.env` không tồn tại hoặc không có `MONGO_URI`
- **Giải pháp:** Tạo file `.env` trong `backend/` và thêm `MONGO_URI`

### Lỗi: "MongoDB connection error"
- **Nguyên nhân:** MongoDB URI sai hoặc network access chưa config
- **Giải pháp:**
  - Kiểm tra MongoDB Atlas → Network Access → Thêm IP `0.0.0.0/0` (cho development)
  - Kiểm tra username/password trong URI
  - Đảm bảo database name đúng

### Lỗi: "Token không hợp lệ hoặc hết hạn"
- **Nguyên nhân:** Token hết hạn hoặc JWT_SECRET sai
- **Giải pháp:** Đăng nhập lại để lấy token mới

### Lỗi: Upload avatar fail
- **Nguyên nhân:** Cloudinary credentials chưa config hoặc sai
- **Giải pháp:**
  - Cấu hình Cloudinary trong `.env` (nếu muốn dùng tính năng này)
  - Hoặc bỏ qua tính năng upload avatar (không bắt buộc)

### Lỗi: Email không gửi được
- **Nguyên nhân:** SMTP credentials sai hoặc chưa config
- **Giải pháp:**
  - Trong development mode, `resetToken` sẽ được trả về trong response
  - Hoặc cấu hình Gmail App Password trong `.env`

### Lỗi: CORS error
- **Nguyên nhân:** Frontend và Backend khác port
- **Giải pháp:** Backend đã có `app.use(cors())` sẵn, kiểm tra lại nếu vẫn lỗi

### Lỗi: File .env không đọc được
- **Nguyên nhân:** File được lưu bằng UTF-16 thay vì UTF-8
- **Giải pháp:** Lưu lại file `.env` với encoding UTF-8 (không có BOM)

---

## 📝 Scripts

### Backend
```bash
npm start          # Chạy server
npm run dev        # Chạy với nodemon (auto-reload)
npm run test:api   # Chạy test API
```

### Frontend
```bash
npm start          # Chạy development server
npm run build      # Build production
npm test           # Chạy tests
```

---

## 🔒 Security Notes

- ✅ Passwords được hash bằng bcryptjs (salt rounds: 10)
- ✅ JWT access tokens có thời gian hết hạn ngắn (15 phút)
- ✅ Refresh tokens được lưu trong database và có thể revoke
- ✅ Protected routes yêu cầu authentication
- ✅ Role-based access control (RBAC)
- ✅ File validation (type, size) cho upload
- ⚠️ File `.env` **KHÔNG** được commit lên Git
- ⚠️ JWT_SECRET phải là string dài và random
- ⚠️ MongoDB URI chứa password, không được commit

---

## 📚 Tài liệu tham khảo

- [Refresh Token Implementation](./REFRESH_TOKEN_IMPLEMENTATION.md)
- [How to Test Backend](./TEST_BACKEND_SV1.md)
- [Forgot Password Guide](./HOW_TO_TEST_FORGOT_PASSWORD.md)
- [Git Commands](./GIT_COMMANDS_SV1.md)
- [Project Completed Summary](./PROJECT_COMPLETED.md)

---

## ✅ Quick Start Checklist

- [ ] Clone repository
- [ ] Cài dependencies backend: `cd backend && npm install`
- [ ] Tạo file `backend/.env` với:
  - [ ] `MONGO_URI` (bắt buộc)
  - [ ] `JWT_SECRET` (bắt buộc)
  - [ ] Cloudinary credentials (optional)
  - [ ] SMTP credentials (optional)
- [ ] Chạy backend: `npm start` → Kiểm tra log "✅ Server running"
- [ ] Cài dependencies frontend: `cd frontend && npm install`
- [ ] Chạy frontend: `npm start` → Mở http://localhost:3000
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập và test các tính năng:
  - [ ] Upload avatar
  - [ ] Reset password
  - [ ] Xem profile
  - [ ] Test phân quyền (nếu là Admin/Moderator)

---

## 👨‍💻 Contributors

- **SV1:** Backend API Development
- **SV2 (Huy):** Frontend UI Development
- **SV3 (Nguyen):** Testing & Documentation

**Repository:** https://github.com/duyen0819529246-stack/group16-project

---

## 📄 License

MIT

---

## 🎯 Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | ✅ | JWT với refresh token |
| Role Management | ✅ | Admin, Moderator, User |
| Upload Avatar | ✅ | Cloudinary integration |
| Reset Password | ✅ | Email service |
| Auto Refresh Token | ✅ | Frontend tự động refresh |
| User Management | ✅ | Admin/Moderator panel |
| Protected Routes | ✅ | Route guards |

---

**Chúc bạn code vui vẻ! 🚀**
