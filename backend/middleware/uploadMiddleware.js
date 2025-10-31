import multer from "multer";

// Sử dụng memory storage để có thể xử lý ảnh bằng Sharp trước khi upload lên Cloudinary
const storage = multer.memoryStorage();

// Giới hạn file size và chỉ cho phép ảnh
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
  },
});

export default upload;
