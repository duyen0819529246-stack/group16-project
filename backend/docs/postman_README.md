# Postman collection for Group16 Auth

Import the provided collection and environment into Postman to quickly test the API.

Steps:

1. Open Postman → Import → chọn file `postman_collection.json`.
2. Import `postman_environment.json` as an environment, rồi chọn nó (top-right).
3. Chỉnh sửa environment nếu cần (ví dụ `baseUrl` nếu server chạy ở port khác).
4. Chạy requests theo thứ tự:
   - Signup (tạo user) — body dùng timestamp để tạo email duy nhất.
   - Login — tests sẽ lưu `authToken` vào environment tự động.
   - Get Users — sử dụng header Authorization: Bearer {{authToken}}
   - Logout — thử xoá token.

Notes:
- Nếu login không thành công, kiểm tra server logs và `.env` (JWT_SECRET và MONGO_URI).
- Bạn có thể export screenshot từ Postman để nộp bài.
