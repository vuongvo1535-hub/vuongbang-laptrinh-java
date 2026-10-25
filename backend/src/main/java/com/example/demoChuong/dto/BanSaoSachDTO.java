package com.example.demoChuong.dto;

import java.time.LocalDate;

public record BanSaoSachDTO(
        Long id,
        Long sachId,
        String maVach,
        String viTriKe,
        String tinhTrang,
        String trangThai,
        LocalDate ngayNhap
) {}
