package com.example.demoChuong.view.controller; // Khai báo package chứa lớp điều khiển dành riêng cho giao diện Swing

import com.example.demoChuong.dao.DocGiaDAO; // Nhập lớp DAO độc giả đã hoàn thành trong tuần 2
import com.example.demoChuong.entity.DocGia; // Nhập lớp Model DocGia dùng để trao đổi dữ liệu

import java.util.List; // Nhập kiểu danh sách dùng để trả dữ liệu cho View

public class DocGiaViewController { // Khai báo lớp trung gian kết nối DocGiaView với DocGiaDAO
    private final DocGiaDAO docGiaDAO; // Lưu đối tượng DAO thực hiện CRUD độc giả

    public DocGiaViewController() { // Tạo hàm khởi tạo mặc định cho giao diện
        this(new DocGiaDAO()); // Sử dụng DocGiaDAO đã có của tuần 2
    } // Kết thúc hàm khởi tạo mặc định

    public DocGiaViewController(DocGiaDAO docGiaDAO) { // Tạo hàm khởi tạo cho phép truyền DAO khi kiểm thử
        this.docGiaDAO = docGiaDAO; // Lưu DAO để các phương thức bên dưới sử dụng
    } // Kết thúc hàm khởi tạo có tham số

    public List<DocGia> layTatCa() { // Tạo phương thức lấy toàn bộ độc giả cho JTable
        return docGiaDAO.layTatCa(); // Gọi DAO để đọc danh sách độc giả từ MySQL
    } // Kết thúc phương thức layTatCa

    public List<DocGia> timKiem(String tuKhoa) { // Tạo phương thức tìm độc giả theo họ tên
        return docGiaDAO.timTheoTen(tuKhoa); // Gọi DAO để tìm các độc giả có họ tên phù hợp
    } // Kết thúc phương thức timKiem

    public boolean them(DocGia docGia) { // Tạo phương thức thêm độc giả từ dữ liệu View gửi sang
        return docGiaDAO.them(docGia); // Gọi DAO để lưu độc giả mới vào MySQL
    } // Kết thúc phương thức them

    public boolean sua(DocGia docGia) { // Tạo phương thức sửa độc giả đã chọn
        return docGiaDAO.capNhat(docGia); // Gọi DAO để cập nhật độc giả trong MySQL
    } // Kết thúc phương thức sua

    public boolean xoa(Long id) { // Tạo phương thức xóa độc giả theo ID
        return docGiaDAO.xoa(id); // Gọi DAO để xóa đúng độc giả được chọn
    } // Kết thúc phương thức xoa
} // Kết thúc lớp DocGiaViewController
