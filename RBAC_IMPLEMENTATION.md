# Hoạt Động 2: Advanced RBAC (Role-Based Access Control)

## 🎯 Mục tiêu
Phân quyền nâng cao với 3 role: **User**, **Admin**, **Moderator**

---

## 📋 Phân công công việc

### ✅ SV3: Cập nhật Schema & Seed Data
**File thay đổi:**
- `backend/models/userModel.js` - Thêm role "moderator"
- `backend/seedUsers.js` - Script tạo dữ liệu mẫu

**Dữ liệu mẫu:**
```
Admin     - admin@gmail.com      | password: 123456
Moderator - moderator@gmail.com  | password: 123456
User 1    - user1@gmail.com      | password: 123456
User 2    - user2@gmail.com      | password: 123456
```

**Chạy seed data:**
```bash
cd backend
node seedUsers.js
```

---

### ✅ SV1: Middleware checkRole & API

**Middleware mới (backend/middleware/authMiddleware.js):**
- `checkRole(allowedRoles)` - Kiểm tra role của user
- `isAdmin` - Middleware cho admin only
- `isModeratorOrAdmin` - Middleware cho moderator hoặc admin

**API mới (backend/controllers/userController.js):**
1. `GET /api/users/role/:role` - Lấy danh sách users theo role (Admin/Moderator)
2. `PUT /api/users/:id/role` - Cập nhật role của user (Admin only)
3. `GET /api/users/statistics/roles` - Thống kê số lượng users theo role (Admin only)
4. `GET /api/users/permissions` - Lấy thông tin quyền hạn của user hiện tại (All authenticated users)

---

### ✅ SV2: Frontend hiển thị theo Role

**Component mới:**
- `frontend/src/components/shared/RoleBasedComponent.jsx` - Component wrapper để hiển thị nội dung theo role
- `frontend/src/components/admin/RoleManagement.jsx` - Trang quản lý phân quyền (Admin only)
- `frontend/src/components/profile/UserPermissions.jsx` - Trang hiển thị quyền hạn của user

**Route mới:**
- `/admin/roles` - Quản lý phân quyền (Admin only)
- `/permissions` - Xem quyền hạn của bản thân

**Cập nhật:**
- `HeaderAuth.jsx` - Menu khác nhau theo role với badge màu sắc

---

## 🔐 Phân quyền chi tiết

### User (Người dùng thông thường)
- ✅ Xem profile cá nhân
- ✅ Chỉnh sửa profile cá nhân
- ✅ Xóa tài khoản của mình
- ❌ Xem danh sách tất cả users
- ❌ Chỉnh sửa thông tin users khác
- ❌ Xóa users khác
- ❌ Quản lý phân quyền

### Moderator (Người điều hành)
- ✅ Xem profile cá nhân
- ✅ Chỉnh sửa profile cá nhân
- ✅ Xóa tài khoản của mình
- ✅ Xem danh sách tất cả users
- ✅ Chỉnh sửa thông tin users khác
- ❌ Xóa users khác
- ❌ Quản lý phân quyền

### Admin (Quản trị viên)
- ✅ Xem profile cá nhân
- ✅ Chỉnh sửa profile cá nhân
- ✅ Xóa tài khoản của mình
- ✅ Xem danh sách tất cả users
- ✅ Chỉnh sửa thông tin users khác
- ✅ Xóa users khác
- ✅ Quản lý phân quyền

---

## 🧪 Test API với Postman

### 1. Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### 2. Lấy quyền hạn của user hiện tại
```
GET http://localhost:5000/api/users/permissions
Headers:
Authorization: Bearer {accessToken}
```

### 3. Lấy danh sách users theo role
```
GET http://localhost:5000/api/users/role/admin
Headers:
Authorization: Bearer {accessToken}
```

### 4. Cập nhật role của user (Admin only)
```
PUT http://localhost:5000/api/users/{userId}/role
Headers:
Authorization: Bearer {accessToken}
Body (JSON):
{
  "role": "moderator"
}
```

### 5. Thống kê role
```
GET http://localhost:5000/api/users/statistics/roles
Headers:
Authorization: Bearer {accessToken}
```

---

## 📸 Sản phẩm nộp

### 1. Ảnh API kiểm tra quyền
- Postman: Test API `/api/users/permissions` với 3 role khác nhau
- Postman: Test API `/api/users/role/:role`
- Postman: Test API cập nhật role

### 2. Demo Frontend theo Role
- **User role**: Màn hình Home, không có menu Admin/Moderator
- **Moderator role**: Có menu Moderator, xem được danh sách users
- **Admin role**: Có menu "Quản lý Users" và "Phân quyền"
- Trang Permissions hiển thị quyền hạn của từng role

### 3. Link Pull Request GitHub
```
https://github.com/duyen0819529246-stack/group16-project/pull/[PR_NUMBER]
```

---

## 🚀 Hướng dẫn chạy

### Backend
```bash
cd backend
npm install
node seedUsers.js  # Tạo dữ liệu mẫu
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## ✅ Checklist hoàn thành

- [x] Schema User có role: user, admin, moderator
- [x] Script seed data mẫu
- [x] Middleware checkRole, isAdmin, isModeratorOrAdmin
- [x] API lấy users theo role
- [x] API cập nhật role
- [x] API thống kê role
- [x] API lấy permissions
- [x] Component RoleBasedComponent
- [x] Trang RoleManagement (Admin)
- [x] Trang UserPermissions
- [x] Header hiển thị menu theo role
- [x] Routes với permission check
- [x] Documentation

---

## 📝 Ghi chú

- Admin không thể tự thay đổi role của chính mình (để tránh mất quyền admin)
- Moderator có thể xem và sửa users nhưng không thể xóa hoặc thay đổi role
- User chỉ có quyền quản lý profile cá nhân
- Role badge có màu sắc khác nhau: Admin (đỏ), Moderator (xanh dương), User (xanh lá)

