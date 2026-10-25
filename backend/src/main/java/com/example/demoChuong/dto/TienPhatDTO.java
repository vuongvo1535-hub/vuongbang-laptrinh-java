package com.example.demoChuong.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TienPhatDTO(
        Long id,
        Long chiTietPhieuMuonId,
        Long nhanVienId,
        String lyDo,
        BigDecimal soTien,
        LocalDateTime ngayLap,
        String trangThai,
        String ghiChu
) {}
