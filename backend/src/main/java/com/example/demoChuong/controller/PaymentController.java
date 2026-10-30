package com.example.demoChuong.controller;

import com.example.demoChuong.dto.MoMoPaymentDTO;
import com.example.demoChuong.service.EmailService;
import com.example.demoChuong.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payment/momo")
public class PaymentController {

    private final PaymentService paymentService;
    private final EmailService emailService;

    public PaymentController(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }

    /** Tạo mã QR thanh toán MoMo cho khoản tiền phạt */
    @GetMapping("/{tienPhatId}")
    public ResponseEntity<MoMoPaymentDTO> taoMaThanhToan(@PathVariable Long tienPhatId) {
        return ResponseEntity.ok(paymentService.taoMaThanhToanMoMo(tienPhatId));
    }

    /** Tạo mã giao dịch MoMo giả lập phục vụ mục đích kiểm thử / demo */
    @GetMapping("/tao-ma-gia")
    public ResponseEntity<Map<String, String>> taoMaGiaoDichGia() {
        return ResponseEntity.ok(Map.of("maGiaoDich", paymentService.taoMaGiaoDichGia()));
    }

    /** Xác nhận giao dịch thanh toán thành công và kích hoạt gửi email thông báo qua Gmail */
    @PostMapping("/{tienPhatId}/xacNhan")
    public ResponseEntity<Map<String, Object>> xacNhanThanhToan(
            @PathVariable Long tienPhatId,
            @RequestParam(required = false) String maGiaoDich,
            @RequestParam(required = false) String emailNhan) {
        return ResponseEntity.ok(paymentService.xacNhanThanhToan(tienPhatId, maGiaoDich, emailNhan));
    }

    /** Kiểm tra gửi email trực tiếp qua Gmail SMTP */
    @PostMapping("/test-email")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestParam String toEmail) {
        return ResponseEntity.ok(emailService.guiEmailTest(toEmail));
    }

    /** Webhook tự động nhận thông báo biến động số dư MoMo / Ngân hàng (SePay, Casso,...) */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> webhookMoMo(@RequestBody(required = false) Map<String, Object> payload) {
        if (payload == null) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Empty payload"));
        }
        try {
            // Lấy nội dung chuyển khoản từ payload (SePay: content, Casso: description)
            String content = String.valueOf(payload.getOrDefault("content", payload.getOrDefault("description", "")));
            Long tienPhatId = 0L;

            // Xử lý thông minh các định dạng: NOP_PHAT_6, NOP PHAT 6, NOPPHAT6, PHAT 6
            String clean = content.toUpperCase().replaceAll("[_\\s]+", " ");
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?:NOP PHAT|NOPPHAT|PHAT)\\s*(\\d+)").matcher(clean);
            if (m.find()) {
                tienPhatId = Long.parseLong(m.group(1));
            } else if (content.contains("NOP_PHAT_")) {
                String idStr = content.substring(content.indexOf("NOP_PHAT_") + 9).replaceAll("[^0-9]", "");
                if (!idStr.isEmpty()) tienPhatId = Long.parseLong(idStr);
            }

            String transId = String.valueOf(payload.getOrDefault("referenceCode", payload.getOrDefault("transaction_id", "SEPAY_" + System.currentTimeMillis())));
            
            if (tienPhatId > 0) {
                paymentService.xacNhanThanhToan(tienPhatId, transId, null);
            }

            return ResponseEntity.ok(Map.of("success", true, "status", 200, "tienPhatId", tienPhatId));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
