package com.example.demoChuong.dao; // Khai báo package chứa lớp kiểm thử dữ liệu đầu vào

import com.example.demoChuong.entity.DocGia; // Nhập lớp Model DocGia để tạo dữ liệu không hợp lệ
import com.example.demoChuong.entity.Sach; // Nhập lớp Model Sach để tạo dữ liệu không hợp lệ
import org.junit.jupiter.api.Test; // Nhập chú thích đánh dấu phương thức kiểm thử

import static org.junit.jupiter.api.Assertions.assertThrows; // Nhập hàm kiểm tra ngoại lệ mong đợi

class DaoValidationTest { // Khai báo lớp kiểm thử không cần kết nối MySQL
    private final SachDAO sachDAO = new SachDAO(); // Tạo DAO sách để kiểm tra dữ liệu đầu vào
    private final DocGiaDAO docGiaDAO = new DocGiaDAO(); // Tạo DAO độc giả để kiểm tra dữ liệu đầu vào

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void khongChoThemSachNull() { // Tạo ca kiểm thử sách null bị từ chối
        assertThrows(IllegalArgumentException.class, () -> sachDAO.them(null)); // Xác nhận DAO báo lỗi trước khi mở kết nối
    } // Kết thúc ca kiểm thử sách null

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void khongChoThemSachThieuThongTinBatBuoc() { // Tạo ca kiểm thử sách thiếu mã tên và danh mục
        assertThrows(IllegalArgumentException.class, () -> sachDAO.them(new Sach())); // Xác nhận DAO từ chối sách thiếu thông tin bắt buộc
    } // Kết thúc ca kiểm thử sách thiếu thông tin

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void khongChoThemDocGiaThieuThongTinBatBuoc() { // Tạo ca kiểm thử độc giả thiếu mã họ tên và ngày đăng ký
        assertThrows(IllegalArgumentException.class, () -> docGiaDAO.them(new DocGia())); // Xác nhận DAO từ chối độc giả thiếu thông tin bắt buộc
    } // Kết thúc ca kiểm thử độc giả thiếu thông tin

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void khongChoTimKiemBangIdKhongHopLe() { // Tạo ca kiểm thử ID bằng không bị từ chối
        assertThrows(IllegalArgumentException.class, () -> sachDAO.timTheoId(0L)); // Xác nhận DAO sách từ chối ID không hợp lệ
        assertThrows(IllegalArgumentException.class, () -> docGiaDAO.timTheoId(0L)); // Xác nhận DAO độc giả từ chối ID không hợp lệ
    } // Kết thúc ca kiểm thử ID không hợp lệ
} // Kết thúc lớp DaoValidationTest
