package com.example.demoChuong.dto;

import java.time.LocalDateTime;

public record PhieuMuonDTO(
        Long id,
        String maPhieu,
        Long docGiaId,
        Long nhanVienId,
        LocalDateTime ngayMuon,
        String ghiChu,
        String trangThai,
        String tenDocGia
) {
    public PhieuMuonDTO(Long id, String maPhieu, Long docGiaId, Long nhanVienId, LocalDateTime ngayMuon, String ghiChu, String trangThai) {
        this(id, maPhieu, docGiaId, nhanVienId, ngayMuon, ghiChu, trangThai, null);
    }
}
