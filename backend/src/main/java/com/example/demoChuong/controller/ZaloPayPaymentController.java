package com.example.demoChuong.controller;

import com.example.demoChuong.dto.ZaloPayPaymentDTO;
import com.example.demoChuong.service.EmailService;
import com.example.demoChuong.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payment/zalopay")
public class ZaloPayPaymentController {

    private final PaymentService paymentService;
    private final EmailService emailService;

    public ZaloPayPaymentController(PaymentService paymentService, EmailService emailService) {
        this.paymentService = paymentService;
        this.emailService = emailService;
    }

    /** Tạo mã QR thanh toán ZaloPay (VietQR chuẩn Napas BIN 971101) cho khoản phạt */
    @GetMapping("/{tienPhatId}")
    public ResponseEntity<ZaloPayPaymentDTO> taoMaThanhToan(@PathVariable Long tienPhatId) {
        return ResponseEntity.ok(paymentService.taoMaThanhToanZaloPay(tienPhatId));
    }

    /** Tạo mã giao dịch ZaloPay giả lập phục vụ kiểm thử */
    @GetMapping("/tao-ma-gia")
    public ResponseEntity<Map<String, String>> taoMaGiaoDichGia() {
        return ResponseEntity.ok(Map.of("maGiaoDich", paymentService.taoMaGiaoDichGiaZaloPay()));
    }

    /** Xác nhận giao dịch ZaloPay thành công và kích hoạt gửi email thông báo qua Gmail */
    @PostMapping("/{tienPhatId}/xacNhan")
    public ResponseEntity<Map<String, Object>> xacNhanThanhToan(
            @PathVariable Long tienPhatId,
            @RequestParam(required = false) String maGiaoDich,
            @RequestParam(required = false) String emailNhan) {
        return ResponseEntity.ok(paymentService.xacNhanThanhToanZaloPay(tienPhatId, maGiaoDich, emailNhan));
    }

    /** Webhook tự động nhận thông báo biến động số dư ZaloPay (SePay, Casso,...) */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, Object>> webhookZaloPay(@RequestBody(required = false) Map<String, Object> payload) {
        if (payload == null) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Empty payload"));
        }
        try {
            String content = String.valueOf(payload.getOrDefault("content", payload.getOrDefault("description", "")));
            Long tienPhatId = 0L;

            String clean = content.toUpperCase().replaceAll("[_\\s]+", " ");
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(?:NOP PHAT|NOPPHAT|PHAT)\\s*(\\d+)").matcher(clean);
            if (m.find()) {
                tienPhatId = Long.parseLong(m.group(1));
            } else if (content.contains("NOP_PHAT_")) {
                String idStr = content.substring(content.indexOf("NOP_PHAT_") + 9).replaceAll("[^0-9]", "");
                if (!idStr.isEmpty()) tienPhatId = Long.parseLong(idStr);
            }

            String transId = String.valueOf(payload.getOrDefault("referenceCode", payload.getOrDefault("transaction_id", "ZALOPAY_" + System.currentTimeMillis())));

            if (tienPhatId > 0) {
                paymentService.xacNhanThanhToanZaloPay(tienPhatId, transId, null);
            }

            return ResponseEntity.ok(Map.of("success", true, "status", 200, "tienPhatId", tienPhatId));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
