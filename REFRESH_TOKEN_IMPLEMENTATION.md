# 🔐 Hướng dẫn Triển khai Refresh Token - Hoạt động 1

## ✅ Đã hoàn thành (SV2 - Frontend)

### 1. **AuthContext.jsx** - Quản lý 2 token
- ✅ Lưu `accessToken` và `refreshToken` vào localStorage
- ✅ Hàm `login()` nhận cả 2 token
- ✅ Hàm `logout()` gọi API revoke refresh token
- ✅ Kiểm tra token hết hạn khi khởi tạo

### 2. **api.js** - Auto Refresh Interceptor
- ✅ Request interceptor: Tự động gắn accessToken vào header
- ✅ Response interceptor: Tự động refresh khi nhận lỗi 401
- ✅ Queue management: Xử lý nhiều request đồng thời khi refresh
- ✅ Logout tự động khi refresh token hết hạn

### 3. **LoginForm.jsx** - Xử lý login
- ✅ Gọi `/auth/login` và nhận cả 2 token
- ✅ Hỗ trợ backward compatibility với format cũ

### 4. **SignupForm.jsx** - Xử lý signup
- ✅ Logic đã được xử lý trong AuthContext.signup()

---

## ⚠️ CẦN LÀM (SV1 & SV3 - Backend)

### **SV3: Tạo RefreshToken Model**

Tạo file: `backend/models/refreshTokenModel.js`

```javascript
import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: { 
      type: String, 
      required: true, 
      unique: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true 
    },
    isRevoked: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

// Tự động xóa token đã hết hạn
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("RefreshToken", refreshTokenSchema);
```

**Test:**
```javascript
// Test lưu refresh token
const token = await RefreshToken.create({
  token: "random_string_here",
  userId: user._id,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 ngày
});

// Test truy xuất
const found = await RefreshToken.findOne({ token: "random_string_here" });
console.log(found); // Should return the token
```

---

### **SV1: Cập nhật UserController**

Thêm vào `backend/controllers/userController.js`:

```javascript
import RefreshToken from "../models/refreshTokenModel.js";
import crypto from "crypto";

// 1. Tạo Access Token (thời gian ngắn - 15 phút)
const signAccessToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "15m" }
  );

// 2. Tạo Refresh Token
const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
  
  await RefreshToken.create({
    token,
    userId,
    expiresAt,
  });
  
  return token;
};

// 3. CẬP NHẬT Login - Trả về cả 2 token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    
    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) 
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    
    // Tạo cả 2 token
    const accessToken = signAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);
    
    res.json({ 
      message: "Đăng nhập thành công", 
      accessToken,
      refreshToken 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 4. API MỚI: Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Không có refresh token" });
    }
    
    // Tìm refresh token trong DB
    const tokenDoc = await RefreshToken.findOne({ 
      token: refreshToken,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!tokenDoc) {
      return res.status(401).json({ message: "Refresh token không hợp lệ hoặc đã hết hạn" });
    }
    
    // Tạo access token mới
    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }
    
    const newAccessToken = signAccessToken(user);
    
    res.json({ 
      accessToken: newAccessToken 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 5. CẬP NHẬT Logout - Revoke refresh token
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      // Revoke refresh token
      await RefreshToken.updateOne(
        { token: refreshToken },
        { isRevoked: true }
      );
    }
    
    res.json({ message: "Đã đăng xuất" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// 6. CẬP NHẬT Register - Trả về cả 2 token
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) 
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    
    const exists = await User.findOne({ email });
    if (exists) 
      return res.status(400).json({ message: "Email đã tồn tại" });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "user" });
    
    // Tạo cả 2 token
    const accessToken = signAccessToken(user);
    const refreshToken = await generateRefreshToken(user._id);
    
    res.status(201).json({ 
      message: "Đăng ký thành công", 
      accessToken,
      refreshToken 
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
```

---

### **SV1: Cập nhật Routes**

File: `backend/routes/authRoutes.js`

```javascript
import express from "express";
import { 
  loginUser, 
  registerUser, 
  getProfile, 
  refreshAccessToken,
  logout 
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);  // ⭐ API MỚI
router.post("/logout", logout);                // ⭐ CẬP NHẬT
router.get("/profile", protect, getProfile);

export default router;
```

File: `backend/server.js` - Đảm bảo có route `/api/auth`

```javascript
import authRoutes from "./routes/authRoutes.js";

// ...
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
```

---

## 🧪 Kiểm tra & Test

### 1. Test Backend

```bash
# Trong terminal backend
cd backend
npm install
npm start
```

**Test với Postman:**

1. **Register/Login** → Nhận `accessToken` + `refreshToken`
2. **Gọi /auth/profile** với accessToken → OK
3. **Đợi 15 phút** (hoặc set token expire = 1m để test nhanh)
4. **Gọi /auth/refresh** với refreshToken → Nhận accessToken mới
5. **Gọi /auth/logout** với refreshToken → Token bị revoke

### 2. Test Frontend

```bash
# Trong terminal frontend
cd frontend
npm start
```

**Luồng test:**
1. Đăng nhập → Mở DevTools → Application → LocalStorage → Kiểm tra có 2 token
2. Đợi token hết hạn → Gọi API bất kỳ → Tự động refresh
3. Logout → Token bị xóa khỏi localStorage

---

## 📊 Sơ đồ Luồng hoạt động

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│  Server trả về:             │
│  - accessToken (15m)        │
│  - refreshToken (7d)        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Lưu vào localStorage       │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Gọi API với accessToken    │
└──────┬──────────────────────┘
       │
       ├─── OK → Trả về data
       │
       └─── 401 (Token hết hạn)
              │
              ▼
       ┌─────────────────────┐
       │ Auto call /refresh  │
       │ với refreshToken    │
       └─────┬───────────────┘
             │
             ├─── OK → Lưu accessToken mới → Retry request
             │
             └─── 401 → Logout → Redirect /login
```

---

## 🎯 Checklist Hoàn thành

### Backend (SV1 & SV3)
- [ ] Tạo RefreshToken model
- [ ] Test lưu/truy xuất RefreshToken
- [ ] Cập nhật loginUser trả về 2 token
- [ ] Cập nhật registerUser trả về 2 token
- [ ] Tạo API /auth/refresh
- [ ] Cập nhật logout để revoke token
- [ ] Cập nhật routes

### Frontend (SV2) - ✅ ĐÃ HOÀN THÀNH
- [x] Cập nhật AuthContext
- [x] Thêm auto-refresh interceptor
- [x] Cập nhật LoginForm
- [x] Cập nhật SignupForm

---

## 📝 Ghi chú quan trọng

1. **Access Token ngắn (15m)**: Giảm rủi ro nếu bị đánh cắp
2. **Refresh Token dài (7d)**: Tránh người dùng phải login lại liên tục
3. **Revoke khi logout**: Đảm bảo token không thể tái sử dụng
4. **Queue management**: Tránh gọi refresh nhiều lần cùng lúc
5. **Backward compatibility**: Frontend vẫn hoạt động với format token cũ

---

## 🚀 Sau khi hoàn thành

Khi backend đã sẵn sàng:
1. Restart cả backend và frontend
2. Test đăng nhập → Kiểm tra localStorage
3. Test logout → Kiểm tra token đã bị xóa
4. Test auto-refresh → Đợi token hết hạn và gọi API

**Chúc bạn thành công!** 🎉

