package com.example.demoChuong.dto;

import java.time.LocalDate;

public record DocGiaDTO(
        Long id,
        Long taiKhoanId,
        String maDocGia,
        String hoTen,
        LocalDate ngaySinh,
        String gioiTinh,
        String soDienThoai,
        String email,
        String diaChi,
        LocalDate ngayDangKy,
        String trangThai
) {}
