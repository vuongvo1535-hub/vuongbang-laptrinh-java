package com.example.demoChuong.service;

import java.math.BigDecimal;
import java.util.Map;

public interface EmailService {
    /**
     * Gửi email xác nhận thanh toán thành công (hỗ trợ ZaloPay, MoMo,...)
     */
    Map<String, Object> guiEmailThongBaoThanhToan(
            String emailNhan,
            String tenDocGia,
            String maGiaoDich,
            BigDecimal soTien,
            String noiDung,
            String lyDo,
            String tenSach,
            String phuongThuc
    );

    /**
     * Tương thích ngược: mặc định MoMo
     */
    default Map<String, Object> guiEmailThongBaoThanhToan(
            String emailNhan,
            String tenDocGia,
            String maGiaoDich,
            BigDecimal soTien,
            String noiDung,
            String lyDo,
            String tenSach
    ) {
        return guiEmailThongBaoThanhToan(emailNhan, tenDocGia, maGiaoDich, soTien, noiDung, lyDo, tenSach, "MOMO");
    }

    /**
     * Gửi email thử nghiệm cấu hình SMTP Gmail
     */
    Map<String, Object> guiEmailTest(String toEmail);

    /**
     * Gửi email nhắc nhở trả sách sắp hết hạn hoặc quá hạn
     */
    Map<String, Object> guiEmailNhacNhoTraSach(
            String emailNhan,
            String tenDocGia,
            String maPhieu,
            String danhSachSach,
            long soNgayConLai
    );
}
