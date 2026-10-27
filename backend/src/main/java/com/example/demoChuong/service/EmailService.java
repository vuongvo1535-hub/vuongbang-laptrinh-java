package com.example.demoChuong.service;

import java.math.BigDecimal;
import java.util.Map;

public interface EmailService {
    /**
     * Gửi email xác nhận thanh toán MoMo thành công cho người dùng
     */
    Map<String, Object> guiEmailThongBaoThanhToan(
            String emailNhan,
            String tenDocGia,
            String maGiaoDich,
            BigDecimal soTien,
            String noiDung,
            String lyDo,
            String tenSach
    );

    /**
     * Gửi email thử nghiệm cấu hình SMTP Gmail
     */
    Map<String, Object> guiEmailTest(String toEmail);
}
