package com.example.demoChuong.dto;

import java.util.List;

/** Thong tin bo sung cua mot dau sach: danh muc, NXB, tac gia va so ban sao con tren ke. */
public record SachChiTietDTO(
        Long sachId,
        String tenDanhMuc,
        String tenNhaXuatBan,
        List<TacGiaDTO> tacGia,
        long tongSoBan,
        long soBanSanSang
) {}
