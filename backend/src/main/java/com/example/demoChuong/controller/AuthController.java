package com.example.demoChuong.controller;

import com.example.demoChuong.dto.DangKyRequest;
import com.example.demoChuong.dto.DangNhapRequest;
import com.example.demoChuong.dto.DangNhapResponse;
import com.example.demoChuong.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    /** Đăng nhập hệ thống (admin / thuthu01 / docgia01) */
    @PostMapping("/login")
    public ResponseEntity<DangNhapResponse> dangNhap(@RequestBody DangNhapRequest req) {
        return ResponseEntity.ok(service.dangNhap(req));
    }

    /** Đăng ký tài khoản độc giả mới */
    @PostMapping("/register")
    public ResponseEntity<DangNhapResponse> dangKy(@RequestBody DangKyRequest req) {
        return ResponseEntity.ok(service.dangKy(req));
    }

    /** Lấy thông tin tài khoản hiện tại */
    @GetMapping("/me")
    public ResponseEntity<DangNhapResponse> layThongTinMe(@RequestParam Long taiKhoanId) {
        return ResponseEntity.ok(service.layThongTinMe(taiKhoanId));
    }

    /** Đăng xuất */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> dangXuat() {
        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }
}
