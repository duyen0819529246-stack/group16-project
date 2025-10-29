# SV3: Email Service Configuration & Testing

**Thực hiện bởi:** Nguyen222285

## Công việc đã hoàn thành:

### 1. Nodemailer Setup
- **File:** `backend/utils/sendEmail.js`
- **Chức năng:**
  - Cấu hình Nodemailer với Gmail SMTP
  - Hỗ trợ cả môi trường development và production
  - Fallback console.log nếu chưa config SMTP
  - Email verification on startup

### 2. Gmail SMTP Configuration
- **Server:** smtp.gmail.com
- **Port:** 587 (STARTTLS) hoặc 465 (SSL)
- **Authentication:** Gmail App Password
- **Variables in `.env`:**
  ```
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-16-char-app-password
  SMTP_FROM=your-email@gmail.com
  ```

### 3. Email Template
- Reset password link với token
- Thời gian expire: 1 giờ
- Professional email format
- Clear instructions cho user

### 4. Testing
- ✅ Test SMTP connection
- ✅ Test email delivery
- ✅ Verify token in email
- ✅ Test với email thật
- ✅ Postman testing: forgot-password flow

### 5. Security
- Token hash với SHA256
- Token expire sau 1 giờ
- Mỗi request tạo token mới
- Old token tự động invalidate

---

**Status:** ✅ Email service hoàn thành và tested
**Date:** 2025-10-29

