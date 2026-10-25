package com.example.demoChuong.dto;

import java.util.List;

public record TaoPhieuMuonRequest(
        Long docGiaId,
        Long nhanVienId,
        String ghiChu,
        List<Long> banSaoSachIds,
        Integer soNgayMuon
) {}
