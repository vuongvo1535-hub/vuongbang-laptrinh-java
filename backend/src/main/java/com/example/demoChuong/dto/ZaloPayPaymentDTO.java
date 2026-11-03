package com.example.demoChuong.dto;

import java.math.BigDecimal;

public record ZaloPayPaymentDTO(
        Long tienPhatId,
        BigDecimal soTien,
        String noiDung,
        String qrUrl,
        String soTaiKhoanZaloPay,
        String tenNguoiNhan,
        String message
) {}
