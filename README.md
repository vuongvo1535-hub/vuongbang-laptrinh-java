HỆ THỐNG QUẢN LÝ THƯ VIỆN
Dự án website quản lý thư viện với Spring Boot (Java) ở Backend, Next.js ở Frontend và MariaDB để lưu trữ dữ liệu.
> **Lưu ý:** README này hướng dẫn chạy dự án theo cấu trúc đã trao đổi. Trước khi triển khai trên máy khác, hãy đối chiếu cấu hình thực tế trong `backend` và `frontend` (cổng, biến môi trường, tài khoản cơ sở dữ liệu và các script).
1. Yêu cầu môi trường
Công cụ	Mục đích
JDK 21	Biên dịch và chạy Java
Apache Maven 3.9.x	Quản lý thư viện và chạy Spring Boot
Node.js và npm	Chạy Next.js
XAMPP (MariaDB)	Cung cấp cơ sở dữ liệu
Visual Studio Code (hoặc IDE khác)	Mở mã nguồn
Trình duyệt web	Sử dụng website
Kiểm tra công cụ bằng Terminal:
```powershell
java -version
mvn -version
node -v
npm.cmd -v
```
2. Cấu trúc thư mục
```text
vuongbang-laptrinh-java/
├── backend/             # Ứng dụng Spring Boot
│   ├── src/
│   └── pom.xml
├── frontend/            # Ứng dụng Next.js
│   ├── app/
│   └── package.json
└── README.md
```
3. Chuẩn bị cơ sở dữ liệu
Mở XAMPP Control Panel.
Nhấn Start ở mục MySQL (MariaDB).
Mở `http://localhost/phpmyadmin`.
Kiểm tra cơ sở dữ liệu `quan_ly_thu_vien` và các bảng cần thiết.
Kiểm tra cấu hình kết nối cơ sở dữ liệu trong Backend để bảo đảm tên database, cổng, tài khoản và mật khẩu phù hợp với máy đang chạy.
Quan trọng: Nếu chưa có dữ liệu, cần sử dụng bản SQL hoặc quy trình khởi tạo dữ liệu được nhóm cung cấp. Không tự ý xóa database, chạy migration hoặc bật chế độ tự tạo lại bảng khi chưa kiểm tra và sao lưu dữ liệu.
4. Khởi động Backend (Spring Boot)
Mở Terminal thứ nhất và chạy:
```powershell
cd D:\vuongbang-laptrinh-java\backend
mvn spring-boot:run
```
Chờ thông báo Spring Boot khởi động thành công. Backend dự kiến chạy tại:
```text
http://localhost:8080
```
Giữ Terminal này mở khi sử dụng website. Nếu Maven chưa được thêm vào `PATH`, cần cấu hình Maven hoặc dùng Maven Wrapper nếu project có cung cấp.
5. Khởi động Frontend (Next.js)
Mở Terminal thứ hai, sau đó chạy:
```powershell
cd D:\vuongbang-laptrinh-java\frontend
npm.cmd install
npm.cmd run dev
```
Lệnh `npm.cmd install` dùng để cài thư viện; các lần chạy tiếp theo thường chỉ cần `npm.cmd run dev`.
Mở trình duyệt tại:
Website: http://localhost:3000
Trang quản trị: http://localhost:3000/admin
Nếu cổng `3000` đang được sử dụng, hãy dùng đúng địa chỉ mà Next.js hiển thị trong Terminal.
6. Thứ tự chạy dự án
MariaDB: Khởi động MySQL trong XAMPP.
Backend: Chạy `mvn spring-boot:run` trong thư mục `backend`.
Frontend: Chạy `npm.cmd run dev` trong thư mục `frontend`.
Trình duyệt: Truy cập `http://localhost:3000/admin`.
7. Kiểm tra sau khi chạy
Kiểm tra các chức năng có trong phiên bản project đang sử dụng:
[ ] Website và trang quản trị hiển thị bình thường.
[ ] Danh sách sách và danh mục tải được dữ liệu.
[ ] Quản lý độc giả hoạt động.
[ ] Tạo, xem và quản lý phiếu mượn hoạt động.
[ ] Chức năng trả sách cập nhật đúng trạng thái.
[ ] Tiền phạt quá hạn hiển thị đúng theo dữ liệu.
[ ] Mã QR thanh toán hiển thị khi chức năng được cấu hình.
> Danh sách trên là **checklist kiểm tra**, không phải xác nhận rằng mọi chức năng đều đã vượt qua kiểm thử.
8. Xử lý lỗi thường gặp
Lỗi	Hướng xử lý
`java is not recognized`	Kiểm tra cài đặt JDK, `JAVA_HOME` và `PATH`.
`mvn is not recognized`	Kiểm tra cài đặt Maven và `PATH`.
`npm.ps1 cannot be loaded`	Sử dụng `npm.cmd` thay cho `npm` trong PowerShell.
`ENOENT package.json`	Chuyển vào đúng thư mục `frontend` trước khi chạy npm.
Backend không kết nối database	Kiểm tra MariaDB đã chạy và cấu hình kết nối Backend.
Frontend không tải dữ liệu	Kiểm tra Backend, địa chỉ API và thông báo lỗi trong Terminal.
Cổng 8080 hoặc 3000 bị chiếm	Kiểm tra ứng dụng đang dùng cổng hoặc điều chỉnh cấu hình phù hợp.
9. Lưu ý khi chia sẻ mã nguồn
Không đưa mật khẩu database, mật khẩu email, API key hoặc token thật lên GitHub.
Không commit file `.env` chứa thông tin bí mật; cung cấp file mẫu không chứa thông tin nhạy cảm nếu cần.
Không thay đổi cấu trúc database hoặc xóa dữ liệu khi chưa được nhóm thống nhất.
Nếu chạy trên máy khác, thay `D:\vuongbang-laptrinh-java` bằng đường dẫn thực tế của thư mục project.
---
Tóm tắt lệnh chạy:
```powershell
# Terminal 1: Backend
cd D:\vuongbang-laptrinh-java\backend
mvn spring-boot:run

# Terminal 2: Frontend
cd D:\vuongbang-laptrinh-java\frontend
npm.cmd install
npm.cmd run dev
```
