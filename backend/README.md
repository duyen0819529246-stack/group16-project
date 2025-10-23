# Backend - Authentication (Sinh viên 1)

Tài liệu ngắn hướng dẫn chạy và test API đăng ký/đăng nhập/đăng xuất (signup/login/logout).

## Mục tiêu
- Cung cấp API cho nhóm: `/api/users/signup`, `/api/users/login`, `/api/users/logout`.
- Mã hoá mật khẩu bằng `bcryptjs`.
- Trả về JWT khi login thành công (dùng `jsonwebtoken`).

## Cài đặt
1. Cài dependencies

```powershell
cd F:\group16-project\backend
npm install
```

2. Thiết lập biến môi trường: tạo file `.env` ở `backend` với nội dung (ví dụ):

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xyz.mongodb.net/groupDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

> Lưu ý: file `.env` phải được lưu dưới encoding UTF-8 (không có BOM). Nếu `.env` được lưu bằng UTF-16, `dotenv` có thể không đọc được và `MONGO_URI` sẽ bị `undefined`.

## Nếu gặp lỗi `.env` không nạp được
- Trong repo đã có script nhỏ để chuyển `.env` từ UTF-16 LE sang UTF-8:

```powershell
node tools/convertEnv.js
```

- Sau đó khởi động lại server.

## Chạy server

```powershell
node server.js
```

Nếu mọi thứ OK, bạn sẽ thấy log:

- `🚀 Server running on port 5000`
- `✅ MongoDB connected: <host>`

## API (Sinh viên 1) — Endpoints
Base URL: `http://localhost:5000`

1) Đăng ký (Signup)
- POST `/api/users/signup`
- Body (JSON):

```json
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "age": 20,
  "password": "pass123"
}
```

- Response (201) ví dụ:
```json
{ "message": "Đăng ký thành công", "user": { "_id": "...", "name":"...", "email":"...", "age":20, "role":"user" } }
```

2) Đăng nhập (Login)
- POST `/api/users/login`
- Body (JSON):
```json
{ "email": "a@example.com", "password": "pass123" }
```
- Response (200) ví dụ:
```json
{ "message": "Đăng nhập thành công", "token": "<JWT token>" }
```

3) Đăng xuất (Logout)
- POST `/api/users/logout` – server chỉ trả message; client nên xóa token local.

4) Danh sách users (dùng cho test)
- GET `/api/users` – trả `password` bị loại (select '-password').

## Dùng token (ví dụ truy cập route cần auth)
- Thêm header:

```
Authorization: Bearer <token>
```

## Test nhanh bằng PowerShell (curl)

Ví dụ signup (PowerShell):
```powershell
curl.exe -X POST http://localhost:5000/api/users/signup -H "Content-Type: application/json" -d '{"name":"Tuan","email":"tuan@example.com","age":21,"password":"pass123"}'
```

Ví dụ login (PowerShell):
```powershell
$res = curl.exe -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d '{"email":"tuan@example.com","password":"pass123"}'
$res.Content
```

Sau khi có token, dùng header Authorization để gọi route bảo vệ.

## Ghi chú dành cho nhà phát triển
- `controllers/userController.js` chứa logic đăng ký/đăng nhập.
- `models/userModel.js` mở rộng với `password` và `role`.
- `routes/user.js` cung cấp các endpoint.
- Script `tools/convertEnv.js` chỉ dùng khi `.env` bị lưu ở UTF-16; nên xóa hoặc bỏ vào `.gitignore` khi deploy.

## Next steps (gợi ý cho nhóm)
- Thêm middleware xác thực JWT và route `GET /api/users/me` (Sinh viên 1).
- Frontend (Sinh viên 2): form signup/login, lưu token trong localStorage và hiển thị thông báo.
- Test Postman (Sinh viên 3): capture screenshots của signup/login responses và token.

---

Nếu bạn muốn, mình sẽ: xóa script convert khi mọi người đã cập nhật `.env`, hoặc thêm middleware bảo vệ token ngay bây giờ.
