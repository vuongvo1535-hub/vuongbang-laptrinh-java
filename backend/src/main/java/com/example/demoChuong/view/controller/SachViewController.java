package com.example.demoChuong.view.controller; // Khai báo package chứa lớp điều khiển dành riêng cho giao diện Swing

import com.example.demoChuong.dao.SachDAO; // Nhập lớp DAO sách đã hoàn thành trong tuần 2
import com.example.demoChuong.entity.Sach; // Nhập lớp Model Sach dùng để trao đổi dữ liệu

import java.util.List; // Nhập kiểu danh sách dùng để trả dữ liệu cho View

public class SachViewController { // Khai báo lớp trung gian kết nối SachView với SachDAO
    private final SachDAO sachDAO; // Lưu đối tượng DAO thực hiện CRUD sách

    public SachViewController() { // Tạo hàm khởi tạo mặc định cho giao diện
        this(new SachDAO()); // Sử dụng SachDAO đã có của tuần 2
    } // Kết thúc hàm khởi tạo mặc định

    public SachViewController(SachDAO sachDAO) { // Tạo hàm khởi tạo cho phép truyền DAO khi kiểm thử
        this.sachDAO = sachDAO; // Lưu DAO để các phương thức bên dưới sử dụng
    } // Kết thúc hàm khởi tạo có tham số

    public List<Sach> layTatCa() { // Tạo phương thức lấy toàn bộ sách cho JTable
        return sachDAO.layTatCa(); // Gọi DAO để đọc danh sách sách từ MySQL
    } // Kết thúc phương thức layTatCa

    public List<Sach> timKiem(String tuKhoa) { // Tạo phương thức tìm sách theo tên
        return sachDAO.timTheoTen(tuKhoa); // Gọi DAO để tìm các sách có tên phù hợp
    } // Kết thúc phương thức timKiem

    public boolean them(Sach sach) { // Tạo phương thức thêm sách từ dữ liệu View gửi sang
        return sachDAO.them(sach); // Gọi DAO để lưu sách mới vào MySQL
    } // Kết thúc phương thức them

    public boolean sua(Sach sach) { // Tạo phương thức sửa sách đã chọn
        return sachDAO.capNhat(sach); // Gọi DAO để cập nhật sách trong MySQL
    } // Kết thúc phương thức sua

    public boolean xoa(Long id) { // Tạo phương thức xóa sách theo ID
        return sachDAO.xoa(id); // Gọi DAO để xóa đúng sách được chọn
    } // Kết thúc phương thức xoa
} // Kết thúc lớp SachViewController
