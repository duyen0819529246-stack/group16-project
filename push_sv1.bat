@echo off
REM Script push code SV1 lên GitHub
REM Chạy file này trong PowerShell hoặc CMD

echo ========================================
echo   PUSH CODE SV1 - BACKEND API
echo ========================================
echo.

REM Kiểm tra xem đang ở nhánh nào
echo Checking current branch...
git branch
echo.

REM Tạo nhánh mới feature/avatar-upload
echo Creating feature branch...
git checkout -b feature/avatar-upload 2>nul
if errorlevel 1 (
    echo Branch already exists, switching to it...
    git checkout feature/avatar-upload
)
echo.

REM Add các file documentation
echo Adding documentation files...
git add HUONG_DAN_SV1_BACKEND.md
git add GIT_COMMANDS_SV1.md
git add SV1_QUICK_START.md
git add HOATDONG3_AVATAR_UPLOAD.md
git add HOATDONG3_SUMMARY.md
git add TESTING_AVATAR_UPLOAD.md
git add QUICK_START_HOATDONG3.md
echo.

REM Add các file backend quan trọng (nếu chưa có trong git)
echo Adding backend files...
git add backend/controllers/userController.js
git add backend/middleware/uploadMiddleware.js
git add backend/routes/userRoutes.js
git add backend/models/userModel.js
git add backend/package.json
git add backend/package-lock.json
git add backend/tests/testAvatarUpload.js
echo.

REM Add file .gitignore và các file root khác
git add .gitignore
echo.

REM Show status
echo Current status:
git status
echo.

REM Commit
echo Committing changes...
git commit -m "SV1: Hoàn thành backend API upload avatar với Sharp và Cloudinary

Chi tiết:
- uploadAvatar controller với Sharp resize (400x400px)
- Multer middleware với memory storage
- Cloudinary integration (folder: avatars)
- JWT authentication
- File validation (type: image/*, size: 5MB max)
- API endpoint: POST /api/users/profile/avatar
- Test script và documentation đầy đủ

Files:
- backend/controllers/userController.js (uploadAvatar function)
- backend/middleware/uploadMiddleware.js (Multer config)
- backend/routes/userRoutes.js (API route)
- backend/tests/testAvatarUpload.js (Test script)
- Documentation: HUONG_DAN_SV1_BACKEND.md, SV1_QUICK_START.md
"
echo.

REM Push lên GitHub
echo Pushing to GitHub...
git push origin feature/avatar-upload
echo.

echo ========================================
echo   PUSH COMPLETED!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://github.com/duyen0819529246-stack/group16-project
echo 2. Create Pull Request from feature/avatar-upload to main
echo 3. Báo SV2 và SV3 biết đã push xong
echo.

pause

