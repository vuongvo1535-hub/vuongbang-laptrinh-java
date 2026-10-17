package com.example.demoChuong.controller;

import com.example.demoChuong.dto.SachChiTietDTO;
import com.example.demoChuong.dto.SachDTO;
import com.example.demoChuong.service.SachChiTietService;
import com.example.demoChuong.service.SachService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/sach")
public class SachController {

    private final SachService service;
    private final SachChiTietService chiTietService;

    public SachController(SachService service, SachChiTietService chiTietService) {
        this.service = service;
        this.chiTietService = chiTietService;
    }

    @GetMapping
    public ResponseEntity<List<SachDTO>> xemTatCa(@RequestParam(required = false) String tuKhoa) {
        if (tuKhoa == null || tuKhoa.isBlank()) {
            return ResponseEntity.ok(service.layTatCa());
        }
        return ResponseEntity.ok(service.timKiem(tuKhoa));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SachDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    /** Tac gia, NXB, ten danh muc va so ban sao con tren ke cua mot sach. */
    @GetMapping("/{id}/chiTiet")
    public ResponseEntity<SachChiTietDTO> xemChiTiet(@PathVariable Long id) {
        return ResponseEntity.ok(chiTietService.layChiTiet(id));
    }

    @PostMapping
    public ResponseEntity<SachDTO> them(@RequestBody SachDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SachDTO> sua(@PathVariable Long id, @RequestBody SachDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa sách thành công"));
    }
}
