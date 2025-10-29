# 🔑 HƯỚNG DẪN TEST QUÊN MẬT KHẨU

## ⚡ CÁCH TEST NHANH (KHÔNG CẦN EMAIL THẬT)

Backend đang ở **development mode**, sẽ trả về token luôn trong response!

### Bước 1: Reload frontend
```
Ctrl + Shift + R
```

### Bước 2: Vào trang Quên mật khẩu
```
http://localhost:3000/forgot-password
```

### Bước 3: Nhập email BẤT KỲ
```
Duyen0819529246@gmail.com
```

### Bước 4: Mở DevTools → Network tab
- F12
- Tab Network
- Click "Gửi link đặt lại"
- Click vào request `forgot-password`
- Tab **Response**

### Bước 5: Copy token từ response
Response sẽ có:
```json
{
  "message": "...",
  "resetToken": "abc123xyz..." ← COPY CÁI NÀY
}
```

### Bước 6: Vào link reset với token
```
http://localhost:3000/reset-password/abc123xyz...
```

### Bước 7: Nhập mật khẩu mới → Done!

---

## 📧 NẾU MUỐN GỬI EMAIL THẬT

Email đã được config với Gmail SMTP. Nếu không nhận được email:

### Check:
1. **Inbox** - Email chính
2. **Spam/Junk** - Gmail có thể chặn
3. **Gmail "Less secure app"** - Cần bật nếu dùng password thường
4. **App Password** - Nên dùng App Password thay vì mật khẩu thật

### Hoặc dùng Mailtrap (Free):
1. Vào https://mailtrap.io
2. Đăng ký free
3. Copy SMTP credentials
4. Paste vào backend/.env
5. Mọi email sẽ vào Mailtrap inbox

---

## ✅ HIỆN TẠI

**Email đang hoạt động** (SMTP verified thành công)

**Nhưng để test nhanh hơn** → Dùng `resetToken` từ response!


