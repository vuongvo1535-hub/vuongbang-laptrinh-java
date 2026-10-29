package com.example.demoChuong.controller;

import com.example.demoChuong.dto.TheThuVienDTO;
import com.example.demoChuong.service.TheThuVienService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/theThuVien")
public class TheThuVienController {

    private final TheThuVienService service;

    public TheThuVienController(TheThuVienService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TheThuVienDTO>> xemTatCa() {
        return ResponseEntity.ok(service.layTatCa());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TheThuVienDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @GetMapping("/docGia/{docGiaId}")
    public ResponseEntity<TheThuVienDTO> xemTheoDocGia(@PathVariable Long docGiaId) {
        return ResponseEntity.ok(service.layTheoDocGiaId(docGiaId));
    }

    @GetMapping("/soThe/{soThe}")
    public ResponseEntity<TheThuVienDTO> xemTheoSoThe(@PathVariable String soThe) {
        return ResponseEntity.ok(service.layTheoSoThe(soThe));
    }

    @PostMapping
    public ResponseEntity<TheThuVienDTO> capThe(@RequestBody TheThuVienDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.capThe(dto));
    }

    @PutMapping("/{id}/giaHan")
    public ResponseEntity<TheThuVienDTO> giaHan(@PathVariable Long id, @RequestParam(defaultValue = "12") int soThang) {
        return ResponseEntity.ok(service.giaHan(id, soThang));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa thẻ thư viện thành công"));
    }
}
