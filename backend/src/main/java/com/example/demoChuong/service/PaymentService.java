package com.example.demoChuong.service;

import com.example.demoChuong.dto.MoMoPaymentDTO;
import java.util.Map;

public interface PaymentService {
    MoMoPaymentDTO taoMaThanhToanMoMo(Long tienPhatId);
    Map<String, Object> xacNhanThanhToan(Long tienPhatId, String maGiaoDich);
}
