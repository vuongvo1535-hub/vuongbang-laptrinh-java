package com.example.demoChuong.controller;

import com.example.demoChuong.dto.MoMoPaymentDTO;
import com.example.demoChuong.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payment/momo")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /** Tạo mã QR thanh toán MoMo cho khoản tiền phạt */
    @GetMapping("/{tienPhatId}")
    public ResponseEntity<MoMoPaymentDTO> taoMaThanhToan(@PathVariable Long tienPhatId) {
        return ResponseEntity.ok(paymentService.taoMaThanhToanMoMo(tienPhatId));
    }

    /** Xác nhận giao dịch thanh toán thành công (từ ứng dụng hoặc người dùng bấm xác nhận) */
    @PostMapping("/{tienPhatId}/xacNhan")
    public ResponseEntity<Map<String, Object>> xacNhanThanhToan(
            @PathVariable Long tienPhatId,
            @RequestParam(required = false) String maGiaoDich) {
        return ResponseEntity.ok(paymentService.xacNhanThanhToan(tienPhatId, maGiaoDich));
    }
}
