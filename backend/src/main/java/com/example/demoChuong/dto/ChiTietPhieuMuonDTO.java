package com.example.demoChuong.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ChiTietPhieuMuonDTO(
        Long id,
        Long phieuMuonId,
        Long banSaoSachId,
        String maVach,
        String tenSach,
        LocalDate ngayHenTra,
        LocalDateTime ngayTraThucTe,
        String tinhTrangLucMuon,
        String tinhTrangLucTra,
        String trangThai,
        String ghiChu
) {}
