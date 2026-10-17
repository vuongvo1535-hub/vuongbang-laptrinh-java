# Frontend hệ thống quản lý thư viện

Frontend được dựng dựa trên khung Next.js được cung cấp và các bảng nghiệp vụ trong `quan_ly_thu_vien_day_du.sql`.

## Cài đặt và chạy

1. Cài Node.js phiên bản tương thích.
2. Mở terminal tại thư mục frontend.
3. Chạy `npm install`.
4. Chỉnh `src/config/api.js` để BASE_URL trỏ đến Backend đang chạy.
5. Chạy `npm run dev`.

## CRUD hiện có

Trang quản lý dùng chung tại `/admin/quan-ly/[resource]` có danh sách, thêm, sửa, xóa cho các bảng nghiệp vụ được cấu hình trong `src/data/libraryResources.js`.

## Endpoint Backend

Frontend hiện gọi endpoint REST theo tên bảng:
- GET `/api/{table}`
- POST `/api/{table}`
- PUT `/api/{table}/{id}`
- DELETE `/api/{table}/{id}`

Ví dụ bảng sách: `/api/sach`.

Backend chưa được cung cấp trong gói đầu vào, nên endpoint thực tế cần được đối chiếu với `routes/api.php` của Backend. Nếu Backend đặt tên endpoint khác, cập nhật `endpoint` trong `src/data/libraryResources.js`.

## Lưu ý bảo mật và database

- Bảng `personal_access_tokens` là bảng kỹ thuật của Sanctum, không được đưa vào giao diện CRUD.
- Trường `mat_khau` chỉ là input gửi lên API; Backend phải hash mật khẩu bằng cơ chế an toàn, không lưu mật khẩu thô.
- Các quan hệ được nhập bằng ID ở phiên bản khung này. Có thể nâng cấp thành dropdown sau khi xác nhận API danh sách liên quan.
- Không chạy lệnh xóa database để dùng frontend.
