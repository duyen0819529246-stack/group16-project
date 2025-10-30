# 🔀 GIT COMMANDS CHO SINH VIÊN 1

## 🎯 MỤC TIÊU
Push code Backend lên GitHub repository: https://github.com/duyen0819529246-stack/group16-project.git

---

## ✅ CHUẨN BỊ

### 1. Kiểm tra Git đã cài chưa
```bash
git --version
```

### 2. Kiểm tra remote repository
```bash
cd E:\downloads\group16-project-main
git remote -v
```

**Kết quả mong đợi:**
```
origin  https://github.com/duyen0819529246-stack/group16-project.git (fetch)
origin  https://github.com/duyen0819529246-stack/group16-project.git (push)
```

**Nếu chưa có remote:**
```bash
git remote add origin https://github.com/duyen0819529246-stack/group16-project.git
```

---

## 🚀 OPTION 1: 3 SINH VIÊN PUSH VÀO 1 NHÁNH (KHUYẾN NGHỊ)

### SV1: Tạo nhánh và push đầu tiên

```bash
# 1. Kiểm tra status
git status

# 2. Tạo nhánh mới từ main
git checkout main
git pull origin main
git checkout -b feature/avatar-upload

# 3. Add các file backend
git add backend/controllers/userController.js
git add backend/middleware/uploadMiddleware.js
git add backend/routes/userRoutes.js
git add backend/models/userModel.js
git add backend/.env.example
git add backend/tests/testAvatarUpload.js

# Hoặc add tất cả backend
git add backend/

# 4. Add các file docs
git add HUONG_DAN_SV1_BACKEND.md
git add GIT_COMMANDS_SV1.md
git add HOATDONG3_AVATAR_UPLOAD.md
git add HOATDONG3_SUMMARY.md

# 5. Commit
git commit -m "SV1: Hoàn thành backend API upload avatar

- Thêm uploadAvatar controller với Sharp resize
- Cấu hình Multer memory storage
- Tích hợp Cloudinary upload
- Route POST /profile/avatar với JWT auth
- File validation (type, size)
- .env.example template
- Test script và documentation
"

# 6. Push lên GitHub
git push origin feature/avatar-upload
```

### SV2: Pull nhánh và push frontend

```bash
# 1. Fetch và checkout nhánh
git fetch origin
git checkout feature/avatar-upload

# 2. Pull code mới nhất của SV1
git pull origin feature/avatar-upload

# 3. Làm frontend...
# (Code của SV2)

# 4. Add và commit
git add frontend/
git commit -m "SV2: Hoàn thành frontend upload avatar"

# 5. Push
git push origin feature/avatar-upload
```

### SV3: Pull nhánh và push testing

```bash
# 1. Checkout nhánh
git fetch origin
git checkout feature/avatar-upload

# 2. Pull code của SV1 + SV2
git pull origin feature/avatar-upload

# 3. Làm testing & docs...
# (Code của SV3)

# 4. Add và commit
git add .
git commit -m "SV3: Hoàn thành test và docs cho avatar upload"

# 5. Push
git push origin feature/avatar-upload
```

---

## 🔀 OPTION 2: MỖI SINH VIÊN 1 NHÁNH RIÊNG

### SV1: Backend

```bash
# Tạo nhánh riêng
git checkout -b feature/avatar-backend

# Add, commit, push
git add backend/
git commit -m "SV1: Backend API upload avatar"
git push origin feature/avatar-backend
```

### SV2: Frontend

```bash
# Tạo nhánh riêng
git checkout -b feature/avatar-frontend

# Add, commit, push
git add frontend/
git commit -m "SV2: Frontend upload avatar"
git push origin feature/avatar-frontend
```

### SV3: Testing

```bash
# Tạo nhánh riêng
git checkout -b feature/avatar-testing

# Add, commit, push
git add backend/tests/
git commit -m "SV3: Test và docs"
git push origin feature/avatar-testing
```

---

## 📝 COMMIT MESSAGE TEMPLATES

### Template 1: Chi tiết
```bash
git commit -m "SV1: Hoàn thành backend API upload avatar

Chi tiết:
- uploadAvatar controller với Sharp resize (400x400px)
- Multer middleware với memory storage
- Cloudinary integration (folder: avatars)
- JWT authentication middleware
- File validation (type: image/*, size: 5MB)
- API endpoint: POST /api/users/profile/avatar
- Error handling đầy đủ
- Test script và documentation

Tested:
- Upload với Postman: ✅
- URL lưu vào MongoDB: ✅
- Ảnh xuất hiện trên Cloudinary: ✅
"
```

### Template 2: Ngắn gọn
```bash
git commit -m "SV1: Backend API upload avatar với Sharp + Cloudinary"
```

### Template 3: Emoji (optional)
```bash
git commit -m "✨ SV1: Thêm API upload avatar

🔧 Sharp resize 400x400px
☁️ Cloudinary integration
🔒 JWT authentication
📝 Documentation
"
```

---

## 🆘 XỬ LÝ CONFLICT

### Nếu có conflict khi pull

```bash
# Pull bị conflict
git pull origin feature/avatar-upload

# Git sẽ báo:
# CONFLICT in file.js
# Automatic merge failed; fix conflicts and then commit the result.

# 1. Mở file bị conflict
# Tìm các dòng:
<<<<<<< HEAD
Your changes (code của bạn)
=======
Their changes (code của người khác)
>>>>>>> origin/feature/avatar-upload

# 2. Sửa file, chọn code nào giữ lại

# 3. Add file đã sửa
git add file.js

# 4. Commit
git commit -m "Resolve conflict in file.js"

# 5. Push
git push origin feature/avatar-upload
```

### Tránh conflict

```bash
# LUÔN PULL TRƯỚC KHI PUSH
git pull origin feature/avatar-upload
# ... không có conflict ...
git push origin feature/avatar-upload
```

---

## 📊 KIỂM TRA TRƯỚC KHI PUSH

```bash
# 1. Kiểm tra branch hiện tại
git branch
# → * feature/avatar-upload

# 2. Kiểm tra file sẽ commit
git status

# 3. Xem diff (thay đổi)
git diff

# 4. Xem diff của file đã stage
git diff --staged

# 5. Xem commit history
git log --oneline
```

---

## 🔍 COMMANDS HỮU ÍCH

### Xem thông tin

```bash
# Xem status
git status

# Xem branch
git branch -a

# Xem remote
git remote -v

# Xem log
git log --oneline --graph --all

# Xem diff
git diff
```

### Undo changes

```bash
# Undo file chưa stage
git checkout -- file.js

# Unstage file
git reset HEAD file.js

# Undo commit (giữ lại changes)
git reset --soft HEAD~1

# Undo commit (xóa changes)
git reset --hard HEAD~1
```

### Branch management

```bash
# Tạo branch mới
git checkout -b new-branch

# Chuyển branch
git checkout branch-name

# Xóa branch local
git branch -d branch-name

# Xóa branch remote
git push origin --delete branch-name
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. KHÔNG commit file `.env`
```bash
# File .env đã có trong .gitignore
# Không bao giờ commit file này lên GitHub!

# Kiểm tra:
cat .gitignore | grep .env
# → .env
```

### 2. LUÔN pull trước khi push
```bash
# ĐÚNG:
git pull origin feature/avatar-upload
git push origin feature/avatar-upload

# SAI:
git push origin feature/avatar-upload  # Có thể bị reject!
```

### 3. Commit message rõ ràng
```bash
# ĐÚNG:
git commit -m "SV1: Thêm API upload avatar với Sharp và Cloudinary"

# SAI:
git commit -m "update"
git commit -m "fix"
git commit -m "abc123"
```

### 4. Không push lên main/master trực tiếp
```bash
# ĐÚNG:
git push origin feature/avatar-upload  # Push vào feature branch

# SAI:
git push origin main  # Không push trực tiếp vào main
```

---

## 🎯 WORKFLOW HOÀN CHỈNH

```bash
# === SETUP (LẦN ĐẦU) ===
cd E:\downloads\group16-project-main
git remote add origin https://github.com/duyen0819529246-stack/group16-project.git

# === SV1 (BACKEND) ===
# 1. Tạo nhánh
git checkout main
git pull origin main
git checkout -b feature/avatar-upload

# 2. Code backend...
# (Đã xong!)

# 3. Add files
git add backend/
git add HUONG_DAN_SV1_BACKEND.md
git add GIT_COMMANDS_SV1.md

# 4. Commit
git commit -m "SV1: Hoàn thành backend API upload avatar

- uploadAvatar controller với Sharp resize
- Multer memory storage
- Cloudinary integration
- JWT authentication
- Documentation
"

# 5. Push
git push origin feature/avatar-upload

# === SV2 (FRONTEND) ===
git fetch origin
git checkout feature/avatar-upload
git pull origin feature/avatar-upload

# Code frontend...

git add frontend/
git commit -m "SV2: Frontend upload avatar"
git push origin feature/avatar-upload

# === SV3 (TESTING) ===
git fetch origin
git checkout feature/avatar-upload
git pull origin feature/avatar-upload

# Test và docs...

git add .
git commit -m "SV3: Test và docs"
git push origin feature/avatar-upload

# === TẠO PULL REQUEST ===
# Lên GitHub → Create Pull Request
# feature/avatar-upload → main
```

---

## 🌐 TẠO PULL REQUEST TRÊN GITHUB

### Bước 1: Push xong
```bash
git push origin feature/avatar-upload
```

### Bước 2: Lên GitHub
1. Mở: https://github.com/duyen0819529246-stack/group16-project
2. Thấy banner: "feature/avatar-upload had recent pushes"
3. Click **Compare & pull request**

### Bước 3: Điền thông tin PR
```
Title: [Hoạt động 3] Upload Avatar với Sharp + Cloudinary

Description:
## 📋 Tính năng
Upload ảnh đại diện với xử lý resize tự động và lưu trữ trên Cloudinary.

## ✅ Đã hoàn thành
- [x] SV1: Backend API với Multer + Sharp + Cloudinary
- [x] SV2: Frontend upload form và avatar display
- [x] SV3: Cloudinary setup, testing và documentation

## 🧪 Test
- ✅ Upload với Postman
- ✅ Upload qua Frontend
- ✅ URL lưu vào MongoDB
- ✅ Ảnh resize chính xác 400x400px

## 📚 Documentation
- HUONG_DAN_SV1_BACKEND.md
- HOATDONG3_AVATAR_UPLOAD.md
- HOATDONG3_SUMMARY.md
```

### Bước 4: Create Pull Request
Click **Create pull request**

---

## 📞 HỖ TRỢ

### Lỗi: "Permission denied"
```bash
# Chưa đăng nhập GitHub
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Hoặc dùng GitHub Desktop
```

### Lỗi: "Remote origin already exists"
```bash
# Xóa remote cũ
git remote remove origin

# Add lại
git remote add origin https://github.com/duyen0819529246-stack/group16-project.git
```

### Lỗi: "Branch already exists"
```bash
# Xóa branch local
git branch -d feature/avatar-upload

# Tạo lại
git checkout -b feature/avatar-upload
```

---

## ✅ CHECKLIST TRƯỚC KHI PUSH

- [ ] Đã test code local
- [ ] Đã kiểm tra không có file .env
- [ ] Commit message rõ ràng
- [ ] Đã pull code mới nhất
- [ ] Đã review changes (git diff)
- [ ] Push vào feature branch (không phải main)

---

**Sẵn sàng push! 🚀**

Nếu gặp vấn đề, hãy kiểm tra lại từng bước hoặc liên hệ team.


