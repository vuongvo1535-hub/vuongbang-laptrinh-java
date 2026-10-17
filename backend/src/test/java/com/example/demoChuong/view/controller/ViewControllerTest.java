package com.example.demoChuong.view.controller; // Khai báo package chứa kiểm thử controller của giao diện Swing

import com.example.demoChuong.entity.DocGia; // Nhập lớp Model DocGia để tạo dữ liệu thử
import com.example.demoChuong.entity.Sach; // Nhập lớp Model Sach để tạo dữ liệu thử
import org.junit.jupiter.api.Test; // Nhập chú thích đánh dấu phương thức kiểm thử

import java.math.BigDecimal; // Nhập kiểu số dùng cho giá tiền sách
import java.time.LocalDate; // Nhập kiểu ngày dùng cho thông tin độc giả

import static org.junit.jupiter.api.Assertions.assertFalse; // Nhập hàm kiểm tra điều kiện sai
import static org.junit.jupiter.api.Assertions.assertNotNull; // Nhập hàm kiểm tra giá trị không phải null
import static org.junit.jupiter.api.Assertions.assertTrue; // Nhập hàm kiểm tra điều kiện đúng

class ViewControllerTest { // Khai báo lớp kiểm thử kết nối giữa View Controller và DAO
    private final SachViewController sachController = new SachViewController(); // Tạo controller sách giống đối tượng được SachView sử dụng
    private final DocGiaViewController docGiaController = new DocGiaViewController(); // Tạo controller độc giả giống đối tượng được DocGiaView sử dụng

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void crudSachQuaControllerCuaView() { // Tạo ca kiểm thử CRUD sách qua controller của giao diện
        String hauTo = Long.toString(System.currentTimeMillis()); // Tạo hậu tố để mã thử không trùng dữ liệu đang có
        Sach sach = new Sach(null, "TEST_VIEW_S_" + hauTo, "Sách View thử " + hauTo, 1L, null, null, 2026, 1, "Tiếng Việt", "Dữ liệu tạm của giao diện", new BigDecimal("1500"), 120, null, "DANG_LUU_HANH"); // Tạo sách thử gắn với danh mục mẫu có ID bằng một
        try { // Bắt đầu khối kiểm thử có dọn dữ liệu trong mọi trường hợp
            assertTrue(sachController.them(sach)); // Kiểm tra controller thêm được sách bằng DAO
            assertNotNull(sach.getId()); // Kiểm tra MySQL đã trả về ID tự tăng
            assertTrue(sachController.layTatCa().stream().anyMatch(item -> sach.getId().equals(item.getId()))); // Kiểm tra danh sách cho JTable chứa sách vừa thêm
            assertFalse(sachController.timKiem("Sách View thử " + hauTo).isEmpty()); // Kiểm tra chức năng tìm kiếm cho JTable trả về kết quả
            sach.setTenSach("Sách View đã sửa " + hauTo); // Thay đổi tên sách để kiểm tra nút Sửa
            assertTrue(sachController.sua(sach)); // Kiểm tra controller cập nhật được sách
            assertFalse(sachController.timKiem("View đã sửa " + hauTo).isEmpty()); // Kiểm tra tên mới có thể tìm thấy sau khi cập nhật
            assertTrue(sachController.xoa(sach.getId())); // Kiểm tra controller xóa đúng sách thử
            assertTrue(sachController.timKiem("View đã sửa " + hauTo).isEmpty()); // Kiểm tra sách thử không còn trong kết quả tìm kiếm
            sach.setId(null); // Đánh dấu dữ liệu thử đã được xóa
        } finally { // Luôn chạy phần dọn dữ liệu dù một bước kiểm thử bị lỗi
            if (sach.getId() != null) { // Kiểm tra bản ghi thử đã được tạo nhưng chưa được xóa
                sachController.xoa(sach.getId()); // Chỉ xóa bản ghi thử do ca kiểm thử này tạo ra
            } // Kết thúc điều kiện dọn dữ liệu sách
        } // Kết thúc khối dọn dữ liệu
    } // Kết thúc ca kiểm thử CRUD sách qua controller

    @Test // Đánh dấu đây là một ca kiểm thử JUnit
    void crudDocGiaQuaControllerCuaView() { // Tạo ca kiểm thử CRUD độc giả qua controller của giao diện
        String hauTo = Long.toString(System.currentTimeMillis()); // Tạo hậu tố để mã và email thử không trùng dữ liệu đang có
        DocGia docGia = new DocGia(null, null, "TESTVDG" + hauTo.substring(hauTo.length() - 9), "Độc giả View thử " + hauTo, LocalDate.of(2003, 2, 2), "KHAC", null, "view" + hauTo + "@example.com", "Địa chỉ thử", LocalDate.now(), "HOAT_DONG"); // Tạo độc giả thử không liên kết với tài khoản thật
        try { // Bắt đầu khối kiểm thử có dọn dữ liệu trong mọi trường hợp
            assertTrue(docGiaController.them(docGia)); // Kiểm tra controller thêm được độc giả bằng DAO
            assertNotNull(docGia.getId()); // Kiểm tra MySQL đã trả về ID tự tăng
            assertTrue(docGiaController.layTatCa().stream().anyMatch(item -> docGia.getId().equals(item.getId()))); // Kiểm tra danh sách cho JTable chứa độc giả vừa thêm
            assertFalse(docGiaController.timKiem("Độc giả View thử " + hauTo).isEmpty()); // Kiểm tra chức năng tìm kiếm cho JTable trả về kết quả
            docGia.setHoTen("Độc giả View đã sửa " + hauTo); // Thay đổi họ tên để kiểm tra nút Sửa
            assertTrue(docGiaController.sua(docGia)); // Kiểm tra controller cập nhật được độc giả
            assertFalse(docGiaController.timKiem("View đã sửa " + hauTo).isEmpty()); // Kiểm tra họ tên mới có thể tìm thấy sau khi cập nhật
            assertTrue(docGiaController.xoa(docGia.getId())); // Kiểm tra controller xóa đúng độc giả thử
            assertTrue(docGiaController.timKiem("View đã sửa " + hauTo).isEmpty()); // Kiểm tra độc giả thử không còn trong kết quả tìm kiếm
            docGia.setId(null); // Đánh dấu dữ liệu thử đã được xóa
        } finally { // Luôn chạy phần dọn dữ liệu dù một bước kiểm thử bị lỗi
            if (docGia.getId() != null) { // Kiểm tra bản ghi thử đã được tạo nhưng chưa được xóa
                docGiaController.xoa(docGia.getId()); // Chỉ xóa bản ghi thử do ca kiểm thử này tạo ra
            } // Kết thúc điều kiện dọn dữ liệu độc giả
        } // Kết thúc khối dọn dữ liệu
    } // Kết thúc ca kiểm thử CRUD độc giả qua controller
} // Kết thúc lớp ViewControllerTest
