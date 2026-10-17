package com.example.demoChuong.controller;

import com.example.demoChuong.dto.PhieuMuonDTO;
import com.example.demoChuong.service.PhieuMuonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/phieuMuon")
public class PhieuMuonController {

    private final PhieuMuonService service;

    public PhieuMuonController(PhieuMuonService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<PhieuMuonDTO>> xemTatCa(@RequestParam(required = false) Long docGiaId) {
        if (docGiaId == null) {
            return ResponseEntity.ok(service.layTatCa());
        }
        return ResponseEntity.ok(service.layTheoDocGia(docGiaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhieuMuonDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @PostMapping
    public ResponseEntity<PhieuMuonDTO> them(@RequestBody PhieuMuonDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhieuMuonDTO> sua(@PathVariable Long id, @RequestBody PhieuMuonDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa phiếu mượn thành công"));
    }
}
