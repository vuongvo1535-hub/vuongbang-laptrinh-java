package com.example.demoChuong.util; // Khai báo package chứa lớp tiện ích kết nối cơ sở dữ liệu

import java.io.IOException; // Nhập lớp dùng để xử lý lỗi khi đọc file cấu hình
import java.io.InputStream; // Nhập lớp dùng để đọc dữ liệu từ file cấu hình
import java.sql.Connection; // Nhập lớp đại diện cho một kết nối JDBC
import java.sql.DriverManager; // Nhập lớp dùng để mở kết nối JDBC
import java.sql.SQLException; // Nhập lớp mô tả lỗi khi làm việc với cơ sở dữ liệu
import java.util.Properties; // Nhập lớp dùng để lưu các giá trị cấu hình

public final class DatabaseConnection { // Khai báo lớp tiện ích quản lý kết nối MySQL
    private static final String TEN_DRIVER = "com.mysql.cj.jdbc.Driver"; // Khai báo tên driver JDBC của MySQL
    private static final Properties CAU_HINH = docCauHinh(); // Đọc cấu hình một lần khi lớp được sử dụng

    private DatabaseConnection() { // Tạo hàm khởi tạo riêng để không tạo đối tượng tiện ích
    } // Kết thúc hàm khởi tạo riêng

    public static Connection getConnection() throws SQLException { // Tạo phương thức mở kết nối đến MySQL
        napDriverMySQL(); // Kiểm tra driver MySQL đã được nạp hay chưa
        String duongDan = layGiaTri("DB_URL", "spring.datasource.url"); // Lấy đường dẫn kết nối từ biến môi trường hoặc file cấu hình
        String tenDangNhap = layGiaTri("DB_USERNAME", "spring.datasource.username"); // Lấy tên đăng nhập mà không ghi trực tiếp trong mã nguồn
        String matKhau = layGiaTri("DB_PASSWORD", "spring.datasource.password"); // Lấy mật khẩu nhưng không in ra màn hình
        kiemTraCauHinh(duongDan, tenDangNhap); // Kiểm tra các thông tin bắt buộc trước khi kết nối
        return DriverManager.getConnection(duongDan, tenDangNhap, matKhau); // Mở và trả về kết nối JDBC
    } // Kết thúc phương thức getConnection

    public static boolean kiemTraKetNoi() { // Tạo phương thức kiểm tra kết nối đơn giản
        try (Connection connection = getConnection()) { // Tự động đóng kết nối sau khi kiểm tra
            return connection.isValid(3); // Chờ tối đa ba giây để xác nhận kết nối còn hợp lệ
        } catch (SQLException | IllegalStateException exception) { // Bắt lỗi cấu hình hoặc lỗi kết nối cơ sở dữ liệu
            return false; // Trả về false và không làm lộ mật khẩu kết nối
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức kiemTraKetNoi

    private static void napDriverMySQL() { // Tạo phương thức nạp driver MySQL
        try { // Bắt đầu khối kiểm tra driver
            Class.forName(TEN_DRIVER); // Yêu cầu Java nạp lớp driver MySQL
        } catch (ClassNotFoundException exception) { // Bắt lỗi khi thư viện MySQL Connector chưa có
            throw new IllegalStateException("Không tìm thấy MySQL Connector/J trong project", exception); // Báo lỗi rõ ràng nhưng không chứa thông tin đăng nhập
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức napDriverMySQL

    private static Properties docCauHinh() { // Tạo phương thức đọc file application.properties
        Properties properties = new Properties(); // Tạo đối tượng lưu các cặp khóa và giá trị cấu hình
        try (InputStream input = DatabaseConnection.class.getClassLoader().getResourceAsStream("application.properties")) { // Mở file cấu hình từ classpath
            if (input == null) { // Kiểm tra file cấu hình có tồn tại hay không
                throw new IllegalStateException("Không tìm thấy file application.properties"); // Báo lỗi nếu project thiếu file cấu hình
            } // Kết thúc điều kiện kiểm tra file
            properties.load(input); // Đọc toàn bộ cấu hình vào đối tượng Properties
            return properties; // Trả về cấu hình đã đọc
        } catch (IOException exception) { // Bắt lỗi khi không thể đọc file cấu hình
            throw new IllegalStateException("Không thể đọc file application.properties", exception); // Chuyển lỗi đọc file thành thông báo dễ hiểu
        } // Kết thúc khối bắt lỗi
    } // Kết thúc phương thức docCauHinh

    private static String layGiaTri(String tenBienMoiTruong, String tenThuocTinh) { // Tạo phương thức ưu tiên cấu hình từ biến môi trường
        String giaTriMoiTruong = System.getenv(tenBienMoiTruong); // Đọc giá trị biến môi trường nếu người dùng đã thiết lập
        if (giaTriMoiTruong != null && !giaTriMoiTruong.isBlank()) { // Kiểm tra biến môi trường có giá trị sử dụng được
            return giaTriMoiTruong; // Trả về giá trị biến môi trường để không cần sửa file cấu hình
        } // Kết thúc điều kiện kiểm tra biến môi trường
        return CAU_HINH.getProperty(tenThuocTinh, ""); // Trả về giá trị trong application.properties hoặc chuỗi rỗng
    } // Kết thúc phương thức layGiaTri

    private static void kiemTraCauHinh(String duongDan, String tenDangNhap) { // Tạo phương thức kiểm tra cấu hình bắt buộc
        if (duongDan == null || duongDan.isBlank()) { // Kiểm tra đường dẫn kết nối có bị thiếu hay không
            throw new IllegalStateException("Thiếu cấu hình spring.datasource.url"); // Báo lỗi khi thiếu đường dẫn kết nối
        } // Kết thúc điều kiện kiểm tra đường dẫn
        if (tenDangNhap == null || tenDangNhap.isBlank()) { // Kiểm tra tên đăng nhập có bị thiếu hay không
            throw new IllegalStateException("Thiếu cấu hình spring.datasource.username"); // Báo lỗi khi thiếu tên đăng nhập
        } // Kết thúc điều kiện kiểm tra tên đăng nhập
    } // Kết thúc phương thức kiemTraCauHinh
} // Kết thúc lớp DatabaseConnection
