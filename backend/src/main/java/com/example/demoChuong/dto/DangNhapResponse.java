package com.example.demoChuong.dto;

public record DangNhapResponse(
        Long id,
        String tenDangNhap,
        String vaiTro,
        String token,
        Long docGiaId,
        String hoTen,
        String message
) {}
