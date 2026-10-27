package com.example.demoChuong.service;

import com.example.demoChuong.dto.MoMoPaymentDTO;
import java.util.Map;

public interface PaymentService {
    /**
     * Tạo mã thanh toán MoMo (kèm URL VietQR)
     */
    MoMoPaymentDTO taoMaThanhToanMoMo(Long tienPhatId);

    /**
     * Xác nhận thanh toán khoản phạt, lưu lịch sử và gửi email thông báo qua Gmail
     */
    Map<String, Object> xacNhanThanhToan(Long tienPhatId, String maGiaoDich, String emailNhan);

    /**
     * Tạo mã giao dịch MoMo giả lập cho mục đích demo / kiểm thử
     */
    String taoMaGiaoDichGia();
}
