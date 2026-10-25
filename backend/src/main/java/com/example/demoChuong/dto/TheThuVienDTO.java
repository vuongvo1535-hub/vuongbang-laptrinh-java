package com.example.demoChuong.dto;

import java.time.LocalDate;

public record TheThuVienDTO(
        Long id,
        Long docGiaId,
        String soThe,
        LocalDate ngayCap,
        LocalDate ngayHetHan,
        String trangThai
) {}
