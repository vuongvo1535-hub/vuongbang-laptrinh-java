package com.example.demoChuong.controller;

import com.example.demoChuong.dto.TienPhatDTO;
import com.example.demoChuong.service.TienPhatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping({"/api/tienPhat", "/api/tienphat"})
public class TienPhatController {

    private final TienPhatService service;

    public TienPhatController(TienPhatService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TienPhatDTO>> xemTatCa(@RequestParam(required = false) String trangThai) {
        return ResponseEntity.ok(service.layTatCa(trangThai));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TienPhatDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    /** Thanh toán tiền phạt (TIEN_MAT, CHUYEN_KHOAN, THE) */
    @PostMapping("/{id}/thanhToan")
    public ResponseEntity<TienPhatDTO> thanhToan(@PathVariable Long id, @RequestParam(defaultValue = "TIEN_MAT") String phuongThuc) {
        return ResponseEntity.ok(service.thanhToan(id, phuongThuc));
    }
}
