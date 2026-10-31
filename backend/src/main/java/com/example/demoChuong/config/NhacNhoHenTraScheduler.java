package com.example.demoChuong.config;

import com.example.demoChuong.service.PhieuMuonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Tác vụ chạy ngầm định kỳ (Cron Job):
 * Tự động kiểm tra các phiếu mượn sắp đến hạn (trong vòng 3 ngày) hoặc đã quá hạn
 * và gửi email nhắc nhở thân thiện tới độc giả vào lúc 8:00 sáng hàng ngày.
 */
@Component
public class NhacNhoHenTraScheduler {

    private static final Logger log = LoggerFactory.getLogger(NhacNhoHenTraScheduler.class);

    private final PhieuMuonService phieuMuonService;

    public NhacNhoHenTraScheduler(PhieuMuonService phieuMuonService) {
        this.phieuMuonService = phieuMuonService;
    }

    // Chạy tự động lúc 08:00 sáng mỗi ngày
    @Scheduled(cron = "0 0 8 * * ?")
    public void tuDongGuiEmailNhacNhoHangNgay() {
        log.info("[CRON JOB] Bắt đầu quét kiểm tra hạn trả sách để gửi email nhắc nhở độc giả...");
        try {
            Map<String, Object> ketQua = phieuMuonService.quetVaGuiEmailNhacNhoTatCa();
            log.info("[CRON JOB] Hoàn tất quét hạn trả sách: {}", ketQua.get("message"));
        } catch (Exception ex) {
            log.error("[CRON JOB] Lỗi khi thực hiện quét tự động gửi email nhắc nhở: {}", ex.getMessage());
        }
    }
}
