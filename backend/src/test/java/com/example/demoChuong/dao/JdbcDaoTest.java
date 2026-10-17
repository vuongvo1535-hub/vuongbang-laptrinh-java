package com.example.demoChuong.dao; // Khai báo package chứa lớp kiểm thử DAO JDBC

import com.example.demoChuong.entity.DocGia; // Nhập lớp Model DocGia để tạo dữ liệu thử
import com.example.demoChuong.entity.Sach; // Nhập lớp Model Sach để tạo dữ liệu thử
import com.example.demoChuong.util.DatabaseConnection; // Nhập lớp dùng để kiểm tra kết nối MySQL
import org.junit.jupiter.api.Test; // Nhập chú thích đánh dấu phương thức kiểm thử

import java.math.BigDecimal; // Nhập kiểu số dùng cho giá tiền sách
import java.time.LocalDate; // Nhập kiểu ngày dùng cho thông tin độc giả

import static org.junit.jupiter.api.Assertions.assertEquals; // Nhập hàm so sánh kết quả mong đợi
import static org.junit.jupiter.api.Assertions.assertFalse; // Nhập hàm kiểm tra điều kiện sai
import static org.junit.jupiter.api.Assertions.assertNotNull; // Nhập hàm kiểm tra giá trị không phải null
import static org.junit.jupiter.api.Assertions.assertNull; // Nhập hàm kiểm tra giá trị null
import static org.junit.jupiter.api.Assertions.assertTrue; // Nhập hàm kiểm tra điều kiện đúng

class JdbcDaoTest { // Khai báo lớp kiểm thử JDBC, SachDAO và DocGiaDAO
    private final SachDAO sachDAO = new SachDAO(); // Tạo DAO sách dùng trong các bước kiểm thử
    private final DocGiaDAO docGiaDAO = new DocGiaDAO(); // Tạo DAO độc giả dùng trong các bước kiểm thử

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void ketNoiDuocMySQL() { // Tạo ca kiểm thử kết nối đến MySQL
        assertTrue(DatabaseConnection.kiemTraKetNoi()); // Xác nhận kết nối JDBC đang hoạt động
    } // Kết thúc ca kiểm thử kết nối

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void crudSachBangJdbc() { // Tạo ca kiểm thử CRUD sách bằng JDBC
        String hauTo = Long.toString(System.currentTimeMillis()); // Tạo hậu tố để mã thử không trùng dữ liệu đang có
        Sach sach = new Sach(null, "TEST_S_" + hauTo, "Sách kiểm thử JDBC " + hauTo, 1L, null, null, 2026, 1, "Tiếng Việt", "Dữ liệu tạm dùng để kiểm thử", new BigDecimal("1000"), 100, null, "DANG_LUU_HANH"); // Tạo sách thử gắn với danh mục mẫu có ID bằng một
        try { // Bắt đầu khối kiểm thử có dọn dữ liệu trong mọi trường hợp
            assertTrue(sachDAO.them(sach)); // Kiểm tra thao tác thêm sách thành công
            assertNotNull(sach.getId()); // Kiểm tra MySQL đã trả về ID tự tăng
            assertFalse(sachDAO.layTatCa().isEmpty()); // Kiểm tra chức năng xem danh sách sách đọc được dữ liệu
            Sach sachDaThem = sachDAO.timTheoId(sach.getId()); // Đọc lại sách vừa thêm theo ID
            assertNotNull(sachDaThem); // Kiểm tra tìm thấy sách vừa thêm
            assertEquals(sach.getMaSach(), sachDaThem.getMaSach()); // Kiểm tra mã sách được lưu đúng
            sach.setTenSach("Sách JDBC đã cập nhật " + hauTo); // Thay đổi tên sách để kiểm tra chức năng sửa
            assertTrue(sachDAO.capNhat(sach)); // Kiểm tra thao tác cập nhật thành công
            assertEquals(sach.getTenSach(), sachDAO.timTheoId(sach.getId()).getTenSach()); // Kiểm tra tên mới đã được lưu vào MySQL
            assertFalse(sachDAO.timTheoTen("JDBC đã cập nhật " + hauTo).isEmpty()); // Kiểm tra chức năng tìm kiếm theo tên trả về kết quả
            assertTrue(sachDAO.xoa(sach.getId())); // Xóa đúng bản ghi thử vừa tạo
            assertNull(sachDAO.timTheoId(sach.getId())); // Kiểm tra bản ghi thử không còn trong MySQL
            sach.setId(null); // Đánh dấu bản ghi đã được xóa để khối finally không xóa lại
        } finally { // Luôn chạy phần dọn dữ liệu dù một bước kiểm thử bị lỗi
            if (sach.getId() != null) { // Kiểm tra bản ghi thử đã được tạo nhưng chưa được xóa
                sachDAO.xoa(sach.getId()); // Chỉ xóa bản ghi thử do ca kiểm thử này tạo ra
            } // Kết thúc điều kiện dọn dữ liệu sách
        } // Kết thúc khối dọn dữ liệu
    } // Kết thúc ca kiểm thử CRUD sách

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void crudDocGiaBangJdbc() { // Tạo ca kiểm thử CRUD độc giả bằng JDBC
        String hauTo = Long.toString(System.currentTimeMillis()); // Tạo hậu tố để mã và email thử không trùng dữ liệu đang có
        DocGia docGia = new DocGia(null, null, "TESTDG" + hauTo.substring(hauTo.length() - 10), "Độc giả kiểm thử JDBC " + hauTo, LocalDate.of(2003, 1, 1), "KHAC", null, "test" + hauTo + "@example.com", "Địa chỉ kiểm thử", LocalDate.now(), "HOAT_DONG"); // Tạo độc giả thử không liên kết với tài khoản thật
        try { // Bắt đầu khối kiểm thử có dọn dữ liệu trong mọi trường hợp
            assertTrue(docGiaDAO.them(docGia)); // Kiểm tra thao tác thêm độc giả thành công
            assertNotNull(docGia.getId()); // Kiểm tra MySQL đã trả về ID tự tăng
            assertFalse(docGiaDAO.layTatCa().isEmpty()); // Kiểm tra chức năng xem danh sách độc giả đọc được dữ liệu
            DocGia docGiaDaThem = docGiaDAO.timTheoId(docGia.getId()); // Đọc lại độc giả vừa thêm theo ID
            assertNotNull(docGiaDaThem); // Kiểm tra tìm thấy độc giả vừa thêm
            assertEquals(docGia.getMaDocGia(), docGiaDaThem.getMaDocGia()); // Kiểm tra mã độc giả được lưu đúng
            docGia.setHoTen("Độc giả JDBC đã cập nhật " + hauTo); // Thay đổi họ tên để kiểm tra chức năng sửa
            assertTrue(docGiaDAO.capNhat(docGia)); // Kiểm tra thao tác cập nhật thành công
            assertEquals(docGia.getHoTen(), docGiaDAO.timTheoId(docGia.getId()).getHoTen()); // Kiểm tra họ tên mới đã được lưu vào MySQL
            assertFalse(docGiaDAO.timTheoTen("JDBC đã cập nhật " + hauTo).isEmpty()); // Kiểm tra chức năng tìm kiếm theo tên trả về kết quả
            assertTrue(docGiaDAO.xoa(docGia.getId())); // Xóa đúng bản ghi thử vừa tạo
            assertNull(docGiaDAO.timTheoId(docGia.getId())); // Kiểm tra bản ghi thử không còn trong MySQL
            docGia.setId(null); // Đánh dấu bản ghi đã được xóa để khối finally không xóa lại
        } finally { // Luôn chạy phần dọn dữ liệu dù một bước kiểm thử bị lỗi
            if (docGia.getId() != null) { // Kiểm tra bản ghi thử đã được tạo nhưng chưa được xóa
                docGiaDAO.xoa(docGia.getId()); // Chỉ xóa bản ghi thử do ca kiểm thử này tạo ra
            } // Kết thúc điều kiện dọn dữ liệu độc giả
        } // Kết thúc khối dọn dữ liệu
    } // Kết thúc ca kiểm thử CRUD độc giả
} // Kết thúc lớp JdbcDaoTest
