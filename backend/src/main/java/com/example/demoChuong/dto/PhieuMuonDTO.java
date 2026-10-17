package com.example.demoChuong.dto;

import java.time.LocalDateTime;

public record PhieuMuonDTO(
        Long id,
        String maPhieu,
        Long docGiaId,
        Long nhanVienId,
        LocalDateTime ngayMuon,
        String ghiChu,
        String trangThai
) {}
