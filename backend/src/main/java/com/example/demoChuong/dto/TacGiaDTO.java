package com.example.demoChuong.dto;

import java.time.LocalDate;

public record TacGiaDTO(
        Long id,
        String tenTacGia,
        LocalDate ngaySinh,
        String quocTich,
        String tieuSu
) {
    public TacGiaDTO(Long id, String tenTacGia, String quocTich) {
        this(id, tenTacGia, null, quocTich, null);
    }
}
