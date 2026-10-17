package com.example.demoChuong.controller;

import com.example.demoChuong.dto.DocGiaDTO;
import com.example.demoChuong.service.DocGiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/docGia")
public class DocGiaController {

    private final DocGiaService service;

    public DocGiaController(DocGiaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<DocGiaDTO>> xemTatCa(@RequestParam(required = false) String tuKhoa) {
        if (tuKhoa == null || tuKhoa.isBlank()) {
            return ResponseEntity.ok(service.layTatCa());
        }
        return ResponseEntity.ok(service.timKiem(tuKhoa));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocGiaDTO> xemTheoId(@PathVariable Long id) {
        return ResponseEntity.ok(service.layTheoId(id));
    }

    @PostMapping
    public ResponseEntity<DocGiaDTO> them(@RequestBody DocGiaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.them(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocGiaDTO> sua(@PathVariable Long id, @RequestBody DocGiaDTO dto) {
        return ResponseEntity.ok(service.sua(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> xoa(@PathVariable Long id) {
        service.xoa(id);
        return ResponseEntity.ok(Map.of("message", "Xóa độc giả thành công"));
    }
}
