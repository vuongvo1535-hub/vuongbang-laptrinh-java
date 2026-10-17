package com.example.demoChuong.dto;

import java.math.BigDecimal;

public record SachDTO(
        Long id,
        String maSach,
        String tenSach,
        Long danhMucId,
        Long nhaXuatBanId,
        String isbn,
        Integer namXuatBan,
        Integer lanTaiBan,
        String ngonNgu,
        String moTa,
        BigDecimal giaTien,
        Integer soTrang,
        String anhBia,
        String trangThai
) {}
