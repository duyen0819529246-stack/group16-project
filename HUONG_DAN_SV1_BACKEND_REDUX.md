# HƯỚNG DẪN CHO SINH VIÊN 1 (Duyên)
## Nhiệm vụ: Backend hỗ trợ API, kiểm thử dữ liệu

---

## 📋 THÔNG TIN SINH VIÊN 1

- **Tên GitHub:** `duyen0819529246-stack`
- **Email GitHub:** `duyen0819529246@gmail.com`
- **Nhiệm vụ:** Backend hỗ trợ API, kiểm thử dữ liệu
- **Branch làm việc:** `feature/redux-protected`
- **Repository:** `https://github.com/duyen0819529246-stack/group16-project.git`

---

## 🚀 BƯỚC 1: Clone Repository (nếu chưa có)

```bash
# Clone repo về máy
git clone https://github.com/duyen0819529246-stack/group16-project.git

# Vào folder
cd group16-project
```

---

## 🔀 BƯỚC 2: Checkout Branch feature/redux-protected

```bash
# Fetch tất cả branches từ remote
git fetch origin

# Checkout vào branch feature/redux-protected
git checkout feature/redux-protected

# Pull code mới nhất (nếu có)
git pull origin feature/redux-protected
```

---

## 💻 BƯỚC 3: Cấu hình Git (nếu chưa có)

**QUAN TRỌNG:** Phải dùng GitHub account của bạn!

```bash
# Set tên và email
git config user.name "duyen0819529246-stack"
git config user.email "duyen0819529246@gmail.com"

# Kiểm tra lại
git config user.name
git config user.email
```

---

## 🔧 BƯỚC 4: Setup Backend

### Cài đặt dependencies:

```bash
cd backend
npm install
```

### Tạo file .env (nếu chưa có):

Tạo file `.env` trong thư mục `backend/` với nội dung:
```env
MONGO_URI=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-secret-key-here-make-it-long-and-random
PORT=5000
NODE_ENV=development
```

### Chạy backend server:

```bash
# Chạy ở chế độ development (tự động restart khi code thay đổi)
npm run dev

# Hoặc chạy ở chế độ production
npm start
```

**Đảm bảo server chạy tại:** `http://localhost:5000`

---

## ✅ BƯỚC 4.1: Kiểm tra API đã được sửa chưa

### Các thay đổi đã được thực hiện:

1. **✅ API Login/Register đã được cập nhật:**
   - Trả về `user` object đầy đủ trong response
   - Format response đúng như yêu cầu

2. **✅ Access Token thời gian hết hạn:**
   - Đã tăng từ 30s lên 15 phút (để test dễ hơn)

3. **✅ Test script đã được tạo:**
   - File `backend/tests/testAPI_SV1.js` để test tự động

### Nhiệm vụ của bạn:

1. **Chạy test script để verify API:**
   ```bash
   cd backend
   npm run test:api
   ```
   - Đảm bảo tất cả test đều pass
   - Nếu có test fail, kiểm tra và sửa lỗi

2. **Kiểm tra API authentication:**
   - Đảm bảo middleware `protect` hoạt động đúng
   - Test API `/api/users/profile` với token hợp lệ
   - Test API `/api/users/profile` không có token → phải trả về 401
   - Test API `/api/users` với token hợp lệ (admin only)

3. **Kiểm thử dữ liệu:**
   - Test tất cả API endpoints liên quan đến user
   - Test với các role khác nhau (user, admin)
   - Test edge cases: token expired, invalid token, missing token

4. **Sửa lỗi nếu có:**
   - Fix các API không hoạt động đúng
   - Fix response format không đúng
   - Fix authentication/authorization issues

---

## 🧪 BƯỚC 5: Test Backend

### Cách 1: Dùng Test Script Tự Động (Khuyên dùng)

```bash
# Cài đặt dependencies (nếu chưa có axios)
cd backend
npm install

# Chạy test script
npm run test:api

# Hoặc chạy trực tiếp
node tests/testAPI_SV1.js
```

**Test script sẽ kiểm tra:**
- ✅ API Register (có trả về user object đầy đủ)
- ✅ API Login (có trả về user object đầy đủ)
- ✅ API Get Profile (protected route với token)
- ✅ API Get Profile (không có token - phải bị reject)
- ✅ API Get Users (admin only - protected route)
- ✅ API Refresh Token
- ✅ API với token không hợp lệ

### Cách 2: Test bằng cURL

**Test API Login:**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}'
```

**Response phải có:**
```json
{
  "message": "Đăng nhập thành công",
  "accessToken": "...",
  "refreshToken": "...",
  "token": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "...",
    "avatar": "..."
  }
}
```

**Test API Get Profile (với token):**
```bash
# Lấy token từ login response
TOKEN="your_token_here"

curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Test API Get Users (Admin only):**
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### Cách 3: Test với Postman/Thunder Client

1. **Test Login:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/users/login`
   - Body (JSON): `{"email":"admin@gmail.com","password":"123456"}`
   - Kiểm tra response có đủ: `accessToken`, `refreshToken`, `token`, `user` object

2. **Test Get Profile (Protected Route):**
   - Method: `GET`
   - URL: `http://localhost:5000/api/users/profile`
   - Headers: `Authorization: Bearer {accessToken từ login}`

3. **Test Get Users (Admin only):**
   - Method: `GET`
   - URL: `http://localhost:5000/api/users`
   - Headers: `Authorization: Bearer {accessToken từ login}`

4. **Test Refresh Token:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/refresh`
   - Body (JSON): `{"refreshToken": "{refreshToken từ login}"}`

### ✅ CHECKLIST TEST

Sau khi test, đảm bảo:
- [ ] API `/api/users/login` trả về đủ: `accessToken`, `refreshToken`, `token`, `user` object
- [ ] API `/api/users/register` trả về đủ: `accessToken`, `refreshToken`, `token`, `user` object
- [ ] API `/api/users/profile` yêu cầu token (Bearer token trong header)
- [ ] API `/api/users/profile` không có token → trả về 401
- [ ] API `/api/users` (admin only) yêu cầu token và role admin
- [ ] API `/api/auth/refresh` hoạt động đúng với refreshToken
- [ ] Token hết hạn hoặc không hợp lệ → trả về 401

---

## 💾 BƯỚC 6: Commit Code

### Sau khi sửa xong backend:

```bash
# Kiểm tra files đã sửa
git status

# Add các files backend đã sửa
git add backend/

# Hoặc add tất cả nếu cần
# git add .

# Commit với message đúng format
git commit -m "SV1 (duyen0819529246-stack): Backend hỗ trợ API, kiểm thử dữ liệu

- Sửa API login/register response format
- Thêm user object vào response
- Test và verify token authentication
- Test refresh token flow
- Fix các lỗi API liên quan đến Redux"
```

**Lưu ý:** Message commit phải bắt đầu bằng `SV1 (duyen0819529246-stack):`

---

## 📤 BƯỚC 7: Push Lên Remote

```bash
# Push lên branch feature/redux-protected
git push origin feature/redux-protected
```

**Nếu bị hỏi username/password:**
- Username: `duyen0819529246-stack`
- Password: Personal Access Token (PAT) từ GitHub Settings

**Hoặc dùng SSH nếu đã setup:**
```bash
# Kiểm tra remote URL
git remote -v

# Nếu là HTTPS, đổi sang SSH (tùy chọn)
git remote set-url origin git@github.com:duyen0819529246-stack/group16-project.git
```

---

## ⚠️ NẾU GẶP CONFLICT

```bash
# Pull code mới nhất trước
git pull origin feature/redux-protected

# Nếu có conflict, mở file bị conflict và sửa
# Sau đó:
git add .
git commit -m "SV1 (duyen0819529246-stack): Resolve conflict"
git push origin feature/redux-protected
```

---

## ✅ CHECKLIST

- [ ] Đã clone repository
- [ ] Đã checkout branch `feature/redux-protected`
- [ ] Đã config git với tên và email đúng
- [ ] Đã sửa code backend (API login/register)
- [ ] Đã test API với Postman/curl
- [ ] Đã commit với message đúng format
- [ ] Đã push lên remote thành công

---

## 📝 VÍ DỤ COMMIT MESSAGE

```bash
git commit -m "SV1 (duyen0819529246-stack): Backend hỗ trợ API, kiểm thử dữ liệu

- Fix API login response: thêm user object
- Fix API register response: thêm user object  
- Test token authentication với Postman
- Test refresh token flow
- Verify API /api/users hoạt động đúng với token"
```

---

## 🔗 LIÊN KẾT HỮU ÍCH

- Repository: https://github.com/duyen0819529246-stack/group16-project
- Branch: `feature/redux-protected`
- GitHub Settings (tạo PAT): https://github.com/settings/tokens

---

## 💡 TIPS

1. **Luôn pull trước khi push:**
   ```bash
   git pull origin feature/redux-protected
   git push origin feature/redux-protected
   ```

2. **Kiểm tra remote URL:**
   ```bash
   git remote -v
   # Phải là: https://github.com/duyen0819529246-stack/group16-project.git
   ```

3. **Xem lịch sử commit:**
   ```bash
   git log --oneline
   ```

4. **Xem branch hiện tại:**
   ```bash
   git branch
   # Phải thấy * feature/redux-protected
   ```

---

**Chúc bạn làm tốt! 🚀**

