package com.example.demoChuong.dto;

import java.math.BigDecimal;

public record MoMoPaymentDTO(
        Long tienPhatId,
        BigDecimal soTien,
        String noiDung,
        String qrUrl,
        String soDienThoaiMoMo,
        String tenNguoiNhan,
        String message
) {}
