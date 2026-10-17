# demoChuong - Backend Java và giao diện quản lý thư viện

## Thành phần hiện có

- Spring Boot REST API cho Sách (`/api/sach`), Độc giả (`/api/docGia`) và Phiếu mượn (`/api/phieuMuon`).
- Giao diện web tĩnh đặt trong `src/main/resources/static/`, Spring Boot phục vụ tại cùng origin.
- JDBC DAO và giao diện Java Swing sách/độc giả đã có trong project.
- SQL tham khảo tại `database/quan_ly_thu_vien_day_du.sql`.

## Điều kiện

- JDK 17 trở lên.
- Maven 3.9 trở lên (hoặc IDE hỗ trợ Maven).
- MySQL 8 / MariaDB tương thích.

## Cách chạy

1. Tạo/import database từ `database/quan_ly_thu_vien_day_du.sql` bằng phpMyAdmin hoặc MySQL.
2. Kiểm tra `src/main/resources/application.properties`:
   - database: `quan_ly_thu_vien`
   - username: `root`
   - password: để trống theo cấu hình XAMPP mặc định, hoặc sửa cho đúng máy bạn.
3. Mở terminal tại thư mục chứa `pom.xml` và chạy:

   ```bash
   mvn spring-boot:run
   ```

4. Mở giao diện: http://localhost:8080/
5. Kiểm tra API:
   - `GET http://localhost:8080/api/sach`
   - `GET http://localhost:8080/api/docGia`
   - `GET http://localhost:8080/api/phieuMuon`

## Chức năng giao diện

Giao diện hiện kết nối với 3 nhóm API đã có sẵn trong mã Java:

- Sách: danh sách, tìm kiếm, thêm, sửa, xóa.
- Độc giả: danh sách, tìm kiếm, thêm, sửa, xóa.
- Phiếu mượn: danh sách, lọc theo ID độc giả, thêm, sửa, xóa.

Các trường dữ liệu gửi theo tên thuộc tính của DTO Java. Nếu xóa bản ghi đang được bảng khác tham chiếu, MySQL có thể từ chối xóa để bảo vệ khóa ngoại.

## Những phần chưa được triển khai trong mã Java hiện tại

File SQL có nhiều bảng nghiệp vụ hơn ba nhóm API hiện có. Các API/controller/service cho tài khoản, nhân viên, thẻ thư viện, danh mục, tác giả, nhà xuất bản, sách-tác giả, bản sao sách, chi tiết phiếu mượn, tiền phạt, chi tiết thanh toán phạt và đặt trước sách chưa có đầy đủ trong project này. Giao diện không giả vờ cung cấp CRUD cho các bảng chưa có API.

## Giới hạn kiểm tra

File ZIP ban đầu thiếu `pom.xml`, vì vậy không thể chạy dự án Maven nguyên trạng. Đã bổ sung `pom.xml` cho Spring Boot Web, Spring Data JPA, MySQL và test. JavaScript giao diện đã được kiểm tra cú pháp bằng Node.js. Tuy nhiên cần chạy Maven và kết nối MySQL trên máy phát triển để xác nhận biên dịch và tích hợp thực tế.

Một số test hiện có (`JdbcDaoTest`, `SachRepositoryTest`, `ViewControllerTest`) chủ động kết nối và ghi dữ liệu vào MySQL. Chỉ chạy `mvn test` sau khi đã import SQL và kiểm tra dữ liệu mẫu/khóa ngoại phù hợp.
