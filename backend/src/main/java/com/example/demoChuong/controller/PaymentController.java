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
}
