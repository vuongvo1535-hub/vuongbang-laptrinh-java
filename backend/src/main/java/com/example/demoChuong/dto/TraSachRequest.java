package com.example.demoChuong.dto;

import java.math.BigDecimal;

public record TraSachRequest(
        Long chiTietPhieuMuonId,
        String tinhTrangLucTra,
        String ghiChu,
        BigDecimal soTienPhat
) {}
