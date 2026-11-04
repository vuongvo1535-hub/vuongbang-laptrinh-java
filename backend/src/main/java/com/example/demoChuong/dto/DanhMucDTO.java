package com.example.demoChuong.dto;

public record DanhMucDTO(
        Long id,
        String tenDanhMuc,
        String moTa,
        Long danhMucChaId,
        Long soLuongSach
) {
    public DanhMucDTO(Long id, String tenDanhMuc, String moTa, Long danhMucChaId) {
        this(id, tenDanhMuc, moTa, danhMucChaId, 0L);
    }
}
